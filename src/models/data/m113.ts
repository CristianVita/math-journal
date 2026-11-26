// Testul 82 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 245–247; every answer here is computed and checked with the book's answers, pp. 298–299).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, plane, solid } from '../figure'
import { box, BOX, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [1, 0], C: [2, 0], D: [3, 0], E: [4, 0] }, 170, { s: 'A-E', dot: 'A B C D E', l: { A: 'n', B: 'n', C: 'n', D: 'n', E: 'n' } })
// a ∥ b (slanted), c ∥ d (horizontal): 110° at a∩c, 2x° − 10° at b∩d
const U1: Pt = [1.2, 3.4], U2: Pt = [-0.4, -0.6], V1: Pt = [4.2, 3.4], V2: Pt = [2.6, -0.6], L1: Pt = [-0.6, 2.4], R1: Pt = [6.2, 2.4], L2: Pt = [-0.6, 0.8], R2: Pt = [6.2, 0.8]
const fig8 = plane({ U1, U2, V1, V2, L1, R1, L2, R2, X1: meet(U1, U2, L1, R1), X2: meet(V1, V2, L2, R2) }, 160, {
  s: 'U1-U2 V1-V2 L1-R1 L2-R2', ang: ['L1X1U1', 'R2X2V1'],
  l: { U1: '', U2: '', V1: '', V2: '', L1: '', R1: '', L2: '', R2: '', X1: '', X2: '' },
  t: [
    { at: [0.15, 2.7], s: '110°', anchor: 'end', size: 9 }, { at: [3.95, 1.0], s: '2x° − 10°', anchor: 'start', size: 9 },
    { at: [1.35, 3.1], s: 'a', italic: true }, { at: [4.35, 3.1], s: 'b', italic: true }, { at: [-0.5, 2.0], s: 'c', italic: true }, { at: [-0.5, 0.4], s: 'd', italic: true },
  ],
})
// right angle at B, ∡C = 30°, AB = 12; M the projection of B on the bisector of ∡BAC
const A9: Pt = [0, 0], B9: Pt = [0, 12], C9: Pt = [-12 * s3, 12], M9: Pt = [-3 * s3, 9]
const fig9 = plane({ A: A9, B: B9, C: C9, M: M9 }, 150, { s: 'A-B-C-A B-M A-M', ra: ['ABC', 'BMA'] })
const fig10 = plane({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], N: [3, 0], O: [3, 3], M: [4.5, 1.5 * s3] }, 120, {
  s: 'A-B-C-D-A A-M-B M-N N-O-M', d: 'D-O', ra: ['AMB'], l: { O: 'w' },
})
const fig11 = plane({ O: [0, 0], A: pol(0, 4), C: pol(180, 4), B: pol(240, 4), D: pol(60, 4) }, 110, { s: 'A-C B-D A-B-C', c: [{ at: 'O', r: 4 }], dot: 'O', l: { O: 'n' } })

const A16: Pt = [0, 0], B16: Pt = [10, 0], D16: Pt = [-0.75, Math.sqrt(36 - 0.5625)], C16: Pt = [3.25, Math.sqrt(36 - 0.5625)], M16: Pt = [4, 0], N16: Pt = [6, 0]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, M: M16, N: N16, P: meet(C16, M16, D16, N16) }, 150, { s: 'A-B-C-D-A C-M D-N', l: { P: 'e' } })
const fig17 = plane({ A: [0, Math.sqrt(48)], B: [1, 0], C: [-1, 0], D: [-4, 0] }, 120, { s: 'A-B-D-A A-C' })
const fig18 = solid({ ...box(6, 6, 6), M: [3, 0, 0], N: [4, 4, 0] }, BOX, 120, { seg: "A-C A'-N B'-N", l: { M: 's', N: 'e' } })

