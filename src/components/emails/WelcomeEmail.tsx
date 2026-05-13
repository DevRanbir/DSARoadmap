import * as React from 'react';

interface WelcomeEmailProps {
  username: string;
  displayName?: string;
}

export function WelcomeEmail({ username, displayName }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '0 auto', padding: '40px 24px', color: '#111' }}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>DSA Study Plan</span>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Welcome, {displayName || `@${username}`}! 🎉
      </h1>
      <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
        You're all set to start your 60-day DSA journey. Your study plan covers 10 topics,
        360+ curated problems from LeetCode, GFG & Codeforces — everything you need to ace your interviews.
      </p>

      <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '20px 24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>60</div>
            <div style={{ fontSize: 11, color: '#888' }}>Days</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>360+</div>
            <div style={{ fontSize: 11, color: '#888' }}>Problems</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>10</div>
            <div style={{ fontSize: 11, color: '#888' }}>Topics</div>
          </div>
        </div>
      </div>

      <a
        href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/myPlan`}
        style={{
          display: 'inline-block', background: '#111', color: '#fff',
          padding: '12px 28px', borderRadius: 8, fontWeight: 600,
          fontSize: 14, textDecoration: 'none', marginBottom: 32,
        }}
      >
        Start Day 1 →
      </a>

      <p style={{ fontSize: 12, color: '#aaa' }}>
        Your progress page: <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${username}/progress`} style={{ color: '#888' }}>/{username}/progress</a>
      </p>
    </div>
  );
}
