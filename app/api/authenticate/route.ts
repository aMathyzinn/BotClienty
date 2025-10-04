import { NextResponse } from 'next/server';
import { discordRequest } from '@/lib/discord';

type BotUser = {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string | null;
  bot?: boolean;
};

export async function POST(request: Request) {
  try {
    const { token } = (await request.json()) as { token?: string };
    if (!token) {
      return NextResponse.json({ error: 'Token é obrigatória.' }, { status: 400 });
    }

    const bot = await discordRequest<BotUser>(token, '/users/@me');
    if (!bot.bot) {
      return NextResponse.json({ error: 'A token informada não pertence a um bot.' }, { status: 403 });
    }

    return NextResponse.json(bot);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erro desconhecido ao autenticar o bot.'
      },
      { status: 500 }
    );
  }
}
