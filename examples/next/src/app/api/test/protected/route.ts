import { auditauth } from '@/providers/auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = auditauth.withAuthRequest(
  async (_req: NextRequest, _ctx: unknown, session: { email?: string | null }) => {
    return NextResponse.json({
      ok: true,
      user_email: session.email,
    });
  }
);
