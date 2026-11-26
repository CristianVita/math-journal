// Testul 59 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 195–197; every answer here is computed and checked with the book's answers, p. 290).
import type { P3 } from '../figure'
import type { EnModel } from '../types'
import { along3, plane, solid } from '../figure'
import { box, BOX, graph, pol, TETRA } from './shapes'

const s3 = Math.sqrt(3), s6 = Math.sqrt(6)

const fig7 = plane({ A: [0, 0], B: [4, 0], C: [6, 0], D: [9, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], x: [4, 0], y: [0, 4], z: pol(220, 4) }, 110, { s: 'O-x O-y O-z', ra: ['xOy'], l: { O: 'se' } })
const C9 = [12 + 9 * Math.cos(0.7), 9 * Math.sin(0.7)] as [number, number]
const fig9 = plane({ A: [0, 0], B: [12, 0], C: C9, D: [C9[0] - 12, C9[1]] }, 140, { s: 'A-B-C-D-A' })
const fig10 = plane({ A: pol(150, 5), B: [0, 0], C: [8, 0] }, 150, { s: 'A-B-C-A' })
const fig11 = plane({ O: [0, 0], A: pol(180, 10) }, 90, { c: [{ at: 'O', r: 10 }], dot: 'A', l: { O: '', A: 'w' } })
const fig12 = solid(box(10, 1, 2), BOX, 160, { l: { A: '', B: '', C: '', D: '', "A'": '', "B'": '', "C'": '', "D'": '' } })

const fig15 = graph({ A: [2, 0], B: [0, 2], L1: [-2.5, 4.5], L2: [4, -2] }, 120, [-3, 4.5], [-2.3, 5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'n', B: 'ne' } })
const fig16 = plane({ A: [0, 0], B: [2, 0], C: [1.5, s3 / 2], D: [0.5, s3 / 2] }, 150, { s: 'A-B-C-D-A A-C' })
const a17 = 12 / 7
const fig17 = plane({ A: [0, 0], B: [4, 0], C: [4, 3], D: [0, 3], P: [4 - a17, 0], M: [4, a17], N: [4 - a17, a17] }, 140, { s: 'A-B-C-D-A A-C P-N-M', hatch: ['P-B-M-N'] })
const p18: Record<string, P3> = { C: [3, 0, 0], B: [0, 3 * s3, 0], D: [6, 3 * s3, 0], A: [3, 2 * s3, 2 * s6], O: [3, 2 * s3, 0] }
const fig18 = solid({ ...p18, M: along3(p18.A, p18.B, 0.5), N: along3(p18.A, p18.D, 0.5) }, TETRA('B', 'C', 'D', 'A'), 120, { seg: 'M-N A-O', dot: 'O', l: { O: 'se', M: 'nw', N: 'ne' } })

