import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { dsaPlan, DayItem, TheoryNode, RevisionNode } from '@/lib/dsa-plan';
import { DailyWrapupEmail } from '@/components/emails/DailyWrapupEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'DSA Study Plan <noreply@itsranbir.me>';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const TARGET_IST_HOUR = 21;

const MISSED_DAY_QUOTES = [
  'You did not lose today, you only delayed your win. Restart tomorrow stronger.',
  'Missing one day is a stumble, not a stop. Come back and claim your streak.',
  "Your future self is still waiting for today's effort. Show up tomorrow.",
  'A skipped day is feedback, not failure. Reset and continue.',
  'Discipline is built in comebacks. Begin again tomorrow.',
  'One missed day does not define you. Your next action does.',
];

type ProgressMap = Record<string, boolean>;
type GenericMap = Record<string, unknown>;

interface DayCoverage {
  done: number;
  total: number;
}

interface ProgressStats {
  daysCompleted: number;
  problemsSolved: number;
  totalProblems: number;
  overallPct: number;
  dayCoverage: Record<number, DayCoverage>;
  currentDayNumber: number;
}

function isTheory(item: DayItem): item is TheoryNode {
  return item.type === 'theory';
}

function isRevision(item: DayItem): item is RevisionNode {
  return item.type === 'revision';
}

const dayKeyMap: Record<number, { keys: string[]; theoryKeys: string[] }> = (() => {
  const result: Record<number, { keys: string[]; theoryKeys: string[] }> = {};
  for (const day of dsaPlan) {
    const keys: string[] = [];
    const theoryKeys: string[] = [];
    for (const item of day.items) {
      if (isTheory(item)) {
        for (let pi = 0; pi < item.problems.length; pi++) {
          const key = `${day.day}-p-${pi}-${item.title}`;
          keys.push(key);
          theoryKeys.push(key);
        }
      }
      if (isRevision(item)) {
        for (let ri = 0; ri < item.items.length; ri++) {
          keys.push(`${day.day}-r-${ri}-${item.title}`);
        }
      }
    }
    result[day.day] = { keys, theoryKeys };
  }
  return result;
})();

const totalItems = Object.values(dayKeyMap).reduce((sum, day) => sum + day.keys.length, 0);
const totalProblems = Object.values(dayKeyMap).reduce((sum, day) => sum + day.theoryKeys.length, 0);

function computeProgressStats(progress: ProgressMap): ProgressStats {
  let completedItems = 0;
  let daysCompleted = 0;
  let problemsSolved = 0;
  const dayCoverage: Record<number, DayCoverage> = {};

  for (const day of dsaPlan) {
    const meta = dayKeyMap[day.day];
    let done = 0;
    for (const key of meta.keys) {
      if (progress[key]) done++;
    }
    for (const key of meta.theoryKeys) {
      if (progress[key]) problemsSolved++;
    }

    const total = meta.keys.length;
    dayCoverage[day.day] = { done, total };
    completedItems += done;
    if (total > 0 && done === total) {
      daysCompleted++;
    }
  }

  const overallPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const currentDayNumber = Math.min(daysCompleted + 1, 60);

  return {
    daysCompleted,
    problemsSolved,
    totalProblems,
    overallPct,
    dayCoverage,
    currentDayNumber,
  };
}

function toIstDateWindow(now: Date) {
  const istMs = now.getTime() + IST_OFFSET_MS;
  const istDate = new Date(istMs);

  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth();
  const day = istDate.getUTCDate();
  const hour = istDate.getUTCHours();

  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const startOfIstDayUtcMs = Date.UTC(year, month, day) - IST_OFFSET_MS;
  const endOfIstDayUtcMs = startOfIstDayUtcMs + DAY_MS - 1;

  return { dateKey, hour, startOfIstDayUtcMs, endOfIstDayUtcMs };
}

function pickMissedDayQuote(uid: string, dateKey: string) {
  const seed = `${uid}:${dateKey}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % MISSED_DAY_QUOTES.length;
  return MISSED_DAY_QUOTES[idx];
}

function getAcceptedBindsCount(bindsByUser: GenericMap | null | undefined, uid: string) {
  const userBinds = (bindsByUser?.[uid] ?? {}) as GenericMap;
  return Object.values(userBinds).reduce((count, bind) => {
    const status = typeof bind === 'object' && bind ? (bind as { status?: string }).status : undefined;
    return status === 'accepted' ? count + 1 : count;
  }, 0);
}

function getCompletedDaysToday(dayCompletionsByUser: GenericMap | null | undefined, uid: string, startUtc: number, endUtc: number) {
  const userCompletions = (dayCompletionsByUser?.[uid] ?? {}) as Record<string, unknown>;
  return Object.entries(userCompletions)
    .map(([key, ts]) => ({
      day: Number(key.replace('day_', '')),
      ts: Number(ts),
    }))
    .filter((entry) => Number.isFinite(entry.day) && Number.isFinite(entry.ts) && entry.ts >= startUtc && entry.ts <= endUtc)
    .map((entry) => entry.day)
    .sort((a, b) => a - b);
}

function getFirebaseBaseUrl() {
  return (process.env.FIREBASE_DATABASE_URL || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '').replace(/\/+$/, '');
}

function getFirebaseAuthSecret() {
  return process.env.FIREBASE_DATABASE_SECRET || '';
}

function buildFirebaseUrl(path: string) {
  const baseUrl = getFirebaseBaseUrl();
  if (!baseUrl) {
    throw new Error('Missing FIREBASE_DATABASE_URL or NEXT_PUBLIC_FIREBASE_DATABASE_URL');
  }
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const url = new URL(`${baseUrl}/${cleanPath}.json`);
  const secret = getFirebaseAuthSecret();
  if (secret) {
    url.searchParams.set('auth', secret);
  }
  return url.toString();
}

async function firebaseGet<T>(path: string): Promise<T | null> {
  const res = await fetch(buildFirebaseUrl(path), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Firebase GET failed (${res.status}) for ${path}`);
  }
  return (await res.json()) as T | null;
}

