// Perianu și alții, Testul 12 (Matematică pentru Evaluarea Națională, Art Klett, pages 271–276; the answers are
// computed)
import type { EnModel } from '../types'
import { meet, mid, plane, solid, type P3, type Pt } from '../figure'
import { pol, prism3 } from './shapes'

// II.1: A above the line, D, E, F below it (on a grid in the book)
const fig7 = plane({ A: [6, 2], D: [2, -2], E: [6, -2], F: [12, -2], l1: [0, 0], l2: [13, 0] }, 200, {
  s: 'l1-l2', dot: 'A D E F', l: { l1: '', l2: '', A: 'ne', D: 'n', E: 'n', F: 'n' },
})

// II.2: a, b and the secant; 2x and 4x at a, 60° at b
const Xa: Pt = [4.7, 4.8], Xb: Pt = [7.2, 0], dir: Pt = [2.5, -4.8]
const fig8 = plane(
  { a1: [0, 4.8], a2: [10.4, 4.8], b1: [0, 0], b2: [10.4, 0], s1: [Xa[0] - 0.25 * dir[0], Xa[1] - 0.25 * dir[1]], s2: [Xb[0] + 0.15 * dir[0], Xb[1] + 0.15 * dir[1]] },
  190,
  {
    s: 'a1-a2 b1-b2 s1-s2',
    l: { a1: '', a2: '', b1: '', b2: '', s1: '', s2: '' },
    t: [
      { at: [3.85, 5.15], s: '2x', italic: true }, { at: [5.55, 5.15], s: '4x', italic: true }, { at: [6.25, 0.35], s: '60°' },
      { at: [10.1, 5.15], s: 'a', italic: true, size: 14 }, { at: [10.1, 0.35], s: 'b', italic: true, size: 14 },
    ],
  },
)

// II.3: the right triangle ABC (hypotenuse BC), BI and CI the bisectors
const A9: Pt = [1, 2], B9: Pt = [0, 0], C9: Pt = [5, 0]
const a9 = 5, b9 = Math.hypot(4, 2), c9 = Math.hypot(1, 2)
const I9: Pt = [(a9 * A9[0] + b9 * B9[0] + c9 * C9[0]) / (a9 + b9 + c9), (a9 * A9[1] + b9 * B9[1] + c9 * C9[1]) / (a9 + b9 + c9)]
const fig9 = plane({ A: A9, B: B9, C: C9, I: I9 }, 170, { s: 'A-B-C-A B-I-C', ra: ['BAC'], l: { I: 'n' } })

// II.4: the rectangle, P on BD, PT ⊥ DC, PS ⊥ AD
const fig10 = plane({ A: [0, 6], B: [12, 6], C: [12, 0], D: [0, 0], P: [4, 2], T: [4, 0], S: [0, 2] }, 180, {
  s: 'A-B-C-D-A B-D S-P-T', ra: ['PTC', 'PSA'], l: { P: 'n' },
})

// III.4: the rhombus with the angle BAD of 30°, P the midpoint of BC
const A16: Pt = [0, 0], B16 = pol(15, 6), D16 = pol(-15, 6)
const C16: Pt = [B16[0] + D16[0], B16[1] + D16[1]]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, P: mid(B16, C16) }, 220, { s: 'A-B-C-D-A A-P', dot: 'P', l: { P: 'n' } })

// III.5: the square ABCD and the equilateral triangle DCP inside it, AP ∩ BC = {Q}
const A17: Pt = [0, 8], P17: Pt = [4, 4 * Math.sqrt(3)]
const fig17 = plane({ A: A17, B: [8, 8], C: [8, 0], D: [0, 0], P: P17, Q: meet(A17, P17, [8, 0], [8, 8]) }, 140, { s: 'A-B-C-D-A D-P-C A-Q', l: { P: 'n', Q: 'e' } })

// III.6: the regular triangular pyramid VABC, AB = 12, the height 4√6
const b18 = prism3(12, 0)
const O18: P3 = [6, (12 * Math.sqrt(3)) / 2 / 3 * 2, 0]
const fig18 = solid(
  { A: b18.A, B: b18.B, C: b18.C, V: [O18[0], O18[1], 4 * Math.sqrt(6)], O: O18, M: [(b18.B[0] + b18.C[0]) / 2, (b18.B[1] + b18.C[1]) / 2, 0] },
  'A-B-C A-B-V B-C-V C-A-V',
  170,
  { seg: 'V-O V-M', dot: 'O', l: { O: 'w' } },
)

