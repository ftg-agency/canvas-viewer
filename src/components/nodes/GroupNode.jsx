import { resolveColor, tint } from '../../lib/colors.js'
import { resolveAsset } from '../../lib/resolveAsset.js'

// Группа — фоновый прямоугольник позади нод, прозрачный для pan
// (pointer-events:none задаётся в CSS .cv-group / .cv-group-wrapper).
export default function GroupNode({ data }) {
  const color = resolveColor(data.color)

  const bg = data.background ? resolveAsset(data.background) : null
  const bgStyle =
    bg?.kind === 'image'
      ? {
          backgroundImage: `url(${bg.url})`,
          backgroundRepeat: data.backgroundStyle === 'repeat' ? 'repeat' : 'no-repeat',
          backgroundSize:
            data.backgroundStyle === 'cover'
              ? 'cover'
              : data.backgroundStyle === 'ratio'
                ? 'contain'
                : 'auto',
          backgroundPosition: 'center',
        }
      : null

  return (
    <div
      className="cv-group"
      style={{
        borderColor: color || 'var(--group-border)',
        background: tint(data.color, 0.08) || 'var(--group-bg)',
        ...bgStyle,
      }}
    >
      {data.label ? (
        <div className="cv-group-label" style={{ color: color || 'var(--text-dim)' }}>
          {data.label}
        </div>
      ) : null}
    </div>
  )
}
