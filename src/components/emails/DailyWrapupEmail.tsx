import * as React from 'react';

interface DailyWrapupEmailProps {
  username: string;
  displayName?: string;
  dateLabel: string;
  daysCompleted: number;
  problemsSolved: number;
  totalProblems: number;
  overallPct: number;
  bindedFriendsCount: number;
  currentDayNumber: number;
  currentDayCoverageDone: number;
  currentDayCoverageTotal: number;
  completedDayNumbersToday: number[];
  didSomethingToday: boolean;
  missedDayQuote?: string;
}

export function DailyWrapupEmail({
  username,
  displayName,
  dateLabel,
  daysCompleted,
  problemsSolved,
  totalProblems,
  overallPct,
  bindedFriendsCount,
  currentDayNumber,
  currentDayCoverageDone,
  currentDayCoverageTotal,
  completedDayNumbersToday,
  didSomethingToday,
  missedDayQuote,
}: DailyWrapupEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dsa.itsranbir.me';
  const greeting = displayName || `@${username}`;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '0 auto', padding: '40px 24px', color: '#111' }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>DSA Study Plan</span>
        <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>Daily Wrap-up</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Your day wrap-up 🌙</h1>
      <p style={{ fontSize: 14, color: '#666', marginTop: 0, marginBottom: 18 }}>
        {dateLabel} (IST)
      </p>

      <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
        Hey {greeting}, here is your complete day snapshot.
      </p>

      <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 96 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{daysCompleted}<span style={{ fontSize: 12, fontWeight: 500, color: '#888' }}>/60</span></div>
            <div style={{ fontSize: 11, color: '#888' }}>Current Progress</div>
          </div>
          <div style={{ minWidth: 96 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{problemsSolved}<span style={{ fontSize: 12, fontWeight: 500, color: '#888' }}>/{totalProblems}</span></div>
            <div style={{ fontSize: 11, color: '#888' }}>Problems Solved</div>
          </div>
          <div style={{ minWidth: 96 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{overallPct}<span style={{ fontSize: 12, fontWeight: 500, color: '#888' }}>%</span></div>
            <div style={{ fontSize: 11, color: '#888' }}>Overall</div>
          </div>
          <div style={{ minWidth: 96 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{bindedFriendsCount}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Binded Friends</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Today&apos;s day-wise coverage</div>
        <div style={{ fontSize: 14, color: '#444' }}>
          Day {currentDayNumber}: {currentDayCoverageDone}/{currentDayCoverageTotal} items done
        </div>
      </div>

      {completedDayNumbersToday.length > 0 && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#166534', marginBottom: 4 }}>Day completion update</div>
          <div style={{ fontSize: 14, color: '#166534' }}>
            Great job! You completed {completedDayNumbersToday.length > 1 ? 'days' : 'day'} {completedDayNumbersToday.map((day) => `#${day}`).join(', ')} today.
          </div>
        </div>
      )}

      {!didSomethingToday && missedDayQuote && (
        <div style={{ borderLeft: '3px solid #111', paddingLeft: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#444', marginBottom: 6 }}>You missed today&apos;s study target.</div>
          <div style={{ fontSize: 14, color: '#111', fontStyle: 'italic' }}>
            &quot;{missedDayQuote}&quot;
          </div>
        </div>
      )}

      <a
        href={`${appUrl}/myPlan`}
        style={{
          display: 'inline-block',
          background: '#111',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          textDecoration: 'none',
          marginBottom: 20,
        }}
      >
        Continue your roadmap →
      </a>

      <p style={{ fontSize: 12, color: '#aaa' }}>
        You&apos;re receiving this because email updates are enabled.
        <br />
        <a href={`${appUrl}/myPlan`} style={{ color: '#aaa' }}>Manage preferences</a>
      </p>
    </div>
  );
}
