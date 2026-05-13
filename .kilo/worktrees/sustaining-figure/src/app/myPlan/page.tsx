'use client';

import { useState, useMemo, useSyncExternalStore, useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { dsaPlan, syllabusSections, TheoryNode, RevisionNode, DayItem, type Problem, getTopicUrl } from '@/lib/dsa-plan';
import { useProgress } from '@/hooks/use-progress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
  BookOpen,
  RotateCcw,
  FlaskConical,
  ListChecks,
  Menu,
  X,
  ExternalLink,
  Settings,
  Bell,
  Link2,
  User,
  Mail,
  Plus,
  Trash2,
  Copy,
  Users,
  UserPlus,
  Check,
  XCircle,
  Flame,
  Share2,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const emptySubscribe = () => () => {};

// ─── localStorage helpers for bind/notifications ───
function getStoredBinds(): { username: string; status: 'pending' | 'accepted' | 'sent' }[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('dsa-binds') || '[]'); } catch { return []; }
}
function saveBinds(binds: { username: string; status: string }[]) {
  localStorage.setItem('dsa-binds', JSON.stringify(binds));
  window.dispatchEvent(new Event('dsa-progress-change'));
}
function getStoredNotifications(): { id: string; type: 'bind_invite' | 'bind_accepted' | 'mail'; from: string; message: string; time: number; read: boolean }[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('dsa-notifications') || '[]'); } catch { return []; }
}
function saveNotifications(notifs: any[]) {
  localStorage.setItem('dsa-notifications', JSON.stringify(notifs));
  window.dispatchEvent(new Event('dsa-progress-change'));
}

function isTheory(item: DayItem): item is TheoryNode {
  return item.type === 'theory';
}
function isRevision(item: DayItem): item is RevisionNode {
  return item.type === 'revision';
}

