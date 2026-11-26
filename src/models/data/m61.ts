// Testul 30 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 132–134; every answer here is computed and checked with the book's answers, p. 280).
import type { EnModel } from '../types'
import { mid3, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ D: [-3, 0], A: [0, 0], B: [3, 0], E: [9, 0], R: [11, 0] }, 170, {
  s: 'D-R', dot: 'D A B E', l: { D: 'n', A: 'n', B: 'n', E: 'n', R: '' }, t: [{ at: [10.6, 0.8], s: 'a', italic: true }],
})
const fig8 = plane({ O: [0, 0], A: [10, 0], D: pol(15, 10), C: pol(30, 10), B: pol(60, 10) }, 110, { s: 'O-A O-D O-C O-B', l: { O: 'w' } })
const fig9 = plane({ A: [5, 8], B: [0, 0], C: [10, 0], M: [3, 4.8], N: [7, 4.8] }, 100, { s: 'A-B-C-A M-N' })
const fig10 = plane({ A: [0, 0], B: [13, 0], C: [10, 4], D: [3, 4] }, 120, { s: 'A-B-C-D-A' })
const fig11 = plane({ O: [0, 0], A: pol(135, 6), B: pol(45, 6) }, 100, { s: 'A-B O-A O-B', c: [{ at: 'O', r: 6 }], l: { O: 's' } })
const f12 = plane({ V: [0, 6], A: [-8, 0], B: [8, 0], O: [0, 0], T: [0, -2] }, 110, { s: 'A-V-B', d: 'V-O O-B', dot: 'O', l: { T: '', O: 's' } })
const r12 = f12.p.B[0] - f12.p.O[0]
const fig12 = { ...f12, e: [{ at: f12.p.O, rx: r12, ry: r12 / 4, back: true }] }

const fig15 = graph({ A: [4, 0], B: [0, 3], L1: [-1, 3.75], L2: [5, -0.75] }, 120, [-1.5, 5.5], [-1.5, 4.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 's', B: 'w', O: 'sw' } })
const fig16 = plane({ B: [0, 0], C: [9, 0], A: [4.5, 4.5 / s3], M: [6, 0] }, 140, { s: 'A-B-C-A A-M', ra: ['BAM'] })
const fig17 = plane({ A: [0, 0], B: [8, 0], C: [8, 8 * s3], D: [0, 8 * s3], E: [20, 4 * s3], P: [8, (8 * s3) / 5] }, 120, { s: 'A-B-E-C-D-A A-C A-E B-C', ra: ['ACE'], l: { P: 'nw' } })
const p18 = box(4, 4, 4)
const fig18 = solid({ ...p18, M: mid3(p18.B, p18["B'"]) }, BOX, 110, { seg: "A-C D'-A D'-C M-A M-C", dot: 'M' })

