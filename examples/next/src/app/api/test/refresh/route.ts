import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('---- PUBLIC TEST ENDPOINT ----')
  console.log('Headers:', Object.fromEntries(req.headers.entries()))
  console.log('Cookies:', req.cookies.getAll())

  return NextResponse.json({
    ok: true,
    message: 'Public test endpoint reached',
  })
}
