import { MarkerType } from '@xyflow/react'
import { resolveColor } from './colors.js'

const TYPE_MAP = {
  text: 'canvasText',
  file: 'canvasFile',
  link: 'canvasLink',
  group: 'canvasGroup',
}

// Чистая функция: JSON Canvas -> { nodes, edges } для React Flow.
export function mapToReactFlow(canvas) {
  const rawNodes = canvas?.nodes ?? []
  const rawEdges = canvas?.edges ?? []

  const nodes = rawNodes.map((n, i) => {
    const isGroup = n.type === 'group'
    const w = n.width ?? 200
    const h = n.height ?? 100
    return {
      id: n.id,
      type: TYPE_MAP[n.type] ?? 'canvasText',
      // Canvas и React Flow используют одну систему координат (top-left, y вниз, px).
      position: { x: n.x ?? 0, y: n.y ?? 0 },
      width: w,
      height: h,
      style: { width: w, height: h },
      // Группы — позади (фон), остальные ноды — поверх в порядке объявления.
      zIndex: isGroup ? 0 : i + 10,
      className: isGroup ? 'cv-group-wrapper' : undefined,
      selectable: false,
      draggable: false,
      connectable: false,
      data: {
        type: n.type,
        text: n.text,
        file: n.file,
        subpath: n.subpath,
        url: n.url,
        label: n.label,
        background: n.background,
        backgroundStyle: n.backgroundStyle,
        color: n.color,
      },
    }
  })

  const edges = rawEdges.map((e) => {
    // Спека: toEnd по умолчанию 'arrow', fromEnd — 'none'. Обрабатываем именно отсутствие поля.
    const fromEnd = e.fromEnd ?? 'none'
    const toEnd = e.toEnd ?? 'arrow'
    const stroke = resolveColor(e.color)
    return {
      id: e.id,
      source: e.fromNode,
      target: e.toNode,
      // Стороны нод -> id хендлов ('top'|'right'|'bottom'|'left').
      sourceHandle: e.fromSide,
      targetHandle: e.toSide,
      label: e.label,
      type: 'default',
      markerStart:
        fromEnd === 'arrow' ? { type: MarkerType.ArrowClosed, color: stroke } : undefined,
      markerEnd:
        toEnd === 'arrow' ? { type: MarkerType.ArrowClosed, color: stroke } : undefined,
      style: { stroke: stroke || undefined, strokeWidth: 2 },
      labelStyle: { fill: 'var(--text)', fontSize: 12 },
      labelBgStyle: { fill: 'var(--node-bg)', fillOpacity: 0.85 },
    }
  })

  return { nodes, edges }
}
