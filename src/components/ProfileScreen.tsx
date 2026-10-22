import React, { useState } from 'react';
import {
  User,
  Shield,
  Edit3,
  Calendar,
  Sparkles,
  Heart,
  Check,
  Footprints,
  Eye,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateLevel, BADGES_LIST } from '../data/badges';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, updatePrivacy, history, totalXp } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.displayName);
  const [editBio, setEditBio] = useState(user.bio);
  const [newInterest, setNewInterest] = useState('');

  const levelInfo = calculateLevel(totalXp);
  const recentCompletions = history.slice(0, 5);

  const handleSaveProfile = () => {
    updateUser({
      displayName: editName.trim() || user.displayName,
      bio: editBio.trim(),
    });
    setIsEditing(false);
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim() && !user.interests.includes(newInterest.trim())) {
      updateUser({
        interests: [...user.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    updateUser({
      interests: user.interests.filter(i => i !== item),
    });
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4 md:pt-6">
      {/* Profile Card */}
      <div className="bg-[#121c17] border border-emerald-950/80 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/60 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700">
              Lv. {levelInfo.level}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-serif font-bold text-white">{user.displayName}</h1>
                <p className="text-xs text-stone-300">@{user.handle} • Joined {user.joinedDate}</p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="self-center sm:self-auto px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-medium rounded-xl border border-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Bio or Edit Form */}
            {isEditing ? (
              <div className="space-y-3 pt-2 text-left">
                <div>
                  <label className="text-[11px] text-stone-400">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400">Bio</label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            ) : (
              <p className="text-xs text-stone-300 pt-1 leading-relaxed">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Interests Tags */}
        <div className="pt-5 border-t border-emerald-950/70 mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-300">Quiet Passions & Interests</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {user.interests.map(int => (
              <span
                key={int}
                className="text-xs bg-[#17251e] border border-emerald-900/60 text-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
              >
                {int}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveInterest(int)}
                    className="text-stone-300 hover:text-stone-200 font-bold ml-0.5"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <form onSubmit={handleAddInterest} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add new interest (e.g. Sourdough, Astronomy)"
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                className="flex-1 bg-[#0d1410] border border-emerald-950 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-300 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl"
              >
                Add
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Privacy Quick Toggles */}
      <div className="bg-[#121c17] border border-emerald-950/80 rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Profile Privacy Controls
        </h3>

        <div className="space-y-2 text-xs text-stone-300">
          <div className="flex items-center justify-between p-2.5 bg-[#0e1612] rounded-xl border border-emerald-950">
            <div>
              <span className="font-medium text-stone-200 block">Profile Visibility</span>
              <span className="text-[11px] text-stone-300">Who can see your interests and bio</span>
            </div>
            <select
              value={user.privacy.profileVisibility}
              onChange={e =>
                updatePrivacy({
                  profileVisibility: e.target.value as any,
                })
              }
              className="bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-stone-200 focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="friends-only">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#0e1612] rounded-xl border border-emerald-950">
            <div>
              <span className="font-medium text-stone-200 block">Show Activity Heatmap</span>
              <span className="text-[11px] text-stone-300">Allow friends to celebrate your participation</span>
            </div>
            <input
              type="checkbox"
              checked={user.privacy.showActivityHeatmap}
              onChange={e => updatePrivacy({ showActivityHeatmap: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Completed Activity Journal */}
      <div className="bg-[#121c17] border border-emerald-950/80 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
            <Footprints className="w-4 h-4 text-emerald-400" />
            Recent Completed Moments ({history.length})
          </h3>
        </div>

        {recentCompletions.length === 0 ? (
          <p className="text-xs text-stone-300 py-4 text-center">
            No completed activities yet. Try a 5-minute tea pause or micro sketch!
          </p>
        ) : (
          <div className="space-y-2.5">
            {recentCompletions.map(item => (
              <div
                key={item.id}
                className="bg-[#0e1612] border border-emerald-950 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-stone-200">{item.activityTitle}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-300">
                    <span>{item.dateKey}</span>
                    <span>•</span>
                    <span className="capitalize">{item.category}</span>
                    {item.notes && (
                      <>
                        <span>•</span>
                        <span className="italic truncate max-w-[140px] text-stone-300">
                          "{item.notes}"
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt="Moment capture"
                      className="w-9 h-9 rounded-lg object-cover border border-emerald-900"
                    />
                  )}
                  <span className="text-xs font-semibold text-emerald-400">+{item.xpEarned} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
