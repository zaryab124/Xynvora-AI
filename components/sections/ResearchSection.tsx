"use client";
import { useState } from "react";
import { RESEARCH } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

const CATS = ["All","Generative AI","Machine Learning","Agentic AI","Automation"];

export default function ResearchSection() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? RESEARCH : RESEARCH.filter((r) => r.category === active);
  return (
    <section style={{ minHeight:"100vh", background:"#020617", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="80%" y="20%" color="#a855f7" size={300} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="Knowledge Hub" sub="Research & Innovation" accent="#a855f7" />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:40 }}>
          {CATS.map((c) => (
            <button key={c} onClick={() => setActive(c)}
              style={{ background:active===c?"#a855f7":"rgba(168,85,247,0.1)", border:`1px solid rgba(168,85,247,${active===c?0.8:0.25})`, borderRadius:20, padding:"8px 18px", fontSize:13, color:active===c?"#fff":"#a855f7", cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
          {filtered.map((r) => (
            <Card3D key={r.title}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"28px 24px" }}>
                <div style={{ fontSize:36, marginBottom:16 }}>{r.emoji}</div>
                <span style={{ background:`${r.color}15`, border:`1px solid ${r.color}30`, borderRadius:20, display:"inline-block", padding:"3px 12px", fontSize:11, color:r.color, marginBottom:12 }}>{r.category}</span>
                <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:8 }}>{r.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:16 }}>By {r.author} &bull; {r.date}</div>
                <button style={{ background:"none", border:`1px solid ${r.color}40`, color:r.color, borderRadius:8, padding:"8px 16px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>📄 Read Paper</button>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
