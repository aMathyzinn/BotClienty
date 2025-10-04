<div align="center">

<!-- =====================  HERO  ===================== -->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://readme-typing-svg.herokuapp.com?font=Inter&weight=800&size=64&duration=3000&pause=1000&color=1E3A8A&background=00000000&center=true&vCenter=true&width=600&height=100&lines=BotClienty;Discord+Bot+Client;Modern+Web+Interface">
  <img alt="BotClienty" src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=800&size=64&duration=3000&pause=1000&color=1E3A8A&background=00000000&center=true&vCenter=true&width=600&height=100&lines=BotClienty;Discord+Bot+Client;Modern+Web+Interface">
</picture>

<h3 align="center">🤖 Modern Web Client for Discord Bots</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13.5.6-1E3A8A?style=for-the-badge&logo=nextdotjs&logoColor=white&labelColor=0F172A" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18.2.0-1E3A8A?style=for-the-badge&logo=react&logoColor=white&labelColor=0F172A" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.2.2-1E3A8A?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0F172A" alt="TypeScript">
  <img src="https://img.shields.io/badge/Discord-API-1E3A8A?style=for-the-badge&logo=discord&logoColor=white&labelColor=0F172A" alt="Discord API">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/amathyzinn/botclienty?style=for-the-badge&color=1E3A8A&labelColor=0F172A" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/amathyzinn/botclienty?style=for-the-badge&color=1E3A8A&labelColor=0F172A" alt="GitHub Forks">
  <img src="https://img.shields.io/github/license/amathyzinn/botclienty?style=for-the-badge&color=1E3A8A&labelColor=0F172A" alt="License">
</p>

<p align="center">
  <em>Connect with your bot token, navigate servers/channels, view messages (embeds & attachments) and send messages in a clean UI inspired by Discord.</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-usage-guide">Usage</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-contributing">Contributing</a>
</p>

</div>

---

## ✨ Features

<div align="center">

<table>
  <tr>
    <td align="center" width="33%">
      <img width="48" height="48" src="https://img.icons8.com/fluency/48/1E3A8A/security-shield-blue.png" alt="Security"/>
      <br/>
      <b>🔐 Secure Authentication</b><br/>
      <sub>Connect with bot token without third-party data sharing</sub>
    </td>
    <td align="center" width="33%">
      <img width="48" height="48" src="https://img.icons8.com/fluency/48/1E3A8A/lightning-bolt.png" alt="Real-time"/>
      <br/>
      <b>⚡ Real-time Updates</b><br/>
      <sub>Messages and sending with instant updates</sub>
    </td>
    <td align="center" width="33%">
      <img width="48" height="48" src="https://img.icons8.com/fluency/48/1E3A8A/layers.png" alt="UI"/>
      <br/>
      <b>🎨 Discord-inspired UI</b><br/>
      <sub>Dark, responsive and modern layout</sub>
    </td>
  </tr>
</table>

</div>

### 🌟 Core Capabilities

<div align="center">

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **Token Authentication** | Securely connect to your bot | ✅ Ready |
| 📱 **Responsive Layout** | Desktop / Tablet / Mobile support | ✅ Ready |
| 🎨 **Modern Dark Theme** | Refined dark visual experience | ✅ Ready |
| ⚡ **Real-time Updates** | View and send messages instantly | ✅ Ready |
| 🖼️ **Rich Content Support** | Embeds, attachments and media | ✅ Ready |
| 🚀 **Next.js Performance** | Optimized build and static export | ✅ Ready |

</div>

---

## 🎬 Preview

<div align="center">

### 🔑 Authentication Screen
> Clean and straightforward bot token authentication

<img src="https://via.placeholder.com/800x400/0F172A/1E3A8A?text=Login+Screen+Preview" alt="Login Screen" width="100%">

### 💬 Chat Interface
> Navigate guild tree, view embeds and attachments in real-time

<img src="https://via.placeholder.com/800x400/0F172A/1E3A8A?text=Chat+Interface+Preview" alt="Chat Interface" width="100%">

### 📱 Responsive Design
> Adaptive UI with consistent typography and spacing

<img src="https://via.placeholder.com/800x200/0F172A/1E3A8A?text=Mobile+%7C+Tablet+%7C+Desktop" alt="Responsive Design" width="100%">

</div>

---

## 🚀 Quick Start

