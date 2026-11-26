// Testul 61 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 200–202; every answer here is computed and checked with the book's answers, p. 291).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { graph, pol } from './shapes'

const s3 = Math.sqrt(3), r10 = Math.sqrt(10)

// the absent pupils: L 5, M 21, M 10, J 18, V 5
const absent = [5, 21, 10, 18, 5], k = 0.45 // k: the vertical scale
const bars: Record<string, Pt> = {}
const chains: string[] = []
absent.forEach((v, i) => {
  const x = 2.2 + 2.4 * i
  bars[`b${i}a`] = [x, 0]; bars[`b${i}b`] = [x, v * k]; bars[`b${i}c`] = [x + 0.8, v * k]; bars[`b${i}d`] = [x + 0.8, 0]
  chains.push(`b${i}a-b${i}b-b${i}c-b${i}d`)
})
const levels = [5, 10, 18, 21]
const ticks: Record<string, Pt> = Object.fromEntries(levels.map((v) => [`y${v}`, [0, v * k] as Pt]))
const fig3 = plane({ ...bars, ...ticks, X0: [0, 0], X1: [16, 0], Y0: [0, 0], Y1: [0, 26 * k] }, 160, {
  s: ['X0-X1 Y0-Y1', ...chains].join(' '),
  d: 'y5-b4b y10-b2b y18-b3b y21-b1b',
  l: Object.fromEntries(Object.keys({ ...bars, ...ticks, X0: 0, X1: 0, Y0: 0, Y1: 0 }).map((k) => [k, ''])),
  t: [
    ...['L', 'M', 'M', 'J', 'V'].map((d, i) => ({ at: [2.6 + 2.4 * i, -1.2] as Pt, s: d, anchor: 'middle' as const, size: 10 })),
    ...levels.map((v) => ({ at: [-0.5, v * k - 0.35] as Pt, s: String(v), anchor: 'end' as const, size: 9 })),
    { at: [-0.5, -1.2], s: 'O', anchor: 'end', italic: true, size: 10 },
    { at: [1, 25 * k], s: 'Nr. elevi', anchor: 'start', size: 10 }, { at: [16, -1.2], s: 'Ziua', anchor: 'end', size: 10 },
  ],
})

const fig7 = plane({ A: [0, 0], B: [2, 0], M: [4, 0], C: [6, 0], N: [7, 0], D: [8, 0], E: [12, 0] }, 180, {
  s: 'A-E', dot: 'A B M C N D E', l: { A: 'n', B: 'n', M: 'n', C: 'n', N: 'n', D: 'n', E: 'n' },
})
const f8 = plane({ O: [0, 0], A: [5, 0], B: pol(40, 5), C: pol(90, 5), D: pol(120, 5), E: [-5, 0] }, 150, {
  s: 'E-A', dot: 'O A B C D E', l: { O: 's', A: 'nw', B: 'w', C: 's', D: 'se', E: 'ne' },
  t: [
    { at: [5.4, 0], s: '0°', anchor: 'start', size: 9 }, { at: [-5.4, 0], s: '180°', anchor: 'end', size: 9 },
    { at: [pol(40, 5.5)[0], pol(40, 5.5)[1]], s: '40°', anchor: 'start', size: 9 }, { at: [0, 5.5], s: '90°', anchor: 'middle', size: 9 },
    { at: [pol(120, 5.6)[0], pol(120, 5.6)[1]], s: '120°', anchor: 'end', size: 9 },
  ],
})
const r8 = f8.p.A[0] - f8.p.O[0]
const fig8 = { ...f8, path: [{ d: `M${f8.p.E[0]} ${f8.p.E[1]} A${r8} ${r8} 0 0 1 ${f8.p.A[0]} ${f8.p.A[1]}` }] }
const fig9 = plane({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], M: [6, 3] }, 110, { s: 'A-B-C-D-A A-M', hatch: ['A-B-M'] })
const fig10 = plane({ A: [-s3, 0], B: [0, -1], C: [s3, 0], D: [0, 1] }, 120, { s: 'A-B-C-D-A A-C B-D' })
const fig11 = plane({ O: [0, 0], A: pol(140, 3), B: pol(50, 3) }, 100, { s: 'A-O-B', c: [{ at: 'O', r: 3 }], ra: ['AOB'] })

