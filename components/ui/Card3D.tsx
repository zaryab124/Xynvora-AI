"use client";

import React from "react";
import { useCard3D } from "@/hooks/useCard3D";

export interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card3D({ children, className = "", style }: Card3DProps) {
  const { ref, onMouseMove, onMouseLeave } = useCard3D();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`card-3d ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export default Card3D;
