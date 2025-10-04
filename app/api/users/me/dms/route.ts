import { NextRequest, NextResponse } from 'next/server';
import { discordRequest, extractToken } from '@/lib/discord';

type DiscordChannel = {
  id: string;
  type: number;
  name?: string | null;
  recipients?: Array<{
    id: string;
    username: string;
    discriminator: string;
    global_name?: string;
    avatar?: string | null;
  }>;
};

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Cabeçalho Authorization ausente.' }, { status: 401 });
    }

    const channels = await discordRequest<DiscordChannel[]>(token, '/users/@me/channels');
    const directMessages = channels.filter((channel) => channel.type === 1);

    return NextResponse.json(directMessages);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao buscar mensagens diretas.' },
      { status: 500 }
    );
  }
}
