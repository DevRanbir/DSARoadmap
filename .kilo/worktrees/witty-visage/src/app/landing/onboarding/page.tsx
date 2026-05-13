'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sun,
  Moon,
  Monitor,
  Code2,
  ArrowRight,
  Plus,
  X,
  Mail,
  User,
  AtSign,
} from 'lucide-react';

const emptySubscribe = () => () => {};

export default function OnboardingPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [mailUpdates, setMailUpdates] = useState(true);
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [step, setStep] = useState<'username' | 'email'>('username');
  const [defaultEmail, setDefaultEmail] = useState('');
  const [error, setError] = useState('');

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const isValidUsername = (name: string) => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(name);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinueFromUsername = () => {
    if (!isValidUsername(userName)) {
      setError('Username must be 3-20 characters (letters, numbers, underscores)');
      return;
    }
    setError('');
    // Generate a mock default email from the Google sign-in
    const mockDefault = `${userName}@gmail.com`;
    setDefaultEmail(mockDefault);
    setEmails([mockDefault]);
    setStep('email');
  };

  const handleAddEmail = () => {
    if (!isValidEmail(newEmail)) return;
    if (emails.includes(newEmail)) return;
    setEmails([...emails, newEmail]);
    setNewEmail('');
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleFinish = () => {
    localStorage.setItem('dsa-user-name', userName);
    if (mailUpdates && emails.length > 0) {
      localStorage.setItem('dsa-emails', JSON.stringify(emails));
      localStorage.setItem('dsa-mail-updates', 'true');
    } else {
      localStorage.setItem('dsa-mail-updates', 'false');
    }
    router.push('/myPlan');
  };

  // Check if already logged in
  useEffect(() => {
    const existing = localStorage.getItem('dsa-user-name');
    if (existing) {
      router.replace('/myPlan');
    }
  }, [router]);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="border-b">
        <div className="max-w-md mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold">DSA Study Plan</span>
          </div>
          <Button variant="ghost" size="icon" onClick={cycleTheme} className="h-7 w-7">
            {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : theme === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-sm w-full">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 'username' ? 'bg-primary' : 'bg-primary/30'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 'email' ? 'bg-primary' : 'bg-primary/30'}`} />
          </div>

          {step === 'username' ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <AtSign className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold mb-1">Choose your username</h2>
                <p className="text-sm text-muted-foreground">
                  This will be your unique ID and share link
                </p>
              </div>

              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <Input
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''));
                      setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleContinueFromUsername()}
                    placeholder="your_username"
                    className="pl-8 h-11"
                    autoFocus
                    maxLength={20}
                  />
                </div>
                {error && (
                  <p className="text-xs text-destructive mt-1.5">{error}</p>
                )}
                <p className="text-[11px] text-muted-foreground/50 mt-1.5">
                  3-20 characters · letters, numbers, underscores
                </p>
              </div>

              <div className="text-center text-[11px] text-muted-foreground/40">
                Your progress page: /{userName || 'username'}/progress
              </div>

              <Button
                onClick={handleContinueFromUsername}
                disabled={!isValidUsername(userName)}
                className="w-full h-11 gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold mb-1">Stay updated</h2>
                <p className="text-sm text-muted-foreground">
                  Get progress reminders and completion reports
                </p>
              </div>

              {/* Checkbox for mail updates */}
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <Checkbox
                  id="mail-updates"
                  checked={mailUpdates}
                  onCheckedChange={(checked) => setMailUpdates(!!checked)}
                  className="mt-0.5"
                />
                <label htmlFor="mail-updates" className="text-sm leading-snug cursor-pointer">
                  <span className="font-medium">Email me progress updates</span>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Receive weekly summaries and milestone notifications
                  </span>
                </label>
              </div>

              {/* Email input — only visible when checkbox is checked */}
              {mailUpdates && (
                <div className="space-y-3">
                  {/* Add email input */}
                  <div className="flex gap-2">
                    <Input
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddEmail();
                      }}
                      placeholder="email@example.com"
                      className="flex-1 h-9 text-sm"
                      type="email"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddEmail}
                      disabled={!isValidEmail(newEmail)}
                      className="h-9 gap-1 px-3"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </Button>
                  </div>

                  {/* List of added emails */}
                  {emails.length > 0 && (
                    <div className="space-y-1.5">
                      {emails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2"
                        >
                          <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-sm flex-1 truncate">{email}</span>
                          {email === defaultEmail && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                              Primary
                            </span>
                          )}
                          {email !== defaultEmail && (
                            <button
                              onClick={() => handleRemoveEmail(email)}
                              className="text-muted-foreground/50 hover:text-destructive transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground/50">
                    Add multiple emails to send updates to different addresses
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setStep('username')}
                  className="h-11"
                >
                  Back
                </Button>
                <Button
                  onClick={handleFinish}
                  className="flex-1 h-11 gap-2"
                >
                  {mailUpdates && emails.length > 0 ? `Start with ${emails.length} email${emails.length > 1 ? 's' : ''}` : 'Start Studying'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {!mailUpdates && (
                <button
                  onClick={handleFinish}
                  className="w-full text-center text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  Skip — I don&apos;t want email updates
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
