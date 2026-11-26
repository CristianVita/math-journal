// Testul 63 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 204–206; every answer here is computed and checked with the book's answers, p. 291).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

// the noon temperatures of two weeks: 26 °C once, 28 °C once, 30 °C on 7 days, 34 °C on 5 days
const temps = [26, 28, 30, 34], days = [1, 1, 7, 5]
const bars: Record<string, Pt> = {}
const chains: string[] = []
temps.forEach((t, i) => {
  const x = t - 24
  bars[`b${i}a`] = [x - 0.3, 0]; bars[`b${i}b`] = [x - 0.3, days[i]]; bars[`b${i}c`] = [x + 0.3, days[i]]; bars[`b${i}d`] = [x + 0.3, 0]
  chains.push(`b${i}a-b${i}b-b${i}c-b${i}d`)
})
const ticks: Record<string, Pt> = { y1: [0, 1], y3: [0, 3], y5: [0, 5], y7: [0, 7] }
const fig2 = plane({ ...bars, ...ticks, X0: [0, 0], X1: [13, 0], Y0: [0, 0], Y1: [0, 9] }, 160, {
  s: ['X0-X1 Y0-Y1', ...chains].join(' '),
  d: 'y1-b1b y5-b3b y7-b2b',
  l: Object.fromEntries(Object.keys({ ...bars, ...ticks, X0: 0, X1: 0, Y0: 0, Y1: 0 }).map((k) => [k, ''])),
  t: [
    ...temps.map((t) => ({ at: [t - 24, -0.9] as Pt, s: String(t), anchor: 'middle' as const, size: 9 })),
    ...[1, 3, 5, 7].map((v) => ({ at: [-0.3, v - 0.25] as Pt, s: String(v), anchor: 'end' as const, size: 9 })),
    { at: [-0.3, -0.9], s: 'O', anchor: 'end', italic: true, size: 10 },
    { at: [0.5, 8.4], s: 'Nr. zile', anchor: 'start', size: 10 }, { at: [13, -1.9], s: 'Temperatura (°C)', anchor: 'end', size: 9 },
  ],
})

const fig7 = plane({ A: [0, 0], B: [1.2, 0], C: [4, 0], D: [7, 0] }, 150, { s: 'A-D', dot: 'A B C D', l: { A: 's', B: 's', C: 's', D: 's' } })
const fig8 = plane({ O: [0, 0], A: pol(155, 6), M: pol(125, 6), P: pol(95, 5), Q: pol(45, 5), N: pol(25, 6), B: pol(5, 6) }, 130, {
  s: 'O-A O-M O-P O-Q O-N O-B', l: { O: 's' },
})
const fig9 = plane({ A: [0, 0], B: [3, 0], C: [3, 3], D: [0, 3], E: [0, 2], F: [3, 2], G: [1, 3], H: [1, 2], K: [2, 3], L: [2, 0], M: [2, 1], N: [3, 1] }, 110, {
  s: 'A-B-C-D-A E-F G-H K-L M-N', hatch: ['L-B-N-M'], l: { E: '', F: '', G: '', H: '', K: '', L: '', M: '', N: '' },
})
const fig10 = plane({ T: [0, 8], T0: [0, 0], S: [10, 4.8], S0: [10, 0], A: [25, 0] }, 170, {
  s: 'T-A T0-T S0-S T0-A', l: { T: '', T0: '', S: '', S0: '', A: 'e' },
  t: [{ at: [5, -1.6], s: '10 m', anchor: 'middle', size: 10 }, { at: [17.5, -1.6], s: '15 m', anchor: 'middle', size: 10 }],
})
const fig11 = plane({ O: [0, 0], A: [-4, 0], B: [4, 0], N: pol(220, 4), M: pol(320, 4) }, 110, { s: 'A-B N-M A-N N-O', c: [{ at: 'O', r: 4 }], dot: 'O', l: { O: 'n' } })
const fig12 = solid(box(6, 4, 3.5), BOX, 120)

const fig15 = graph({ L1: [-1.5, -2], L2: [1.75, 4.5] }, 100, [-2.5, 2.5], [-2.5, 5], { s: 'L1-L2', l: { L1: '', L2: '' } })
const fig16 = plane({ A: [0, 6 * s3], B: [-3, 3 * s3], C: [0, 0], D: [3, 3 * s3], E: [-6, 0] }, 130, { s: 'A-B-C-D-A A-E-C B-C' })
const pts17: Record<string, Pt> = { O: [0, 0], A: pol(90, 4), B: pol(18, 4), C: pol(-54, 4), D: pol(-126, 4), E: pol(162, 4) }
const fig17 = plane({ ...pts17, T: meet(pts17.A, pts17.C, pts17.B, pts17.D) }, 110, { s: 'A-C B-D', c: [{ at: 'O', r: 4 }], dot: 'A B C D E', l: { O: '' } })
const h18 = 4 * s3
const p18: Record<string, P3> = { A: [0, 0, 0], Z: [0, 8, 0], O: [0, 4, h18], R: [12, 0, 0], E: [12, 8, 0], L: [12, 4, h18], M: [12, 6, h18 / 2] }
const fig18 = solid(p18, 'A-Z-O R-E-L A-R-E-Z Z-E-L-O O-L-R-A', 150, { seg: 'O-M M-R O-R A-E', dot: 'M' })

