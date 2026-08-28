"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
      md: "px-5 py-2.5 text-sm rounded-xl gap-2",
      lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5 font-semibold",
    };

    const variantClasses = {
      primary:
        "bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-[0.98] border border-cyan-400/30",
      secondary:
        "bg-slate-800/90 text-slate-100 font-medium hover:bg-slate-700/90 border border-slate-700/60 hover:border-slate-600 active:scale-[0.98]",
      outline:
        "bg-transparent text-cyan-400 font-medium border border-cyan-500/40 hover:bg-cyan-950/40 hover:border-cyan-400 active:scale-[0.98]",
      ghost:
        "bg-transparent text-slate-300 font-medium hover:bg-slate-800/50 hover:text-white active:scale-[0.98]",
      danger:
        "bg-red-500/90 text-white font-medium hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-400/30 active:scale-[0.98]",
      gradient:
        "bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-semibold hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-white/20 active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none tracking-wide",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
