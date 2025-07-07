import { NextRequest, NextResponse } from 'next/server';


const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  try {
    const apiRes = await fetch(`${BACKEND_URL}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: data.detail || 'Authentication failed' },
        { status: apiRes.status }
      );
    }

    const { access, refresh } = data;

    const response = NextResponse.json({ message: 'Login successful' });

    response.cookies.set('access_token', access, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    });

    response.cookies.set('refresh_token', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
