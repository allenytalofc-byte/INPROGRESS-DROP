import './globals.css';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Admin',
  description: 'Painel administrativo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <a href="#content" className="sr-only focus:not-sr-only">Pular para conteúdo</a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}