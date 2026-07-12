/*
  SARDUN monogram — açılı S/A birleşimi, kartvizik logosundan uyarlanmış geometrik çizim.
  variant="light" → beyaz (lacivert zemin üzeri), variant="dark" → lacivert (açık zemin üzeri)
*/
export function Monogram({ size = 40, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Üst üçgen tepe (A'nın çatısı) */}
      <path d="M50 2 L88 40 L76 40 L50 15 L24 40 L12 40 Z" fill={color} />
      {/* S'nin üst kolu */}
      <path d="M22 46 L64 46 L64 56 L34 56 L34 64 L22 64 Z" fill={color} />
      {/* S'nin alt kolu */}
      <path d="M36 70 L78 70 L78 88 L66 88 L66 80 L36 80 Z" fill={color} />
      {/* Sol bacak */}
      <path d="M22 70 L32 70 L32 108 L22 108 Z" fill={color} />
      {/* Sağ bacak */}
      <path d="M68 92 L78 92 L78 108 L68 108 Z" fill={color} />
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
  const color = variant === "light" ? "#ffffff" : "#1e3a5f";
  const subColor = variant === "light" ? "rgba(255,255,255,0.65)" : "rgba(30,58,95,0.65)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Monogram size={compact ? 30 : 36} color={color} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{
          fontSize: compact ? 20 : 24, fontWeight: 800, letterSpacing: "0.14em",
          color, fontFamily: "var(--font-inter), sans-serif",
        }}>
          SARDUN
        </span>
        {!compact && (
          <span style={{
            fontSize: 8.5, fontWeight: 600, letterSpacing: "0.24em",
            color: subColor, marginTop: 4, textTransform: "uppercase",
          }}>
            Mühendislik &amp; Mimarlık
          </span>
        )}
      </div>
    </div>
  );
}
