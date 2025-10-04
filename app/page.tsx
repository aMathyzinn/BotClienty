'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string | null;
};

type BotUser = DiscordUser & {
  bot: boolean;
};

type DiscordGuild = {
  id: string;
  name: string;
  icon?: string | null;
};

type DiscordChannel = {
  id: string;
  name: string;
  type: number;
  recipients?: DiscordUser[];
};

type DiscordMessage = {
  id: string;
  content: string;
  author: DiscordUser;
  timestamp: string;
};

const DISCORD_CDN = 'https://cdn.discordapp.com';

function formatUserTag(user: DiscordUser) {
  const display = user.global_name || user.username;
  return user.discriminator === '0' || !user.discriminator
    ? display
    : `${display}#${user.discriminator}`;
}

function formatDate(timestamp: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(timestamp));
  } catch (error) {
    return timestamp;
  }
}

function guildIconUrl(guild: DiscordGuild) {
  if (!guild.icon) return '';
  return `${DISCORD_CDN}/icons/${guild.id}/${guild.icon}.png?size=128`;
}

function userAvatarUrl(user: DiscordUser) {
  if (!user.avatar) {
    const defaultId = Number(BigInt(user.id) >> BigInt(22)) % 5;
    return `${DISCORD_CDN}/embed/avatars/${defaultId}.png`;
  }
  const format = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `${DISCORD_CDN}/avatars/${user.id}/${user.avatar}.${format}?size=128`;
}

type FetchMethod = 'GET' | 'POST';

async function authedFetch<T>(
  token: string,
  url: string,
  method: FetchMethod = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Falha ao comunicar com o servidor.');
  }

  return (await response.json()) as T;
}

