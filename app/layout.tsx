import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'BotClienty',
  description: 'Modern web client to control Discord bots: view servers, channels and messages, and send messages directly with a UI inspired by the official app.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
