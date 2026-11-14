import { useState } from 'react'
import { Tex } from '../components/Tex'
import MathText from '../components/MathText'
import { exactTrig, fmt, radLatex, toDeg, toRad } from './trigMath'
import { IDENTITIES } from './formulas'

// all the remarkable angles of the circle, the whole turn (210°–330° added on 12 November 2026, for the baccalaureate)
const ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360]

/** A number as written in Romanian, with the decimal comma. */
const ro = (v: number, digits: number) => fmt(v, digits).replace('.', ',')

export default function TrigReference() {
  const [deg, setDeg] = useState('45')
  // a few decimals, not the 16 digits of the computer (12 November 2026)
  const [rad, setRad] = useState(ro(Math.PI / 4, 4))
  const d = Number(deg.replace(',', '.'))

  return (
    <div className="trig-ref">
      <div className="card">
        <div className="card-title">Convertor grade ↔ radiani</div>
        <div className="field-row">
          <label>Grade
            <input value={deg} onChange={(e) => {
              setDeg(e.target.value)
              const v = Number(e.target.value.replace(',', '.'))
              if (isFinite(v)) setRad(ro(toRad(v), 4))
            }} />
          </label>
          <span>⇄</span>
          <label>Radiani
            <input value={rad} onChange={(e) => {
              setRad(e.target.value)
              const v = Number(e.target.value.replace(',', '.'))
              if (isFinite(v)) setDeg(ro(toDeg(v), 4))
            }} />
          </label>
        </div>
        {isFinite(d) && <Tex tex={`${ro(d, 4).replace(',', '{,}')}^\\circ = ${radLatex(d)} \\text{ rad} \\approx ${ro(toRad(d), 4).replace(',', '{,}')}`} display />}
      </div>

      <div className="card">
        <div className="card-title">Valori remarcabile</div>
        <div className="table-wrap">
          <table className="trig-table">
            <thead>
              <tr>
                <th><Tex tex="x" /></th>
                {ANGLES.map((a) => <th key={a}><Tex tex={`${a}^\\circ`} /><br /><Tex tex={radLatex(a)} /></th>)}
              </tr>
            </thead>
            <tbody>
              {(['sin', 'cos', 'tg', 'ctg'] as const).map((f) => (
                <tr key={f}>
                  <th><Tex tex={f === 'sin' || f === 'cos' ? `\\${f}` : `\\operatorname{${f}}`} /></th>
                  {ANGLES.map((a) => {
                    const e = exactTrig(a)!
                    const v = e[f]
                    return <td key={a}><Tex tex={v ?? '\\nexists'} /></td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="identities">
        {IDENTITIES.map(([title, list]) => (
          <div key={title} className="card">
            <div className="card-title">{title}</div>
            {list.map((t) => (t.includes('$')
              ? <MathText key={t} text={t} className="identity-note" />
              // several formulas on one line (",\quad" between them) go on separate lines when the card is narrow
              : t.includes(',\\quad ')
                ? <div key={t} className="identity identity-parts">{t.split(',\\quad ').map((p, i, all) => <Tex key={i} tex={`\\displaystyle ${p}${i < all.length - 1 ? ',' : ''}`} />)}</div>
                : <div key={t} className="identity"><Tex tex={t} display /></div>))}
          </div>
        ))}
      </div>
    </div>
  )
}
