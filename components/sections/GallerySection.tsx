import { GALLERY_ITEMS } from "@/data";
import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

export default function GallerySection() {
  return (
    <section style={{ minHeight:"100vh", background:"#020617", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="60%" y="60%" color="#f59e0b" size={300} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="Behind the Scenes" sub="Media Gallery" accent="#f59e0b" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
          {GALLERY_ITEMS.map((g) => (
            <Card3D key={g.label}>
              <div style={{ background:`${g.color}12`, border:`1px solid ${g.color}25`, borderRadius:16, padding:"36px 20px", textAlign:"center", cursor:"pointer", aspectRatio:"1/1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>{g.emoji}</div>
                <div style={{ color:"#fff", fontWeight:600, fontSize:14, marginBottom:6 }}>{g.label}</div>
                <span style={{ background:`${g.color}20`, borderRadius:20, padding:"3px 10px", fontSize:11, color:g.color }}>{g.cat}</span>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
