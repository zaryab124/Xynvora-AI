import { TESTIMONIALS } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

export default function TestimonialsSection() {
  return (
    <section style={{ minHeight:"100vh", background:"#030918", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="30%" y="30%" color="#ec4899" size={300} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="Client Love" sub="Testimonials" accent="#ec4899" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
          {TESTIMONIALS.map((t) => (
            <Card3D key={t.name}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"28px 26px" }}>
                <div style={{ color:"#f59e0b", fontSize:20, marginBottom:16 }}>{"⭐".repeat(t.rating)}</div>
                <p style={{ color:"rgba(255,255,255,0.7)", fontSize:15, lineHeight:1.7, fontStyle:"italic", marginBottom:20 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:12, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:16 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(236,72,153,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#ec4899" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{t.name}</div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>{t.company}</div>
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
