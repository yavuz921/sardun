export default function Logo({ size = 1 }: { size?: number }) {
  const w = 420 * size;
  const h = 160 * size;
  return (
    <svg viewBox="0 0 420 160" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="160" fill="transparent" />

      {/* S kutusu */}
      <rect x="20" y="30" width="80" height="100" fill="#c9922a" fillOpacity="0.08" />
      <rect x="20" y="30" width="4" height="100" fill="#c9922a" />
      <text x="60" y="105"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="72"
        fontWeight="700"
        fill="#f9bc51"
        textAnchor="middle">S</text>

      {/* SARDUN yazısı */}
      <text x="118" y="96"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="44"
        fontWeight="700"
        letterSpacing="6"
        fill="#e5e2e1">SARDUN</text>

      {/* Alt çizgi */}
      <line x1="118" y1="108" x2="400" y2="108" stroke="#c9922a" strokeWidth="1.5" />

      {/* İNŞAAT etiketi */}
      <text x="118" y="128"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="9"
        fill="#9c8f7c">İNŞAAT</text>
    </svg>
  );
}
