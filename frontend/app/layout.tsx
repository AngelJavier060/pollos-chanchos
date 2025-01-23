import './globals.css';  
import ThemeToggle from '@/components/ui/theme-toggle';  
import { ToastProvider } from './admin/dashboard/components/ui/toast';

export const metadata = {
  title: 'Mi Proyecto con Tailwind',
  description: 'Aplicación de práctica usando Next.js y Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white">
        <ToastProvider>
          <div className="absolute top-0 right-0 p-4">
            <ThemeToggle />
          </div>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
