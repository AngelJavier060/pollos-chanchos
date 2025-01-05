import './globals.css';

export const metadata = {
  title: 'Mi Proyecto con Tailwind',
  description: 'Aplicación de práctica usando Next.js y Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
