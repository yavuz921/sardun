/*
  SARDUN monogramı — sade, temiz, 3 yüzeyli prizmatik "çatı/ok" formu.
  Kartvizit logosundaki en güçlü unsur olan yukarı-ok/çatı silüetine sadık,
  tek parça ve minimal — karmaşık iç detaylardan arındırılmış.
*/
export function Monogram({ size = 40, color = "navy" }: { size?: number; color?: "navy" | "white" }) {
  const tones =
    color === "white"
      ? { left: "#ffffff", right: "#e7ebef", edge: "#c7d0d8" }
      : { left: "#1e3a5f", right: "#16293f", edge: "#2f5480" };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Sol yüz */}
      <path d="M50 6 L12 60 L46 60 L50 34 Z" fill={tones.left} />
      {/* Sağ yüz */}
      <path d="M50 6 L88 60 L54 60 L50 34 Z" fill={tones.right} />
      {/* Orta kat çizgisi — ince ışık payı, prizma hissi */}
      <path d="M50 6 L50 34" stroke={tones.edge} strokeWidth="1.4" strokeLinecap="round" />
      {/* Taban çizgisi */}
      <path d="M12 60 L88 60" stroke={tones.edge} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export default function Logo({
  variant = "light",
  compact = false,
}: {
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const textColor = variant === "light" ? "#ffffff" : "#16293f";
  const subColor = variant === "light" ? "rgba(255,255,255,0.6)" : "rgba(22,41,63,0.6)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Monogram size={compact ? 28 : 34} color={variant === "light" ? "white" : "navy"} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontSize: compact ? 19 : 23,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: textColor,
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          SARDUN
        </span>
        {!compact && (
          <span
            style={{
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: subColor,
              marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            Mühendislik &amp; Mimarlık
          </span>
        )}
      </div>
    </div>
  );
}
