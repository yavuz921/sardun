"use client";
import { FormEvent } from "react";
import { motion } from "framer-motion";

const contacts = [
  { icon: "call", label: "Telefon", value: "+90 554 551 13 58", href: "tel:+905545511358" },
  { icon: "mail", label: "E-posta", value: "info@sardun.com.tr", href: "mailto:info@sardun.com.tr" },
  { icon: "location_on", label: "Konum", value: "Çankaya / Ankara", href: undefined },
];

export default function Contact() {
  const handleSubmit = (e: FormEvent) => e.preventDefault();

  const inputStyle: React.CSSProperties = {
    width: "100%", backgroundColor: "transparent", border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.25)", color: "#fff",
    padding: "12px 0", fontSize: 15.5, outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11.5, fontWeight: 600, letterSpacing: "0.18em",
    textTransform: "uppercase", color: "#8fa3b8", display: "block", marginBottom: 6,
  };

  return (
    <section id="iletisim" className="relative py-24 md:py-36 px-5 md:px-14 overflow-hidden" style={{ backgroundColor: "#0F1B2E" }}>
      <div className="relative mx-auto" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">
          {/* Sol taraf */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <span style={{ width: 48, height: 1.5, backgroundColor: "#B9C2CD" }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#B9C2CD" }}>
                04 — İletişim
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold"
              style={{ lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: 0 }}
            >
              Projenizi
              <br />
              konuşalım.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base mt-7 max-w-md"
              style={{ lineHeight: 1.75, color: "rgba(255,255,255,0.65)" }}
            >
              Statik proje, analiz veya danışmanlık ihtiyacınız için bize ulaşın —
              24 saat içinde dönüş yapıyoruz.
            </motion.p>

            <div className="flex flex-col gap-6 mt-12">
              {contacts.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.1 }}
                  className="flex items-center gap-5"
                >
                  <span
                    className="grid h-[52px] w-[52px] shrink-0 place-items-center border border-white/15 text-[#B9C2CD]"
                    aria-hidden="true"
                  >
                    <ContactIcon name={c.icon} />
                  </span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8fa3b8" }}>
                      {c.label}
                    </div>
                    {c.href ? (
                      <a href={c.href} style={{ fontSize: 17, fontWeight: 600, color: "#fff", textDecoration: "none" }}>
                        {c.value}
                      </a>
                    ) : (
                      <span style={{ fontSize: 17, fontWeight: 600, color: "#fff" }}>{c.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.a
                href="https://wa.me/905545511358"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 self-start mt-2"
                style={{
                  backgroundColor: "#25D366", color: "#fff", padding: "15px 30px",
                  fontSize: 12.5, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", textDecoration: "none",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chat</span>
                WhatsApp ile Yaz
              </motion.a>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 md:p-12"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div>
                <label style={labelStyle}>Ad Soyad</label>
                <input type="text" placeholder="İsminizi yazın" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input type="tel" placeholder="+90 5XX XXX XX XX" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Konu</label>
                <div className="relative">
                  <select style={{ ...inputStyle, appearance: "none", paddingRight: 42, cursor: "pointer" }}>
                    {["Statik Proje", "Çelik Yapı Tasarımı", "Analiz / Danışmanlık", "Diğer"].map((t) => (
                      <option key={t} style={{ backgroundColor: "#16273B" }}>{t}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#B9C2CD]" aria-hidden="true">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mesaj</label>
                <textarea rows={2} placeholder="Projeniz hakkında kısaca bilgi verin" style={{ ...inputStyle, minHeight: 74, padding: "10px 0 8px", lineHeight: 1.55, resize: "none" }} />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
                style={{
                  backgroundColor: "#B9C2CD", color: "#16273B", padding: "18px",
                  fontSize: 13, fontWeight: 800, letterSpacing: "0.16em",
                  textTransform: "uppercase", border: "none", cursor: "pointer",
                }}
              >
                Gönder
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    call: <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.08.36 2.24.54 3.42.54a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.54 21 3 13.46 3 4.18a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.18 2.34.54 3.42a1 1 0 0 1-.24 1Z" />,
    mail: <path d="M4 5h16v14H4V5Zm0 1 8 6 8-6" />,
    location_on: <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 9.5 5 5 5-5" />
    </svg>
  );
}
