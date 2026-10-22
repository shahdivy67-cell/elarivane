export type ActivityPath = 'go-do' | 'play-unwind' | 'curiosity';

export type ActivityCategory = 'move' | 'explore' | 'make' | 'connect' | 'reset' | 'draw' | 'pattern' | 'sound' | 'puzzle' | 'explainer';

export interface Activity {
  id: string;
  path: ActivityPath;
  title: string;
  subtitle: string;
  category: ActivityCategory;
  durationMinutes: number;
  xpReward: number;
  description: string;
  stepGuide: string[];
  tip?: string;
  prompts?: string[];
  interactiveType?: 'canvas-draw' | 'pattern-weave' | 'sound-chimes' | 'curiosity-puzzle' | 'mini-explainer' | 'real-world-camera';
  curiosityFacts?: string[];
  offlineReady: boolean;
  requiresConnection?: boolean;
}

export interface ActivityCompletion {
  id: string;
  activityId: string;
  activityTitle: string;
  path: ActivityPath;
  category: ActivityCategory;
  completedAt: string; // ISO date
  dateKey: string; // YYYY-MM-DD
  xpEarned: number;
  notes?: string;
  imageUrl?: string;
  sharedWithFriendIds?: string[];
  syncedOffline?: boolean;
  durationMinutes: number;
}

export interface Friend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  isOnline: boolean;
  status: 'friend' | 'pending_incoming' | 'pending_outgoing' | 'blocked';
  sharedActivitiesCount: number;
  lastActive: string;
  currentActivity?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goalCount: number;
  currentCount: number;
  deadline: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    contributed: number;
  }[];
  isJoined: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  handle: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  interests: string[];
  privacy: {
    profileVisibility: 'public' | 'friends-only' | 'private';
    showActivityHeatmap: boolean;
    allowFriendInvites: boolean;
  };
  settings: {
    notifications: {
      dailyGentleNudge: boolean;
      friendActivity: boolean;
      invitations: boolean;
      newCuriosities: boolean;
    };
    contactPermissionGranted: boolean;
    highContrastMode: boolean;
    soundEffects: boolean;
    reducedMotion: boolean;
    theme: 'dark-emerald' | 'warm-stone' | 'deep-moss';
  };
  savedActivityIds: string[];
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0=none, 1=1 activity, 2=2, 3=3, 4=4+
  categories: ActivityCategory[];
}
