import { SOLUTIONS } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

export default function SolutionsSection() {
  return (
    <section style={{ minHeight:"100vh", background:"#030918", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="50%" y="50%" color="#06b6d4" size={400} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="Industries" sub="Solutions We Serve" accent="#06b6d4" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20 }}>
          {SOLUTIONS.map((s) => (
            <Card3D key={s.label}>
              <div style={{ background:`${s.color}0d`, border:`1px solid ${s.color}25`, borderRadius:20, padding:"40px 24px", textAlign:"center", cursor:"pointer" }}>
                <div style={{ fontSize:52, marginBottom:16 }}>{s.emoji}</div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>{s.label}</div>
                <div style={{ width:40, height:2, background:s.color, margin:"12px auto 0", borderRadius:2 }} />
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
