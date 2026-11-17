// Perianu și alții, Testul 9 (Matematică pentru Evaluarea Națională, Art Klett, pages 251–256; the answers are
// computed)
import type { EnModel } from '../types'
import { plane, solid, type P3 } from '../figure'
import { box } from './shapes'

// II.1: C, A, M, V on a line, AM = 3 m
const fig7 = plane({ C: [0, 0], A: [3, 0], M: [6, 0], V: [12, 0] }, 220, { s: 'C-V', dot: 'C A M V', l: { C: 's', A: 's', M: 's', V: 's' } })

// II.2: a ∥ b, c ∥ d, the angle SMQ of 60°, MF ⊥ PQ, MF = MP/2 (so the angle MPQ is 30°)
const r3 = Math.sqrt(3)
const Q8: [number, number] = [2, 0], M8: [number, number] = [2 + r3, 3], P8: [number, number] = [2 + r3 + 3 * r3, 0], N8: [number, number] = [2 + 2 * r3 + 3 * r3, 3]
const fig8 = plane(
  {
    a1: [0, 3], a2: [12.2, 3], b1: [0, 0], b2: [12.2, 0], S: [2.6, 3], M: M8, N: N8, Q: Q8, P: P8, F: [M8[0], 0],
    c1: [Q8[0] - 0.4, -0.7], c2: [M8[0] + 0.4, 3.7], d1: [P8[0] - 0.4, -0.7], d2: [N8[0] + 0.4, 3.7],
  },
  210,
  {
    s: 'a1-a2 b1-b2 c1-c2 d1-d2 M-P M-F',
    ra: ['MFP'],
    l: { a1: '', a2: '', b1: '', b2: '', c1: '', c2: '', d1: '', d2: '', S: 'n', M: 'n', N: 'nw', Q: 's', P: 's', F: 's' },
    t: [{ at: [0.1, 3.2], s: 'a', italic: true, size: 14 }, { at: [0.1, 0.2], s: 'b', italic: true, size: 14 }, { at: [M8[0] + 0.7, 3.6], s: 'c', italic: true, size: 14 }, { at: [N8[0] + 0.7, 3.6], s: 'd', italic: true, size: 14 }],
  },
)

// II.3: ACD isosceles with the right angle at D, ABC with the right angle at A, the angle B of 60°
const fig9 = plane({ A: [0, 0], C: [4 * Math.SQRT2, 0], D: [2 * Math.SQRT2, 2 * Math.SQRT2], B: [0, -4 * Math.SQRT2 / r3] }, 130, { s: 'A-D-C-A A-B-C', ra: ['ADC', 'BAC'], ang: ['ABC'] })

// II.5: two circles of the same radius, O₂ the midpoint of O₁M
const fig11 = plane(
  { 'O₁': [0, 0], 'O₂': [1, 0], A: [0.5, r3 / 2], B: [0.5, -r3 / 2], M: [2, 0] },
  170,
  { s: 'O₁-M A-O₁', dot: 'O₁ O₂', c: [{ at: [0, 0], r: 1 }, { at: [1, 0], r: 1 }], l: { 'O₁': 'sw', 'O₂': 'se', A: 'n', B: 's', M: 'e' } },
)

// II.6: the cube of edge 4 with the pyramid of height 4 on it
const cube = box(4, 4, 4)
const fig12 = solid(
  { ...cube, V: [2, 2, 8] as P3, O: [2, 2, 4] as P3 },
  "A-B-C-D A-B-B'-A' B-C-C'-B' C-D-D'-C' D-A-A'-D' A'-B'-V B'-C'-V C'-D'-V D'-A'-V",
  130,
  { seg: "A'-C' B'-D' V-O", l: { O: '' } },
)

// III.4: the equilateral triangle, M and N the midpoints of AB and AC
const fig16 = plane({ A: [4, 4 * r3], B: [0, 0], C: [8, 0], M: [2, 2 * r3], N: [6, 2 * r3] }, 150, { s: 'A-B-C-A M-N B-N' })

// III.5: the square ABCD and the equilateral triangle ABM inside it
const fig17 = plane({ A: [0, 0], B: [8, 0], C: [8, 8], D: [0, 8], M: [4, 4 * r3] }, 140, { s: 'A-B-C-D-A A-M-B', l: { M: 'n' } })

