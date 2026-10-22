import React, { useState } from 'react';
import { X, Bookmark, Share2, Check, Clock, Sparkles, AlertCircle, Users, CheckCircle2 } from 'lucide-react';
import { Activity } from '../types';
import { useApp } from '../context/AppContext';
import { CanvasDraw } from './interactive/CanvasDraw';
import { PatternWeave } from './interactive/PatternWeave';
import { SoundChimes } from './interactive/SoundChimes';
import { MiniExplainer } from './interactive/MiniExplainer';
import { CuriosityPuzzle } from './interactive/CuriosityPuzzle';
import { RealWorldCamera } from './interactive/RealWorldCamera';

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  const { isSaved, toggleSaveActivity, completeActivity, isOnline, friends, inviteFriendToActivity } = useApp();
  const [completedState, setCompletedState] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);

  const handleFinishInteractive = (data?: { notes?: string; imageUrl?: string }) => {
    completeActivity(activity, {
      notes: data?.notes,
      imageUrl: data?.imageUrl,
      sharedFriends: invitedFriends,
    });
    setCompletedState(true);
  };

  const handleToggleInviteFriend = (friendId: string) => {
    if (invitedFriends.includes(friendId)) {
      setInvitedFriends(prev => prev.filter(id => id !== friendId));
    } else {
      setInvitedFriends(prev => [...prev, friendId]);
      inviteFriendToActivity(friendId, activity.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#101914] border border-emerald-900/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col my-auto relative max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-950/60 bg-[#0c130f]">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold ${
                activity.path === 'go-do'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  : activity.path === 'play-unwind'
                  ? 'bg-teal-950 text-teal-300 border border-teal-800/60'
                  : 'bg-amber-950 text-amber-300 border border-amber-800/60'
              }`}
            >
              {activity.path === 'go-do'
                ? 'Go Do'
                : activity.path === 'play-unwind'
                ? 'Play & Unwind'
                : 'Curiosity'}
            </span>
            <span className="flex items-center gap-1 text-xs text-stone-300">
              <Clock className="w-3 h-3 text-stone-400" />
              {activity.durationMinutes} min finite
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSaveActivity(activity.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved(activity.id)
                  ? 'border-emerald-500 bg-emerald-950/50 text-emerald-400'
                  : 'border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Save for later"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="p-2 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Invite a friend"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5">
          {completedState ? (
            /* Clear Finite "Done" State */
            <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-950">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-semibold text-white">Mission Complete</h3>
                <p className="text-sm text-emerald-300 font-medium">+{activity.xpReward} XP earned for presence</p>
                <p className="text-xs text-stone-300 max-w-xs mx-auto pt-1">
                  You took a conscious pause instead of an infinite feed. There is nothing more you have to do right now.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2.5 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg"
                >
                  Return to Calm
                </button>
                <button
                  onClick={() => {
                    setCompletedState(false);
                  }}
                  className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 text-sm rounded-xl transition-colors border border-stone-800"
                >
                  Replay Activity
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Titles */}
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-semibold text-white tracking-tight">
                  {activity.title}
                </h2>
                <p className="text-xs text-stone-300">{activity.subtitle}</p>
              </div>

              {/* Description */}
              <div className="bg-[#142019] p-3.5 rounded-2xl border border-emerald-950/60 text-xs text-stone-300 leading-relaxed">
                {activity.description}
              </div>

              {/* Offline indicator note */}
              {!isOnline && (
                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-900/40 text-[11px] text-amber-200 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Offline Ready: Completion will automatically sync once reconnected.</span>
                </div>
              )}

              {/* Interactive Module if exists */}
              {activity.interactiveType === 'canvas-draw' && (
                <div className="pt-2">
                  <CanvasDraw
                    onComplete={url => handleFinishInteractive({ imageUrl: url, notes: 'Micro landscape sketch' })}
                  />
                </div>
              )}

              {activity.interactiveType === 'pattern-weave' && (
                <div className="pt-2">
                  <PatternWeave onComplete={() => handleFinishInteractive({ notes: 'Zen garden meditation' })} />
                </div>
              )}

              {activity.interactiveType === 'sound-chimes' && (
                <div className="pt-2">
                  <SoundChimes onComplete={() => handleFinishInteractive({ notes: 'Pentatonic chimes resonance' })} />
                </div>
              )}

              {activity.interactiveType === 'mini-explainer' && (
                <div className="pt-2">
                  <MiniExplainer activityId={activity.id} onComplete={() => handleFinishInteractive()} />
                </div>
              )}

              {activity.interactiveType === 'curiosity-puzzle' && (
                <div className="pt-2">
                  <CuriosityPuzzle onComplete={() => handleFinishInteractive({ notes: 'Wood wide web mycelium network' })} />
                </div>
              )}

              {activity.interactiveType === 'real-world-camera' && (
                <div className="pt-2">
                  <RealWorldCamera onComplete={handleFinishInteractive} />
                </div>
              )}

              {/* Step Guide for Real World Non-Interactive Missions */}
              {!activity.interactiveType && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    How to do this:
                  </h4>
                  <div className="space-y-2.5">
                    {activity.stepGuide.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-xs text-stone-300 bg-[#121a15] p-3 rounded-xl border border-emerald-950/40"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="pt-0.5 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>

                  {activity.tip && (
                    <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-[11px] text-stone-300 italic flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{activity.tip}</span>
                    </div>
                  )}

                  {/* Complete Button */}
                  <div className="pt-3">
                    <button
                      onClick={() => handleFinishInteractive()}
                      className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50"
                    >
                      <Check className="w-4 h-4" />
                      Mark As Finished (+{activity.xpReward} XP)
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Invite Friend Modal Backdrop */}
        {showInviteModal && (
          <div className="absolute inset-0 bg-black/90 z-20 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Invite a friend to "{activity.title}"
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-stone-300">
                Doing this together in real life or sharing your observations creates meaningful connection without endless comments.
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pt-2">
                {friends.filter(f => f.status === 'friend').map(friend => {
                  const isInvited = invitedFriends.includes(friend.id);
                  return (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/70 border border-stone-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium text-stone-200">{friend.name}</p>
                          <p className="text-[10px] text-stone-300">@{friend.handle}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleInviteFriend(friend.id)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          isInvited
                            ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700 font-medium'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                        }`}
                      >
                        {isInvited ? 'Invited ✓' : 'Invite'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
