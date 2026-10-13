// Евклидова норма вектора ‖v‖₂
export const norm2 = (v) => Math.sqrt(v.reduce((s, a) => s + a * a, 0));
