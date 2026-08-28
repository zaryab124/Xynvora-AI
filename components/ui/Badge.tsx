import React from "react";

export interface BadgeProps {
  label: string;
  color?: string;
  className?: string;
}

export function Badge({ label, color = "#00d4ff", className = "" }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        background: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: 20,
        padding: "3px 12px",
        fontSize: 11,
        color,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

export default Badge;
