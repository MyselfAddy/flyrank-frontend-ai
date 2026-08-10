import { NextResponse } from 'next/server';
import { getHealthStatus } from '@/lib/health';

export async function GET() {
  const status = getHealthStatus();
  return NextResponse.json(status, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
