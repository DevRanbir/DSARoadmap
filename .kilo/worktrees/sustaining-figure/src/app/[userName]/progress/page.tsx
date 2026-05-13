'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore, useMemo } from 'react';
import { dsaPlan, syllabusSections, TheoryNode, RevisionNode, DayItem } from '@/lib/dsa-plan';
import { useProgress } from '@/hooks/use-progress';
import { Button } from '@/components/ui/button';
import { use } from 'react';
import {
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
  Code2,
  Trophy,
  Target,
  CircleDot,
  BookOpen,
  FlaskConical,
  User,
} from 'lucide-react';

const emptySubscribe = () => () => {};

function isTheory(item: DayItem): item is TheoryNode {
  return item.type === 'theory';
}

function isRevision(item: DayItem): item is RevisionNode {
  return item.type === 'revision';
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

export default function ProgressPage({ params }: { params: Promise<{ userName: string }> }) {
  const { userName } = use(params);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { completedTopics } = useProgress();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

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

  const sharingEnabled = typeof window !== 'undefined' ? localStorage.getItem('dsa-sharing-enabled') === 'true' : false;

  if (!mounted) return <div className="min-h-screen bg-background" />;

  if (!sharingEnabled) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-3">
          <User className="h-10 w-10 mx-auto text-muted-foreground/30" />
          <div className="text-sm font-medium text-muted-foreground">This profile is private</div>
          <div className="text-xs text-muted-foreground/50">@{userName} has not enabled public sharing</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Minimal top bar — just theme toggle */}
      <header className="shrink-0 border-b px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold">DSA Study Plan</span>
          <span className="text-[10px] text-muted-foreground/50 ml-1">Public Progress</span>
        </div>
        <Button variant="ghost" size="icon" onClick={cycleTheme} className="h-7 w-7">
          {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : theme === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* User profile row */}
          <div className="flex items-center gap-4 mb-6">
            {/* Profile picture — empty/placeholder */}
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-muted-foreground/10 shrink-0">
              <User className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div>
              <h1 className="text-xl font-bold">@{decodeURIComponent(userName)}</h1>
              <p className="text-sm text-muted-foreground">DSA Study Plan Progress</p>
            </div>
          </div>

          {/* Stat cards row — compact */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: Target, label: 'Days Done', value: `${daysCompleted}/60`, color: 'text-blue-500' },
              { icon: Trophy, label: 'Problems', value: `${completedCount}/${totalItems}`, color: 'text-emerald-500' },
              { icon: Code2, label: 'Overall', value: `${overallPct}%`, color: 'text-primary' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border p-3 text-center">
                <stat.icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
                <div className="text-base font-bold">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="mb-5">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }} />
            </div>
          </div>

          {/* Two-column layout: section progress + day grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Section progress — compact */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">Topics</h3>
              {syllabusSections.map((section) => {
                const completion = sectionCompletion[section.title];
                const pct = completion && completion.total > 0 ? Math.round((completion.done / completion.total) * 100) : 0;
                const isCompleted = completion && completion.done === completion.total && completion.total > 0;
                const colors = sectionColorMap[section.color] || defaultColor;

                return (
                  <div key={section.title} className="flex items-center gap-2 py-1">
                    <span className={`shrink-0 h-1.5 w-1.5 rounded-full ${colors.bg}`} />
                    <span className="text-[12px] font-medium flex-1 truncate">{section.title}</span>
                    <span className="text-[10px] text-muted-foreground/50 font-mono">{section.dayRange[0]}–{section.dayRange[1]}</span>
                    {isCompleted && <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />}
                    {!isCompleted && <span className="text-[10px] font-semibold tabular-nums w-7 text-right">{pct}%</span>}
                    <div className="w-16 h-1 bg-muted/50 rounded-full overflow-hidden shrink-0">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : colors.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Day grid */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">Day-by-Day Progress</h3>
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-1">
                {dayTopicCompletion.map((d) => (
                  <div
                    key={d.day}
                    className={`flex items-center justify-center rounded text-[10px] font-mono h-7 ${
                      d.allDone
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : d.someDone
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-muted/40 text-muted-foreground/40'
                    }`}
                    title={`Day ${d.day}: ${d.done}/${d.total}`}
                  >
                    {d.allDone ? '\u2713' : d.day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Per-day per-topic completion — expandable rows */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">Per-Day Breakdown</h3>
            <div className="space-y-1">
              {dayTopicCompletion.map((d) => {
                const section = getSectionForDay(d.day);
                const colors = section ? (sectionColorMap[section.color] || defaultColor) : defaultColor;

                return (
                  <div
                    key={d.day}
                    className={`rounded-md border px-3 py-2 ${
                      d.allDone ? 'border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`shrink-0 text-[10px] font-bold font-mono h-5 min-w-[22px] flex items-center justify-center rounded-[3px] ${
                        d.allDone
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : d.someDone
                          ? 'bg-muted/60 text-muted-foreground'
                          : 'bg-muted/30 text-muted-foreground/40'
                      }`}>
                        {d.allDone ? '\u2713' : d.day}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {d.topics.map((topic, ti) => (
                            <span
                              key={ti}
                              className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-[3px] ${
                                topic.allDone
                                  ? topic.type === 'revision'
                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-muted/40 text-muted-foreground/50'
                              }`}
                            >
                              {topic.type === 'theory' ? (
                                <BookOpen className="h-2.5 w-2.5" />
                              ) : (
                                <FlaskConical className="h-2.5 w-2.5" />
                              )}
                              {topic.title}
                              <span className="opacity-60">{topic.done}/{topic.total}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {d.allDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                        {!d.allDone && d.someDone && (
                          <span className="text-[9px] font-semibold text-muted-foreground/40 tabular-nums">{d.done}/{d.total}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
