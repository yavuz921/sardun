"use client";
import { FormEvent } from "react";

export default function Contact() {
  const handleSubmit = (e: FormEvent) => e.preventDefault();
  const inputStyle = {
    width: "100%", backgroundColor: "transparent", border: "none",
    borderBottom: "1px solid #9c8f7c", color: "#e5e2e1", padding: "8px 0",
    fontSize: 16, outline: "none", boxSizing: "border-box" as const,
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#d4c4b0", display: "block", marginBottom: 8 };

  return (
    <section id="iletisim" className="section-padding" style={{ backgroundColor: "#0e0e0e" }}>
      <div className="container">
        <div className="two-col">
          <div style={{ backgroundColor: "#131313", border: "1px solid #262626", padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h2 className="section-title" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.2, color: "#e5e2e1", margin: "0 0 32px 0" }}>Bizimle İletişime Geçin</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {[
                  { icon: "location_on", label: "ADRES", text: "Levent, Büyükdere Cd. No:123\nİstanbul, Türkiye" },
                  { icon: "call", label: "TELEFON", text: "+90 (212) 555 0123" },
                  { icon: "mail", label: "E-POSTA", text: "info@sarduninsaat.com" },
                ].map((c) => (
                  <div key={c.label} style={{ display: "flex", gap: 16 }}>
                    <span className="material-symbols-outlined" style={{ color: "#f9bc51" }}>{c.icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d4c4b0", margin: "0 0 4px 0" }}>{c.label}</p>
                      <p style={{ fontSize: 18, lineHeight: 1.6, color: "#e5e2e1", margin: 0, whiteSpace: "pre-line" }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 48 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#25D366", color: "white", padding: "16px 32px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                <span className="material-symbols-outlined">chat</span>
                WHATSAPP DESTEK
              </button>
            </div>
          </div>
          <div style={{ backgroundColor: "#201f1f", border: "1px solid #262626", padding: 48 }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
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
              <button type="submit" style={{ backgroundColor: "#c9922a", color: "#472f00", padding: "20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", width: "100%" }}>
                GÖNDER
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
