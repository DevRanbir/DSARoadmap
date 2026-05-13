import * as React from 'react';

interface DayCompletedEmailProps {
  username: string;
  displayName?: string;
  dayNumber: number;
  totalDaysCompleted: number;
  overallPct: number;
}

export function DayCompletedEmail({ username, displayName, dayNumber, totalDaysCompleted, overallPct }: DayCompletedEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dsa.itsranbir.me';

  const milestones: Record<number, string> = {
    7:  'You finished Week 1 — Introduction to Data Structures!',
    10: 'Algorithmic Complexity mastered!',
    16: 'Sorting Algorithms complete!',
    18: 'Search Algorithms done!',
    26: 'Graph Data Structures conquered!',
    34: 'Tree Data Structures complete!',
    39: 'Advanced Data Structures done!',
    50: 'Algorithm Techniques mastered!',
    54: 'Problem Solving Techniques complete!',
    60: '🏆 You completed the full 60-day DSA plan!',
  };

  const milestone = milestones[dayNumber];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '0 auto', padding: '40px 24px', color: '#111' }}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>DSA Study Plan</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
        Day {dayNumber} complete! ✅
      </h1>

      {milestone && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#166534', fontSize: 14, fontWeight: 500 }}>
          🎯 {milestone}
        </div>
      )}

      <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
        Great work, {displayName || `@${username}`}! You've completed Day {dayNumber} of your 60-day DSA plan.
        Keep the momentum going — consistency is the key to interview success.
      </p>

      <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '20px 24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{totalDaysCompleted}<span style={{ fontSize: 13, fontWeight: 400, color: '#888' }}>/60</span></div>
            <div style={{ fontSize: 11, color: '#888' }}>Days Done</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{overallPct}<span style={{ fontSize: 13, fontWeight: 400, color: '#888' }}>%</span></div>
            <div style={{ fontSize: 11, color: '#888' }}>Overall</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 16, background: '#e5e5e5', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{ width: `${overallPct}%`, height: '100%', background: '#111', borderRadius: 4 }} />
        </div>
      </div>

      <a
        href={`${appUrl}/myPlan`}
        style={{
          display: 'inline-block', background: '#111', color: '#fff',
          padding: '12px 28px', borderRadius: 8, fontWeight: 600,
          fontSize: 14, textDecoration: 'none',
        }}
      >
        Continue to Day {dayNumber + 1} →
      </a>
    </div>
  );
}