const fig15 = graph({ A: [0, 1], B: [2, 3], L1: [-2, -1], L2: [3.2, 4.2] }, 110, [-2, 3.5], [-1.5, 4.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'nw', B: 'se' } })
const fig16 = plane({ A: [0, 0], B: [10, 0], C: [10, 5 * s3], D: [5, 5 * s3], E: [2.5, 2.5 * s3] }, 120, { s: 'A-B-C-D-A B-D', ra: ['DCB'], dot: 'E' })
const fig17 = plane({ A: [-5, 0], B: [5, 0], C: [2, 2 * r10], D: [-2, 2 * r10], O: [0, r10] }, 130, { s: 'A-B-C-D-A', c: [{ at: 'O', r: r10 }], dot: 'O' })
const p18: Record<string, P3> = {
  A: [0, 0, 0], B: [4, 0, 0], C: [4, 4, 0], D: [0, 4, 0], M: [0, 0, 4], N: [4, 0, 4], P: [4, 4, 4], Q: [0, 4, 4], O: [2, 2, 0], S: [2, 2, 2],
}
const fig18 = solid(p18, 'A-B-C-D M-N-P-Q A-B-N-M B-C-P-N C-D-Q-P D-A-M-Q', 120, { seg: 'B-D C-M S-O M-B' })

