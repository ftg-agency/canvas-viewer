import { mdFiles, assetFiles } from './loadCanvases.js'

const IMAGE_RE = /\.(png|jpe?g|gif|webp|svg)$/i
const PDF_RE = /\.pdf$/i
const MD_RE = /\.md$/i

// node.file — vault-относительный путь ("Attachments/x.png").
// glob-ключи абсолютны от корня проекта ("/canvases/Attachments/x.png").
// Поэтому матчим по суффиксу.
function findBySuffix(map, file) {
  const norm = file.replace(/^\/+/, '')
  const key = Object.keys(map).find(
    (k) => k.endsWith('/' + norm) || k.endsWith(norm),
  )
  return key ? map[key] : null
}

// -> { kind: 'image'|'pdf'|'md'|'other', url?, raw?, name }
export function resolveAsset(file) {
  if (!file) return { kind: 'other', name: file }
  const name = file.split('/').pop()

  if (IMAGE_RE.test(file)) {
    const url = findBySuffix(assetFiles, file)
    return url ? { kind: 'image', url, name } : { kind: 'other', name }
  }
  if (PDF_RE.test(file)) {
    const url = findBySuffix(assetFiles, file)
    return url ? { kind: 'pdf', url, name } : { kind: 'other', name }
  }
  if (MD_RE.test(file)) {
    const raw = findBySuffix(mdFiles, file)
    return raw != null ? { kind: 'md', raw, name } : { kind: 'other', name }
  }
  return { kind: 'other', name }
}
