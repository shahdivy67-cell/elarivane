export type WireMaterial = 'copper' | 'aluminium' | 'silver' | 'gold' | 'nichrome';

export interface WireSpec {
  id: string;
  fromPin: string; // "compId:pinId"
  toPin: string;   // "compId:pinId"
  material: WireMaterial;
  lengthMeters: number;
  crossSectionMm2: number;
  temperatureC: number;
  resistanceOhms: number; // calculated from resistivity * L / A * (1 + alpha * dT)
  color: string;
}

export interface CircuitPin {
  id: string;
  name: string;
  relativePos: [number, number, number]; // 3D coordinates relative to component origin
  type: 'in' | 'out' | 'passive' | 'power' | 'ground';
}

export type ComponentCategory =
  | 'passive'
  | 'diode-led'
  | 'active-transistor'
  | 'digital-ic'
  | 'sensor'
  | 'microcontroller'
  | 'power-source'
  | 'power-electronics'
  | 'accessories'
  | 'instrument';

export interface CircuitComponentInstance {
  id: string;
  name: string;
  typeId: string;
  category: ComponentCategory;
  position: [number, number, number];
  rotation: [number, number, number]; // pitch, yaw, roll in radians
  pins: CircuitPin[];
  properties: Record<string, number | string | boolean>;
  // Calculated state from MNA solver
  state?: {
    pinVoltages?: Record<string, number>;
    currentAmps?: number;
    powerWatts?: number;
    temperatureC?: number;
    ledBrightness?: number; // 0 to 1
    overload?: boolean;
    faultMessage?: string;
  };
}

export interface MnaMatrixResult {
  nodeVoltages: Record<string, number>; // nodeName -> voltage in Volts
  branchCurrents: Record<string, number>; // branchName -> current in Amperes
  powerDissipations: Record<string, number>; // compId -> watts
  timeSeconds: number;
  converged: boolean;
  iterations: number;
  error?: string;
}

export interface SimulationSample {
  timeMs: number;
  vSource: number;
  vOut: number;
  currentMa: number;
  frequencyHz?: number;
  digitalStates?: Record<string, 0 | 1>;
}

export type LabType =
  | 'ec-lab'
  | 'physics-lab'
  | 'chemistry-lab'
  | 'mechanical-lab'
  | 'robotics-lab'
  | 'optics-lab'
  | 'astronomy-lab'
  | 'acoustics-lab';

export interface LabDefinition {
  id: LabType;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  badge: string;
  iconName: string;
}
