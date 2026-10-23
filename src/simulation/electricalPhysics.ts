import { WireMaterial } from '../types/experiments';

/**
 * Resistivity (ohm * m at 20°C) and Temperature Coefficient alpha (/°C)
 */
export const MATERIAL_PROPERTIES: Record<
  WireMaterial,
  { resistivity: number; alpha: number; name: string }
> = {
  copper: { resistivity: 1.68e-8, alpha: 0.00386, name: 'Copper (Cu)' },
  aluminium: { resistivity: 2.65e-8, alpha: 0.00429, name: 'Aluminium (Al)' },
  silver: { resistivity: 1.59e-8, alpha: 0.0038, name: 'Silver (Ag)' },
  gold: { resistivity: 2.44e-8, alpha: 0.0034, name: 'Gold (Au)' },
  nichrome: { resistivity: 1.1e-6, alpha: 0.0004, name: 'Nichrome (NiCr)' },
};

/**
 * Calculates exact physical electrical resistance of a wire:
 * R = (rho * L / A) * (1 + alpha * (T - 20))
 */
export function calculateWireResistance(
  material: WireMaterial,
  lengthMeters: number,
  crossSectionMm2: number,
  temperatureC: number = 25
): number {
  const prop = MATERIAL_PROPERTIES[material] || MATERIAL_PROPERTIES.copper;
  const areaM2 = Math.max(1e-12, crossSectionMm2 * 1e-6);
  const baseR = (prop.resistivity * Math.max(0.001, lengthMeters)) / areaM2;
  const tempCorrection = 1 + prop.alpha * (temperatureC - 20);
  return Math.max(1e-6, baseR * Math.max(0.1, tempCorrection));
}

/**
 * Shockley diode equation model:
 * I = Is * (exp(Vd / (n * Vt)) - 1)
 */
export function calculateDiodeCurrent(
  Vd: number,
  Is: number = 1e-14, // Saturation current in A
  n: number = 1.3,     // Ideality factor
  tempC: number = 25
): { current: number; conductance: number } {
  const q = 1.602176634e-19;
  const k = 1.380649e-23;
  const T = 273.15 + tempC;
  const Vt = (k * T) / q; // ~25.8 mV at 25C

  // Clamp Vd to prevent floating point overflow in exponential
  const maxVd = 2.5;
  const clampedVd = Math.min(maxVd, Vd);

  if (clampedVd < -5 * Vt) {
    // Reverse bias
    return { current: -Is, conductance: 1e-9 };
  }

  const expTerm = Math.exp(clampedVd / (n * Vt));
  const current = Is * (expTerm - 1);
  const conductance = (Is / (n * Vt)) * expTerm;

  return {
    current,
    conductance: Math.max(1e-9, conductance),
  };
}

/**
 * BJT Ebers-Moll / Active region current model
 * Ic = beta * Ib, Vbe ~ 0.7V in forward active
 */
export function calculateBjtActiveCurrent(
  type: 'npn' | 'pnp',
  Vb: number,
  Vc: number,
  Ve: number,
  beta: number = 100,
  tempC: number = 25
): { Ic: number; Ib: number; Ie: number; region: 'cutoff' | 'active' | 'saturation' } {
  const isNpn = type === 'npn';
  const Vbe = isNpn ? Vb - Ve : Ve - Vb;
  const Vce = isNpn ? Vc - Ve : Ve - Vc;

  const VbeOn = 0.68 + (tempC - 25) * -0.002; // -2mV/°C temp coefficient
  const VceSat = 0.2;

  if (Vbe < 0.5) {
    return { Ic: 0, Ib: 0, Ie: 0, region: 'cutoff' };
  }

  if (Vce < VceSat) {
    // Saturated
    const Ib = Math.max(0, (Vbe - VbeOn) / 500);
    const Ic = Math.max(0, (Vce / VceSat) * (beta * Ib * 0.5));
    return { Ic, Ib, Ie: Ic + Ib, region: 'saturation' };
  }

  // Forward Active
  const Ib = Math.max(0, (Vbe - VbeOn) / 1000);
  const Ic = beta * Ib;
  return { Ic, Ib, Ie: Ic + Ib, region: 'active' };
}
