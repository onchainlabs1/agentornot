"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default: "bg-primary text-white hover:opacity-95",
    outline: "border border-border bg-white text-foreground hover:bg-gray-50",
    ghost: "bg-transparent text-foreground hover:bg-gray-100"
  };

  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
