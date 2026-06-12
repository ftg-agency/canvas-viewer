import { FiExternalLink, FiGlobe } from 'react-icons/fi'
import SideHandles from './SideHandles.jsx'
import { resolveColor } from '../../lib/colors.js'

function hostOf(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function favicon(url) {
  try {
    const host = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${host}&sz=32`
  } catch {
    return null
  }
}

export default function LinkNode({ data }) {
  const color = resolveColor(data.color)
  const fav = favicon(data.url)
  return (
    <div className="cv-node cv-link" style={{ borderColor: color || 'var(--node-border)' }}>
      <SideHandles />
      <a className="cv-link-card" href={data.url} target="_blank" rel="noopener noreferrer">
        {fav ? <img className="cv-fav" src={fav} alt="" /> : <FiGlobe />}
        <span className="cv-link-host">{hostOf(data.url)}</span>
        <FiExternalLink className="cv-link-ext" />
      </a>
    </div>
  )
}
