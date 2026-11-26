// Testul 80 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 241–243; every answer here is computed and checked with the book's answers, p. 297).
import type { Fig, Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, mid, plane } from '../figure'
import { graph, pol } from './shapes'

// the pie chart: rapiță 10%, porumb 30%, grâu 60%
const fig2 = plane({ O: [0, 0], U: pol(90, 3), V: pol(54, 3), W: pol(-162, 3) }, 90, {
  s: 'O-U O-V O-W', c: [{ at: 'O', r: 3 }], l: { O: '', U: '', V: '', W: '' },
  t: [
    { at: [1.6, 3.3], s: 'rapiță', anchor: 'start', size: 8 }, { at: [-1.3, 1.2], s: 'porumb', anchor: 'middle', size: 8 }, { at: [-1.3, 0.4], s: '30%', anchor: 'middle', size: 8 },
    { at: [0.9, -0.9], s: 'grâu', anchor: 'middle', size: 8 }, { at: [0.9, -1.7], s: '60%', anchor: 'middle', size: 8 },
  ],
})

const fig7 = plane({ A: [0, 0], M: [2.5, 0], B: [5, 0], C: [25, 0] }, 170, { s: 'A-C', dot: 'A M B C', l: { A: 'n', M: 'n', B: 'n', C: 'n' } })
// a ⊥ b, a third line through their common point: x between it and a, x + 10° between it and b
const fig8 = plane({ O: [0, 0], U: [0, 3], D: [0, -1.5], L: [-1.5, 0], R: [4, 0], S: pol(50, 3.4), T: pol(230, 1.6) }, 120, {
  s: 'U-D L-R S-T', ang: ['UOS', 'SOR'], ra: ['ROU'], l: { O: '', U: '', D: '', L: '', R: '', S: '', T: '' },
  t: [
    { at: [0.25, 1.4], s: 'x', italic: true, size: 9 }, { at: [1.5, 0.4], s: 'x + 10°', anchor: 'start', size: 9 },
    { at: [-0.35, 2.7], s: 'a', italic: true }, { at: [3.7, -0.45], s: 'b', italic: true },
  ],
})
const A9: Pt = [0, 0], B9: Pt = [12, 0], C9: Pt = [12, 6], D9: Pt = [0, 6], E9 = mid(B9, C9)
const fig9 = plane({ A: A9, B: B9, C: C9, D: D9, E: E9, M: meet(A9, E9, B9, D9) }, 140, { s: 'A-B-C-D-A A-E B-D', l: { M: 'n' } })
const A10: Pt = [-4, 0], B10: Pt = [4, 0], C10: Pt = [0, -6], G10: Pt = [0, -2]
const fig10 = plane({ A: A10, B: B10, C: C10, G: G10, D: [0, 2] }, 100, { s: 'A-C-B-A A-D-B A-G-B', dot: 'G' })
const fig11 = plane({ O: [0, 0], A: [0, 1], B: [-1, 0], C: [-3, 0], D: [0, 3] }, 100, {
  s: 'O-C O-D', c: [{ at: 'O', r: 1 }, { at: 'O', r: 3 }], dot: 'O', ra: ['BOA'], l: { O: 'se', A: 'ne', B: 'n' },
})

const fig15 = graph({ L1: [-2, 5], L2: [5, -2], K1: [-3, -2], K2: [3, 4] }, 130, [-3.5, 5.5], [-2.5, 5], {
  s: 'L1-L2 K1-K2', l: { L1: '', L2: '', K1: '', K2: '' },
})
const P16 = { A: [0, 0] as Pt, B: pol(-110, 12), C: pol(-80, 12), D: pol(-50, 12) }
const M16 = mid(P16.A, P16.D)
const fig16 = plane({ ...P16, M: M16, N: meet(P16.B, M16, P16.A, P16.C) }, 130, { s: 'A-B-C-D-A A-C B-M', ra: ['BMA'], l: { N: 'e' } })
const fig17 = plane({ A: [0, 0], B: [15, 0], C: [15, 8], D: [0, 8], M: [0, 4], N: [10, 0] }, 140, { s: 'A-B-C-D-A M-N-C' })
// the funnel: the cone with its vertex V down, drawn by hand
const fig18: Fig = {
  w: 150, h: 140,
  p: { A: [10, 25], B: [140, 25], O: [75, 25], V: [75, 130] },
  l: { A: 'w', B: 'e', O: 'n', V: 's' },
  s: 'V-A V-B', d: 'A-B V-O',
  e: [{ at: 'O', rx: 65, ry: 14 }],
}

