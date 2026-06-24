"use client";
import Image from "next/image";

const projects = [
  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2eEJXmoLf3c4PSuXhv77mGltvBkWtW4iJYoimdt4EOUk6D3NjsaNqkeR2c1_0HdIjRL0c--KWkN29eW2LehFJNZ3VOtxUCTyzh7ye9zq3P-vASnj1s0FMhfQx6fQZnjgooNB5-lziA768_hpDaWNzRRVyvkxAK0tnEPNiZAC-QbiZCnQv0rl3Y9DSB3J9NpsdUSYSVtW9MdFLrSRvWCvP6OpCEQrAahg9yF6bdvPO3bB_eawDT6VvkWXFhXUkwINT0UyJW5oJvE4", alt: "Lüks Rezidans Projesi", status: "DEVAM EDİYOR", statusColor: "#f9bc51", city: "İSTANBUL, TR", title: "Lüks Rezidans Projesi" },
  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5WpKFir2I72b9VWWzUMWErnuXt7jWQIpQhPYUtSfK7P86saRJiENmVMzGQg3WmmlWhmEaP4SP1oWrDZFCG0-bWTwQE9w_tHrj_DhoL91ivgxT2zQ2rsrRXVABecC9uOheVZEPN3lwV6KwotkBtouO5uVnp5IMUosmvMyn-kBJuq9ZXUCqUlc-huDBXyC76ilLa4kir8wKEXM1jtCYsCUB-1h0xJLoy-jyCx2YbIwEJihCj0lGqVh0pr6l6C_wqzStURBmXWiQa0g", alt: "Ticari İş Merkezi", status: "TAMAMLANDI", statusColor: "#e5e2e1", city: "ANKARA, TR", title: "Ticari İş Merkezi" },
  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4AdnFMvxhwJt9m4GviIHAj-SLY-mW78cGFB5BPwRiuOgqhahHQghQeIGv2bWI-u_Xi3iNuRltFVgWO-UEZym8VHbJ3QDjYmcufTGn1KyUftT28jQadSO7dz1khBjw-S5Wl1arHd6zkq4ezdEUl7ScddKpYSJHCm8ngRKQbPSS5JqkERt2WCGJLutVHjBRK0BwNNaYlPFvrQq9LzoWHTo-mSXDtGM2k__G5MtKiUcMOe4gNDUV0qAfYdx3rxemoSUWyBdIixZ1LwQ", alt: "Tarihi Restorasyon", status: "TAMAMLANDI", statusColor: "#e5e2e1", city: "İZMİR, TR", title: "Tarihi Restorasyon" },
];

export default function Projects() {
  return (
    <section id="projeler" className="section-padding" style={{ backgroundColor: "#0e0e0e" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 64, flexWrap: "wrap", gap: 16 }}>
          <h2 className="section-title" style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em", color: "#e5e2e1", margin: 0 }}>Seçkin Projelerimiz</h2>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f9bc51" }}>02 / PROJELER</span>
        </div>
        <div className="three-col">
          {projects.map((p) => (
            <div key={p.title} style={{ cursor: "pointer" }}
              onMouseEnter={e => { const img = (e.currentTarget as HTMLElement).querySelector("img"); if (img) img.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { const img = (e.currentTarget as HTMLElement).querySelector("img"); if (img) img.style.transform = "scale(1)"; }}>
              <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", border: "1px solid #262626" }}>
                <Image src={p.img} alt={p.alt} fill style={{ objectFit: "cover", transition: "transform 0.7s" }} unoptimized />
                <div style={{ position: "absolute", bottom: 0, left: 0, backgroundColor: "rgba(19,19,19,0.9)", padding: 16, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: p.statusColor }}>
                  {p.status}
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f9bc51", marginBottom: 8 }}>{p.city}</div>
                <h3 style={{ fontSize: 28, fontWeight: 600, color: "#e5e2e1", margin: 0 }}>{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
