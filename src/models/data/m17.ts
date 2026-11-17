// Testul 1 (Perianu și alții, Matematică pentru Evaluarea Națională, Art Klett, pages 199–204; the book's answers are
// not in the photos, so every answer here is computed)
import type { EnModel } from '../types'
import { meet, mid, plane, solid, type Pt } from '../figure'
import { BOX, box, pol } from './shapes'

const s3 = Math.sqrt(3)

// II.1: ∡MAP = 36°, ∡PAQ = 54°
const fig7 = plane({ A: [0, 0], M: pol(36, 5), P: [5, 0], Q: pol(-54, 5) }, 120, { s: 'M-A-P A-Q', l: { A: 'w' } })

// II.2: MNPQ a parallelogram drawn as four long lines, ∡QMP = 40°, ∡NMQ = 75°
const M8: Pt = [0, 0], P8 = pol(5, 6)
const Q8 = meet(M8, pol(-35, 1), P8, [P8[0] + Math.cos((40 * Math.PI) / 180), P8[1] + Math.sin((40 * Math.PI) / 180)])
const N8: Pt = [P8[0] - Q8[0], P8[1] - Q8[1]]
const ext = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const fig8 = plane(
  {
    M: M8, N: N8, P: P8, Q: Q8,
    m1: ext(M8, N8, -0.35), m2: ext(M8, N8, 1.35), q1: ext(M8, Q8, -0.35), q2: ext(M8, Q8, 1.35),
    n1: ext(N8, P8, -0.35), n2: ext(N8, P8, 1.45), p1: ext(Q8, P8, -0.35), p2: ext(Q8, P8, 1.45),
  },
  170,
  {
    l: { m1: '', m2: '', q1: '', q2: '', n1: '', n2: '', p1: '', p2: '', M: 'w', N: 'n', P: 'ne', Q: 's' },
    s: 'm1-m2 q1-q2 n1-n2 p1-p2 M-P', ang: ['QMP', 'NPQ'],
    t: [{ at: [M8[0] + 1.25, M8[1] - 0.35], s: '40°', size: 11 }],
  },
)

// II.3: ∡A = 90°, ∡C = 30°, AB = BM = MC = AM = 6
const B9: Pt = [0, 6], C9: Pt = [6 * s3, 0]
const fig9 = plane({ A: [0, 0], B: B9, C: C9, M: mid(B9, C9) }, 150, { s: 'A-B-C-A A-M', ra: ['BAC'] })

// II.4: the wall 5 m × 3 m, the window MNPQ of 1 m
const fig10 = plane(
  { A: [0, 0], B: [5, 0], C: [5, 3], D: [0, 3], M: [2, 1], N: [3, 1], P: [3, 2], Q: [2, 2], h1: [0, 1], h2: [5, 1], h3: [0, 2], h4: [5, 2], v1: [1, 0], v2: [1, 3], v3: [2, 0], v4: [2, 3], v5: [3, 0], v6: [3, 3], v7: [4, 0], v8: [4, 3] },
  180,
  {
    l: { h1: '', h2: '', h3: '', h4: '', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', M: 'sw', N: 'se', P: 'ne', Q: 'nw' },
    s: 'A-B-C-D-A M-N-P-Q-M', d: 'h1-M N-h2 h3-Q P-h4 v1-v2 v3-M Q-v4 v5-N P-v6 v7-v8',
  },
)

// II.5: ∡CAB = 50°, so the arc BC is 100°; MC tangent at C
const O11: Pt = [0, 0], C11 = pol(245, 3)
const tan11 = pol(335, 1)
const fig11 = plane(
  { A: pol(100, 3), B: pol(-15, 3), C: C11, O: O11, M: [C11[0] + 2.2 * tan11[0], C11[1] + 2.2 * tan11[1]], T: [C11[0] - 1.6 * tan11[0], C11[1] - 1.6 * tan11[1]] },
  150,
  { s: 'A-B-C-A T-M', d: 'O-C', dot: 'O', c: [{ at: 'O', r: 3 }], l: { T: '', O: 'e' } },
)

const fig16 = plane({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], M: [6, 4], N: [4, 6] }, 140, { s: 'A-B-C-D-A A-M A-N' })

// III.5: as the book draws it (its data make DMC flat: DM = MC = 3, DC = 6)
const fig17 = plane({ A: [0, 0], B: [12, 0], C: [9, 5], D: [3, 5], M: [6, 10] }, 130, { s: 'D-A-B-C D-C', d: 'D-M-C' })

const p18 = box(4, 4, 10)
const fig18 = solid(p18, BOX, 110, { seg: "A-C' B'-D'" })

