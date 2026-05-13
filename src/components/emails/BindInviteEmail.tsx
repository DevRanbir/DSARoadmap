import * as React from 'react';

interface BindInviteEmailProps {
  toUsername: string;
  fromUsername: string;
  fromDisplayName?: string;
}

export function BindInviteEmail({ toUsername, fromUsername, fromDisplayName }: BindInviteEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dsa.itsranbir.me';
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '0 auto', padding: '40px 24px', color: '#111' }}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>DSA Study Plan</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
        Study partner request 🤝
      </h1>
      <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
        <strong>{fromDisplayName || `@${fromUsername}`}</strong> wants to bind with you on DSA Study Plan.
        Binding lets you compare your day-by-day progress side by side.
      </p>

      <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
          {fromUsername.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>@{fromUsername}</div>
          <div style={{ fontSize: 12, color: '#888' }}>sent you a bind invite</div>
        </div>
      </div>

      <a
        href={`${appUrl}/myPlan`}
        style={{
          display: 'inline-block', background: '#111', color: '#fff',
          padding: '12px 28px', borderRadius: 8, fontWeight: 600,
          fontSize: 14, textDecoration: 'none', marginBottom: 16,
        }}
      >
        Accept in app →
      </a>

      <p style={{ fontSize: 12, color: '#aaa', marginTop: 24 }}>
        Open the app, go to Settings → Notifications to accept or dismiss this invite.
      </p>
    </div>
  );
}
