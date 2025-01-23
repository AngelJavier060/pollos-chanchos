// hooks/use-toast.ts

import { useState } from "react";

// Hook personalizado que maneja el estado de los toasts
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  // Mostrar toast
  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000); // Ocultar después de 3 segundos
  };

  return { message, showToast };
}

// Función global de toast (esto puedes cambiarlo si usas una librería como react-toastify)
export const toast = (msg: string) => {
  // Aquí puedes usar algo como `react-toastify`, o simplemente usar un `alert` para mostrar el mensaje
  alert(msg); // Usamos un simple alert como ejemplo
};