export const M17: EnModel = {
  id: 'en-17',
  title: 'Perianu, Testul 1',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 199–204',
  items: [
    { text: 'Dintre numerele $2$, $4$, $10$ și $21$, număr prim este:', choices: ['$2$', '$4$', '$10$', '$21$'], ans: 0 },
    {
      text: 'În tabelul de mai jos sunt prezentate informații cu privire la numărul problemelor rezolvate de către cinci copii:\n\n| | Ana | Cătălin | Florin | Ioana | Paul |\n|---|---|---|---|---|---|\n| Numărul problemelor | 135 | 120 | 100 | 200 | 40 |\n\nCopiii pentru care numărul problemelor rezolvate de unul este o treime din numărul problemelor rezolvate de celălalt sunt:',
      choices: ['Paul și Ana', 'Florin și Ioana', 'Paul și Cătălin', 'Cătălin și Ioana'], ans: 2,
    },
    { text: 'Într-un coș sunt $85$ de mere și $100$ de pere. Diferența dintre jumătate din numărul perelor și numărul merelor este:', choices: ['$15$', '$-85$', '$185$', '$-35$'], ans: 3 },
    { text: 'Numerele de forma $\\overline{5x6}$ divizibile cu $3$ sunt:', choices: ['$506,\\ 536,\\ 566,\\ 596$', '$516,\\ 546,\\ 576$', '$516,\\ 536,\\ 566,\\ 596$', '$526,\\ 556,\\ 586$'], ans: 1 },
    { text: 'Fie intervalul $\\left[-2\\sqrt{3},\\,\\dfrac{5\\sqrt{2}}{2}\\right)$. Câte numere întregi conține acest interval?', choices: ['$6$', '$7$', '$4$', '$3$'], ans: 1 },
    { text: 'O umbrelă costă $25$ de lei. Ionel spune: „după o scumpire cu $20\\%$, umbrela va costa $30$ de lei.” Afirmația lui Ionel este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate unghiurile adiacente $MAP$ și $PAQ$, cu măsurile de $36^\\circ$ și, respectiv, de $54^\\circ$. Unghiul $MAQ$ este:',
      choices: ['obtuz', 'ascuțit', 'drept', 'alungit'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, $MN\\parallel PQ$ și $MQ\\parallel NP$, $\\sphericalangle QMP=40^\\circ$ și $\\sphericalangle QPN=75^\\circ$. Unghiul $PMN$ are măsura egală cu:',
      choices: ['$40^\\circ$', '$75^\\circ$', '$30^\\circ$', '$35^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'Într-o livadă se află patru copaci situați, ca în figura alăturată, în punctele $A$, $B$, $C$ și $M$. Se știe că $\\sphericalangle BAC=90^\\circ$, $M\\in(BC)$ astfel încât $AM=MC$, $\\sphericalangle MAC=30^\\circ$ și $BM=6$ m. Distanța de la $M$ la $AC$ este egală cu:',
      choices: ['$2$ m', '$3$ m', '$6$ m', '$4$ m'], ans: 1, fig: fig9,
    },
    {
      text: 'O cameră are un perete în forma unui dreptunghi cu dimensiunile de $5$ m și $3$ m. Acest perete se acoperă cu plăci de faianță în formă de pătrat cu latura de $25$ cm. Pe perete este o fereastră $MNPQ$ în formă de pătrat cu latura de $1$ m, ca în figura alăturată. Numărul plăcilor de faianță necesare este egal cu:',
      choices: ['$224$', '$225$', '$200$', '$240$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $MC$ este tangentă la cercul circumscris triunghiului $ABC$, iar $\\sphericalangle CAB=50^\\circ$. Măsura unghiului $MCB$ este:',
      choices: ['$40^\\circ$', '$50^\\circ$', '$45^\\circ$', '$30^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'Un cub a fost tăiat în $125$ de cubulețe identice, cu muchia de $1$ cm. Aria totală a cubului mare este egală cu:',
      choices: ['$250\\text{ cm}^2$', '$750\\text{ cm}^2$', '$125\\text{ cm}^2$', '$150\\text{ cm}^2$'], ans: 3,
    },

    {
      text: 'Un turist a parcurs în prima zi $\\dfrac{1}{3}$ dintr-un traseu, iar în a doua zi, $15$ km. I-au rămas de parcurs $\\dfrac{1}{4}$ din traseu.',
      parts: [
        { pts: 2, text: 'Este posibil ca lungimea traseului să fie egală cu un număr impar de kilometri? Justificați răspunsul.', ans: 'Nu: $15$ km reprezintă $\\dfrac{5}{12}$ din traseu, deci traseul are $36$ km (număr par)' },
        { pts: 3, text: 'Determină lungimea traseului.', ans: '$36$ km' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left[\\dfrac{6x-12}{(x-2)^2}-\\dfrac{5x-15}{(x-3)^2}\\right]+\\dfrac{3}{x^2-5x+6}$, unde $x\\in\\mathbb{R}\\setminus\\{2,\\,3\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2-5x+6=(x-2)(x-3)$, pentru orice $x$ număr real.', ans: '$x^2-2x-3x+6=x(x-2)-3(x-2)=(x-2)(x-3)$' },
        { pts: 3, text: 'Demonstrează că $E(x)=\\dfrac{x-5}{(x-2)(x-3)}$, oricare ar fi $x$ număr real, diferit de $2$ și de $3$.', ans: '$E(x)=\\dfrac{6}{x-2}-\\dfrac{5}{x-3}+\\dfrac{3}{(x-2)(x-3)}=\\dfrac{6x-18-5x+10+3}{(x-2)(x-3)}=\\dfrac{x-5}{(x-2)(x-3)}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-2x+4$.',
      parts: [
        { pts: 2, text: 'Calculează $f(1)+f(2)+\\ldots+f(6)$.', ans: '$-2\\cdot21+6\\cdot4=-18$' },
        { pts: 3, text: 'Dacă $\\{A\\}=Ox\\cap G_f$ și $\\{B\\}=Oy\\cap G_f$, iar $M$ este mijlocul segmentului $AB$, atunci calculează perimetrul triunghiului $OAM$.', ans: '$A(2,\\,0)$, $B(0,\\,4)$, $M(1,\\,2)$, $\\mathcal{P}=2+2\\sqrt{5}$' },
      ],
    },
    {
      text: 'În figura alăturată, patrulaterul $ABCD$ este un pătrat de latură $6$ cm, iar punctele $M\\in(BC)$ și $N\\in(DC)$ astfel încât $MC=NC=\\dfrac{1}{3}DC$.',
      parts: [
        { pts: 2, text: 'Arată că aria patrulaterului $AMCN$ este egală cu $12\\text{ cm}^2$.', ans: '$\\mathcal{A}_{AMC}+\\mathcal{A}_{ANC}=\\dfrac{2\\cdot6}{2}+\\dfrac{2\\cdot6}{2}=12\\text{ cm}^2$' },
        { pts: 3, text: 'Calculează distanța de la punctul $M$ la dreapta $AN$.', ans: '$\\mathcal{A}_{AMN}=12-2=10\\text{ cm}^2$, $AN=2\\sqrt{13}$ cm, deci $d=\\dfrac{10\\sqrt{13}}{13}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez isoscel, cu $AB\\parallel CD$, $AB>CD$ și $AD\\cap BC=\\{M\\}$. Punctul $D$ este mijlocul laturii $AM$, perimetrul triunghiului $DMC$ este de $12$ cm și perimetrul lui $ABCD$ este de $24$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $AB=12$ cm.', ans: '$DC$ e linie mijlocie în $\\triangle MAB$: $\\mathcal{P}_{ABCD}=\\mathcal{P}_{DMC}+2DC$, deci $DC=6$ cm și $AB=12$ cm' },
        { pts: 3, text: 'Arată că lungimea liniei mijlocii a trapezului este mai mică decât $7\\sqrt{2}$ cm.', ans: '$\\dfrac{12+6}{2}=9$ cm și $9<7\\sqrt{2}\\Leftrightarrow 81<98$' },
      ],
      fig: fig17,
    },
    {
      text: "Un suport de creioane are forma unei prisme patrulatere regulate $ABCDA'B'C'D'$. Două creioane, reprezentate prin segmentele $AC'$ și $B'D'$, sunt așezate ca în figura alăturată. Se știe că $AB=4$ cm și $AA'=10$ cm.",
      parts: [
        { pts: 2, text: "Calculează tangenta unghiului format de creionul reprezentat prin segmentul $C'A$ cu planul bazei.", ans: "$\\text{tg}\\sphericalangle C'AC=\\dfrac{CC'}{AC}=\\dfrac{10}{4\\sqrt{2}}=\\dfrac{5\\sqrt{2}}{4}$" },
        { pts: 3, text: 'Determină măsura unghiului format de cele două creioane.', ans: "$B'D'\\perp A'C'$ și $B'D'\\perp AA'$, deci $B'D'\\perp(AA'C')$ și unghiul este $90^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
