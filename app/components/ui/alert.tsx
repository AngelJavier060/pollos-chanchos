'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // Asegúrate de que esta función esté correctamente definida en tu proyecto

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4",
          variant === "destructive" && "border-red-500 bg-red-50 text-red-700",
          className
        )}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm", className)}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