export const M111: EnModel = {
  id: 'en-111',
  title: 'Paralela 45, Testul 80',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 241–243',
  items: [
    { text: 'Împărțind pe $87$ la $n$, unde $n$ este un număr natural nenul, $n\\le50$, obținem restul $10$. Valoarea lui $n$ este:', choices: ['$7$', '$11$', '$1$', '$77$'], ans: 1 },
    {
      text: 'Un fermier a cultivat pe terenul său trei tipuri de culturi, ponderea acestora fiind prezentată în diagrama alăturată. Dacă rapița a fost plantată pe $5$ ha, atunci suprafața cultivată de fermier este de:',
      choices: ['$90$ ha', '$30$ ha', '$50$ ha', '$100$ ha'], ans: 2, fig: fig2,
    },
    {
      text: 'Fie $n$ un număr întreg negativ. Dacă suma numerelor întregi din intervalul $(n,\\,0)$ este egală cu $-3$, atunci valoarea lui $n$ este:',
      choices: ['$-2$', '$-1$', '$-4$', '$-3$'], ans: 3,
    },
    {
      text: 'Fie $n$ un număr natural, astfel încât fracția $\\dfrac{6}{n-1}$ este număr întreg. Produsul tuturor valorilor lui $n$ care îndeplinesc această condiție este egal cu:',
      choices: ['$36$', '$168$', '$0$', '$24$'], ans: 2,
    },
    {
      text: 'Patru elevi, Paul, Elvira, Ștefan și Denisa, au avut de determinat aproximarea prin adaos la cifra sutimilor a numărului $\\pi=3{,}1415\\ldots$ Rezultatele obținute sunt înregistrate în tabelul următor.\n\n| Paul | Elvira | Ștefan | Denisa |\n|---|---|---|---|\n| $3{,}142$ | $3{,}2$ | $3{,}14$ | $3{,}15$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Paul', 'Denisa', 'Ștefan', 'Elvira'], ans: 1,
    },
    {
      text: 'Remus afirmă că în intervalul $\\left(\\sqrt{5},\\,\\sqrt{8}\\right)$ nu există numere întregi. Afirmația lui Remus este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, iar $AC=5AB$. Punctul $M$ este mijlocul segmentului $AB$ și $AM=2{,}5$ cm. Lungimea segmentului $BC$ este egală cu:',
      choices: ['$25$ cm', '$17{,}5$ cm', '$20$ cm', '$15$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $a$ și $b$ sunt perpendiculare. Valoarea lui $x$ este:',
      choices: ['$90^\\circ$', '$130^\\circ$', '$40^\\circ$', '$140^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'Figura alăturată reprezintă o rețea de drumuri care unesc localitățile $A$, $B$, $C$, $D$ și $E$. Punctele $A$, $B$, $C$, $D$ sunt vârfurile unui dreptunghi, $E$ este la mijlocul distanței dintre $B$ și $C$, iar intersecția drumurilor $AE$ și $BD$ este reprezentată de punctul $M$. Dacă distanța de la $A$ la $M$ este parcursă la pas în $2$ ore, atunci timpul necesar pentru a ajunge la pas din $A$ în $E$ este:',
      choices: ['$1$ h', '$3$ h', '$4$ h', '$30$ min'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$, având aria egală cu $300\\text{ m}^2$. Dacă punctul $D$ este simetricul centrului de greutate $G$ față de latura $AB$, atunci aria patrulaterului $DACB$ este:',
      choices: ['$400\\text{ m}^2$', '$200\\text{ m}^2$', '$350\\text{ m}^2$', '$330\\text{ m}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'Cercurile din figura alăturată au același centru $O$. Dacă $OA=1$ cm, $OC=3$ cm și lungimea arcului mic $AB$ este egală cu $\\dfrac{\\pi}{2}$ cm, atunci lungimea arcului mic $CD$ va fi egală cu:',
      choices: ['$9\\pi$ cm', '$\\pi$ cm', '$90^\\circ$', '$\\dfrac{3\\pi}{2}$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'Numărul de bile metalice cu raza de $1$ cm ce trebuie topite pentru a putea obține o bilă cu raza de $1$ dm este:',
      choices: ['$100$', '$10$', '$1000$', '$250$'], ans: 2,
    },

    {
      text: 'Alexandra are câteva nuci. Ea a constatat că dacă le numără câte trei sau câte cinci, îi rămâne câte o nucă, iar dacă le numără câte șapte, obține un număr întreg de grupe.',
      parts: [
        { pts: 2, text: 'Este posibil ca Alexandra să aibă $31$ de nuci? Justifică răspunsul.', ans: 'Nu: $31$ nu se divide cu $7$' },
        { pts: 3, text: 'Determină numărul nucilor Alexandrei, știind că acest număr este cel mai mic posibil.', ans: '$n-1$ se divide cu $3$ și cu $5$, deci $n=15k+1$, iar $7\\mid n$: cel mai mic este $n=91$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(x-1+\\dfrac{1}{x+1}-\\dfrac{x}{2}\\right):\\left(\\dfrac{1}{x}-\\dfrac{2}{x+1}-\\dfrac{6-6x}{x^2+x}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)>0$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$E(x)=\\dfrac{x(x-1)}{2(x+1)}:\\dfrac{5(x-1)}{x(x+1)}=\\dfrac{x^2}{10}>0$, căci $x\\neq0$' },
        { pts: 3, text: 'Determină numerele întregi $n$ pentru care $E(n)<1$.', ans: '$\\dfrac{n^2}{10}<1$, cu $n\\in\\mathbb{Z}\\setminus\\{-1,\\,0,\\,1\\}$, deci $n\\in\\{-3,\\,-2,\\,2,\\,3\\}$' },
      ],
    },
    {
      text: 'Se consideră funcțiile $f,\\,g:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-x+3$, $g(x)=x+1$ și sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Află coordonatele punctului de intersecție dintre reprezentările grafice ale celor două funcții.', ans: '$-a+3=a+1$, deci $a=1$, $b=2$: $P(1,\\,2)$' },
        { pts: 3, text: 'Determină aria figurii delimitate de cele două reprezentări grafice și axa absciselor a sistemului de axe ortogonale $xOy$.', ans: 'Graficele taie $Ox$ în $A(3,\\,0)$ și $B(-1,\\,0)$, deci $\\mathcal{A}_{PAB}=\\dfrac{4\\cdot2}{2}=4$ u²' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată sunt reprezentate două triunghiuri isoscele cu interioarele disjuncte și $AB=AC=AD=12$ cm. Măsurile unghiurilor $BAC$ și $CAD$ sunt egale cu $30^\\circ$, punctul $M$ este mijlocul $AD$, iar punctul $N$ este intersecția dreptelor $BM$ și $AC$.',
      parts: [
        { pts: 2, text: 'Arată că $BM\\perp AD$.', ans: 'Triunghiul $BAD$ are $AB=AD$ și $\\sphericalangle BAD=60^\\circ$, deci este echilateral, iar mediana $BM$ este și înălțime' },
        { pts: 3, text: 'Demonstrează că lungimea segmentului $NC$ este mai mare de $5$ cm.', ans: '$BM$ este și bisectoare, deci $\\triangle ANB$ este isoscel și $AN=BN=\\dfrac{AM}{\\cos30^\\circ}=4\\sqrt{3}$ cm; $NC=12-4\\sqrt{3}>5\\iff7>4\\sqrt{3}\\iff49>48$' },
      ],
      fig: fig16,
    },
    {
      text: 'O grădină are forma dreptunghiului $ABCD$ din figura alăturată. Punctul $M$ este mijlocul laturii $AD$, iar punctul $N$ aparține laturii $AB$, astfel încât $AN=2NB$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiurile $BCN$ și $AMN$ au ariile egale.', ans: '$\\mathcal{A}_{BCN}=\\dfrac{1}{2}\\cdot\\dfrac{AB}{3}\\cdot AD=\\dfrac{AB\\cdot AD}{6}$ și $\\mathcal{A}_{AMN}=\\dfrac{1}{2}\\cdot\\dfrac{2AB}{3}\\cdot\\dfrac{AD}{2}=\\dfrac{AB\\cdot AD}{6}$' },
        { pts: 3, text: 'Dacă $\\mathcal{A}_{AMN}=60\\text{ m}^2$, află suprafața grădinii.', ans: '$\\dfrac{AB\\cdot AD}{6}=60$, deci $\\mathcal{A}_{ABCD}=360\\text{ m}^2$' },
      ],
      fig: fig17,
    },
    {
      text: 'La un atelier, dintr-o bucată de tablă, având forma unui sector de disc cu unghiul la centru $\\alpha=216^\\circ$, se obține o pâlnie conică cu înălțimea $VO=24$ cm, ca în figura alăturată.',
      parts: [
        { pts: 2, text: 'Arată că suprafața bucății de tablă este mai mare decât $1690\\text{ cm}^2$.', ans: '$216^\\circ=360^\\circ\\cdot\\dfrac{R}{G}$ dă $R=\\dfrac{3G}{5}$, $VO=\\dfrac{4G}{5}=24$, deci $G=30$ cm, $R=18$ cm și $\\mathcal{A}_l=\\pi RG=540\\pi>540\\cdot3{,}14>1690\\text{ cm}^2$' },
        { pts: 3, text: 'Determină distanța de la punctul $A$ la dreapta $VB$.', ans: '$d(A,\\,VB)=\\dfrac{2\\mathcal{A}_{VAB}}{VB}=\\dfrac{AB\\cdot VO}{VB}=\\dfrac{36\\cdot24}{30}=28{,}8$ cm' },
      ],
      fig: fig18,
    },
  ],
}
