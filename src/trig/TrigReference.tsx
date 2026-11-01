import { useState } from 'react'
import { Tex } from '../components/Tex'
import { exactTrig, fmt, radLatex, toDeg, toRad } from './trigMath'

const ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360]

const IDENTITIES: [string, string[]][] = [
  ['Fundamentale', [
    '\\sin^2 x + \\cos^2 x = 1',
    '\\operatorname{tg} x = \\frac{\\sin x}{\\cos x},\\quad \\operatorname{ctg} x = \\frac{\\cos x}{\\sin x}',
    '\\operatorname{tg} x \\cdot \\operatorname{ctg} x = 1',
    '1 + \\operatorname{tg}^2 x = \\frac{1}{\\cos^2 x}',
  ]],
  ['Reducere la primul cadran', [
    '\\sin(\\pi - x) = \\sin x,\\quad \\cos(\\pi - x) = -\\cos x',
    '\\sin(\\pi + x) = -\\sin x,\\quad \\cos(\\pi + x) = -\\cos x',
    '\\sin\\left(\\frac{\\pi}{2} - x\\right) = \\cos x,\\quad \\cos\\left(\\frac{\\pi}{2} - x\\right) = \\sin x',
    '\\sin(-x) = -\\sin x,\\quad \\cos(-x) = \\cos x',
  ]],
  ['Sume și diferențe', [
    '\\sin(a \\pm b) = \\sin a \\cos b \\pm \\cos a \\sin b',
    '\\cos(a \\pm b) = \\cos a \\cos b \\mp \\sin a \\sin b',
    '\\operatorname{tg}(a \\pm b) = \\frac{\\operatorname{tg} a \\pm \\operatorname{tg} b}{1 \\mp \\operatorname{tg} a \\operatorname{tg} b}',
  ]],
  ['Unghi dublu și unghi pe jumătate', [
    '\\sin 2x = 2 \\sin x \\cos x',
    '\\cos 2x = \\cos^2 x - \\sin^2 x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x',
    '\\operatorname{tg} 2x = \\frac{2\\operatorname{tg} x}{1 - \\operatorname{tg}^2 x}',
    '\\sin^2 \\frac{x}{2} = \\frac{1 - \\cos x}{2},\\quad \\cos^2 \\frac{x}{2} = \\frac{1 + \\cos x}{2}',
  ]],
  ['Transformarea sumelor în produse', [
    '\\sin a + \\sin b = 2 \\sin\\frac{a+b}{2} \\cos\\frac{a-b}{2}',
    '\\sin a - \\sin b = 2 \\sin\\frac{a-b}{2} \\cos\\frac{a+b}{2}',
    '\\cos a + \\cos b = 2 \\cos\\frac{a+b}{2} \\cos\\frac{a-b}{2}',
    '\\cos a - \\cos b = -2 \\sin\\frac{a+b}{2} \\sin\\frac{a-b}{2}',
  ]],
  ['Ecuații trigonometrice', [
    '\\sin x = a \\Rightarrow x \\in \\{(-1)^k \\arcsin a + k\\pi \\mid k \\in \\mathbb{Z}\\}',
    '\\cos x = a \\Rightarrow x \\in \\{\\pm \\arccos a + 2k\\pi \\mid k \\in \\mathbb{Z}\\}',
    '\\operatorname{tg} x = a \\Rightarrow x \\in \\{\\operatorname{arctg} a + k\\pi \\mid k \\in \\mathbb{Z}\\}',
  ]],
  ['Triunghi', [
    '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
    'a^2 = b^2 + c^2 - 2bc \\cos A',
    '\\mathcal{A} = \\frac{bc \\sin A}{2} = \\sqrt{p(p-a)(p-b)(p-c)}',
    'r = \\frac{\\mathcal{A}}{p},\\quad R = \\frac{abc}{4\\mathcal{A}}',
  ]],
  ['Bisectoarele triunghiului', [
    'l_a = \\frac{2bc\\cos\\frac{A}{2}}{b + c} = \\frac{2}{b + c}\\sqrt{bc\\,p(p-a)}',
    'l_b = \\frac{2ac\\cos\\frac{B}{2}}{a + c} = \\frac{2}{a + c}\\sqrt{ac\\,p(p-b)}',
    'l_c = \\frac{2ab\\cos\\frac{C}{2}}{a + b} = \\frac{2}{a + b}\\sqrt{ab\\,p(p-c)}',
    '\\text{Teorema bisectoarei: } \\frac{BD}{DC} = \\frac{AB}{AC}',
    'p = \\frac{a + b + c}{2}',
  ]],
  ['Medianele triunghiului', [
    'm_a = \\frac{1}{2}\\sqrt{2b^2 + 2c^2 - a^2}',
    'm_b = \\frac{1}{2}\\sqrt{2a^2 + 2c^2 - b^2}',
    'm_c = \\frac{1}{2}\\sqrt{2a^2 + 2b^2 - c^2}',
    'm_a^2 + m_b^2 + m_c^2 = \\frac{3}{4}\\left(a^2 + b^2 + c^2\\right)',
    '\\text{Centrul de greutate: } AG = \\frac{2}{3}\\,m_a, \\quad GA\'= \\frac{1}{3}\\,m_a',
  ]],
]

export default function TrigReference() {
  const [deg, setDeg] = useState('45')
  const [rad, setRad] = useState(String(Math.PI / 4))
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
              if (isFinite(v)) setRad(String(toRad(v)))
            }} />
          </label>
          <span>⇄</span>
          <label>Radiani
            <input value={rad} onChange={(e) => {
              setRad(e.target.value)
              const v = Number(e.target.value.replace(',', '.'))
              if (isFinite(v)) setDeg(fmt(toDeg(v), 6))
            }} />
          </label>
        </div>
        {isFinite(d) && <Tex tex={`${fmt(d, 4)}^\\circ = ${radLatex(d)} \\text{ rad}`} display />}
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
            {list.map((t) => <div key={t} className="identity"><Tex tex={t} display /></div>)}
          </div>
        ))}
      </div>
    </div>
  )
}
