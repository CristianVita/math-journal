// Testul 57 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 191–192; every answer here is computed and checked with the book's answers, p. 290).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, mid, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const fig2 = plane({ O: [0, 0], X: pol(90, 5), Y: pol(180, 5), Z: pol(-54, 5) }, 110, {
  s: 'O-X O-Y O-Z', c: [{ at: 'O', r: 5 }], l: { O: '', X: '', Y: '', Z: '' },
  t: [
    { at: pol(135, 2.7), s: 'americani', anchor: 'middle', size: 10 },
    { at: pol(18, 2.6), s: 'europeni', anchor: 'middle', size: 10 }, { at: [pol(18, 2.6)[0], pol(18, 2.6)[1] - 1.1], s: '40%', anchor: 'middle', size: 10 },
    { at: pol(243, 2.6), s: 'asiatici', anchor: 'middle', size: 10 }, { at: [pol(243, 2.6)[0], pol(243, 2.6)[1] - 1.1], s: '35%', anchor: 'middle', size: 10 },
  ],
})
const fig7 = plane({ A: [0, 0], B: [4, 0], C: [6, 0], D: [7, 0], E: [8, 0] }, 170, { s: 'A-E', dot: 'A B C D E', l: { A: 'n', B: 'n', C: 'n', D: 'n', E: 'n' } })
const B8: Pt = [0, 0], C8: Pt = [4, 0]
const fig8 = plane({ D: [-1.5, 0], B: B8, C: C8, E: [5.5, 0], A: meet(B8, pol(55), C8, pol(135, 1, C8)) }, 150, {
  s: 'D-E A-B A-C', l: { D: 's', B: 's', C: 's', E: 's' },
  t: [{ at: [-0.9, 0.35], s: '125°', size: 11 }, { at: [4.4, 0.35], s: '135°', size: 11 }],
})
const fig9 = plane({ A: [0, 0], B: [60, 0], C: [0, 45] }, 120, { s: 'A-B-C-A', ra: ['BAC'] })
const fig10 = plane({ A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1], F: [1, 2], H: [2, 1] }, 110, { s: 'A-B-C-D-A B-D-F-H-B' })
const fig11 = plane({ O: [0, 0], A: pol(110, 3), B: pol(10, 3), D: pol(170, 3), C: pol(310, 3) }, 110, { s: 'A-B D-C A-C', c: [{ at: 'O', r: 3 }], dot: 'O' })

const fig15 = graph({ A: [2, 0], B: [0, 4], L1: [-0.4, 4.8], L2: [2.6, -1.2] }, 100, [-1.2, 3.5], [-1.5, 5.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'ne', B: 'e' } })
const A16: Pt = [0, 3], B16: Pt = [-2, 0], C16: Pt = [0, -3], D16: Pt = [2, 0]
const M16 = mid(C16, D16), N16 = mid(A16, D16)
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, M: M16, N: N16 }, 110, { s: 'A-B-C-D-A B-M B-N', hatch: ['B-M-D-N'] })
const fig17 = plane({ O: [0, 0], A: [-5, 0], B: [5, 0], C: pol(60, 5) }, 110, { s: 'A-B A-C', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 's' } })
const fig18 = solid(box(12, 3, 4), BOX, 150)

