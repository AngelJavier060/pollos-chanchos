'use client';

import * as React from "react";
import {
  Controller,
  ControllerProps,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormField = <T,>({
  control,
  name,
  render,
}: ControllerProps<T>) => (
  <Controller control={control} name={name} render={render} />
);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
  }
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return <label ref={ref} className={cn("text-sm font-medium", className)} {...props} />;
  }
);
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center", className)} {...props} />;
  }
);
FormControl.displayName = "FormControl";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-red-500", className)} {...props} />;
  }
);
FormMessage.displayName = "FormMessage";

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
