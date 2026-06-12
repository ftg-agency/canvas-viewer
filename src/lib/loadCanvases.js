// Build-time обнаружение контента через import.meta.glob.
//   .canvas / .md   -> инлайнятся как raw-строки  (query: '?raw')
//   картинки / PDF  -> хешированные URL          (query: '?url', учитывают base)
// Любой новый файл в /canvases подхватывается автоматически при сборке —
// править код для нового канваса не нужно.

const canvasMods = import.meta.glob('/canvases/**/*.canvas', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const mdMods = import.meta.glob('/canvases/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const assetMods = import.meta.glob('/canvases/**/*.{png,jpg,jpeg,gif,webp,svg,pdf}', {
  query: '?url',
  import: 'default',
  eager: true,
})

function baseName(path) {
  return path.split('/').pop().replace(/\.canvas$/i, '')
}

// { '<имя файла без .canvas>': { path, raw } }
const canvases = {}
for (const [path, raw] of Object.entries(canvasMods)) {
  canvases[baseName(path)] = { path, raw }
}

export function getCanvasList() {
  return Object.keys(canvases).sort((a, b) => a.localeCompare(b, 'ru'))
}

export function getCanvas(name) {
  const entry = canvases[name]
  if (!entry) return null
  try {
    return JSON.parse(entry.raw)
  } catch (e) {
    throw new Error(`Не удалось распарсить ${entry.path}: ${e.message}`)
  }
}

// Карты для резолвинга file-нод. Ключ — полный glob-путь ('/canvases/...').
export const mdFiles = mdMods
export const assetFiles = assetMods
