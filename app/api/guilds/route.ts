import { NextRequest, NextResponse } from 'next/server';
import { discordRequest, extractToken } from '@/lib/discord';

type DiscordGuild = {
  id: string;
  name: string;
  icon?: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Cabeçalho Authorization ausente.' }, { status: 401 });
    }

    const guilds = await discordRequest<DiscordGuild[]>(token, '/users/@me/guilds');
    return NextResponse.json(guilds);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao carregar servidores.' },
      { status: 500 }
    );
  }
}
