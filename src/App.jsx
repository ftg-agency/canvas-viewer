import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { FiMenu } from 'react-icons/fi'
import { getCanvasList } from './lib/loadCanvases.js'
import Sidebar from './components/Sidebar.jsx'
import CanvasViewer from './components/CanvasViewer.jsx'

export default function App() {
  const files = getCanvasList()
  const [activeFile, setActiveFile] = useState(files[0] ?? null)
  const [menuOpen, setMenuOpen] = useState(false)

  const selectFile = (f) => {
    setActiveFile(f)
    setMenuOpen(false)
  }

  return (
    <div className="app">
      {/* верхняя панель — только на мобильных (CSS: .topbar display none на десктопе) */}
      <header className="topbar">
        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Список файлов"
        >
          <FiMenu />
        </button>
        <span className="topbar-title">{activeFile ?? 'Canvas'}</span>
      </header>

      <Sidebar
        files={files}
        active={activeFile}
        onSelect={selectFile}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

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
