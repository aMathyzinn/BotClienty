import { NextRequest, NextResponse } from 'next/server';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const searchParams = request.nextUrl.searchParams;
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  try {
    const url = new URL(`${DISCORD_API_BASE}/${path.join('/')}`);
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Discord API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const authorization = request.headers.get('authorization');
  const body = await request.json();

  if (!authorization) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  try {
    const url = `${DISCORD_API_BASE}/${path.join('/')}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Discord API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}