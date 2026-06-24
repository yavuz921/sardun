"use client";
import Image from "next/image";

const projects = [
  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2eEJXmoLf3c4PSuXhv77mGltvBkWtW4iJYoimdt4EOUk6D3NjsaNqkeR2c1_0HdIjRL0c--KWkN29eW2LehFJNZ3VOtxUCTyzh7ye9zq3P-vASnj1s0FMhfQx6fQZnjgooNB5-lziA768_hpDaWNzRRVyvkxAK0tnEPNiZAC-QbiZCnQv0rl3Y9DSB3J9NpsdUSYSVtW9MdFLrSRvWCvP6OpCEQrAahg9yF6bdvPO3bB_eawDT6VvkWXFhXUkwINT0UyJW5oJvE4", alt: "Lüks Rezidans Projesi", status: "DEVAM EDİYOR", statusColor: "#f9bc51", city: "İSTANBUL, TR", title: "Lüks Rezidans Projesi" },
  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5WpKFir2I72b9VWWzUMWErnuXt7jWQIpQhPYUtSfK7P86saRJiENmVMzGQg3WmmlWhmEaP4SP1oWrDZFCG0-bWTwQE9w_tHrj_DhoL91ivgxT2zQ2rsrRXVABecC9uOheVZEPN3lwV6KwotkBtouO5uVnp5IMUosmvMyn-kBJuq9ZXUCqUlc-huDBXyC76ilLa4kir8wKEXM1jtCYsCUB-1h0xJLoy-jyCx2YbIwEJihCj0lGqVh0pr6l6C_wqzStURBmXWiQa0g", alt: "Ticari İş Merkezi", status: "TAMAMLANDI", statusColor: "#e5e2e1", city: "ANKARA, TR", title: "Ticari İş Merkezi" },
  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4AdnFMvxhwJt9m4GviIHAj-SLY-mW78cGFB5BPwRiuOgqhahHQghQeIGv2bWI-u_Xi3iNuRltFVgWO-UEZym8VHbJ3QDjYmcufTGn1KyUftT28jQadSO7dz1khBjw-S5Wl1arHd6zkq4ezdEUl7ScddKpYSJHCm8ngRKQbPSS5JqkERt2WCGJLutVHjBRK0BwNNaYlPFvrQq9LzoWHTo-mSXDtGM2k__G5MtKiUcMOe4gNDUV0qAfYdx3rxemoSUWyBdIixZ1LwQ", alt: "Tarihi Restorasyon", status: "TAMAMLANDI", statusColor: "#e5e2e1", city: "İZMİR, TR", title: "Tarihi Restorasyon" },
];

export default function Projects() {
  return (
    <section id="projeler" className="py-20 md:py-32 px-5 md:px-16" style={{ backgroundColor: "#0e0e0e" }}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="flex justify-between items-center gap-4 mb-12 md:mb-16 flex-wrap">
          <h2 className="text-3xl md:text-5xl font-semibold" style={{ lineHeight: 1.2, letterSpacing: "-0.01em", color: "#e5e2e1", margin: 0 }}>Seçkin Projelerimiz</h2>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f9bc51" }}>02 / PROJELER</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.title} className="cursor-pointer group">
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", border: "1px solid #262626" }}>
                <Image src={p.img} alt={p.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                <div className="absolute bottom-0 left-0 p-4" style={{ backgroundColor: "rgba(19,19,19,0.9)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: p.statusColor }}>
                  {p.status}
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f9bc51" }}>{p.city}</div>
                <h3 className="text-2xl font-semibold" style={{ color: "#e5e2e1", margin: 0 }}>{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
