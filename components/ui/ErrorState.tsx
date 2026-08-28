"use client";

import React from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Failed to load content",
  message = "An unexpected error occurred while fetching information. Please check your network and try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-red-500/20 bg-red-950/20 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-3 text-xl">
        ⚠️
      </div>
      <h4 className="text-base font-bold text-red-200 mb-1">{title}</h4>
      <p className="text-xs text-red-300/80 max-w-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
