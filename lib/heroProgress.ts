// Hero scroll ilerlemesi (0..1) — Canvas dışından yazılır, useFrame içinden okunur.
// Re-render tetiklemez; 3D sahnenin performansı için kasıtlı olarak modül singleton.
export const heroProgress = { value: 0, pointerX: 0, pointerY: 0 };
