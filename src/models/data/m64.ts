// Testul 33 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 139–141; every answer here is computed and checked with the book's answers, p. 281).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { mid3, plane, solid } from '../figure'
import { graph, pol, PRISM3, prism3 } from './shapes'

const s3 = Math.sqrt(3)

// the pie chart: Dan 30% (108°), Baciu 25% (90°), Andrei 45% (162°)
const fig2 = plane({ O: [0, 0], X: pol(100, 5), Y: pol(-8, 5), Z: pol(-98, 5) }, 110, {
  s: 'O-X O-Y O-Z', c: [{ at: 'O', r: 5 }], l: { O: '', X: '', Y: '', Z: '' },
  t: [
    { at: pol(46, 2.9), s: 'Dan', anchor: 'middle', size: 10 }, { at: [pol(46, 2.9)[0], pol(46, 2.9)[1] - 1.1], s: '30%', anchor: 'middle', size: 10 },
    { at: pol(-53, 3), s: 'Baciu', anchor: 'middle', size: 10 }, { at: [pol(-53, 3)[0], pol(-53, 3)[1] - 1.1], s: '25%', anchor: 'middle', size: 10 },
    { at: pol(181, 2.6), s: 'Andrei', anchor: 'middle', size: 10 }, { at: [pol(181, 2.6)[0], pol(181, 2.6)[1] - 1.1], s: '45%', anchor: 'middle', size: 10 },
  ],
})
const fig7 = plane({ A: [0, 0], P: [2, 0], M: [4, 0], B: [8, 0], N: [11, 0], Q: [12.5, 0], C: [14, 0] }, 170, {
  s: 'A-C', dot: 'A P M B N Q C', l: { A: 'n', P: 'n', M: 'n', B: 'n', N: 'n', Q: 'n', C: 'n' },
})
const D8 = pol(40, 5)
const fig8 = plane({ A: [0, 0], B: [10, 0], D: D8, C: [D8[0] + 5, D8[1]] }, 130, { s: 'A-B D-C A-D A-C', ang: ['ADC'] })
const fig9 = plane({ O: [0, 0], A: pol(200, 50), B: pol(-16.56, 60), C: pol(20, 25), D: pol(163.44, 30) }, 130, { s: 'A-C B-D A-B D-C', l: { O: 's' } })
const fig10 = plane({ A: [0, 0], B: [35, 0], C: [35, 35], D: [0, 35], M: [20, 0], N: [35, 20], P: [15, 35], Q: [0, 15] }, 110, { s: 'A-B-C-D-A M-N-P-Q-M' })
const fig11 = plane({ O: [0, 0], A: [-4, -3], B: [4, -3], D: [-3, 4], C: [3, 4] }, 100, { s: 'A-B D-C', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 'e' } })

const fig15 = graph({ A: [6, 0], B: [0, -6], L1: [-1, -7], L2: [7.5, 1.5] }, 110, [-1.5, 8], [-7.5, 2], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'n', B: 'e' } })
const fig16 = plane({ B: [0, 0], D: [0, 5], A: [12, 0], C: [2.4, 3.2], M: [0, 2.5], N: [6, 2.5] }, 150, { s: 'B-A-D-B B-C-D', d: 'C-M M-N N-B', ra: ['BCD', 'ABD'], l: { M: 'w' } })
// seven regular hexagons of side 2 (pointy tops): the middle one and six around it
const hexes: Record<string, Pt> = {}
const chains: string[] = []
const centres: Pt[] = [[0, 0], ...[0, 60, 120, 180, 240, 300].map((a) => pol(a, 2 * s3))]
centres.forEach((c, i) => {
  const names = [30, 90, 150, 210, 270, 330].map((a, k) => { hexes[`h${i}${k}`] = pol(a, 2, c); return `h${i}${k}` })
  chains.push([...names, names[0]].join('-'))
})
const fig17 = plane({ ...hexes, A: [2 * s3, 4], B: [-2 * s3, 4], C: [0, -2], M: [0, 4] }, 140, {
  s: [...chains, 'A-B-C-A'].join(' '), l: { ...Object.fromEntries(Object.keys(hexes).map((k) => [k, ''])), M: 'n', A: 'ne', B: 'nw', C: 's' },
})
const p18 = prism3(12, 8)
const fig18 = solid({ ...p18, M: mid3(p18["B'"], p18["C'"]) }, PRISM3, 130, { seg: "A-M A'-M A'-B B-M" })

