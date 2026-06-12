import { FiGrid } from 'react-icons/fi'

export default function Sidebar({ files, active, onSelect }) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">
        <FiGrid /> Canvas
      </h1>
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
