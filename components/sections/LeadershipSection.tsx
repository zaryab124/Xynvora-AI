import { LEADERSHIP } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";
import Badge from "@/components/ui/Badge";

export default function LeadershipSection() {
  return (
    <section style={{ minHeight:"100vh", background:"#030918", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="-5%" y="20%" color="#00d4ff" size={350} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="The Team" sub="Our Leadership" accent="#00d4ff" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:28 }}>
          {LEADERSHIP.map((l) => (
            <Card3D key={l.name}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
                <div style={{ background:`linear-gradient(135deg, ${l.colorFrom}, ${l.colorTo})`, padding:"40px 28px 24px" }}>
                  <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, marginBottom:16, border:"3px solid rgba(255,255,255,0.3)" }}>
                    {l.emoji}
                  </div>
                  <div style={{ color:"#fff", fontFamily:"var(--font-orbitron)", fontWeight:700, fontSize:18 }}>{l.name}</div>
                  <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, marginTop:4 }}>{l.role}</div>
                </div>
                <div style={{ padding:"24px 28px" }}>
                  <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, lineHeight:1.7, fontStyle:"italic", marginBottom:20 }}>
                    &ldquo;{l.message}&rdquo;
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {l.responsibilities.map((r) => <Badge key={r} label={r} color="#00d4ff" />)}
                  </div>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
