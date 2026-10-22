import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, ActivityCompletion, Friend, Challenge, UserProfile } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_ACTIVITIES, INITIAL_FRIENDS, INITIAL_CHALLENGES, generateInitialHistory } from '../data/initialData';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Profile & User
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  updatePrivacy: (updated: Partial<UserProfile['privacy']>) => void;
  updateSettings: (updated: Partial<UserProfile['settings']>) => void;
  deleteAccount: () => void;
  exportDataJson: () => void;

  // Activities & Library
  activities: Activity[];
  savedActivities: Activity[];
  toggleSaveActivity: (id: string) => void;
  isSaved: (id: string) => boolean;

  // History & Completions
  history: ActivityCompletion[];
  totalXp: number;
  completeActivity: (
    activity: Activity,
    details?: { notes?: string; imageUrl?: string; sharedFriends?: string[] }
  ) => void;
  clearHistory: () => void;

  // Friends & Social
  friends: Friend[];
  sendFriendRequest: (handleOrName: string) => boolean;
  acceptFriendRequest: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  blockFriend: (friendId: string) => void;
  reportUser: (friendId: string, reason: string) => void;
  inviteFriendToActivity: (friendId: string, activityId: string) => void;

  // Challenges
  challenges: Challenge[];
  toggleJoinChallenge: (challengeId: string) => void;

  // Connection & Offline
  isOnline: boolean;
  setSimulatedOffline: (offline: boolean) => void;
  simulatedOffline: boolean;
  pendingOfflineSyncsCount: number;
  syncOfflineDataNow: () => void;

  // Active Interactive modal
  activeActivity: Activity | null;
  setActiveActivity: (act: Activity | null) => void;
  activePathTab: 'go-do' | 'play-unwind' | 'curiosity' | 'all';
  setActivePathTab: (tab: 'go-do' | 'play-unwind' | 'curiosity' | 'all') => void;

  // Feedback Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'elarivane_user_v1';
