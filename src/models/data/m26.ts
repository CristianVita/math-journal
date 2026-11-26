// Testul 3 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 69–73; every answer here is computed and checked with the book's answers, p. 270).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { graph, pol, PRISM3 } from './shapes'

const s3 = Math.sqrt(3)
const c75 = Math.cos((75 * Math.PI) / 180), s75 = Math.sin((75 * Math.PI) / 180)

const fig7 = plane({ A: [0, 0], B: [9, 0], C: [21, 0] }, 160, { s: 'A-C', dot: 'A B C', l: { A: 'n', B: 'n', C: 'n' } })
const fig8 = plane({ A: [-6, 0], O: [0, 0], B: [6, 0], M: pol(195, 5), C: pol(210, 5), D: pol(330, 5), N: pol(345, 5) }, 150,
  { s: 'A-B O-M O-C O-D O-N', l: { O: 'n', A: 'n', B: 'n' } })
const fig9 = plane({ A: [0, 12 * s75], B: [-12 * c75, 0], C: [12 * c75, 0] }, 70, { s: 'A-B-C-A' })
const fig10 = plane({ A: [0, 0], B: [6 * s3, 0], C: [3 * s3, 3], D: [0, 3] }, 140, { s: 'A-B-C-D-A', ra: ['DAB', 'CDA'] })
const fig11 = plane({ O: [0, 0], A: [-6, 0], B: [6, 0], C: pol(240, 6) }, 120, { s: 'A-B A-C', c: [{ at: 'O', r: 6 }], dot: 'O', l: { O: 's' } })

const fig15 = graph({ A: [4, 0], B: [0, -2], L1: [-1.5, -2.75], L2: [7, 1.5] }, 130, [-2.5, 7.5], [-3.5, 2.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'n', B: 'w', O: 'nw' } })
const fig16 = plane({ A: [0, 0], B: [2, 0], C: [2, 2], D: [0, 2], M: [-1, 0], N: [-1, -1], P: [0, -1] }, 110, { s: 'A-B-C-D-A A-M-N-P-A', l: { A: 'ne', M: 'w', P: 'e' } })
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [4, 2 * s3], D: [0, 2 * s3] }, 140, { s: 'A-B-C-D-A', ra: ['DAB'] })
// A in front, as in the book: M = B + B' − A is then above the prism, on the left
const h18 = 6 * s3
const fig18 = solid({ A: [3, 0, 0], B: [0, 3 * s3, 0], C: [6, 3 * s3, 0], "A'": [3, 0, h18], "B'": [0, 3 * s3, h18], "C'": [6, 3 * s3, h18], M: [-3, 6 * s3, h18] }, PRISM3, 130, { seg: 'A-M M-B' })

