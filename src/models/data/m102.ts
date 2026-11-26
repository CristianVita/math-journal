// Testul 71 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 222–224; every answer here is computed and checked with the book's answers, p. 294).
import type { Fig, P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, plane, solid } from '../figure'
import { graph, pol } from './shapes'

const s3 = Math.sqrt(3)

// the bar chart: the scale starts above 0 as in the book (800 → 2, 900 → 3, 1000 → 4, 1200 → 6)
const days = ['L', 'M', 'M', 'J', 'V'], cases = [800, 1000, 1200, 900, 1000], y = (v: number) => (v - 600) / 100
const bars: Record<string, Pt> = {}
cases.forEach((v, i) => { bars[`b${i}`] = [1.4 * i + 1, 0]; bars[`a${i}`] = [1.4 * i + 1, y(v)]; bars[`c${i}`] = [1.4 * i + 1.6, y(v)] })
const ticks: Record<string, Pt> = Object.fromEntries([800, 900, 1000, 1200].map((v) => [`k${v}`, [0, y(v)] as Pt]))
const chart = plane({ X0: [-0.4, 0], X1: [8.4, 0], Y0: [0, -0.6], Y1: [0, 7], ...bars, ...ticks }, 170, {
  s: 'X0-X1 Y0-Y1', d: 'k1200-a2 k1000-a4 k900-a3 k800-a0',
  l: Object.fromEntries(['X0', 'X1', 'Y0', 'Y1', ...Object.keys(bars), ...Object.keys(ticks)].map((k) => [k, ''])),
  t: [
    ...days.map((d, i) => ({ at: [1.4 * i + 1.3, -0.8] as Pt, s: d, anchor: 'middle' as const, size: 10 })),
    ...[800, 900, 1000, 1200].map((v) => ({ at: [-0.3, y(v) - 0.2] as Pt, s: String(v), anchor: 'end' as const, size: 9 })),
    { at: [0.3, 7], s: 'Număr cazuri', anchor: 'start', size: 9 }, { at: [8.4, -0.8], s: 'Ziua', anchor: 'end', size: 9 },
  ],
})
const fig6: Fig = {
  ...chart,
  path: cases.map((_, i) => {
    const [x0, y0] = chart.p[`b${i}`], [x1, y1] = chart.p[`c${i}`]
    return { d: `M${x0} ${y0} H${x1} V${y1} H${x0} Z`, fill: '#555' }
  }),
}

const fig7 = plane({ A: [0, 0], M: [6, 0], N: [8, 0], B: [12, 0], C: [16, 0] }, 170, { s: 'A-C', dot: 'A M N B C', l: { A: 's', M: 'n', N: 'n', B: 's', C: 's' } })
const fig8 = plane({ A: [-4, 0], O: [0, 0], D: [3, 0], B: pol(140, 3.5), C: pol(80, 3.5) }, 150, { s: 'A-D O-B O-C', dot: 'O' })
// ∡ADC = 150°: the line AD makes 30° with BC
const fig9 = plane({ B: [-12, 0], D: [0, 0], C: [12, 0], A: pol(150, 9), E: pol(-30, 6) }, 150, { s: 'B-C A-E', dot: 'D', l: { E: '' } })
const t = Math.tan((22.5 * Math.PI) / 180)
const fig10 = plane({ A: [0, 1], B: [t, 0], C: [0, -1], D: [-t, 0] }, 70, { s: 'A-B-C-D-A' })
const fig11 = plane({ O1: [0, 0], O2: [15, 0], M: [5.4, 7.2] }, 150, {
  s: 'O1-O2 O1-M-O2', c: [{ at: 'O1', r: 9 }, { at: 'O2', r: 12 }], dot: 'O1 O2', ra: ['O1MO2'], l: { O1: 's', O2: 's' },
})

