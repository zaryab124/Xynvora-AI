import Card3D from "@/components/ui/Card3D";
import GlowOrb from "@/components/ui/GlowOrb";
import SectionTitle from "@/components/ui/SectionTitle";

const VALUES = [
  { icon: "💡", label: "Innovation",        desc: "Pioneering AI solutions that push the boundaries of what's possible." },
  { icon: "🛡️", label: "Integrity",         desc: "Transparent, ethical, and trustworthy in every client engagement." },
  { icon: "⭐", label: "Excellence",        desc: "Delivering quality that exceeds expectations, every single time." },
  { icon: "🚀", label: "Customer Success",  desc: "Your growth is our mission — we win when you win." },
];

export default function AboutSection() {
  return (
    <section style={{ minHeight:"100vh", background:"#020617", padding:"100px 24px 80px", position:"relative", overflow:"hidden" }}>
      <GlowOrb x="70%" y="0%" color="#a855f7" size={400} />
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTitle label="Our Story" sub="About Xynvora AI" accent="#a855f7" />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, marginBottom:64, alignItems:"center" }}>
          <div>
            <h3 style={{ color:"#fff", fontFamily:"var(--font-orbitron)", fontSize:22, marginBottom:16 }}>Why We Were Founded</h3>
            <p style={{ color:"rgba(255,255,255,0.6)", lineHeight:1.8, marginBottom:16 }}>
              Xynvora AI was born from a simple belief: artificial intelligence should not be a luxury reserved for tech giants. We founded the company to bridge the gap between cutting-edge AI research and practical business applications.
            </p>
            <p style={{ color:"rgba(255,255,255,0.6)", lineHeight:1.8 }}>
              Our founders witnessed firsthand how small and medium businesses were left behind in the AI revolution. We set out to change that — building intelligent, affordable, and scalable solutions for every business.
            </p>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { label:"Mission", text:"Make AI accessible to businesses of all sizes.",         color:"#00d4ff", icon:"🎯" },
              { label:"Vision",  text:"Become a leading AI & Automation company globally.",     color:"#a855f7", icon:"🌍" },
            ].map((item) => (
              <Card3D key={item.label}>
                <div style={{ background:`${item.color}0d`, border:`1px solid ${item.color}30`, borderRadius:16, padding:"24px 28px" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{item.icon}</div>
                  <div style={{ fontSize:11, color:item.color, letterSpacing:2, marginBottom:6, fontFamily:"var(--font-orbitron)" }}>{item.label.toUpperCase()}</div>
                  <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15, margin:0 }}>{item.text}</p>
                </div>
              </Card3D>
            ))}
          </div>
        </div>

        <h3 style={{ color:"#fff", fontFamily:"var(--font-orbitron)", fontSize:20, textAlign:"center", marginBottom:32 }}>Core Values</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
          {VALUES.map((v) => (
            <Card3D key={v.label}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"28px 24px", textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{v.icon}</div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:8 }}>{v.label}</div>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{v.desc}</p>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
