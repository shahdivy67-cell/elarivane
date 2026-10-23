export interface AlivoneApp {
  id: string;
  name: string;
  tagline: string;
  category: 'mindfulness' | 'productivity' | 'learning' | 'finance' | 'creative';
  url: string;
  intendedDomain: string;
  icon: string;
  badge?: string;
}

export const ALIVONE_ECOSYSTEM_APPS: AlivoneApp[] = [
  {
    id: 'alivone-hub',
    name: 'Alivone',
    tagline: 'The central hub for intentional living and mindful computing.',
    category: 'mindfulness',
    url: 'https://alivone.vercel.app',
    intendedDomain: 'alivone.vercel.app',
    icon: '✨',
    badge: 'Hub',
  },
  {
    id: 'alivane',
    name: 'Alivane',
    tagline: 'Replace mindless scrolling with real-world missions, creative play & curiosity.',
    category: 'mindfulness',
    url: 'https://alivane.vercel.app',
    intendedDomain: 'alivane.vercel.app',
    icon: '🌱',
    badge: 'Current App',
  },
  {
    id: 'alivexa',
    name: 'Alivexa',
    tagline: 'Intelligent schedule coordination and purposeful focus blocks.',
    category: 'productivity',
    url: 'https://alivexa.vercel.app',
    intendedDomain: 'alivexa.vercel.app',
    icon: '⚡',
  },
  {
    id: 'alivexa2',
    name: 'Alivexa 2',
    tagline: 'Advanced modular workflows and autonomous agent task management.',
    category: 'productivity',
    url: 'https://alivexa2.vercel.app',
    intendedDomain: 'alivexa2.vercel.app',
    icon: '🔄',
  },
  {
    id: 'alivfocus',
    name: 'Alivfocus',
    tagline: 'Neuro-attuned deep work audio environments and cognitive stillness.',
    category: 'mindfulness',
    url: 'https://alivfocus.vercel.app',
    intendedDomain: 'alivfocus.vercel.app',
    icon: '🧠',
  },
  {
    id: 'aliver',
    name: 'Aliver',
    tagline: 'Knowledge synthesis, reflective notes, and idea crystallization.',
    category: 'learning',
    url: 'https://aliver.vercel.app',
    intendedDomain: 'aliver.vercel.app',
    icon: '📖',
  },
  {
    id: 'alivora',
    name: 'Alivora',
    tagline: 'Conscious financial tracking and value-aligned budget clarity.',
    category: 'finance',
    url: 'https://alivora.vercel.app',
    intendedDomain: 'alivora.vercel.app',
    icon: '🌿',
  },
  {
    id: 'alivtra',
    name: 'Alivtra',
    tagline: 'Generative design, harmonic palettes, and visual contemplation.',
    category: 'creative',
    url: 'https://alivtra.vercel.app',
    intendedDomain: 'alivtra.vercel.app',
    icon: '🎨',
  },
  {
    id: 'alivorts',
    name: 'Alivorts',
    tagline: 'Daily movement, somatic reset timers, and physical wellness.',
    category: 'mindfulness',
    url: 'https://alivorts.vercel.app',
    intendedDomain: 'alivorts.vercel.app',
    icon: '🏃',
  },
  {
    id: 'alivets',
    name: 'Alivets',
    tagline: 'Ethical marketplace and thoughtful community exchanges.',
    category: 'learning',
    url: 'https://alivets.vercel.app',
    intendedDomain: 'alivets.vercel.app',
    icon: '🌐',
  },
  {
    id: 'alivel-z',
    name: 'Alivel-Z',
    tagline: 'Next-generation cognitive modeling and personalized insights.',
    category: 'productivity',
    url: 'https://alivel-z.vercel.app',
    intendedDomain: 'alivel-z.vercel.app',
    icon: '💎',
  },
];
