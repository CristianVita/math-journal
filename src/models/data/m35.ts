// Testul 12 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 96–97; every answer here is computed and checked with the book's answers, p. 274).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, graph, pol, prism3 } from './shapes'

const t30 = Math.tan(Math.PI / 6), t15 = Math.tan(Math.PI / 12)

const fig7 = plane({ A: [0, 0], M: [4, 0], B: [8, 0], C: [14, 0], N: [19, 0], D: [24, 0] }, 170, { s: 'A-D', dot: 'A M B C N D', l: { A: 'n', M: 'n', B: 'n', C: 'n', N: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(155, 5), C: pol(335, 5), B: pol(205, 5), D: pol(25, 5), E: [5, 0] }, 140, { s: 'A-C B-D O-E', l: { O: 's' } })
const fig9 = plane({ A: [0, 0], B: [8, 0], C: [11, 4], D: [3, 4], M: [4, 0], N: [11 / 3, 4 / 3] }, 140, { s: 'A-B-C-D-A A-C D-M', l: { N: 'ne' } })
const fig10 = plane({ A: [0, 0], B: [10, 0], C: [4, 5], D: [0, 5], M: [7, 2.5] }, 120, { s: 'A-B-C-D-A', dot: 'M', ra: ['DAB'], l: { M: 'e' } })
const fig11 = plane({ O: [0, 0], A: [-6, 0], B: [6, 0], C: pol(60, 6) }, 110, { s: 'A-B A-C B-C', c: [{ at: 'O', r: 6 }], l: { O: '' } })
const p12 = prism3(6, 6)
const fig12 = solid({ A: p12.A, B: p12.B, C: p12.C, D: p12["A'"], E: p12["B'"], F: p12["C'"] }, 'A-B-C D-E-F A-B-E-D B-C-F-E C-A-D-F', 110, { seg: 'B-F' })

const fig15 = graph({ A: [-2, 0], B: [0, 4], L1: [-2.5, -1], L2: [0.75, 5.5] }, 120, [-3, 3], [-1.5, 6], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'nw', B: 'e', O: 'se' } })
const fig16 = plane({ A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1], E: [1, 1 - t30], F: [t15, 0], G: [-t30, 0] }, 140, { s: 'G-B-C-D-A D-G D-E D-F E-G', l: { A: 's', F: 's', G: 's' } })
const fig17 = plane({ A: [0, 0], B: [12, 0], C: [12, 4], D: [0, 4], O: [6, 2], E: [12, -4], F: [8, 0] }, 150, { s: 'A-B-C-D-A A-C B-D O-E C-E', l: { O: 'n', F: 'sw' } })
const fig18 = solid(box(4, 4, 4), BOX, 110, { seg: "A'-C" })

