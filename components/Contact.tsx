"use client";
import { FormEvent } from "react";

export default function Contact() {
  const handleSubmit = (e: FormEvent) => e.preventDefault();

  const inputStyle = {
    width: "100%", backgroundColor: "transparent", border: "none",
    borderBottom: "1px solid #9c8f7c", color: "#e5e2e1",
    padding: "10px 0", fontSize: 16, outline: "none", boxSizing: "border-box" as const,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#d4c4b0", display: "block", marginBottom: 8,
  };

  return (
    <section id="iletisim" className="py-20 md:py-32 px-5 md:px-16" style={{ backgroundColor: "#0e0e0e" }}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* İletişim bilgileri */}
          <div className="flex flex-col justify-between p-8 md:p-12" style={{ backgroundColor: "#131313", border: "1px solid #262626" }}>
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-8" style={{ lineHeight: 1.2, color: "#e5e2e1" }}>Bizimle İletişime Geçin</h2>
              <div className="flex flex-col gap-8">
                {[
                  { icon: "location_on", label: "ADRES", text: "Levent, Büyükdere Cd. No:123\nİstanbul, Türkiye" },
                  { icon: "call", label: "TELEFON", text: "+90 (212) 555 0123" },
                  { icon: "mail", label: "E-POSTA", text: "info@sarduninsaat.com" },
                ].map((c) => (
                  <div key={c.label} className="flex gap-4">
                    <span className="material-symbols-outlined" style={{ color: "#f9bc51" }}>{c.icon}</span>
                    <div>
                      <p className="mb-1" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d4c4b0", margin: "0 0 4px 0" }}>{c.label}</p>
                      <p style={{ fontSize: 17, lineHeight: 1.6, color: "#e5e2e1", margin: 0, whiteSpace: "pre-line" }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10">
              <button className="flex items-center gap-2" style={{ backgroundColor: "#25D366", color: "white", padding: "16px 28px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                <span className="material-symbols-outlined">chat</span>
                WHATSAPP DESTEK
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12" style={{ backgroundColor: "#201f1f", border: "1px solid #262626" }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div><label style={labelStyle}>AD SOYAD</label><input type="text" placeholder="İsminizi yazın" style={inputStyle} /></div>
              <div><label style={labelStyle}>TELEFON</label><input type="tel" placeholder="+90 5XX XXX XX XX" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>KONU</label>
                <select style={{ ...inputStyle, appearance: "none" }}>
                  {["Hizmet Talebi", "Proje Ortaklığı", "Teknik Danışmanlık", "Diğer"].map(t => (
                    <option key={t} style={{ backgroundColor: "#131313" }}>{t}</option>
                  ))}
                </select>
              </div>
              <div><label style={labelStyle}>MESAJ</label><textarea rows={4} placeholder="Projeniz hakkında detay verin" style={{ ...inputStyle, resize: "none" }} /></div>
              <button type="submit" className="w-full font-bold" style={{ backgroundColor: "#c9922a", color: "#472f00", padding: "18px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                GÖNDER
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
