import { Handle, Position } from '@xyflow/react'

// 4 стороны × {source, target} = 8 невидимых хендлов.
// Существуют только как точки крепления рёбер (по id == имя стороны),
// чтобы стрелки выходили/входили в правильную грань ноды.
const SIDES = [
  ['top', Position.Top],
  ['right', Position.Right],
  ['bottom', Position.Bottom],
  ['left', Position.Left],
]

const hidden = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  border: 'none',
  background: 'transparent',
  pointerEvents: 'none',
}

export default function SideHandles() {
  return (
    <>
      {SIDES.map(([id, position]) => (
        <span key={id}>
          <Handle type="source" id={id} position={position} style={hidden} isConnectable={false} />
          <Handle type="target" id={id} position={position} style={hidden} isConnectable={false} />
        </span>
      ))}
    </>
  )
}
