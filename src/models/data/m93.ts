// Testul 62 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 202–204; every answer here is computed and checked with the book's answers, p. 291).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { plane } from '../figure'
import { graph, pol } from './shapes'

const s3 = Math.sqrt(3)

// the votes: Bogdan 9 (108°), Matei 8 (96°), Ioana 13 (156°)
const fig2 = plane({ O: [0, 0], X: pol(90, 5), Y: pol(198, 5), Z: pol(294, 5) }, 110, {
  s: 'O-X O-Y O-Z', c: [{ at: 'O', r: 5 }], l: { O: '', X: '', Y: '', Z: '' },
  t: [
    { at: pol(144, 2.9), s: 'Bogdan', anchor: 'middle', size: 9 }, { at: [pol(144, 2.9)[0], pol(144, 2.9)[1] - 1], s: '9 voturi', anchor: 'middle', size: 9 },
    { at: pol(246, 2.9), s: 'Matei', anchor: 'middle', size: 9 }, { at: [pol(246, 2.9)[0], pol(246, 2.9)[1] - 1], s: '8 voturi', anchor: 'middle', size: 9 },
    { at: pol(12, 2.9), s: 'Ioana', anchor: 'middle', size: 9 },
  ],
})
const fig7 = plane({ A: [0, 0], M: [1.5, 0], B: [3, 0], C: [7, 0], N: [8.5, 0], D: [10, 0] }, 180, { s: 'A-D', dot: 'A M B C N D', l: { A: 'n', M: 'n', B: 'n', C: 'n', N: 'n', D: 'n' } })
const fig8 = plane({ A: [2, 2 * s3], B: [0, 0], C: [4, 0], D: [6, 0] }, 120, { s: 'A-B-D A-C', dot: 'D' })
const fig9 = plane({ A: [1, 6], B: [0, 0], C: [7, 0], M: [3.5, 0], N: [4, 3] }, 110, { s: 'A-B-C-A M-N' })
const fig10 = plane({ A: [0, 0], B: [12, 0], C: [0, 9] }, 120, { s: 'A-B-C-A', ra: ['BAC'] })
const fig11 = plane({ O: [0, 0], A: pol(235, 4), B: pol(300, 4), C: pol(350, 4), D: pol(40, 4) }, 110, { s: 'A-B A-C A-D', c: [{ at: 'O', r: 4 }], l: { O: '' } })

const fig15 = graph({ A: [1, 5], L1: [-1.3, -1.9], L2: [1.2, 5.6] }, 100, [-2, 2], [-2.5, 6], { s: 'L1-L2', dot: 'A', l: { L1: '', L2: '', A: 'e' } })
const fig16 = plane({ A: [0, 10], B: [0, 0], C: [10, 0], D: [10, 10], E: [20, 10], F: [20, 0] }, 170, { s: 'A-B-F-E-A D-C A-C A-F' })
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [24, 0], E: [3, 3 * s3], D: [15, 3 * s3] }, 180, { s: 'A-C A-E-B B-D-C' })
// the pencil before and after: a cylinder, then a cylinder with a cone on top (drawn shorter than the real 200 mm)
const f18 = plane({
  A: [-5, 0], B: [5, 0], O: [0, 0], "A'": [-5, 60], "B'": [5, 60], "O'": [0, 60],
  P: [20, 0], Q: [30, 0], R: [25, 0], A1: [20, 48], B1: [30, 48], T: [25, 60],
}, 110, {
  s: "A-A' B-B' P-A1-T-B1-Q", d: 'O-B R-Q', dot: "O O' R T",
  l: { O: 's', "O'": 'n', A: 'w', B: 'e', "A'": 'w', "B'": 'e', R: '', P: '', Q: '', T: '', A1: 'w', B1: 'e' },
  t: [{ at: [18.6, -1], s: 'A', anchor: 'end', italic: true, size: 14 }, { at: [31.4, -1], s: 'B', anchor: 'start', italic: true, size: 14 },
    { at: [25, -5], s: 'O', anchor: 'middle', italic: true, size: 14 }, { at: [25, 62], s: "O'", anchor: 'middle', italic: true, size: 14 }],
})
const r18 = f18.p.B[0] - f18.p.O[0]
const fig18 = {
  ...f18,
  e: [
    { at: f18.p.O, rx: r18, ry: r18 / 4, back: true }, { at: f18.p["O'"], rx: r18, ry: r18 / 4 },
    { at: f18.p.R, rx: r18, ry: r18 / 4, back: true }, { at: f18.p.A1.map((v, i) => (v + f18.p.B1[i]) / 2) as Pt, rx: r18, ry: r18 / 4, back: true },
  ],
}

