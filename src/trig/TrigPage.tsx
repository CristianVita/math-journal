import { useState } from 'react'
import type { Scene } from '../geometry/types'
import UnitCircle from './UnitCircle'
import TrigPlotter from './TrigPlotter'
import TriangleSolver from './TriangleSolver'
import TrigReference from './TrigReference'

const TABS = [
  { id: 'circle', title: 'Cercul trigonometric' },
  { id: 'plot', title: 'Grafice' },
  { id: 'triangle', title: 'Rezolvarea triunghiului' },
  { id: 'ref', title: 'Formule și tabel' },
] as const

export default function TrigPage({ onOpenInBoard }: { onOpenInBoard?: (s: Scene) => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('circle')
  return (
    <div className="page">
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={'tab' + (t.id === tab ? ' active' : '')} onClick={() => setTab(t.id)}>{t.title}</button>
        ))}
      </div>
      {tab === 'circle' && <UnitCircle />}
      {tab === 'plot' && <TrigPlotter />}
      {tab === 'triangle' && <TriangleSolver onOpenInBoard={onOpenInBoard} />}
      {tab === 'ref' && <TrigReference />}
    </div>
  )
}
