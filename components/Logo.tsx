import Image from "next/image";

/*
  Gerçek Sardun logosu (kartvizitten çıkarılmış, arka planı temizlenmiş).
  variant="light" → beyaz logo (koyu zemin), variant="dark" → lacivert logo (açık zemin)
*/
export default function Logo({
  variant = "light",
  compact = false,
}: {
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const src = variant === "light" ? "/logo-white.png" : "/logo-navy.png";
  const height = compact ? 34 : 44;
  return (
    <Image
      src={src}
      alt="Sardun Mühendislik & Mimarlık"
      width={height * 1.67}
      height={height}
      style={{ height, width: "auto", objectFit: "contain" }}
      priority
      unoptimized
    />
  );
}
