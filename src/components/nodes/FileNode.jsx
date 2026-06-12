import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiFile } from 'react-icons/fi'
import SideHandles from './SideHandles.jsx'
import { resolveColor } from '../../lib/colors.js'
import { resolveAsset } from '../../lib/resolveAsset.js'

export default function FileNode({ data }) {
  const color = resolveColor(data.color)
  const asset = resolveAsset(data.file)

  let body
  if (asset.kind === 'image') {
    body = <img className="cv-img" src={asset.url} alt={asset.name} />
  } else if (asset.kind === 'pdf') {
    body = <iframe className="cv-pdf" src={asset.url + '#toolbar=0'} title={asset.name} />
  } else if (asset.kind === 'md') {
    body = (
      <div className="cv-md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{asset.raw}</ReactMarkdown>
      </div>
    )
  } else {
    // graceful degradation: путь не нашёлся / тип не поддержан
    body = (
      <div className="cv-chip">
        <FiFile />
        <span title={data.file}>{asset.name || data.file || 'файл'}</span>
      </div>
    )
  }

  return (
    <div className="cv-node cv-file" style={{ borderColor: color || 'var(--node-border)' }}>
      <SideHandles />
      {body}
    </div>
  )
}