const fig15 = graph({ L1: [-3, 1.5], L2: [5, -7 / 6] }, 130, [-3.5, 5.5], [-2, 2.5], { s: 'L1-L2', l: { L1: '', L2: '' } })
// the square turned as in the book: C and D on top, B and A below, E to the left of B
const fig16 = plane({ A: [6, 0], B: [0, 0], C: [0, 6], D: [6, 6], E: [-2, 0], F: [0, 1.5] }, 120, { s: 'A-B-C-D-A E-B E-F-D', l: { E: 'w' } })
const A17: Pt = [6, 6 * s3], B17: Pt = [0, 0], C17: Pt = [20, 0]
const fig17 = plane({ A: A17, B: B17, C: C17, M: [3, 3 * s3], N: [13, 3 * s3], P: [10, 0], D: foot(A17, B17, C17) }, 170, {
  s: 'A-B-C-A A-D M-N-P M-D', ra: ['ADB'],
})
// the base edge 24 and the height 1, drawn taller as in the book
const p18: Record<string, P3> = { A: [0, 4 * s3 * 3, 0], B: [12, 0, 0], C: [24, 4 * s3 * 3, 0], O: [12, 8 * s3, 0], V: [12, 8 * s3, 20] }
const fig18 = solid(p18, 'A-B-C A-B-V B-C-V C-A-V', 130, { seg: 'V-O O-A', l: { O: 'e' } })