async function firebasePut(path: string, value: unknown) {
  const res = await fetch(buildFirebaseUrl(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
  if (!res.ok) {
    throw new Error(`Firebase PUT failed (${res.status}) for ${path}`);
  }
}

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const bearer = req.headers.get('authorization');
  if (bearer?.startsWith('Bearer ') && bearer.slice(7) === secret) {
    return true;
  }

  return req.headers.get('x-cron-secret') === secret;
}

async function handleDailyWrapup(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Missing CRON_SECRET' }, { status: 500 });
  }

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
  }

  const forceRun = req.nextUrl.searchParams.get('force') === '1';
  const now = new Date();
  const { dateKey, hour, startOfIstDayUtcMs, endOfIstDayUtcMs } = toIstDateWindow(now);

  if (!forceRun && hour !== TARGET_IST_HOUR) {
    return NextResponse.json({
      skipped: true,
      reason: `Runs only at ${TARGET_IST_HOUR}:00 IST`,
      nowIstHour: hour,
      dateKey,
    });
  }

  const [usersByUid, userSettingsByUid, progressByUid, bindsByUid, activityByUid, dayCompletionsByUid, emailsSentByUid] = await Promise.all([
    firebaseGet<GenericMap>('users'),
    firebaseGet<GenericMap>('userSettings'),
    firebaseGet<GenericMap>('progress'),
    firebaseGet<GenericMap>('binds'),
    firebaseGet<GenericMap>('activity'),
    firebaseGet<GenericMap>('dayCompletions'),
    firebaseGet<GenericMap>('emailsSent'),
  ]);

  const users = usersByUid || {};
  let eligibleUsers = 0;
  let sentCount = 0;
  let skippedAlreadySent = 0;
  const failures: Array<{ uid: string; reason: string }> = [];

  for (const [uid, rawProfile] of Object.entries(users)) {
    const profile = (rawProfile || {}) as { username?: string; displayName?: string | null };
    const settings = ((userSettingsByUid?.[uid] ?? {}) as { emails?: string[]; mailUpdates?: boolean });

    const emails = Array.isArray(settings.emails)
      ? Array.from(new Set(settings.emails.filter((e) => typeof e === 'string' && e.length > 0)))
      : [];

    if (settings.mailUpdates === false || emails.length === 0) {
      continue;
    }

    eligibleUsers++;

    const alreadySent = Boolean(((emailsSentByUid?.[uid] as GenericMap | undefined)?.dailyWrapup as GenericMap | undefined)?.[dateKey]);
    if (alreadySent) {
      skippedAlreadySent++;
      continue;
    }

    const progress = ((progressByUid?.[uid] ?? {}) as ProgressMap);
    const stats = computeProgressStats(progress);
    const acceptedBindsCount = getAcceptedBindsCount(bindsByUid, uid);
    const completedDayNumbersToday = getCompletedDaysToday(dayCompletionsByUid, uid, startOfIstDayUtcMs, endOfIstDayUtcMs);

    const lastActivityAt = Number(((activityByUid?.[uid] as { lastActivityAt?: number } | undefined)?.lastActivityAt) || 0);
    const hasActivityToday = (lastActivityAt >= startOfIstDayUtcMs && lastActivityAt <= endOfIstDayUtcMs) || completedDayNumbersToday.length > 0;

    const todayCoverage = stats.dayCoverage[stats.currentDayNumber] || { done: 0, total: 0 };
    const missedDayQuote = hasActivityToday ? undefined : pickMissedDayQuote(uid, dateKey);

    const subject = hasActivityToday ? `Your 9PM DSA wrap-up - ${dateKey}` : `You missed today - DSA wrap-up ${dateKey}`;
    const { error } = await resend.emails.send({
      from: FROM,
      to: emails,
      subject,
      react: DailyWrapupEmail({
        username: profile.username || 'user',
        displayName: profile.displayName || undefined,
        dateLabel: dateKey,
        daysCompleted: stats.daysCompleted,
        problemsSolved: stats.problemsSolved,
        totalProblems: stats.totalProblems,
        overallPct: stats.overallPct,
        bindedFriendsCount: acceptedBindsCount,
        currentDayNumber: stats.currentDayNumber,
        currentDayCoverageDone: todayCoverage.done,
        currentDayCoverageTotal: todayCoverage.total,
        completedDayNumbersToday,
        didSomethingToday: hasActivityToday,
        missedDayQuote,
      }),
    });

    if (error) {
      failures.push({ uid, reason: error.message || 'Resend failed' });
      continue;
    }

    await firebasePut(`emailsSent/${uid}/dailyWrapup/${dateKey}`, {
      sentAt: Date.now(),
      didSomethingToday: hasActivityToday,
      completedDayNumbersToday,
    });
    sentCount++;
  }

  return NextResponse.json({
    success: failures.length === 0,
    dateKey,
    eligibleUsers,
    sentCount,
    skippedAlreadySent,
    failures,
  }, { status: failures.length === 0 ? 200 : 207 });
}

export async function GET(req: NextRequest) {
  return handleDailyWrapup(req);
}

export async function POST(req: NextRequest) {
  return handleDailyWrapup(req);
}
