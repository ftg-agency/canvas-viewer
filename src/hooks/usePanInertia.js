import { useCallback, useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'

// Небольшая инерция панорамирования. Своего инерционного pan у React Flow нет,
// поэтому делаем сами: на onMove копим скорость, на onMoveEnd (отпускание)
// запускаем requestAnimationFrame-цикл с трением, который «доводит» viewport
// через setViewport до плавной остановки.
const FRICTION = 0.84 // множитель скорости за ~16мс (меньше → короче глайд)
const MAX_SPEED = 3 // px/мс — ограничение силы «броска»
const MIN_START = 0.05 // ниже этой скорости инерции нет (спокойный отпуск)
const MIN_STOP = 0.02 // скорость, на которой глайд останавливаем
const IDLE_MS = 90 // если перед отпусканием была пауза — без инерции

// onRest(viewport) вызывается в момент реальной остановки (после глайда либо
// сразу, если инерции нет) — туда удобно повесить сохранение позиции.
export function usePanInertia(onRest) {
  const { setViewport } = useReactFlow()
  const last = useRef(null) // { x, y, zoom, t }
  const vel = useRef({ x: 0, y: 0 })
  const lastMoveT = useRef(0)
  const animating = useRef(false)
  const raf = useRef(0)

  const cancel = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = 0
    animating.current = false
  }, [])

  // остановить глайд при размонтировании (смена файла)
  useEffect(() => cancel, [cancel])

  const onMoveStart = useCallback(() => {
    // новый жест — гасим текущий глайд и начинаем мерить скорость заново
    cancel()
    last.current = null
    vel.current = { x: 0, y: 0 }
  }, [cancel])

  const onMove = useCallback((_event, vp) => {
    if (animating.current || !vp) return // это наше же движение — не семплируем
    const t = performance.now()
    const prev = last.current
    if (prev) {
      const dt = t - prev.t
      if (dt > 0) {
        if (Math.abs(vp.zoom - prev.zoom) > 1e-3) {
          // меняется зум, а не позиция — инерцию не копим
          vel.current = { x: 0, y: 0 }
        } else {
          const vx = (vp.x - prev.x) / dt
          const vy = (vp.y - prev.y) / dt
          const a = 0.6 // экспоненциальное сглаживание шума
          vel.current = {
            x: a * vx + (1 - a) * vel.current.x,
            y: a * vy + (1 - a) * vel.current.y,
          }
          lastMoveT.current = t
        }
      }
    }
    last.current = { x: vp.x, y: vp.y, zoom: vp.zoom, t }
  }, [])

  const onMoveEnd = useCallback(
    (_event, vp) => {
      if (animating.current || !vp) return
      let { x: vx, y: vy } = vel.current
      // пауза перед отпусканием → без «броска»
      if (performance.now() - lastMoveT.current > IDLE_MS) {
        vx = 0
        vy = 0
      }
      const speed = Math.hypot(vx, vy)
      if (speed < MIN_START) {
        onRest?.(vp)
        return
      }
      if (speed > MAX_SPEED) {
        const k = MAX_SPEED / speed
        vx *= k
        vy *= k
      }

      animating.current = true
      let prevT = performance.now()
      let cx = vp.x
      let cy = vp.y
      const zoom = vp.zoom
      const step = (t) => {
        const dt = Math.min(t - prevT, 32)
        prevT = t
        cx += vx * dt
        cy += vy * dt
        const decay = Math.pow(FRICTION, dt / 16) // трение, независимое от FPS
        vx *= decay
        vy *= decay
        setViewport({ x: cx, y: cy, zoom }, { duration: 0 })
        if (Math.hypot(vx, vy) > MIN_STOP) {
          raf.current = requestAnimationFrame(step)
        } else {
          animating.current = false
          raf.current = 0
          onRest?.({ x: cx, y: cy, zoom })
        }
      }
      raf.current = requestAnimationFrame(step)
    },
    [setViewport, onRest],
  )

  return { onMoveStart, onMove, onMoveEnd }
}