export const M113: EnModel = {
  id: 'en-113',
  title: 'Paralela 45, Testul 82',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 245–247',
  items: [
    { text: 'Rezultatul calculului $|-3|+12:(-4)$ este egal cu:', choices: ['$-6$', '$0$', '$6$', '$1$'], ans: 1 },
    { text: 'Dacă $\\dfrac{a+b}{b}=2\\dfrac{1}{3}$, cu $b\\neq0$, atunci raportul $\\dfrac{a}{b}$ este egal cu:', choices: ['$\\dfrac{3}{4}$', '$\\dfrac{7}{3}$', '$\\dfrac{4}{3}$', '$1$'], ans: 2 },
    { text: 'Fie $x_1$ și $x_2$ soluțiile ecuației $4x^2-8x+3=0$. Atunci $|x_1-x_2|$ este:', choices: ['$-1$', '$1$', '$2$', '$\\dfrac{3}{2}$'], ans: 1 },
    {
      text: 'Dintre numerele $1$, $-\\dfrac{4}{5}$, $\\dfrac{1}{2}$ și $-\\dfrac{1}{3}$, cel mai apropiat de $0$ pe axa numerelor este:',
      choices: ['$-\\dfrac{1}{3}$', '$\\dfrac{1}{2}$', '$-\\dfrac{4}{5}$', '$1$'], ans: 0,
    },
    {
      text: 'Ana, Bogdan, Cezara și Darius au avut de calculat media aritmetică a numerelor $x=\\left(\\dfrac{17}{34}+\\dfrac{13}{39}+\\dfrac{11}{66}\\right):\\sqrt{2^{-1}}$ și $y=1-\\sqrt{\\left(1-\\sqrt{2}\\right)^2}$. Rezultatele obținute sunt trecute în tabelul următor.\n\n| Ana | Bogdan | Cezara | Darius |\n|---|---|---|---|\n| $2\\sqrt{2}-2$ | $\\sqrt{2}-1$ | $2$ | $1$ |\n\nRezultatul corect a fost obținut de:',
      choices: ['Bogdan', 'Ana', 'Darius', 'Cezara'], ans: 2,
    },
    {
      text: 'Marius afirmă: „Cubul cu latura de $6$ cm are volumul egal cu aria totală”. Afirmația lui Marius este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$, $D$, $E$, în această ordine, astfel încât $AB=BC=CD=DE$. Numărul grupelor de câte trei puncte, alese dintre punctele anterioare, pentru care unul este mijlocul segmentului cu capetele în celelalte două puncte este:',
      choices: ['$2$', '$3$', '$4$', '$5$'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată se știe că $a\\parallel b$ și $c\\parallel d$. Valoarea lui $x$ este:',
      choices: ['$70$', '$40$', '$35$', '$60$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată triunghiul $ABC$ este dreptunghic în $B$. Dacă $\\sphericalangle C=30^\\circ$, $AB=12$ cm și $M$ este proiecția punctului $B$ pe bisectoarea $\\sphericalangle BAC$, atunci distanța de la punctul $M$ la dreapta $BC$ este egală cu:',
      choices: ['$6$ cm', '$6\\sqrt{3}$ cm', '$3$ cm', '$3\\sqrt{3}$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat pătratul $ABCD$, având latura de $6$ cm, $N$ este mijlocul laturii $AB$, iar $O$ este centrul pătratului. În interior este considerat triunghiul dreptunghic $MAB$, cu ipotenuza $AB$ și $\\sphericalangle MAB=30^\\circ$. Aria triunghiului $MNO$ este:',
      choices: ['$\\dfrac{9}{2}\\text{ cm}^2$', '$\\dfrac{3}{2}\\text{ cm}^2$', '$2{,}25\\text{ cm}^2$', '$9\\text{ cm}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată sunt reprezentate un cerc de centru $O$ și o coardă $AB$ cu lungimea de $4\\sqrt{3}$ cm. Dacă $C$ și $D$ sunt punctele diametral opuse punctelor $A$, respectiv $B$ și $BC=4$ cm, atunci măsura arcului mic $CD$ este egală cu:',
      choices: ['$30^\\circ$', '$60^\\circ$', '$90^\\circ$', '$120^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'Un con circular drept are aria totală egală cu $36\\pi\\text{ cm}^2$ și perimetrul secțiunii axiale egal cu $18$ cm. Volumul conului este egal cu:',
      choices: ['$16\\pi\\text{ cm}^3$', '$12\\pi\\text{ cm}^3$', '$15\\pi\\text{ cm}^3$', '$9\\pi\\text{ cm}^3$'], ans: 0,
    },

    {
      text: 'Într-o clasă a VIII-a sunt $30$ de elevi. Dacă băieții ar fi cu $3$ mai mulți, atunci jumătate din numărul lor ar reprezenta $60\\%$ din numărul fetelor.',
      parts: [
        { pts: 2, text: 'Justifică dacă numărul fetelor poate fi egal cu $10$.', ans: 'Nu: ar fi $20$ de băieți, iar $\\dfrac{23}{2}\\neq\\dfrac{3\\cdot10}{5}=6$' },
        { pts: 3, text: 'Determină numărul băieților din clasă.', ans: '$f+b=30$ și $\\dfrac{b+3}{2}=\\dfrac{3f}{5}$, deci $5b+15=6(30-b)$, $b=15$ băieți' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x+9}{x^3-9x}+\\dfrac{2}{3x-x^2}+\\dfrac{3}{x^2+3x}\\right)\\cdot\\left(\\dfrac{x^2-x+1}{x^2+3x}\\right)^{-1}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,0,\\,3\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{8}{(2x-1)^2+3}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,0,\\,3\\}$.', ans: 'Paranteza este $\\dfrac{x+9-2(x+3)+3(x-3)}{x(x-3)(x+3)}=\\dfrac{2}{x(x+3)}$, deci $E(x)=\\dfrac{2}{x^2-x+1}=\\dfrac{8}{4x^2-4x+4}=\\dfrac{8}{(2x-1)^2+3}$' },
        { pts: 3, text: 'Determină cea mai mare valoare a expresiei $E(x)$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,0,\\,3\\}$.', ans: '$E(x)$ este maximă când $(2x-1)^2+3$ este minimă, adică pentru $x=\\dfrac{1}{2}$: $E\\left(\\dfrac{1}{2}\\right)=\\dfrac{8}{3}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-\\dfrac{x}{2}+1$.',
      parts: [
        { pts: 2, text: 'Află coordonatele punctelor situate pe reprezentarea grafică a funcției $f$, în sistemul de axe ortogonale $xOy$, care se găsesc la distanța $2$ față de axa ordonatelor.', ans: 'Abscisa este $2$ sau $-2$: $f(2)=0$ și $f(-2)=2$, deci $P(2,\\,0)$ și $Q(-2,\\,2)$' },
        { pts: 3, text: 'Rezolvă inecuația $2f(x)-f\\left(\\dfrac{x}{2}\\right)<0$.', ans: '$2\\left(-\\dfrac{x}{2}+1\\right)-\\left(-\\dfrac{x}{4}+1\\right)<0\\iff1-\\dfrac{3x}{4}<0$, deci $x\\in\\left(\\dfrac{4}{3},\\,+\\infty\\right)$' },
      ],
    },
    {
      text: 'În figura alăturată $ABCD$ este un trapez, având $AB\\parallel DC$, $AB=10$ cm, $CD=4$ cm, $AD=6$ cm și $BC=9$ cm. Punctele $M$ și $N\\in AB$, astfel încât $CM\\parallel AD$ și $DN\\parallel BC$, iar $\\{P\\}=CM\\cap DN$.',
      parts: [
        { pts: 2, text: 'Demonstrează că triunghiul $MNP$ este isoscel.', ans: '$ADCM$ și $BCDN$ sunt paralelograme, deci $AM=BN=4$ cm, $MN=2$ cm; $\\triangle NMP\\sim\\triangle NAD$, deci $\\dfrac{MP}{AD}=\\dfrac{NM}{NA}=\\dfrac{2}{6}$, $MP=2$ cm $=MN$' },
        { pts: 3, text: 'Calculează valoarea raportului $\\dfrac{\\mathcal{A}_{ABCD}}{\\mathcal{A}_{MNP}}$.', ans: 'Fie $s=\\mathcal{A}_{MNP}$; $\\triangle MNP\\sim\\triangle CDP$ cu raportul $2$, deci $\\mathcal{A}_{CDP}=4s$; la fel, $\\mathcal{A}_{ADPM}=\\mathcal{A}_{BCPN}=8s$, deci $\\mathcal{A}_{ABCD}=21s$ și raportul este $21$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul isoscel $ABC$, având baza $BC=2$ cm și perimetrul egal cu $16$ cm. Punctul $D$ se află pe semidreapta $BC$ și $BD=5$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrează că $AD=8$ cm.', ans: '$AB=AC=7$ cm; dacă $H$ este mijlocul lui $BC$, $AH=\\sqrt{49-1}=\\sqrt{48}$ cm, $HD=4$ cm, deci $AD=\\sqrt{48+16}=8$ cm' },
        { pts: 3, text: 'Justifică relația $\\sphericalangle ABC>60^\\circ$.', ans: 'În $\\triangle ABD$, $AD=8$ cm este latura cea mai mare ($AB=7$ cm, $BD=5$ cm), deci $\\sphericalangle ABD$ este unghiul cel mai mare și are mai mult de $60^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat cubul $ABCDA'B'C'D'$ în care punctul $M$ este mijlocul laturii $AB$ și $N\\in(AC)$, cu $AN=2NC$. Lungimea segmentului $A'N$ este de $2\\sqrt{17}$ cm.",
      parts: [
        { pts: 2, text: "Arată că perimetrul patrulaterului $ABC'D'$ este $12(\\sqrt{2}+1)$ cm.", ans: "Cu latura $a$: $AN=\\dfrac{2a\\sqrt{2}}{3}$, $A'N^2=a^2+\\dfrac{8a^2}{9}=68$, deci $a=6$ cm; $ABC'D'$ este dreptunghi cu laturile $6$ și $6\\sqrt{2}$ cm, deci $\\mathcal{P}=12(\\sqrt{2}+1)$ cm" },
        { pts: 3, text: "Demonstrează relația $B'N\\parallel(D'DM)$.", ans: "În baza $ABCD$, cu $A$ în origine: $B(6,\\,0)$, $N(4,\\,4)$, $M(3,\\,0)$, $D(0,\\,6)$, iar $\\overrightarrow{BN}=(-2,\\,4)$ și $\\overrightarrow{MD}=(-3,\\,6)$ sunt paralele, deci $BN\\parallel DM$; cum $BB'\\parallel DD'$, $(B'BN)\\parallel(D'DM)$ și $B'N\\parallel(D'DM)$" },
      ],
      fig: fig18,
    },
  ],
}
