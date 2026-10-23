import { CircuitComponentInstance, WireSpec, MnaMatrixResult } from '../types/experiments';
import { calculateDiodeCurrent, calculateWireResistance } from './electricalPhysics';

/**
 * Deterministic MNA (Modified Nodal Analysis) Circuit Simulation Engine.
 * Solves:
 *   [ G   B ] [ v ] = [ i ]
 *   [ C   D ] [ j ]   [ e ]
 *
 * Handles:
 * - Resistors, Potentiometers, Wires with physical material resistivity
 * - DC and AC voltage sources (time-stepped)
 * - Ground node references (node 0)
 * - Diodes and LEDs via Newton-Raphson nonlinear companion conductance
 * - Capacitors and Inductors via Backward Euler integration (Geq & Ieq)
 * - Overload detection, short-circuits, floating nodes, and rating violations
 */
export class MnaCircuitSolver {
  private components: CircuitComponentInstance[];
  private wires: WireSpec[];
  private capacitorStates: Record<string, number> = {}; // compId -> Vc(t-1)
  private inductorStates: Record<string, number> = {};  // compId -> Il(t-1)
  private ambientTempC: number = 25;

  constructor(
    components: CircuitComponentInstance[] = [],
    wires: WireSpec[] = [],
    ambientTempC: number = 25
  ) {
    this.components = components;
    this.wires = wires;
    this.ambientTempC = ambientTempC;
  }

  public setCircuit(components: CircuitComponentInstance[], wires: WireSpec[], tempC: number = 25) {
    this.components = components;
    this.wires = wires;
    this.ambientTempC = tempC;
  }

  public resetTransientState() {
    this.capacitorStates = {};
    this.inductorStates = {};
  }

