'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils"; // Asegúrate de tener esta función definida en utils

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "outline" | "filled"; // Puedes agregar más variantes
  size?: "sm" | "md" | "lg"; // Diferentes tamaños de botones
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "filled", size = "md", ...props }, ref) => {
    // Definimos clases dependiendo de las variantes y tamaños
    const variantClasses =
      variant === "outline"
        ? "border-2 border-gray-500 text-gray-500 hover:bg-gray-100"
        : "bg-purple-600 text-white hover:bg-purple-700";

    const sizeClasses =
      size === "sm"
        ? "px-3 py-1.5 text-sm"
        : size === "lg"
        ? "px-6 py-3 text-lg"
        : "px-4 py-2 text-md"; // Tamaños personalizados

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer", // Aquí se aplica el cursor: pointer
          variantClasses,
          sizeClasses,
          className // Para clases adicionales personalizadas
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
