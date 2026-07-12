/*
  SARDUN monogramı — katlanmış şerit (origami) formunda A/S birleşimi.
  Kartvizit logosundaki 3 tonlu (koyu/orta/açık lacivert) katlı-kağıt hissi
  düz renk polygon katmanlarıyla taklit edilir.
*/
export function Monogram({ size = 40, color = "navy" }: { size?: number; color?: "navy" | "white" }) {
  const tones =
    color === "white"
      ? { dark: "#e7ebef", mid: "#ffffff", light: "#ffffff", edge: "rgba(15,29,46,0.18)" }
      : { dark: "#16293f", mid: "#1e3a5f", light: "#2f5480", edge: "rgba(255,255,255,0.22)" };

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      {/* Sol çatı şeridi (orta ton) */}
      <path d="M50 4 L10 46 L24 50 L50 22 Z" fill={tones.mid} />
      {/* Sağ çatı şeridi (koyu ton) */}
      <path d="M50 4 L90 46 L76 50 L50 22 Z" fill={tones.dark} />
      {/* Üst bindirme çizgisi (kat hissi) */}
      <path d="M50 4 L50 22" stroke={tones.edge} strokeWidth="1.2" />

      {/* Orta çapraz şerit — sol içten sağa iner (açık ton) */}
      <path d="M24 50 L50 22 L62 30 L34 60 Z" fill={tones.light} />
      {/* Orta çapraz şerit — sağ içten sola iner (orta ton) */}
      <path d="M76 50 L50 22 L38 30 L66 60 Z" fill={tones.mid} />

      {/* S gövdesi — üst yatay kıvrım (koyu ton) */}
      <path d="M20 56 L66 56 L66 66 L34 66 L34 74 L20 74 Z" fill={tones.dark} />
      {/* S gövdesi — alt yatay kıvrım (orta ton) */}
      <path d="M34 80 L80 80 L80 90 L48 90 L48 98 L34 98 Z" fill={tones.mid} />

      {/* Sol ayak (koyu ton) */}
      <path d="M20 74 L34 74 L34 112 L20 112 Z" fill={tones.dark} />
      {/* Sağ ayak (açık ton) */}
      <path d="M66 98 L80 98 L80 112 L66 112 Z" fill={tones.light} />
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
