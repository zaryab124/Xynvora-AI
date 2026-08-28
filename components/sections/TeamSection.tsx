import { TEAM } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";
import Badge from "@/components/ui/Badge";

export default function TeamSection() {
  return (
    <section style={{ minHeight:"100vh", background:"#020617", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="50%" y="10%" color="#10b981" size={300} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="Our People" sub="Meet the Team" accent="#10b981" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
          {TEAM.map((m) => (
            <Card3D key={m.name}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"28px 24px", textAlign:"center" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:`${m.color}1a`, border:`2px solid ${m.color}50`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 16px" }}>
                  {m.emoji}
                </div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:4 }}>{m.name}</div>
                <div style={{ color:m.color, fontSize:13, marginBottom:16 }}>{m.role}</div>
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:6 }}>
                  {m.skills.map((s) => <Badge key={s} label={`✓ ${s}`} color={m.color} />)}
                </div>
                <a href="#" style={{ display:"inline-block", marginTop:16, fontSize:12, color:"rgba(255,255,255,0.4)", textDecoration:"none" }}>🔗 LinkedIn</a>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
