import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4f46e5",  // Color primario
        secondary: "#6366f1",  // Color secundario
        input: "#d1d5db",  // Color de los inputs
        "muted-foreground": "#6b7280",  // Color para texto atenuado
        ring: "#6366f1",  // Color de borde (ring)
        destructive: "#ef4444",  // Color destructivo (para botones de eliminación, por ejemplo)
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],  // Tipografía personalizada
      },
      spacing: {
        4.5: "1.125rem",  // Espaciado personalizado
        128: "32rem",  // Espaciado más grande
        144: "36rem",  // Espaciado aún más grande
      },
      borderRadius: {
        md: "0.375rem",  // Radio de borde mediano
        lg: "0.5rem",  // Radio de borde grande
        xl: "1.5rem",  // Radio de borde extra grande
      },
    },
  },
  darkMode: 'class',  // Usamos la clase `dark` para activar el modo oscuro
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
