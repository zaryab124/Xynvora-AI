"use client";

import React, { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glowColor?: "cyan" | "purple" | "emerald" | "amber";
  gradientBorder?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = false, glowColor = "cyan", gradientBorder = false, children, ...props }, ref) => {
    const glowShadow = {
      cyan: "hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] hover:border-cyan-400/60",
      purple: "hover:shadow-[0_0_35px_rgba(168,85,247,0.25)] hover:border-purple-400/60",
      emerald: "hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:border-emerald-400/60",
      amber: "hover:shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:border-amber-400/60",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/70 shadow-lg shadow-slate-950/40 transition-all duration-300 overflow-hidden",
          glow && glowShadow[glowColor],
          gradientBorder && "before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-cyan-500/30 before:via-purple-500/30 before:to-transparent before:rounded-2xl before:-z-10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-bold tracking-tight text-white flex items-center gap-2", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-slate-400 leading-relaxed", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0 border-t border-slate-800/40 mt-4", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";
