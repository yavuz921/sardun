export default function Logo({ size = 1 }: { size?: number }) {
  const w = 420 * size;
  const h = 160 * size;
  return (
    <svg viewBox="0 0 420 160" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="160" fill="transparent" />
      <rect x="40" y="42" width="4" height="76" fill="#c9922a" />
      <text x="60" y="100"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="56"
        fontWeight="700"
        letterSpacing="14"
        fill="#e5e2e1">SARDUN</text>
      <line x1="60" y1="112" x2="380" y2="112" stroke="#c9922a" strokeWidth="1.5" />
      <text x="380" y="130"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fontWeight="600"
        letterSpacing="6"
        fill="#9c8f7c"
        textAnchor="end">İNŞAAT</text>
    </svg>
  );
}
