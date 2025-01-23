type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
}

export function toast({ title, description, variant = "default", duration = 3000 }: ToastProps) {
  // Crear un elemento div para el toast
  const toastElement = document.createElement('div');
  toastElement.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg ${
    variant === 'destructive' 
      ? 'bg-red-100 text-red-900 border border-red-200' 
      : variant === 'success'
      ? 'bg-green-100 text-green-900 border border-green-200'
      : 'bg-white text-gray-900 border border-gray-200'
  }`;

  // Crear el contenido del toast
  toastElement.innerHTML = `
    ${title ? `<h4 class="font-semibold">${title}</h4>` : ''}
    ${description ? `<p class="text-sm mt-1">${description}</p>` : ''}
  `;

  // Agregar el toast al documento
  document.body.appendChild(toastElement);

  // Animación de entrada
  toastElement.style.transform = 'translateX(100%)';
  toastElement.style.transition = 'transform 0.3s ease-out';
  setTimeout(() => {
    toastElement.style.transform = 'translateX(0)';
  }, 100);

  // Remover el toast después del tiempo especificado
  setTimeout(() => {
    toastElement.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(toastElement);
    }, 300);
  }, duration);
} 