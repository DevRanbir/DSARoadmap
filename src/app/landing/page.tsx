'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Code2, Target, Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/PageLoader';
import LiquidEther from '@/components/ui/LiquidEther';

const emptySubscribe = () => () => {};

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();
  const [animating, setAnimating] = useState(false);
  const { user, userProfile, loading, signInWithGoogle } = useAuth();

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
          colors={[ '#5227FF', '#FF9FFC', '#B497CF' ]}
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6 backdrop-blur-sm">
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

          {/* Primary auth/continue action */}
          <Button
            onClick={handlePrimaryAction}
            size="lg"
            className={`gap-3 h-12 px-8 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 ${
              animating ? 'scale-95 opacity-70' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30'
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

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-4 text-center text-[11px] text-muted-foreground/50 bg-background/5 backdrop-blur-md">
        Built for interview prep. Track your DSA journey.
      </footer>
    </div>
  );
}
