import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SideHandles from './SideHandles.jsx'
import { resolveColor } from '../../lib/colors.js'

export default function TextNode({ data }) {
  const color = resolveColor(data.color)
  return (
    <div className="cv-node cv-text" style={{ borderColor: color || 'var(--node-border)' }}>
      <SideHandles />
      <div className="cv-md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.text || ''}</ReactMarkdown>
      </div>
    </div>
  )
}