export const M44: EnModel = {
  id: 'en-44',
  title: 'Perianu, Testul 12',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 271–276',
  items: [
    { text: 'Scrierea în baza $2$ a numărului $123$ este:', choices: ['$11101$', '$1111011$', '$11001$', '$10101$'], ans: 1 },
    {
      text: 'Un stilou costă $60$ de lei. Alin cumpără un stilou după ce prețul acestuia s-a redus cu $30\\%$. Ce sumă de bani a economisit Alin?',
      choices: ['$42$', '$30$', '$54$', '$18$'], ans: 3,
    },
    { text: 'Dacă $x=-2$ și $y=3$, atunci valoarea lui $3(x-4)-2y$ este:', choices: ['$-24$', '$12$', '$0$', '$24$'], ans: 0 },
    {
      text: 'Care dintre următoarele numere este cel mai mic?',
      choices: ['$123{,}(345)$', '$123{,}3(45)$', '$123{,}345$', '$123{,}34(5)$'], ans: 2,
    },
    {
      text: 'Care este modalitatea corectă de efectuare a calculului $\\dfrac{15}{8}:\\dfrac{5}{2}$?',
      choices: [
        '$\\dfrac{15}{8}:\\dfrac52=\\dfrac{15:5}{8\\cdot2}$', '$\\dfrac{15}{8}:\\dfrac52=\\dfrac{8}{15}\\cdot\\dfrac52$',
        '$\\dfrac{15}{8}:\\dfrac52=\\dfrac{15}{8}\\cdot\\dfrac25$', '$\\dfrac{15}{8}:\\dfrac52=\\dfrac{15}{8}:5\\cdot2$',
      ],
      ans: 2,
    },
    { text: 'Numărul real $2\\sqrt{3}$ aparține intervalului $\\left(\\sqrt{12},\\,\\sqrt{13}\\right)$?', choices: ['Adevărat', 'Fals'], ans: 1 },

    {
      text: 'Dintre punctele $A$, $D$, $E$ și $F$, precizați care este simetricul lui $A$ față de dreapta reprezentată.',
      choices: ['$A$', '$D$', '$E$', '$F$'], ans: 2, fig: fig7,
    },
    {
      text: 'Precizați valoarea de adevăr a propoziției „Dreptele $a$ și $b$ din figura alăturată sunt paralele.”',
      choices: ['Adevărată', 'Falsă'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi dreptunghic $ABC$, cu ipotenuza $BC$. Dacă $BI$ și $CI$ sunt bisectoarele unghiurilor $ABC$, respectiv $ACB$, atunci măsura unghiului $BIC$ este egală cu:',
      choices: ['$135^\\circ$', '$125^\\circ$', '$90^\\circ$', '$120^\\circ$'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$, $P\\in BD$, $PT\\perp DC$, $PS\\perp AD$, $S\\in AD$. Dacă $AB=12$ cm, $BC=6$ cm și $PT=2$ cm, atunci $SP$ este de:',
      choices: ['$2$ cm', '$3$ cm', '$4$ cm', '$5$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'Dacă distanța dintre centrele a două cercuri de raze $3$ cm și $5$ cm este de $2$ cm, atunci cercurile sunt:',
      choices: ['interioare', 'exterioare', 'secante', 'tangente'], ans: 3,
    },
    {
      text: 'Aria laterală a unui cilindru circular drept, cu raza bazei de $4$ cm și generatoarea de $11$ cm, este egală cu:',
      choices: ['$88\\pi\\text{ cm}^2$', '$44\\pi\\text{ cm}^2$', '$8\\pi\\text{ cm}^2$', '$16\\pi\\text{ cm}^2$'], ans: 0,
    },

    {
      text: 'Numerele $a$ și $b$ sunt invers proporționale cu $2$ și $3$. Numerele $b$ și $c$ sunt invers proporționale cu numerele $6$ și $8$.',
      parts: [
        { pts: 2, text: 'Verifică dacă numerele $a$ și $c$ sunt invers proporționale cu $2$ și $4$.', ans: 'Da: $2a=3b$ și $6b=8c$ dau $a=2c$, deci $2a=4c$' },
        { pts: 3, text: 'Determină numerele $a$, $b$ și $c$ știind că suma numerelor $a$ și $c$ este egală cu $99$.', ans: '$a=66$, $b=44$, $c=33$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x+1}{x-1}+\\dfrac{x-1}{x+1}\\right):\\dfrac{x^2+1}{x^2-4x+3}$, unde $x$ este număr real, $x\\neq-1$, $x\\neq1$ și $x\\neq3$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2-4x+3=(x-1)(x-3)$, pentru orice număr real $x$.', ans: '$x^2-x-3x+3=x(x-1)-3(x-1)=(x-1)(x-3)$' },
        { pts: 3, text: 'Arată că $E(x)=\\dfrac{2x-6}{x+1}$, pentru orice număr real $x$, $x\\neq-1$, $x\\neq1$ și $x\\neq3$.', ans: 'paranteza este $\\dfrac{2(x^2+1)}{(x-1)(x+1)}$, iar $\\dfrac{2(x^2+1)}{(x-1)(x+1)}\\cdot\\dfrac{(x-1)(x-3)}{x^2+1}=\\dfrac{2x-6}{x+1}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-6$.',
      parts: [
        { pts: 2, text: 'Calculează $f(0)\\cdot f(1)\\cdot\\ldots\\cdot f(10)$.', ans: '$0$, pentru că $f(3)=0$' },
        { pts: 3, text: 'Reprezintă grafic funcția $f$ într-un sistem de axe ortogonale $xOy$.', ans: 'dreapta prin $(3,\\,0)$ și $(0,\\,-6)$' },
      ],
    },
    {
      text: 'În rombul $ABCD$ din figura alăturată, măsura unghiului $BAD$ este de $30^\\circ$, $AB=6$ cm și punctul $P$ este mijlocul segmentului $BC$.',
      parts: [
        { pts: 2, text: 'Arată că distanța de la punctul $P$ la dreapta $AD$ este egală cu $3$ cm.', ans: '$BC\\parallel AD$, deci distanța este $d(B,AD)=AB\\cdot\\sin30^\\circ=3$ cm' },
        { pts: 3, text: 'Determină aria patrulaterului $APCD$.', ans: '$\\mathcal{A}_{ABCD}=6\\cdot3=18\\text{ cm}^2$, $\\mathcal{A}_{ABP}=\\dfrac{18}{4}=4{,}5\\text{ cm}^2$, deci $\\mathcal{A}_{APCD}=13{,}5\\text{ cm}^2$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este pătrat, $DCP$ este triunghi echilateral, $AB=8$ cm și $AP\\cap BC=\\{Q\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $m(\\sphericalangle BAQ)=15^\\circ$.', ans: '$\\sphericalangle ADP=30^\\circ$ și $DA=DP$, deci $\\sphericalangle DAP=75^\\circ$ și $\\sphericalangle BAQ=15^\\circ$' },
        { pts: 3, text: 'Determină lungimea segmentului $QC$.', ans: '$QC=8\\sqrt3-8$ cm ($BQ=16-8\\sqrt3$ cm)' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă triunghiulară regulată $VABC$, cu baza triunghiul $ABC$ și $AB=12$ m. Punctul $M$ este mijlocul segmentului $BC$ și $VM=6\\sqrt{3}$ m, iar $VO$ este înălțimea piramidei.',
      parts: [
        { pts: 2, text: 'Arată că volumul piramidei este $144\\sqrt{2}\\text{ cm}^3$.', ans: '$OM=2\\sqrt3$, $VO=\\sqrt{108-12}=4\\sqrt6$, $V=\\dfrac{36\\sqrt3\\cdot4\\sqrt6}{3}=144\\sqrt2$ (în $\\text{m}^3$, căci laturile sunt în metri)' },
        { pts: 3, text: 'Determină măsura unghiului dintre dreptele $AV$ și $BC$.', ans: '$90^\\circ$ ($BC\\perp(VAM)$)' },
      ],
      fig: fig18,
    },
  ],
}
