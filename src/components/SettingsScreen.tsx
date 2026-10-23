import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Eye,
  Shield,
  Download,
  Trash2,
  Wifi,
  WifiOff,
  RefreshCw,
  Sun,
  Volume2,
  Check,
  AlertTriangle,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EcosystemDirectoryModal } from './EcosystemDirectoryModal';

export const SettingsScreen: React.FC = () => {
  const {
    user,
    updateSettings,
    updatePrivacy,
    deleteAccount,
    exportDataJson,
    isOnline,
    simulatedOffline,
    setSimulatedOffline,
    pendingOfflineSyncsCount,
    syncOfflineDataNow,
  } = useApp();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4 md:pt-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white">
          Preferences & Controls
        </h1>
        <p className="text-xs md:text-sm text-stone-300 mt-1">
          Customize notifications, privacy, offline behavior, and data exports.
        </p>
      </div>

      {/* ALIVONE ECOSYSTEM HUB LINK */}
      <div className="bg-[#121c17] border border-emerald-950/80 rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-100">Alivone Ecosystem</h3>
              <p className="text-xs text-stone-300">
                Explore connected apps across mindfulness, focus, and creativity.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEcosystem(true)}
            className="px-3.5 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <span>View Network</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* OFFLINE MODE CONTROLS */}
      <div className="bg-[#121c17] border border-emerald-950/80 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-100">
                Network & Offline Sync
              </h3>
              <p className="text-xs text-stone-300">
                Current status: <span className="font-semibold text-white">{isOnline ? 'Online' : 'Offline Mode'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSimulatedOffline(!simulatedOffline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              simulatedOffline
                ? 'bg-amber-900/60 border-amber-600 text-amber-200'
                : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            {simulatedOffline ? 'Simulate Reconnect' : 'Simulate Offline'}
          </button>
        </div>

        {/* Sync status button */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0e1612] border border-emerald-950 text-xs">
          <div>
            <span className="font-medium text-stone-200 block">Offline Queue</span>
            <span className="text-[11px] text-stone-300">
              {pendingOfflineSyncsCount > 0
                ? `${pendingOfflineSyncsCount} completions stored locally`
                : 'All offline completions synced to cloud'}
            </span>
          </div>

          <button
            onClick={syncOfflineDataNow}
            disabled={pendingOfflineSyncsCount === 0}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-emerald-100 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Now
          </button>
        </div>

        <p className="text-[11px] text-stone-300 italic">
          * Go Do missions, 3-color drawings, and zen sand patterns always work seamlessly without an internet connection.
        </p>
      </div>

      {/* NOTIFICATIONS (NO MANIPULATION) */}
      <div className="bg-[#121c17] border border-emerald-950/80 rounded-3xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          Gentle Notifications (You control every ping)
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#0e1612] rounded-xl border border-emerald-950">
            <div>
              <span className="font-medium text-stone-200 block">Daily Gentle Nudge</span>
              <span className="text-[11px] text-stone-300">Optional single ping suggesting a real-world pause</span>
            </div>
            <input
              type="checkbox"
              checked={user.settings.notifications.dailyGentleNudge}
              onChange={e =>
                updateSettings({
                  notifications: {
                    ...user.settings.notifications,
                    dailyGentleNudge: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#0e1612] rounded-xl border border-emerald-950">
            <div>
              <span className="font-medium text-stone-200 block">Friend Activity & Invites</span>
              <span className="text-[11px] text-stone-300">When friends invite you to walks or challenges</span>
            </div>
            <input
              type="checkbox"
              checked={user.settings.notifications.friendActivity}
              onChange={e =>
                updateSettings({
                  notifications: {
                    ...user.settings.notifications,
                    friendActivity: e.target.checked,
                    invitations: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#0e1612] rounded-xl border border-emerald-950">
            <div>
              <span className="font-medium text-stone-200 block">New Curiosities & Explainers</span>
              <span className="text-[11px] text-stone-300">Low-frequency updates when new topics arrive</span>
            </div>
            <input
              type="checkbox"
              checked={user.settings.notifications.newCuriosities}
              onChange={e =>
                updateSettings({
                  notifications: {
                    ...user.settings.notifications,
                    newCuriosities: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ACCESSIBILITY & AMBIENCE */}
      <div className="bg-[#121c17] border border-emerald-950/80 rounded-3xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          Ambience & Accessibility
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#0e1612] rounded-xl border border-emerald-950">
            <div>
              <span className="font-medium text-stone-200 block">Audio Feedback & Chimes</span>
              <span className="text-[11px] text-stone-300">Play harmonic bell tones during unwind activities</span>
            </div>
            <input
              type="checkbox"
              checked={user.settings.soundEffects}
              onChange={e => updateSettings({ soundEffects: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#0e1612] rounded-xl border border-emerald-950">
            <div>
              <span className="font-medium text-stone-200 block">Reduced Motion</span>
              <span className="text-[11px] text-stone-300">Disable floating animations and celebratory confetti</span>
            </div>
            <input
              type="checkbox"
              checked={user.settings.reducedMotion}
              onChange={e => updateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#0e1612] rounded-xl border border-emerald-950">
            <div>
              <span className="font-medium text-stone-200 block">Visual Surface Palette</span>
              <span className="text-[11px] text-stone-300">Refined deep natural shades</span>
            </div>
            <select
              value={user.settings.theme}
              onChange={e => updateSettings({ theme: e.target.value as any })}
              className="bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-stone-200 focus:outline-none"
            >
              <option value="dark-emerald">Dark Emerald (Default)</option>
              <option value="warm-stone">Warm Stone</option>
              <option value="deep-moss">Deep Moss</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA EXPORT & SOVEREIGNTY */}
      <div className="bg-[#121c17] border border-emerald-950/80 rounded-3xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Data Sovereignty & Account
        </h3>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0e1612] border border-emerald-950">
            <div>
              <span className="text-xs font-medium text-stone-200 block">Export All My Data (JSON)</span>
              <span className="text-[11px] text-stone-300">Download your history, friends, and profile entries</span>
            </div>
            <button
              onClick={exportDataJson}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/30 space-y-3">
            <div>
              <span className="text-xs font-semibold text-rose-300 block">Delete Account & Data</span>
              <span className="text-[11px] text-stone-300">Permanently clears local and synced profile data</span>
            </div>

            {confirmDelete ? (
              <div className="space-y-2">
                <p className="text-[11px] text-rose-300 font-medium">
                  Are you completely sure? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      deleteAccount();
                      setConfirmDelete(false);
                    }}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl"
                  >
                    Confirm Clear All
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Local Data & Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <EcosystemDirectoryModal isOpen={showEcosystem} onClose={() => setShowEcosystem(false)} />
    </div>
  );
};