export const M93: EnModel = {
  id: 'en-93',
  title: 'Paralela 45, Testul 62',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 202–204',
  items: [
    { text: 'Rezultatul calculului $\\left(1-\\dfrac{4}{3}\\right)^2\\cdot\\dfrac{27}{4}$ este:', choices: ['$4{,}5$', '$0{,}75$', '$1{,}5$', '$1$'], ans: 1 },
    {
      text: 'În diagrama alăturată sunt prezentate opțiunile celor $30$ de elevi ai clasei a VIII-a D, cu privire la alegerea șefului clasei. Numărul voturilor obținute de Ioana a fost:',
      choices: ['$10$', '$11$', '$12$', '$13$'], ans: 3, fig: fig2,
    },
    { text: 'Se aruncă un zar. Probabilitatea ca numărul punctelor care apar pe fața de sus a zarului să fie un divizor al lui $10$ este:', choices: ['$\\dfrac{1}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{2}{3}$', '$\\dfrac{1}{6}$'], ans: 1 },
    { text: 'Cel mai mare număr natural $\\overline{ab}$ pentru care $\\dfrac{a+3b}{5a-b}=\\dfrac{5}{9}$ este:', choices: ['$510$', '$48$', '$84$', '$96$'], ans: 2 },
    { text: 'Cel mai mare număr întreg care este mai mic decât $-4\\sqrt{3}$ este:', choices: ['$-7$', '$-6$', '$-5$', '$6$'], ans: 0 },
    { text: 'Roxana afirmă că jumătatea numărului $2^{10}$ este $2^5$. Afirmația Roxanei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine. Dacă punctul $M$ este mijlocul segmentului $AB$, $N$ este mijlocul segmentului $CD$, $MN=10$ cm și $BC=6$ cm, atunci lungimea segmentului $AD$ este egală cu:',
      choices: ['$2$ cm', '$4$ cm', '$14$ cm', '$8$ cm'], ans: 2, fig: fig7,
    },
    { text: 'Triunghiul $ABC$ din figura alăturată este echilateral, iar punctele $B$, $C$ și $D$ sunt coliniare. Măsura unghiului $ACD$ este:', choices: ['$60^\\circ$', '$120^\\circ$', '$90^\\circ$', '$135^\\circ$'], ans: 1, fig: fig8 },
    {
      text: 'În figura alăturată, $MN$ este o linie mijlocie a triunghiului $ABC$. Raportul dintre aria patrulaterului $ABMN$ și aria triunghiului $CMN$ este:',
      choices: ['$4$', '$\\dfrac{3}{4}$', '$3$', '$2$'], ans: 2, fig: fig9,
    },
    {
      text: 'Triunghiul $ABC$ din figura alăturată are $\\sphericalangle A=90^\\circ$, $BC=15$ cm și $\\sin\\sphericalangle C=\\dfrac{4}{5}$. Perimetrul triunghiului este:',
      choices: ['$36$ cm', '$30$ cm', '$48$ cm', '$52$ cm'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AC$ este bisectoarea unghiului $BAD$, iar măsura arcului mic $BD$ este $100^\\circ$. Unghiul $BAC$ are măsura de:',
      choices: ['$50^\\circ$', '$25^\\circ$', '$75^\\circ$', "$12^\\circ30'$"], ans: 1, fig: fig11,
    },
    {
      text: 'Pentru a vopsi toate fețele unui tetraedru regulat cu muchia de $6$ cm avem nevoie de $72$ g vopsea. Cantitatea de vopsea necesară pentru a acoperi toate fețele unui tetraedru regulat cu muchia de $1$ cm este:',
      choices: ['$12$ g', '$6$ g', '$2$ g', '$1$ g'], ans: 2,
    },

    {
      text: 'Denisa are cu $27$ de ani mai puțin decât mama ei, care are cu un an mai puțin decât tatăl fetei. Denisa este de cinci ori mai tânără decât tatăl său.',
      parts: [
        { pts: 2, text: 'Cu câți ani este mai tânără Denisa decât tatăl ei?', ans: '$27+1=28$ de ani' },
        { pts: 3, text: 'Determină vârsta Denisei.', ans: 'Tatăl are $5d$ ani: $5d-d=28$, deci Denisa are $7$ ani' },
      ],
    },
    {
      text: 'Se dă expresia $E(x)=\\left(\\dfrac{3}{2(x-1)}-\\dfrac{1}{2(x+1)}-\\dfrac{4}{x^2-1}\\right):\\dfrac{x-2}{x^2-2x+1}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x-1}{x+1}$, oricare ar fi $x\\in\\mathbb{R}\\setminus\\{-1,\\,1,\\,2\\}$.', ans: 'Paranteza este $\\dfrac{3(x+1)-(x-1)-8}{2(x^2-1)}=\\dfrac{x-2}{(x-1)(x+1)}$, deci $E(x)=\\dfrac{x-2}{(x-1)(x+1)}\\cdot\\dfrac{(x-1)^2}{x-2}=\\dfrac{x-1}{x+1}$' },
        { pts: 3, text: 'Determină numerele naturale $n$ pentru care $E(n)$ este un număr din intervalul $[0,\\,1]$.', ans: '$\\dfrac{n-1}{n+1}<1$ mereu și $\\dfrac{n-1}{n+1}\\geq0$ pentru $n\\geq1$; fără valorile excluse: $n\\in\\mathbb{N}\\setminus\\{0,\\,1,\\,2\\}$' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+2$, unde $a\\in\\mathbb{R}$, al cărei grafic, într-un reper ortogonal $xOy$, este reprezentat în figura alăturată. Punctul $A(1,\\,5)$ aparține reprezentării grafice a funcției.',
      parts: [
        { pts: 2, text: 'Arată că $a=3$.', ans: '$f(1)=a+2=5$, deci $a=3$' },
        { pts: 3, text: 'Determină punctul $B$, situat pe reprezentarea grafică a funcției, care are coordonate egale.', ans: '$3x+2=x$, deci $x=-1$: $B(-1,\\,-1)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată sunt reprezentate două pătrate, $ABCD$ și $CDEF$, având laturile de $10$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrează că distanța de la punctul $C$ la dreapta $AF$ este $2\\sqrt{5}$ cm.', ans: '$\\mathcal{A}_{ACF}=\\dfrac{CF\\cdot AB}{2}=50\\text{ cm}^2$ și $AF=\\sqrt{20^2+10^2}=10\\sqrt{5}$ cm, deci $d(C,\\,AF)=\\dfrac{2\\cdot50}{10\\sqrt{5}}=2\\sqrt{5}$ cm' },
        { pts: 3, text: 'Calculează sinusul unghiului $FAC$.', ans: 'Dacă $P$ este proiecția lui $C$ pe $AF$: $\\sin\\sphericalangle FAC=\\dfrac{CP}{AC}=\\dfrac{2\\sqrt{5}}{10\\sqrt{2}}=\\dfrac{1}{\\sqrt{10}}=\\dfrac{\\sqrt{10}}{10}$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $A$, $B$ și $C$ sunt trei puncte coliniare, astfel încât $BC=3AB=18$ cm. De aceeași parte a dreptei $AC$ se consideră punctele $D$ și $E$, astfel încât triunghiul $EAB$ este echilateral, iar triunghiul $BCD$ este isoscel cu $\\sphericalangle BDC=120^\\circ$.',
      parts: [
        { pts: 2, text: 'Arată că dreptele $BD$ și $BE$ sunt perpendiculare.', ans: '$\\sphericalangle ABE=60^\\circ$, $\\sphericalangle CBD=30^\\circ$, deci $\\sphericalangle DBE=180^\\circ-60^\\circ-30^\\circ=90^\\circ$' },
        { pts: 3, text: 'Demonstrează că dreptele $DE$ și $AC$ sunt paralele.', ans: '$BE=AB=6$ cm și $BD=\\dfrac{BC}{\\sqrt{3}}=6\\sqrt{3}$ cm; $\\operatorname{tg}\\sphericalangle DEB=\\dfrac{BD}{BE}=\\sqrt{3}$, deci $\\sphericalangle DEB=60^\\circ=\\sphericalangle ABE$ (alterne interne), de unde $DE\\parallel AC$' },
      ],
      fig: fig17,
    },
    {
      text: 'Un creion neascuțit are forma unui cilindru circular drept cu raza de $5$ mm și generatoarea de $20$ cm. Se ascute creionul, vârful ascuțit având forma unui con circular drept cu generatoarea de $13$ mm, ca în figura alăturată.',
      parts: [
        { pts: 2, text: 'Află volumul creionului neascuțit.', ans: '$V=\\pi\\cdot0{,}5^2\\cdot20=5\\pi\\text{ cm}^3$' },
        { pts: 3, text: 'Ce procent din volumul creionului s-a îndepărtat prin ascuțire?', ans: 'Conul are înălțimea $\\sqrt{13^2-5^2}=12$ mm; s-a îndepărtat $\\pi\\cdot25\\cdot12-\\dfrac{\\pi\\cdot25\\cdot12}{3}=200\\pi\\text{ mm}^3=\\dfrac{\\pi}{5}\\text{ cm}^3$, adică $4\\%$ din volumul inițial' },
      ],
      fig: fig18,
    },
  ],
}
