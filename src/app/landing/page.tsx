'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Code2, Target, Trophy, ArrowRight, BookOpen, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/PageLoader';
import LiquidEther from '@/components/ui/LiquidEther';
import { syllabusSections, dsaPlan, DayItem, TheoryNode } from '@/lib/dsa-plan';

const emptySubscribe = () => () => { };

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

function isTheory(item: DayItem): item is TheoryNode {
  return item.type === 'theory';
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();
  const [animating, setAnimating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([syllabusSections[0].title]));
  const { user, userProfile, loading, signInWithGoogle } = useAuth();

  const sectionSubtopics = useMemo(() => {
    const result: Record<string, { day: number; title: string }[]> = {};
    for (const section of syllabusSections) {
      const days: { day: number; title: string }[] = [];
      for (let d = section.dayRange[0]; d <= section.dayRange[1]; d++) {
        const dayPlan = dsaPlan.find(p => p.day === d);
        if (!dayPlan) continue;
        const firstTheory = dayPlan.items.find(isTheory);
        if (firstTheory) {
          days.push({ day: d, title: firstTheory.title });
        }
      }
      result[section.title] = days;
    }
    return result;
  }, []);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const hasCompletedOnboarding = !!(user && userProfile && userProfile.username !== user.email?.split('@')[0]);

  const handlePrimaryAction = async () => {
    if (user && userProfile) {
      router.push(hasCompletedOnboarding ? '/myPlan' : '/landing/onboarding');
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

  if (!mounted || loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B497CF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-border/40 bg-background/5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">DSA Study Plan</span>
          </div>
          <Button variant="ghost" size="icon" onClick={cycleTheme} className="h-8 w-8">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-40 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6 backdrop-blur-sm">
            <Target className="h-3 w-3" />
            60 Days · 360+ Problems · Interview Ready
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-[1.15]">
            Master DSA in<br />
            <span className="text-primary">60 Days</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto">
            A structured study plan covering arrays to advanced algorithms, with curated LeetCode, GFG & Codeforces problems for each day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary auth/continue action */}
            <Button
              onClick={handlePrimaryAction}
              size="lg"
              className={`gap-3 h-12 px-8 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 ${animating ? 'scale-95 opacity-70' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30'
                }`}
            >
              {user && userProfile ? (
                <>
                  <ArrowRight className="h-4 w-4" />
                  Continue to Plan
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-3 h-12 px-8 text-sm font-semibold rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
              onClick={() => {
                const el = document.getElementById('syllabus');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Syllabus
            </Button>
          </div>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Target, label: '10 Topics' },
              { icon: Code2, label: '360+ Problems' },
              { icon: Trophy, label: 'Track Progress' },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/40 border border-border/20 text-xs text-muted-foreground backdrop-blur-sm"
              >
                <f.icon className="h-3 w-3" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Syllabus Section */}
      <section id="syllabus" className="relative z-10 py-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              A structured study plan covering arrays to advanced algorithms, with curated LeetCode, GFG & Codeforces problems for each day.
            </p>
          </div>

          <div className="space-y-1">
            {syllabusSections.map((section) => {
              const isExpanded = expandedSections.has(section.title);
              const subtopics = sectionSubtopics[section.title] || [];
              const colors = sectionColorMap[section.color] || defaultColor;

              return (
                <div key={section.title} className="flex flex-col">
                  {/* Section Header */}
                  <div
                    onClick={() => toggleSection(section.title)}
                    className={`group cursor-pointer rounded-xl transition-all duration-200 
                      ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className={`shrink-0 transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`}>
                        <ChevronDown className="h-3.5 w-3.5 text-white/20 group-hover:text-white/40" />
                      </span>
                      <span className={`shrink-0 h-2.5 w-2.5 rounded-full ${colors.bg} shadow-[0_0_8px_rgba(0,0,0,0.8)]`} />
                      <span className={`text-[15px] leading-tight flex-1 font-bold ${isExpanded ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                        {section.title}
                      </span>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="text-[11px] text-white/20 font-mono tracking-tighter tabular-nums">{section.dayRange[0]}–{section.dayRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-items branch */}
                  {isExpanded && subtopics.length > 0 && (
                    <div className="relative flex ml-[28px] mt-0.5 mb-4">
                      {/* Vertical line */}
                      <div className="relative w-[5px] shrink-0 mr-3 my-1">
                        <div className="absolute inset-0 rounded-full bg-white/[0.05]" />
                        <div className={`absolute top-0 left-0 right-0 h-1/3 rounded-full ${colors.bar} shadow-[0_0_12px_${section.color}]`} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        {subtopics.map((sub) => (
                          <div
                            key={sub.day}
                            className="group/day flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 hover:bg-white/[0.03] cursor-default"
                          >
                            <div className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-[4px] text-[10px] font-bold transition-all duration-200
                              bg-[#1a1a1a] text-white/30 border border-white/5 group-hover/day:border-white/20 group-hover/day:text-white/80`}>
                              {sub.day}
                            </div>
                            <span className="text-[13px] font-medium text-white/50 group-hover/day:text-white/90 transition-colors truncate">
                              {sub.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-4 text-center text-[11px] text-muted-foreground/50 bg-background/5 backdrop-blur-md">
        Built for interview prep. Track your DSA journey.
      </footer>
    </div>
  );
}
