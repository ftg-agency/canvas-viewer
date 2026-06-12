import { useCallback, useMemo, useRef } from 'react'

const KEY = (file) => `canvas-viewport:v1:${file}`

function read(file) {
  try {
    const raw = localStorage.getItem(KEY(file))
    if (!raw) return null
    const vp = JSON.parse(raw)
    if (
      typeof vp?.x === 'number' &&
      typeof vp?.y === 'number' &&
      typeof vp?.zoom === 'number'
    ) {
      return vp
    }
  } catch {
    /* битый JSON — игнорируем */
  }
  return null
}

// Запоминает положение/зум для каждого файла отдельно.
// Используется в паре с key={file} на провайдере: каждый файл монтируется заново,
// поэтому saved читается один раз на маунт и подставляется декларативно.
//
// Восстановление — через defaultViewport (мгновенно, без «прыжка» и гонок).
// Первый показ файла (нет сохранённого) — через встроенный проп fitView,
// который, в отличие от ручного instance.fitView() в onInit, корректно
// дожидается измерения нод.
export function useViewportPersistence(file) {
  const saved = useMemo(() => read(file), [file])
  const timerRef = useRef(null)

  const onMoveEnd = useCallback(
    (_event, viewport) => {
      if (!viewport) return
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(KEY(file), JSON.stringify(viewport))
        } catch {
          /* приватный режим / переполнение — молча игнорируем */
        }
      }, 300)
    },
    [file],
  )

  const viewportProps = saved
    ? { defaultViewport: saved }
    : { fitView: true, fitViewOptions: { padding: 0.15 } }

  return { viewportProps, onMoveEnd }
}
