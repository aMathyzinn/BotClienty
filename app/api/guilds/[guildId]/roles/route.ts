import { NextRequest, NextResponse } from 'next/server';
import { discordRequest, extractToken } from '@/lib/discord';

type DiscordRole = {
  id: string;
  name: string;
  color: number;
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
    const roles = await discordRequest<DiscordRole[]>(token, `/guilds/${guildId}/roles`);

    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao carregar cargos.' },
      { status: 500 }
    );
  }
}
