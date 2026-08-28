import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Xynvora AI — Company + Community + Innovation Platform",
  description: "Xynvora AI bridges community ideas, C-suite executive governance, and elite AI engineering to build transformative real-world solutions.",
  keywords: ["Xynvora AI", "AI Agents", "Enterprise Automation", "Community Innovation", "CGO", "Machine Learning"],
  openGraph: {
    title: "Xynvora AI — Company + Community + Innovation Platform",
    description: "Building Intelligent AI Solutions from Community Breakthroughs",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <ToastProvider>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
