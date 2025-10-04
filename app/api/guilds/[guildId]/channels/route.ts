import { NextRequest, NextResponse } from 'next/server';
import { discordRequest, extractToken } from '@/lib/discord';

type DiscordChannel = {
  id: string;
  name: string;
  type: number;
  parent_id?: string | null;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Cabeçalho Authorization ausente.' }, { status: 401 });
    }

    const { guildId } = params;
    const channels = await discordRequest<DiscordChannel[]>(
      token,
      `/guilds/${guildId}/channels`
    );

    return NextResponse.json(channels);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao carregar canais.' },
      { status: 500 }
    );
  }
}
