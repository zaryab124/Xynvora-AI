"use client";
import { useState } from "react";
import { CAREERS } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

export default function CareersSection() {
  const [form, setForm] = useState({ name:"", email:"", position:"", message:"" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <section style={{ minHeight:"100vh", background:"#020617", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="70%" y="40%" color="#10b981" size={300} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="Join Us" sub="Careers at Xynvora AI" accent="#10b981" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
          {/* Open positions */}
          <div>
            <h3 style={{ color:"#fff", fontFamily:"var(--font-orbitron)", fontSize:18, marginBottom:24 }}>Open Positions</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {CAREERS.map((c) => (
                <Card3D key={c.title}>
                  <div style={{ background:`${c.color}0a`, border:`1px solid ${c.color}25`, borderRadius:16, padding:"20px 22px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:12 }}>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>{c.title}</div>
                      <span style={{ background:`${c.color}20`, borderRadius:20, padding:"3px 10px", fontSize:11, color:c.color }}>{c.type}</span>
                    </div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:12 }}>📍 {c.location}</div>
                    <button style={{ background:c.color, border:"none", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:600, color:"#000", cursor:"pointer", fontFamily:"inherit" }}>Apply Now →</button>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>

          {/* Apply form */}
          <div>
            <h3 style={{ color:"#fff", fontFamily:"var(--font-orbitron)", fontSize:18, marginBottom:24 }}>Apply Now</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { k:"name",     ph:"Full Name",                  type:"text"  },
                { k:"email",    ph:"Email Address",              type:"email" },
                { k:"position", ph:"Position Applying For",     type:"text"  },
              ].map((f) => (
                <input key={f.k} type={f.type} placeholder={f.ph}
                  value={(form as Record<string, string>)[f.k]}
                  onChange={(e) => set(f.k, e.target.value)}
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"14px 16px", color:"#fff", fontSize:14, fontFamily:"inherit", width:"100%", boxSizing:"border-box" as const }} />
              ))}
              <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"14px 16px", color:"rgba(255,255,255,0.4)", fontSize:14, cursor:"pointer" }}>
                📎 Upload Resume (PDF)
              </div>
              <button style={{ background:"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:10, padding:16, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
