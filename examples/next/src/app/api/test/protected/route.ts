import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('---- PROTECTED TEST ENDPOINT ----')
  console.log('Headers:', Object.fromEntries(req.headers.entries()))
  console.log('Cookies:', req.cookies.getAll())

  return NextResponse.json({
    ok: true,
    message: 'Protected test endpoint reached',
  })
}