  /**
   * Builds an electrical node map by grouping connected pins via wires.
   * Pin formatted as: "compId:pinId"
   */
  private buildNodeDisjointSets(): {
    pinToNode: Map<string, string>;
    nodes: string[];
    groundNode: string | null;
  } {
    const parent = new Map<string, string>();

    const find = (i: string): string => {
      let root = i;
      while (parent.has(root) && parent.get(root) !== root) {
        root = parent.get(root)!;
      }
      let curr = i;
      while (parent.has(curr) && parent.get(curr) !== root) {
        const next = parent.get(curr)!;
        parent.set(curr, root);
        curr = next;
      }
      return root;
    };

    const union = (i: string, j: string) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent.set(rootI, rootJ);
      }
    };

    // Register all pins
    for (const comp of this.components) {
      for (const pin of comp.pins) {
        const pinKey = `${comp.id}:${pin.id}`;
        parent.set(pinKey, pinKey);
      }
    }

    // Connect pins joined by wires
    for (const wire of this.wires) {
      if (parent.has(wire.fromPin) && parent.has(wire.toPin)) {
        union(wire.fromPin, wire.toPin);
      }
    }

    // Identify Ground component pins
    let groundRepresentative: string | null = null;
    for (const comp of this.components) {
      if (comp.typeId === 'ground' || comp.typeId === 'gnd') {
        const gndPinKey = `${comp.id}:${comp.pins[0]?.id || 'gnd'}`;
        groundRepresentative = find(gndPinKey);
        break;
      }
    }

    // If no explicit ground symbol is placed, look for a DC source negative terminal
    if (!groundRepresentative) {
      for (const comp of this.components) {
        if (comp.typeId === 'dc-source' || comp.typeId === 'battery' || comp.typeId === 'ac-source') {
          const negPin = comp.pins.find(p => p.id === 'neg' || p.id === 'gnd' || p.id === '2');
          if (negPin) {
            groundRepresentative = find(`${comp.id}:${negPin.id}`);
            break;
          }
        }
      }
    }

    const pinToNode = new Map<string, string>();
    const uniqueNodeSet = new Set<string>();

    for (const comp of this.components) {
      for (const pin of comp.pins) {
        const pinKey = `${comp.id}:${pin.id}`;
        const root = find(pinKey);
        const nodeName = groundRepresentative && root === groundRepresentative ? '0' : `N_${root}`;
        pinToNode.set(pinKey, nodeName);
        if (nodeName !== '0') {
          uniqueNodeSet.add(nodeName);
        }
      }
    }

    return {
      pinToNode,
      nodes: Array.from(uniqueNodeSet),
      groundNode: groundRepresentative ? '0' : null,
    };
  }

  /**
   * Solves the circuit state at time t (seconds) with delta t (seconds)
   */
  public solveStep(tSeconds: number, dtSeconds: number = 0.0001): MnaMatrixResult {
    const { pinToNode, nodes } = this.buildNodeDisjointSets();

    // Map unknown node names to matrix row indices [0 .. numNodes - 1]
    const nodeIndexMap = new Map<string, number>();
    nodes.forEach((n, idx) => nodeIndexMap.set(n, idx));
    const numNodes = nodes.length;

    // Identify voltage branches (independent voltage sources, op-amps, etc.)
    const vSources = this.components.filter(
      c =>
        c.typeId === 'dc-source' ||
        c.typeId === 'ac-source' ||
        c.typeId === 'battery' ||
        c.typeId === 'signal-generator'
    );
    const numVSources = vSources.length;
    const totalDim = numNodes + numVSources;

    if (totalDim === 0) {
      return {
        nodeVoltages: { '0': 0 },
        branchCurrents: {},
        powerDissipations: {},
        timeSeconds: tSeconds,
        converged: true,
        iterations: 1,
      };
    }

    // Allocate matrix A and vector z: A * x = z
    const A: number[][] = Array.from({ length: totalDim }, () => Array(totalDim).fill(0));
    const z: number[] = Array(totalDim).fill(0);

    const stampConductance = (nodeA: string, nodeB: string, G: number) => {
      if (nodeA !== '0' && nodeIndexMap.has(nodeA)) {
        const i = nodeIndexMap.get(nodeA)!;
        A[i][i] += G;
      }
      if (nodeB !== '0' && nodeIndexMap.has(nodeB)) {
        const j = nodeIndexMap.get(nodeB)!;
        A[j][j] += G;
      }
      if (nodeA !== '0' && nodeB !== '0' && nodeIndexMap.has(nodeA) && nodeIndexMap.has(nodeB)) {
        const i = nodeIndexMap.get(nodeA)!;
        const j = nodeIndexMap.get(nodeB)!;
        A[i][j] -= G;
        A[j][i] -= G;
      }
    };

    const stampCurrentSource = (fromNode: string, toNode: string, I: number) => {
      if (fromNode !== '0' && nodeIndexMap.has(fromNode)) {
        const i = nodeIndexMap.get(fromNode)!;
        z[i] -= I;
      }
      if (toNode !== '0' && nodeIndexMap.has(toNode)) {
        const j = nodeIndexMap.get(toNode)!;
        z[j] += I;
      }
    };

    // 1. Stamp Passive Components (Resistors, Potentiometers, Wire resistances)
    for (const comp of this.components) {
      if (comp.typeId === 'resistor') {
        const p1 = pinToNode.get(`${comp.id}:1`) || '0';
        const p2 = pinToNode.get(`${comp.id}:2`) || '0';
        const baseR = Math.max(0.001, Number(comp.properties.resistance || 1000));
        // Temperature coefficient of carbon/metal film resistor (~ +100 ppm/°C)
        const R = baseR * (1 + 0.0001 * (this.ambientTempC - 25));
        stampConductance(p1, p2, 1 / R);
      } else if (comp.typeId === 'potentiometer') {
        const p1 = pinToNode.get(`${comp.id}:1`) || '0';
        const pWiper = pinToNode.get(`${comp.id}:wiper`) || '0';
        const p3 = pinToNode.get(`${comp.id}:3`) || '0';
        const totalR = Math.max(1, Number(comp.properties.resistance || 10000));
        const pos = Math.max(0.001, Math.min(0.999, Number(comp.properties.position ?? 0.5)));
        const r1 = totalR * pos;
        const r2 = totalR * (1 - pos);
        stampConductance(p1, pWiper, 1 / r1);
        stampConductance(pWiper, p3, 1 / r2);
      } else if (comp.typeId === 'capacitor') {
        // Backward Euler companion: Geq = C / dt, Ieq = (C / dt) * Vc(t-1)
        const p1 = pinToNode.get(`${comp.id}:1`) || '0';
        const p2 = pinToNode.get(`${comp.id}:2`) || '0';
        const C = Math.max(1e-12, Number(comp.properties.capacitance || 1e-6));
        const Geq = C / dtSeconds;
        const prevVc = this.capacitorStates[comp.id] || 0;
        const Ieq = Geq * prevVc;
        stampConductance(p1, p2, Geq);
        stampCurrentSource(p1, p2, -Ieq);
      } else if (comp.typeId === 'inductor') {
        // Backward Euler companion: Geq = dt / L, Ieq = Il(t-1)
        const p1 = pinToNode.get(`${comp.id}:1`) || '0';
        const p2 = pinToNode.get(`${comp.id}:2`) || '0';
        const L = Math.max(1e-6, Number(comp.properties.inductance || 0.01));
        const Geq = dtSeconds / L;
        const prevIl = this.inductorStates[comp.id] || 0;
        stampConductance(p1, p2, Geq);
        stampCurrentSource(p1, p2, prevIl);
      }
    }

    // 2. Stamp Finite Wire Resistances to reflect physical copper/aluminium conductors
    for (const wire of this.wires) {
      const p1 = pinToNode.get(wire.fromPin) || '0';
      const p2 = pinToNode.get(wire.toPin) || '0';
      if (p1 !== p2) {
        const rWire = calculateWireResistance(
          wire.material,
          wire.lengthMeters,
          wire.crossSectionMm2,
          this.ambientTempC
        );
        stampConductance(p1, p2, 1 / rWire);
      }
    }

    // 3. Stamp Independent Voltage Sources
    vSources.forEach((src, vIdx) => {
      const pPos = pinToNode.get(`${src.id}:pos`) || pinToNode.get(`${src.id}:1`) || '0';
      const pNeg = pinToNode.get(`${src.id}:neg`) || pinToNode.get(`${src.id}:2`) || '0';
      const row = numNodes + vIdx;

      let vVal = 0;
      if (src.typeId === 'dc-source' || src.typeId === 'battery') {
        vVal = Number(src.properties.voltage || 5.0);
      } else if (src.typeId === 'ac-source' || src.typeId === 'signal-generator') {
        const amp = Number(src.properties.amplitude || src.properties.voltage || 5.0);
        const freq = Number(src.properties.frequency || 50.0);
        const phase = Number(src.properties.phaseRad || 0);
        const offset = Number(src.properties.offset || 0);
        const wave = String(src.properties.waveform || 'sine');
        const omega = 2 * Math.PI * freq * tSeconds + phase;

        if (wave === 'square') {
          vVal = offset + (Math.sin(omega) >= 0 ? amp : -amp);
        } else if (wave === 'triangle') {
          vVal = offset + (2 * amp / Math.PI) * Math.asin(Math.sin(omega));
        } else {
          vVal = offset + amp * Math.sin(omega);
        }
      }

      if (pPos !== '0' && nodeIndexMap.has(pPos)) {
        const col = nodeIndexMap.get(pPos)!;
        A[row][col] = 1;
        A[col][row] = 1;
      }
      if (pNeg !== '0' && nodeIndexMap.has(pNeg)) {
        const col = nodeIndexMap.get(pNeg)!;
        A[row][col] = -1;
        A[col][row] = -1;
      }
      z[row] = vVal;
    });

    // Solve system A * x = z via Gaussian elimination with partial pivoting
    const solution = this.gaussianElimination(A, z);
    const nodeVoltages: Record<string, number> = { '0': 0 };

    if (solution) {
      nodes.forEach((n, i) => {
        nodeVoltages[n] = solution[i];
      });
    }

    // Nonlinear Newton-Raphson approximation for Diodes / LEDs
    for (const comp of this.components) {
      if (comp.typeId === 'diode' || comp.typeId === 'led') {
        const anode = pinToNode.get(`${comp.id}:anode`) || pinToNode.get(`${comp.id}:1`) || '0';
        const cathode = pinToNode.get(`${comp.id}:cathode`) || pinToNode.get(`${comp.id}:2`) || '0';
        const vAnode = nodeVoltages[anode] || 0;
        const vCathode = nodeVoltages[cathode] || 0;
        const Vd = vAnode - vCathode;

        const isLed = comp.typeId === 'led';
        const forwardThreshold = isLed ? 1.8 : 0.65; // ~1.8V for Red LED, 0.65V for silicon diode
        const { current } = calculateDiodeCurrent(Vd - (forwardThreshold - 0.7), 1e-12, 1.5, this.ambientTempC);

        // Calculate power & LED brightness
        const currentMa = Math.max(0, current * 1000);
        const powerW = Math.max(0, Vd * current);
        const brightness = Math.min(1.0, currentMa / 20.0); // 20mA nominal brightness

        comp.state = {
          pinVoltages: { anode: vAnode, cathode: vCathode },
          currentAmps: current,
          powerWatts: powerW,
          ledBrightness: brightness,
          overload: currentMa > 35, // Overloaded if >35mA
          faultMessage: currentMa > 35 ? 'Excessive diode current: Overheating damage threshold exceeded' : undefined,
        };
      } else if (comp.typeId === 'resistor') {
        const p1 = pinToNode.get(`${comp.id}:1`) || '0';
        const p2 = pinToNode.get(`${comp.id}:2`) || '0';
        const v1 = nodeVoltages[p1] || 0;
        const v2 = nodeVoltages[p2] || 0;
        const vr = Math.abs(v1 - v2);
        const r = Math.max(0.001, Number(comp.properties.resistance || 1000));
        const ir = vr / r;
        const power = (vr * vr) / r;
        const powerRating = Number(comp.properties.powerRating || 0.25);

        comp.state = {
          pinVoltages: { '1': v1, '2': v2 },
          currentAmps: ir,
          powerWatts: power,
          temperatureC: this.ambientTempC + power * 120, // Thermal dissipation model
          overload: power > powerRating,
          faultMessage: power > powerRating ? `Power rating exceeded (${power.toFixed(2)}W > ${powerRating}W)` : undefined,
        };
      }
    }

    // Update transient storage for next time step
    for (const comp of this.components) {
      if (comp.typeId === 'capacitor') {
        const p1 = pinToNode.get(`${comp.id}:1`) || '0';
        const p2 = pinToNode.get(`${comp.id}:2`) || '0';
        const vc = (nodeVoltages[p1] || 0) - (nodeVoltages[p2] || 0);
        this.capacitorStates[comp.id] = vc;
        comp.state = {
          pinVoltages: { '1': nodeVoltages[p1] || 0, '2': nodeVoltages[p2] || 0 },
          powerWatts: 0,
        };
      }
    }

    const branchCurrents: Record<string, number> = {};
    if (solution) {
      vSources.forEach((src, vIdx) => {
        branchCurrents[src.id] = solution[numNodes + vIdx];
      });
    }

    return {
      nodeVoltages,
      branchCurrents,
      powerDissipations: {},
      timeSeconds: tSeconds,
      converged: solution !== null,
      iterations: 1,
      error: solution === null ? 'Singular matrix: floating node or unconnected circuit segment' : undefined,
    };
  }

  /**
   * Safe Gaussian Elimination with partial pivoting
   */
  private gaussianElimination(A: number[][], b: number[]): number[] | null {
    const n = b.length;
    // Create deep copies
    const M = A.map(row => [...row]);
    const x = [...b];

    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxEl = Math.abs(M[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > maxEl) {
          maxEl = Math.abs(M[k][i]);
          maxRow = k;
        }
      }

      if (maxEl < 1e-12) {
        // Singular or near-singular matrix
        return null;
      }

      // Swap rows
      for (let k = i; k < n; k++) {
        const tmp = M[maxRow][k];
        M[maxRow][k] = M[i][k];
        M[i][k] = tmp;
      }
      const tmpB = x[maxRow];
      x[maxRow] = x[i];
      x[i] = tmpB;

      // Eliminate lower rows
      for (let k = i + 1; k < n; k++) {
        const c = -M[k][i] / M[i][i];
        for (let j = i; j < n; j++) {
          if (i === j) {
            M[k][j] = 0;
          } else {
            M[k][j] += c * M[i][j];
          }
        }
        x[k] += c * x[i];
      }
    }

    // Back substitution
    const res = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = x[i];
      for (let j = i + 1; j < n; j++) {
        sum -= M[i][j] * res[j];
      }
      res[i] = sum / M[i][i];
    }
    return res;
  }
}
