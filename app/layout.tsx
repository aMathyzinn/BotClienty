import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Discord Bot Client',
  description: 'Cliente web para controlar bots do Discord com experiência semelhante ao aplicativo oficial.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