export const M41: EnModel = {
  id: 'en-41',
  title: 'Perianu, Testul 9',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 251–256',
  items: [
    { text: 'Dintre numerele: $0$, $1$, $2$ și $51$, unul singur este număr prim. Acesta este:', choices: ['$0$', '$1$', '$2$', '$51$'], ans: 2 },
    {
      text: 'Patru plicuri cu zahăr cântăresc $4{,}17$ g, $4{,}08$ g, $4{,}100$ g și, respectiv, $4{,}099$ g. Cel mai greu dintre plicuri este cel care cântărește:',
      choices: ['$4{,}17$ g', '$4{,}08$ g', '$4{,}100$ g', '$4{,}099$ g'], ans: 0,
    },
    { text: 'Fie fracția $\\dfrac{51}{72}$. Aceasta se poate simplifica prin:', choices: ['$2$', '$3$', '$13$', '$17$'], ans: 1 },
    { text: 'Suma dintre $|-7|$ și $|+5|$ este egală cu:', choices: ['$12$', '$-12$', '$2$', '$-2$'], ans: 0 },
    {
      text: '$68$ de pungi (identice) de zahăr trebuie așezate în cutii. Într-o cutie încap $8$ pungi. Este nevoie de:',
      choices: ['$8$ cutii', '$9$ cutii', '$10$ cutii', '$68$ de cutii'], ans: 1,
    },
    { text: 'Jumătatea sumei $8\\sqrt{3}-5\\sqrt{3}+3\\sqrt{3}$ este:', choices: ['$0$', '$6\\sqrt{3}$', '$3\\sqrt{3}$', '$12\\sqrt{3}$'], ans: 2 },

    {
      text: 'În figura alăturată, cele patru puncte îi reprezintă pe Costi, Ana, Marian și Vali, care sunt așezați astfel încât $C$ este simetricul lui $M$ față de $A$, $V$ este simetricul lui $C$ față de $M$, iar lungimea segmentului $AM$ este de $3$ m. Între Ana și Vali sunt:',
      choices: ['$6$ m', '$9$ m', '$12$ m', '$15$ m'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $a$ și $b$ sunt paralele, iar dreptele $c$ și $d$ sunt și acestea paralele. Unghiul $SMQ$ are $60^\\circ$, iar $MF$ este perpendiculară pe $PQ$ și $MF=\\dfrac{MP}{2}$. Unghiul $MPN$ are:',
      choices: ['$30^\\circ$', '$60^\\circ$', '$80^\\circ$', '$90^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată sunt desenate triunghiul dreptunghic isoscel $ACD$ și triunghiul dreptunghic $ABC$, în care unghiul $B$ are $60^\\circ$. Dacă $AC=4\\sqrt{2}$ cm, atunci perimetrul patrulaterului $ABCD$ este de:',
      choices: ['$8+4\\sqrt{2}$ cm', '$8+4\\sqrt{3}$ cm', '$8+4\\sqrt{6}$ cm', '$18$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'Fie dreptunghiul $ABCD$, cu $AB=40$ cm și $BC=30$ cm, iar $M$, mijlocul laturii $BC$. Distanța de la $M$ la diagonala $AC$ este egală cu:',
      choices: ['$10$ cm', '$12$ cm', '$15$ cm', '$20$ cm'], ans: 1,
    },
    {
      text: 'Fie cercurile $\\mathcal{C}_1(O_1,\\,R)$ și $\\mathcal{C}_2(O_2,\\,R)$, ca în figura alăturată. Cele două cercuri se intersectează în $A$ și $B$. Dacă $O_2$ este mijlocul segmentului $O_1M$, măsura unghiului $AO_1M$ este:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: "Pe cubul $ABCDA'B'C'D'$ este așezată o piramidă, ca în figura alăturată. Se știe că înălțimea corpului astfel format este de $8$ cm, iar volumul cubului, de $64\\text{ cm}^3$. Volumul acestui corp este de:",
      choices: ['$128\\text{ cm}^3$', '$\\dfrac{256}{3}\\text{ cm}^3$', '$256\\text{ cm}^3$', '$\\dfrac{128\\sqrt{3}}{3}\\text{ cm}^3$'], ans: 1, fig: fig12,
    },

    {
      text: 'Un grup de turiști parcurge un traseu în trei zile. În prima zi, grupul străbate $30\\%$ din drum. În a doua zi, $\\dfrac{4}{7}$ din rest. Iar în ultima zi, parcurge $4$ km pe jos și restul de $5$ km cu o mașină.',
      parts: [
        { pts: 2, text: 'Exprimă procentual drumul parcurs în a doua zi.', ans: '$\\dfrac47\\cdot70\\%=40\\%$' },
        { pts: 3, text: 'Determină lungimea traseului.', ans: '$30$ km (în ultima zi, $30\\%$ din drum, adică $9$ km)' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2}{x-2}+\\dfrac{x}{x-18}\\right):\\dfrac{x-6}{x^2-20x+36}$, $x\\in\\mathbb{R}\\setminus\\{2,\\,6,\\,18\\}$.',
      parts: [
        { pts: 2, text: 'Arată că, pentru orice număr real $x$, $x^2-20x+36=(x-2)(x-18)$.', ans: '$(x-2)(x-18)=x^2-18x-2x+36=x^2-20x+36$' },
        { pts: 3, text: 'Demonstrează că suma $E(0)+E(1)+E(2)+\\ldots+E(10)$ este pătratul unui număr natural.', ans: '$E(x)=\\dfrac{x^2-36}{x-6}=x+6$, iar $6+7+\\ldots+16=121=11^2$; atenție: $E(2)$ și $E(6)$ nu sunt definite în expresia dată, suma se face cu forma simplificată' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+3$.',
      parts: [
        { pts: 2, text: 'Calculează $f(4)+f(-4)$.', ans: '$11+(-5)=6$' },
        { pts: 3, text: 'Arată că aria triunghiului determinat de graficul funcției și de axele de coordonate este mai mică decât $2{,}3$.', ans: 'graficul taie axele în $\\left(-\\dfrac32,\\,0\\right)$ și $(0,\\,3)$, aria este $\\dfrac94=2{,}25<2{,}3$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul echilateral $ABC$, iar $M$ și $N$ sunt mijloacele laturilor $AB$ și, respectiv, $AC$. Se știe că $MN=4$ cm.',
      parts: [
        { pts: 2, text: 'Calculează lungimea laturii triunghiului $ABC$.', ans: '$BC=2MN=8$ cm' },
        { pts: 3, text: 'Arată că $\\mathcal{A}_{MNB}$ este un sfert din aria triunghiului $ABC$.', ans: '$\\mathcal{A}_{MNB}=\\dfrac12\\mathcal{A}_{ABN}=\\dfrac12\\cdot\\dfrac12\\mathcal{A}_{ABC}$ ($NM$ și $BN$ sunt mediane)' },
      ],
      fig: fig16,
    },
    {
      text: 'Se consideră pătratul $ABCD$, ca în figura alăturată. În interiorul pătratului se alege punctul $M$, astfel încât triunghiul $ABM$ să fie echilateral. Se știe că latura pătratului este de $8$ cm.',
      parts: [
        { pts: 2, text: 'Calculează perimetrul triunghiului $ABM$.', ans: '$24$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $DM$.', ans: '$DM=8\\sqrt{2-\\sqrt3}=4\\sqrt6-4\\sqrt2$ cm ($M$ e la $4$ cm de $AD$ și la $8-4\\sqrt3$ cm de $DC$)' },
      ],
      fig: fig17,
    },
    {
      text: "Se consideră paralelipipedul dreptunghic $ABCDA'B'C'D'$ cu lungimea $AB=8$ cm, înălțimea de $4$ cm și lățimea de $6$ cm. Fie $O$ punctul de intersecție a diagonalelor bazei și $M$, mijlocul muchiei $A'D'$.",
      parts: [
        { pts: 2, text: 'Arată că $DO=5$ cm.', ans: '$BD=10$ cm, $DO=\\dfrac{BD}{2}=5$ cm' },
        { pts: 3, text: "Demonstrează că $MO$ este perpendiculară pe planul $(OB'C')$.", ans: "$MO$ stă în planul mijloacelor muchiilor $AD$, $BC$, $A'D'$, $B'C'$, perpendicular pe $B'C'$; $MO^2+OB'^2=32+41=73=MB'^2$, deci $MO\\perp OB'$" },
      ],
    },
  ],
}
