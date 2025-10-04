import { NextRequest } from 'next/server';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export function extractToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header) {
    return null;
  }

  const [scheme, value] = header.split(' ');
  if (!scheme || !value || scheme.toLowerCase() !== 'bearer') {
    return null;
  }

  return value.trim();
}

export async function discordRequest<T>(
  token: string,
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${DISCORD_API_BASE}${endpoint}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(payload || `Discord API request failed for ${endpoint}`);
  }

  return (await response.json()) as T;
}

export async function discordRequestWithBody<T>(
  token: string,
  endpoint: string,
  body: unknown,
  method: string = 'POST'
): Promise<T> {
  return discordRequest<T>(token, endpoint, {
    method,
    body: JSON.stringify(body)
  });
}
