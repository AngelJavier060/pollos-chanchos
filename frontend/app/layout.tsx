import './globals.css';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/app/components/ui/theme-toggle';
import { ToastProvider } from './admin/dashboard/components/ui/toast';

export const metadata = {
  title: 'Tu Aplicación',
  description: 'Descripción de tu aplicación',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
            <ThemeToggle />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