export const M61: EnModel = {
  id: 'en-61',
  title: 'Paralela 45, Testul 30',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 132–134',
  items: [
    { text: 'Restul împărțirii numărului $345$ la $6$ este:', choices: ['$57$', '$0$', '$1$', '$3$'], ans: 3 },
    { text: 'Dacă $\\dfrac{a}{3}=\\dfrac{b}{4}$ și $a=p\\%$ din $b$, atunci numărul $p$ este egal cu:', choices: ['$0{,}75$', '$7{,}5$', '$50$', '$75$'], ans: 3 },
    { text: 'A zecea zecimală din scrierea numărului rațional $a=0{,}1(23)$ este:', choices: ['$0$', '$1$', '$2$', '$3$'], ans: 2 },
    { text: 'Scrierea sub formă de interval a mulțimii $A=\\{x\\in\\mathbb{R}\\mid|x-3|\\le2\\}$ este:', choices: ['$[-2,\\,2]$', '$[1,\\,5]$', '$[-5,\\,1]$', '$(-\\infty,\\,5]$'], ans: 1 },
    { text: 'Se dau numerele $a=3+\\sqrt{5}$ și $b=3-\\sqrt{5}$. Diferența dintre media aritmetică și media geometrică a celor două numere este:', choices: ['$3$', '$2$', '$3-\\sqrt{5}$', '$1$'], ans: 3 },
    { text: 'Alexandra cumpără o pâine de $3{,}50$ lei și două kilograme de cartofi a $3$ lei/kg. Alexandra plătește cu o bancnotă de $10$ lei. Casiera spune că fata ar trebui să îi mai dea încă $50$ de bani. Afirmația casierei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'Pe dreapta $a$, din figura alăturată, considerăm punctele $A$ și $B$, $AB=3$ cm. Punctul $D$ este simetricul punctului $B$ față de punctul $A$, iar punctul $E$ este simetricul punctului $D$ față de punctul $B$. Lungimea segmentului $DE$ este egală cu:',
      choices: ['$10$ cm', '$11$ cm', '$12$ cm', '$14$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, semidreptele $OC$ și $OD$ sunt bisectoarele unghiurilor $AOB$, respectiv $AOC$. Unghiul $BOD$ are măsura de $45^\\circ$. Măsura unghiului $AOD$ este:',
      choices: ['$30^\\circ$', '$15^\\circ$', '$25^\\circ$', '$45^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată, segmentul $MN$ este în paralel cu latura $BC$ a triunghiului $ABC$, iar $\\dfrac{AM}{MB}=\\dfrac{2}{3}$. Segmentul $BC$ are lungimea de $15$ cm. Lungimea segmentului $MN$ este:',
      choices: ['$6$ cm', '$10$ cm', '$9$ cm', '$4$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez isoscel $ABCD$, cu $AB\\parallel CD$, $AB=13$ cm, $CD=7$ cm și $BC=AD=5$ cm. Aria trapezului este egală cu:',
      choices: ['$44\\text{ cm}^2$', '$91\\text{ cm}^2$', '$30\\text{ cm}^2$', '$40\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ este o coardă a cercului de centru $O$ și rază $6$ cm. Lungimea coardei $AB$ este $6\\sqrt{2}$ cm. Măsura unghiului $OAB$ este:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$75^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentat un con circular drept, cu secțiunea axială $VAB$, înălțimea $VO=6$ cm și generatoarea $VA=10$ cm. Aria bazei conului este egală cu:',
      choices: ['$16\\pi\\text{ cm}^2$', '$64\\pi\\text{ cm}^2$', '$80\\pi\\text{ cm}^2$', '$100\\pi\\text{ cm}^2$'], ans: 1, fig: fig12,
    },

    {
      text: 'Numărul elevilor dintr-o clasă este cuprins între $15$ și $40$. Dacă elevii clasei s-ar alinia câte patru sau câte șapte, de fiecare dată ar rămâne un rând cu doar doi elevi.',
      parts: [
        { pts: 2, text: 'Este posibil ca numărul elevilor clasei să fie $26$? Justifică răspunsul.', ans: 'Nu: $26=7\\cdot3+5$, deci câte șapte ar rămâne un rând cu $5$ elevi' },
        { pts: 3, text: 'Determină numărul elevilor clasei.', ans: '$e=4n+2=7m+2$, deci $e-2$ se divide cu $28$ și $e=30$' },
      ],
    },
    {
      text: 'Considerăm expresia $E(x)=\\left(\\dfrac{1}{x^2-x}-\\dfrac{1}{x^2+x}\\right)\\cdot\\dfrac{x^3-x}{x+2}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{2}{x+2}$, oricare ar fi $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,0,\\,1\\}$.', ans: 'Paranteza este $\\dfrac{(x+1)-(x-1)}{x(x-1)(x+1)}=\\dfrac{2}{x(x-1)(x+1)}$, iar $x^3-x=x(x-1)(x+1)$, deci $E(x)=\\dfrac{2}{x+2}$' },
        { pts: 3, text: 'Află valorile întregi ale numărului $n$ pentru care $E(n)$ este număr întreg.', ans: '$n+2\\in\\{-2,\\,-1,\\,1,\\,2\\}$, deci $n\\in\\{-4,\\,-3,\\,-1,\\,0\\}$; fără valorile excluse, $n\\in\\{-4,\\,-3\\}$' },
      ],
    },
    {
      text: 'Reprezentarea grafică a funcției $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$, desenată în figura alăturată, taie axele $Ox$ și $Oy$ ale sistemului de axe ortogonale $xOy$ în punctele $A(4,\\,0)$, respectiv $B(0,\\,3)$.',
      parts: [
        { pts: 2, text: 'Arată că $a=-\\dfrac{3}{4}$ și $b=3$.', ans: '$f(0)=3$ dă $b=3$, iar $f(4)=0$ dă $4a+3=0$, $a=-\\dfrac{3}{4}$' },
        { pts: 3, text: 'Calculează perimetrul triunghiului $AOB$.', ans: '$OA=4$, $OB=3$, $AB=5$, deci $\\mathcal{P}_{AOB}=12$' },
      ],
      fig: fig15,
    },
    {
      text: 'Triunghiul $ABC$ din figura alăturată este isoscel, cu $\\sphericalangle BAC=120^\\circ$. Perpendiculara în $A$ pe $AB$ intersectează latura $BC$ în punctul $M$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $AMC$ este isoscel.', ans: '$\\sphericalangle MAC=120^\\circ-90^\\circ=30^\\circ=\\sphericalangle MCA$, deci $MA=MC$' },
        { pts: 3, text: 'Determină valoarea raportului $\\dfrac{MC}{BC}$.', ans: 'În $\\triangle BAM$, $\\sphericalangle B=30^\\circ$, deci $AM=\\dfrac{BM}{2}$; $MC=AM=\\dfrac{BM}{2}$, deci $\\dfrac{MC}{BC}=\\dfrac{1}{3}$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentată o terasă $ABECD$, unde $ABCD$ este un dreptunghi, iar $BCE$ este un triunghi echilateral. Segmentele $AC$, $AE$ și $BC$ reprezintă niște pereți despărțitori, iar $\\{P\\}=AE\\cap BC$. Se știe că $AB=8$ m, iar pereții $AC$ și $CE$ sunt perpendiculari.',
      parts: [
        { pts: 2, text: 'Calculează suprafața terasei.', ans: '$\\sphericalangle ACB=30^\\circ$, deci $BC=8\\sqrt{3}$ m; $\\mathcal{A}=\\mathcal{A}_{ABCD}+\\mathcal{A}_{BCE}=64\\sqrt{3}+48\\sqrt{3}=112\\sqrt{3}\\text{ m}^2$' },
        { pts: 3, text: 'Arată că distanța dintre punctele $B$ și $P$ este mai mică de $2{,}8$ m.', ans: 'Cu $M$ mijlocul lui $BC$: $\\triangle ABP\\sim\\triangle EMP$, $EM=12$ m, deci $BP=\\dfrac{8\\sqrt{3}}{5}$ m $<\\dfrac{8\\cdot1{,}75}{5}=2{,}8$ m' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată, $ABCDA'B'C'D'$ este un cub cu latura de $4$ cm, iar $M$ este mijlocul muchiei $BB'$.",
      parts: [
        { pts: 2, text: 'Află volumul cubului.', ans: '$V=4^3=64\\text{ cm}^3$' },
        { pts: 3, text: "Demonstrează că planele $(D'AC)$ și $(MAC)$ sunt perpendiculare.", ans: "Cu $O$ centrul bazei: $MO\\perp AC$, $D'O\\perp AC$, deci unghiul este $\\sphericalangle D'OM$; $D'O=2\\sqrt{6}$, $OM=2\\sqrt{3}$, $D'M=6$ cm și $24+12=36$, deci $\\sphericalangle D'OM=90^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
