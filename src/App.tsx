import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation, NavTab } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { VisualSkillSimulatorsScreen } from './components/VisualSkillSimulatorsScreen';
import { ActivityModal } from './components/ActivityModal';
import { ActivityPath } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [exploreInitialPath, setExploreInitialPath] = useState<ActivityPath | 'all'>('all');
  const { activities, activeActivity, setActiveActivity, toastMessage } = useApp();

  const handleOpenActivity = (id: string) => {
    const act = activities.find(a => a.id === id);
    if (act) {
      setActiveActivity(act);
    }
  };

  const handleNavigateExplore = (path: ActivityPath) => {
    setExploreInitialPath(path);
    setCurrentTab('explore');
  };

  return (
    <div className="min-h-screen bg-[#0b120e] text-[#edebe4] flex flex-col selection:bg-[#1a442e] selection:text-[#a7f3d0]">
      {/* Dynamic Toast feedback banner */}
      {toastMessage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#16271e]/95 text-emerald-200 border border-emerald-600/60 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto">
        {currentTab === 'home' && (
          <HomeScreen
            onOpenActivity={handleOpenActivity}
            onNavigateExplore={handleNavigateExplore}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreScreen
            onOpenActivity={handleOpenActivity}
            initialPathTab={exploreInitialPath}
          />
        )}

        {currentTab === 'simulators' && <VisualSkillSimulatorsScreen />}

        {currentTab === 'friends' && <FriendsScreen />}

        {currentTab === 'progress' && <ProgressScreen />}

        {currentTab === 'profile' && <ProfileScreen />}

        {currentTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Active Activity Modal if selected */}
      {activeActivity && (
        <ActivityModal
          activity={activeActivity}
          onClose={() => setActiveActivity(null)}
        />
      )}

      {/* Mobile/Desktop Navigation dock */}
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