<div align="center">

### Prerequisites

<img src="https://img.shields.io/badge/Node.js-18+-1E3A8A?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=0F172A" alt="Node.js 18+">
<img src="https://img.shields.io/badge/npm-8+-1E3A8A?style=for-the-badge&logo=npm&logoColor=white&labelColor=0F172A" alt="npm 8+">

</div>

```bash
# Check your versions
node --version  # 18.x or higher
npm --version   # 8.x or higher
```

### Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/amathyzinn/botclienty.git
cd botclienty

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start development server
npm run dev

# 4️⃣ Open in browser
# http://localhost:3000
```

### 🏗️ Production Build

```bash
# Build for production
npm run build

# Artifacts in ./out ready for static hosting
npm run export
```

---

## 📖 Usage Guide

<div align="center">

### Getting Your Bot Token

</div>

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Navigate to the **Bot** section
4. Generate or copy your bot token
5. **⚠️ Never share your token publicly**

### Application Flow

```mermaid
graph TD
    A[Enter Bot Token] --> B[Authenticate]
    B --> C[Load Servers]
    C --> D[Select Server]
    D --> E[Choose Channel]
    E --> F[View Messages]
    F --> G[Send Messages]
    G --> H[View Embeds & Media]
```

<div align="center">

### 🔒 Security Best Practices

| ✅ Do | ❌ Don't |
|-------|----------|
| Store tokens locally only | Share tokens publicly |
| Use environment variables | Commit tokens to git |
| Regenerate if compromised | Use tokens in client-side code |
| Follow Discord ToS | Abuse rate limits |

</div>

---

## 🛠️ Tech Stack

<div align="center">

<table>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
      <br><sub>React Framework</sub>
    </td>
    <td align="center">
      <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=0b0b0b" alt="React">
      <br><sub>UI Library</sub>
    </td>
    <td align="center">
      <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
      <br><sub>Type Safety</sub>
    </td>
    <td align="center">
      <img src="https://img.shields.io/badge/Discord_API-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord API">
      <br><sub>Bot Integration</sub>
    </td>
  </tr>
</table>

</div>

### Architecture Overview

```
Frontend (Next.js + React + TypeScript)
    ↓
Discord API Integration
    ↓
Real-time Message Handling
    ↓
Responsive UI Components
```

---

## 📁 Project Structure

```
botclienty/
├── 📁 app/                 # Next.js App Router
│   ├── 🎨 globals.css      # Global styles & theme
│   ├── 📄 layout.tsx       # Root layout component
│   ├── 🏠 page.tsx         # Main page component
│   └── 📁 api/             # API routes
│       └── 📁 discord/     # Discord API integration
├── 📁 public/              # Static assets
│   └── 🖼️ logo.webp        # Application logo
├── ⚙️ next.config.js       # Next.js configuration
├── 📦 package.json         # Dependencies & scripts
├── 🔧 tsconfig.json        # TypeScript configuration
└── 📖 README.md            # This file
```

---

## 🎨 Design System

<div align="center">

### 🎭 Color Palette

</div>

```css
/* Dark Blue Theme */
:root {
  --primary-bg: #0F172A;      /* Main background */
  --secondary-bg: #1E293B;    /* Cards/panels */
  --accent-blue: #1E3A8A;     /* Primary accent */
  --accent-light: #3B82F6;    /* Light blue accent */
  --accent-dark: #1E40AF;     /* Dark blue accent */
  --text-primary: #F8FAFC;    /* Primary text */
  --text-secondary: #CBD5E1;  /* Secondary text */
  --hover-bg: #334155;        /* Hover states */
  --border-color: #475569;    /* Borders */
  --success-color: #10B981;   /* Success states */
  --error-color: #EF4444;     /* Error states */
  --warning-color: #F59E0B;   /* Warning states */
}
```

### 🔤 Typography Scale

```css
/* Inter Font Family */
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Type Scale */
--text-xs: 0.75rem;    /* 12px - Small labels */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-xl: 1.25rem;    /* 20px - Small headings */
--text-2xl: 1.5rem;    /* 24px - Medium headings */
--text-3xl: 1.875rem;  /* 30px - Large headings */
--text-4xl: 2.25rem;   /* 36px - Extra large */
```

---

## 🔒 Security & Privacy

<div align="center">

| Security Feature | Implementation |
|------------------|----------------|
| 🔐 **Local Token Storage** | Tokens stored locally, no third-party sharing |
| 🌐 **HTTPS Only** | All API calls use secure HTTPS connections |
| 🚫 **No Data Collection** | No external data collection or analytics |
| 💾 **Client-side Only** | All data remains on your device |
| 🔄 **Token Rotation** | Support for easy token regeneration |

</div>

### Privacy Commitment

- ✅ **No tracking** - We don't track your usage
- ✅ **No analytics** - No third-party analytics services
- ✅ **No data sharing** - Your bot data stays with you
- ✅ **Open source** - Full transparency in our code

---

## 🧩 Customization

### Theme Customization

```tsx
// theme.config.ts
export const customTheme = {
  colors: {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    background: '#0F172A',
    surface: '#1E293B',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};
```

### Component Customization

```tsx
// components/CustomCard.tsx
export function CustomCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-secondary-bg rounded-lg p-4 border border-border-color shadow-lg hover:shadow-xl transition-shadow">
      {children}
    </div>
  );
}
```

---

## 🤝 Contributing

<div align="center">

We welcome contributions! Here's how you can help:

<img src="https://img.shields.io/badge/PRs-Welcome-1E3A8A?style=for-the-badge&labelColor=0F172A" alt="PRs Welcome">
<img src="https://img.shields.io/badge/Issues-Welcome-1E3A8A?style=for-the-badge&labelColor=0F172A" alt="Issues Welcome">

</div>

### Development Workflow

```bash
# 1️⃣ Fork the repository
# 2️⃣ Create a feature branch
git checkout -b feature/your-feature-name