export const M64: EnModel = {
  id: 'en-64',
  title: 'Paralela 45, Testul 33',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 139–141',
  items: [
    { text: 'Numărul numerelor de două cifre care sunt multiplii lui $9$ este:', choices: ['$9$', '$10$', '$11$', '$12$'], ans: 1 },
    {
      text: 'Andrei, Baciu și Dan au participat la un concurs cu public. În diagrama alăturată se poate vedea cum au fost distribuite voturile publicului. Dacă Dan a primit $36$ de voturi, atunci numărul persoanelor care au votat este:',
      choices: ['$84$', '$100$', '$106$', '$120$'], ans: 3, fig: fig2,
    },
    { text: 'Cel mai mare dintre numerele $A=2^{16}:(-2)^{11}$, $B=(-4)\\cdot(-3)$, $C=2^{10}:(-2)^6$, $D=(3-8)\\cdot(-3)$ este:', choices: ['$A$', '$B$', '$C$', '$D$'], ans: 2 },
    {
      text: 'Fie $a=0{,}5+0{,}(3)+0{,}1(6)$ și $b=\\left(\\dfrac{5}{6}-\\dfrac{3}{4}\\right)\\cdot12$. Dintre următoarele relații, cea adevărată este:',
      choices: ['$a>1$', '$b\\geq\\dfrac{3}{2}$', '$a=b$', '$a+b<2$'], ans: 2,
    },
    {
      text: 'În tabelul alăturat sunt trecute numerele scrise pe tablă de patru eleve, Elvira, Daria, Ana și Iulia.\n\n| Elvira | Daria | Ana | Iulia |\n|---|---|---|---|\n| $\\sqrt{3^2+4^2}$ | $-\\sqrt{3\\cdot12}$ | $-\\sqrt{4+4}$ | $\\sqrt{1\\frac{7}{9}}$ |\n\nEleva care a scris pe tablă un număr irațional este:',
      choices: ['Elvira', 'Daria', 'Ana', 'Iulia'], ans: 2,
    },
    { text: 'Propoziția: „Cu o bancnotă de $50$ de lei, Costin a cumpărat $3$ înghețate de $4{,}5$ lei fiecare, o ciocolată de $10$ lei și $3$ prăjituri de $9$ lei fiecare.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctul $B$ se află pe segmentul $AC$, iar $M$, $N$, $P$, $Q$ sunt mijloacele segmentelor $AB$, $BC$, $AM$, respectiv $CN$. Relația adevărată este:',
      choices: ['$PQ=\\dfrac{AC}{2}$', '$PQ=\\dfrac{3}{4}AC$', '$PQ=2MN$', '$PQ=\\dfrac{4}{3}MN$'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată dreptele $AB$ și $DC$ sunt paralele, $AD=DC$ și $\\sphericalangle ADC=140^\\circ$. Măsura unghiului $BAC$ este:',
      choices: ['$20^\\circ$', '$30^\\circ$', '$40^\\circ$', '$60^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată sunt reprezentate schematic patru localități $A$, $B$, $C$ și $D$, conectate prin două drumuri drepte $AC$ și $BD$ care se intersectează în $O$. Dreptele $AB$ și $CD$ sunt paralele și $AO=50$ km, $BO=60$ km, iar distanța $DO$ este cu $5$ km mai mare decât distanța $OC$. Lungimea drumului $OC$ este:',
      choices: ['$5$ km', '$10$ km', '$25$ km', '$50$ km'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$ cu latura $AB=35$ cm. Pe laturile $AB$, $BC$, $CD$ și $DA$ se consideră punctele $M$, $N$, $P$, respectiv $Q$, astfel încât $AM=BN=CP=DQ=20$ cm. Aria patrulaterului $MNPQ$ este:',
      choices: ['$225\\text{ cm}^2$', '$400\\text{ cm}^2$', '$600\\text{ cm}^2$', '$625\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată este desenat un cerc cu raza de $5$ cm și două coarde paralele $AB=8$ cm și $CD=6$ cm. Dacă centrul cercului este situat între cele două coarde, atunci distanța dintre coardele $AB$ și $CD$ este egală cu:',
      choices: ['$6$ cm', '$7$ cm', '$8$ cm', '$9$ cm'], ans: 1, fig: fig11,
    },
    { text: 'Pe cele $6$ fețe ale unui cub cu latura de $5$ cm se lipește câte un cub cu latura de $5$ cm. Aria totală a poliedrului astfel obținut este egală cu:', choices: ['$400\\text{ cm}^2$', '$600\\text{ cm}^2$', '$750\\text{ cm}^2$', '$900\\text{ cm}^2$'], ans: 2 },

    {
      text: 'În cabinetul de matematică sunt tetraedre și cuburi din plastic care au, în total, $44$ de vârfuri și $38$ de fețe.',
      parts: [
        { pts: 2, text: 'Este posibil ca în cabinetul de matematică să fie $6$ tetraedre și $3$ cuburi? Justifică răspunsul dat.', ans: 'Nu: numărul vârfurilor ar fi $4\\cdot6+8\\cdot3=48\\neq44$' },
        { pts: 3, text: 'Află câte tetraedre și câte cuburi sunt în cabinetul de matematică.', ans: '$4t+8c=44$, $4t+6c=38$, deci $c=3$, $t=5$: $5$ tetraedre și $3$ cuburi' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x^2-4}{x^2-9}-1\\right):\\left(\\dfrac{1}{x-3}+\\dfrac{1}{x+3}-\\dfrac{1}{x^2-9}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-3,\\,\\dfrac{1}{2},\\,3\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{5}{2x-1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-3,\\,\\dfrac{1}{2},\\,3\\right\\}$.', ans: '$E(x)=\\dfrac{5}{x^2-9}\\cdot\\dfrac{x^2-9}{2x-1}=\\dfrac{5}{2x-1}$' },
        { pts: 3, text: 'Determină toate numerele întregi $a$ pentru care $E(a)$ este, de asemenea, număr întreg.', ans: '$2a-1\\in\\{-5,\\,-1,\\,1,\\,5\\}$, deci $a\\in\\{-2,\\,0,\\,1\\}$ ($a\\neq3$)' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x-6$.',
      parts: [
        { pts: 2, text: 'Calculează $f(0)\\cdot f(1)\\cdot f(2)\\cdot\\ldots\\cdot f(9)\\cdot f(10)$.', ans: '$f(6)=0$, deci produsul este $0$' },
        { pts: 3, text: 'Determină coordonatele punctelor de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$ și $Oy$ ale sistemului de axe ortogonale $xOy$.', ans: '$A(6,\\,0)$ și $B(0,\\,-6)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată avem: $\\sphericalangle BCD=90^\\circ$, $AB=12$ cm, $BC=4$ cm, $CD=3$ cm și $AD=13$ cm.',
      parts: [
        { pts: 2, text: 'Arată că dreptele $AB$ și $BD$ sunt perpendiculare.', ans: '$BD=5$ cm și $BD^2+BA^2=25+144=169=DA^2$, deci $AB\\perp BD$' },
        { pts: 3, text: 'Dacă $M$ și $N$ sunt mijloacele segmentelor $BD$, respectiv $AD$, calculează suma $CM+MN+NB$.', ans: '$CM+MN+NB=\\dfrac{BD}{2}+\\dfrac{AB}{2}+\\dfrac{AD}{2}=15$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'Un fagure de miere este format din șapte hexagoane regulate cu latura de $2$ cm, ca în figura alăturată.',
      parts: [
        { pts: 2, text: 'Arată că vârfurile $A$, $M$ și $B$ sunt coliniare.', ans: 'Unghiurile cu vârful în $M$: $30^\\circ+120^\\circ+30^\\circ=180^\\circ$' },
        { pts: 3, text: 'Calculează perimetrul triunghiului $ABC$.', ans: '$AB=4\\cdot2\\cos30^\\circ=4\\sqrt{3}$ cm, triunghiul $ABC$ e echilateral, deci $\\mathcal{P}_{ABC}=12\\sqrt{3}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o prismă triunghiulară regulată $ABCA'B'C'$ cu latura bazei $AB=12$ cm și muchia laterală $AA'=8$ cm. Punctul $M$ este mijlocul segmentului $B'C'$.",
      parts: [
        { pts: 2, text: 'Determină lungimea segmentului $AM$.', ans: "$A'M=6\\sqrt{3}$ cm și, din triunghiul $AA'M$, $AM=\\sqrt{64+108}=2\\sqrt{43}$ cm" },
        { pts: 3, text: "Calculează tangenta unghiului format de dreapta $A'B$ cu planul $(BCC')$.", ans: "$A'M\\perp(BCC')$, deci unghiul este $\\sphericalangle A'BM$; $BM=10$ cm, $\\operatorname{tg}=\\dfrac{A'M}{BM}=\\dfrac{3\\sqrt{3}}{5}$" },
      ],
      fig: fig18,
    },
  ],
}
