import { NextRequest, NextResponse } from 'next/server';
import { discordRequest, discordRequestWithBody, extractToken } from '@/lib/discord';

type DiscordEmbed = {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  author?: {
    name?: string;
    icon_url?: string;
    url?: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: { url: string } | null;
  thumbnail?: { url: string } | null;
};

type DiscordMessage = {
  id: string;
  content: string;
  embeds?: DiscordEmbed[];
  author: {
    id: string;
    username: string;
    discriminator: string;
    global_name?: string;
    avatar?: string | null;
  };
  timestamp: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Cabeçalho Authorization ausente.' }, { status: 401 });
    }

    const { channelId } = params;
    const messages = await discordRequest<DiscordMessage[]>(
      token,
      `/channels/${channelId}/messages?limit=50`
    );

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao carregar mensagens.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Cabeçalho Authorization ausente.' }, { status: 401 });
    }

    const { channelId } = params;
    const { content } = (await request.json()) as { content?: string };
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Conteúdo da mensagem é obrigatório.' }, { status: 400 });
    }

    const message = await discordRequestWithBody<DiscordMessage>(
      token,
      `/channels/${channelId}/messages`,
      { content: content.trim() },
      'POST'
    );

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao enviar mensagem.' },
      { status: 500 }
    );
  }
}
