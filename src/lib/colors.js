// Пресеты цветов Obsidian Canvas: color == "1".."6" — это индекс палитры,
// а строка вида "#rrggbb" — произвольный hex. Значения ниже — приближение
// палитры Obsidian, можно подкрутить под свою тему.
const PRESETS = {
  '1': '#e93147', // red
  '2': '#ec7500', // orange
  '3': '#e0ac00', // yellow
  '4': '#08b94e', // green
  '5': '#00bfbc', // cyan
  '6': '#9065c4', // purple
}

export function resolveColor(c) {
  if (!c) return undefined
  return c.startsWith('#') ? c : PRESETS[c]
}

// Полупрозрачная заливка (для фона групп / тонировки).
export function tint(c, alpha = 0.12) {
  const hex = resolveColor(c)
  if (!hex || hex.length < 7) return undefined
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
