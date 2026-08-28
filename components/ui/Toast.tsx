"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: "info" | "success" | "warning" | "error";
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(({ title, message, type = "info" }: Omit<Toast, "id">) => {
    const id = "toast_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const typeStyles = {
    info: "bg-slate-900/95 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]",
    success: "bg-slate-900/95 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    warning: "bg-slate-900/95 border-amber-500/50 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    error: "bg-slate-900/95 border-red-500/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Viewport */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start justify-between p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5",
              typeStyles[toast.type || "info"]
            )}
          >
            <div className="space-y-1 pr-2">
              <h6 className="text-xs font-bold tracking-wide">{toast.title}</h6>
              {toast.message && <p className="text-[11px] text-slate-300 leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