export const M90: EnModel = {
  id: 'en-90',
  title: 'Paralela 45, Testul 59',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 195–197',
  items: [
    { text: 'Opusul numărului rațional $a=3-0{,}4:0{,}1$ este:', choices: ['$-24$', '$-1$', '$1$', '$24$'], ans: 2 },
    { text: 'Dacă numerele reale $x$ și $y$ verifică relația $\\dfrac{x-1}{0{,}2}=\\dfrac{y+1}{0{,}(3)}$, atunci rezultatul calculului $5x-3y$ este:', choices: ['$8$', '$-2$', '$-8$', '$2$'], ans: 0 },
    { text: 'După o ieftinire cu $10\\%$, o mașină de spălat costă $900$ de lei. Prețul mașinii înainte de ieftinire era:', choices: ['$1000$ de lei', '$990$ de lei', '$810$ lei', '$1900$ de lei'], ans: 0 },
    { text: 'Numărul natural $n$ are proprietatea că produsul numerelor întregi din intervalul $[1,\\,n)$ este $6$. Valoarea numărului $n$ este:', choices: ['$2$', '$3$', '$4$', '$5$'], ans: 2 },
    { text: 'Se consideră numerele reale $a=\\dfrac{1}{2}-\\dfrac{1}{3}+\\dfrac{1}{12}$ și $b=\\sqrt{5^2-3^2}$. Media geometrică a numerelor $a$ și $b$ este:', choices: ['$1$', '$\\dfrac{\\sqrt{2}}{2}$', '$\\dfrac{3}{2}$', '$\\dfrac{1}{6}$'], ans: 0 },
    { text: 'Gabriel are o datorie de $20$ de lei față de Dorel. El îi dă $15$ lei lui Dorel și afirmă că îi rămâne dator cu încă $5$ lei. Afirmația lui Gabriel este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$ și $D$, în această ordine, astfel încât $AC=2CD$ și $AB=2BC$. Dacă lungimea segmentului $BC$ este egală cu $2$ cm, atunci lungimea segmentului $CD$ este egală cu:',
      choices: ['$9$ cm', '$4$ cm', '$2$ cm', '$3$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'Semidreptele $Ox$, $Oy$ și $Oz$, din figura alăturată, sunt poziționate astfel încât $Ox$ se află în exteriorul unghiului $yOz$. Știm că $\\sphericalangle xOy=90^\\circ$ și $\\sphericalangle yOz=130^\\circ$. Măsura unghiului $xOz$ este:',
      choices: ['$220^\\circ$', '$140^\\circ$', '$130^\\circ$', '$210^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'Paralelogramul $ABCD$ din figura alăturată are perimetrul de $42$ km, iar $AB-BC=3$ km. Lungimea segmentului $CD$ este egală cu:',
      choices: ['$9$ km', '$10$ km', '$11$ km', '$12$ km'], ans: 3, fig: fig9,
    },
    {
      text: 'Triunghiul $ABC$ din figura alăturată are $AB=5$ cm, $BC=8$ cm și $\\sphericalangle ABC=150^\\circ$. Aria triunghiului este:',
      choices: ['$10\\text{ cm}^2$', '$20\\text{ cm}^2$', '$24\\text{ cm}^2$', '$40\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'O piscină circulară are suprafața de $100\\pi\\text{ m}^2$. Adrian pleacă din punctul $A$, în sensul indicat de săgeata din figură, ocolește piscina și revine în punctul $A$. Distanța parcursă de Adrian, aproximată la cel mai apropiat număr întreg de metri, este:',
      choices: ['$10$ m', '$20$ m', '$62$ m', '$63$ m'], ans: 3, fig: fig11,
    },
    {
      text: 'Zidul din figura alăturată are forma unui paralelipiped dreptunghic cu dimensiunile bazei $10\\text{ m}\\times1$ m și înălțimea de $2$ m. Jorj văruiește toate fețele vizibile ale zidului, consumând câte $0{,}5\\ \\ell$ de var pentru fiecare metru pătrat de suprafață. Cantitatea totală de var pe care o consumă Jorj este:',
      choices: ['$27\\ \\ell$', '$22\\ \\ell$', '$44\\ \\ell$', '$18\\ \\ell$'], ans: 0, fig: fig12,
    },

    {
      text: 'Maria cumpără $12$ caiete și creioane, plătind, în total, $28$ de lei. Numărul creioanelor este dublul numărului de caiete. Un caiet este de cinci ori mai scump decât un creion.',
      parts: [
        { pts: 2, text: 'Câte caiete cumpără Maria?', ans: '$c+2c=12$, deci $4$ caiete (și $8$ creioane)' },
        { pts: 3, text: 'Care este prețul unui caiet?', ans: 'Cu $x$ prețul unui creion: $4\\cdot5x+8x=28$, deci $x=1$ leu și caietul costă $5$ lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x+3}{x+1}-\\dfrac{x+1}{x+3}\\right):\\dfrac{2x+4}{x^2+x}-\\dfrac{x-3}{x+3}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,-1,\\,0\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(1)=1$.', ans: '$E(1)=\\left(2-\\dfrac{1}{2}\\right):3+\\dfrac{1}{2}=\\dfrac{1}{2}+\\dfrac{1}{2}=1$' },
        { pts: 3, text: 'Demonstrează că $E(x)$ are o valoare constantă, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,-1,\\,0\\}$.', ans: '$\\dfrac{4(x+2)}{(x+1)(x+3)}\\cdot\\dfrac{x(x+1)}{2(x+2)}-\\dfrac{x-3}{x+3}=\\dfrac{2x-x+3}{x+3}=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2-x$. În figura alăturată, punctele $A$ și $B$ sunt intersecțiile reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului ortogonal $xOy$.',
      parts: [
        { pts: 2, text: 'Află coordonatele punctului $A$.', ans: '$f(x)=0$ pentru $x=2$, deci $A(2,\\,0)$' },
        { pts: 3, text: 'Determină coordonatele simetricului punctului $A$ față de punctul $B$.', ans: '$B(0,\\,2)$ este mijlocul segmentului $AA\'$: $x_{A\'}=2\\cdot0-2=-2$, $y_{A\'}=2\\cdot2-0=4$, deci $A\'(-2,\\,4)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este desenat un trapez cu baza mare $AB$. Se știe că $AB=2AD=2BC=2CD$.',
      parts: [
        { pts: 2, text: 'Arată că $\\sphericalangle ACD\\equiv\\sphericalangle CAB$.', ans: '$CD\\parallel AB$, iar $AC$ e secantă: unghiurile $ACD$ și $CAB$ sunt alterne interne, deci congruente' },
        { pts: 3, text: 'Determină măsurile unghiurilor trapezului.', ans: '$DA=DC$, deci $\\sphericalangle DAC=\\sphericalangle DCA=\\sphericalangle CAB$: $AC$ e bisectoarea unghiului $A$; ducând $CE\\parallel AD$, $E\\in AB$, $\\triangle EBC$ e echilateral, deci $\\sphericalangle A=\\sphericalangle B=60^\\circ$, $\\sphericalangle C=\\sphericalangle D=120^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'Un covor dreptunghiular are lungimea diagonalei $AC=5$ m și lungimea laturii $AB=4$ m. Un colț al covorului este acoperit de un șifonier, ca în figura alăturată; baza șifonierului este pătratul $BMNP$, cu $M\\in BC$, $N\\in AC$ și $P\\in AB$.',
      parts: [
        { pts: 2, text: 'Află aria covorului.', ans: '$BC=\\sqrt{25-16}=3$ m, deci aria este $12\\text{ m}^2$' },
        { pts: 3, text: 'Arată că lungimea segmentului $BM$ este $\\dfrac{12}{7}$ m.', ans: 'Cu $a$ latura pătratului: $\\triangle APN\\sim\\triangle ABC$, deci $\\dfrac{4-a}{4}=\\dfrac{a}{3}$ și $a=\\dfrac{12}{7}$ m' },
      ],
      fig: fig17,
    },
    {
      text: 'Tetraedrul regulat $ABCD$ din figura alăturată are înălțimea $AO$ de lungime $2\\sqrt{6}$ cm. Punctele $M$ și $N$ sunt mijloacele muchiilor $AB$, respectiv $AD$.',
      parts: [
        { pts: 2, text: 'Arată că lungimea segmentului $MN$ este $3$ cm.', ans: '$AO=\\dfrac{AB\\sqrt{6}}{3}$, deci $AB=6$ cm, iar $MN$ e linie mijlocie: $MN=\\dfrac{BD}{2}=3$ cm' },
        { pts: 3, text: 'Determină aria triunghiului $CPQ$, unde $P$ și $Q$ sunt proiecțiile punctelor $M$, respectiv $N$ pe planul $BCD$.', ans: '$P$ și $Q$ sunt mijloacele lui $OB$ și $OD$, deci $PQ=\\dfrac{BD}{2}=3$ cm și $d(C,\\,PQ)=CO+\\dfrac{1}{2}d(O,\\,BD)=2\\sqrt{3}+\\dfrac{\\sqrt{3}}{2}=\\dfrac{5\\sqrt{3}}{2}$ cm; $\\mathcal{A}_{CPQ}=\\dfrac{15\\sqrt{3}}{4}\\text{ cm}^2$' },
      ],
      fig: fig18,
    },
  ],
}