export const M94: EnModel = {
  id: 'en-94',
  title: 'Paralela 45, Testul 63',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 204–206',
  items: [
    { text: 'Numărul care este cu $7$ mai mare ca $-11$ este:', choices: ['$-18$', '$-4$', '$4$', '$18$'], ans: 1 },
    {
      text: 'În luna iunie, timp de două săptămâni, se înregistrează temperatura la amiază, în fiecare zi, obținând rezultatele din diagrama alăturată. Temperatura medie în respectiva perioadă este:',
      choices: ['$29{,}5\\,^\\circ$C', '$30\\,^\\circ$C', '$31\\,^\\circ$C', '$31{,}5\\,^\\circ$C'], ans: 2, fig: fig2,
    },
    { text: 'Alegem, la întâmplare, un număr din mulțimea $A=\\{0,\\,1,\\,2,\\,\\ldots,\\,19\\}$. Probabilitatea ca numărul ales să fie prim este:', choices: ['$0{,}35$', '$0{,}4$', '$0{,}45$', '$0{,}5$'], ans: 1 },
    { text: 'Numerele $a$ și $b$ sunt direct proporționale cu $2$ și $3$, iar suma lor este $12{,}5$. Numărul mai mare este egal cu:', choices: ['$5$', '$6{,}5$', '$7$', '$7{,}5$'], ans: 3 },
    {
      text: 'Rezultatul calculului $\\left(\\dfrac{1}{\\sqrt{8}}+\\dfrac{1}{\\sqrt{32}}-\\dfrac{1}{\\sqrt{2}}\\right):\\dfrac{\\sqrt{2}}{2}$ este:',
      choices: ['$-\\dfrac{1}{4}$', '$0$', '$-1$', '$1$'], ans: 0,
    },
    { text: 'Alice afirmă că suma cifrelor numărului $A=5\\cdot10^{100}+22$ este $9$. Afirmația fetei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    { text: 'Numărul de segmente ce pot fi identificate în figura alăturată este:', choices: ['$3$', '$4$', '$5$', '$6$'], ans: 3, fig: fig7 },
    {
      text: 'În figura alăturată, punctele $P$ și $Q$ sunt situate în interiorul unghiului $AOB$ având măsura egală cu $150^\\circ$. Semidreptele $OM$ și $ON$ sunt bisectoarele unghiurilor $AOP$, respectiv $QOB$, iar măsura unghiului $MON$ este egală cu $100^\\circ$. Măsura unghiului $POQ$ este egală cu:',
      choices: ['$60^\\circ$', '$75^\\circ$', '$50^\\circ$', '$90^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'Pătratul $ABCD$ din figura alăturată este împărțit în $6$ pătrate mai mici. Aria pătrățelului hașurat este $7\\text{ cm}^2$. Aria pătratului $ABCD$ este:',
      choices: ['$42\\text{ cm}^2$', '$49\\text{ cm}^2$', '$63\\text{ cm}^2$', '$81\\text{ cm}^2$'], ans: 2, fig: fig9,
    },
    {
      text: 'Umbrele ambilor copaci din figura alăturată se întind exact până în punctul $A$. Înălțimea copacului mic este $2{,}4$ m. Înălțimea copacului mare este:',
      choices: ['$4{,}8$ m', '$5{,}6$ m', '$4$ m', '$3{,}6$ m'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc de centru $O$, iar punctele $A$, $B$, $M$ și $N$ sunt situate pe cerc astfel încât $AB$ este un diametru și dreptele $AB$ și $MN$ sunt paralele. Dacă măsura unghiului $ANO$ este egală cu $70^\\circ$, atunci măsura arcului mic $MN$ este egală cu:',
      choices: ['$40^\\circ$', '$100^\\circ$', '$200^\\circ$', '$140^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: "În figura alăturată este desenat un paralelipiped dreptunghic $ABCDA'B'C'D'$. Măsura unghiului format de dreptele $CC'$ și $BD$ este:",
      choices: ['$60^\\circ$', '$45^\\circ$', '$90^\\circ$', '$0^\\circ$'], ans: 2, fig: fig12,
    },

    {
      text: 'Avem $240$ de smochine, $192$ de portocale și $216$ mere.',
      parts: [
        { pts: 2, text: 'Grupăm toate fructele în $8$ pachete identice (același număr de smochine în fiecare, același număr de portocale și același număr de mere). Câte smochine conține un pachet? Dar portocale? Dar mere?', ans: '$240:8=30$ smochine, $192:8=24$ portocale și $216:8=27$ mere' },
        { pts: 3, text: 'Care este cel mai mare număr de pachete identice care se poate obține?', ans: '$(240,\\,192,\\,216)=24$ de pachete' },
      ],
    },
    {
      text: 'Se consideră $E(x)=\\left(\\dfrac{2x}{3}-\\dfrac{6}{x}\\right):\\dfrac{x^2-4x+3}{x^2-x}$, unde $x\\in\\mathbb{R}\\setminus\\{0,\\,1,\\,3\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{2x+6}{3}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{0,\\,1,\\,3\\}$.', ans: '$E(x)=\\dfrac{2(x-3)(x+3)}{3x}\\cdot\\dfrac{x(x-1)}{(x-1)(x-3)}=\\dfrac{2(x+3)}{3}=\\dfrac{2x+6}{3}$' },
        { pts: 3, text: 'Pentru câte numere naturale $n$, unde $n\\leq100$, numărul $E(n)$ este întreg?', ans: '$3\\mid 2(n+3)$, deci $3\\mid n$; fără $0$ și $3$: $n\\in\\{6,\\,9,\\,12,\\,\\ldots,\\,99\\}$, adică $32$ de numere' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+1$, al cărei grafic, într-un reper ortogonal $xOy$, este reprezentat în figura alăturată.',
      parts: [
        { pts: 2, text: 'Stabilește care dintre punctele $A(1,\\,4)$ și $B(-1,\\,-1)$ aparține reprezentării grafice a funcției $f$.', ans: '$f(1)=3\\neq4$, $f(-1)=-1$: doar $B$' },
        { pts: 3, text: 'Rezolvă în $\\mathbb{R}$ ecuația $2-f(x+1)=3f(x)$.', ans: '$2-(2x+3)=6x+3$, deci $-8x=4$ și $x=-\\dfrac{1}{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentată o rețea de drumuri județene. Se știe că $AB=BC=CD=DA=6$ km, $B$ este mijlocul lui $AE$, iar $\\sphericalangle ABC=2\\cdot\\sphericalangle BAD$.',
      parts: [
        { pts: 2, text: 'Arată că unghiul $BAD$ are măsura $60^\\circ$.', ans: '$ABCD$ este romb, deci $\\sphericalangle ABC+\\sphericalangle BAD=180^\\circ$, de unde $3\\cdot\\sphericalangle BAD=180^\\circ$ și $\\sphericalangle BAD=60^\\circ$' },
        { pts: 3, text: 'Un automobil parcurge traseul $A$-$C$-$E$-$A$ cu viteza de $60$ km/h. Demonstrează că timpul necesar parcurgerii acestei distanțe este mai mic de jumătate de oră.', ans: '$AC=6\\sqrt{3}$ km, $\\triangle BCE$ este echilateral ($BC=BE=6$, $\\sphericalangle CBE=60^\\circ$), deci $CE=6$ km și $AE=12$ km; $\\mathcal{P}_{AEC}=(18+6\\sqrt{3})$ km $<30$ km, distanța parcursă în jumătate de oră' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$ și $E$ împart cercul în cinci arce de măsuri egale, iar $\\{T\\}=AC\\cap BD$.',
      parts: [
        { pts: 2, text: 'Află măsura unghiului $AED$.', ans: 'Fiecare arc are $72^\\circ$, deci $\\sphericalangle AED=\\dfrac{3\\cdot72^\\circ}{2}=108^\\circ$' },
        { pts: 3, text: 'Demonstrează că punctele $E$ și $T$ sunt simetrice față de dreapta $AD$.', ans: '$\\overset{\\frown}{AB}=\\overset{\\frown}{ED}$, deci $AE\\parallel BD$; $\\overset{\\frown}{AE}=\\overset{\\frown}{CD}$, deci $ED\\parallel AC$; $AEDT$ este paralelogram cu $AE=ED$, deci romb, iar diagonala $AD$ este axa lui de simetrie' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată prisma triunghiulară regulată $AZOREL$, cu muchia laterală $AR=12$ dm și latura bazei $AZ=8$ dm.',
      parts: [
        { pts: 2, text: 'Calculează volumul prismei considerate.', ans: '$V=\\dfrac{8^2\\sqrt{3}}{4}\\cdot12=192\\sqrt{3}\\text{ dm}^3\\approx0{,}33\\text{ m}^3$' },
        { pts: 3, text: 'Arată că dreapta $AE$ este paralelă cu planul $(OMR)$, unde $M$ este mijlocul muchiei $EL$.', ans: 'Fie $\\{S\\}=OR\\cap AL$, mijlocul lui $AL$; $SM$ este linie mijlocie în $\\triangle LAE$, deci $SM\\parallel AE$; cum $SM\\subset(OMR)$, $AE\\parallel(OMR)$' },
      ],
      fig: fig18,
    },
  ],
}