export const M26: EnModel = {
  id: 'en-26',
  title: 'Paralela 45, Testul 3',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 69–73',
  items: [
    { text: 'Cardinalul mulțimii $A=\\{x\\in\\mathbb{N}\\mid 2^4\\le x<2^5\\}$ este:', choices: ['$1$', '$16$', '$17$', '$15$'], ans: 1 },
    { text: 'Dintre numerele $\\dfrac{5}{4}$, $\\dfrac{11}{7}$, $\\dfrac{7}{6}$, $\\dfrac{3}{9}$, cel care se transformă într-o fracție zecimală finită este:', choices: ['$\\dfrac{5}{4}$', '$\\dfrac{11}{7}$', '$\\dfrac{7}{6}$', '$\\dfrac{3}{9}$'], ans: 0 },
    { text: 'Suma numerelor $\\dfrac{1}{2}$, $\\dfrac{5}{6}$, $-1$ și $-\\dfrac{2}{3}$ este egală cu:', choices: ['$\\dfrac{1}{6}$', '$-\\dfrac{1}{3}$', '$-\\dfrac{2}{3}$', '$\\dfrac{1}{12}$'], ans: 1 },
    { text: 'Dacă $a-b=\\sqrt{2}$ și $a^2-b^2=\\sqrt{32}$, atunci media aritmetică a numerelor $a$ și $b$ este:', choices: ['$2$', '$4$', '$1$', '$2\\sqrt{2}$'], ans: 0 },
    {
      text: 'Patru elevi, Alin, Briana, Cornel și Doru, au avut de descompus în factori expresia $x^3-x^2-x+1$, unde $x\\in\\mathbb{R}$. Rezultatele obținute de cei patru elevi sunt trecute în tabelul următor:\n\n| Alin | Briana | Cornel | Doru |\n|---|---|---|---|\n| $(x-1)^2(x+1)$ | $(x+1)^2(x-1)$ | $(x-1)(x^2+1)$ | $x(x-1)(x+1)$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Briana', 'Cornel', 'Doru', 'Alin'], ans: 3,
    },
    { text: 'Prețul unui produs este $100$ de lei. Alexia afirmă că, după o scumpire cu $10\\%$, urmată de o ieftinire cu $10\\%$, prețul produsului va fi tot $100$ de lei. Afirmația Alexiei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, $A$, $B$ și $C$ sunt trei puncte coliniare, în această ordine, astfel încât lungimile segmentelor $AB$ și $BC$ sunt direct proporționale cu $3$ și $4$. Dacă $AC=21$ cm, atunci lungimea segmentului $AB$ este egală cu:',
      choices: ['$3$ cm', '$6$ cm', '$9$ cm', '$12$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiul alungit $AOB$ și punctele $M$, $C$, $D$, $N$, situate de aceeași parte a dreptei $AB$. Semidreapta $OM$ este bisectoarea unghiului $AOC$, iar semidreapta $ON$ este bisectoarea unghiului $BOD$. Dacă măsura unghiului $MON$ este $150^\\circ$, atunci măsura unghiului $DOC$ este egală cu:',
      choices: ['$75^\\circ$', '$90^\\circ$', '$120^\\circ$', '$100^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi isoscel, având $AB=AC=12$ cm și $\\sphericalangle ABC=75^\\circ$. Distanța de la punctul $C$ la dreapta $AB$ este egală cu:',
      choices: ['$6$ cm', '$9$ cm', '$3$ cm', '$8$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez dreptunghic în care $AB\\parallel CD$, $AB=2\\cdot CD$, $BC=6$ cm și $\\sphericalangle BCD=150^\\circ$. Aria trapezului este egală cu:',
      choices: ['$\\dfrac{27\\sqrt{3}}{2}\\text{ cm}^2$', '$6\\sqrt{3}\\text{ cm}^2$', '$9\\sqrt{3}\\text{ cm}^2$', '$27\\sqrt{3}\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc având centrul în $O$, în care $AB$ este diametru și $C$ este un punct pe cerc. Dacă $AB=12$ cm și $AC=6$ cm, atunci lungimea arcului mic $BC$ este egală cu:',
      choices: ['$18\\pi$ cm', '$4\\pi$ cm', '$36\\pi$ cm', '$12\\pi$ cm'], ans: 1, fig: fig11,
    },
    {
      text: 'Un tetraedru regulat $ABCD$ are aria triunghiului $BCD$ egală cu $\\dfrac{9\\sqrt{3}}{4}\\text{ cm}^2$. Aria laterală a tetraedrului este egală cu:',
      choices: ['$9\\sqrt{3}\\text{ cm}^2$', '$\\dfrac{3\\sqrt{3}}{4}\\text{ cm}^2$', '$\\dfrac{27\\sqrt{3}}{4}\\text{ cm}^2$', '$\\dfrac{9\\sqrt{2}}{4}\\text{ cm}^2$'], ans: 2,
    },

    {
      text: 'Teodora și Andrei vor să cumpere mamei lor un cadou. Teodora are $75\\%$ din prețul cadoului, Andrei are $60\\%$ din prețul cadoului și împreună au $270$ de lei.',
      parts: [
        { pts: 2, text: 'Poate fi prețul cadoului $100$ de lei? Justifică răspunsul.', ans: 'Nu: Teodora ar avea $75$ de lei, Andrei $60$ de lei, iar $75+60=135\\ne270$' },
        { pts: 3, text: 'Determină suma de bani a fiecărui copil.', ans: '$\\dfrac{3}{4}c+\\dfrac{3}{5}c=270$, deci $c=200$ de lei; Teodora are $150$ de lei, Andrei $120$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{1}{x+1}-\\dfrac{x}{1-x}+\\dfrac{2}{x^2-1}\\right):\\left(1+\\dfrac{3}{x-1}\\right)-\\dfrac{3x-6}{x^2-4}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x-2}{x+2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,1,\\,2\\}$.', ans: '$\\dfrac{x-1+x(x+1)+2}{x^2-1}=\\dfrac{(x+1)^2}{x^2-1}=\\dfrac{x+1}{x-1}$; $\\dfrac{x+1}{x-1}\\cdot\\dfrac{x-1}{x+2}-\\dfrac{3}{x+2}=\\dfrac{x-2}{x+2}$' },
        { pts: 3, text: 'Demonstrează că $E(x)\\cdot E(-x)=1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,1,\\,2\\}$.', ans: '$-x$ e tot în domeniu și $E(-x)=\\dfrac{-x-2}{-x+2}=\\dfrac{x+2}{x-2}$, deci $E(x)\\cdot E(-x)=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\dfrac{x}{2}-2$.',
      parts: [
        { pts: 2, text: 'Arată că $f(0)\\cdot f(2)\\cdot f(4)=0$.', ans: '$f(4)=0$, deci produsul este $0$' },
        { pts: 3, text: 'Dacă $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, iar $M$ este mijlocul segmentului $AB$, determină aria triunghiului $AOM$.', ans: '$A(4,\\,0)$, $B(0,\\,-2)$, $M(2,\\,-1)$; $\\mathcal{A}_{AOM}=\\dfrac{4\\cdot1}{2}=2$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată sunt reprezentate pătratele $ABCD$ și $AMNP$, având interioarele disjuncte. Se știe că $AB=2$ cm și $AM=1$ cm, unde $A$ este punctul de intersecție a dreptelor $DP$ și $BM$.',
      parts: [
        { pts: 2, text: 'Arată că aria patrulaterului $BDMP$ este egală cu $\\dfrac{9}{2}\\text{ cm}^2$.', ans: 'Diagonalele $BM=DP=3$ cm sunt perpendiculare, deci $\\mathcal{A}=\\dfrac{3\\cdot3}{2}=\\dfrac{9}{2}\\text{ cm}^2$' },
        { pts: 3, text: 'Dacă punctul $Q$ este simetricul punctului $P$ față de punctul $A$, demonstrează că $Q$ este ortocentrul triunghiului $BMD$.', ans: '$AQ=AP=AM=1$ cm, deci $\\sphericalangle MQA=45^\\circ=\\sphericalangle MBD$ și $MQ\\perp BD$; cum $DA\\perp MB$ și $Q\\in DA$, $Q$ este ortocentrul' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez dreptunghic cu $AB\\parallel CD$, $AB>CD$, $AD\\perp AB$ și $AD=2\\sqrt{3}$ cm. $BD$ este bisectoarea unghiului $ABC$, iar măsura unghiului $BCD$ este egală cu $120^\\circ$.',
      parts: [
        { pts: 2, text: 'Demonstrează că lungimea segmentului $BC$ este egală cu $4$ cm.', ans: '$\\sphericalangle ABC=60^\\circ$; cu $CT\\perp AB$, $CT=AD=2\\sqrt{3}$ cm și $BC=\\dfrac{CT}{\\sin60^\\circ}=4$ cm' },
        { pts: 3, text: 'Dacă $\\{O\\}=AC\\cap BD$, determină distanța de la punctul $O$ la dreapta $AB$.', ans: '$\\sphericalangle CBD=\\sphericalangle CDB=30^\\circ$, deci $CD=BC=4$ cm, $AB=6$ cm; $\\dfrac{OM}{CT}=\\dfrac{AO}{AC}=\\dfrac{6}{10}$, deci $d=\\dfrac{6\\sqrt{3}}{5}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o prismă triunghiulară regulată $ABCA'B'C'$, având $AB=6$ cm și volumul egal cu $162\\text{ cm}^3$. Punctul $M$ este simetricul punctului $A$ față de mijlocul segmentului $BB'$.",
      parts: [
        { pts: 2, text: "Arată că măsura unghiului format de dreptele $MB$ și $CC'$ este egală cu $30^\\circ$.", ans: "$AA'=\\dfrac{162}{9\\sqrt{3}}=6\\sqrt{3}$ cm; $ABMB'$ este paralelogram, deci $MB\\parallel B'A$ și unghiul este $\\sphericalangle B'AA'$, cu $\\text{tg}=\\dfrac{6}{6\\sqrt{3}}=\\dfrac{\\sqrt{3}}{3}$, adică $30^\\circ$" },
        { pts: 3, text: "Determină distanța de la punctul $M$ la planul $(ACC')$.", ans: "$C'B'$ este mediană în $\\triangle MA'C'$ și $C'B'=\\dfrac{MA'}{2}$, deci $MC'\\perp A'C'$; cum și $CC'\\perp MC'$, $d=MC'=6\\sqrt{3}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
