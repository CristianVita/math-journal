// Testul 7 (Modele de teste pentru Evaluarea Națională, Matematică. Clasa a VIII-a, pages 191–193; answers on 246).
// III.1 b): the book gives 593 (k = 8, r = 17), but 649 = 18·36 + 1 = 24·27 + 1 fits and is larger.
import type { EnModel } from '../types'
import { meet, mid, mid3, plane, solid, type Pt } from '../figure'
import { BOX, box, pol } from './shapes'

const s2 = Math.sqrt(2)

const fig7 = plane({ A: [0, 0], B: [5, 0], C: [6.5, 0], D: [16, 0] }, 200, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })

const fig8 = plane({ O: [0, 0], A: pol(160, 5), B: pol(32, 5), C: pol(0, 5), D: pol(96, 5) }, 170, { s: 'O-A O-B O-C O-D', ang: ['BOD', 'DOA'], l: { O: 's' } })

const fig9 = plane({ M: pol(115), N: pol(1), P: pol(-113), Q: pol(190), O: [0, 0] }, 140, { s: 'M-N N-P O-M O-Q', dot: 'O', c: [{ at: 'O', r: 1 }], l: { O: 'e' } })

const A10: Pt = [3, 6], C10: Pt = [15, 0]
const fig10 = plane({ A: A10, B: [0, 0], C: C10, D: [3, 0], E: mid(A10, C10) }, 160, { s: 'A-B-C-A A-D D-E', ra: ['ADC'] })

const A11: Pt = [-2, 0], C11: Pt = [2, 0], D11: Pt = [0, 1]
const fig11 = plane({ A: A11, B: [0, -1], C: C11, D: D11, O: [0, 0], E: mid(A11, D11), F: mid(C11, D11) }, 160, { s: 'A-B-C-D-A A-C B-D E-F B-E B-F', l: { O: 'se' } })

const fig12 = solid(box(10, 10, 10), BOX, 130, { seg: "A-C B-C'" })

const A16: Pt = [0, 0], B16: Pt = [24, 0], C16: Pt = [6, 12], D16: Pt = [0, 12]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, O: meet(A16, C16, B16, D16) }, 160, { s: 'A-B-C-D-A A-C B-D', ra: ['DOC'], l: { O: 'sw' } })

// III.5: the square of side 6√2, AF = DF = 6
const a = 6 * s2
const fig17 = plane({ A: [0, a], B: [0, 0], C: [a, 0], D: [a, a], E: [2 * a, 0], F: [a / 2, 1.5 * a], G: [1.5 * s2, 4.5 * s2] }, 170, { s: 'A-B-E A-D C-D A-F-D B-F A-C', ra: ['AFD'], l: { G: 'e' } })

const c18 = box(6 * s2, 6 * s2, 6 * s2)
const fig18 = solid({ ...c18, O: mid3(c18.A, c18.C) }, BOX, 140, { seg: "A-C B-D A'-O C-B' C-D' B'-D'", l: { O: 's' } })

