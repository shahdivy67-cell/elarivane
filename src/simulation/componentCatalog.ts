import { ComponentCategory, CircuitPin } from '../types/experiments';

export interface ComponentTemplate {
  typeId: string;
  name: string;
  category: ComponentCategory;
  description: string;
  pins: CircuitPin[];
  defaultProperties: Record<string, number | string | boolean>;
  color: string;
  renderType: 'cube' | 'cylinder' | 'ic-dip' | 'led-dome' | 'board' | 'meter' | 'source';
}

export const COMPONENT_CATALOG: ComponentTemplate[] = [
  // Passive
  {
    typeId: 'resistor',
    name: 'Resistor (Axial)',
    category: 'passive',
    description: 'Linear 2-terminal resistor with carbon-composition thermal modeling',
    color: '#d4a373',
    renderType: 'cylinder',
    pins: [
      { id: '1', name: 'Pin 1', relativePos: [-0.6, 0, 0], type: 'passive' },
      { id: '2', name: 'Pin 2', relativePos: [0.6, 0, 0], type: 'passive' },
    ],
    defaultProperties: {
      resistance: 1000, // Ohms
      tolerance: 5,     // %
      powerRating: 0.25,// Watts
      tempCoeff: 100,   // ppm/°C
    },
  },
  {
    typeId: 'potentiometer',
    name: 'Potentiometer (Rotary)',
    category: 'passive',
    description: '3-terminal variable resistor with adjustable wiper ratio',
    color: '#3b82f6',
    renderType: 'cylinder',
    pins: [
      { id: '1', name: 'Terminal 1', relativePos: [-0.4, -0.4, 0], type: 'passive' },
      { id: 'wiper', name: 'Wiper', relativePos: [0, -0.4, 0], type: 'passive' },
      { id: '3', name: 'Terminal 3', relativePos: [0.4, -0.4, 0], type: 'passive' },
    ],
    defaultProperties: {
      resistance: 10000,
      position: 0.5, // 0 to 1 wiper fraction
    },
  },
  {
    typeId: 'capacitor',
    name: 'Capacitor (Electrolytic)',
    category: 'passive',
    description: 'Energy storage element with dielectric breakdown & ESR modeling',
    color: '#10b981',
    renderType: 'cylinder',
    pins: [
      { id: '1', name: 'Anode (+)', relativePos: [-0.2, -0.5, 0], type: 'passive' },
      { id: '2', name: 'Cathode (-)', relativePos: [0.2, -0.5, 0], type: 'passive' },
    ],
    defaultProperties: {
      capacitance: 0.0001, // 100 uF
      voltageRating: 25,    // Volts
      esr: 0.1,             // Ohms
    },
  },
  {
    typeId: 'inductor',
    name: 'Inductor (Toroidal Coil)',
    category: 'passive',
    description: 'Magnetic flux storage with winding resistance and saturation limits',
    color: '#b45309',
    renderType: 'cylinder',
    pins: [
      { id: '1', name: 'Pin 1', relativePos: [-0.4, -0.4, 0], type: 'passive' },
      { id: '2', name: 'Pin 2', relativePos: [0.4, -0.4, 0], type: 'passive' },
    ],
    defaultProperties: {
      inductance: 0.01, // 10 mH
      windingResistance: 0.5,
    },
  },

  // Diodes & LEDs
  {
    typeId: 'diode',
    name: '1N4007 Rectifier Diode',
    category: 'diode-led',
    description: 'Standard PN junction silicon rectifier diode (Shockley model)',
    color: '#1f2937',
    renderType: 'cylinder',
    pins: [
      { id: 'anode', name: 'Anode (A)', relativePos: [-0.5, 0, 0], type: 'passive' },
      { id: 'cathode', name: 'Cathode (K)', relativePos: [0.5, 0, 0], type: 'passive' },
    ],
    defaultProperties: {
      forwardVoltage: 0.7,
      maxCurrentAmps: 1.0,
      reverseBreakdownV: 1000,
    },
  },
  {
    typeId: 'led',
    name: 'Diffuse 5mm LED',
    category: 'diode-led',
    description: 'Light Emitting Diode with photon emission calculated from forward current',
    color: '#ef4444',
    renderType: 'led-dome',
    pins: [
      { id: 'anode', name: 'Anode (+ long pin)', relativePos: [-0.2, -0.6, 0], type: 'passive' },
      { id: 'cathode', name: 'Cathode (- flat rim)', relativePos: [0.2, -0.6, 0], type: 'passive' },
    ],
    defaultProperties: {
      ledColor: 'red',
      forwardDropV: 1.8,
      maxCurrentMa: 30,
    },
  },

  // Active / Semiconductors
  {
    typeId: 'bjt-npn',
    name: '2N2222 NPN BJT',
    category: 'active-transistor',
    description: 'Bipolar Junction Transistor with cutoff, active, and saturation modes',
    color: '#475569',
    renderType: 'cylinder',
    pins: [
      { id: 'emitter', name: 'Emitter (E)', relativePos: [-0.3, -0.4, 0], type: 'passive' },
      { id: 'base', name: 'Base (B)', relativePos: [0, -0.4, 0], type: 'passive' },
      { id: 'collector', name: 'Collector (C)', relativePos: [0.3, -0.4, 0], type: 'passive' },
    ],
    defaultProperties: {
      beta: 150,
      vceSat: 0.2,
      maxIcAmps: 0.8,
    },
  },
  {
    typeId: 'op-amp',
    name: 'LM741 Operational Amplifier',
    category: 'active-transistor',
    description: 'Dual-supply high-gain differential amplifier with finite slew rate',
    color: '#1e293b',
    renderType: 'ic-dip',
    pins: [
      { id: 'inv', name: 'Inverting Input (-)', relativePos: [-0.5, 0.3, 0], type: 'in' },
      { id: 'noninv', name: 'Non-Inverting Input (+)', relativePos: [-0.5, -0.3, 0], type: 'in' },
      { id: 'out', name: 'Output', relativePos: [0.5, 0, 0], type: 'out' },
    ],
    defaultProperties: {
      openLoopGain: 200000,
      vSupplyPos: 12,
      vSupplyNeg: -12,
    },
  },

  // Power Sources
  {
    typeId: 'dc-source',
    name: 'Benchtop DC Power Supply',
    category: 'power-source',
    description: 'Precision regulated DC voltage source with current limiting',
    color: '#047857',
    renderType: 'source',
    pins: [
      { id: 'pos', name: 'Positive (+)', relativePos: [0.3, -0.4, 0], type: 'power' },
      { id: 'neg', name: 'Negative (-)', relativePos: [-0.3, -0.4, 0], type: 'ground' },
    ],
    defaultProperties: {
      voltage: 5.0,
      currentLimitAmps: 2.0,
    },
  },
  {
    typeId: 'ac-source',
    name: 'AC Function Generator',
    category: 'power-source',
    description: 'Arbitrary waveform synthesizer (Sine, Square, Triangle) with frequency tuning',
    color: '#0891b2',
    renderType: 'source',
    pins: [
      { id: 'pos', name: 'Signal (Live)', relativePos: [0.3, -0.4, 0], type: 'power' },
      { id: 'neg', name: 'Ground Ref', relativePos: [-0.3, -0.4, 0], type: 'ground' },
    ],
    defaultProperties: {
      voltage: 5.0, // Amplitude
      frequency: 50.0, // Hz
      waveform: 'sine',
      offset: 0,
    },
  },
  {
    typeId: 'ground',
    name: 'Earth Ground Node',
    category: 'accessories',
    description: 'Reference 0V potential node for Kirchhoff nodal calculations',
    color: '#15803d',
    renderType: 'cube',
    pins: [{ id: 'gnd', name: 'GND', relativePos: [0, 0, 0], type: 'ground' }],
    defaultProperties: {},
  },

  // Microcontrollers
  {
    typeId: 'arduino-uno',
    name: 'Arduino Uno R3 (ATmega328P)',
    category: 'microcontroller',
    description: '8-bit AVR development board with 14 digital I/O pins, 6 ADC channels & PWM',
    color: '#00878f',
    renderType: 'board',
    pins: [
      { id: '5V', name: '5V Power', relativePos: [-0.8, -0.5, 0], type: 'power' },
      { id: 'GND', name: 'GND', relativePos: [-0.6, -0.5, 0], type: 'ground' },
      { id: 'D13', name: 'Pin D13 (Builtin LED)', relativePos: [0.8, 0.5, 0], type: 'out' },
      { id: 'D9', name: 'Pin D9 (PWM)', relativePos: [0.4, 0.5, 0], type: 'out' },
      { id: 'A0', name: 'Analog In A0', relativePos: [-0.2, -0.5, 0], type: 'in' },
    ],
    defaultProperties: {
      firmwareProgram: 'blink',
      clockMhz: 16,
    },
  },

  // Instruments
  {
    typeId: 'multimeter',
    name: 'Digital Multimeter (DMM)',
    category: 'instrument',
    description: 'True-RMS voltage, current, and resistance measurement probe meter',
    color: '#eab308',
    renderType: 'meter',
    pins: [
      { id: 'red', name: 'Red Probe (+)', relativePos: [0.3, -0.4, 0], type: 'in' },
      { id: 'black', name: 'Black Probe (COM)', relativePos: [-0.3, -0.4, 0], type: 'in' },
    ],
    defaultProperties: {
      mode: 'voltage-dc', // 'voltage-dc', 'voltage-ac', 'current-dc', 'resistance'
    },
  },
  {
    typeId: 'oscilloscope',
    name: 'Dual-Channel Digital Oscilloscope',
    category: 'instrument',
    description: 'Real-time waveform visualizer with calibrated timebase and voltage scales',
    color: '#1e1b4b',
    renderType: 'meter',
    pins: [
      { id: 'ch1', name: 'CH1 Probe (+)', relativePos: [-0.3, -0.4, 0], type: 'in' },
      { id: 'ch1-gnd', name: 'CH1 Ground Clip', relativePos: [-0.1, -0.4, 0], type: 'ground' },
      { id: 'ch2', name: 'CH2 Probe (+)', relativePos: [0.1, -0.4, 0], type: 'in' },
      { id: 'ch2-gnd', name: 'CH2 Ground Clip', relativePos: [0.3, -0.4, 0], type: 'ground' },
    ],
    defaultProperties: {
      timebaseMs: 5,
      voltsPerDivCh1: 1.0,
      voltsPerDivCh2: 1.0,
    },
  },
];
