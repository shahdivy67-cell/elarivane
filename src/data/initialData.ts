import { Activity, Friend, Challenge, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'me_01',
  displayName: 'Divy Shah',
  handle: 'divyshah',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Swapping mindless doomscrolling for analog sketchbooks, neighborhood walks, and stargazing.',
  joinedDate: '2026-09-12',
  interests: ['35mm Film', 'Mindful Walking', 'Ceramics', 'Cosmology', 'Botanicals'],
  privacy: {
    profileVisibility: 'friends-only',
    showActivityHeatmap: true,
    allowFriendInvites: true,
  },
  settings: {
    notifications: {
      dailyGentleNudge: false, // Low pressure!
      friendActivity: true,
      invitations: true,
      newCuriosities: true,
    },
    contactPermissionGranted: false,
    highContrastMode: false,
    soundEffects: true,
    reducedMotion: false,
    theme: 'dark-emerald',
  },
  savedActivityIds: ['godo_walk_detail', 'play_3color', 'curio_moon'],
};

export const INITIAL_ACTIVITIES: Activity[] = [
  // 1. GO DO
  {
    id: 'godo_walk_detail',
    path: 'go-do',
    category: 'explore',
    title: 'The Unnoticed Micro-Detail',
    subtitle: '10-minute neighbourhood observation walk',
    durationMinutes: 10,
    xpReward: 35,
    description: 'Step outside without earphones. Spot and photograph one architectural, botanical, or textural detail you walk past every day but never actually registered before.',
    stepGuide: [
      'Leave your keys and earphones at the door. Just carry your pocket notebook or camera.',
      'Walk at half your ordinary pace down a familiar street.',
      'Look for patterns in rust, peeling paint, moss in brick seams, or window reflections.',
      'Capture or reflect upon that single nuance.'
    ],
    tip: 'Notice how slow movement calms your breathing within 4 minutes.',
    interactiveType: 'real-world-camera',
    offlineReady: true,
  },
  {
    id: 'godo_tea_ritual',
    path: 'go-do',
    category: 'reset',
    title: 'Single-Sip Tea Meditation',
    subtitle: '5 minutes of unhurried warm brew',
    durationMinutes: 5,
    xpReward: 20,
    description: 'Brew warm tea, herbal tisane, or hot water with lemon. Sip without looking at any screen or multitasking.',
    stepGuide: [
      'Boil water and listen to the kettle murmur and boil.',
      'Feel the warmth radiate into both palms through the ceramic.',
      'Drink the first 5 sips in complete stillness with eyes half-shut.',
      'Breathe in the steam and savor the lingering aftertaste.'
    ],
    tip: 'No phone in the kitchen while the tea steeps.',
    offlineReady: true,
  },
  {
    id: 'godo_postcard_friend',
    path: 'go-do',
    category: 'connect',
    title: 'Spontaneous Gratitude Note',
    subtitle: 'Send genuine appreciation to a friend',
    durationMinutes: 6,
    xpReward: 30,
    description: 'Send a heartfelt 3-sentence message to someone who made an impact on you recently, telling them exactly what you admire or thank them for.',
    stepGuide: [
      'Think of a person whose company or deed brought you peace this month.',
      'Write them: 1) What specific memory or trait came to mind, 2) Why you value them, 3) No reply needed, just wishing them well.',
      'Send it without expecting an instant ping back.'
    ],
    tip: 'Unsolicited affection is one of the highest joys in human friendship.',
    offlineReady: true,
  },
  {
    id: 'godo_sunlight_stretch',
    path: 'go-do',
    category: 'move',
    title: 'Skyward Spine & Hip Reset',
    subtitle: '8-minute midday somatic decompression',
    durationMinutes: 8,
    xpReward: 25,
    description: 'A gentle non-workout sequence to untie tech-neck, open ribcage breathing, and stimulate blood flow to your extremities.',
    stepGuide: [
      'Stand barefoot or in soft socks. Roll your shoulders up, back, and down 6 times.',
      'Reach fingers up to the ceiling, inhaling deeply for 4 counts.',
      'Gently hinge hips forward, letting arms dangle like heavy willow branches.',
      'Take 3 belly sighs and slowly roll up vertebrate by vertebrate.'
    ],
    tip: 'Look as far toward the horizon as your window or balcony allows to relax optic muscles.',
    offlineReady: true,
  },
  {
    id: 'godo_origami_crane',
    path: 'go-do',
    category: 'make',
    title: 'Pocket Origami Crane or Boat',
    subtitle: 'Fold scrap paper into tactile geometry',
    durationMinutes: 7,
    xpReward: 25,
    description: 'Grab a square sheet from an old receipt, flyer, or notepad and transform 2D paper into a clean miniature sculpture.',
    stepGuide: [
      'Cut or tear any rectangular scrap into an exact square.',
      'Crease diagonal valleys crisp with your thumbnail.',
      'Follow the folds and breathe through any tricky corner.',
      'Leave your paper sculpture on a bookshelf or desk corner as a talisman.'
    ],
    tip: 'Tactile fingertips directly soothe overstimulated nervous systems.',
    offlineReady: true,
  },

  // 2. PLAY & UNWIND
  {
    id: 'play_3color',
    path: 'play-unwind',
    category: 'draw',
    title: '3-Color Micro Landscape',
    subtitle: 'Low-pressure miniature canvas sketch',
    durationMinutes: 5,
    xpReward: 30,
    description: 'Compose a tiny atmospheric landscape using only three hand-picked shades: a horizon, an ambient sky, and a foreground silhouette.',
    stepGuide: [
      'Select your 3 muted botanical hues.',
      'Swipe broad strokes for the sky gradient.',
      'Carve mountain ridges or treetops with quick rhythmic gestures.',
      'Save your finished thumbnail into your personal gallery.'
    ],
    tip: 'Perfection is banned here. Loose gestures have the most soul.',
    interactiveType: 'canvas-draw',
    offlineReady: true,
  },
  {
    id: 'play_pattern',
    path: 'play-unwind',
    category: 'pattern',
    title: 'Tessellation & Zen Garden Rake',
    subtitle: 'Geometric ripple and soothing sand tracks',
    durationMinutes: 4,
    xpReward: 25,
    description: 'Drag your finger across a bed of virtual Japanese raked sand to generate calming harmonic ripples and concentric waves.',
    stepGuide: [
      'Gently glide across the virtual sand garden canvas.',
      'Watch ripples diffuse into peaceful symmetry.',
      'Tap to place smooth river stones around which lines bend.'
    ],
    interactiveType: 'pattern-weave',
    offlineReady: true,
  },
  {
    id: 'play_sound_chimes',
    path: 'play-unwind',
    category: 'sound',
    title: 'Pentatonic Ambient Chimes',
    subtitle: 'Harmonic wind bells tuned to 432Hz calm',
    durationMinutes: 4,
    xpReward: 25,
    description: 'Touch floating bamboo and bronze bells that resonate in a harmonic pentatonic scale where every note blends into pure concord.',
    stepGuide: [
      'Tap any floating bell to ring a crystalline resonant tone.',
      'Slide across multiple bells to create an ambient breeze.',
      'Let the reverberation gently decay into quietness.'
    ],
    interactiveType: 'sound-chimes',
    offlineReady: true,
  },

  // 3. CURIOSITY
  {
    id: 'curio_moon',
    path: 'curiosity',
    category: 'explainer',
    title: 'The Moon Horizon Illusion',
    subtitle: 'Why the full moon seems enormous low down',
    durationMinutes: 3,
    xpReward: 30,
    description: 'Ever wondered why the moon looks gigantic when rising over city roofs, but tiny overhead? Test the Ponzo illusion with your own eyes.',
    stepGuide: [
      'Understand the Ponzo & Ebbinghaus optical perspective effect.',
      'Interact with the scaling slider to compare perceived vs actual diameter.',
      'Discover the easy "look through a hollow paper roll" trick to verify.'
    ],
    curiosityFacts: [
      'Photos taken with the same camera focal length reveal the moon is identical in pixel diameter at horizon and zenith.',
      'Your brain treats the sky overhead as closer than the sky at the horizon, assuming an inverted bowl shape.',
      'Looking at the horizon moon upside down through your legs breaks the illusion for most humans!'
    ],
    interactiveType: 'mini-explainer',
    offlineReady: true,
  },
  {
    id: 'curio_mycelium',
    path: 'curiosity',
    category: 'puzzle',
    title: 'Wood Wide Web Network Puzzle',
    subtitle: 'How forest trees trade sugars and warnings',
    durationMinutes: 4,
    xpReward: 35,
    description: 'Under every forest floor lies a mycorrhizal fungal highway. Connect 4 mother trees to seedling saplings through fungal hyphae without crossing wires.',
    stepGuide: [
      'Learn how older "Mother Trees" nurse shaded young saplings with carbon.',
      'Solve the 1-minute routing puzzle connecting fungal nodes.',
      'Unlock the acoustic signal insight fungi emit when moisture drops.'
    ],
    curiosityFacts: [
      'A single teaspoon of healthy forest soil contains miles of fungal mycelium filament.',
      'Trees under aphid attack send chemical distress pulses through fungal wires, causing neighboring trees to produce bitter tannins before the bugs even arrive.'
    ],
    interactiveType: 'curiosity-puzzle',
    offlineReady: true,
  },
  {
    id: 'curio_kintsugi',
    path: 'curiosity',
    category: 'explainer',
    title: 'The Philosophy of Kintsugi',
    subtitle: 'Golden joinery and the grace of brokenness',
    durationMinutes: 3,
    xpReward: 25,
    description: 'Explore the 15th-century Japanese art of mending broken pottery with lacquer dusted with powdered gold, silver, or platinum.',
    stepGuide: [
      'Discover the connection between wabi-sabi and Kintsugi (金継ぎ).',
      'Inspect the historical origins dating to Shogun Ashikaga Yoshimasa.',
      'Reflect on how repair illuminates a bowl’s history rather than disguising it.'
    ],
    curiosityFacts: [
      'Urushi lacquer used in Kintsugi is harvested from the toxic sap of the lacquer tree and hardens by absorbing ambient humidity.',
      'In traditional tea ceremonies, repaired tea bowls are often treasured far above pristine, unblemished ones.'
    ],
    interactiveType: 'mini-explainer',
    offlineReady: true,
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f_elena',
    name: 'Elena Rostova',
    handle: 'elenar',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    bio: 'Watercolor hobbyist & weekend trail wanderer. Leaving Instagram behind for paper sketchbooks.',
    isOnline: true,
    status: 'friend',
    sharedActivitiesCount: 14,
    lastActive: 'Just now',
    currentActivity: 'Walking the dog along the canal',
  },
  {
    id: 'f_julian',
    name: 'Julian Vance',
    handle: 'julianv',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    bio: 'Tea brewer, bread baker, vinyl collector.',
    isOnline: true,
    status: 'friend',
    sharedActivitiesCount: 9,
    lastActive: '12m ago',
    currentActivity: 'Brewing sencha & journaling',
  },
  {
    id: 'f_maya',
    name: 'Maya Chen',
    handle: 'mayac',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    bio: 'Botany enthusiast & film photographer. Looking for real world color.',
    isOnline: false,
    status: 'friend',
    sharedActivitiesCount: 6,
    lastActive: '2h ago',
  },
  {
    id: 'f_soren',
    name: 'Soren Lind',
    handle: 'sorenl',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    bio: 'Woodworking & analog synthesizer tinkerer.',
    isOnline: false,
    status: 'pending_incoming',
    sharedActivitiesCount: 0,
    lastActive: '1d ago',
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'c_autumn_air',
    title: 'Fresh Air Circle',
    description: 'Together with 3 friends, take five 10-minute walks without phones this week.',
    goalCount: 5,
    currentCount: 3,
    deadline: 'In 3 days',
    participants: [
      { id: 'me_01', name: 'Divy', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', contributed: 2 },
      { id: 'f_elena', name: 'Elena', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80', contributed: 1 },
    ],
    isJoined: true,
  },
  {
    id: 'c_analog_sketch',
    title: 'Doodle Co-op',
    description: 'Make 4 low-pressure micro drawings using only 3 colors.',
    goalCount: 4,
    currentCount: 1,
    deadline: 'In 5 days',
    participants: [
      { id: 'f_julian', name: 'Julian', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', contributed: 1 },
    ],
    isJoined: false,
  }
];

// Helper to generate past 4 months of realistic non-shame participation entries
export function generateInitialHistory() {
  const history: any[] = [];
  const now = new Date();
  
  // Create sample entries over the last 90 days with realistic clusters
  for (let i = 0; i < 90; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];

    // Probability of completing activities on day i
    const rand = (i * 13 + 7) % 10;
    if (rand > 3) {
      const count = (i % 5 === 0) ? 3 : (i % 2 === 0 ? 2 : 1);
      for (let c = 0; c < count; c++) {
        history.push({
          id: `hist_${i}_${c}`,
          activityId: c === 0 ? 'godo_walk_detail' : (c === 1 ? 'play_3color' : 'curio_moon'),
          activityTitle: c === 0 ? 'The Unnoticed Micro-Detail' : (c === 1 ? '3-Color Micro Landscape' : 'The Moon Horizon Illusion'),
          path: c === 0 ? 'go-do' : (c === 1 ? 'play-unwind' : 'curiosity'),
          category: c === 0 ? 'explore' : (c === 1 ? 'draw' : 'explainer'),
          completedAt: d.toISOString(),
          dateKey,
          xpEarned: 25 + (c * 5),
          durationMinutes: 10 - c * 2,
        });
      }
    }
  }
  return history;
}
