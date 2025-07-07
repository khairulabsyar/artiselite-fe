import { NextRequest, NextResponse } from 'next/server';

// Define the base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET handler for /api/products/[id]
 * Fetches a specific product by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Destructure params after awaiting context
  const { params } = await context;
  try {
    // Get the access token from the cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/products/${params.id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Get the response data
    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for /api/products/[id]
 * Updates a specific product
 */
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Destructure params after awaiting context
  const { params } = await context;
  try {
    // Get the access token from the cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/products/${params.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error updating product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for /api/products/[id]
 * Deletes a specific product
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Destructure params after awaiting context
  const { params } = await context;
  try {
    // Get the access token from the cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/products/${params.id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // If the response is successful (204 No Content or any 2xx), return a success response
    if (response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    // For error responses, try to parse JSON if possible
    let errorData = { error: 'Failed to delete product' };
    try {
      // Only try to parse as JSON if the content type is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
    }

    // Return the error response
    return NextResponse.json(errorData, { status: response.status });
  } catch (error) {
    console.error(`Error deleting product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
