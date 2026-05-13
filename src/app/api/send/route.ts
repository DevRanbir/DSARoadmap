import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { BindInviteEmail } from '@/components/emails/BindInviteEmail';
import { BindAcceptedEmail } from '@/components/emails/BindAcceptedEmail';
import { DayCompletedEmail } from '@/components/emails/DayCompletedEmail';
import { WeeklyProgressEmail } from '@/components/emails/WeeklyProgressEmail';

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

      case 'day_completed':
        subject = `Day ${payload.dayNumber} complete! ✅ Keep going`;
        react = DayCompletedEmail({
          username: payload.username,
          displayName: payload.displayName,
          dayNumber: payload.dayNumber,
          totalDaysCompleted: payload.totalDaysCompleted,
          overallPct: payload.overallPct,
        });
        break;

      case 'weekly_progress':
        subject = `Your DSA progress this week 📊`;
        react = WeeklyProgressEmail({
          username: payload.username,
          displayName: payload.displayName,
          daysCompleted: payload.daysCompleted,
          problemsSolved: payload.problemsSolved,
          totalProblems: payload.totalProblems,
          overallPct: payload.overallPct,
          currentStreak: payload.currentStreak,
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
