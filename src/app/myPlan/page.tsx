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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  LogOut,
  Lock,
  Search,
  Youtube,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebaseBinds, useFirebaseNotifications } from '@/hooks/use-firebase-binds';
import { ref, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { usePartnerData } from '@/hooks/use-partner-data';
import { sendDayCompletedEmail } from '@/lib/email';
import { PageLoader } from '@/components/PageLoader';

const emptySubscribe = () => () => {};

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

// These are replaced by real Firebase data — see partnerProgressMap in MyPlanPage
function partnerCompletedTopic(
  username: string, dayNum: number, topicTitle: string, problemsCount: number,
  partnerProgressMap: Record<string, Record<string, boolean>>
): boolean {
  const progress = partnerProgressMap[username] || {};
  for (let pi = 0; pi < problemsCount; pi++) {
    if (!progress[`${dayNum}-p-${pi}-${topicTitle}`]) return false;
  }
  return problemsCount > 0;
}

function partnerCompletedRevision(
  username: string, dayNum: number, topicTitle: string, itemsCount: number,
  partnerProgressMap: Record<string, Record<string, boolean>>
): boolean {
  const progress = partnerProgressMap[username] || {};
  for (let ri = 0; ri < itemsCount; ri++) {
    if (!progress[`${dayNum}-r-${ri}-${topicTitle}`]) return false;
  }
  return itemsCount > 0;
}

// ─── Global ordered problem key list (for sequential locking across days/topics) ───
// Only theory problems are locked sequentially. Revisions are always free.
const orderedProblemKeys: string[] = (() => {
  const keys: string[] = [];
  for (const d of dsaPlan) {
    for (const item of d.items) {
      if (item.type === 'theory') {
        for (let pi = 0; pi < item.problems.length; pi++) {
          keys.push(`${d.day}-p-${pi}-${item.title}`);
        }
      }
    }
  }
  return keys;
})();

const orderedKeyIndex: Record<string, number> = {};
orderedProblemKeys.forEach((k, i) => { orderedKeyIndex[k] = i; });

function isProblemLocked(key: string, completedTopics: Record<string, boolean>): boolean {
  const idx = orderedKeyIndex[key];
  if (idx === undefined) return false; // not a theory problem key
  if (idx === 0) return false;         // first problem ever, always unlocked
  const prevKey = orderedProblemKeys[idx - 1];
  return !completedTopics[prevKey];
}

// Returns true if this key is the last completed problem in the global order
// (i.e. no later problem is also done). Only the last done problem can be unchecked.
function isLastDoneProblem(key: string, completedTopics: Record<string, boolean>): boolean {
  const idx = orderedKeyIndex[key];
  if (idx === undefined) return true;
  // Check if any problem after this one is done
  for (let i = idx + 1; i < orderedProblemKeys.length; i++) {
    if (completedTopics[orderedProblemKeys[i]]) return false;
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
  open, onClose, userName, onResetProgress, theme, onCycleTheme, overallPct, daysCompleted, totalItems, completedCount, sharingEnabled, onToggleSharing, initialTab = 'account',
}: {
  open: boolean; onClose: () => void; userName: string; onResetProgress: () => void;
  theme: string | undefined; onCycleTheme: () => void; overallPct: number; daysCompleted: number; totalItems: number; completedCount: number;
  sharingEnabled: boolean; onToggleSharing: () => void;
  initialTab?: SettingsTab;
}) {
  const MAX_EMAILS = 3; // primary + 2 additional
  const [tab, setTab] = useState<SettingsTab>('account');
  const [bindInput, setBindInput] = useState('');
  const [bindError, setBindError] = useState('');
  const [bindLoading, setBindLoading] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const primaryEmail = user?.email || '';
  const { binds, sendBindRequest, removeBind } = useFirebaseBinds();
  const [emails, setEmails] = useState<string[]>([]);
  const [mailUpdates, setMailUpdates] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetShowInput, setResetShowInput] = useState(false);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  const normalizeEmails = (items: string[]) => {
    const unique = Array.from(new Set(items.filter(Boolean)));
    if (primaryEmail) {
      const withoutPrimary = unique.filter((e) => e !== primaryEmail);
      return [primaryEmail, ...withoutPrimary].slice(0, MAX_EMAILS);
    }
    return unique.slice(0, MAX_EMAILS);
  };

  // Load user settings from Firebase
  useEffect(() => {
    if (user) {
      const userSettingsRef = ref(database, `userSettings/${user.uid}`);
      get(userSettingsRef).then((snapshot) => {
        if (snapshot.exists()) {
          const settings = snapshot.val();
          setEmails(normalizeEmails(settings.emails || []));
          setMailUpdates(settings.mailUpdates !== false);
        } else if (primaryEmail) {
          setEmails([primaryEmail]);
        }
      });
    }
  }, [user, primaryEmail]);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidUsername = (u: string) => /^[a-zA-Z0-9_]{3,20}$/.test(u);

  const addBind = async () => {
    if (!isValidUsername(bindInput) || bindInput === userName) return;
    setBindError('');
    setBindLoading(true);
    try {
      await sendBindRequest(bindInput);
      setBindInput('');
    } catch (err: any) {
      setBindError(err.message || 'Failed to send bind request');
    } finally {
      setBindLoading(false);
    }
  };

  const handleRemoveBind = async (username: string) => {
    const bind = binds.find(b => b.username === username);
    if (bind) {
      await removeBind(username, bind.uid);
    }
  };

  const addEmail = async () => {
    if (!isValidEmail(newEmail) || emails.includes(newEmail) || !user || emails.length >= MAX_EMAILS) return;
    const updated = normalizeEmails([...emails, newEmail]);
    setEmails(updated);
    await set(ref(database, `userSettings/${user.uid}/emails`), updated);
    setNewEmail('');
  };

  const removeEmail = async (email: string) => {
    const defaultEmail = user?.email || '';
    if (email === defaultEmail || !user) return;
    const updated = normalizeEmails(emails.filter(e => e !== email));
    setEmails(updated);
    await set(ref(database, `userSettings/${user.uid}/emails`), updated);
  };

  const toggleMailUpdates = async () => {
    if (!user) return;
    const next = !mailUpdates;
    setMailUpdates(next);
    await set(ref(database, `userSettings/${user.uid}/mailUpdates`), next);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/${userName}/progress`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetClick = () => {
    setResetShowInput(true);
  };

  const handleConfirmReset = () => {
    if (resetInput === 'RESET') {
      setResetConfirmOpen(true);
    }
  };

  const handleFinalResetConfirm = () => {
    setResetInput('');
    setResetShowInput(false);
    setResetConfirmOpen(false);
    onResetProgress();
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

        {/* Tabs: horizontal icon-only on mobile, vertical with labels on desktop */}
        <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
          {/* Mobile: horizontal icon-only tab bar */}
          <div className="sm:hidden flex border-b bg-background shrink-0">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center py-3 transition-all ${
                  tab === t.key
                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
                title={t.label}
              >
                <span className="[&>svg]:h-6 [&>svg]:w-6">{t.icon}</span>
              </button>
            ))}
          </div>

          {/* Desktop: vertical pill tab sidebar */}
          <div className="hidden sm:flex flex-col gap-1 px-2 py-2 border-r shrink-0 overflow-y-auto">
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
          <div className={`flex-1 p-5 ${tab === 'author' ? 'overflow-hidden pb-5' : 'overflow-y-auto pb-16'}`}>
            {tab === 'account' && (
              <div className="space-y-5 max-w-md mx-auto flex flex-col h-full">
                <div className="flex-1">
                  {/* Profile */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-muted-foreground/10">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={userName}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary/60" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold">@{userName}</div>
                      <div className="text-[11px] text-muted-foreground">{user?.email || 'Your account'}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
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
                </div>

                {/* Bottom section: Theme and Danger Zone */}
                <div className="space-y-4 pt-4 border-t">
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

                  {/* Sign Out */}
                  <Button variant="outline" size="sm" onClick={() => { signOut(); }} className="w-full gap-2 text-muted-foreground hover:text-foreground h-9">
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </Button>

                  {/* Danger zone - now at bottom */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-medium text-destructive/80">Danger Zone</div>
                    
                    {!resetShowInput ? (
                      <Button variant="outline" size="sm" onClick={handleResetClick} className="w-full gap-2 text-destructive hover:bg-destructive/10 border-destructive/20 h-9">
                        <RotateCcw className="h-3.5 w-3.5" /> Reset All Progress
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Input
                          value={resetInput}
                          onChange={(e) => setResetInput(e.target.value)}
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          placeholder="Type RESET"
                          className="h-9 text-xs bg-muted/30"
                          maxLength={5}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setResetInput('');
                              setResetShowInput(false);
                            }}
                            className="flex-1 h-9"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleConfirmReset}
                            disabled={resetInput !== 'RESET'}
                            className="flex-1 h-9"
                          >
                            Confirm
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
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
                      <Button variant="outline" size="sm" onClick={addEmail} disabled={!isValidEmail(newEmail) || emails.length >= MAX_EMAILS} className="h-9 px-3">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Max 3 emails total (1 primary + 2 additional)
                    </p>
                    {emails.length > 0 && (
                      <div className="space-y-1">
                        {emails.map(email => (
                          <div key={email} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs flex-1 truncate">{email}</span>
                            {email === primaryEmail ? (
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
                      <Input value={bindInput} onChange={e => { setBindInput(e.target.value.replace(/[^a-zA-Z0-9_]/g, '')); setBindError(''); }} onKeyDown={e => e.key === 'Enter' && addBind()} placeholder="username" className="pl-6 h-9 text-xs bg-muted/30" maxLength={20} disabled={bindLoading} />
                    </div>
                    <Button variant="outline" size="sm" onClick={addBind} disabled={!isValidUsername(bindInput) || bindInput === userName || bindLoading} className="h-9 gap-1.5 px-3">
                      <UserPlus className="h-3.5 w-3.5" /> {bindLoading ? 'Checking...' : 'Bind'}
                    </Button>
                  </div>
                  {bindError && (
                    <p className="text-xs text-destructive">{bindError}</p>
                  )}
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
                        <button onClick={() => handleRemoveBind(b.username)} className="text-muted-foreground/50 hover:text-destructive transition-colors">
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
                        <Button variant="outline" size="sm" onClick={copyShareLink} className="h-9 gap-1.5 px-3" title="Copy link">
                          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="outline" size="sm" asChild className="h-9 px-3" title="Open public page">
                          <a href={`/${userName}/progress`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
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
                <div className="rounded-lg border bg-muted/20 overflow-hidden" style={{ height: 'calc(85vh - 120px)' }}>
                  <iframe
                    src="https://rootlynk.itsranbir.me"
                    className="w-full h-full border-0"
                    title="Author - Rootlynk"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy"
                    scrolling="yes"
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

        {/* Final Confirmation Dialog */}
        <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogTitle>Confirm Data Reset</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all your progress, completions, and statistics. This cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleFinalResetConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Reset Everything
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Notifications Drawer (Bottom) ───
function NotificationsDrawer({ open, onClose, userName }: { open: boolean; onClose: () => void; userName: string }) {
  const { notifications, markAsRead, clearAll, unreadCount } = useFirebaseNotifications();
  const { acceptBind } = useFirebaseBinds();

  const handleAcceptBind = async (id: string, from: string, fromUid: string) => {
    await acceptBind(from, fromUid);
    await markAsRead(id);
  };

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
                            <Button variant="outline" size="sm" onClick={() => handleAcceptBind(n.id, n.from, n.fromUid)} className="h-5 text-[9px] px-2 gap-0.5">
                              <Check className="h-2.5 w-2.5" /> Accept
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)} className="h-5 text-[9px] px-2 text-muted-foreground">
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
// Partner colors — distinct, no purple (primary/blue is reserved for "You")
const PARTNER_COLORS = [
  { bar: 'bg-rose-500',    text: 'text-rose-500',    card: 'bg-rose-500/10',    icon: 'text-rose-500'    },
  { bar: 'bg-amber-500',   text: 'text-amber-500',   card: 'bg-amber-500/10',   icon: 'text-amber-500'   },
  { bar: 'bg-emerald-500', text: 'text-emerald-500', card: 'bg-emerald-500/10', icon: 'text-emerald-500' },
  { bar: 'bg-cyan-500',    text: 'text-cyan-500',    card: 'bg-cyan-500/10',    icon: 'text-cyan-500'    },
  { bar: 'bg-orange-500',  text: 'text-orange-500',  card: 'bg-orange-500/10',  icon: 'text-orange-500'  },
];

function BindDrawer({
  open,
  onClose,
  completedTopics,
  onOpenBindSettings,
}: {
  open: boolean;
  onClose: () => void;
  completedTopics: Record<string, boolean>;
  onOpenBindSettings: () => void;
}) {
  const { binds } = useFirebaseBinds();
  const { user } = useAuth();
  const { partnerProgressMap, partnerPhotoMap, cache } = usePartnerData();

  const acceptedBinds = binds.filter(b => b.status === 'accepted');

  // Multi-select: set of selected usernames. Auto-select all on open.
  const [selectedBinds, setSelectedBinds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open && acceptedBinds.length > 0) {
      setSelectedBinds(new Set(acceptedBinds.map(b => b.username)));
    }
  }, [open, acceptedBinds.length]);

  const toggleSelect = (username: string) => {
    setSelectedBinds(prev => {
      const next = new Set(prev);
      if (next.has(username)) { next.delete(username); } else { next.add(username); }
      return next;
    });
  };

  // My day completion
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

  const myCompleted = useMemo(() => {
    let c = 0;
    for (const d of dsaPlan) { const comp = myDayCompletion[d.day]; if (comp && comp.done === comp.total && comp.total > 0) c++; }
    return c;
  }, [myDayCompletion]);

  // Per-partner day completion
  const partnerDayCompletions = useMemo(() => {
    const result: Record<string, Record<number, { done: number; total: number }>> = {};
    for (const username of Array.from(selectedBinds)) {
      const progress = partnerProgressMap[username] || {};
      const dayResult: Record<number, { done: number; total: number }> = {};
      for (const d of dsaPlan) {
        let done = 0, total = 0;
        for (const item of d.items) {
          if (isTheory(item)) { total += item.problems.length; for (let pi = 0; pi < item.problems.length; pi++) { if (progress[`${d.day}-p-${pi}-${item.title}`]) done++; } }
          if (isRevision(item)) { total += item.items.length; for (let ri = 0; ri < item.items.length; ri++) { if (progress[`${d.day}-r-${ri}-${item.title}`]) done++; } }
        }
        dayResult[d.day] = { done, total };
      }
      result[username] = dayResult;
    }
    return result;
  }, [selectedBinds, partnerProgressMap]);

  const partnerCompletedDays = useMemo(() => {
    const result: Record<string, number> = {};
    for (const [username, dayComp] of Object.entries(partnerDayCompletions)) {
      let c = 0;
      for (const d of dsaPlan) { const comp = dayComp[d.day]; if (comp && comp.done === comp.total && comp.total > 0) c++; }
      result[username] = c;
    }
    return result;
  }, [partnerDayCompletions]);

  const selectedList = acceptedBinds.filter(b => selectedBinds.has(b.username));

  // Helper: did partner complete a theory topic?
  const partnerDoneForTopic = useCallback((username: string, dayNum: number, topicTitle: string, problemsCount: number): boolean => {
    const progress = partnerProgressMap[username] || {};
    for (let pi = 0; pi < problemsCount; pi++) {
      if (!progress[`${dayNum}-p-${pi}-${topicTitle}`]) return false;
    }
    return problemsCount > 0;
  }, [partnerProgressMap]);

  // Helper: did partner complete a revision topic?
  const partnerDoneForRevision = useCallback((username: string, dayNum: number, topicTitle: string, itemsCount: number): boolean => {
    const progress = partnerProgressMap[username] || {};
    for (let ri = 0; ri < itemsCount; ri++) {
      if (!progress[`${dayNum}-r-${ri}-${topicTitle}`]) return false;
    }
    return itemsCount > 0;
  }, [partnerProgressMap]);

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) onClose(); }} direction="bottom">
      <DrawerContent className="h-[85vh] !left-[4%] !right-[4%] sm:!left-[12%] sm:!right-[12%] md:!left-[22%] md:!right-[22%] lg:!left-[30%] lg:!right-[30%] !rounded-t-2xl shadow-2xl border">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <DrawerTitle className="text-sm font-bold flex items-center gap-1.5">
              <Link2 className="h-4 w-4 text-primary" /> Bind Compare
            </DrawerTitle>
            <Button variant="outline" size="sm" onClick={onOpenBindSettings} className="h-8 gap-1.5 text-xs">
              <UserPlus className="h-3.5 w-3.5" /> Bind More
            </Button>
          </div>
          <DrawerDescription className="sr-only">Compare your progress with bound study partners</DrawerDescription>
        </DrawerHeader>

        {acceptedBinds.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground/40">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No accepted binds yet</p>
            <p className="text-[10px]">Add study partners in Settings → Bind</p>
            <Button variant="outline" size="sm" onClick={onOpenBindSettings} className="mt-3 h-8 gap-1.5 text-xs">
              <UserPlus className="h-3.5 w-3.5" /> Open Bind Settings
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Multi-select partner chips */}
            <div className="px-4 py-3 border-b flex gap-1.5 flex-wrap items-center">
              <span className="text-[10px] text-muted-foreground mr-1">Comparing:</span>
              {acceptedBinds.map((b, idx) => {
                const photoURL = partnerPhotoMap[b.username];
                const isLoading = cache[b.username]?.loading;
                const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
                const selected = selectedBinds.has(b.username);
                return (
                  <button
                    key={b.username}
                    onClick={() => toggleSelect(b.username)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-all border ${
                      selected
                        ? `${color.bar} text-white border-transparent`
                        : 'bg-muted/30 text-muted-foreground border-muted/50 opacity-50'
                    }`}
                  >
                    {photoURL ? (
                      <img src={photoURL} alt={b.username} className="h-4 w-4 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    @{b.username}
                  </button>
                );
              })}
            </div>

            <div className="p-4 space-y-5">
              {/* Stats cards row — You + all selected partners */}
              <div className="flex gap-2 flex-wrap">
                {/* You */}
                <div className="rounded-lg border p-3 text-center min-w-[80px] flex-1">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="You" className="h-8 w-8 rounded-full object-cover mx-auto mb-1.5" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="text-[10px] font-bold truncate">You</div>
                  <div className="text-base font-bold text-primary">{myCompleted}<span className="text-[9px] text-muted-foreground font-normal">/60</span></div>
                </div>
                {/* Selected partners */}
                {selectedList.map((b, idx) => {
                  const photoURL = partnerPhotoMap[b.username];
                  const isLoading = cache[b.username]?.loading;
                  const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
                  return (
                    <div key={b.username} className="rounded-lg border p-3 text-center min-w-[80px] flex-1">
                      {photoURL ? (
                        <img src={photoURL} alt={b.username} className="h-8 w-8 rounded-full object-cover mx-auto mb-1.5" referrerPolicy="no-referrer" />
                      ) : (
                        <div className={`h-8 w-8 rounded-full ${color.card} flex items-center justify-center mx-auto mb-1.5`}>
                          <User className={`h-4 w-4 ${color.icon}`} />
                        </div>
                      )}
                      <div className="text-[10px] font-bold truncate">@{b.username}</div>
                      {isLoading ? (
                        <div className="text-base font-bold text-muted-foreground/40">…</div>
                      ) : (
                        <div className={`text-base font-bold ${color.text}`}>
                          {partnerCompletedDays[b.username] ?? 0}<span className="text-[9px] text-muted-foreground font-normal">/60</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Day-by-day comparison — percentage-filled bars */}
              {selectedList.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Day-by-Day</h4>
                  <div className="space-y-1">
                    {dsaPlan.map(d => {
                      const my = myDayCompletion[d.day];
                      const myPct = my && my.total > 0 ? Math.round((my.done / my.total) * 100) : 0;
                      return (
                        <div key={d.day} className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono w-5 text-right text-muted-foreground/40 shrink-0">{d.day}</span>
                          {/* My bar */}
                          <div className="flex-1 h-2 bg-muted/20 rounded-sm overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-sm transition-all duration-300"
                              style={{ width: `${myPct}%` }}
                            />
                          </div>
                          {/* Partner bars */}
                          {selectedList.map((b, idx) => {
                            const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
                            const comp = partnerDayCompletions[b.username]?.[d.day];
                            const pct = comp && comp.total > 0 ? Math.round((comp.done / comp.total) * 100) : 0;
                            return (
                              <div key={b.username} className="flex-1 h-2 bg-muted/20 rounded-sm overflow-hidden">
                                <div
                                  className={`h-full ${color.bar} rounded-sm transition-all duration-300`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1"><div className="h-2 w-3 rounded-sm bg-primary" /><span className="text-[9px] text-muted-foreground">You</span></div>
                    {selectedList.map((b, idx) => {
                      const color = PARTNER_COLORS[idx % PARTNER_COLORS.length];
                      return (
                        <div key={b.username} className="flex items-center gap-1">
                          <div className={`h-2 w-3 rounded-sm ${color.bar}`} />
                          <span className="text-[9px] text-muted-foreground">@{b.username}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function PublicProfileLookupDrawer({
  open,
  onClose,
  currentUserName,
}: {
  open: boolean;
  onClose: () => void;
  currentUserName: string;
}) {
  const [lookupInput, setLookupInput] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResults, setLookupResults] = useState<Array<{ username: string; photoURL: string | null; displayName: string | null }>>([]);
  const [searchedTerm, setSearchedTerm] = useState('');

  useEffect(() => {
    if (!open) {
      setLookupInput('');
      setLookupError('');
      setLookupLoading(false);
      setLookupResults([]);
      setSearchedTerm('');
    }
  }, [open]);

  const normalized = lookupInput.trim().replace(/^@/, '');
  const hasValidChars = /^[a-zA-Z0-9_]+$/.test(normalized);
  const canSearch = normalized.length >= 2 && normalized.length <= 20 && hasValidChars;

  const lookupPublicProfile = async () => {
    if (!canSearch) {
      setLookupError('Enter at least 2 valid characters (letters, numbers, or _)');
      setLookupResults([]);
      return;
    }

    setLookupError('');
    setLookupResults([]);
    setSearchedTerm(normalized);
    setLookupLoading(true);

    try {
      const usernameSnap = await get(ref(database, 'usernames'));
      if (!usernameSnap.exists()) {
        setLookupError('User not found');
        return;
      }

      const allUsernames = usernameSnap.val() as Record<string, string>;
      const q = normalized.toLowerCase();

      const rankedCandidates = Object.entries(allUsernames)
        .filter(([username]) => username.toLowerCase() !== currentUserName.toLowerCase())
        .map(([username, uid]) => {
          const lower = username.toLowerCase();
          const exact = lower === q;
          const starts = lower.startsWith(q);
          const includes = lower.includes(q);
          const score = exact ? 0 : starts ? 1 : includes ? 2 : 99;
          return { username, uid, score };
        })
        .filter((x) => x.score < 99)
        .sort((a, b) => a.score - b.score || a.username.localeCompare(b.username))
        .slice(0, 12);

      if (rankedCandidates.length === 0) {
        setLookupError('No close matches found');
        return;
      }

      const resolved = await Promise.all(
        rankedCandidates.map(async (candidate) => {
          const [sharingSnap, userSnap] = await Promise.all([
            get(ref(database, `userSettings/${candidate.uid}/sharingEnabled`)),
            get(ref(database, `users/${candidate.uid}`)),
          ]);

          const isPublic = !sharingSnap.exists() || sharingSnap.val() !== false;
          if (!isPublic) return null;

          const userData = userSnap.exists() ? userSnap.val() : {};
          return {
            username: userData.username || candidate.username,
            photoURL: userData.photoURL || null,
            displayName: userData.displayName || null,
          };
        })
      );

      const publicResults = resolved.filter((entry): entry is { username: string; photoURL: string | null; displayName: string | null } => !!entry);

      if (publicResults.length === 0) {
        setLookupError('Matches found, but none are public');
        return;
      }

      setLookupResults(publicResults);
    } catch (error) {
      console.error('Error looking up public profile:', error);
      setLookupError('Could not check this username right now');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) onClose(); }} direction="bottom">
      <DrawerContent className="h-[85vh] !left-[4%] !right-[4%] sm:!left-[12%] sm:!right-[12%] md:!left-[22%] md:!right-[22%] lg:!left-[30%] lg:!right-[30%] !rounded-t-2xl shadow-2xl border">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-sm font-bold flex items-center gap-1.5">
            <Search className="h-4 w-4 text-primary" /> Check Public Link
          </DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground">
            Enter another username to find a public progress profile.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-5 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={lookupInput}
              onChange={(e) => {
                setLookupInput(e.target.value);
                setLookupError('');
                setLookupResults([]);
              }}
              placeholder="@username"
              className="h-9 text-xs"
              onKeyDown={(e) => { if (e.key === 'Enter') lookupPublicProfile(); }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={lookupPublicProfile}
              disabled={!canSearch || lookupLoading}
              className="h-9 px-3 text-xs"
            >
              {lookupLoading ? 'Checking...' : 'Check'}
            </Button>
          </div>

          {lookupError && <div className="text-[11px] text-rose-500">{lookupError}</div>}

          {searchedTerm && lookupResults.length > 0 && (
            <div className="text-[11px] text-muted-foreground">
              Matches for <span className="font-medium text-foreground">@{searchedTerm}</span>
            </div>
          )}

          {lookupResults.length > 0 && (
            <div className="space-y-2">
              {lookupResults.map((result, idx) => (
                <div key={`${result.username}-${idx}`} className="rounded-lg border p-3 bg-muted/20 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center border border-muted-foreground/10">
                    {result.photoURL ? (
                      <img
                        src={result.photoURL}
                        alt={result.username}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="h-4 w-4 text-primary/60" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">@{result.username}</div>
                    {result.displayName && (
                      <div className="text-[10px] text-muted-foreground truncate">{result.displayName}</div>
                    )}
                  </div>

                  <Button asChild className="h-8 text-xs gap-1.5 shrink-0">
                    <a href={`/${encodeURIComponent(result.username)}/progress`} target="_blank" rel="noopener noreferrer">
                      Visit <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Main Page ───
export default function MyPlanPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();
  const { user, userProfile, loading, signOut } = useAuth();
  const { binds } = useFirebaseBinds();
  const { unreadCount } = useFirebaseNotifications();
  const [selectedDay, setSelectedDay] = useState(() => {
    if (typeof window === 'undefined') return 1;
    const saved = sessionStorage.getItem('dsa-selected-day');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set());
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<SettingsTab>('account');
  const [notifOpen, setNotifOpen] = useState(false);
  const [bindDrawerOpen, setBindDrawerOpen] = useState(false);
  const [publicLookupOpen, setPublicLookupOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sharingEnabled, setSharingEnabled] = useState(true);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const { completedTopics, toggleTopic, resetProgress, loaded: progressLoaded } = useProgress();

  const prevDayCompleteRef = useRef({} as Record<number, boolean>);
  const isInitializedRef = useRef(false);
  const day = dsaPlan.find((d) => d.day === selectedDay);

  // Auto-cleanup: if a problem is marked done but is now locked (its predecessor
  // was unchecked), undo it. Walk forward from the unchecked position.
  useEffect(() => {
    if (!user) return;
    for (let i = 1; i < orderedProblemKeys.length; i++) {
      const key = orderedProblemKeys[i];
      if (completedTopics[key] && isProblemLocked(key, completedTopics)) {
        // Undo this problem — it should not be done if its predecessor isn't
        toggleTopic(key);
      }
    }
  }, [completedTopics, user]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const menu = document.getElementById('profile-dropdown-menu');
      const trigger = document.getElementById('profile-dropdown-trigger');
      if (menu && menu.contains(e.target as Node)) return;
      if (trigger && trigger.contains(e.target as Node)) return;
      setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileMenuOpen]);

  // Load sharing settings from Firebase
  useEffect(() => {
    if (user) {
      const userSettingsRef = ref(database, `userSettings/${user.uid}`);
      get(userSettingsRef).then((snapshot) => {
        if (snapshot.exists()) {
          setSharingEnabled(snapshot.val().sharingEnabled !== false);
        }
      });
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/landing');
    }
  }, [user, loading, router]);

  const userName = userProfile?.username || 'user';
  const acceptedBinds = binds.filter(b => b.status === 'accepted');

  // Shared real-time partner data (progress + photoURL)
  const { partnerProgressMap, partnerPhotoMap } = usePartnerData();

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
  const go = (dir: number) => setSelectedDay((p) => {
    const next = p + dir >= 1 && p + dir <= 60 ? p + dir : p;
    sessionStorage.setItem('dsa-selected-day', String(next));
    return next;
  });
  const cycleTheme = () => { if (theme === 'light') setTheme('dark'); else if (theme === 'dark') setTheme('system'); else setTheme('light'); };
  const toggleSharing = async () => {
    if (!user) return;
    const next = !sharingEnabled;
    setSharingEnabled(next);
    await set(ref(database, `userSettings/${user.uid}/sharingEnabled`), next);
  };
  const copyProgressLink = () => {
    const url = `${window.location.origin}/${userName}/progress`;
    navigator.clipboard.writeText(url);
  };
  const openSettingsAt = (tab: SettingsTab) => {
    setSettingsInitialTab(tab);
    setSettingsOpen(true);
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
    // Wait for Firebase progress to load before tracking day completion
    // This prevents confetti firing on refresh when data loads in
    if (!progressLoaded) return;

    // On first run after data loads, just record current state without firing confetti
    if (!isInitializedRef.current) {
      for (const d of dsaPlan) {
        const comp = dayCompletion[d.day];
        prevDayCompleteRef.current[d.day] = !!(comp && comp.done === comp.total && comp.total > 0);
      }
      isInitializedRef.current = true;
      return;
    }

    for (const d of dsaPlan) {
      const comp = dayCompletion[d.day];
      const isComplete = comp && comp.done === comp.total && comp.total > 0;
      const wasComplete = prevDayCompleteRef.current[d.day] || false;
      if (isComplete && !wasComplete) {
        // Send day completed email — only once per day, ever
        // Fire confetti only after email is sent (or if user has no email configured)
        if (user) {
          const emailSentRef = ref(database, `emailsSent/${user.uid}/day_${d.day}`);
          get(emailSentRef).then((sentSnap) => {
            if (sentSnap.exists()) {
              // Email already sent before — still fire confetti (day was already celebrated)
              fireConfetti();
              return;
            }
            get(ref(database, `userSettings/${user.uid}`)).then((snap) => {
              if (!snap.exists() || snap.val().mailUpdates === false || !snap.val().emails?.length) {
                // No email configured — fire confetti immediately
                fireConfetti();
                return;
              }
              const settings = snap.val();
              sendDayCompletedEmail(
                settings.emails,
                userName,
                user.displayName || undefined,
                d.day,
                daysCompleted,
                overallPct,
              ).then(() => {
                set(emailSentRef, Date.now());
                fireConfetti(); // fire only after email sent successfully
              });
            });
          });
        } else {
          fireConfetti();
        }
      }
      prevDayCompleteRef.current[d.day] = isComplete;
    }
  }, [dayCompletion, progressLoaded]);

  if (!mounted || loading) return <PageLoader />;
  if (!user || !userProfile) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Drawers */}
      <SettingsDrawer
        open={settingsOpen} onClose={() => setSettingsOpen(false)} userName={userName}
        onResetProgress={resetProgress} theme={theme} onCycleTheme={cycleTheme}
        overallPct={overallPct} daysCompleted={daysCompleted} totalItems={totalItems} completedCount={completedCount}
        sharingEnabled={sharingEnabled} onToggleSharing={toggleSharing}
        initialTab={settingsInitialTab}
      />
      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} userName={userName} />
      <BindDrawer
        open={bindDrawerOpen}
        onClose={() => setBindDrawerOpen(false)}
        completedTopics={completedTopics}
        onOpenBindSettings={() => {
          setBindDrawerOpen(false);
          openSettingsAt('bind');
        }}
      />
      <PublicProfileLookupDrawer open={publicLookupOpen} onClose={() => setPublicLookupOpen(false)} currentUserName={userName} />

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
        {/* Sidebar Header — progress */}
        <div className="px-3 pt-3 pb-3 border-b">
          {/* Progress bar */}
          <div className="px-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">{daysCompleted}/60 days</span>
              <span className="text-[10px] font-semibold">{overallPct}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }} />
            </div>
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
                          <button key={sub.day} data-sidebar-day={sub.day} onClick={() => { setSelectedDay(sub.day); sessionStorage.setItem('dsa-selected-day', String(sub.day)); setSidebarOpen(false); }}
                            onMouseEnter={() => setHoveredDay(sub.day)} onMouseLeave={() => setHoveredDay(null)}
                            className={`w-full text-left pr-2 py-1.5 transition-colors duration-100 rounded-r-md flex items-center gap-2 ${isDaySelected ? 'bg-primary/8' : hoveredDay === sub.day ? 'bg-primary/5' : 'hover:bg-muted/25'}`}>
                            <span className={`shrink-0 text-[10px] font-bold font-mono h-5 min-w-[24px] flex items-center justify-center rounded-[4px] transition-colors ${
                              isDaySelected ? 'bg-primary text-primary-foreground' : dayAllDone ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted/40 text-muted-foreground/50'
                            }`}>
                              {dayAllDone && !isDaySelected ? '\u2713' : sub.day}
                            </span>
                            <span className={`text-[12px] leading-snug truncate flex-1 ${isDaySelected ? 'font-medium' : 'text-foreground/60'}`}>
                              {hoveredDay === sub.day ? sub.topics[0] : sub.topics[0]}
                            </span>
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

        {/* Sidebar Footer — profile card with upward dropdown */}
        <div className="px-3 py-3 border-t">
          <div className="relative">
            <button
              id="profile-dropdown-trigger"
              onClick={() => setProfileMenuOpen(v => !v)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors text-left"
            >
              <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center border border-muted-foreground/10">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={userName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="h-4 w-4 text-primary/60" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate leading-tight">{user?.displayName || userName}</div>
                <div className="text-[10px] text-muted-foreground truncate">@{userName}</div>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-150 ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileMenuOpen && (
              <div id="profile-dropdown-menu" className="absolute bottom-full left-0 right-0 mb-1 z-50 rounded-xl border bg-popover shadow-lg overflow-hidden">
                {acceptedBinds.length > 0 && (
                  <button onClick={() => { setBindDrawerOpen(true); setProfileMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/50 transition-colors text-violet-500">
                    <Link2 className="h-3.5 w-3.5" /> Bind Compare
                  </button>
                )}
                <button onClick={() => { setNotifOpen(true); setProfileMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/50 transition-colors relative">
                  <Bell className="h-3.5 w-3.5" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto h-4 min-w-[16px] flex items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground font-bold px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {sharingEnabled && (
                  <button onClick={() => { copyProgressLink(); setProfileMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/50 transition-colors text-primary">
                    <Share2 className="h-3.5 w-3.5" /> Copy Progress Link
                  </button>
                )}
                <button onClick={() => { setPublicLookupOpen(true); setProfileMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/50 transition-colors">
                  <Search className="h-3.5 w-3.5" /> Check Public Link
                </button>
                <div className="border-t my-0.5" />
                <button onClick={() => { openSettingsAt('account'); setProfileMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/50 transition-colors">
                  <Settings className="h-3.5 w-3.5" /> Settings
                </button>
                <button onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/50 transition-colors lg:hidden">
                  <X className="h-3.5 w-3.5" /> Close
                </button>
              </div>
            )}
          </div>
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
          <Button variant="ghost" size="icon" onClick={() => openSettingsAt('account')} className="h-7 w-7">
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
                          {acceptedBinds.filter(b => partnerCompletedTopic(b.username, day.day, item.title, item.problems.length, partnerProgressMap)).length > 0 && (
                            <div className="flex -space-x-1.5 shrink-0 group/avatars relative">
                              {acceptedBinds.filter(b => partnerCompletedTopic(b.username, day.day, item.title, item.problems.length, partnerProgressMap)).map(b => (
                                <div
                                  key={b.username}
                                  className={`h-5 w-5 rounded-full overflow-hidden ring-2 ring-background ${!partnerPhotoMap[b.username] ? getAvatarColor(b.username) : ''} flex items-center justify-center`}
                                >
                                  {partnerPhotoMap[b.username] ? (
                                    <img src={partnerPhotoMap[b.username]!} alt={b.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <span className="text-[7px] font-bold text-white">{getInitials(b.username)}</span>
                                  )}
                                </div>
                              ))}
                              {/* Hover tooltip showing all names */}
                              <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/avatars:flex flex-col items-end gap-0.5 z-50 pointer-events-none">
                                {acceptedBinds.filter(b => partnerCompletedTopic(b.username, day.day, item.title, item.problems.length, partnerProgressMap)).map(b => (
                                  <span key={b.username} className="bg-popover border text-[10px] px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap font-medium">
                                    @{b.username} ✓
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <Badge variant="outline" className="text-[9px] h-4 px-1.5 shrink-0">{item.problems.length} problems</Badge>
                        </button>
                        {isExpanded && (
                          <div className="border-t">
                            {item.problems.map((prob, pi) => {
                              const pKey = `${day.day}-p-${pi}-${item.title}`;
                              const done = completedTopics[pKey];
                              const locked = isProblemLocked(pKey, completedTopics);
                              // If done, only allow unchecking if this is the last done problem globally
                              const canUncheck = done ? isLastDoneProblem(pKey, completedTopics) : true;
                              const src = sourceLabel(prob.source);
                              const url = getProblemUrl(prob);
                              const handleToggle = () => {
                                if (locked) return;
                                if (done && !canUncheck) return; // must undo later tasks first
                                toggleTopic(pKey);
                              };
                              return (
                                <div
                                  key={pi}
                                  className={`flex items-center gap-3 px-4 py-2.5 pl-10 transition-colors border-b last:border-b-0 ${
                                    locked ? 'opacity-50' : done ? 'bg-emerald-500/5 dark:bg-emerald-500/8' : 'hover:bg-muted/30'
                                  }`}
                                >
                                  {locked ? (
                                    <Lock className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                                  ) : done && !canUncheck ? (
                                    <Checkbox
                                      checked={true}
                                      disabled
                                      className="shrink-0 opacity-40 cursor-not-allowed"
                                    />
                                  ) : (
                                    <Checkbox
                                      checked={!!done}
                                      onCheckedChange={handleToggle}
                                      className="shrink-0"
                                    />
                                  )}
                                  <Badge className={`text-[9px] font-mono h-4 px-1.5 shrink-0 border ${src.color}`}>{src.text}{prob.id ? `#${prob.id}` : ''}</Badge>
                                  <Badge variant="outline" className={`text-[9px] h-4 px-1.5 shrink-0 ${prob.difficulty === 'Hard' ? 'text-red-500 border-red-500/20' : prob.difficulty === 'Easy' ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/20'}`}>{prob.difficulty}</Badge>
                                  <span
                                    onClick={handleToggle}
                                    className={`text-sm flex-1 select-none ${locked || (done && !canUncheck) ? 'cursor-not-allowed' : 'cursor-pointer'} ${done ? 'line-through text-muted-foreground' : ''}`}
                                  >
                                    {prob.title}
                                  </span>
                                  {url && (
                                    locked ? (
                                      <span className="shrink-0 p-1 text-muted-foreground/20 cursor-not-allowed">
                                        <ExternalLink className="h-3.5 w-3.5" />
                                      </span>
                                    ) : (
                                      <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 p-1 rounded-md text-muted-foreground/50 hover:text-primary hover:bg-muted/50 transition-colors" title="Open problem">
                                        <ExternalLink className="h-3.5 w-3.5" />
                                      </a>
                                    )
                                  )}
                                  {prob.source === 'leetcode' && (
                                    locked ? (
                                      <span className="shrink-0 p-1 text-muted-foreground/20 cursor-not-allowed">
                                        <Youtube className="h-3.5 w-3.5" />
                                      </span>
                                    ) : (
                                      <a href="https://www.youtube.com/playlist?list=PLoDervMHdCDJPh4z8dx6PIq5aee8yxV5C" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 p-1 rounded-md text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Watch tutorial playlist">
                                        <Youtube className="h-3.5 w-3.5" />
                                      </a>
                                    )
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
                          {acceptedBinds.filter(b => partnerCompletedRevision(b.username, day.day, item.title, item.items.length, partnerProgressMap)).length > 0 && (
                            <div className="flex -space-x-1.5 shrink-0 group/avatars relative">
                              {acceptedBinds.filter(b => partnerCompletedRevision(b.username, day.day, item.title, item.items.length, partnerProgressMap)).map(b => (
                                <div
                                  key={b.username}
                                  className={`h-5 w-5 rounded-full overflow-hidden ring-2 ring-background ${!partnerPhotoMap[b.username] ? getAvatarColor(b.username) : ''} flex items-center justify-center`}
                                >
                                  {partnerPhotoMap[b.username] ? (
                                    <img src={partnerPhotoMap[b.username]!} alt={b.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <span className="text-[7px] font-bold text-white">{getInitials(b.username)}</span>
                                  )}
                                </div>
                              ))}
                              {/* Hover tooltip */}
                              <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/avatars:flex flex-col items-end gap-0.5 z-50 pointer-events-none">
                                {acceptedBinds.filter(b => partnerCompletedRevision(b.username, day.day, item.title, item.items.length, partnerProgressMap)).map(b => (
                                  <span key={b.username} className="bg-popover border text-[10px] px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap font-medium">
                                    @{b.username} ✓
                                  </span>
                                ))}
                              </div>
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
                  const firstTopic = d.items.find(isTheory)?.title || `Day ${d.day}`;
                  return (
                    <div key={d.day} className="relative group/daycell">
                      <button onClick={() => { setSelectedDay(d.day); sessionStorage.setItem('dsa-selected-day', String(d.day)); }}
                        onMouseEnter={() => setHoveredDay(d.day)} onMouseLeave={() => setHoveredDay(null)}
                        className={`w-full flex items-center justify-center rounded text-[11px] font-mono h-7 transition-all ${
                          isSel ? 'bg-blue-600 text-white shadow-sm' : isHovered ? 'bg-primary/15 text-primary ring-1 ring-primary/30' : isHighlighted ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30'
                          : allDone ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : someDone ? 'bg-muted text-muted-foreground' : 'bg-muted/40 text-muted-foreground/60 hover:bg-muted'
                        }`}>
                        {allDone && !isSel ? '\u2713' : d.day}
                      </button>
                      {/* Topic tooltip on hover */}
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 pointer-events-none">
                          <div className="bg-popover border text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap font-medium max-w-[160px] truncate">
                            {firstTopic}
                          </div>
                        </div>
                      )}
                    </div>
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