export default function Home() {
  const [tokenInput, setTokenInput] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [botUser, setBotUser] = useState<BotUser | null>(null);
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [dmChannels, setDmChannels] = useState<DiscordChannel[]>([]);
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('discord-bot-token');
    if (stored) {
      setAuthToken(stored);
      setTokenInput(stored);
    }
  }, []);

  useEffect(() => {
    if (!authToken) return;
    const token = authToken;

    async function loadIdentity() {
      try {
        setIsAuthenticating(true);
        const bot = await authedFetch<BotUser>(token, '/api/authenticate', 'POST', {
          token
        });
        setBotUser(bot);
        setAuthError(null);
      } catch (error) {
        console.error(error);
        setAuthError('Token inválida ou sem permissões suficientes.');
        setAuthToken(null);
        setBotUser(null);
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('discord-bot-token');
        }
      } finally {
        setIsAuthenticating(false);
      }
    }

    loadIdentity();
  }, [authToken]);

  const loadGuilds = useCallback(async () => {
    if (!authToken) return;
    const token = authToken;
    try {
      const data = await authedFetch<DiscordGuild[]>(token, '/api/guilds');
      setGuilds(data);
      if (!selectedGuildId && data.length > 0) {
        setSelectedGuildId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  }, [authToken, selectedGuildId]);

  const loadDmChannels = useCallback(async () => {
    if (!authToken) return;
    const token = authToken;
    try {
      const data = await authedFetch<DiscordChannel[]>(token, '/api/users/me/dms');
      setDmChannels(data);
    } catch (error) {
      console.error(error);
    }
  }, [authToken]);

  useEffect(() => {
    if (!authToken) return;
    loadGuilds();
    loadDmChannels();
  }, [authToken, loadGuilds, loadDmChannels]);

  useEffect(() => {
    if (!authToken || !selectedGuildId) {
      setChannels([]);
      return;
    }

    const token = authToken;
    const fetchChannels = async () => {
      try {
        setIsLoadingChannels(true);
        const data = await authedFetch<DiscordChannel[]>(
          token,
          `/api/guilds/${selectedGuildId}/channels`
        );
        const textChannels = data.filter((channel) => channel.type === 0);
        setChannels(textChannels);
        if (!selectedChannelId && textChannels.length > 0) {
          setSelectedChannelId(textChannels[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingChannels(false);
      }
    };

    fetchChannels();
  }, [authToken, selectedGuildId, selectedChannelId]);

  useEffect(() => {
    if (!authToken || !selectedChannelId) {
      setMessages([]);
      return;
    }

    const token = authToken;
    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const data = await authedFetch<DiscordMessage[]>(
          token,
          `/api/channels/${selectedChannelId}/messages`
        );
        setMessages(data.reverse());
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [authToken, selectedChannelId]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tokenInput.trim()) return;
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const sanitizedToken = tokenInput.trim();

      const response = await fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: sanitizedToken })
      });

      if (!response.ok) {
        throw new Error('Falha ao autenticar');
      }

      const bot = (await response.json()) as BotUser;
      setBotUser(bot);
      setAuthToken(sanitizedToken);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('discord-bot-token', sanitizedToken);
      }
      const [guildData, dmData] = await Promise.all([
        authedFetch<DiscordGuild[]>(sanitizedToken, '/api/guilds'),
        authedFetch<DiscordChannel[]>(sanitizedToken, '/api/users/me/dms')
      ]);
      setGuilds(guildData);
      setDmChannels(dmData);
      if (guildData.length > 0) {
        setSelectedGuildId(guildData[0].id);
      } else if (dmData.length > 0) {
        setSelectedChannelId(dmData[0].id);
      }
    } catch (error) {
      console.error(error);
      setAuthError('Não foi possível validar a token. Verifique e tente novamente.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSelectGuild = (guildId: string) => {
    setSelectedGuildId(guildId);
    setSelectedChannelId(null);
    setMessages([]);
  };

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
  };

  const handleSelectDm = (channelId: string) => {
    setSelectedGuildId(null);
    setChannels([]);
    setSelectedChannelId(channelId);
  };

  const handleOpenDmHub = () => {
    setSelectedGuildId(null);
    setChannels([]);
    setSelectedChannelId(null);
    setMessages([]);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authToken || !selectedChannelId || !messageInput.trim()) return;

    const content = messageInput.trim();
    setMessageInput('');
    const token = authToken;

    try {
      await authedFetch(token, `/api/channels/${selectedChannelId}/messages`, 'POST', {
        content
      });
      const newMessages = await authedFetch<DiscordMessage[]>(
        token,
        `/api/channels/${selectedChannelId}/messages`
      );
      setMessages(newMessages.reverse());
    } catch (error) {
      console.error(error);
      setMessageInput(content);
    }
  };

  const selectedChannel = useMemo(
    () => channels.find((channel) => channel.id === selectedChannelId) ??
      dmChannels.find((channel) => channel.id === selectedChannelId) ??
      null,
    [channels, dmChannels, selectedChannelId]
  );

  const logout = () => {
    setAuthToken(null);
    setBotUser(null);
    setGuilds([]);
    setChannels([]);
    setMessages([]);
    setSelectedGuildId(null);
    setSelectedChannelId(null);
    setDmChannels([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('discord-bot-token');
    }
  };

  const renderLogin = () => (
    <div className="login-overlay">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Discord Bot Client</h1>
        <p>Insira a token do seu bot para assumir o controle.</p>
        <label htmlFor="token">Token do bot</label>
        <input
          id="token"
          type="password"
          placeholder="MTAxM..."
          value={tokenInput}
          onChange={(event) => setTokenInput(event.target.value)}
          autoComplete="off"
        />
        {authError && <span className="error">{authError}</span>}
        <button type="submit" disabled={isAuthenticating}>
          {isAuthenticating ? 'Validando...' : 'Entrar'}
        </button>
        <small>
          A aplicação autentica como um bot e utiliza as permissões concedidas à token para
          acessar servidores, canais e mensagens.
        </small>
      </form>
    </div>
  );

  const renderServerList = () => (
    <nav className="server-sidebar">
      <div className="server-home" onClick={handleOpenDmHub}>
        <span>HB</span>
      </div>
      <div className="divider" />
      {guilds.map((guild) => {
        const icon = guildIconUrl(guild);
        const isSelected = selectedGuildId === guild.id;
        return (
          <button
            key={guild.id}
            className={`server-button ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectGuild(guild.id)}
            title={guild.name}
            type="button"
          >
            {icon ? <img src={icon} alt={guild.name} /> : <span>{guild.name[0]}</span>}
          </button>
        );
      })}
    </nav>
  );

  const renderChannelSidebar = () => (
    <aside className="channel-sidebar">
      <header>
        <div>
          <strong>{guilds.find((guild) => guild.id === selectedGuildId)?.name ?? 'Mensagens Diretas'}</strong>
          {botUser && <span>{formatUserTag(botUser)}</span>}
        </div>
        <button onClick={logout} type="button">
          Sair
        </button>
      </header>
      <section>
        {selectedGuildId ? (
          <ul>
            {isLoadingChannels && <li className="placeholder">Carregando canais...</li>}
            {channels.map((channel) => (
              <li key={channel.id}>
                <button
                  className={selectedChannelId === channel.id ? 'active' : ''}
                  onClick={() => handleSelectChannel(channel.id)}
                  type="button"
                >
                  # {channel.name}
                </button>
              </li>
            ))}
            {!isLoadingChannels && channels.length === 0 && (
              <li className="placeholder">Nenhum canal de texto disponível.</li>
            )}
          </ul>
        ) : (
          <ul>
            {dmChannels.map((channel) => {
              const recipient = channel.recipients?.[0];
              const name = recipient ? formatUserTag(recipient) : 'Canal Direto';
              return (
                <li key={channel.id}>
                  <button
                    className={selectedChannelId === channel.id ? 'active' : ''}
                    onClick={() => handleSelectDm(channel.id)}
                    type="button"
                  >
                    {recipient && (
                      <img src={userAvatarUrl(recipient)} alt={name} className="avatar" />
                    )}
                    <span>{name}</span>
                  </button>
                </li>
              );
            })}
            {dmChannels.length === 0 && <li className="placeholder">Nenhuma DM encontrada.</li>}
          </ul>
        )}
      </section>
    </aside>
  );

  const renderMessages = () => (
    <main className="chat-area">
      <header className="chat-header">
        <div>
          <h2>
            {selectedGuildId ? '#' : ''}
            {selectedChannel?.name ?? 'Selecione um canal'}
          </h2>
          <span>
            {botUser ? `Conectado como ${formatUserTag(botUser)}` : 'Não autenticado'}
          </span>
        </div>
      </header>
      <section className="message-list">
        {isLoadingMessages && <div className="placeholder">Carregando mensagens...</div>}
        {!isLoadingMessages && messages.length === 0 && (
          <div className="placeholder">Nenhuma mensagem carregada ainda.</div>
        )}
        {messages.map((message) => (
          <article key={message.id} className="message">
            <img src={userAvatarUrl(message.author)} alt={message.author.username} />
            <div>
              <header>
                <strong>{message.author.global_name ?? message.author.username}</strong>
                <span>{formatDate(message.timestamp)}</span>
              </header>
              <p>{message.content || <em>Mensagem sem conteúdo</em>}</p>
            </div>
          </article>
        ))}
      </section>
      <footer className="message-composer">
        <form onSubmit={handleSendMessage}>
          <textarea
            value={messageInput}
            placeholder={
              selectedChannel
                ? `Enviar mensagem para ${selectedChannel.name}`
                : 'Selecione um canal para enviar mensagens'
            }
            onChange={(event) => setMessageInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            disabled={!selectedChannelId}
            rows={2}
          />
          <button type="submit" disabled={!selectedChannelId || !messageInput.trim()}>
            Enviar
          </button>
        </form>
      </footer>
    </main>
  );

  if (!authToken || !botUser) {
    return renderLogin();
  }

  return (
    <div className="app-shell">
      {renderServerList()}
      {renderChannelSidebar()}
      {renderMessages()}
      <aside className="dm-sidebar">
        <header>
          <strong>Mensagens Diretas</strong>
        </header>
        <ul>
          {dmChannels.map((channel) => {
            const recipient = channel.recipients?.[0];
            const name = recipient ? formatUserTag(recipient) : 'Canal Direto';
            return (
              <li key={channel.id}>
                <button
                  className={selectedChannelId === channel.id && !selectedGuildId ? 'active' : ''}
                  onClick={() => handleSelectDm(channel.id)}
                  type="button"
                >
                  {recipient && (
                    <img src={userAvatarUrl(recipient)} alt={name} className="avatar" />
                  )}
                  <span>{name}</span>
                </button>
              </li>
            );
          })}
          {dmChannels.length === 0 && <li className="placeholder">Sem conversas</li>}
        </ul>
      </aside>
    </div>
  );
}
