import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://resourceful-tranquility-production.up.railway.app/api';

// ✅ Helper to safely parse JSON or return plain text
async function safeJson(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text || 'No response body' };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${BACKEND_URL}/${path}`;
  
  // Forward search params
  const searchParams = request.nextUrl.searchParams.toString();
  const fullUrl = searchParams ? `${url}?${searchParams}` : url;

  // Forward headers including Authorization
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers.authorization = authHeader;
  }

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${BACKEND_URL}/${path}`;
  const body = await request.json();

  // Forward headers including Authorization
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers.authorization = authHeader;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${BACKEND_URL}/${path}`;
  const body = await request.json();

  // Forward headers including Authorization
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers.authorization = authHeader;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${BACKEND_URL}/${path}`;

  // Forward headers including Authorization
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers.authorization = authHeader;
  }

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
