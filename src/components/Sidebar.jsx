import { FiGrid, FiX } from 'react-icons/fi'

export default function Sidebar({ files, active, onSelect, open, onClose }) {
  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <FiGrid /> Canvas
        </h1>
        <button className="sidebar-close" onClick={onClose} aria-label="Закрыть">
          <FiX />
        </button>
      </div>
      <nav className="sidebar-list">
        {files.map((f) => (
          <button
            key={f}
            className={'sidebar-item' + (f === active ? ' is-active' : '')}
            onClick={() => onSelect(f)}
            title={f}
          >
            {f}
          </button>
        ))}
        {files.length === 0 && <p className="sidebar-empty">Нет .canvas файлов</p>}
      </nav>
    </aside>
  )
}
