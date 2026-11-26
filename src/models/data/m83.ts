// Testul 52 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 179–181; every answer here is computed and checked with the book's answers, p. 288).
import type { EnModel } from '../types'
import type { P3, Pt } from '../figure'
import { along, along3, meet, mid, plane, solid } from '../figure'
import { graph, PYR4, pyr4, TETRA } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3), s6 = Math.sqrt(6)

const fig7 = plane({ M: [0, 0], A: [63, 0], N: [72, 0], B: [84, 0] }, 170, { s: 'M-B', dot: 'M A N B', l: { M: 'n', A: 'n', N: 'n', B: 'n' } })
const t20 = Math.tan((20 * Math.PI) / 180)
const fig8 = plane({ D: [-1, 0], B: [1, 0], C: [0, t20], A: [0, -t20] }, 130, { s: 'A-B-C-D-A D-B' })
const B9: Pt = [8, 0], C9: Pt = [10, 4], D9: Pt = [2, 4], M9: Pt = [4, 0]
const fig9 = plane({ A: [0, 0], B: B9, C: C9, D: D9, M: M9, N: meet(B9, D9, C9, M9) }, 140, { s: 'A-B-C-D-A B-D C-M', l: { N: 'ne' } })
const fig10 = plane({ A: [0, 0], B: [30 * s3, 0], C: [30 * s3, 30], D: [0, 30] }, 130, { s: 'A-B-C-D-A A-C B-D' })
const fig11 = plane({ O: [0, 0], A: [0, s6], B: [2 * s3, s6] }, 110, { s: 'O-A-B-O', c: [{ at: 'O', r: s6 }], dot: 'O', ra: ['OAB'], l: { O: 's' } })
const l12 = 6 * s2, y12 = (l12 * s3) / 2
const p12: Record<string, P3> = { A: [0, y12, 0], B: [l12 / 2, 0, 0], C: [l12, y12, 0], V: [l12 / 2, (2 * y12) / 3, 2 * s3] }
const fig12 = solid(p12, TETRA('A', 'B', 'C', 'V'), 110)

const fig15 = graph({ A: [3, 0], B: [0, 4], L1: [-0.75, 5], L2: [4.5, -2] }, 120, [-1.2, 5], [-2.3, 5.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'ne', B: 'e' } })
const E16: Pt = [6, 2]
const fig16 = plane({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], E: E16, F: meet([0, 0], E16, [4, 0], [4, 4]) }, 130, { s: 'A-B-C-D-A B-E-C A-E A-C', l: { F: 'nw' } })
const A17: Pt = [4.5, 7], B17: Pt = [0, 0], C17: Pt = [8, 0]
const D17 = mid(B17, C17), P17 = along(A17, C17, 1 / 3), Q17 = along(A17, C17, 2 / 3)
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, P: P17, Q: Q17, T: meet(B17, P17, A17, D17) }, 120, { s: 'A-B-C-A A-D B-P D-Q', l: { T: 'w' } })
// drawn taller than the real height 5√7, as in the book
const p18 = pyr4(30, 26)
const fig18 = solid({ ...p18, M: along3(p18.B, p18.V, 18 / 25) }, PYR4, 130, { seg: 'A-M M-C', l: { O: '', M: 'e' } })