export const M16: EnModel = {
  id: 'en-16',
  title: 'Testul 7',
  source: 'Modele de teste pentru Evaluarea Națională (Matematică. Clasa a VIII-a), pag. 191–193',
  items: [
    { text: 'Rezultatul calculului $-8-(+10):(-5)\\cdot 2$ este egal cu:', choices: ['$-4$', '$-2$', '$2$', '$4$'], ans: 0 },
    { text: 'Dacă $\\dfrac{6}{a}=\\dfrac{b}{3}$, $a\\neq 0$, atunci valoarea raportului $\\dfrac{ab+6}{ab-10}$ este egală cu:', choices: ['$2$', '$3$', '$4$', '$6$'], ans: 1 },
    { text: 'Numărul care reprezintă $15\\%$ din $180$ este egal cu:', choices: ['$18$', '$24$', '$27$', '$30$'], ans: 2 },
    { text: 'Soluția ecuației $-2x+5=3$ este numărul întreg:', choices: ['$-1$', '$1$', '$2$', '$4$'], ans: 1 },
    {
      text: 'Patru elevi, Andrei, Mara, Matei și Sofia, au calculat media aritmetică a numerelor reale $a$, $b$ și $c$ pentru care $(a-5)^2+|b-6|+(c-1)^2=0$. Rezultatele obținute de cei patru elevi sunt prezentate în tabelul următor.\n\n| Andrei | Mara | Matei | Sofia |\n|---|---|---|---|\n| 1 | 2 | 3 | 4 |\n\nDintre cei patru elevi, cel care a răspuns corect este:',
      choices: ['Andrei', 'Mara', 'Matei', 'Sofia'], ans: 3,
    },
    { text: 'Sofia afirmă că numărul $x=\\sqrt{2{,}(7)}$ este rațional. Afirmația făcută de Sofia este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată este reprezentat segmentul $AD$ pe care sunt situate punctele $B$ și $C$, astfel încât $AD=12BC$, $CD=5AB$ și $BC=6$ cm. Lungimea segmentului $AC$ este egală cu:',
      choices: ['$16$ cm', '$17$ cm', '$18$ cm', '$20$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiurile adiacente $AOB$ și $BOC$, astfel încât $\\sphericalangle AOB=4\\sphericalangle BOC$ și $\\sphericalangle AOC=160^\\circ$. Dacă semidreapta $OD$ este bisectoarea unghiului $AOB$, atunci măsura unghiului $COD$ este egală cu:',
      choices: ['$84^\\circ$', '$90^\\circ$', '$96^\\circ$', '$100^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat cercul de centru $O$ și rază $R$, pe care sunt situate punctele $M$, $N$, $P$, $Q$ (în această ordine), astfel încât $MN\\equiv PN$ și $\\overset{\\frown}{MN}=2\\overset{\\frown}{PQ}$, iar $\\sphericalangle MOQ=75^\\circ$. Măsura unghiului $PQN$ este egală cu:',
      choices: ['$54^\\circ$', '$56^\\circ$', '$57^\\circ$', '$62^\\circ$'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, dreptunghic în $A$, și $AD\\perp BC$, $D\\in BC$, astfel încât $BD=3$ cm și $CD=12$ cm, iar punctul $E$ este mijlocul laturii $AC$. Aria triunghiului $DEC$ este egală cu:',
      choices: ['$18\\text{ cm}^2$', '$20\\text{ cm}^2$', '$24\\text{ cm}^2$', '$28\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat rombul $ABCD$ cu $AC\\cap BD=\\{O\\}$, iar punctele $E$ și $F$ sunt mijloacele laturilor $AD$, respectiv $CD$. Valoarea raportului dintre aria triunghiului $BEF$ și aria rombului $ABCD$ este egală cu:',
      choices: ['$\\dfrac{5}{16}$', '$\\dfrac{3}{8}$', '$\\dfrac{1}{2}$', '$\\dfrac{3}{4}$'], ans: 1, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentat cubul $ABCDA'B'C'D'$. Măsura unghiului format de dreptele $AC$ și $BC'$ este egală cu:",
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$75^\\circ$'], ans: 2, fig: fig12,
    },

    {
      text: 'Se consideră numărul natural $n<650$, format din trei cifre. Se știe că împărțindu-l pe rând pe $n$ la $18$ și la $24$ obținem în fiecare caz câturile nenule, iar restul același număr natural nenul $r$.',
      parts: [
        { pts: 2, text: 'Determinați valoarea minimă a lui $n$, care îndeplinește condițiile date.', ans: '$n=72k+r$, $1\\le r\\le 17$; minim pentru $k=2$, $r=1$: $n=145$' },
        { pts: 3, text: 'Determinați valoarea maximă a lui $n$, care îndeplinește condițiile date.', ans: '$n=649$ ($k=9$, $r=1$: $649=18\\cdot 36+1=24\\cdot 27+1$)' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x^2+3x+2}{x^2+2x+1}-\\dfrac{2}{x^2-1}-\\dfrac{x^2-4x+4}{x^2-3x+2}\\right):\\dfrac{12}{x^2-1}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arătați că $E(x)=\\dfrac{x-1}{6}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1,\\,2\\}$.', ans: 'paranteza este $\\dfrac{x+2}{x+1}-\\dfrac{2}{(x-1)(x+1)}-\\dfrac{x-2}{x-1}=\\dfrac{2}{x+1}$, iar $\\dfrac{2}{x+1}\\cdot\\dfrac{(x-1)(x+1)}{12}=\\dfrac{x-1}{6}$' },
        { pts: 3, text: 'Determinați valorile întregi nenule ale lui $n$, cu $n\\neq -1$, $n\\neq 1$, $n\\neq 2$, pentru care numărul $A=\\dfrac{1}{E(n)}$ este întreg.', ans: '$A=\\dfrac{6}{n-1}$, deci $n\\in\\{-5,\\,-2,\\,3,\\,4,\\,7\\}$' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-3x+6$.',
      parts: [
        { pts: 2, text: 'Calculați tangenta unghiului format de graficul funcției cu axa $Ox$.', ans: '$\\operatorname{tg}(\\sphericalangle BAO)=\\dfrac{OB}{OA}=3$' },
        { pts: 3, text: 'Dacă punctul $C(-3,\\,0)$ se află în sistemul de axe $xOy$, $G_f\\cap Ox=\\{A\\}$ și $G_f\\cap Oy=\\{B\\}$, iar punctul $D$ este mijlocul segmentului $AB$, calculați lungimea segmentului $CD$.', ans: '$A(2,\\,0)$, $B(0,\\,6)$, $D(1,\\,3)$, deci $CD=5$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat trapezul dreptunghic $ABCD$, cu $AB\\parallel CD$, $AB>CD$, $\\sphericalangle A=\\sphericalangle D=90^\\circ$ și $AC\\perp BD$, iar $AC\\cap BD=\\{O\\}$, cu $AD=12$ cm și $AB=24$ cm.',
      parts: [
        { pts: 2, text: 'Calculați aria trapezului $ABCD$.', ans: '$AD^2=CD\\cdot AB$, $CD=6$ cm, aria este $180\\text{ cm}^2$' },
        { pts: 3, text: 'Dacă punctul $E$ este situat pe segmentul $AD$, astfel încât $AE=9{,}6$ cm, demonstrați că semidreapta $EO$ este bisectoarea unghiului $BEC$.', ans: '$\\dfrac{DE}{AE}=\\dfrac{DO}{BO}=\\dfrac{1}{4}$, deci $OE\\parallel AB$; $\\triangle EDC\\sim\\triangle EAB$ dau $\\sphericalangle CEO\\equiv\\sphericalangle BEO$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat pătratul $ABCD$ și în exterior triunghiul dreptunghic isoscel $AFD$, dreptunghic în $F$, cu $AF=6$ cm, iar punctul $E$ este simetricul punctului $B$ față de punctul $C$.',
      parts: [
        { pts: 2, text: 'Arătați că punctele $F$, $D$ și $E$ sunt coliniare.', ans: '$\\triangle DCE$ dreptunghic isoscel, deci $\\sphericalangle FDE=45^\\circ+90^\\circ+45^\\circ=180^\\circ$' },
        { pts: 3, text: 'Dacă $BF\\cap AC=\\{G\\}$, calculați lungimea segmentului $FG$.', ans: '$ABOF$ paralelogram, deci $AG=3$ cm și $FG^2=AF^2+AG^2=45$: $FG=3\\sqrt{5}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat cubul $ABCDA'B'C'D'$ cu $AB=6\\sqrt{2}$ cm și $AC\\cap BD=\\{O\\}$.",
      parts: [
        { pts: 2, text: "Arătați că dreapta $A'O$ este paralelă cu planul $(CB'D')$.", ans: "$A'O'CO$ este paralelogram ($A'C'\\cap B'D'=\\{O'\\}$), deci $A'O\\parallel O'C\\subset(CB'D')$" },
        { pts: 3, text: "Demonstrați că dreapta $AC'$ este perpendiculară pe planul $(CB'D')$ și calculați distanța de la $A$ la planul $(CB'D')$.", ans: "$ACB'D'$ este tetraedru regulat, deci $AC'\\perp(CB'D')$ și $d(A,(CB'D'))=4\\sqrt{6}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
