import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { InboxThread, Message } from '../../types/auth';
import { cn } from '../../lib/utils';

const POLL_INTERVAL = 3000; // ms

function getInitials(firstName?: string, lastName?: string, username?: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return (username ?? 'U').slice(0, 2).toUpperCase();
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString('en-GB', { weekday: 'short' });
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const GRADIENTS = [
  'from-sky-500 to-cyan-400',
  'from-orange-500 to-amber-400',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-pink-400',
];
function grad(id: number) { return GRADIENTS[id % GRADIENTS.length]; }

export default function ChatPage() {
  const { user } = useAuth();
  const { userId } = useParams<{ userId?: string }>();
  const selectedId = userId ? parseInt(userId, 10) : null;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Inbox (conversation list) - polled
  const { data: inbox = [] } = useQuery<InboxThread[]>({
    queryKey: ['inbox'],
    queryFn: () => apiClient.getInbox().then((r) => r.data),
    refetchInterval: POLL_INTERVAL,
  });

  // Active conversation - polled
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['conversation', selectedId],
    queryFn: () => apiClient.getConversation(selectedId!).then((r) => r.data),
    enabled: selectedId !== null,
    refetchInterval: POLL_INTERVAL,
  });

  // Scroll to bottom when messages load/update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMut = useMutation({
    mutationFn: ({ toUserId, content }: { toUserId: number; content: string }) =>
      apiClient.sendMessage(toUserId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversation', selectedId] });
      qc.invalidateQueries({ queryKey: ['inbox'] });
    },
  });

  function handleSend() {
    if (!draft.trim() || !selectedId || sendMut.isPending) return;
    sendMut.mutate({ toUserId: selectedId, content: draft.trim() });
    setDraft('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const activeThread = inbox.find((t) => t.partner?.id === selectedId);
  const activeName = activeThread?.partner
    ? (activeThread.partner.first_name && activeThread.partner.last_name
        ? `${activeThread.partner.first_name} ${activeThread.partner.last_name}`
        : activeThread.partner.username)
    : null;

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Sidebar: conversation list ── */}
      <div className={cn(
        'flex w-full flex-col border-r border-white/8 bg-slate-900/60 lg:w-80',
        selectedId ? 'hidden lg:flex' : 'flex',
      )}>
        <div className="flex h-[68px] shrink-0 items-center border-b border-white/8 px-5">
          <h1 className="text-base font-black text-white">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {inbox.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/20">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="mt-3 text-sm text-white/25">No conversations yet.</p>
              <p className="mt-1 text-xs text-white/20">Connect with members to start chatting.</p>
            </div>
          ) : (
            inbox.map((thread) => {
              const isActive = thread.partner?.id === selectedId;
              const partnerName = thread.partner?.first_name && thread.partner?.last_name
                ? `${thread.partner.first_name} ${thread.partner.last_name}`
                : thread.partner?.username;

              return (
                <button
                  key={thread.partner?.id}
                  type="button"
                  onClick={() => navigate(`/dashboard/messages/${thread.partner?.id}`)}
                  className={cn(
                    'flex w-full items-center gap-3 border-b border-white/5 px-4 py-3.5 text-left transition',
                    isActive ? 'bg-sky-500/10' : 'hover:bg-white/5',
                  )}
                >
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-black text-white', grad(thread.partner?.id ?? 0))}>
                    {thread.partner?.avatar ? (
                      <img src={thread.partner.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
                    ) : (
                      getInitials(thread.partner?.first_name, thread.partner?.last_name, thread.partner?.username)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-white">{partnerName}</p>
                      <p className="shrink-0 text-[10px] text-white/25">
                        {thread.latest_message ? formatTime(thread.latest_message.created_at) : ''}
                      </p>
                    </div>
                    <p className={cn('truncate text-xs', thread.unread_count > 0 ? 'font-semibold text-white/70' : 'text-white/35')}>
                      {thread.latest_message?.content ?? 'No messages yet'}
                    </p>
                  </div>
                  {thread.unread_count > 0 ? (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[10px] font-black text-white">
                      {thread.unread_count}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Main: message thread ── */}
      <div className={cn('flex flex-1 flex-col overflow-hidden', !selectedId ? 'hidden lg:flex' : 'flex')}>
        {!selectedId ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-white/30">Select a conversation</p>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="flex h-[68px] shrink-0 items-center gap-3 border-b border-white/8 px-5">
              <button
                type="button"
                onClick={() => navigate('/dashboard/messages')}
                className="mr-1 rounded-lg p-1.5 text-white/40 hover:bg-white/8 hover:text-white lg:hidden"
                aria-label="Back"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {activeThread?.partner ? (
                <>
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-black text-white', grad(activeThread.partner.id ?? 0))}>
                    {getInitials(activeThread.partner.first_name, activeThread.partner.last_name, activeThread.partner.username)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{activeName}</p>
                    {activeThread.partner.occupation ? (
                      <p className="text-[11px] text-white/35">{activeThread.partner.occupation}</p>
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="text-sm font-bold text-white">Conversation</p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <p className="text-sm text-white/25">No messages yet.</p>
                  <p className="mt-1 text-xs text-white/20">Say hello 👋</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((msg, idx) => {
                    const isMine = msg.from_user_id === user?.id;
                    const prevMsg = messages[idx - 1];
                    const showAvatar = !isMine && (idx === 0 || prevMsg?.from_user_id !== msg.from_user_id);
                    const showDate =
                      idx === 0 ||
                      new Date(msg.created_at).toDateString() !== new Date(messages[idx - 1].created_at).toDateString();

                    return (
                      <div key={msg.id}>
                        {showDate ? (
                          <div className="my-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/8" />
                            <span className="text-[11px] font-semibold text-white/25">
                              {new Date(msg.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                            </span>
                            <div className="h-px flex-1 bg-white/8" />
                          </div>
                        ) : null}

                        <div className={cn('flex items-end gap-2', isMine ? 'flex-row-reverse' : 'flex-row')}>
                          {/* Avatar spacer */}
                          {!isMine ? (
                            <div className="mb-0.5 w-7 shrink-0">
                              {showAvatar ? (
                                <div className={cn('flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-black text-white', grad(msg.from_user_id))}>
                                  {getInitials(activeThread?.partner?.first_name, activeThread?.partner?.last_name, activeThread?.partner?.username)}
                                </div>
                              ) : null}
                            </div>
                          ) : null}

                          <div className={cn('group relative max-w-[70%]', isMine ? 'items-end' : 'items-start', 'flex flex-col')}>
                            <div
                              className={cn(
                                'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                                isMine
                                  ? 'rounded-br-sm bg-sky-500 text-white'
                                  : 'rounded-bl-sm bg-white/10 text-white',
                              )}
                            >
                              {msg.content}
                            </div>
                            <span className="mt-0.5 px-1 text-[10px] text-white/20 opacity-0 transition group-hover:opacity-100">
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-white/8 px-4 py-3">
              <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-sky-500/50 transition">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Type a message… (Enter to send)"
                  className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
                  style={{ maxHeight: '120px' }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!draft.trim() || sendMut.isPending}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white transition hover:bg-sky-400 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-white/20">Enter to send · Shift+Enter for new line</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
