import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { getCanvasList } from './lib/loadCanvases.js'
import Sidebar from './components/Sidebar.jsx'
import CanvasViewer from './components/CanvasViewer.jsx'

export default function App() {
  const files = getCanvasList()
  const [activeFile, setActiveFile] = useState(files[0] ?? null)

  return (
    <div className="app">
      <Sidebar files={files} active={activeFile} onSelect={setActiveFile} />
      <div className="canvas-area">
        {activeFile ? (
          // key={activeFile} -> чистый инстанс React Flow на каждый файл:
          // детерминированный жизненный цикл restore/fitView, без гонок загрузки.
          <ReactFlowProvider key={activeFile}>
            <CanvasViewer file={activeFile} />
          </ReactFlowProvider>
        ) : (
          <div className="cv-empty">
            Положи <code>.canvas</code> файлы в папку <code>/canvases</code> и перезапусти dev-сервер.
          </div>
        )}
      </div>
    </div>
  )
}
