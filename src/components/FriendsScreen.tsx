import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  Shield,
  Share2,
  Copy,
  Check,
  Clock,
  MoreVertical,
  Flag,
  UserX,
  Sparkles,
  Link,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FriendsScreen: React.FC = () => {
  const {
    friends,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    blockFriend,
    reportUser,
    challenges,
    toggleJoinChallenge,
    user,
    updateSettings,
    showToast,
  } = useApp();

  const [searchHandle, setSearchHandle] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'challenges'>('friends');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedFriendMenu, setSelectedFriendMenu] = useState<string | null>(null);

  const acceptedFriends = friends.filter(f => f.status === 'friend');
  const pendingIncoming = friends.filter(f => f.status === 'pending_incoming');
  const pendingOutgoing = friends.filter(f => f.status === 'pending_outgoing');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (sendFriendRequest(searchHandle)) {
      setSearchHandle('');
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://elarivane.app/invite?u=${user.handle}`);
    setCopiedLink(true);
    showToast('Personal invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleGrantContacts = () => {
    updateSettings({ contactPermissionGranted: true });
    setShowContactModal(false);
    showToast('Contacts permission acknowledged (No raw addresses are stored or shared)');
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4 md:pt-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white">
          Gentle Fellowship
        </h1>
        <p className="text-xs md:text-sm text-stone-300 mt-1">
          Connect with trusted friends for real-world missions, walks, and collaborative challenges.
        </p>
      </div>

      {/* Invite Link & Contact Permission Bar */}
      <div className="bg-[#121c17] border border-emerald-900/60 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Invite Someone to Join You
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Share an invite link or look up friends by handle. No contact scrapers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyInviteLink}
              className="px-3 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-600/50"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied' : 'Copy Invite Link'}
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-medium rounded-xl border border-stone-800 transition-colors"
            >
              Find Contacts
            </button>
          </div>
        </div>

        {/* Send by Handle */}
        <form onSubmit={handleSendInvite} className="flex gap-2 pt-1 border-t border-emerald-950/60">
          <input
            type="text"
            value={searchHandle}
            onChange={e => setSearchHandle(e.target.value)}
            placeholder="Type friend's handle (e.g. elenar or @julian)"
            className="flex-1 bg-[#0b130f] border border-emerald-950 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder:text-stone-300 focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium rounded-xl flex items-center gap-1 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-[#101813] p-1.5 rounded-2xl border border-emerald-950/60">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'friends'
              ? 'bg-emerald-900 text-emerald-100 font-semibold shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Friends ({acceptedFriends.length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-emerald-900 text-emerald-100 font-semibold shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Requests ({pendingIncoming.length + pendingOutgoing.length})
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'challenges'
              ? 'bg-emerald-900 text-emerald-100 font-semibold shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Group Circles ({challenges.length})
        </button>
      </div>

      {/* TAB 1: ACCEPTED FRIENDS */}
      {activeTab === 'friends' && (
        <div className="space-y-3">
          {acceptedFriends.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Users className="w-8 h-8 text-emerald-600/50 mx-auto" />
              <p className="text-sm">No friends added yet.</p>
              <p className="text-xs text-stone-300">Invite a real friend with your invite link.</p>
            </div>
          ) : (
            acceptedFriends.map(friend => (
              <div
                key={friend.id}
                className="bg-[#121c17] border border-emerald-950/70 p-4 rounded-2xl flex items-center justify-between gap-3 relative group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-11 h-11 rounded-full object-cover border border-emerald-800/40"
                    />
                    {friend.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#121c17]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-100">{friend.name}</h4>
                      <span className="text-[11px] text-stone-300">@{friend.handle}</span>
                    </div>

                    {friend.currentActivity ? (
                      <p className="text-xs text-emerald-300/90 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {friend.currentActivity}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">{friend.bio}</p>
                    )}
                  </div>
                </div>

                {/* More options button */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setSelectedFriendMenu(selectedFriendMenu === friend.id ? null : friend.id)
                    }
                    className="p-2 text-stone-400 hover:text-stone-200 rounded-xl hover:bg-stone-900 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Popover Dropdown */}
                  {selectedFriendMenu === friend.id && (
                    <div className="absolute right-0 top-10 w-44 bg-[#18231c] border border-stone-700 rounded-xl shadow-2xl p-1.5 z-20 space-y-1">
                      <button
                        onClick={() => {
                          removeFriend(friend.id);
                          setSelectedFriendMenu(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-stone-200 hover:bg-stone-800 rounded-lg flex items-center gap-2"
                      >
                        <UserX className="w-3.5 h-3.5 text-amber-400" />
                        Remove Friend
                      </button>
                      <button
                        onClick={() => {
                          blockFriend(friend.id);
                          setSelectedFriendMenu(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-950/40 rounded-lg flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-rose-400" />
                        Block User
                      </button>
                      <button
                        onClick={() => {
                          reportUser(friend.id, 'Inappropriate communication');
                          setSelectedFriendMenu(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-800 rounded-lg flex items-center gap-2"
                      >
                        <Flag className="w-3.5 h-3.5 text-stone-400" />
                        Report User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: PENDING REQUESTS */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {/* Incoming */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Incoming Requests ({pendingIncoming.length})
            </h3>
            {pendingIncoming.length === 0 ? (
              <p className="text-xs text-stone-300 bg-[#121c17] p-3 rounded-xl border border-emerald-950/40">
                No incoming friend requests.
              </p>
            ) : (
              pendingIncoming.map(f => (
                <div
                  key={f.id}
                  className="bg-[#121c17] border border-emerald-950/70 p-3.5 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-200">{f.name}</h4>
                      <p className="text-xs text-stone-300">@{f.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => acceptFriendRequest(f.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium rounded-xl"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => removeFriend(f.id)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 text-xs rounded-xl"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Outgoing */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Sent Requests ({pendingOutgoing.length})
            </h3>
            {pendingOutgoing.length === 0 ? (
              <p className="text-xs text-stone-300 bg-[#121c17] p-3 rounded-xl border border-emerald-950/40">
                No active pending invites sent.
              </p>
            ) : (
              pendingOutgoing.map(f => (
                <div
                  key={f.id}
                  className="bg-[#121c17] border border-emerald-950/70 p-3.5 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-9 h-9 rounded-full object-cover opacity-80"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-stone-300">{f.name}</h4>
                      <p className="text-[11px] text-stone-300">@{f.handle}</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-300 italic">Pending response</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GROUP CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="space-y-3">
          <p className="text-xs text-stone-300">
            Cooperative goals to do real-world things together. No public scoreboards or shame.
          </p>

          {challenges.map(ch => (
            <div
              key={ch.id}
              className="bg-[#121c17] border border-emerald-950/80 p-5 rounded-2xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-serif font-semibold text-white">{ch.title}</h3>
                  <p className="text-xs text-stone-300 mt-0.5">{ch.description}</p>
                </div>
                <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-full">
                  {ch.deadline}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Group progress</span>
                  <span className="font-medium text-emerald-400">
                    {ch.currentCount} / {ch.goalCount} completed
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (ch.currentCount / ch.goalCount) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center justify-between pt-2 border-t border-emerald-950/60">
                <div className="flex items-center -space-x-2">
                  {ch.participants.map(p => (
                    <img
                      key={p.id}
                      src={p.avatar}
                      alt={p.name}
                      title={`${p.name} (${p.contributed} contributed)`}
                      className="w-7 h-7 rounded-full border-2 border-[#121c17] object-cover"
                    />
                  ))}
                  <span className="text-[11px] text-stone-300 pl-3">
                    {ch.participants.length} friends joined
                  </span>
                </div>

                <button
                  onClick={() => toggleJoinChallenge(ch.id)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                    ch.isJoined
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {ch.isJoined ? 'Joined ✓' : 'Join Circle'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Permission Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121d17] border border-emerald-900/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-300">
              <Users className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-serif font-semibold text-white">
                Transparent Contact Permissions
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Elarivane does not upload, sell, or permanently store your address book.
              </p>
            </div>

            <div className="bg-[#0b130f] p-3.5 rounded-xl border border-emerald-950 text-xs text-stone-300 space-y-2">
              <p className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>What will be used:</strong> Local device contact matching to check if an email/phone already uses Elarivane.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Link className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Prefer not to share?</strong> You can always use direct invite links without granting address book access.
                </span>
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleGrantContacts}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Allow & Search
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
