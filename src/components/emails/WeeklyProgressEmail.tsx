import * as React from 'react';

interface WeeklyProgressEmailProps {
  username: string;
  displayName?: string;
  daysCompleted: number;
  problemsSolved: number;
  totalProblems: number;
  overallPct: number;
  currentStreak?: number;
}

export function WeeklyProgressEmail({
  username, displayName, daysCompleted, problemsSolved, totalProblems, overallPct, currentStreak = 0,
}: WeeklyProgressEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dsa.itsranbir.me';

  const motivationalMessages = [
    "Every problem you solve is a step closer to your dream job.",
    "Consistency beats intensity. Keep showing up.",
    "You're building skills that will last a lifetime.",
    "The best time to start was yesterday. The second best time is now.",
    "Progress, not perfection.",
  ];
  const message = motivationalMessages[daysCompleted % motivationalMessages.length];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '0 auto', padding: '40px 24px', color: '#111' }}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>DSA Study Plan</span>
        <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>Weekly Update</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
        Your weekly progress 📊
      </h1>
      <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
        Hey {displayName || `@${username}`}, here's how your DSA journey is going this week.
      </p>

      <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '20px 24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{daysCompleted}<span style={{ fontSize: 13, fontWeight: 400, color: '#888' }}>/60</span></div>
            <div style={{ fontSize: 11, color: '#888' }}>Days Done</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{problemsSolved}<span style={{ fontSize: 13, fontWeight: 400, color: '#888' }}>/{totalProblems}</span></div>
            <div style={{ fontSize: 11, color: '#888' }}>Problems</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{overallPct}<span style={{ fontSize: 13, fontWeight: 400, color: '#888' }}>%</span></div>
            <div style={{ fontSize: 11, color: '#888' }}>Overall</div>
          </div>
          {currentStreak > 0 && (
            <div style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>🔥 {currentStreak}</div>
              <div style={{ fontSize: 11, color: '#888' }}>Day Streak</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 20, background: '#e5e5e5', borderRadius: 4, height: 8, overflow: 'hidden' }}>
          <div style={{ width: `${overallPct}%`, height: '100%', background: '#111', borderRadius: 4 }} />
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: '#888' }}>{overallPct}% complete</div>
      </div>

      <div style={{ borderLeft: '3px solid #e5e5e5', paddingLeft: 16, marginBottom: 28, color: '#555', fontStyle: 'italic', fontSize: 14 }}>
        "{message}"
      </div>

      <a
        href={`${appUrl}/myPlan`}
        style={{
          display: 'inline-block', background: '#111', color: '#fff',
          padding: '12px 28px', borderRadius: 8, fontWeight: 600,
          fontSize: 14, textDecoration: 'none', marginBottom: 24,
        }}
      >
        Continue studying →
      </a>

      <p style={{ fontSize: 12, color: '#aaa' }}>
        You're receiving this because you enabled email updates in your DSA Study Plan settings.
        <br />
        <a href={`${appUrl}/myPlan`} style={{ color: '#aaa' }}>Manage preferences</a>
      </p>
    </div>
  );
}