export const M35: EnModel = {
  id: 'en-35',
  title: 'Paralela 45, Testul 12',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 96–97',
  items: [
    { text: 'Numerele $2^7\\cdot3^4\\cdot5^3$ și $2^3\\cdot3^5\\cdot5^2$ au cel mai mare divizor comun $2^x\\cdot3^y\\cdot5^z$, unde $x$, $y$, $z$ sunt numere naturale. Suma $x+y+z$ este egală cu:', choices: ['$9$', '$10$', '$11$', '$14$'], ans: 0 },
    { text: 'Dacă $\\dfrac{x+1}{5x+1}=0{,}(27)$, valoarea lui $x$ este:', choices: ['$7$', '$1$', '$2$', '$4$'], ans: 2 },
    { text: 'Dacă $a=\\sqrt{6}$ și $b=\\sqrt{3}-\\sqrt{2}$, atunci $b^2+2a$ este egal cu:', choices: ['$1+2\\sqrt{6}$', '$5$', '$1$', '$5\\sqrt{6}$'], ans: 1 },
    { text: 'Mulțimea $A=\\{x\\in\\mathbb{R}\\mid |1-x|\\le2\\}$, scrisă sub formă de interval, este:', choices: ['$[-2,\\,2]$', '$[0,\\,2]$', '$[0,\\,3]$', '$[-1,\\,3]$'], ans: 3 },
    { text: 'Calculând $1-2+3-4+\\ldots+99-100$, obținem:', choices: ['$-5050$', '$-50$', '$50$', '$5050$'], ans: 1 },
    { text: 'Ioana rezolvă ecuația $x^2-2x-3=0$ și afirmă că suma soluțiilor ecuației este egală cu $2$. Afirmația Ioanei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine, astfel încât $AD=24$ cm și $BC=6$ cm. Punctul $M$ este mijlocul segmentului $AB$, iar punctul $N$ este mijlocul segmentului $CD$. Lungimea segmentului $MN$ este egală cu:',
      choices: ['$10$ cm', '$15$ cm', '$18$ cm', '$20$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiurile opuse la vârf $AOB$ și $COD$. Măsura unghiului $BOC$ este egală cu $130^\\circ$, iar semidreapta $OE$ este bisectoarea unghiului $COD$. Măsura unghiului $AOE$ este egală cu:',
      choices: ['$120^\\circ$', '$130^\\circ$', '$145^\\circ$', '$155^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un paralelogram $ABCD$ cu diagonala $AC=12$ cm. Punctul $M$ este mijlocul segmentului $AB$, iar $N$ este punctul de intersecție a dreptelor $AC$ și $DM$. Lungimea segmentului $AN$ este egală cu:',
      choices: ['$4$ cm', '$6$ cm', '$8$ cm', '$10$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul dreptunghic $ABCD$ cu bazele $AB=10$ cm și $CD=4$ cm. Dacă punctul $M$ este mijlocul laturii $BC$, atunci distanța de la punctul $M$ la dreapta $AD$ este egală cu:',
      choices: ['$6$ cm', '$7$ cm', '$8$ cm', '$10$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc cu raza $r=6$ cm. Punctele $A$, $B$ și $C$ aparțin cercului și $AB=12$ cm, iar măsura arcului mic $BC$ este de $60^\\circ$. Măsura unghiului $ABC$ este egală cu:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'În figura alăturată este desenată o prismă triunghiulară regulată $ABCDEF$ cu $AB=AD$. Măsura unghiului determinat de dreptele $AD$ și $BF$ este egală cu:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 1, fig: fig12,
    },

    {
      text: 'Trei numere naturale nenule $a$, $b$ și $c$ îndeplinesc următoarele condiții: $a$ este diferit de $0$, $b$ împărțit la $a$ dă câtul $2$ și restul $3$, iar $c$ este de $4$ ori mai mare decât $a$.',
      parts: [
        { pts: 2, text: 'Află cât la sută din $c$ reprezintă numărul $a$.', ans: '$\\dfrac{a}{c}=\\dfrac{a}{4a}=\\dfrac{1}{4}=25\\%$' },
        { pts: 3, text: 'Află cele trei numere, știind că suma lor este egală cu $87$.', ans: '$a+(2a+3)+4a=87$, deci $a=12$, $b=27$, $c=48$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x+1}{x-1}+\\dfrac{x-1}{x+1}\\right)\\cdot\\left(\\dfrac{x}{2}-\\dfrac{1}{2x}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=x+\\dfrac{1}{x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$\\dfrac{2x^2+2}{x^2-1}\\cdot\\dfrac{x^2-1}{2x}=\\dfrac{x^2+1}{x}=x+\\dfrac{1}{x}$' },
        { pts: 3, text: 'Arată că, pentru orice $n\\in\\mathbb{N}$, $n\\ge2$, numărul $n(E(n)-2)$ este natural, pătrat perfect.', ans: '$n\\left(n+\\dfrac{1}{n}-2\\right)=n^2-2n+1=(n-1)^2$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat, în sistemul de axe ortogonale $xOy$, graficul unei funcții $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$, $a,\\,b\\in\\mathbb{R}$, care trece prin punctele $A(-2,\\,0)$ și $B(0,\\,4)$.',
      parts: [
        { pts: 2, text: 'Determină numerele $a$ și $b$.', ans: '$f(0)=b=4$ și $f(-2)=-2a+4=0$, deci $a=2$, $b=4$' },
        { pts: 3, text: 'Arată că perimetrul triunghiului $AOB$ este mai mic decât $11$.', ans: '$P=2+4+\\sqrt{20}<6+\\sqrt{25}=11$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este desenat un pătrat $ABCD$ și punctele $E$, $F$, $G$ astfel încât $E\\in(BC)$, $F\\in(AB)$ și $A\\in(BG)$. Se știe că $\\sphericalangle CDE=30^\\circ$, $\\sphericalangle ADF=15^\\circ$ și $AG=CE$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $DEG$ este isoscel.', ans: '$AG=CE$, $DA=DC$ și $\\sphericalangle GAD=\\sphericalangle ECD=90^\\circ$, deci $\\triangle GAD\\equiv\\triangle ECD$ și $DG=DE$' },
        { pts: 3, text: 'Află măsura unghiului determinat de dreptele $DF$ și $EG$.', ans: '$\\sphericalangle ADG=\\sphericalangle CDE=30^\\circ$, deci $\\sphericalangle GDE=90^\\circ$ și $\\sphericalangle GDF=45^\\circ$; $DF$ e bisectoarea în triunghiul isoscel $GDE$, deci unghiul este $90^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$, cu $O$ punctul de intersecție a diagonalelor și laturile $AB=12$ cm și $BC=4$ cm. Punctul $E$ este simetricul lui $C$ față de $B$, iar $F$ este punctul de intersecție a dreptelor $AB$ și $EO$.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $CEO$.', ans: '$CE=8$ cm, distanța de la $O$ la $CE$ este $6$ cm, deci $\\mathcal{A}_{CEO}=24\\text{ cm}^2$' },
        { pts: 3, text: 'Determină măsura unghiului $BFC$.', ans: 'În $\\triangle ACE$, $AB$ și $EO$ sunt mediane, deci $F$ e centrul de greutate și $BF=\\dfrac{AB}{3}=4$ cm $=BC$; $\\sphericalangle BFC=45^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat un paralelipiped dreptunghic $ABCDA'B'C'D'$ cu $AB=BC=4$ cm și $A'C=4\\sqrt{3}$ cm.",
      parts: [
        { pts: 2, text: "Arată că paralelipipedul $ABCDA'B'C'D'$ este cub.", ans: "$AC=4\\sqrt{2}$ cm, $AA'=\\sqrt{48-32}=4$ cm $=AB=BC$" },
        { pts: 3, text: "Calculează distanța de la punctul $B$ la dreapta $A'C$.", ans: "$\\triangle A'BC$ e dreptunghic în $B$: $d=\\dfrac{A'B\\cdot BC}{A'C}=\\dfrac{4\\sqrt{2}\\cdot4}{4\\sqrt{3}}=\\dfrac{4\\sqrt{6}}{3}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
