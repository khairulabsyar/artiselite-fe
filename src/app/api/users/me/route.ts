import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This route acts as a secure proxy to the backend's /api/users/me/ endpoint.
// It retrieves the access token from the secure cookie and forwards it to the backend.
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${backendUrl}/api/users/me/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Attempt to parse error response, but default if it fails
      let errorData = { detail: 'An error occurred from the backend.' };
      try {
        errorData = await response.json();
      } catch (e) {
        // The response body was not valid JSON
      }
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ detail: 'An unexpected error occurred.' }, { status: 500 });
  }
}
