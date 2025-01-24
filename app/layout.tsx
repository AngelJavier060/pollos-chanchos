import './globals.css';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/app/components/ui/theme-toggle';
import { ToastProvider } from './admin/dashboard/components/ui/toast';

export const metadata = {
  title: 'Tu Aplicación',
  description: 'Descripción de tu aplicación',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
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
