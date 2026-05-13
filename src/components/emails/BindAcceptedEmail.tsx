import * as React from 'react';

interface BindAcceptedEmailProps {
  toUsername: string;
  acceptedByUsername: string;
  acceptedByDisplayName?: string;
}

export function BindAcceptedEmail({ toUsername, acceptedByUsername, acceptedByDisplayName }: BindAcceptedEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dsa.itsranbir.me';
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '0 auto', padding: '40px 24px', color: '#111' }}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>DSA Study Plan</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
        Bind accepted! 🎉
      </h1>
      <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
        <strong>{acceptedByDisplayName || `@${acceptedByUsername}`}</strong> accepted your bind request.
        You can now compare your progress side by side in the app.
      </p>

      <a
        href={`${appUrl}/myPlan`}
        style={{
          display: 'inline-block', background: '#111', color: '#fff',
          padding: '12px 28px', borderRadius: 8, fontWeight: 600,
          fontSize: 14, textDecoration: 'none', marginBottom: 32,
        }}
      >
        Compare progress →
      </a>

      <p style={{ fontSize: 12, color: '#aaa' }}>
        Open Settings → Bind in the app to manage your study partners.
      </p>
    </div>
  );
}
