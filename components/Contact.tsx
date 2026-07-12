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
    <section id="iletisim" className="relative py-24 md:py-36 px-5 md:px-14 hex-pattern overflow-hidden">
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
              <span style={{ width: 48, height: 1.5, backgroundColor: "#d9a441" }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#d9a441" }}>
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
                    className="material-symbols-outlined flex items-center justify-center"
                    style={{
                      color: "#d9a441", fontSize: 22, width: 52, height: 52,
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {c.icon}
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
                <select style={{ ...inputStyle, appearance: "none" }}>
                  {["Statik Proje", "Çelik Yapı Tasarımı", "Analiz / Danışmanlık", "Diğer"].map((t) => (
                    <option key={t} style={{ backgroundColor: "#16293f" }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Mesaj</label>
                <textarea rows={4} placeholder="Projeniz hakkında kısaca bilgi verin" style={{ ...inputStyle, resize: "none" }} />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
                style={{
                  backgroundColor: "#d9a441", color: "#16293f", padding: "18px",
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