function sourceLabel(s: string) {
  switch (s) {
    case 'leetcode': return { text: 'LC', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' };
    case 'gfg': return { text: 'GFG', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' };
    case 'codeforces': return { text: 'CF', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    default: return { text: 'Q', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' };
  }
}

function getProblemUrl(prob: Problem): string | null {
  if (prob.url) return prob.url;
  if (prob.source === 'leetcode' && prob.id) {
    const slug = prob.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `https://leetcode.com/problems/${slug}/`;
  }
  if (prob.source === 'codeforces' && prob.id) {
    const match = prob.id.match(/^(\d+)([A-Z])$/);
    if (match) return `https://codeforces.com/problemset/problem/${match[1]}/${match[2]}`;
  }
  if (prob.source === 'gfg') {
    return `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(prob.title)}`;
  }
  return null;
}

const sectionColorMap: Record<string, { bg: string; text: string; bar: string }> = {
  blue:    { bg: 'bg-blue-500',    text: 'text-blue-500',    bar: 'bg-blue-500' },
  cyan:    { bg: 'bg-cyan-500',    text: 'text-cyan-500',    bar: 'bg-cyan-500' },
  violet:  { bg: 'bg-violet-500',  text: 'text-violet-500',  bar: 'bg-violet-500' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-500', bar: 'bg-emerald-500' },
  orange:  { bg: 'bg-orange-500',  text: 'text-orange-500',  bar: 'bg-orange-500' },
  rose:    { bg: 'bg-rose-500',    text: 'text-rose-500',    bar: 'bg-rose-500' },
  amber:   { bg: 'bg-amber-500',   text: 'text-amber-500',   bar: 'bg-amber-500' },
  teal:    { bg: 'bg-teal-500',    text: 'text-teal-500',    bar: 'bg-teal-500' },
  indigo:  { bg: 'bg-indigo-500',  text: 'text-indigo-500',  bar: 'bg-indigo-500' },
  lime:    { bg: 'bg-lime-500',    text: 'text-lime-500',    bar: 'bg-lime-500' },
  fuchsia: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-500', bar: 'bg-fuchsia-500' },
  sky:     { bg: 'bg-sky-500',     text: 'text-sky-500',     bar: 'bg-sky-500' },
  pink:    { bg: 'bg-pink-500',    text: 'text-pink-500',    bar: 'bg-pink-500' },
  yellow:  { bg: 'bg-yellow-500',  text: 'text-yellow-500',  bar: 'bg-yellow-500' },
  red:     { bg: 'bg-red-500',     text: 'text-red-500',     bar: 'bg-red-500' },
  green:   { bg: 'bg-green-500',   text: 'text-green-500',   bar: 'bg-green-500' },
  purple:  { bg: 'bg-purple-500',  text: 'text-purple-500',  bar: 'bg-purple-500' },
};
const defaultColor = { bg: 'bg-slate-500', text: 'text-slate-500', bar: 'bg-slate-500' };

// Avatar colors for bound friends
const avatarColors = [
  'bg-violet-500', 'bg-blue-500', 'bg-cyan-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500',
  'bg-indigo-500', 'bg-pink-500', 'bg-fuchsia-500', 'bg-sky-500',
];
function getAvatarColor(username: string): string {
  const seed = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarColors[seed % avatarColors.length];
}
function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}
// Check if a bind partner completed ALL problems in a theory topic
function partnerCompletedTopic(username: string, dayNum: number, topicTitle: string, problemsCount: number): boolean {
  const seed = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let pi = 0; pi < problemsCount; pi++) {
    if (((seed * 7 + dayNum * 13 + pi * 3) % 10) <= 4) return false;
  }
  return true;
}
// Check if a bind partner completed ALL revision items in a revision topic
function partnerCompletedRevision(username: string, dayNum: number, topicTitle: string, itemsCount: number): boolean {
  const seed = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let ri = 0; ri < itemsCount; ri++) {
    if (((seed * 7 + dayNum * 13 + ri * 3) % 10) <= 5) return false;
  }
  return true;
}

function fireConfetti() {
  const duration = 1200;
  const end = Date.now() + duration;
  const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f97316', '#ec4899', '#eab308'];
  confetti({ particleCount: 120, spread: 90, origin: { y: 0 }, zIndex: 9999, colors, startVelocity: 55, gravity: 2.5, ticks: 60 });
  const interval = setInterval(() => {
    if (Date.now() > end) { clearInterval(interval); return; }
    confetti({ particleCount: 8, angle: 60, spread: 55, origin: { x: 0, y: 0 }, zIndex: 9999, colors, startVelocity: 45, gravity: 2.5, ticks: 50 });
    confetti({ particleCount: 8, angle: 120, spread: 55, origin: { x: 1, y: 0 }, zIndex: 9999, colors, startVelocity: 45, gravity: 2.5, ticks: 50 });
  }, 40);
}

// ─── Settings Drawer (Bottom) ───
type SettingsTab = 'account' | 'mails' | 'bind' | 'sharing' | 'author' | 'about';

function SettingsDrawer({
  open, onClose, userName, onResetProgress, theme, onCycleTheme, overallPct, daysCompleted, totalItems, completedCount, sharingEnabled, onToggleSharing,
}: {
  open: boolean; onClose: () => void; userName: string; onResetProgress: () => void;
  theme: string | undefined; onCycleTheme: () => void; overallPct: number; daysCompleted: number; totalItems: number; completedCount: number;
  sharingEnabled: boolean; onToggleSharing: () => void;
}) {
  const [tab, setTab] = useState<SettingsTab>('account');
  const [bindInput, setBindInput] = useState('');
  const [binds, setBinds] = useState(getStoredBinds());
  const [emails, setEmails] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('dsa-emails') || '[]'); } catch { return []; }
  });
  const [mailUpdates, setMailUpdates] = useState(() => localStorage.getItem('dsa-mail-updates') !== 'false');
  const [newEmail, setNewEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidUsername = (u: string) => /^[a-zA-Z0-9_]{3,20}$/.test(u);

  const addBind = () => {
    if (!isValidUsername(bindInput) || bindInput === userName) return;
    if (binds.find(b => b.username === bindInput)) return;
    const updated = [...binds, { username: bindInput, status: 'sent' as const }];
    setBinds(updated);
    saveBinds(updated);
    const notifs = getStoredNotifications();
    notifs.unshift({ id: Date.now().toString(), type: 'bind_invite', from: userName, message: `${userName} wants to bind with you`, time: Date.now(), read: false });
    saveNotifications(notifs);
    setBindInput('');
  };

  const removeBind = (username: string) => {
    const updated = binds.filter(b => b.username !== username);
    setBinds(updated);
    saveBinds(updated);
  };

  const addEmail = () => {
    if (!isValidEmail(newEmail) || emails.includes(newEmail)) return;
    const updated = [...emails, newEmail];
    setEmails(updated);
    localStorage.setItem('dsa-emails', JSON.stringify(updated));
    setNewEmail('');
  };

  const removeEmail = (email: string) => {
    const defaultEmail = `${userName}@gmail.com`;
    if (email === defaultEmail) return;
    const updated = emails.filter(e => e !== email);
    setEmails(updated);
    localStorage.setItem('dsa-emails', JSON.stringify(updated));
  };

  const toggleMailUpdates = () => {
    const next = !mailUpdates;
    setMailUpdates(next);
    localStorage.setItem('dsa-mail-updates', String(next));
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/${userName}/progress`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { key: 'account', label: 'Account', icon: <User className="h-4 w-4" /> },
    { key: 'mails', label: 'Mails', icon: <Mail className="h-4 w-4" /> },
    { key: 'bind', label: 'Bind', icon: <Link2 className="h-4 w-4" /> },
    { key: 'sharing', label: 'Sharing', icon: <Share2 className="h-4 w-4" /> },
    { key: 'author', label: 'Author', icon: <GraduationCap className="h-4 w-4" /> },
    { key: 'about', label: 'About', icon: <Flame className="h-4 w-4" /> },
  ];

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) onClose(); }} direction="bottom">
      <DrawerContent className="h-[85vh] !left-[4%] !right-[4%] sm:!left-[12%] sm:!right-[12%] md:!left-[22%] md:!right-[22%] lg:!left-[30%] lg:!right-[30%] !rounded-t-2xl shadow-2xl border">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-sm font-bold">Settings</DrawerTitle>
          <DrawerDescription className="sr-only">Manage your account settings</DrawerDescription>
        </DrawerHeader>

        {/* Vertical pill tabs + content layout */}
        <div className="flex flex-1 min-h-0">
          {/* Vertical pill tab sidebar */}
          <div className="flex flex-col gap-1 px-2 py-2 border-r shrink-0 overflow-y-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all ${
                  tab === t.key
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5 pb-16">
            {tab === 'account' && (
              <div className="space-y-5 max-w-md mx-auto">
                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-primary/60" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">@{userName}</div>
                    <div className="text-[11px] text-muted-foreground">Your account</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="text-base font-bold tabular-nums">{daysCompleted}<span className="text-muted-foreground font-normal text-xs">/60</span></div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Days</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="text-base font-bold tabular-nums">{completedCount}<span className="text-muted-foreground font-normal text-xs">/{totalItems}</span></div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Problems</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="text-base font-bold tabular-nums">{overallPct}<span className="text-muted-foreground font-normal text-xs">%</span></div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Overall</div>
                  </div>
                </div>

                {/* Theme */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Appearance</div>
                  <button onClick={onCycleTheme} className="w-full flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5 hover:bg-muted/70 transition-colors">
                    <span className="text-xs">Theme</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : theme === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
                      {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'}
                    </div>
                  </button>
                </div>

                {/* Danger zone */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-medium text-destructive/80">Danger Zone</div>
                  <Button variant="outline" size="sm" onClick={onResetProgress} className="w-full gap-2 text-destructive hover:bg-destructive/10 border-destructive/20 h-9">
                    <RotateCcw className="h-3.5 w-3.5" /> Reset All Progress
                  </Button>
                </div>
              </div>
            )}

            {tab === 'mails' && (
              <div className="space-y-5 max-w-md mx-auto">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Email Notifications</div>
                  <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <Checkbox id="sett-mail" checked={mailUpdates} onCheckedChange={toggleMailUpdates} className="mt-0.5" />
                    <label htmlFor="sett-mail" className="text-xs leading-snug cursor-pointer">
                      <span className="font-medium">Email me progress updates</span>
                      <br />
                      <span className="text-muted-foreground text-[10px]">Weekly summaries & milestone notifications</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Manage Emails</div>
                  <div className="flex gap-2">
                    <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEmail()} placeholder="email@example.com" className="flex-1 h-9 text-xs bg-muted/30" type="email" />
                    <Button variant="outline" size="sm" onClick={addEmail} disabled={!isValidEmail(newEmail)} className="h-9 px-3">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {emails.length > 0 && (
                    <div className="space-y-1">
                      {emails.map(email => (
                        <div key={email} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs flex-1 truncate">{email}</span>
                          {email === `${userName}@gmail.com` ? (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">Primary</span>
                          ) : (
                            <button onClick={() => removeEmail(email)} className="text-muted-foreground/50 hover:text-destructive transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'bind' && (
              <div className="space-y-5 max-w-md mx-auto">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Bind with other users</div>
                  <p className="text-[11px] text-muted-foreground/60">Compare progress side-by-side with study partners. Enter their username to send a bind invite.</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">@</span>
                      <Input value={bindInput} onChange={e => setBindInput(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} onKeyDown={e => e.key === 'Enter' && addBind()} placeholder="username" className="pl-6 h-9 text-xs bg-muted/30" maxLength={20} />
                    </div>
                    <Button variant="outline" size="sm" onClick={addBind} disabled={!isValidUsername(bindInput) || bindInput === userName} className="h-9 gap-1.5 px-3">
                      <UserPlus className="h-3.5 w-3.5" /> Bind
                    </Button>
                  </div>
                </div>

                {binds.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-muted-foreground">Bound Users</div>
                    {binds.map(b => (
                      <div key={b.username} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-3.5 w-3.5 text-primary/60" />
                        </div>
                        <span className="text-xs font-medium flex-1">@{b.username}</span>
                        <Badge variant="outline" className={`text-[9px] h-5 px-1.5 ${
                          b.status === 'accepted' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                          b.status === 'pending' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' :
                          'text-blue-500 border-blue-500/20 bg-blue-500/5'
                        }`}>
                          {b.status}
                        </Badge>
                        <button onClick={() => removeBind(b.username)} className="text-muted-foreground/50 hover:text-destructive transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {binds.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground/40">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No bound users yet</p>
                    <p className="text-[10px]">Add a study partner to compare progress</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'sharing' && (
              <div className="space-y-5 max-w-md mx-auto">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Public Profile Sharing</div>
                  <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <Checkbox id="sett-sharing" checked={sharingEnabled} onCheckedChange={onToggleSharing} className="mt-0.5" />
                    <label htmlFor="sett-sharing" className="text-xs leading-snug cursor-pointer">
                      <span className="font-medium">Enable public sharing</span>
                      <br />
                      <span className="text-muted-foreground text-[10px]">Allow others to view your progress page</span>
                    </label>
                  </div>
                </div>

                {sharingEnabled && (
                  <>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Your Progress Link</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2.5 text-[11px] text-muted-foreground truncate">
                          {typeof window !== 'undefined' ? window.location.origin : ''}/{userName}/progress
                        </div>
                        <Button variant="outline" size="sm" onClick={copyShareLink} className="h-9 gap-1.5 px-3">
                          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 space-y-1">
                      <div className="text-[11px] font-medium text-primary">Sharing is active</div>
                      <p className="text-[10px] text-muted-foreground">Anyone with the link can see your day-by-day progress. A share icon will appear next to settings for quick link copying.</p>
                    </div>
                  </>
                )}

                {!sharingEnabled && (
                  <div className="text-center py-4 text-muted-foreground/40">
                    <Share2 className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Sharing is disabled</p>
                    <p className="text-[10px]">Enable to make your progress page public</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'author' && (
              <div className="space-y-3 max-w-lg mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">About the Author</span>
                </div>
                <div className="rounded-lg border bg-muted/20 overflow-hidden" style={{ height: '55vh' }}>
                  <iframe
                    src="https://rootlynk.itsranbir.me"
                    className="w-full h-full border-0"
                    title="Author - Rootlynk"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {tab === 'about' && (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">DSA Study Plan</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A 60-day structured study plan covering arrays to advanced algorithms, with 360+ curated LeetCode, GFG & Codeforces problems. Track your progress, bind with study partners, and ace your interviews.
                </p>
                <div className="text-[10px] text-muted-foreground/40">
                  Built for interview prep
                </div>
              </div>
            )}

            {/* Extra empty space at bottom for comfortable scrolling */}
            <div className="h-24 shrink-0" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Notifications Drawer (Bottom) ───
function NotificationsDrawer({ open, onClose, userName }: { open: boolean; onClose: () => void; userName: string }) {
  const [notifications, setNotifications] = useState(getStoredNotifications());

  useEffect(() => {
    if (open) setNotifications(getStoredNotifications());
  }, [open]);

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const acceptBind = (id: string, from: string) => {
    const binds = getStoredBinds();
    const existing = binds.find(b => b.username === from);
    if (existing) {
      existing.status = 'accepted';
    } else {
      binds.push({ username: from, status: 'accepted' });
    }
    saveBinds(binds);
    markRead(id);
  };

  const clearAll = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) onClose(); }} direction="bottom">
      <DrawerContent className="h-[85vh] !left-[4%] !right-[4%] sm:!left-[12%] sm:!right-[12%] md:!left-[22%] md:!right-[22%] lg:!left-[30%] lg:!right-[30%] !rounded-t-2xl shadow-2xl border">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <DrawerTitle className="text-sm font-bold">Notifications</DrawerTitle>
              {unreadCount > 0 && (
                <Badge className="h-4 px-1.5 text-[9px] bg-primary text-primary-foreground">{unreadCount}</Badge>
              )}
            </div>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-[10px] text-muted-foreground">
                Clear all
              </Button>
            )}
          </div>
          <DrawerDescription className="sr-only">Your notifications and bind invites</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground/40">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 ${n.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-2">
                    <div className={`shrink-0 mt-0.5 h-2 w-2 rounded-full ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {n.type === 'bind_invite' && <Link2 className="h-3 w-3 text-blue-500" />}
                        {n.type === 'bind_accepted' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                        {n.type === 'mail' && <Mail className="h-3 w-3 text-amber-500" />}
                        <span className="text-xs font-medium">{n.from}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{n.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] text-muted-foreground/40">{new Date(n.time).toLocaleDateString()}</span>
                        {n.type === 'bind_invite' && !n.read && (
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => acceptBind(n.id, n.from)} className="h-5 text-[9px] px-2 gap-0.5">
                              <Check className="h-2.5 w-2.5" /> Accept
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} className="h-5 text-[9px] px-2 text-muted-foreground">
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Bind Compare Drawer (Bottom) ───
function BindDrawer({ open, onClose, completedTopics }: { open: boolean; onClose: () => void; completedTopics: Record<string, boolean> }) {
  const [binds] = useState(getStoredBinds());
  const [selectedBind, setSelectedBind] = useState<string | null>(null);

  const acceptedBinds = binds.filter(b => b.status === 'accepted');

  const myDayCompletion = useMemo(() => {
    const result: Record<number, { done: number; total: number }> = {};
    for (const d of dsaPlan) {
      let done = 0, total = 0;
      for (const item of d.items) {
        if (isTheory(item)) { total += item.problems.length; for (let pi = 0; pi < item.problems.length; pi++) { if (completedTopics[`${d.day}-p-${pi}-${item.title}`]) done++; } }
        if (isRevision(item)) { total += item.items.length; for (let ri = 0; ri < item.items.length; ri++) { if (completedTopics[`${d.day}-r-${ri}-${item.title}`]) done++; } }
      }
      result[d.day] = { done, total };
    }
    return result;
  }, [completedTopics]);

  const partnerDayCompletion = useMemo(() => {
    if (!selectedBind) return {};
    const seed = selectedBind.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const result: Record<number, { done: number; total: number }> = {};
    for (const d of dsaPlan) {
      let done = 0, total = 0;
      for (const item of d.items) {
        if (isTheory(item)) { total += item.problems.length; for (let pi = 0; pi < item.problems.length; pi++) { if (((seed * 7 + d.day * 13 + pi * 3) % 10) > 4) done++; } }
        if (isRevision(item)) { total += item.items.length; for (let ri = 0; ri < item.items.length; ri++) { if (((seed * 7 + d.day * 13 + ri * 3) % 10) > 5) done++; } }
      }
      result[d.day] = { done, total };
    }
    return result;
  }, [selectedBind]);

  const myCompleted = useMemo(() => {
    let c = 0;
    for (const d of dsaPlan) { const comp = myDayCompletion[d.day]; if (comp && comp.done === comp.total && comp.total > 0) c++; }
    return c;
  }, [myDayCompletion]);

  const partnerCompleted = useMemo(() => {
    let c = 0;
    for (const d of dsaPlan) { const comp = partnerDayCompletion[d.day]; if (comp && comp.done === comp.total && comp.total > 0) c++; }
    return c;
  }, [partnerDayCompletion]);

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) onClose(); }} direction="bottom">
      <DrawerContent className="h-[85vh] !left-[4%] !right-[4%] sm:!left-[12%] sm:!right-[12%] md:!left-[22%] md:!right-[22%] lg:!left-[30%] lg:!right-[30%] !rounded-t-2xl shadow-2xl border">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-sm font-bold flex items-center gap-1.5">
            <Link2 className="h-4 w-4 text-primary" /> Bind Compare
          </DrawerTitle>
          <DrawerDescription className="sr-only">Compare your progress with bound study partners</DrawerDescription>
        </DrawerHeader>

        {acceptedBinds.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground/40">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No accepted binds yet</p>
            <p className="text-[10px]">Add study partners in Settings → Bind</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Partner selector */}
            <div className="px-4 py-3 border-b flex gap-1.5 flex-wrap">
              {acceptedBinds.map(b => (
                <button
                  key={b.username}
                  onClick={() => setSelectedBind(b.username)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                    selectedBind === b.username ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <User className="h-3 w-3" />
                  @{b.username}
                </button>
              ))}
            </div>

            {selectedBind && (
              <div className="p-4 space-y-4">
                {/* Comparison header */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <div className="rounded-lg border p-3 text-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-xs font-bold">You</div>
                    <div className="text-lg font-bold text-primary">{myCompleted}/60</div>
                    <div className="text-[10px] text-muted-foreground">days done</div>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-1.5">
                      <User className="h-4 w-4 text-violet-500" />
                    </div>
                    <div className="text-xs font-bold">@{selectedBind}</div>
                    <div className="text-lg font-bold text-violet-500">{partnerCompleted}/60</div>
                    <div className="text-[10px] text-muted-foreground">days done</div>
                  </div>
                </div>

                {/* Day-by-day comparison */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Day-by-Day</h4>
                  <div className="space-y-0.5 max-w-sm mx-auto">
                    {dsaPlan.map(d => {
                      const my = myDayCompletion[d.day];
                      const partner = partnerDayCompletion[d.day];
                      const myDone = my && my.done === my.total && my.total > 0;
                      const partnerDone = partner && partner.done === partner.total && partner.total > 0;
                      return (
                        <div key={d.day} className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono w-5 text-right text-muted-foreground/40">{d.day}</span>
                          <div className={`h-2 flex-1 rounded-sm ${myDone ? 'bg-primary' : my && my.done > 0 ? 'bg-primary/30' : 'bg-muted/30'}`} />
                          <div className={`h-2 flex-1 rounded-sm ${partnerDone ? 'bg-violet-500' : partner && partner.done > 0 ? 'bg-violet-500/30' : 'bg-muted/30'}`} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-2 max-w-sm mx-auto">
                    <div className="flex items-center gap-1"><div className="h-2 w-3 rounded-sm bg-primary" /><span className="text-[9px] text-muted-foreground">You</span></div>
                    <div className="flex items-center gap-1"><div className="h-2 w-3 rounded-sm bg-violet-500" /><span className="text-[9px] text-muted-foreground">@{selectedBind}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

// ─── Main Page ───
export default function MyPlanPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set());
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [bindDrawerOpen, setBindDrawerOpen] = useState(false);
  const [sharingEnabled, setSharingEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('dsa-sharing-enabled') === 'true';
  });
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const { completedTopics, toggleTopic, resetProgress } = useProgress();

  const prevDayCompleteRef = useRef({} as Record<number, boolean>);
  const day = dsaPlan.find((d) => d.day === selectedDay);

  useEffect(() => {
    const userName = localStorage.getItem('dsa-user-name');
    if (!userName) router.replace('/landing');
  }, [router]);

  useMemo(() => {
    const activeSection = syllabusSections.find(s => selectedDay >= s.dayRange[0] && selectedDay <= s.dayRange[1]);
    if (activeSection && !expandedSections.has(activeSection.title)) {
      setExpandedSections(prev => new Set([...prev, activeSection.title]));
    }
  }, [selectedDay]);

  const toggleExpand = (key: string) => {
    setCollapsedItems((prev) => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  };
  const isItemExpanded = (key: string) => !collapsedItems.has(key);
  const toggleSection = (title: string) => {
    setExpandedSections((prev) => { const next = new Set(prev); if (next.has(title)) next.delete(title); else next.add(title); return next; });
  };

  const sectionSubtopics = useMemo(() => {
    const result: Record<string, { day: number; topics: string[] }[]> = {};
    for (const section of syllabusSections) {
      const days: { day: number; topics: string[] }[] = [];
      for (let d = section.dayRange[0]; d <= section.dayRange[1]; d++) {
        const dayPlan = dsaPlan.find(p => p.day === d);
        if (!dayPlan) continue;
        const topics: string[] = [];
        for (const item of dayPlan.items) { if (isTheory(item)) topics.push(item.title); }
        if (topics.length > 0) days.push({ day: d, topics });
      }
      result[section.title] = days;
    }
    return result;
  }, []);

  const completedCount = useMemo(() => Object.values(completedTopics).filter(Boolean).length, [completedTopics]);
  const daysCompleted = useMemo(() => {
    let c = 0;
    for (const d of dsaPlan) {
      let allDone = true;
      for (const item of d.items) {
        if (isTheory(item)) { for (let pi = 0; pi < item.problems.length; pi++) { if (!completedTopics[`${d.day}-p-${pi}-${item.title}`]) { allDone = false; break; } } }
        if (isRevision(item)) { for (let ri = 0; ri < item.items.length; ri++) { if (!completedTopics[`${d.day}-r-${ri}-${item.title}`]) { allDone = false; break; } } }
        if (!allDone) break;
      }
      if (allDone) c++;
    }
    return c;
  }, [completedTopics]);

  const totalProblems = useMemo(() => { let count = 0; for (const d of dsaPlan) { for (const item of d.items) { if (isTheory(item)) count += item.problems.length; } } return count; }, []);
  const totalItems = totalProblems + dsaPlan.reduce((s, d) => s + d.items.filter(isRevision).reduce((s2, r) => s2 + (r as RevisionNode).items.length, 0), 0);
  const overallPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const dayDoneCount = useMemo(() => {
    if (!day) return 0;
    let c = 0;
    for (const item of day.items) {
      if (isTheory(item)) { for (let pi = 0; pi < item.problems.length; pi++) { if (completedTopics[`${day.day}-p-${pi}-${item.title}`]) c++; } }
      if (isRevision(item)) { for (let ri = 0; ri < item.items.length; ri++) { if (completedTopics[`${day.day}-r-${ri}-${item.title}`]) c++; } }
    }
    return c;
  }, [day, completedTopics]);

  const dayTotalCount = useMemo(() => {
    if (!day) return 1;
    let c = 0;
    for (const item of day.items) { if (isTheory(item)) c += item.problems.length; if (isRevision(item)) c += item.items.length; }
    return c;
  }, [day]);

  const dayPct = dayTotalCount > 0 ? Math.round((dayDoneCount / dayTotalCount) * 100) : 0;
  const go = (dir: number) => setSelectedDay((p) => (p + dir >= 1 && p + dir <= 60 ? p + dir : p));
  const cycleTheme = () => { if (theme === 'light') setTheme('dark'); else if (theme === 'dark') setTheme('system'); else setTheme('light'); };
  const toggleSharing = () => {
    const next = !sharingEnabled;
    setSharingEnabled(next);
    localStorage.setItem('dsa-sharing-enabled', String(next));
  };
  const copyProgressLink = () => {
    const url = `${window.location.origin}/${userName}/progress`;
    navigator.clipboard.writeText(url);
  };

  // Auto-scroll sidebar to selected day & ensure section is expanded
  useEffect(() => {
    const section = syllabusSections.find(s => selectedDay >= s.dayRange[0] && selectedDay <= s.dayRange[1]);
    if (section && !expandedSections.has(section.title)) {
      setExpandedSections(prev => new Set([...prev, section!.title]));
    }
    // Small delay to allow section to expand before scrolling
    const timer = setTimeout(() => {
      if (!sidebarScrollRef.current) return;
      const target = sidebarScrollRef.current.querySelector(`[data-sidebar-day="${selectedDay}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedDay]);

  const highlightedDays = useMemo(() => {
    if (!hoveredSection) return new Set<number>();
    const section = syllabusSections.find(s => s.title === hoveredSection);
    if (!section) return new Set<number>();
    const days = new Set<number>();
    for (let d = section.dayRange[0]; d <= section.dayRange[1]; d++) days.add(d);
    return days;
  }, [hoveredSection]);

  const sectionCompletion = useMemo(() => {
    const result: Record<string, { done: number; total: number }> = {};
    for (const section of syllabusSections) {
      let done = 0, total = 0;
      for (let d = section.dayRange[0]; d <= section.dayRange[1]; d++) {
        const dayPlan = dsaPlan.find(p => p.day === d);
        if (!dayPlan) continue;
        for (const item of dayPlan.items) {
          if (isTheory(item)) { total += item.problems.length; for (let pi = 0; pi < item.problems.length; pi++) { if (completedTopics[`${d}-p-${pi}-${item.title}`]) done++; } }
          if (isRevision(item)) { total += item.items.length; for (let ri = 0; ri < item.items.length; ri++) { if (completedTopics[`${d}-r-${ri}-${item.title}`]) done++; } }
        }
      }
      result[section.title] = { done, total };
    }
    return result;
  }, [completedTopics]);

  const dayCompletion = useMemo(() => {
    const result: Record<number, { done: number; total: number }> = {};
    for (const d of dsaPlan) {
      let done = 0, total = 0;
      for (const item of d.items) {
        if (isTheory(item)) { total += item.problems.length; for (let pi = 0; pi < item.problems.length; pi++) { if (completedTopics[`${d.day}-p-${pi}-${item.title}`]) done++; } }
        if (isRevision(item)) { total += item.items.length; for (let ri = 0; ri < item.items.length; ri++) { if (completedTopics[`${d.day}-r-${ri}-${item.title}`]) done++; } }
      }
      result[d.day] = { done, total };
    }
    return result;
  }, [completedTopics]);

  useEffect(() => {
    for (const d of dsaPlan) {
      const comp = dayCompletion[d.day];
      const isComplete = comp && comp.done === comp.total && comp.total > 0;
      const wasComplete = prevDayCompleteRef.current[d.day] || false;
      if (isComplete && !wasComplete) fireConfetti();
      prevDayCompleteRef.current[d.day] = isComplete;
    }
  }, [dayCompletion]);

  // Count unread notifications
  const unreadNotifCount = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    try { return getStoredNotifications().filter(n => !n.read).length; } catch { return 0; }
  }, [completedTopics]); // re-evaluate when progress changes

  const userName = typeof window !== 'undefined' ? localStorage.getItem('dsa-user-name') || '' : '';
  const acceptedBinds = typeof window !== 'undefined' ? getStoredBinds().filter(b => b.status === 'accepted') : [];

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Drawers */}
      <SettingsDrawer
        open={settingsOpen} onClose={() => setSettingsOpen(false)} userName={userName}
        onResetProgress={resetProgress} theme={theme} onCycleTheme={cycleTheme}
        overallPct={overallPct} daysCompleted={daysCompleted} totalItems={totalItems} completedCount={completedCount}
        sharingEnabled={sharingEnabled} onToggleSharing={toggleSharing}
      />
      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} userName={userName} />
      <BindDrawer open={bindDrawerOpen} onClose={() => setBindDrawerOpen(false)} completedTopics={completedTopics} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
        h-screen w-[280px] lg:w-[260px] xl:w-[280px]
        bg-background border-r
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Sidebar Header — cleaned up, only settings/bell/bind/close */}
        <div className="px-4 pt-4 pb-3 border-b">
          <div className="flex items-center justify-between mb-2.5">
            <h1 className="text-sm font-bold tracking-tight">DSA Study Plan</h1>
            <div className="flex items-center gap-0.5">
              {acceptedBinds.length > 0 && (
                <Button variant="ghost" size="icon" onClick={() => setBindDrawerOpen(true)} className="h-7 w-7 text-violet-500 hover:text-violet-600" title="Bind compare">
                  <Link2 className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setNotifOpen(true)} className="h-7 w-7 relative text-muted-foreground hover:text-foreground" title="Notifications">
                <Bell className="h-3.5 w-3.5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-3 min-w-[12px] flex items-center justify-center rounded-full bg-primary text-[7px] text-primary-foreground font-bold px-0.5">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Settings">
                <Settings className="h-3.5 w-3.5" />
              </Button>
              {sharingEnabled && (
                <Button variant="ghost" size="icon" onClick={copyProgressLink} className="h-7 w-7 text-primary hover:text-primary/80" title="Copy progress link">
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-muted-foreground">{daysCompleted}/60 days</span>
            <span className="text-[11px] font-semibold">{overallPct}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        {/* Tree Syllabus List */}
        <div ref={sidebarScrollRef} className="sidebar-scroll flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          {syllabusSections.map((section) => {
            const completion = sectionCompletion[section.title];
            const isCompleted = completion && completion.done === completion.total && completion.total > 0;
            const isPartial = completion && completion.done > 0 && completion.done < completion.total;
            const isSelected = selectedDay >= section.dayRange[0] && selectedDay <= section.dayRange[1];
            const isExpanded = expandedSections.has(section.title);
            const subtopics = sectionSubtopics[section.title] || [];
            const pct = completion && completion.total > 0 ? Math.round((completion.done / completion.total) * 100) : 0;
            const colors = sectionColorMap[section.color] || defaultColor;

            return (
              <div key={section.title}>
                <div onClick={() => toggleSection(section.title)} onMouseEnter={() => setHoveredSection(section.title)} onMouseLeave={() => setHoveredSection(null)}
                  className={`cursor-pointer rounded-lg transition-colors duration-150 ${isSelected ? 'bg-muted/60' : 'hover:bg-muted/30'}`}>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className={`shrink-0 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}><ChevronDown className="h-3 w-3 text-muted-foreground/50" /></span>
                    <span className={`shrink-0 h-2 w-2 rounded-full ${colors.bg}`} />
                    <span className={`text-[13px] leading-tight flex-1 truncate ${isSelected ? 'font-semibold' : 'font-medium text-foreground/80'}`}>{section.title}</span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <span className="text-[10px] text-muted-foreground/40 font-mono">{section.dayRange[0]}–{section.dayRange[1]}</span>
                      {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                      {!isCompleted && isPartial && <span className="text-[10px] font-semibold text-muted-foreground/50 tabular-nums">{pct}%</span>}
                    </div>
                  </div>
                </div>

                {isExpanded && subtopics.length > 0 && (
                  <div className="relative flex ml-[22px] mt-0.5">
                    <div className="relative w-[6px] shrink-0 mr-2 my-1">
                      <div className="absolute inset-0 rounded-full bg-muted/50" />
                      <div className={`absolute top-0 left-0 right-0 rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : colors.bar}`} style={{ height: `${pct}%` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {subtopics.map((sub) => {
                        const dayComp = dayCompletion[sub.day];
                        const dayDone = dayComp ? dayComp.done : 0;
                        const dayTotal = dayComp ? dayComp.total : 0;
                        const dayAllDone = dayDone === dayTotal && dayTotal > 0;
                        const isDaySelected = selectedDay === sub.day;
                        return (
                          <button key={sub.day} data-sidebar-day={sub.day} onClick={() => { setSelectedDay(sub.day); setSidebarOpen(false); }}
                            onMouseEnter={() => setHoveredDay(sub.day)} onMouseLeave={() => setHoveredDay(null)}
                            className={`w-full text-left pr-2 py-1.5 transition-colors duration-100 rounded-r-md flex items-center gap-2 ${isDaySelected ? 'bg-primary/8' : hoveredDay === sub.day ? 'bg-primary/5' : 'hover:bg-muted/25'}`}>
                            <span className={`shrink-0 text-[10px] font-bold font-mono h-5 min-w-[24px] flex items-center justify-center rounded-[4px] transition-colors ${
                              isDaySelected ? 'bg-primary text-primary-foreground' : dayAllDone ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted/40 text-muted-foreground/50'
                            }`}>
                              {dayAllDone && !isDaySelected ? '\u2713' : sub.day}
                            </span>
                            <span className={`text-[12px] leading-snug truncate flex-1 ${isDaySelected ? 'font-medium' : 'text-foreground/60'}`}>{sub.topics[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* CENTER — Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar (mobile) */}
        <header className="border-b px-4 py-3 flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-bold flex-1">DSA Study Plan</h1>
          <span className="text-xs text-muted-foreground">{daysCompleted}/60 · {overallPct}%</span>
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className="h-7 w-7">
            <Settings className="h-3.5 w-3.5" />
          </Button>
          {sharingEnabled && (
            <Button variant="ghost" size="icon" onClick={copyProgressLink} className="h-7 w-7 text-primary">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </header>

        {/* Day Nav */}
        <div className="border-b">
          <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => go(-1)} disabled={selectedDay === 1} className="gap-1 h-8">
              <ChevronLeft className="h-4 w-4" /><span className="hidden sm:inline text-xs">Day {selectedDay - 1}</span>
            </Button>
            <div className="text-center">
              <div className="text-sm font-semibold">Day {selectedDay} <span className="text-muted-foreground font-normal">· {dayPct}% done</span></div>
              <div className="w-32 h-1 mt-1.5 mx-auto bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${dayPct}%` }} />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => go(1)} disabled={selectedDay === 60} className="gap-1 h-8">
              <span className="hidden sm:inline text-xs">Day {selectedDay + 1}</span><ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 py-4">
            {day && (
              <div className="space-y-2">
                {day.items.map((item, itemIdx) => {
                  const itemKey = `${day.day}-${itemIdx}`;
                  const isExpanded = isItemExpanded(itemKey);

                  if (isTheory(item)) {
                    return (
                      <div key={itemIdx} className="rounded-lg border overflow-hidden">
                        <button onClick={() => toggleExpand(itemKey)} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-muted/30 transition-colors text-left">
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRightIcon className="h-4 w-4 text-muted-foreground shrink-0" />}
                          <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                          <span className="text-sm font-semibold flex-1">{item.title}</span>
                          {getTopicUrl(item.title) && (
                            <a href={getTopicUrl(item.title)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 p-1 rounded-md text-muted-foreground/50 hover:text-blue-500 hover:bg-blue-500/10 transition-colors" title="Learn this topic">
                              <GraduationCap className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {acceptedBinds.filter(b => partnerCompletedTopic(b.username, day.day, item.title, item.problems.length)).length > 0 && (
                            <div className="flex -space-x-1.5 shrink-0">
                              {acceptedBinds.filter(b => partnerCompletedTopic(b.username, day.day, item.title, item.problems.length)).map(b => (
                                <div
                                  key={b.username}
                                  className={`h-5 w-5 rounded-full ${getAvatarColor(b.username)} flex items-center justify-center text-[7px] font-bold text-white ring-2 ring-background`}
                                  title={`@${b.username} completed`}
                                >
                                  {getInitials(b.username)}
                                </div>
                              ))}
                            </div>
                          )}
                          <Badge variant="outline" className="text-[9px] h-4 px-1.5 shrink-0">{item.problems.length} problems</Badge>
                        </button>
                        {isExpanded && (
                          <div className="border-t">
                            {item.problems.map((prob, pi) => {
                              const pKey = `${day.day}-p-${pi}-${item.title}`;
                              const done = completedTopics[pKey];
                              const src = sourceLabel(prob.source);
                              const url = getProblemUrl(prob);
                              return (
                                <div key={pi} className={`flex items-center gap-3 px-4 py-2.5 pl-10 transition-colors border-b last:border-b-0 ${done ? 'bg-emerald-500/5 dark:bg-emerald-500/8' : 'hover:bg-muted/30'}`}>
                                  <Checkbox checked={!!done} onCheckedChange={() => toggleTopic(pKey)} className="shrink-0" />
                                  <Badge className={`text-[9px] font-mono h-4 px-1.5 shrink-0 border ${src.color}`}>{src.text}{prob.id ? `#${prob.id}` : ''}</Badge>
                                  <Badge variant="outline" className={`text-[9px] h-4 px-1.5 shrink-0 ${prob.difficulty === 'Hard' ? 'text-red-500 border-red-500/20' : prob.difficulty === 'Easy' ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/20'}`}>{prob.difficulty}</Badge>
                                  <span onClick={(e) => { e.stopPropagation(); toggleTopic(pKey); }} className={`text-sm flex-1 cursor-pointer select-none ${done ? 'line-through text-muted-foreground' : ''}`}>{prob.title}</span>
                                  {url && (
                                    <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 p-1 rounded-md text-muted-foreground/50 hover:text-primary hover:bg-muted/50 transition-colors" title="Open problem">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  )}
                                  {done && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (isRevision(item)) {
                    return (
                      <div key={itemIdx} className="rounded-lg border overflow-hidden border-dashed">
                        <button onClick={() => toggleExpand(itemKey)} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-muted/30 transition-colors text-left">
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRightIcon className="h-4 w-4 text-muted-foreground shrink-0" />}
                          <FlaskConical className="h-4 w-4 text-purple-500 shrink-0" />
                          <span className="text-sm font-semibold flex-1">{item.title}</span>
                          {acceptedBinds.filter(b => partnerCompletedRevision(b.username, day.day, item.title, item.items.length)).length > 0 && (
                            <div className="flex -space-x-1.5 shrink-0">
                              {acceptedBinds.filter(b => partnerCompletedRevision(b.username, day.day, item.title, item.items.length)).map(b => (
                                <div
                                  key={b.username}
                                  className={`h-5 w-5 rounded-full ${getAvatarColor(b.username)} flex items-center justify-center text-[7px] font-bold text-white ring-2 ring-background`}
                                  title={`@${b.username} completed`}
                                >
                                  {getInitials(b.username)}
                                </div>
                              ))}
                            </div>
                          )}
                          <Badge variant="outline" className="text-[9px] h-4 px-1.5 shrink-0 text-purple-500 border-purple-500/20">revision</Badge>
                        </button>
                        {isExpanded && (
                          <div className="border-t">
                            {item.items.map((revItem, ri) => {
                              const rKey = `${day.day}-r-${ri}-${item.title}`;
                              const done = completedTopics[rKey];
                              return (
                                <div key={ri} className={`flex items-center gap-3 px-4 py-2.5 pl-10 cursor-pointer transition-colors border-b last:border-b-0 ${done ? 'bg-purple-500/5 dark:bg-purple-500/8' : 'hover:bg-muted/30'}`} onClick={() => toggleTopic(rKey)}>
                                  <Checkbox checked={!!done} onCheckedChange={(checked) => { if (checked !== !!done) toggleTopic(rKey); }} onClick={(e) => e.stopPropagation()} />
                                  <span className={`text-sm flex-1 ${done ? 'line-through text-muted-foreground' : ''}`}>{revItem}</span>
                                  {done && <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* Day Picker */}
            <div className="pt-5 mt-5 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><ListChecks className="h-3 w-3" /> Jump to day</span>
              </div>
              <div className="grid grid-cols-10 sm:grid-cols-12 gap-1">
                {dsaPlan.map((d) => {
                  let dayDone = 0, dayTotal = 0;
                  for (const item of d.items) {
                    if (isTheory(item)) { dayTotal += item.problems.length; for (let pi = 0; pi < item.problems.length; pi++) { if (completedTopics[`${d.day}-p-${pi}-${item.title}`]) dayDone++; } }
                    if (isRevision(item)) { dayTotal += item.items.length; for (let ri = 0; ri < item.items.length; ri++) { if (completedTopics[`${d.day}-r-${ri}-${item.title}`]) dayDone++; } }
                  }
                  const allDone = dayDone === dayTotal && dayTotal > 0;
                  const someDone = dayDone > 0;
                  const isSel = selectedDay === d.day;
                  const isHighlighted = highlightedDays.has(d.day);
                  const isHovered = hoveredDay === d.day;
                  return (
                    <button key={d.day} onClick={() => setSelectedDay(d.day)}
                      onMouseEnter={() => setHoveredDay(d.day)} onMouseLeave={() => setHoveredDay(null)}
                      className={`flex items-center justify-center rounded text-[11px] font-mono h-7 transition-all ${
                        isSel ? 'bg-blue-600 text-white shadow-sm' : isHovered ? 'bg-primary/15 text-primary ring-1 ring-primary/30' : isHighlighted ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30'
                        : allDone ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : someDone ? 'bg-muted text-muted-foreground' : 'bg-muted/40 text-muted-foreground/60 hover:bg-muted'
                      }`} title={`Day ${d.day}`}>
                      {allDone && !isSel ? '\u2713' : d.day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT — Vertical Progress Bar (PC only) */}
      <aside className="hidden lg:flex w-12 xl:w-14 flex-col items-center border-l py-4 gap-3">
        <div className="text-[10px] font-mono text-muted-foreground writing-mode-vertical" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{daysCompleted}/60</div>
        <div className="flex-1 w-2.5 bg-muted rounded-full overflow-hidden relative">
          <div className="absolute bottom-0 w-full bg-primary rounded-full transition-all duration-300" style={{ height: `${overallPct}%` }} />
        </div>
        <div className="text-[10px] font-bold text-primary">{overallPct}%</div>
      </aside>
    </div>
  );
}
