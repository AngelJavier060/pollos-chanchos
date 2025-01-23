import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases condicionalmente y resuelve conflictos en clases de TailwindCSS.
 * @param inputs - Clases CSS, valores condicionales u objetos que representan clases.
 * @returns Una cadena optimizada de clases CSS.
 *
 * Ejemplo:
 *   cn("bg-red-500", undefined, { "text-white": true }) // "bg-red-500 text-white"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