export const M83: EnModel = {
  id: 'en-83',
  title: 'Paralela 45, Testul 52',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 179–181',
  items: [
    { text: 'Numărul perechilor $(a,\\,b)$ de numere naturale nenule care verifică condiția $2a+5b=50$ este:', choices: ['$3$', '$4$', '$5$', '$6$'], ans: 1 },
    {
      text: 'Tabelul de mai jos indică recolta de grâu obținută de un agricultor de pe cele trei parcele cultivate.\n\n| | Parcela I | Parcela a II-a | Parcela a III-a |\n|---|---|---|---|\n| Suprafața | $0{,}5$ ha | $1{,}5$ ha | $3$ ha |\n| Cantitatea recoltată | $1200$ kg | $3500$ kg | $8000$ kg |\n\nProducția medie de grâu obținută de agricultor de pe întreaga suprafață cultivată, în kg/ha, este:',
      choices: ['$2500$', '$2400$', '$2600$', '$2540$'], ans: 3,
    },
    { text: 'Probabilitatea ca, alegând un număr din mulțimea $\\{0,\\,1,\\,2,\\,\\ldots,\\,5\\}$, acesta să verifice inegalitatea $2^n\\geq6$, este:', choices: ['$\\dfrac{1}{2}$', '$\\dfrac{1}{6}$', '$\\dfrac{5}{6}$', '$\\dfrac{1}{3}$'], ans: 0 },
    { text: 'Scrisă sub formă de fracție ordinară ireductibilă, fracția zecimală $1{,}8(3)$ este:', choices: ['$\\dfrac{32}{15}$', '$\\dfrac{183}{100}$', '$\\dfrac{11}{6}$', '$\\dfrac{61}{33}$'], ans: 2 },
    { text: 'Numerele reale pozitive $x$, $y$ verifică condițiile: $x-y=2$ și $x^2+y^2=10$. Valoarea numărului $x+y$ este:', choices: ['$-4$', '$3$', '$5$', '$4$'], ans: 3 },
    { text: 'Mihai parcurge, cu bicicleta, o anumită distanță în $3$ ore mergând cu o viteză medie de $20$ km/h. El afirmă: „Dacă aș fi mers cu $15$ km/h, aș fi avut nevoie de $4$ ore”. Afirmația lui Mihai este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $M$, $A$, $N$, $B$ sunt coliniare, în această ordine, astfel încât $AB=21$ cm și $\\dfrac{MA}{MB}=\\dfrac{NA}{NB}=\\dfrac{3}{4}$. Lungimea segmentului $MN$ este egală cu:',
      choices: ['$63$ cm', '$72$ cm', '$36$ cm', '$54$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În rombul $ABCD$, din figura alăturată, măsura unghiului $ABD$ este de $20^\\circ$. Măsura unghiului $ACB$ este:',
      choices: ['$60^\\circ$', '$50^\\circ$', '$20^\\circ$', '$70^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este desenat un paralelogram $ABCD$ cu $AB\\neq BC$. Punctul $M$ este mijlocul laturii $AB$, iar $N$ este punctul de intersecție a dreptelor $BD$ și $CM$. Pentru triunghiul $ABC$, punctul $N$ este:',
      choices: ['centrul cercului înscris', 'ortocentrul', 'centrul cercului circumscris', 'centrul de greutate'], ans: 3, fig: fig9,
    },
    {
      text: 'Dreptunghiul $ABCD$ din figura alăturată are $AC=60$ cm și unghiul dintre diagonale cu măsura de $60^\\circ$. Aria dreptunghiului este:',
      choices: ['$3600\\text{ cm}^2$', '$1800\\sqrt{3}\\text{ cm}^2$', '$1800\\text{ cm}^2$', '$900\\sqrt{3}\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată punctul $A$ este situat pe cercul $\\mathcal{C}(O,\\,R)$, $R=\\sqrt{6}$ m, iar punctul $B$ este exterior cercului, $OB=3\\sqrt{2}$ m, iar $AB=2\\sqrt{3}$ m. Dreapta $AB$ este:',
      choices: ['secantă cercului', 'tangentă cercului', 'exterioara cercului', 'perpendiculară pe $OB$'], ans: 1, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă triunghiulară regulată $VABC$ cu vârful $V$, muchia laterală $VA=6$ cm și lungimea laturii bazei $AB=6\\sqrt{2}$ cm. Volumul piramidei $VABC$ este egal cu:',
      choices: ['$36\\text{ cm}^3$', '$18\\sqrt{2}\\text{ cm}^3$', '$24\\sqrt{6}\\text{ cm}^3$', '$36\\sqrt{3}\\text{ cm}^3$'], ans: 0, fig: fig12,
    },

    {
      text: 'S-a constatat că într-o zi, la o clasă a VIII-a, numărul elevilor absenți reprezintă $\\dfrac{1}{9}$ din numărul elevilor prezenți în clasă.',
      parts: [
        { pts: 2, text: 'Dacă în clasă sunt $30$ de elevi, câți elevi sunt absenți?', ans: '$a=\\dfrac{1}{9}(n-a)$, deci $n=10a$; pentru $n=30$, $a=3$ elevi absenți' },
        { pts: 3, text: 'Dacă sunt trei absenți, care este numărul total al elevilor clasei a VIII-a?', ans: '$n=10a=30$ de elevi' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{(x+2)^2-(x-2)^2}{(x+1)^2+(x-1)^2}$, unde $x\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{4x}{x^2+1}$, pentru orice $x\\in\\mathbb{R}$.', ans: '$E(x)=\\dfrac{8x}{2x^2+2}=\\dfrac{4x}{x^2+1}$' },
        { pts: 3, text: 'Demonstrează că pentru orice număr real pozitiv $x$, are loc inegalitatea $\\dfrac{2}{E(x)}\\geq1$.', ans: '$\\dfrac{2}{E(x)}\\geq1\\Leftrightarrow\\dfrac{x^2+1}{2x}\\geq1\\Leftrightarrow x^2+1\\geq2x$ (căci $x>0$) $\\Leftrightarrow(x-1)^2\\geq0$, adevărat' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-\\dfrac{4}{3}x+4$. Notăm cu $A$ și $B$ punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea segmentului $AB$.', ans: '$A(3,\\,0)$, $B(0,\\,4)$, deci $AB=5$' },
        { pts: 3, text: 'Fie $D$ simetricul punctului $C(3,\\,-8)$ față de originea $O$ a sistemului de axe ortogonale $xOy$. Demonstrează că $D$ este situat pe reprezentarea grafică a funcției $f$.', ans: '$D(-3,\\,8)$ și $f(-3)=4+4=8$, deci $D$ este pe graficul funcției $f$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat cu $AB=4$ cm, iar $BCE$ este un triunghi isoscel cu $BE=CE=2\\sqrt{2}$ cm. Notăm cu $F$ punctul de intersecție a dreptelor $AE$ și $BC$.',
      parts: [
        { pts: 2, text: 'Arată că $BE\\parallel AC$.', ans: '$BC^2=16=BE^2+CE^2$, deci $\\triangle BCE$ este dreptunghic isoscel; $\\sphericalangle ACB=\\sphericalangle CBE=45^\\circ$ (alterne), deci $AC\\parallel BE$' },
        { pts: 3, text: 'Demonstrează că $BF=\\dfrac{1}{3}BC$.', ans: '$\\triangle BFE\\sim\\triangle CFA$, deci $\\dfrac{BF}{FC}=\\dfrac{BE}{AC}=\\dfrac{2\\sqrt{2}}{4\\sqrt{2}}=\\dfrac{1}{2}$, de unde $BF=\\dfrac{4}{3}$ cm $=\\dfrac{1}{3}BC$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$. Punctul $D$ este mijlocul laturii $BC$, iar $P$ și $Q$ aparțin laturii $AC$ astfel încât $AP=PQ=QC$. Se știe că $DQ=6$ cm, iar $\\{T\\}=BP\\cap AD$.',
      parts: [
        { pts: 2, text: 'Arată că dreptele $BP$ și $DQ$ sunt paralele.', ans: '$DQ$ este linie mijlocie în triunghiul $CBP$, deci $DQ\\parallel BP$' },
        { pts: 3, text: 'Determină lungimea segmentului $BT$.', ans: '$TP\\parallel DQ$ și $P$ este mijlocul lui $AQ$, deci $PT$ este linie mijlocie în $\\triangle ADQ$: $BT=BP-TP=2DQ-\\dfrac{1}{2}DQ=12-3=9$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată schematic o stâncă în formă de piramidă patrulateră regulată $VABCD$, cu latura bazei $AB=30$ m și muchia laterală $VA=25$ m. Un alpinist urcă din punctul $A$ până în punctul $M\\in(VB)$ și apoi coboară în punctul $C$, unde punctul $M$ este ales, astfel încât drumul parcurs $AM+MC$ să fie cel mai scurt posibil.',
      parts: [
        { pts: 2, text: 'Calculează $AM+MC$.', ans: '$\\triangle VMA\\equiv\\triangle VMC$ (LUL), deci $AM=MC$ și suma $2AM$ e minimă când $AM\\perp VB$; apotema $VP=20$ m și $VP\\cdot AB=AM\\cdot VB$ dă $AM=24$ m, deci $AM+MC=48$ m' },
        { pts: 3, text: 'Află măsura unghiului format de dreptele $AC$ și $VB$.', ans: 'Fie $O$ centrul pătratului: $AC\\perp VO$ și $AC\\perp BD$, deci $AC\\perp(VBD)$ și $AC\\perp VB$: unghiul are $90^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