export const M88: EnModel = {
  id: 'en-88',
  title: 'Paralela 45, Testul 57',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 191–192',
  items: [
    { text: 'Rezultatul calculului $4^0-5^1+0^6$ este:', choices: ['$-5$', '$-4$', '$4$', '$5$'], ans: 1 },
    {
      text: 'Diagrama alăturată arată repartiția celor $200$ de cercetători ai unui institut, în raport cu continentul de proveniență. Numărul cercetătorilor americani din acest institut este:',
      choices: ['$25$', '$40$', '$50$', '$60$'], ans: 2, fig: fig2,
    },
    { text: 'Numărul submulțimilor având cel mult două elemente ale mulțimii $M=\\{-1,\\,1,\\,3\\}$ este egal cu:', choices: ['$6$', '$7$', '$5$', '$8$'], ans: 1 },
    { text: 'Intervalul $(-2,\\,a]$ conține exact patru numere întregi, iar $a$ este un număr întreg. Valoarea numărului $a$ este:', choices: ['$1$', '$2$', '$3$', '$4$'], ans: 1 },
    { text: 'Media geometrică a numerelor $a=3-\\sqrt{8}$ și $b=(\\sqrt{2}+1)^2$ este:', choices: ['$3$', '$2\\sqrt{2}$', '$0$', '$1$'], ans: 3 },
    { text: 'Un robinet are debitul de $10$ litri pe minut. Mama spune că acest robinet va umple cada de $150$ litri în mai puțin de un sfert de oră. Afirmația mamei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$ și $E$ sunt coliniare, în această ordine, astfel încât $AB=BE$, $BC=CE$ și $CD=DE$. Valoarea raportului $\\dfrac{AD}{AE}$ este egală cu:',
      choices: ['$\\dfrac{4}{3}$', '$\\dfrac{5}{6}$', '$\\dfrac{7}{8}$', '$\\dfrac{8}{7}$'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, punctele $B$, $C$, $D$ și $E$ sunt coliniare. Unghiurile $ABD$ și $ACE$ au măsurile $125^\\circ$, respectiv $135^\\circ$. Măsura unghiului $BAC$ este egală cu:',
      choices: ['$80^\\circ$', '$85^\\circ$', '$90^\\circ$', '$100^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'Triunghiul dreptunghic $ABC$, din figura alăturată, are catetele $AB=60$ cm și $AC=45$ cm. Distanța dintre ortocentrul triunghiului și centrul cercului circumscris este:',
      choices: ['$37{,}5$ cm', '$50$ cm', '$75$ cm', '$30$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ și $BDFH$ sunt pătrate. Aria pătratului $ABCD$ este $75\\text{ cm}^2$. Aria pătratului $BDFH$ este:',
      choices: ['$100\\text{ cm}^2$', '$150\\text{ cm}^2$', '$225\\text{ cm}^2$', '$300\\text{ cm}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată sunt reprezentate punctele $A$, $B$, $C$ și $D$ pe un cerc de centru $O$. Dreptele $AB$ și $CD$ sunt paralele, iar arcele mici $AB$ și $CD$ au măsurile egale cu $100^\\circ$, respectiv $140^\\circ$. Măsura unghiului $ACD$ este egală cu:',
      choices: ['$120^\\circ$', '$60^\\circ$', '$30^\\circ$', '$10^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'Un cilindru circular drept are raza bazei egală cu $6$ cm și perimetrul secțiunii axiale egal cu $40$ cm. Aria laterală a cilindrului este egală cu:',
      choices: ['$48\\pi\\text{ cm}^2$', '$96\\pi\\text{ cm}^2$', '$64\\pi\\text{ cm}^2$', '$128\\pi\\text{ cm}^2$'], ans: 1,
    },

    {
      text: 'Două kilograme de roșii și patru kilograme de cartofi costă $22$ de lei. Un kilogram de roșii este cu $2$ lei mai scump decât unul de cartofi.',
      parts: [
        { pts: 2, text: 'Este posibil ca un kilogram de cartofi să coste $2{,}50$ lei? Justifică răspunsul.', ans: 'Nu: roșiile ar costa $4{,}50$ lei/kg și $2\\cdot4{,}5+4\\cdot2{,}5=19\\neq22$' },
        { pts: 3, text: 'Află prețul unui kilogram de roșii.', ans: 'Cu $c$ prețul cartofilor: $2(c+2)+4c=22$, deci $c=3$ și roșiile costă $5$ lei/kg' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x+2}{x-1}-\\dfrac{x-1}{x+2}+\\dfrac{9}{x^2+x-2}\\right):\\dfrac{3}{1-x}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2+x-2=(x-1)(x+2)$, pentru orice număr real $x$.', ans: '$(x-1)(x+2)=x^2+2x-x-2=x^2+x-2$' },
        { pts: 3, text: 'Demonstrează că $E(x)=-2$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,1\\}$.', ans: '$\\dfrac{(x+2)^2-(x-1)^2+9}{(x-1)(x+2)}=\\dfrac{6x+12}{(x-1)(x+2)}=\\dfrac{6}{x-1}$, deci $E(x)=\\dfrac{6}{x-1}\\cdot\\dfrac{1-x}{3}=-2$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=4-2x$.',
      parts: [
        { pts: 2, text: 'Punctul $P(1,\\,a)$ aparține reprezentării grafice a funcției. Determină numărul real $a$.', ans: '$a=f(1)=2$' },
        { pts: 3, text: 'Reprezentarea grafică a funcției intersectează axele $Ox$ și $Oy$ ale reperului ortogonal $xOy$ în punctele $A$, respectiv $B$. Află lungimea segmentului $AB$.', ans: '$A(2,\\,0)$, $B(0,\\,4)$, deci $AB=\\sqrt{4+16}=2\\sqrt{5}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentată o bucată de material textil sub forma rombului $ABCD$. O croitoreasă are nevoie de suprafața patrulateră $BMDN$ hașurată; punctele $M$ și $N$ sunt mijloacele segmentelor $CD$, respectiv $AD$.',
      parts: [
        { pts: 2, text: 'Arată că segmentele $BM$ și $BN$ au lungimi egale.', ans: '$\\triangle ABN\\equiv\\triangle CBM$ (LUL: $AB=CB$, $AN=CM$, $\\sphericalangle A=\\sphericalangle C$), deci $BN=BM$' },
        { pts: 3, text: 'Demonstrează că materialul folosit de croitoreasă are aria egală cu jumătate din cea a bucății inițiale.', ans: '$BN$ e mediană în $\\triangle ABD$ și $BM$ în $\\triangle BCD$: $\\mathcal{A}_{BND}=\\dfrac{1}{2}\\mathcal{A}_{ABD}$, $\\mathcal{A}_{BMD}=\\dfrac{1}{2}\\mathcal{A}_{BCD}$, deci $\\mathcal{A}_{BMDN}=\\dfrac{1}{2}\\mathcal{A}_{ABCD}$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $AB$ este un diametru al cercului de centru $O$, iar $AC$ este o coardă a acestuia. Segmentele $AB$ și $AC$ au lungimile $10$ cm, respectiv $5\\sqrt{3}$ cm.',
      parts: [
        { pts: 2, text: 'Arată că măsura unghiului $ACB$ este $90^\\circ$.', ans: '$\\sphericalangle ACB$ este înscris într-un semicerc, deci $\\sphericalangle ACB=\\dfrac{180^\\circ}{2}=90^\\circ$' },
        { pts: 3, text: 'Determină lungimea arcului mic $BC$.', ans: '$\\cos\\sphericalangle BAC=\\dfrac{AC}{AB}=\\dfrac{\\sqrt{3}}{2}$, deci $\\sphericalangle BAC=30^\\circ$ și arcul $BC$ are $60^\\circ$; lungimea lui este $\\dfrac{2\\pi\\cdot5\\cdot60^\\circ}{360^\\circ}=\\dfrac{5\\pi}{3}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "Paralelipipedul dreptunghic $ABCDA'B'C'D'$ din figura alăturată are dimensiunile $AB=12$ m, $BC=3$ m și $AA'=4$ m.",
      parts: [
        { pts: 2, text: 'Calculează aria totală a paralelipipedului.', ans: '$\\mathcal{A}_t=2(12\\cdot3+12\\cdot4+3\\cdot4)=192\\text{ m}^2$' },
        { pts: 3, text: "Determină distanța de la punctul $A$ la dreapta $B'C$.", ans: "Fie $P$ proiecția lui $B$ pe $B'C$: $BP=\\dfrac{3\\cdot4}{5}=\\dfrac{12}{5}$ m; din teorema celor trei perpendiculare $AP\\perp B'C$, deci $d(A,\\,B'C)=AP=\\sqrt{12^2+\\left(\\dfrac{12}{5}\\right)^2}=\\dfrac{12\\sqrt{26}}{5}$ m" },
      ],
      fig: fig18,
    },
  ],
}
