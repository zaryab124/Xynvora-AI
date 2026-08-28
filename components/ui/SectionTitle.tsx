import React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  label?: string;
  sub?: string;
  accent?: string;
  className?: string;
}

export function SectionTitle({
  badge,
  title,
  subtitle,
  label,
  sub,
  accent = "#00d4ff",
  className,
}: SectionTitleProps) {
  const displayBadge = badge || label;
  const displayTitle = title || sub;

  return (
    <div className={cn("text-center mb-14 space-y-3", className)}>
      {displayBadge && (
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}40`,
            color: accent,
          }}
        >
          {displayBadge}
        </div>
      )}
      {displayTitle && (
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {displayTitle}
        </h2>
      )}
      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