const STORAGE_KEY_HISTORY = 'elarivane_history_v1';
const STORAGE_KEY_FRIENDS = 'elarivane_friends_v1';
const STORAGE_KEY_CHALLENGES = 'elarivane_challenges_v1';
const STORAGE_KEY_OFFLINE_QUEUE = 'elarivane_offline_queue_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load State from LocalStorage with clean fallbacks
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [history, setHistory] = useState<ActivityCompletion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : generateInitialHistory();
    } catch {
      return generateInitialHistory();
    }
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FRIENDS);
      return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
    } catch {
      return INITIAL_FRIENDS;
    }
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHALLENGES);
      return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
    } catch {
      return INITIAL_CHALLENGES;
    }
  });

  const [activities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [activePathTab, setActivePathTab] = useState<'go-do' | 'play-unwind' | 'curiosity' | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Network & Offline simulation states
  const [networkOnline, setNetworkOnline] = useState<boolean>(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState<boolean>(false);
  const isOnline = networkOnline && !simulatedOffline;

  const [offlineQueue, setOfflineQueue] = useState<ActivityCompletion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track system online/offline events
  useEffect(() => {
    const handleOnline = () => setNetworkOnline(true);
    const handleOffline = () => setNetworkOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FRIENDS, JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Toast trigger helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Profile actions
  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
    showToast('Profile updated');
  };

  const updatePrivacy = (updated: Partial<UserProfile['privacy']>) => {
    setUser(prev => ({
      ...prev,
      privacy: { ...prev.privacy, ...updated },
    }));
    showToast('Privacy preferences saved');
  };

  const updateSettings = (updated: Partial<UserProfile['settings']>) => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updated },
    }));
    showToast('Settings saved');
  };

  const deleteAccount = () => {
    localStorage.clear();
    setUser(INITIAL_USER_PROFILE);
    setHistory([]);
    setFriends([]);
    setChallenges([]);
    setOfflineQueue([]);
    showToast('Account data cleared successfully');
  };

  const exportDataJson = () => {
    const dataToExport = {
      user,
      history,
      friends,
      challenges,
      exportDate: new Date().toISOString(),
      appName: 'Elarivane',
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elarivane-my-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Your complete data package was exported');
  };

  // Saved activities
  const toggleSaveActivity = (id: string) => {
    setUser(prev => {
      const exists = prev.savedActivityIds.includes(id);
      const updated = exists
        ? prev.savedActivityIds.filter(item => item !== id)
        : [...prev.savedActivityIds, id];
      showToast(exists ? 'Removed from saved activities' : 'Saved for when you need a pause');
      return { ...prev, savedActivityIds: updated };
    });
  };

  const isSaved = (id: string) => user.savedActivityIds.includes(id);

  const savedActivities = activities.filter(a => user.savedActivityIds.includes(a.id));

  // XP calculations
  const totalXp = history.reduce((sum, item) => sum + (item.xpEarned || 0), 0);

  // Complete an activity
  const completeActivity = (
    activity: Activity,
    details?: { notes?: string; imageUrl?: string; sharedFriends?: string[] }
  ) => {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const newEntry: ActivityCompletion = {
      id: `act_${Date.now()}`,
      activityId: activity.id,
      activityTitle: activity.title,
      path: activity.path,
      category: activity.category,
      completedAt: now.toISOString(),
      dateKey,
      xpEarned: activity.xpReward,
      durationMinutes: activity.durationMinutes,
      notes: details?.notes,
      imageUrl: details?.imageUrl,
      sharedWithFriendIds: details?.sharedFriends,
      syncedOffline: !isOnline,
    };

    if (!isOnline) {
      // Store in offline queue
      setOfflineQueue(prev => [...prev, newEntry]);
      setHistory(prev => [newEntry, ...prev]);
      showToast(`Saved locally offline! (+${activity.xpReward} XP queued for sync)`);
    } else {
      setHistory(prev => [newEntry, ...prev]);
      showToast(`Finished "${activity.title}". Rewarded +${activity.xpReward} XP!`);
      // Gentle celebratory confetti
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#34d399', '#10b981', '#059669', '#a7f3d0'],
        disableForReducedMotion: user.settings.reducedMotion,
      });
    }

    // Update active challenge if applicable
    setChallenges(prev =>
      prev.map(c => {
        if (c.isJoined && c.currentCount < c.goalCount) {
          return {
            ...c,
            currentCount: c.currentCount + 1,
            participants: c.participants.map(p =>
              p.id === user.id ? { ...p, contributed: p.contributed + 1 } : p
            ),
          };
        }
        return c;
      })
    );
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('Activity history cleared.');
  };

  // Sync offline queue
  const syncOfflineDataNow = () => {
    if (offlineQueue.length === 0) {
      showToast('All data is already in sync.');
      return;
    }
    // Prevent duplicates: mark them synced
    setHistory(prev =>
      prev.map(item =>
        offlineQueue.some(q => q.id === item.id) ? { ...item, syncedOffline: false } : item
      )
    );
    const count = offlineQueue.length;
    setOfflineQueue([]);
    showToast(`Successfully synced ${count} offline ${count === 1 ? 'activity' : 'activities'}!`);
  };

  // Friends actions
  const sendFriendRequest = (handleOrName: string) => {
    const clean = handleOrName.trim().toLowerCase().replace('@', '');
    if (!clean) return false;

    // Check if already in friend list
    const existing = friends.find(
      f => f.handle.toLowerCase() === clean || f.name.toLowerCase() === clean
    );
    if (existing) {
      showToast(`Already connected with @${existing.handle}`);
      return false;
    }

    const newFriend: Friend = {
      id: `friend_${Date.now()}`,
      name: handleOrName.trim(),
      handle: clean,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 5000000)}?auto=format&fit=crop&w=250&q=80`,
      bio: 'Mindful presence enthusiast.',
      isOnline: false,
      status: 'pending_outgoing',
      sharedActivitiesCount: 0,
      lastActive: 'Just invited',
    };
    setFriends(prev => [newFriend, ...prev]);
    showToast(`Friend invite sent to @${clean}`);
    return true;
  };

  const acceptFriendRequest = (friendId: string) => {
    setFriends(prev =>
      prev.map(f => (f.id === friendId ? { ...f, status: 'friend', isOnline: true } : f))
    );
    showToast('Friend request accepted');
  };

  const removeFriend = (friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
    showToast('Friend removed from your circle');
  };

  const blockFriend = (friendId: string) => {
    setFriends(prev =>
      prev.map(f => (f.id === friendId ? { ...f, status: 'blocked' } : f))
    );
    showToast('User has been blocked');
  };

  const reportUser = (friendId: string, reason: string) => {
    showToast(`Report received: "${reason}". Thank you for keeping our space safe.`);
  };

  const inviteFriendToActivity = (friendId: string, activityId: string) => {
    const act = activities.find(a => a.id === activityId);
    const fr = friends.find(f => f.id === friendId);
    if (act && fr) {
      showToast(`Invited ${fr.name} to "${act.title}"!`);
    }
  };

  // Challenges
  const toggleJoinChallenge = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id === challengeId) {
          const isNowJoined = !ch.isJoined;
          showToast(isNowJoined ? `Joined "${ch.title}"!` : `Left "${ch.title}"`);
          return {
            ...ch,
            isJoined: isNowJoined,
            participants: isNowJoined
              ? [...ch.participants, { id: user.id, name: user.displayName, avatar: user.avatar, contributed: 0 }]
              : ch.participants.filter(p => p.id !== user.id),
          };
        }
        return ch;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        updatePrivacy,
        updateSettings,
        deleteAccount,
        exportDataJson,

        activities,
        savedActivities,
        toggleSaveActivity,
        isSaved,

        history,
        totalXp,
        completeActivity,
        clearHistory,

        friends,
        sendFriendRequest,
        acceptFriendRequest,
        removeFriend,
        blockFriend,
        reportUser,
        inviteFriendToActivity,

        challenges,
        toggleJoinChallenge,

        isOnline,
        setSimulatedOffline,
        simulatedOffline,
        pendingOfflineSyncsCount: offlineQueue.length,
        syncOfflineDataNow,

        activeActivity,
        setActiveActivity,
        activePathTab,
        setActivePathTab,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
