import { PORTFOLIO } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

export default function PortfolioSection() {
  return (
    <section style={{ minHeight:"100vh", background:"#020617", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="10%" y="40%" color="#f59e0b" size={300} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="Case Studies" sub="Our Portfolio" accent="#f59e0b" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
          {PORTFOLIO.map((p) => (
            <Card3D key={p.title}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
                <div style={{ background:`${p.color}15`, height:120, display:"flex", alignItems:"center", justifyContent:"center", fontSize:56, borderBottom:`1px solid ${p.color}20` }}>
                  {p.emoji}
                </div>
                <div style={{ padding:"20px 22px" }}>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:4 }}>{p.title}</div>
                  <div style={{ color:p.color, fontSize:12, marginBottom:10 }}>Client: {p.client}</div>
                  <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, lineHeight:1.6, marginBottom:14 }}>{p.desc}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                    {p.tech.map((t) => (
                      <span key={t} style={{ background:"rgba(255,255,255,0.06)", borderRadius:6, padding:"3px 8px", fontSize:11, color:"rgba(255,255,255,0.55)" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ background:`${p.color}15`, border:`1px solid ${p.color}30`, borderRadius:8, padding:"8px 12px", fontSize:12, color:p.color, marginBottom:12 }}>
                    📈 {p.result}
                  </div>
                  <a href={p.demoUrl} style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textDecoration:"none" }}>🔗 View Demo</a>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
