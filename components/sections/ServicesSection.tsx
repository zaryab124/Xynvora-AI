import { SERVICES } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

const DEV  = [{ icon:"🌐", title:"Websites" },{ icon:"⚡", title:"Web Applications" },{ icon:"📈", title:"Dashboards" }];
const CLOUD= [{ icon:"☁️", title:"AWS" },{ icon:"🔷", title:"Azure" },{ icon:"🔶", title:"Google Cloud" }];

export default function ServicesSection() {
  return (
    <section style={{ minHeight:"100vh", background:"#030918", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="80%" y="50%" color="#7c3aed" size={350} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="What We Do" sub="Our Services" accent="#7c3aed" />

        {/* AI Services */}
        <p style={{ fontSize:11, color:"#00d4ff", letterSpacing:2, fontFamily:"var(--font-orbitron)", marginBottom:20 }}>AI SERVICES</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:20, marginBottom:48 }}>
          {SERVICES.map((s) => (
            <Card3D key={s.title}>
              <div style={{ background:`${s.color}0a`, border:`1px solid ${s.color}25`, borderRadius:16, padding:"28px 24px" }}>
                <div style={{ fontSize:36, marginBottom:16 }}>{s.icon}</div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:8 }}>{s.title}</div>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0, lineHeight:1.6 }}>{s.desc}</p>
              </div>
            </Card3D>
          ))}
        </div>

        {/* Dev + Cloud */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
          {[
            { label:"DEVELOPMENT", color:"#7c3aed", items:DEV },
            { label:"CLOUD",       color:"#f59e0b", items:CLOUD },
          ].map((g) => (
            <div key={g.label}>
              <p style={{ fontSize:11, color:g.color, letterSpacing:2, fontFamily:"var(--font-orbitron)", marginBottom:16 }}>{g.label}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {g.items.map((item) => (
                  <div key={item.title} style={{ background:`${g.color}0a`, border:`1px solid ${g.color}20`, borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:24 }}>{item.icon}</span>
                    <span style={{ color:"rgba(255,255,255,0.75)", fontSize:14 }}>{item.title}</span>
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
