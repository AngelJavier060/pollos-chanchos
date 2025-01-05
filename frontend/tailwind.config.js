/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Escanea la carpeta app para clases
    "./components/**/*.{js,ts,jsx,tsx}", // Escanea componentes reutilizables
    "./pages/**/*.{js,ts,jsx,tsx}", // Por si usas la carpeta pages
    "./public/**/*.html", // Por si tienes plantillas HTML estáticas
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)', // Colores personalizados desde las variables CSS
        foreground: 'var(--foreground)',
        primary: '#4f46e5', // Ejemplo de un color adicional
        secondary: '#6366f1',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], // Agrega fuentes globales personalizadas
      },
      spacing: {
        128: '32rem', // Ejemplo: Añadir espaciado personalizado
        144: '36rem',
      },
      borderRadius: {
        xl: '1.5rem', // Ejemplo de añadir esquinas redondeadas personalizadas
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Plugin para estilizar formularios
    require('@tailwindcss/typography'), // Plugin para texto más estilizado
    require('@tailwindcss/aspect-ratio'), // Plugin para mantener proporciones de contenedores
  ],
};
