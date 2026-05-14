import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { BindInviteEmail } from '@/components/emails/BindInviteEmail';
import { BindAcceptedEmail } from '@/components/emails/BindAcceptedEmail';
import { DailyWrapupEmail } from '@/components/emails/DailyWrapupEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'DSA Study Plan <noreply@itsranbir.me>';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, to, ...payload } = body;

    if (!type || !to) {
      return NextResponse.json({ error: 'Missing type or to' }, { status: 400 });
    }

    let subject = '';
    let react: React.ReactElement | null = null;

    switch (type) {
      case 'welcome':
        subject = 'Welcome to DSA Study Plan 🚀';
        react = WelcomeEmail({ username: payload.username, displayName: payload.displayName });
        break;

      case 'bind_invite':
        subject = `@${payload.fromUsername} wants to study with you`;
        react = BindInviteEmail({
          toUsername: payload.toUsername,
          fromUsername: payload.fromUsername,
          fromDisplayName: payload.fromDisplayName,
        });
        break;

      case 'bind_accepted':
        subject = `@${payload.acceptedByUsername} accepted your bind request 🎉`;
        react = BindAcceptedEmail({
          toUsername: payload.toUsername,
          acceptedByUsername: payload.acceptedByUsername,
          acceptedByDisplayName: payload.acceptedByDisplayName,
        });
        break;

      case 'daily_wrapup':
        subject = payload.didSomethingToday ? 'Your 9PM DSA wrap-up 🌙' : 'You missed today — your DSA wrap-up 🌙';
        react = DailyWrapupEmail({
          username: payload.username || 'user',
          displayName: payload.displayName,
          dateLabel: payload.dateLabel || '',
          daysCompleted: Number(payload.daysCompleted) || 0,
          problemsSolved: Number(payload.problemsSolved) || 0,
          totalProblems: Number(payload.totalProblems) || 0,
          overallPct: Number(payload.overallPct) || 0,
          bindedFriendsCount: Number(payload.bindedFriendsCount) || 0,
          currentDayNumber: Number(payload.currentDayNumber) || 1,
          currentDayCoverageDone: Number(payload.currentDayCoverageDone) || 0,
          currentDayCoverageTotal: Number(payload.currentDayCoverageTotal) || 0,
          completedDayNumbersToday: Array.isArray(payload.completedDayNumbersToday)
            ? payload.completedDayNumbersToday.map((day: unknown) => Number(day)).filter((day: number) => Number.isFinite(day))
            : [],
          didSomethingToday: Boolean(payload.didSomethingToday),
          missedDayQuote: payload.missedDayQuote,
        });
        break;

      default:
        return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      react: react!,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
