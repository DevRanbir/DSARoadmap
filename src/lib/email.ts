/**
 * Client-side helper to send emails via the /api/send route.
 * All functions are fire-and-forget — they log errors but never throw,
 * so a failed email never breaks the user flow.
 */

async function sendEmail(payload: Record<string, unknown>) {
  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Email send failed:', err);
    }
  } catch (err) {
    console.warn('Email send error:', err);
  }
}

export async function sendWelcomeEmail(to: string, username: string, displayName?: string) {
  return sendEmail({ type: 'welcome', to, username, displayName });
}

export async function sendBindInviteEmail(
  to: string,
  toUsername: string,
  fromUsername: string,
  fromDisplayName?: string,
) {
  return sendEmail({ type: 'bind_invite', to, toUsername, fromUsername, fromDisplayName });
}

export async function sendBindAcceptedEmail(
  to: string,
  toUsername: string,
  acceptedByUsername: string,
  acceptedByDisplayName?: string,
) {
  return sendEmail({ type: 'bind_accepted', to, toUsername, acceptedByUsername, acceptedByDisplayName });
}
