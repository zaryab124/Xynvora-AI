import { ROADMAP } from "@/data";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

export default function RoadmapSection() {
  return (
    <section style={{ minHeight:"100vh", background:"#030918", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="20%" y="50%" color="#10b981" size={300} />
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <SectionTitle label="What's Coming" sub="Product Roadmap" accent="#10b981" />
        <div style={{ position:"relative", paddingLeft:40 }}>
          <div style={{ position:"absolute", left:16, top:0, bottom:0, width:2, background:"linear-gradient(to bottom,#00d4ff,#10b981,#a855f7,rgba(0,0,0,0))" }} />
          {ROADMAP.map((q, qi) => (
            <div key={q.quarter} style={{ marginBottom:52, position:"relative" }}>
              <div style={{ position:"absolute", left:-30, top:4, width:12, height:12, borderRadius:"50%", background:qi<2?"#10b981":"#1e293b", border:`2px solid ${qi<2?"#10b981":"#334155"}`, boxShadow:qi<2?"0 0 12px #10b981":"none" }} />
              <div style={{ fontFamily:"var(--font-orbitron)", fontSize:14, color:"#00d4ff", marginBottom:16, fontWeight:700 }}>{q.quarter}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                {q.tasks.map((t) => (
                  <div key={t.label} style={{ background:t.done?"rgba(16,185,129,0.1)":"rgba(255,255,255,0.03)", border:`1px solid ${t.done?"rgba(16,185,129,0.4)":"rgba(255,255,255,0.08)"}`, borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
                    <span>{t.done?"✅":"⬜"}</span>
                    <span style={{ fontSize:13, color:t.done?"#10b981":"rgba(255,255,255,0.6)" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
