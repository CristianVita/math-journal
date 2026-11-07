// Icons of the drawing tools, used by the board, the notebook and the instruments bar.
// They are drawn in currentColor, so they follow the state of their button (active, disabled).
import type { ReactNode } from 'react'
import { solidStrokes, type SolidId } from '../notebook/solids'

const Dot = ({ x, y, r = 2.2 }: { x: number; y: number; r?: number }) => (
  <circle cx={x} cy={y} r={r} fill="currentColor" stroke="none" />
)

const PEN = <><path d="M4 20l1-4L16 5a2.1 2.1 0 0 1 3 3L8 19z" /><path d="M14 7l3 3" /></>

const ICONS = {
  move: <path d="M6 3l13 9-5.5 1.2L16 19l-2.6 1.3-2.6-5.7L6 18z" />,
  pan: <>
    <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11" />
    <path d="M11 11V4a1.5 1.5 0 0 1 3 0v7" />
    <path d="M14 11V5.5a1.5 1.5 0 0 1 3 0V12" />
    <path d="M17 12V8.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1c-2.5 0-4-.8-5.3-2.2l-3.4-4a1.6 1.6 0 0 1 2.4-2.1L8 16v-4" />
  </>,
  point: <Dot x={12} y={12} r={4} />,
  segment: <><path d="M5 19L19 5" /><Dot x={5} y={19} /><Dot x={19} y={5} /></>,
  line: <><path d="M3 21L21 3" /><path d="M14 3h7v7" /><path d="M3 14v7h7" /></>,
  ray: <><path d="M5 19L21 3" /><path d="M14 3h7v7" /><Dot x={5} y={19} /></>,
  circle: <><circle cx="12" cy="12" r="9" /><Dot x={12} y={12} r={1.8} /></>,
  arc: <><path d="M4 16a8 8 0 0 1 16 0" /><Dot x={4} y={16} /><Dot x={20} y={16} /></>,
  sector: <path d="M5 19H20A15 15 0 0 0 5 4z" fill="currentColor" fillOpacity=".2" />,
  polygon: <>
    <path d="M4 10l9-7 8 7-4 10-11-1z" />
    <Dot x={4} y={10} /><Dot x={13} y={3} /><Dot x={21} y={10} /><Dot x={17} y={20} /><Dot x={6} y={19} />
  </>,
  regular: <path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z" />,
  triangle: <path d="M12 4l10 17H2z" />,
  lineAngle: <>
    <path d="M3 19L21 5" /><path d="M3 5l18 14" />
    <path d="M15.9 8.9a5 5 0 0 1 0 6.2" />
  </>,
  construct: <>
    <path d="M22 20H4L14 6" />
    <path d="M11 20a7 7 0 0 0-2.93-5.7" />
    <circle cx="19" cy="7" r="2.6" />
  </>,
  midpoint: <><path d="M3 12h18" /><path d="M3 8v8" /><path d="M21 8v8" /><Dot x={12} y={12} r={3} /></>,
  perpendicular: <><path d="M3 20h18" /><path d="M12 20V4" /><path d="M12 15h5v5" /></>,
  mediatrix: <>
    <path d="M3 14h18" /><path d="M12 3v18" />
    <path d="M7.5 11.5v5" /><path d="M16.5 11.5v5" />
    <Dot x={3} y={14} /><Dot x={21} y={14} />
  </>,
  parallel: <><path d="M3 18L14 4" /><path d="M10 20L21 6" /></>,
  bisector: <>
    <path d="M3 19h19" /><path d="M3 19L17 5" />
    <path d="M3 19l18-7.5" strokeDasharray="3 2.6" />
  </>,
  intersection: <><path d="M4 20L20 4" /><path d="M4 4l16 16" /><Dot x={12} y={12} r={3.2} /></>,
  text: <><path d="M5 7V4h14v3" /><path d="M12 4v16" /><path d="M9 20h6" /></>,
  pen: PEN,
  solid: <>
    <path d="M4 8h12v12H4z" /><path d="M4 8l4-4h12v12l-4 4" /><path d="M16 8l4-4" />
  </>,
  delete: <>
    <path d="M4 6h16" /><path d="M9 6V3.5h6V6" />
    <path d="M6 6l1 15h10l1-15" />
    <path d="M10 10.5v6" /><path d="M14 10.5v6" />
  </>,
  function: <><path d="M4 3v18h17" /><path d="M7 17c4-1 5-11 13-12" /></>,
  marker: <>
    <path d="M15 3l6 6-9 9-6-6z" />
    <path d="M6 12l-1.5 4.5L7.5 19.5 12 18" />
    <path d="M3 22h10" />
  </>,
  eraser: <>
    <path d="M8 20l-4.6-4.6a2 2 0 0 1 0-2.8l9.2-9.2a2 2 0 0 1 2.8 0l5.2 5.2a2 2 0 0 1 0 2.8L12 20z" />
    <path d="M8.5 7.5l8 8" />
    <path d="M8 20h13" />
  </>,
  ruler: <>
    <path d="M3 16L16 3l5 5L8 21z" />
    <path d="M7 12l2 2" /><path d="M10 9l3 3" /><path d="M13 6l2 2" />
  </>,
  square: <><path d="M4 3v18h18z" /><path d="M8.5 12v4.5H13z" /></>,
  protractor: <>
    <path d="M2 18a10 10 0 0 1 20 0z" />
    <path d="M12 8v3" /><path d="M5 11l2 2" /><path d="M19 11l-2 2" />
    <Dot x={12} y={18} r={1.6} />
  </>,
  compass: <>
    <circle cx="12" cy="6" r="2.2" />
    <path d="M12 3.8V2" />
    <path d="M10.9 8L5 21.5" /><path d="M13.1 8L19 21.5" />
    <path d="M7.5 16a10 10 0 0 0 9 0" />
  </>,
} satisfies Record<string, ReactNode>

export type ToolIconName = keyof typeof ICONS

/** A solid, drawn the way it will look on the sheet. */
export function SolidIcon({ solid }: { solid: SolidId }) {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {solidStrokes(solid, 1.5, 1.5, 16.5, 16.5).map((p, i) => <polyline key={i} points={p.map(([x, y]) => x + ',' + y).join(' ')} />)}
    </svg>
  )
}

export function ToolIcon({ name }: { name: ToolIconName }) {
  return (
    <svg className="tool-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}
