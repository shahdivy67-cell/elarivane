export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'presence' | 'craft' | 'curiosity' | 'fellowship';
}

export const BADGES_LIST: Badge[] = [
  {
    id: 'badge_first_step',
    name: 'First Light',
    description: 'Completed your very first offline real-world mission.',
    icon: '🌱',
    unlockedAt: '2026-09-12',
    category: 'presence'
  },
  {
    id: 'badge_tea_master',
    name: 'Quiet Kettle',
    description: 'Took unhurried pauses to brew and breathe without a screen.',
    icon: '🍵',
    unlockedAt: '2026-09-18',
    category: 'presence'
  },
  {
    id: 'badge_micro_painter',
    name: 'Tricolor Painter',
    description: 'Created 3 self-contained minimalist landscapes with limited palettes.',
    icon: '🎨',
    unlockedAt: '2026-09-24',
    category: 'craft'
  },
  {
    id: 'badge_harmonic_mind',
    name: 'Harmonic Resonance',
    description: 'Explored pentatonic sound chimes and sand ripples.',
    icon: '🔔',
    unlockedAt: '2026-10-02',
    category: 'craft'
  },
  {
    id: 'badge_stargazer',
    name: 'Curious Stargazer',
    description: 'Unlocked explanations of the Moon illusion and cosmic phenomena.',
    icon: '🌖',
    unlockedAt: '2026-10-10',
    category: 'curiosity'
  },
  {
    id: 'badge_mycelium_binder',
    name: 'Fungal Weaver',
    description: 'Routed connections across the subterranean wood wide web.',
    icon: '🍄',
    category: 'curiosity'
  },
  {
    id: 'badge_warm_circle',
    name: 'Gentle Companion',
    description: 'Shared an offline walk or mindful moment with a friend.',
    icon: '🌿',
    unlockedAt: '2026-10-15',
    category: 'fellowship'
  },
  {
    id: 'badge_offline_pioneer',
    name: 'Untethered Soul',
    description: 'Successfully completed missions in offline flight mode.',
    icon: '🕊️',
    category: 'presence'
  }
];

export function calculateLevel(xp: number) {
  // Gentle progressive scale:
  // Level 1: 0 - 99 XP ("Novice Wanderer")
  // Level 2: 100 - 249 XP ("Attentive Observer")
  // Level 3: 250 - 449 XP ("Quiet Maker")
  // Level 4: 450 - 699 XP ("Rooted Explorer")
  // Level 5: 700 - 999 XP ("Harmonic Weaver")
  // Level 6+: ("Sage of Calm")
  const levels = [
    { level: 1, title: 'Gentle Wanderer', min: 0, max: 100 },
    { level: 2, title: 'Attentive Observer', min: 100, max: 250 },
    { level: 3, title: 'Mindful Maker', min: 250, max: 450 },
    { level: 4, title: 'Rooted Explorer', min: 450, max: 700 },
    { level: 5, title: 'Harmonic Weaver', min: 700, max: 1000 },
    { level: 6, title: 'Sage of Presence', min: 1000, max: 99999 },
  ];

  const current = levels.find(l => xp >= l.min && xp < l.max) || levels[levels.length - 1];
  const progressInLevel = Math.min(100, Math.round(((xp - current.min) / (current.max - current.min)) * 100));

  return {
    ...current,
    progressPercentage: Math.max(0, Math.min(100, progressInLevel)),
    nextLevelXp: current.max,
  };
}
