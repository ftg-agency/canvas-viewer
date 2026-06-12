import { useMemo } from 'react'
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import { getCanvas } from '../lib/loadCanvases.js'
import { mapToReactFlow } from '../lib/mapToReactFlow.js'
import { useViewportPersistence } from '../hooks/useViewportPersistence.js'
import TextNode from './nodes/TextNode.jsx'
import FileNode from './nodes/FileNode.jsx'
import LinkNode from './nodes/LinkNode.jsx'
import GroupNode from './nodes/GroupNode.jsx'

const nodeTypes = {
  canvasText: TextNode,
  canvasFile: FileNode,
  canvasLink: LinkNode,
  canvasGroup: GroupNode,
}

export default function CanvasViewer({ file }) {
  const { viewportProps, onMoveEnd } = useViewportPersistence(file)

  const { nodes, edges, error } = useMemo(() => {
    try {
      const canvas = getCanvas(file)
      if (!canvas) return { nodes: [], edges: [], error: `Файл «${file}» не найден` }
      return { ...mapToReactFlow(canvas), error: null }
    } catch (e) {
      return { nodes: [], edges: [], error: e.message }
    }
  }, [file])

  if (error) return <div className="cv-error">⚠️ {error}</div>

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      {...viewportProps}
      onMoveEnd={onMoveEnd}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      panOnScroll={false}
      zoomOnScroll
      zoomOnPinch
      zoomOnDoubleClick={false}
      minZoom={0.05}
      maxZoom={4}
    >
      <Background variant="dots" gap={20} size={1} />
      <Controls showInteractive={false} />
      <MiniMap pannable zoomable />
    </ReactFlow>
  )
}