export const M92: EnModel = {
  id: 'en-92',
  title: 'Paralela 45, Testul 61',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 200–202',
  items: [
    { text: 'Cel mai mare număr de forma $\\overline{x2y}$, divizibil cu $9$, este:', choices: ['$929$', '$999$', '$729$', '$927$'], ans: 3 },
    { text: 'Suma numerelor prime din intervalul $(0,\\,13)$ este egală cu:', choices: ['$29$', '$28$', '$41$', '$42$'], ans: 1 },
    {
      text: 'Diagrama alăturată arată numărul elevilor unei școli care au absentat într-o săptămână în care condițiile meteorologice au fost nefavorabile. Cei mai mulți absenți au fost în ziua de:',
      choices: ['luni', 'marți', 'miercuri', 'joi'], ans: 1, fig: fig3,
    },
    { text: 'Se consideră ecuația $x^2-3x+m=0$, având necunoscuta $x$. Una dintre soluțiile ecuației este $x_1=1$. Cea de-a doua soluție a ecuației este:', choices: ['$0$', '$3$', '$2$', '$0{,}5$'], ans: 2 },
    {
      text: 'Se dau numerele reale $a=3\\sqrt{21}-\\sqrt{\\dfrac{7}{3}}-2\\sqrt{\\dfrac{27}{7}}$ și $b=\\left(\\dfrac{\\sqrt{21}}{19}\\right)^{-1}$. Rezultatul calculului $a:b$ este:',
      choices: ['$\\dfrac{722}{21}$', '$\\dfrac{2\\sqrt{21}}{19}$', '$2$', '$1$'], ans: 2,
    },
    {
      text: 'Vasile numără din doi în doi: $1,\\,3,\\,5,\\,7,\\,\\ldots,\\,31$. Nicolae numără din trei în trei: $1,\\,4,\\,7,\\,\\ldots,\\,31$ și observă că exact șase dintre numerele spuse de el au fost rostite și de Vasile. Observația lui Nicolae este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$, $E$ sunt coliniare, în această ordine, astfel încât $AC=BD=CE$. Punctul $M$ este mijlocul segmentului $BC$, iar punctul $N$ este mijlocul segmentului $CD$. Dacă $MN=3$ cm, atunci lungimea segmentului $AE$ este egală cu:',
      choices: ['$12$ cm', '$6$ cm', '$9$ cm', '$10$ cm'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt marcate cinci puncte pe conturul unui raportor. În aceste condiții, diferența dintre măsurile unghiurilor $COE$ și $BOD$ este:',
      choices: ['$10^\\circ$', '$20^\\circ$', '$40^\\circ$', '$170^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată, punctul $M$ este mijlocul laturii $BC$ a pătratului $ABCD$. Aria triunghiului $ABM$ este $13\\text{ cm}^2$. Aria pătratului $ABCD$ este:',
      choices: ['$26\\text{ cm}^2$', '$39\\text{ cm}^2$', '$52\\text{ cm}^2$', '$65\\text{ cm}^2$'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un romb cu $AB=BD$. Sinusul unghiului $BAD$ este:',
      choices: ['$\\dfrac{\\sqrt{3}}{2}$', '$\\dfrac{3}{5}$', '$\\dfrac{\\sqrt{2}}{2}$', '$\\dfrac{1}{2}$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc de centru $O$. Punctele $A$ și $B$ aparțin cercului astfel încât razele $OA$ și $OB$ sunt perpendiculare și lungimea coardei $AB$ este egală cu $4$ cm. Calculând lungimea cercului se obține:',
      choices: ['$16\\pi$ cm', '$8\\pi$ cm', '$4\\pi$ cm', '$4\\sqrt{2}\\pi$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'O bilă sferică are raza de $6$ cm și cântărește $4320$ g. Se topește bila și, folosind tot materialul obținut, se fabrică bile mai mici, având raza de $1$ cm. Masa unei bile mici este:',
      choices: ['$120$ g', '$720$ g', '$144$ g', '$20$ g'], ans: 3,
    },

    {
      text: 'Un teren agricol a fost recoltat în trei zile: $25\\%$ în prima zi, $\\dfrac{7}{15}$ din rest în a doua zi și ultimele $20$ ha în cea de-a treia zi.',
      parts: [
        { pts: 2, text: 'Arată că, în cea de-a treia zi, s-a recoltat de pe $40\\%$ din suprafața terenului.', ans: 'A doua zi: $\\dfrac{7}{15}\\cdot75\\%=35\\%$, deci a treia zi: $100\\%-25\\%-35\\%=40\\%$' },
        { pts: 3, text: 'Determină suprafața întregului teren agricol.', ans: '$40\\%\\cdot S=20$ ha, deci $S=50$ ha' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{2x+1}{x-1}:\\left(1-\\dfrac{3x^2}{1-x^2}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{1}{2},\\,\\dfrac{1}{2},\\,1\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x+1}{2x-1}$, oricare ar fi $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{1}{2},\\,\\dfrac{1}{2},\\,1\\right\\}$.', ans: 'Paranteza este $\\dfrac{1-4x^2}{1-x^2}=\\dfrac{(1-2x)(1+2x)}{(1-x)(1+x)}$, deci $E(x)=\\dfrac{2x+1}{x-1}\\cdot\\dfrac{(1-x)(1+x)}{(1-2x)(1+2x)}=\\dfrac{x+1}{2x-1}$' },
        { pts: 3, text: 'Rezolvă ecuația $E(x)=2$.', ans: '$x+1=4x-2$, deci $x=1$, care nu convine: $S=\\varnothing$' },
      ],
    },
    {
      text: 'Punctele $A(0,\\,1)$ și $B(2,\\,3)$ se află pe reprezentarea grafică a funcției $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$, în sistemul ortogonal $xOy$.',
      parts: [
        { pts: 2, text: 'Află coordonatele mijlocului segmentului $AB$.', ans: '$C(1,\\,2)$' },
        { pts: 3, text: 'Arată că $a=b=1$.', ans: 'Din $f(0)=1$, $b=1$; din $f(2)=3$, $2a+1=3$, deci $a=1$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, triunghiul $ABD$ este echilateral, iar triunghiul $BCD$ este dreptunghic, cu ipotenuza $BD=10$ cm. Punctul $E$ este mijlocul segmentului $AD$, iar dreptele $AB$ și $CD$ sunt paralele.',
      parts: [
        { pts: 2, text: 'Demonstrează că triunghiurile $ABE$ și $DBC$ sunt congruente.', ans: '$CD\\parallel AB$ și $\\sphericalangle BCD=90^\\circ$, deci $\\sphericalangle ABC=90^\\circ$ și $\\sphericalangle CBD=30^\\circ$, de unde $CD=5$ cm $=AE$; $BE\\perp AD$, deci $\\triangle ABE\\equiv\\triangle DBC$ (C.I.: $AB=DB$, $AE=DC$)' },
        { pts: 3, text: 'Determină măsura unghiului format de dreptele $BD$ și $CE$.', ans: '$BE=BC$ și $\\sphericalangle EBD=\\sphericalangle CBD=30^\\circ$, deci în $\\triangle BCE$ isoscel bisectoarea $BD$ este și înălțime: $BD\\perp CE$, unghiul este de $90^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, laturile trapezului isoscel $ABCD$ sunt tangente cercului de centru $O$. Bazele trapezului au lungimile $AB=10$ cm și $CD=4$ cm.',
      parts: [
        { pts: 2, text: 'Arată că lungimea laturii $BC$ este $7$ cm.', ans: 'Tangentele din același punct sunt egale: $BC=\\dfrac{AB}{2}+\\dfrac{CD}{2}=5+2=7$ cm' },
        { pts: 3, text: 'Află lungimea razei cercului.', ans: 'Înălțimea trapezului este $\\sqrt{7^2-3^2}=2\\sqrt{10}$ cm, deci $r=\\sqrt{10}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'Cubul $ABCDMNPQ$ din figura alăturată are muchia $AB=4$ cm. Punctele $O$ și $S$ sunt mijloacele diagonalelor $BD$, respectiv $CM$.',
      parts: [
        { pts: 2, text: 'Arată că măsura unghiului format de planele $(MSB)$ și $(ABC)$ este $45^\\circ$.', ans: '$(MSB)=(MBCQ)$, iar $\\sphericalangle((MBCQ),\\,(ABC))=\\sphericalangle MBA=45^\\circ$' },
        { pts: 3, text: 'Demonstrează că dreapta $SO$ este perpendiculară pe planul $(ABC)$.', ans: '$SO$ este linie mijlocie în $\\triangle MAC$, deci $SO\\parallel MA$; cum $MA\\perp(ABC)$, rezultă $SO\\perp(ABC)$' },
      ],
      fig: fig18,
    },
  ],
}
