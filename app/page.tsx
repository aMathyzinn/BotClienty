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
  parent_id?: string | null;
  position?: number;
  recipients?: DiscordUser[];
};

type DiscordRole = {
  id: string;
  name: string;
  color: number;
};

type DiscordAttachment = {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url?: string;
  content_type?: string | null;
  width?: number | null;
  height?: number | null;
  description?: string | null;
};

type DiscordMessage = {
  id: string;
  content: string;
  author: DiscordUser;
  timestamp: string;
  embeds?: DiscordEmbed[];
  attachments?: DiscordAttachment[];
  mentions?: DiscordUser[];
  mention_roles?: string[];
  mention_channels?: string[];
};

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
  video?: { url?: string } | null;
};

type MessageContentPart =
  | { type: 'text'; content: string }
  | { type: 'link'; url: string }
  | { type: 'emoji'; id: string; name: string; animated: boolean }
  | { type: 'mention'; mentionType: 'user' | 'role' | 'channel' | 'everyone'; id: string; label: string };

type FormattingContext = {
  users?: Record<string, DiscordUser>;
  roles?: Record<string, DiscordRole>;
  channels?: Record<string, DiscordChannel>;
};

function parseMessageContent(content: string, context?: FormattingContext): MessageContentPart[] {
  const parts: MessageContentPart[] = [];
  const pattern =
    /(<a?:[\w-]+:\d+>)|(https?:\/\/[^\s]+)|(<@[!&]?\d+>|<#\d+>|@everyone|@here)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      const emojiMatch = /<(a?):([\w-]+):(\d+)>/.exec(match[1]);
      if (emojiMatch) {
        parts.push({
          type: 'emoji',
          animated: emojiMatch[1] === 'a',
          name: emojiMatch[2],
          id: emojiMatch[3]
        });
      }
    } else if (match[2]) {
      parts.push({ type: 'link', url: match[2] });
    } else if (match[3]) {
      const rawMention = match[3];
      if (rawMention === '@everyone' || rawMention === '@here') {
        parts.push({
          type: 'mention',
          mentionType: 'everyone',
          id: rawMention,
          label: rawMention
        });
      } else if (rawMention.startsWith('<#')) {
        const id = rawMention.replace(/[<#>]/g, '');
        const channel = context?.channels?.[id];
        parts.push({
          type: 'mention',
          mentionType: 'channel',
          id,
          label: channel ? `#${channel.name}` : '#channel'
        });
      } else if (rawMention.startsWith('<@&')) {
        const id = rawMention.replace(/[<@&>]/g, '');
        const role = context?.roles?.[id];
        parts.push({
          type: 'mention',
          mentionType: 'role',
          id,
          label: role ? `@${role.name}` : '@role'
        });
      } else if (rawMention.startsWith('<@')) {
        const id = rawMention.replace(/[<@!>]/g, '');
        const user = context?.users?.[id];
        const display = user ? formatUserTag(user) : '@user';
        parts.push({
          type: 'mention',
          mentionType: 'user',
          id,
          label: display.startsWith('@') ? display : `@${display}`
        });
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return [{ type: 'text', content }];
  }

  return parts;
}

function renderFormattedContent(content: string, context?: FormattingContext) {
  return parseMessageContent(content, context).map((part, index) => {
    if (part.type === 'text') {
      return (
        <span key={`text-${index}`} className="message-text">
          {part.content}
        </span>
      );
    }

    if (part.type === 'link') {
      return (
        <a
          key={`link-${index}`}
          href={part.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {part.url}
        </a>
      );
    }

    if (part.type === 'emoji') {
      return (
        <img
          key={`emoji-${index}`}
          src={`https://cdn.discordapp.com/emojis/${part.id}.${part.animated ? 'gif' : 'png'}?quality=lossless`}
          alt={`:${part.name}:`}
          className="custom-emoji"
        />
      );
    }

    return (
      <span key={`mention-${index}`} className={`mention mention-${part.mentionType}`}>
        {part.label}
      </span>
    );
  });
}

function renderEmbedText(content?: string, context?: FormattingContext) {
  if (!content) return null;
  return <div className="embed-text">{renderFormattedContent(content, context)}</div>;
}

function renderEmbed(embed: DiscordEmbed, index: number, context?: FormattingContext) {
  const color = embed.color
    ? `#${embed.color.toString(16).padStart(6, '0')}`
    : '#5865f2';

  return (
    <div key={`embed-${index}`} className="embed">
      <div className="embed-color" style={{ backgroundColor: color }} />
      <div className="embed-content">
        {embed.author && (embed.author.name || embed.author.icon_url) && (
          <div className="embed-author">
            {embed.author.icon_url && (
              <img src={embed.author.icon_url} alt={embed.author.name ?? 'Autor'} />
            )}
            {embed.author.url ? (
              <a href={embed.author.url} target="_blank" rel="noreferrer noopener">
                {embed.author.name ?? 'Autor'}
              </a>
            ) : (
              <span>{embed.author.name}</span>
            )}
          </div>
        )}
        {embed.title && (
          embed.url ? (
            <a className="embed-title" href={embed.url} target="_blank" rel="noreferrer noopener">
              {embed.title}
            </a>
          ) : (
            <div className="embed-title">{embed.title}</div>
          )
        )}
        {renderEmbedText(embed.description, context)}
        {embed.fields && embed.fields.length > 0 && (
          <div className="embed-fields">
            {embed.fields.map((field, fieldIndex) => (
              <div
                key={`embed-field-${fieldIndex}`}
                className={`embed-field ${field.inline ? 'inline' : ''}`}
              >
                <div className="embed-field-name">{field.name}</div>
                <div className="embed-field-value">{renderFormattedContent(field.value, context)}</div>
              </div>
            ))}
          </div>
        )}
        {embed.image?.url && (
          <img src={embed.image.url} alt={embed.title ?? 'Imagem do embed'} className="embed-image" />
        )}
        {embed.thumbnail?.url && (
          <img
            src={embed.thumbnail.url}
            alt={embed.title ?? 'Miniatura do embed'}
            className="embed-thumbnail"
          />
        )}
        {embed.video?.url && (
          <video className="embed-video" controls src={embed.video.url} />
        )}
        {embed.footer && (
          <div className="embed-footer">
            {embed.footer.icon_url && (
              <img src={embed.footer.icon_url} alt={embed.footer.text} />
            )}
            <span>{embed.footer.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function buildUserMap(users?: DiscordUser[]): Record<string, DiscordUser> | undefined {
  if (!users || users.length === 0) {
    return undefined;
  }

  return users.reduce<Record<string, DiscordUser>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
}

function getAttachmentKind(attachment: DiscordAttachment): 'image' | 'video' | 'audio' | 'file' {
  const contentType = attachment.content_type?.toLowerCase() ?? '';
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.startsWith('audio/')) return 'audio';

  const extension = attachment.filename.split('.').pop()?.toLowerCase() ?? '';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) return 'image';
  if (['mp4', 'mov', 'webm', 'mkv'].includes(extension)) return 'video';
  if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) return 'audio';

  return 'file';
}

function renderAttachment(attachment: DiscordAttachment, index: number) {
  const kind = getAttachmentKind(attachment);
  const description = attachment.description ?? attachment.filename;

  if (kind === 'image') {
    return (
      <figure key={`attachment-${attachment.id}-${index}`} className="message-attachment image">
        <img src={attachment.url} alt={description} />
        {attachment.description && <figcaption>{attachment.description}</figcaption>}
      </figure>
    );
  }

  if (kind === 'video') {
    return (
      <div key={`attachment-${attachment.id}-${index}`} className="message-attachment video">
        <video controls src={attachment.url} />
        <a href={attachment.url} target="_blank" rel="noreferrer noopener">
          {description}
        </a>
      </div>
    );
  }

  if (kind === 'audio') {
    return (
      <div key={`attachment-${attachment.id}-${index}`} className="message-attachment audio">
        <audio controls src={attachment.url} />
        <a href={attachment.url} target="_blank" rel="noreferrer noopener">
          {description}
        </a>
      </div>
    );
  }

  return (
    <div key={`attachment-${attachment.id}-${index}`} className="message-attachment file">
      <a href={attachment.url} target="_blank" rel="noreferrer noopener">
        📎 {description}
      </a>
    </div>
  );
}

const DISCORD_API_BASE = '/api/discord';
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

function getChannelDisplayName(channel: DiscordChannel | null) {
  if (!channel) return '';
  if (channel.recipients && channel.recipients.length > 0) {
    return formatUserTag(channel.recipients[0]);
  }
  if (channel.type === 1 || channel.type === 3) {
    return channel.name ?? 'Direct Message';
  }
  return channel.name;
}

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

async function authedFetch<T>(
  token: string,
  endpoint: string,
  method: FetchMethod = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const headers: HeadersInit = {
    Authorization: `Bot ${token}`,
    Accept: 'application/json'
  };

  const hasBody = Boolean(body) && method !== 'GET' && method !== 'HEAD';
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${DISCORD_API_BASE}${endpoint}`, {
    method,
    headers,
    body: hasBody ? JSON.stringify(body) : undefined,
    cache: 'no-store'
  });

  if (!response.ok) {
    let message = 'Failed to communicate with Discord.';
    try {
      const data = await response.json();
      if (data && typeof data === 'object' && 'message' in data) {
        message = String((data as { message?: string }).message ?? message);
      } else {
        message = JSON.stringify(data);
      }
    } catch {
      try {
        message = await response.text();
      } catch {
        // ignore parsing errors
      }
    }

    throw new Error(message || 'Failed to communicate with Discord.');
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (response.status === 204 || !contentType.includes('application/json')) {
    return undefined as T;
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
  const [roles, setRoles] = useState<DiscordRole[]>([]);
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
        const bot = await authedFetch<BotUser>(token, '/users/@me');
        if (!bot.bot) {
          throw new Error('A token informada não pertence a um bot.');
        }
        setBotUser(bot);
        setAuthError(null);
      } catch (error) {
        console.error(error);
        setAuthError('Invalid token or insufficient permissions.');
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
      const data = await authedFetch<DiscordGuild[]>(token, '/users/@me/guilds');
      setGuilds(data);
      // Seleciona o primeiro servidor apenas se nenhum estiver selecionado
      setSelectedGuildId(prev => prev || (data.length > 0 ? data[0].id : null));
    } catch (error) {
      console.error('Erro ao carregar servidores:', error);
    }
  }, [authToken]);

  const loadDmChannels = useCallback(async () => {
    if (!authToken) return;
    const token = authToken;
    try {
      const data = await authedFetch<DiscordChannel[]>(token, '/users/@me/channels');
      const directMessages = data.filter((channel) => channel.type === 1);
      setDmChannels(directMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens diretas:', error);
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
      setRoles([]);
      return;
    }

    const token = authToken;
    const fetchChannels = async () => {
      try {
        setIsLoadingChannels(true);
        const data = await authedFetch<DiscordChannel[]>(
          token,
          `/guilds/${selectedGuildId}/channels`
        );
        const sortedChannels = [...data].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        );
        setChannels(sortedChannels);
        const textChannels = sortedChannels.filter((channel) => channel.type === 0);
        if (!selectedChannelId || !textChannels.some((channel) => channel.id === selectedChannelId)) {
          setSelectedChannelId(textChannels[0]?.id ?? null);
        }
      } catch (error) {
        console.error('Erro ao carregar canais do servidor:', error);
        setChannels([]);
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
          `/channels/${selectedChannelId}/messages?limit=50`
        );
        setMessages(data.reverse());
      } catch (error) {
        console.error('Erro ao carregar mensagens do canal:', error);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [authToken, selectedChannelId]);

  useEffect(() => {
    if (!authToken || !selectedGuildId) {
      return;
    }

    setRoles([]);
    const token = authToken;
    const fetchRoles = async () => {
      try {
        const data = await authedFetch<DiscordRole[]>(
          token,
          `/guilds/${selectedGuildId}/roles`
        );
        setRoles(data);
      } catch (error) {
        console.error('Erro ao carregar roles do servidor:', error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, [authToken, selectedGuildId]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tokenInput.trim()) return;
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const sanitizedToken = tokenInput.trim();

      const bot = await authedFetch<BotUser>(sanitizedToken, '/users/@me');
      if (!bot.bot) {
        throw new Error('The provided token does not belong to a bot.');
      }
      setBotUser(bot);
      setAuthToken(sanitizedToken);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('discord-bot-token', sanitizedToken);
      }
      const [guildData, dmData] = await Promise.all([
        authedFetch<DiscordGuild[]>(sanitizedToken, '/users/@me/guilds'),
        authedFetch<DiscordChannel[]>(sanitizedToken, '/users/@me/channels')
      ]);
      setGuilds(guildData);
      const directMessages = dmData.filter((channel) => channel.type === 1);
      setDmChannels(directMessages);
      if (guildData.length > 0) {
        setSelectedGuildId(guildData[0].id);
      } else if (directMessages.length > 0) {
        setSelectedChannelId(directMessages[0].id);
      }
    } catch (error) {
      console.error(error);
      setAuthError('Could not validate token. Please check and try again.');
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
      await authedFetch(token, `/channels/${selectedChannelId}/messages`, 'POST', {
        content
      });
      const newMessages = await authedFetch<DiscordMessage[]>(
        token,
        `/channels/${selectedChannelId}/messages?limit=50`
      );
      setMessages(newMessages.reverse());
    } catch (error) {
      console.error(error);
      setMessageInput(content);
    }
  };

  const selectedChannel = useMemo(
    () =>
      channels.find((channel) => channel.id === selectedChannelId) ??
      dmChannels.find((channel) => channel.id === selectedChannelId) ??
      null,
    [channels, dmChannels, selectedChannelId]
  );

  const guildTextChannels = useMemo(
    () => channels.filter((channel) => channel.type === 0),
    [channels]
  );

  const uncategorizedChannels = useMemo(
    () => guildTextChannels.filter((channel) => !channel.parent_id),
    [guildTextChannels]
  );

  const categoryGroups = useMemo(
    () =>
      channels
        .filter((channel) => channel.type === 4)
        .map((category) => ({
          category,
          channels: guildTextChannels.filter((channel) => channel.parent_id === category.id)
        }))
        .filter((group) => group.channels.length > 0),
    [channels, guildTextChannels]
  );

  const rolesById = useMemo(() => {
    if (!selectedGuildId) {
      return {} as Record<string, DiscordRole>;
    }

    return roles.reduce<Record<string, DiscordRole>>((acc, role) => {
      acc[role.id] = role;
      return acc;
    }, {});
  }, [roles, selectedGuildId]);

  const channelsById = useMemo(() => {
    if (!selectedGuildId) {
      return {} as Record<string, DiscordChannel>;
    }

    return channels.reduce<Record<string, DiscordChannel>>((acc, channel) => {
      acc[channel.id] = channel;
      return acc;
    }, {});
  }, [channels, selectedGuildId]);

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
      <div className="topbar">
        <img src="/logo.png" alt="BotClienty Logo" className="topbar-logo" />
        <strong>BotClienty</strong>
      </div>
      <form className="login-card" onSubmit={handleLogin}>
        <h1>BotClienty</h1>
        <p>Enter your bot token to take control.</p>
        <label htmlFor="token">Bot token</label>
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
          {isAuthenticating ? 'Validating...' : 'Login'}
        </button>
        <small>
            The application authenticates as a bot and uses the permissions granted to the token to
            access servers, channels and messages.
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
          <strong>{guilds.find((guild) => guild.id === selectedGuildId)?.name ?? 'Direct Messages'}</strong>
          {botUser && <span>{formatUserTag(botUser)}</span>}
        </div>
        <button onClick={logout} type="button">
          Logout
        </button>
      </header>
      <section>
        {selectedGuildId ? (
          <div className="channel-groups">
            {isLoadingChannels && <p className="placeholder">Loading channels...</p>}
            {!isLoadingChannels && (
              <>
                {uncategorizedChannels.length > 0 && (
                  <ul className="channel-group">
                    {uncategorizedChannels.map((channel) => (
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
                  </ul>
                )}
                {categoryGroups.map(({ category, channels: groupedChannels }) => (
                  <div key={category.id} className="channel-category">
                    <div className="channel-category-title">{category.name || 'No category'}</div>
                    <ul>
                      {groupedChannels.map((channel) => (
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
                    </ul>
                  </div>
                ))}
                {uncategorizedChannels.length === 0 && categoryGroups.length === 0 && (
                  <p className="placeholder">No text channels available.</p>
                )}
              </>
            )}
          </div>
        ) : (
          <ul>
            {dmChannels.map((channel) => {
              const recipient = channel.recipients?.[0];
              const name = recipient ? formatUserTag(recipient) : 'Direct Channel';
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
            {dmChannels.length === 0 && <li className="placeholder">No DMs found.</li>}
          </ul>
        )}
      </section>
    </aside>
  );

  const renderMessages = () => {
    const headerTitle = selectedChannel
      ? selectedGuildId
        ? `#${selectedChannel.name}`
        : getChannelDisplayName(selectedChannel)
      : 'Select a channel';

    const composerPlaceholder = selectedChannel
      ? selectedGuildId
        ? `Send message to ${selectedChannel.name}`
        : `Send message to ${getChannelDisplayName(selectedChannel)}`
      : 'Select a channel to send messages';

    return (
      <main className="chat-area">
        <header className="chat-header">
          <div>
            <h2>{headerTitle}</h2>
            <span>
              {botUser ? `Connected as ${formatUserTag(botUser)}` : 'Not authenticated'}
            </span>
          </div>
        </header>
        <section className="message-list">
          {isLoadingMessages && <div className="placeholder">Loading messages...</div>}
          {!isLoadingMessages && messages.length === 0 && (
            <div className="placeholder">No messages loaded yet.</div>
          )}
          {messages.map((message) => {
            const hasContent = Boolean(message.content?.trim());
            const hasEmbeds = Boolean(message.embeds && message.embeds.length > 0);
            const attachments = message.attachments ?? [];
            const hasAttachments = attachments.length > 0;
            const formattingContext: FormattingContext = {
              users: buildUserMap(message.mentions),
              roles: selectedGuildId ? rolesById : undefined,
              channels: selectedGuildId ? channelsById : undefined
            };

            return (
              <article key={message.id} className="message">
                <img src={userAvatarUrl(message.author)} alt={message.author.username} />
                <div>
                  <header>
                    <strong>{message.author.global_name ?? message.author.username}</strong>
                    <span>{formatDate(message.timestamp)}</span>
                  </header>
                  {hasContent && (
                    <div className="message-content">
                      {renderFormattedContent(message.content, formattingContext)}
                    </div>
                  )}
                  {!hasContent && !hasEmbeds && !hasAttachments && (
                    <p className="message-placeholder">
                      <em>Message without content</em>
                    </p>
                  )}
                  {hasAttachments && (
                    <div className="message-attachments">
                      {attachments.map((attachment, index) =>
                        renderAttachment(attachment, index)
                      )}
                    </div>
                  )}
                  {hasEmbeds &&
                    message.embeds?.map((embed, index) =>
                      renderEmbed(embed, index, formattingContext)
                    )}
                </div>
              </article>
            );
          })}
        </section>
        <footer className="message-composer">
          <form onSubmit={handleSendMessage}>
            <textarea
              value={messageInput}
              placeholder={composerPlaceholder}
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
              Send
            </button>
          </form>
        </footer>
      </main>
    );
  };

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
          <strong>Direct Messages</strong>
        </header>
        <ul>
          {dmChannels.map((channel) => {
            const recipient = channel.recipients?.[0];
            const name = recipient ? formatUserTag(recipient) : 'Direct Channel';
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
          {dmChannels.length === 0 && <li className="placeholder">No conversations</li>}
        </ul>
      </aside>
    </div>
  );
}
