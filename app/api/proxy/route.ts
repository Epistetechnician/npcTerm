import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 