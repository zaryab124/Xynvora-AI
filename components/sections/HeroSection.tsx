"use client";
import Link from "next/link";
import { STATS, SERVICES } from "@/data";
import Card3D from "@/components/ui/Card3D";

export default function HeroSection() {
  return (
    <section style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", background: "#020617" }}>
      {/* Animated grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} className="animate-grid-pulse" />

      {/* Glow orbs */}
      <div style={{ position:"absolute", left:"-5%", top:"10%",  width:500, height:500, borderRadius:"50%", background:"#00d4ff", filter:"blur(90px)", opacity:.1, pointerEvents:"none" }} />
      <div style={{ position:"absolute", left:"60%", top:"20%",  width:400, height:400, borderRadius:"50%", background:"#7c3aed", filter:"blur(90px)", opacity:.1, pointerEvents:"none" }} />
      <div style={{ position:"absolute", left:"25%", top:"60%",  width:300, height:300, borderRadius:"50%", background:"#10b981", filter:"blur(80px)", opacity:.08, pointerEvents:"none" }} />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"100px 24px 60px", position:"relative", zIndex:1, width:"100%" }}>
        {/* Badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.25)", borderRadius:20, padding:"6px 16px", marginBottom:32 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#00d4ff", boxShadow:"0 0 8px #00d4ff" }} className="animate-pulse-glow" />
          <span style={{ fontSize:12, color:"#00d4ff", letterSpacing:1.5, fontFamily:"var(--font-orbitron)" }}>NEXT-GEN AI SOLUTIONS</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily:"var(--font-orbitron)", fontSize:"clamp(32px,5vw,68px)", fontWeight:900, lineHeight:1.1, marginBottom:24, color:"#fff" }}>
          Building{" "}
          <span style={{ background:"linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Intelligent
          </span>
          <br />AI Solutions
          <br />
          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.55em", fontWeight:400 }}>for Modern Businesses</span>
        </h1>

        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:16, maxWidth:560, marginBottom:40, lineHeight:1.7 }}>
          AI Agents &bull; Automation &bull; Web Development &bull; Cloud Solutions &bull; Business Intelligence
        </p>

        {/* CTA */}
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:72 }}>
          <Link href="/contact" style={{ padding:"14px 28px", borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer", background:"linear-gradient(135deg,#00d4ff,#0080ff)", color:"#fff", textDecoration:"none" }}>
            🗓 Book a Meeting
          </Link>
          <Link href="/portfolio" style={{ padding:"14px 28px", borderRadius:10, fontWeight:600, fontSize:14, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", textDecoration:"none" }}>
            🎨 View Portfolio
          </Link>
          <Link href="/contact" style={{ padding:"14px 28px", borderRadius:10, fontWeight:600, fontSize:14, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", textDecoration:"none" }}>
            ✉️ Contact Us
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:16, marginBottom:72 }}>
          {STATS.map((s) => (
            <Card3D key={s.label}>
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"24px 20px", textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-orbitron)", fontSize:32, fontWeight:800, color:"#00d4ff", marginBottom:4 }}>{s.value}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>{s.label}</div>
              </div>
            </Card3D>
          ))}
        </div>

        {/* Featured services */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:36 }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginBottom:18, fontFamily:"var(--font-orbitron)" }}>FEATURED SERVICES</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {SERVICES.map((s) => (
              <div key={s.title} style={{ background:`${s.color}12`, border:`1px solid ${s.color}30`, borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
                <span>{s.icon}</span>
                <span style={{ fontSize:13, color:s.color, fontWeight:500 }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
