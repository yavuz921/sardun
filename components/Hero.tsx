import Image from "next/image";

export default function Hero() {
  return (
    <section id="anasayfa" className="relative flex items-center overflow-hidden" style={{ minHeight: "100svh" }}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} />
        <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf7enA31HHcZgs8hONgni9LQ1n207HGAwd_hcmQFyIbTcu_3nDDSnY1778ZUbVANURoZPGzR8CuLUIJMGgvv-2DFqX7u8m8vofLSG7FMoVAvuBw8Hb6Czr6m86t5uvV095k8KFhg4vtWFC9U-lkx10259ByrmvQnKFoYqJCXUscMlaxTmUJ38ZyhWe5mworIQpVCkrRj_6wsUtnv7ZqKgXW6wHt1DXSGmEpsbkTjtNs-hwVqkFsLJfOJzwRzSbef4e2XKlhWq3ZlQ"
          alt="Sardun Hero" fill className="object-cover" priority unoptimized />
      </div>

      <div className="relative z-20 w-full px-5 md:px-16 mx-auto" style={{ maxWidth: 1440 }}>
        <div className="flex flex-col gap-6 md:gap-8 max-w-3xl py-24 md:py-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold" style={{ lineHeight: 1.1, letterSpacing: "-0.02em", color: "#e5e2e1", margin: 0 }}>
            Güçlü Temeller, <br />
            <span style={{ color: "#f9bc51" }}>Kalıcı Yapılar.</span>
          </h1>
          <p className="text-base md:text-lg max-w-xl" style={{ lineHeight: 1.6, color: "#d4c4b0", margin: 0 }}>
            Sardun İnşaat — profesyonel çözümler, güvenilir hizmet. Mimari mükemmellik ve mühendislik disipliniyle geleceği inşa ediyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#iletisim" style={{ backgroundColor: "#c9922a", color: "#472f00", padding: "16px 32px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}>
              TEKLİF AL
            </a>
            <a href="#projeler" style={{ border: "1px solid #e5e2e1", color: "#e5e2e1", padding: "16px 32px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}>
              PROJELERİMİZ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
