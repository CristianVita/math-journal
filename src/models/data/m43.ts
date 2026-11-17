// Perianu și alții, Testul 11 (Matematică pentru Evaluarea Națională, Art Klett, pages 264–270; the answers are
// computed)
import type { EnModel } from '../types'
import { along, foot, plane, solid, type Fig, type Pt } from '../figure'
import { BOX, box, pol } from './shapes'

const fig7 = plane({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], O: [2, 2] }, 130, { s: 'A-B-C-D-A A-C B-D', l: { O: 'e' } })

/** Two secants cut by a horizontal line, the angles numbered 1–8 as in the book (also used by Testul 15). */
export function anglesFig(): Fig {
  const X1: Pt = [2, 0], X2: Pt = [7.5, 0]
  const n = (at: Pt, dx: number, dy: number, s: string) => ({ at: [at[0] + dx, at[1] + dy] as Pt, s })
  return plane(
    { h1: [0, 0], h2: [10, 0], p1: [0.3, -1.7], p2: [3.7, 1.7], q1: [6.5, 1.7], q2: [8.6, -1.85] },
    230,
    {
      s: 'h1-h2 p1-p2 q1-q2',
      l: { h1: '', h2: '', p1: '', p2: '', q1: '', q2: '' },
      t: [
        n(X1, -0.45, 0.2, '1'), n(X1, 0.45, 0.2, '2'), n(X1, 0.4, -0.6, '3'), n(X1, -0.5, -0.6, '4'),
        n(X2, -0.45, 0.2, '5'), n(X2, 0.45, 0.2, '6'), n(X2, 0.45, -0.6, '7'), n(X2, -0.45, -0.6, '8'),
      ],
    },
  )
}

// II.3: the right triangle with the hypotenuse BC = 20 m, the angle B of 60°, M the midpoint of BC
const fig9 = plane({ B: [0, 0], C: [20, 0], A: [5, 5 * Math.sqrt(3)], M: [10, 0] }, 170, { s: 'A-B-C-A A-M', ra: ['BAC'] })

const fig10 = plane({ D: [0, 0], C: [12, 0], B: [8, 3], A: [4, 3] }, 170, { s: 'A-B-C-D-A' })

// II.5: the tangents from A, the minor arc BC of 120°
const fig11 = plane({ O: [0, 0], A: [2, 0], C: pol(60), B: pol(-60) }, 150, { s: 'C-A-B', dot: 'O', c: [{ at: 'O', r: 1 }], l: { O: 's' } })

// III.4: AM/MB = 2/3, MP ∥ BC, PQ ∥ AB
const A16: Pt = [1.5, 8], B16: Pt = [0, 0], C16: Pt = [10, 0]
const P16 = along(A16, C16, 0.4)
const fig16 = plane({ A: A16, B: B16, C: C16, M: along(A16, B16, 0.4), P: P16, Q: [P16[0] + 0.6 * (B16[0] - A16[0]), 0] }, 160, { s: 'A-B-C-A M-P-Q' })

// III.5: the rectangle, AM ⊥ BD, P on DC
const A17: Pt = [0, 6], B17: Pt = [8, 6], D17: Pt = [0, 0]
const fig17 = plane({ A: A17, B: B17, C: [8, 0], D: D17, M: foot(A17, B17, D17), P: [4.5, 0] }, 170, { s: 'A-B-C-D-A B-D A-P', ra: ['AMB'], l: { M: 'e' } })

const fig18 = solid(box(30, 20, 20), BOX, 160)