export const M102: EnModel = {
  id: 'en-102',
  title: 'Paralela 45, Testul 71',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 222–224',
  items: [
    { text: 'Câtul împărțirii numărului $435$ la $11$ este:', choices: ['$6$', '$39$', '$38$', '$50$'], ans: 1 },
    { text: 'Probabilitatea ca, alegând un număr de forma $\\overline{3x}$, acesta să fie număr prim este:', choices: ['$0{,}2$', '$0{,}5$', '$1$', '$0{,}75$'], ans: 0 },
    { text: 'Numărul perechilor $(x,\\,y)$ de numere întregi care verifică relația $x^2+y^2=4$ este:', choices: ['$1$', '$2$', '$4$', '$5$'], ans: 2 },
    {
      text: 'Patru elevi, Roxana, Elena, Octavian și Marcu, trebuie să determine cardinalul mulțimii $A=\\left\\{n\\in\\mathbb{N}\\mid1\\le n\\le8\\text{ și }\\dfrac{10}{n}\\text{ este fracție periodică}\\right\\}$. Rezultatele lor sunt înregistrate în tabelul de mai jos.\n\n| Roxana | Elena | Octavian | Marcu |\n|---|---|---|---|\n| $1$ | $2$ | $3$ | $4$ |\n\nDintre cei patru elevi, cel care a obținut rezultatul corect este:',
      choices: ['Roxana', 'Elena', 'Octavian', 'Marcu'], ans: 2,
    },
    {
      text: 'Pentru $a=\\dfrac{1}{\\sqrt{3}+1}$ și $b=\\left(\\sqrt{12}+\\sqrt{27}\\right)\\cdot5^{-1}$, rezultatul calculului $2a-b$ este egal cu:',
      choices: ['$1$', '$-1$', '$\\sqrt{3}$', '$0$'], ans: 1,
    },
    {
      text: 'Numărul cazurilor noi din timpul unei săptămâni a pandemiei Covid-19 este prezentat în diagrama alăturată. Denisa afirmă că, în respectiva săptămână, cele mai puține cazuri au fost înregistrate joi. Afirmația Denisei este:',
      choices: ['adevărată', 'falsă'], ans: 1, fig: fig6,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, și $AB>BC$. Dacă punctul $M$ este mijlocul segmentului $AB$, punctul $N$ este mijlocul segmentului $AC$, $AM=6$ cm și $AN=8$ cm, atunci lungimea segmentului $BC$ este egală cu:',
      choices: ['$12$ cm', '$2$ cm', '$20$ cm', '$4$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt desenate unghiurile adiacente $AOB$, $BOC$ și $COD$, astfel încât $OA$ și $OD$ sunt semidrepte opuse. Dacă măsurile unghiurilor $AOB$, $BOC$ și $COD$ sunt direct proporționale cu $2$, $3$, respectiv $4$, atunci măsura unghiului $COD$ este egală cu:',
      choices: ['$60^\\circ$', '$70^\\circ$', '$80^\\circ$', '$90^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată, punctul $D$ este mijlocul segmentului $BC$, măsura unghiului $ADC$ este egală cu $150^\\circ$, iar $BC=24$ km. Distanța de la punctul $C$ la dreapta $AD$ este egală cu:',
      choices: ['$12$ km', '$6$ km', '$8$ km', '$24$ km'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un romb $ABCD$, având perimetrul egal cu $40$ cm și $\\sphericalangle B=3\\cdot\\sphericalangle A$. Aria rombului este egală cu:',
      choices: ['$10\\text{ cm}^2$', '$5\\sqrt{2}\\text{ cm}^2$', '$50\\sqrt{2}\\text{ cm}^2$', '$25\\sqrt{2}\\text{ cm}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'Cercurile din figura alăturată au razele egale cu $9$ cm, respectiv $12$ cm și distanța dintre centre de $15$ cm. Dacă $M$ este unul dintre punctele lor de intersecție, atunci măsura unghiului $O_1MO_2$ este egală cu:',
      choices: ['$120^\\circ$', '$90^\\circ$', '$150^\\circ$', '$60^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'Pentru a construi fundația unei case se sapă o groapă în formă de trunchi de piramidă patrulateră regulată. Adâncimea gropii este de $6$ m, latura bazei mici are $4$ m și latura bazei mari are $10$ m. Volumul pământului excavat este egal cu:',
      choices: ['$312\\text{ m}^3$', '$300\\text{ m}^3$', '$320\\text{ m}^3$', '$280\\text{ m}^3$'], ans: 0,
    },

    {
      text: 'Un croitor dispune de $11$ m de material. Pentru a confecționa o rochie utilizează $3$ m de material, iar pentru a confecționa o bluză folosește $2$ m de material. Rochia se vinde cu $105$ lei bucata și bluza cu $80$ de lei bucata.',
      parts: [
        { pts: 2, text: 'Este posibil să confecționeze doar bluze folosind tot materialul? Justifică răspunsul.', ans: 'Nu: bluzele folosesc un număr par de metri, iar $11$ nu se divide cu $2$' },
        { pts: 3, text: 'Determină câte bluze și câte rochii va face croitorul, astfel încât să folosească tot materialul și să obțină o sumă cât mai mare de bani.', ans: '$3x+2y=11$, $x,\\,y\\in\\mathbb{N}^*$: $(1,\\,4)$ dă $425$ de lei, $(3,\\,1)$ dă $395$ de lei; deci o rochie și patru bluze' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x}{3}\\cdot\\left(\\dfrac{8x-12}{4x^2-12x+9}-\\dfrac{5x}{2x^2+3x}-\\dfrac{20x}{9-4x^2}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{3}{2},\\,0,\\,\\dfrac{3}{2}\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{3x}{2x-3}$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{3}{2},\\,0,\\,\\dfrac{3}{2}\\right\\}$.', ans: 'Paranteza este $\\dfrac{4}{2x-3}-\\dfrac{5}{2x+3}+\\dfrac{20x}{(2x-3)(2x+3)}=\\dfrac{18x+27}{(2x-3)(2x+3)}=\\dfrac{9}{2x-3}$, deci $E(x)=\\dfrac{x}{3}\\cdot\\dfrac{9}{2x-3}=\\dfrac{3x}{2x-3}$' },
        { pts: 3, text: 'Determină valorile întregi ale lui $n$ pentru care $E(n)$ este număr întreg.', ans: '$2E(n)=3+\\dfrac{9}{2n-3}$, deci $2n-3\\mid9$; fără $n=0$, rămân $n\\in\\{-3,\\,1,\\,2,\\,3,\\,6\\}$, toate cu $E(n)$ întreg' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-\\dfrac{x}{3}+\\dfrac{1}{2}$.',
      parts: [
        { pts: 2, text: 'Calculează $f(-2)+f(-1)+f(1)+f(2)$.', ans: '$4\\cdot\\dfrac{1}{2}=2$' },
        { pts: 3, text: 'Demonstrează că nu există puncte $P(a,\\,b)$, aparținând reprezentării grafice a funcției $f$, astfel încât $a$ și $b$ să fie simultan numere întregi.', ans: '$b=-\\dfrac{a}{3}+\\dfrac{1}{2}$ dă $2a+6b=3$, imposibil pentru $a,\\,b\\in\\mathbb{Z}$: $2a+6b$ este par, iar $3$ este impar' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat pătratul $ABCD$ cu $AB=6$ cm. Prelungim latura $AB$ cu $BE=2$ cm și notăm cu $F$ intersecția dreptelor $BC$ și $DE$.',
      parts: [
        { pts: 2, text: 'Arată că $DE=10$ cm.', ans: '$DE=\\sqrt{EA^2+AD^2}=\\sqrt{8^2+6^2}=10$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $EF$.', ans: '$\\triangle EBF\\sim\\triangle EAD$, deci $\\dfrac{EF}{ED}=\\dfrac{EB}{EA}=\\dfrac{2}{8}$ și $EF=2{,}5$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, având $AB=12$ cm, $BC=20$ cm și măsura unghiului $ABC$ egală cu $60^\\circ$. Notăm cu $M$, $N$, $P$ mijloacele segmentelor $AB$, $AC$, respectiv $BC$ și cu $D$ piciorul înălțimii din $A$.',
      parts: [
        { pts: 2, text: 'Arată că $MD=NP=6$ cm.', ans: '$NP$ este linie mijlocie, deci $NP=\\dfrac{AB}{2}=6$ cm; în $\\triangle ADB$ dreptunghic, $DM$ este mediană, deci $DM=\\dfrac{AB}{2}=6$ cm' },
        { pts: 3, text: 'Determină perimetrul patrulaterului $MNPD$.', ans: '$MN=\\dfrac{BC}{2}=10$ cm, $BD=AB\\cos60^\\circ=6$ cm, $DP=10-6=4$ cm, deci $\\mathcal{P}_{MNPD}=10+6+4+6=26$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'Un corp din lemn are forma piramidei triunghiulare regulate $VABC$ din figura alăturată. Înălțimea piramidei este $VO=1$ cm și latura bazei are lungimea $AB=24$ cm. Pe suprafața laterală se aplică un strat de vopsea. Se știe că $1{,}5$ g de vopsea acoperă o suprafață de $14\\text{ cm}^2$.',
      parts: [
        { pts: 2, text: 'Stabilește ce cantitate de vopsea este necesară pentru a vopsi întreaga suprafață laterală.', ans: 'Apotema bazei este $4\\sqrt{3}$ cm, apotema piramidei $\\sqrt{48+1}=7$ cm, $\\mathcal{A}_l=\\dfrac{3\\cdot24\\cdot7}{2}=252\\text{ cm}^2$, deci $252:14\\cdot1{,}5=27$ g' },
        { pts: 3, text: 'Arată că tangenta unghiului format de muchia laterală a piramidei cu planul bazei este mai mare decât $\\dfrac{1}{14}$.', ans: '$\\sphericalangle(VA,(ABC))=\\sphericalangle VAO$, $\\operatorname{tg}\\sphericalangle VAO=\\dfrac{VO}{AO}=\\dfrac{1}{8\\sqrt{3}}>\\dfrac{1}{14}$, căci $8\\sqrt{3}=\\sqrt{192}<\\sqrt{196}=14$' },
      ],
      fig: fig18,
    },
  ],
}
