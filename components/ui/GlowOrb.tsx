import React from "react";

export interface GlowOrbProps {
  x?: string;
  y?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  color?: string;
  size?: number;
  opacity?: number;
}

export function GlowOrb({
  x,
  y,
  top,
  left,
  right,
  bottom,
  color = "#00d4ff",
  size = 300,
  opacity = 0.12,
}: GlowOrbProps) {
  const style: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: color,
    filter: "blur(80px)",
    opacity,
    pointerEvents: "none",
    zIndex: 0,
  };

  if (top !== undefined) style.top = top;
  if (bottom !== undefined) style.bottom = bottom;
  if (left !== undefined) style.left = left;
  if (right !== undefined) style.right = right;

  if (top === undefined && bottom === undefined && y !== undefined) style.top = y;
  if (left === undefined && right === undefined && x !== undefined) style.left = x;

  if (style.top === undefined && style.bottom === undefined) style.top = "0%";
  if (style.left === undefined && style.right === undefined) style.left = "0%";

  return <div style={style} />;
}

export default GlowOrb;