export const M43: EnModel = {
  id: 'en-43',
  title: 'Perianu, Testul 11',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 264–270',
  items: [
    {
      text: 'Dintre scrierile de mai jos, scrierea rezultată din aplicarea teoremei împărțirii cu rest este:',
      choices: ['$15=3\\cdot3+6$', '$15=10+5$', '$15=2\\cdot7+1$', '$15=5\\cdot2+5$'], ans: 2,
    },
    {
      text: 'În tabelul de mai jos sunt prezentate informații referitoare la numărul fructelor cumpărate de doi elevi.\n\n| | Ioana | Mircea |\n|---|---|---|\n| Mere | $x$ | 9 |\n| Pere | 4 | 12 |\n\nȘtiind că raportul dintre numărul merelor și numărul perelor este același pentru cei doi copii, valoarea lui $x$ este egală cu:',
      choices: ['$3$', '$36$', '$27$', '$4$'], ans: 0,
    },
    {
      text: 'Dimineața, temperatura aerului a fost de $-7\\,^\\circ\\text{C}$. După-amiază s-au înregistrat $11\\,^\\circ\\text{C}$. Temperatura a crescut cu:',
      choices: ['$11\\,^\\circ\\text{C}$', '$-18\\,^\\circ\\text{C}$', '$-4\\,^\\circ\\text{C}$', '$18\\,^\\circ\\text{C}$'], ans: 3,
    },
    {
      text: 'Dintre seturile de numere, cel scris în ordine crescătoare este:',
      choices: [
        '$\\dfrac12,\\ \\dfrac13,\\ \\dfrac14,\\ \\dfrac15$', '$\\dfrac15,\\ \\dfrac13,\\ \\dfrac14,\\ \\dfrac12$',
        '$\\dfrac75,\\ \\dfrac74,\\ \\dfrac73,\\ \\dfrac72$', '$\\dfrac72,\\ \\dfrac73,\\ \\dfrac74,\\ \\dfrac75$',
      ],
      ans: 2,
    },
    {
      text: 'Patru elevi calculează media geometrică a numerelor $2\\sqrt{3}$ și $6\\sqrt{3}$ și obțin rezultatele înregistrate în tabelul de mai jos.\n\n| Cornel | Dina | Rada | Alin |\n|---|---|---|---|\n| $4\\sqrt3$ | $6$ | $18$ | $8\\sqrt3$ |\n\nDintre cei patru elevi, cel care a calculat corect media geometrică acelor două numere este:',
      choices: ['Cornel', 'Dina', 'Rada', 'Alin'], ans: 1,
    },
    {
      text: 'Un autoturism se deplasează cu viteza de $80$ km/h. După $5$ ore de deplasare, autoturismul a parcurs $400$ km?',
      choices: ['Adevărat', 'Fals'], ans: 0,
    },

    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$. Dacă $AC\\cap BD=\\{O\\}$, atunci afirmația falsă dintre propozițiile de mai jos este:',
      choices: ['Simetricul lui $A$ față de $O$ este $C$.', 'Dreptele $AB$ și $CD$ sunt paralele.', 'Mijlocul segmentului $BD$ este $O$.', 'Dreptele $AC$ și $BD$ nu sunt perpendiculare.'],
      ans: 3, fig: fig7,
    },
    {
      text: 'O pereche de unghiuri corespondente din figura alăturată este:',
      choices: ['$(1,\\,8)$', '$(4,\\,8)$', '$(1,\\,7)$', '$(3,\\,5)$'], ans: 1, fig: anglesFig(),
    },
    {
      text: 'În figura alăturată este reprezentată schița unui teren de joacă, în formă de triunghi dreptunghic $ABC$, cu ipotenuza $BC$. Segmentul $AM$ reprezintă o alee ce separă terenul, unde $M$ este mijlocul segmentului $BC$. Dacă măsura unghiului $B$ este de $60^\\circ$ și lungimea ipotenuzei $BC$ este de $20$ de metri, atunci distanța de la $M$ la dreapta $AC$ este egală cu:',
      choices: ['$20$ m', '$15$ m', '$10$ m', '$5$ m'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura de mai jos este reprezentat un trapez isoscel $ABCD$, $AD=BC$. Dacă $CD=3\\cdot AB=\\dfrac{12}{5}\\cdot BC=12$ cm, atunci aria trapezului $ABCD$ este egală cu:',
      choices: ['$24\\text{ cm}^2$', '$48\\text{ cm}^2$', '$8\\text{ cm}^2$', '$26\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AC$ și $AB$ sunt tangente exterioare la cercul de centru $O$ și rază $r$. Dacă măsura arcului mic $BC$ este egală cu $120^\\circ$, atunci măsura unghiului $BAC$ este egală cu:',
      choices: ['$120^\\circ$', '$90^\\circ$', '$60^\\circ$', '$30^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'Dacă masa unui cub cu latura de $1$ cm este egală cu $3$ kg, atunci masa unui cub cu latura de $3$ cm, realizat din același material, este egală cu:',
      choices: ['$27$ kg', '$54$ kg', '$81$ kg', '$9$ kg'], ans: 2,
    },

    {
      text: 'Un număr natural $n$, împărțit pe rând la $6$, $8$ și $10$, dă, de fiecare dată, restul $3$ și câturi nenule.',
      parts: [
        { pts: 2, text: 'Verifică dacă $n$ poate fi egal cu $243$.', ans: 'Da: $243=6\\cdot40+3=8\\cdot30+3=10\\cdot24+3$' },
        { pts: 3, text: 'Determină cel mai mic număr natural $n$, care verifică datele problemei.', ans: '$n=123$ ($n-3$ este multiplu nenul al lui $[6,8,10]=120$)' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=1-\\dfrac{x^2-9}{(x+6)\\cdot(x-3)}\\cdot\\left(2+\\dfrac{5x+x^2}{x+3}\\right)$, unde $x$ este număr real, $x\\neq-6$, $x\\neq-3$ și $x\\neq3$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2+7x+6=(x+1)(x+6)$, pentru orice număr real $x$.', ans: '$x^2+x+6x+6=x(x+1)+6(x+1)=(x+1)(x+6)$' },
        { pts: 3, text: 'Arată că $E(x)=-x$, pentru orice număr real $x$, $x\\neq-6$, $x\\neq-3$ și $x\\neq3$.', ans: '$2+\\dfrac{5x+x^2}{x+3}=\\dfrac{(x+1)(x+6)}{x+3}$, deci $E(x)=1-\\dfrac{x+3}{x+6}\\cdot\\dfrac{(x+1)(x+6)}{x+3}=1-(x+1)=-x$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3-x$.',
      parts: [
        { pts: 2, text: 'Calculează $f(4)-f(5)$.', ans: '$-1-(-2)=1$' },
        { pts: 3, text: 'Reprezintă grafic funcția $f$ într-un sistem de axe ortogonale $xOy$.', ans: 'dreapta prin $(3,\\,0)$ și $(0,\\,3)$' },
      ],
    },
    {
      text: 'În triunghiul $ABC$ din figura alăturată, $MP\\parallel BC$, $PQ\\parallel AB$ și $\\dfrac{AM}{MB}=\\dfrac{2}{3}$.',
      parts: [
        { pts: 2, text: 'Arată că $\\dfrac{AP}{AC}=\\dfrac{2}{5}$.', ans: '$\\dfrac{AP}{PC}=\\dfrac{AM}{MB}=\\dfrac23$ (teorema lui Thales), deci $\\dfrac{AP}{AC}=\\dfrac25$' },
        { pts: 3, text: 'Determină valoarea raportului $\\dfrac{PQ}{AB}$.', ans: '$\\dfrac{PQ}{AB}=\\dfrac{CP}{CA}=\\dfrac35$' },
      ],
      fig: fig16,
    },
    {
      text: 'Dreptunghiul $ABCD$ din figura alăturată are $AB=8$ cm și $BC=6$ cm. Dacă $AM\\perp BD$, $M\\in BD$, și $AM\\cap DC=\\{P\\}$, atunci:',
      parts: [
        { pts: 2, text: 'arată că $MB=6{,}4$ cm;', ans: '$BD=10$ cm, $MB=\\dfrac{AB^2}{BD}=\\dfrac{64}{10}=6{,}4$ cm' },
        { pts: 3, text: 'determină aria trapezului $ABCP$.', ans: '$DP=\\dfrac{AD^2}{AB}=4{,}5$ cm, $PC=3{,}5$ cm, aria $=\\dfrac{(8+3{,}5)\\cdot6}{2}=34{,}5\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat schematic un acvariu în formă de paralelipiped dreptunghic $ABCDA'B'C'D'$. Dimensiunile acvariului sunt $AB=30$ cm, $BC=20$ cm și $AA'=20$ cm. Acvariul este umplut $70\\%$ din capacitatea sa cu apă.",
      parts: [
        { pts: 2, text: 'Arată că înălțimea la care se ridică apa în acvariu este egală cu $14$ cm.', ans: '$h=0{,}7\\cdot20=14$ cm' },
        { pts: 3, text: 'Demonstrează că distanța maximă dintre doi pești aflați în acvariu este mai mică de $40$ cm.', ans: 'apa ocupă un paralelipiped $30\\times20\\times14$, cu diagonala $\\sqrt{900+400+196}=\\sqrt{1496}<\\sqrt{1600}=40$ cm' },
      ],
      fig: fig18,
    },
  ],
}
