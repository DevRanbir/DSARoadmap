'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { dsaPlan, syllabusSections, TheoryNode, RevisionNode, DayItem } from '@/lib/dsa-plan';
import { Button } from '@/components/ui/button';
import { use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LiquidEther from '@/components/ui/LiquidEther';
import {
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
  Code2,
  Trophy,
  Target,
  BookOpen,
  FlaskConical,
  User,
  ArrowRight,
  Lock,
  Share2,
} from 'lucide-react';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { PageLoader } from '@/components/PageLoader';
import { useAuth } from '@/contexts/AuthContext';

const emptySubscribe = () => () => { };

function isTheory(item: DayItem): item is TheoryNode {
  return item.type === 'theory';
}

function isRevision(item: DayItem): item is RevisionNode {
  return item.type === 'revision';
}

const sectionColorMap: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-500', bar: 'bg-blue-500' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-500', bar: 'bg-cyan-500' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-500', bar: 'bg-violet-500' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-500', bar: 'bg-emerald-500' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', bar: 'bg-orange-500' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-500', bar: 'bg-rose-500' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-500', bar: 'bg-amber-500' },
  teal: { bg: 'bg-teal-500', text: 'text-teal-500', bar: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', bar: 'bg-indigo-500' },
  lime: { bg: 'bg-lime-500', text: 'text-lime-500', bar: 'bg-lime-500' },
  fuchsia: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-500', bar: 'bg-fuchsia-500' },
  sky: { bg: 'bg-sky-500', text: 'text-sky-500', bar: 'bg-sky-500' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-500', bar: 'bg-pink-500' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500', bar: 'bg-yellow-500' },
  red: { bg: 'bg-red-500', text: 'text-red-500', bar: 'bg-red-500' },
  green: { bg: 'bg-green-500', text: 'text-green-500', bar: 'bg-green-500' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-500', bar: 'bg-purple-500' },
};

const defaultColor = { bg: 'bg-slate-500', text: 'text-slate-500', bar: 'bg-slate-500' };

export default function ProgressPage({ params }: { params: Promise<{ userName: string }> }) {
  const { userName } = use(params);
  const { theme, setTheme } = useTheme();
  const { user, userProfile, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [animating, setAnimating] = useState(false);
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `DSA Progress - @${decodeURIComponent(userName)}`,
          text: `Check out @${decodeURIComponent(userName)}'s progress on the 60-day DSA Roadmap!`,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(url);
        }
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  // Load profile data from Firebase by username
  const [sharingEnabled, setSharingEnabled] = useState<boolean | null>(null); // null = loading
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        // Resolve username → uid
        const usernameRef = ref(database, `usernames/${userName}`);
        const usernameSnap = await get(usernameRef);

        if (!usernameSnap.exists()) {
          setSharingEnabled(false);
          setLoadingData(false);
          return;
        }

        const uid = usernameSnap.val();

        // Load user profile (photoURL, displayName)
        const userRef = ref(database, `users/${uid}`);
        const userSnap = await get(userRef);
        if (userSnap.exists()) {
          const profile = userSnap.val();
          setPhotoURL(profile.photoURL || null);
          setDisplayName(profile.displayName || null);
        }

        // Load sharing setting
        const settingsRef = ref(database, `userSettings/${uid}/sharingEnabled`);
        const settingsSnap = await get(settingsRef);
        // Default to true if not explicitly set to false
        const sharing = !settingsSnap.exists() || settingsSnap.val() !== false;
        setSharingEnabled(sharing);

        if (sharing) {
          // Load progress
          const progressRef = ref(database, `progress/${uid}`);
          const progressSnap = await get(progressRef);
          setCompletedTopics(progressSnap.exists() ? progressSnap.val() : {});
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setSharingEnabled(false);
      } finally {
        setLoadingData(false);
      }
    }

    loadUserData();
  }, [userName]);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const handlePrimaryAction = async () => {
    if (user && userProfile) {
      router.push('/myPlan');
      return;
    }

    setAnimating(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      setAnimating(false);
    }
  };

  const homeHref = !loading && user ? '/' : '/landing';

  // Compute stats
  const totalProblems = useMemo(() => {
    let count = 0;
    for (const d of dsaPlan) {
      for (const item of d.items) {
        if (isTheory(item)) count += item.problems.length;
      }
    }
    return count;
  }, []);

  const completedCount = useMemo(() => Object.values(completedTopics).filter(Boolean).length, [completedTopics]);

  const daysCompleted = useMemo(() => {
    let c = 0;
    for (const d of dsaPlan) {
      let allDone = true;
      for (const item of d.items) {
        if (isTheory(item)) {
          for (let pi = 0; pi < item.problems.length; pi++) {
            if (!completedTopics[`${d.day}-p-${pi}-${item.title}`]) { allDone = false; break; }
          }
        }
        if (isRevision(item)) {
          for (let ri = 0; ri < item.items.length; ri++) {
            if (!completedTopics[`${d.day}-r-${ri}-${item.title}`]) { allDone = false; break; }
          }
        }
        if (!allDone) break;
      }
      if (allDone) c++;
    }
    return c;
  }, [completedTopics]);

  const totalItems = totalProblems + dsaPlan.reduce((s, d) => s + d.items.filter(isRevision).reduce((s2, r) => s2 + (r as RevisionNode).items.length, 0), 0);
  const overallPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const sectionCompletion = useMemo(() => {
    const result: Record<string, { done: number; total: number }> = {};
    for (const section of syllabusSections) {
      let done = 0;
      let total = 0;
      for (let d = section.dayRange[0]; d <= section.dayRange[1]; d++) {
        const dayPlan = dsaPlan.find(p => p.day === d);
        if (!dayPlan) continue;
        for (const item of dayPlan.items) {
          if (isTheory(item)) {
            total += item.problems.length;
            for (let pi = 0; pi < item.problems.length; pi++) {
              if (completedTopics[`${d}-p-${pi}-${item.title}`]) done++;
            }
          }
          if (isRevision(item)) {
            total += item.items.length;
            for (let ri = 0; ri < item.items.length; ri++) {
              if (completedTopics[`${d}-r-${ri}-${item.title}`]) done++;
            }
          }
        }
      }
      result[section.title] = { done, total };
    }
    return result;
  }, [completedTopics]);

  // Per-day per-topic completion data
  const dayTopicCompletion = useMemo(() => {
    return dsaPlan.map(d => {
      const topics: {
        title: string;
        type: 'theory' | 'revision';
        done: number;
        total: number;
        allDone: boolean;
      }[] = [];

      for (const item of d.items) {
        if (isTheory(item)) {
          let done = 0;
          for (let pi = 0; pi < item.problems.length; pi++) {
            if (completedTopics[`${d.day}-p-${pi}-${item.title}`]) done++;
          }
          topics.push({
            title: item.title,
            type: 'theory',
            done,
            total: item.problems.length,
            allDone: done === item.problems.length,
          });
        }
        if (isRevision(item)) {
          let done = 0;
          for (let ri = 0; ri < item.items.length; ri++) {
            if (completedTopics[`${d.day}-r-${ri}-${item.title}`]) done++;
          }
          topics.push({
            title: item.title,
            type: 'revision',
            done,
            total: item.items.length,
            allDone: done === item.items.length,
          });
        }
      }

      const dayDone = topics.reduce((s, t) => s + t.done, 0);
      const dayTotal = topics.reduce((s, t) => s + t.total, 0);

      return {
        day: d.day,
        topics,
        done: dayDone,
        total: dayTotal,
        allDone: dayDone === dayTotal && dayTotal > 0,
        someDone: dayDone > 0,
      };
    });
  }, [completedTopics]);

  // Find the section for a given day
  const getSectionForDay = (dayNum: number) => {
    return syllabusSections.find(s => dayNum >= s.dayRange[0] && dayNum <= s.dayRange[1]);
  };

  if (!mounted || loadingData) return <PageLoader />;

  return (
    <div className="h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={sharingEnabled ? ['#4F46E5', '#818CF8', '#C084FC'] : ['#5227FF', '#FF9FFC', '#B497CF']}
          mouseForce={5}
          cursorSize={100}
          isViscous
          viscous={sharingEnabled ? 50 : 30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={sharingEnabled ? 0.4 : 0.5}
          isBounce={false}
          autoDemo
          autoSpeed={sharingEnabled ? 0.1 : 0.1}
          autoIntensity={sharingEnabled ? 0 : 0}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-border/40 bg-background/5 backdrop-blur-md shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href={homeHref} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold">DSA Study Plan</span>
            <span className="text-[10px] text-muted-foreground/50 ml-1 hidden sm:inline">Progress Tracker</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={cycleTheme} className="h-8 w-8">
              {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : theme === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
            </Button>
            {sharingEnabled && (
              <Button variant="ghost" size="icon" onClick={handleShare} className="h-8 w-8 text-primary">
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {!user && (
              <Button onClick={handlePrimaryAction} size="sm" className="h-8 text-[11px] gap-2 rounded-lg">
                Join Plan
              </Button>
            )}
          </div>
        </div>
      </header>

      {!sharingEnabled ? (
        <main className="relative z-10 flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="space-y-4">
              <div className="h-20 w-20 mx-auto flex items-center justify-center rotate-3">
                <Lock className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Profile is Private</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  @{decodeURIComponent(userName)} has chosen to keep their progress private. Follow them to see their journey when they enable sharing!
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handlePrimaryAction}
                size="lg"
                className={`w-full gap-3 h-12 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 ${animating ? 'scale-95 opacity-70' : 'hover:scale-[1.02] hover:shadow-xl'
                  }`}
              >
                {user && userProfile ? (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Continue my Plan
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Join with Google
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" asChild className="w-full text-xs text-muted-foreground">
                <Link href="/landing">Back to Landing</Link>
              </Button>
            </div>
          </div>
        </main>
      ) : (
        <main className="relative z-10 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* User profile row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-12 text-center sm:text-left">
              {/* Profile picture */}
              <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center border border-white/10 backdrop-blur-xl shrink-0 overflow-hidden shadow-xl ring-4 ring-background/20">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName || userName}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary/40" />
                )}
              </div>
              <div className="space-y-1 pb-2">
                <h1 className="text-3xl font-bold tracking-tight">@{decodeURIComponent(userName)}</h1>
                <p className="text-sm text-muted-foreground font-medium">DSA Study Plan Progress</p>
              </div>
            </div>

            {/* Stat cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Target, label: 'Days Completed', value: `${daysCompleted}/60`, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { icon: Trophy, label: 'Problems Solved', value: `${completedCount}/${totalItems}`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { icon: Code2, label: 'Overall Completion', value: `${overallPct}%`, color: 'text-primary', bg: 'bg-primary/10' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/5 bg-background/20 backdrop-blur-xl p-5 shadow-sm transition-transform hover:scale-[1.02]">
                  <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Overall progress bar */}
            <div className="mb-12 p-1 rounded-full bg-background/20 border border-white/5 backdrop-blur-sm shadow-inner">
              <div className="h-3 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>

            {/* Two-column layout: section progress + day grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Section progress */}
              <div className="space-y-4 rounded-3xl border border-white/5 bg-background/20 backdrop-blur-xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">Topic Breakdown</h3>
                <div className="space-y-3">
                  {syllabusSections.map((section) => {
                    const completion = sectionCompletion[section.title];
                    const pct = completion && completion.total > 0 ? Math.round((completion.done / completion.total) * 100) : 0;
                    const isCompleted = completion && completion.done === completion.total && completion.total > 0;
                    const colors = sectionColorMap[section.color] || defaultColor;

                    return (
                      <div key={section.title} className="space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${colors.bg}`} />
                            <span className="text-xs font-semibold">{section.title}</span>
                          </div>
                          <span className="text-[10px] font-mono font-medium opacity-50">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-muted/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-500' : colors.bar}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day grid */}
              <div className="rounded-3xl border border-white/5 bg-background/20 backdrop-blur-xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">Activity Map</h3>
                <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-6 gap-2">
                  {dayTopicCompletion.map((d) => (
                    <div
                      key={d.day}
                      className={`flex items-center justify-center rounded-lg text-[10px] font-bold font-mono h-8 w-full transition-all hover:scale-110 cursor-default ${d.allDone
                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        : d.someDone
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-muted/10 text-muted-foreground/20 border border-transparent'
                        }`}
                      title={`Day ${d.day}: ${d.done}/${d.total}`}
                    >
                      {d.allDone ? '\u2713' : d.day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Per-day per-topic completion */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Detailed Breakdown</h3>
              <div className="grid gap-3">
                {dayTopicCompletion.filter(d => d.someDone).map((d) => (
                  <div
                    key={d.day}
                    className={`group rounded-2xl border border-white/5 bg-background/20 backdrop-blur-md p-4 transition-all hover:bg-background/30 ${d.allDone ? 'border-emerald-500/20' : ''
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`shrink-0 text-xs font-black font-mono h-10 w-10 flex items-center justify-center rounded-xl transition-colors ${d.allDone
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : 'bg-primary/10 text-primary'
                        }`}>
                        {d.allDone ? '\u2713' : d.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {d.topics.map((topic, ti) => (
                            <span
                              key={ti}
                              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-lg border border-white/5 backdrop-blur-sm ${topic.allDone
                                ? 'bg-emerald-500/5 text-emerald-500'
                                : 'bg-muted/10 text-muted-foreground/60'
                                }`}
                            >
                              {topic.type === 'theory' ? (
                                <BookOpen className="h-3 w-3" />
                              ) : (
                                <FlaskConical className="h-3 w-3" />
                              )}
                              {topic.title}
                              <span className="opacity-40 text-[9px] tabular-nums">{topic.done}/{topic.total}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      {d.allDone && (
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground/30 bg-background/5 backdrop-blur-md shrink-0">
        DSA Study Plan · {userName} Progress Tracker
      </footer>
    </div>
  );
}