# 3️⃣ Make your changes
# 4️⃣ Write descriptive commits
git commit -m "feat: add your feature description"

# 5️⃣ Push and create a Pull Request
git push origin feature/your-feature-name
```

### Contribution Guidelines

- 📝 **Clear descriptions** - Explain what and why
- 🧪 **Test your changes** - Ensure everything works
- 📚 **Update documentation** - Keep docs current
- 🎨 **Follow code style** - Maintain consistency
- 🔍 **Review process** - Be open to feedback

---

## 📊 Project Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=amathyzinn&repo=botclienty&show_icons=true&theme=dark&bg_color=0F172A&title_color=1E3A8A&icon_color=3B82F6&text_color=F8FAFC&border_color=475569" alt="GitHub Stats">

<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=amathyzinn&layout=compact&theme=dark&bg_color=0F172A&title_color=1E3A8A&text_color=F8FAFC&border_color=475569" alt="Top Languages">

</div>

---

## 📄 License

<div align="center">

<img src="https://img.shields.io/badge/License-MIT-1E3A8A?style=for-the-badge&labelColor=0F172A" alt="MIT License">

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

</div>

---

## 🌟 Support

<div align="center">

<h3>⭐ Star this project if you find it helpful!</h3>

<p>
  <a href="https://github.com/aMathyzinn">
    <img src="https://img.shields.io/badge/GitHub-aMathyzinn-1E3A8A?style=for-the-badge&logo=github&logoColor=white&labelColor=0F172A" alt="GitHub">
  </a>
  <a href="https://amathyzin.com.br">
    <img src="https://img.shields.io/badge/Website-amathyzin.com.br-1E3A8A?style=for-the-badge&logo=globe&logoColor=white&labelColor=0F172A" alt="Website">
  </a>
  <a href="https://amathyzin.xyz">
    <img src="https://img.shields.io/badge/Portfolio-amathyzin.xyz-1E3A8A?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0F172A" alt="Portfolio">
  </a>
  <a href="https://discord.gg/XXquEjp69D">
    <img src="https://img.shields.io/badge/Discord-Community-1E3A8A?style=for-the-badge&logo=discord&logoColor=white&labelColor=0F172A" alt="Discord">
  </a>
</p>

<p><sub>Made with ❤️ for the Discord community — by <b>aMathyzin</b></sub></p>

<p><a href="#-features">⬆️ Back to top</a></p>

</div>

---

<div align="center">

### 🚀 Ready to get started?

<a href="#-quick-start">
  <img src="https://img.shields.io/badge/Get_Started-1E3A8A?style=for-the-badge&logo=rocket&logoColor=white&labelColor=0F172A" alt="Get Started">
</a>

</div>
