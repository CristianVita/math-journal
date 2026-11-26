// Testul 6 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 84–85; every answer here is computed and checked with the book's answers, p. 271).
import type { EnModel } from '../types'
import { plane, solid, type Fig } from '../figure'
import { box, BOX, pol } from './shapes'

const s3 =Math.sqrt(3), s6 = Math.sqrt(6)

const fig7 = plane({ A: [0, 0], M: [3, 0], C: [6, 0], N: [12, 0], B: [18, 0] }, 160, { s: 'A-B', dot: 'A M C N B', l: { A: 'n', M: 'n', C: 'n', N: 'n', B: 'n' } })
const fig8 = plane({ O: [0, 0], B: [6, 0], A: pol(120, 6), M: pol(60, 4), N: [4, 0] }, 120, { s: 'O-A O-B O-M M-N', ang: ['BOA'], l: { O: 's', N: 's' } })
const fig9 = plane({ A: [3, 3 * s3], B: [0, 0], C: [6, 0] }, 90, { s: 'A-B-C-A' })
const fig10 = plane({ D: [0, 0], C: [24, 0], A: [6, 6 * s3], B: [30, 6 * s3] }, 150, { s: 'A-B-C-D-A' })
// the hatched part is the sector AOB, of 72°
const f11 = plane({ O: [0, 0], A: pol(234, 5), B: pol(306, 5) }, 100, { s: 'O-A O-B', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 'n' } })
const r11 = Math.hypot(f11.p.A[0] - f11.p.O[0], f11.p.A[1] - f11.p.O[1])
const fig11: Fig = { ...f11, path: [{ d: `M${f11.p.O[0]} ${f11.p.O[1]} L${f11.p.A[0]} ${f11.p.A[1]} A${r11} ${r11} 0 0 0 ${f11.p.B[0]} ${f11.p.B[1]} Z`, hatch: true }] }
const fig12 = solid(box(4, 3, 12), BOX, 90, { seg: "A-C'" })

const B16: [number, number] = [6 * s3, 0], D16: [number, number] = [0, 3 * s6]
const fig16 = plane({ A: [0, 0], B: B16, C: [6 * s3, 3 * s6], D: D16, M: [3 * s3, 0], E: [(2 * D16[0] + B16[0]) / 3, (2 * D16[1] + B16[1]) / 3] }, 150,
  { s: 'A-B-C-D-A D-B A-E C-M', l: { E: 'n' } })
const fig17 = plane({ B: [0, 6], A: [6, 6], D: [6, 0], C: [0, 0], O: [3, 3], T: [3 - 3 * (s3 - 1) / 2, 3 - 3 * (s3 + 1) / 2] }, 110,
  { s: 'B-A-D-C-B B-D A-C O-T-D B-T', l: { O: 'e' } })
const fig18 = solid({ A: [0, 6, 0], B: [2 * s3, 0, 0], C: [4 * s3, 6, 0], V: [2 * s3, 4, 2 * s3], O: [2 * s3, 4, 0], M: [3 * s3, 3, 0], P: [2 * s3, 4, 2] },
  'A-B-C A-B-V B-C-V C-A-V', 140, { seg: 'V-O V-M O-M P-M P-B P-C', l: { O: 's', M: 'se', P: 'w' } })

export const M29: EnModel = {
  id: 'en-29',
  title: 'Paralela 45, Testul 6',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 84–85',
  items: [
    { text: 'Dintre numerele $4$, $5$, $6$, $12$, cel care are exact trei divizori naturali este:', choices: ['$4$', '$5$', '$6$', '$12$'], ans: 0 },
    { text: 'Soluția din mulțimea numerelor reale a ecuației $3{,}2-2\\cdot x=1{,}4$ este:', choices: ['$1{,}8$', '$0{,}6$', '$0{,}9$', '$2{,}3$'], ans: 2 },
    { text: 'Alegând un număr de forma $\\overline{1x2}$, probabilitatea ca acesta să fie divizibil cu $3$ este:', choices: ['$\\dfrac{2}{5}$', '$\\dfrac{3}{10}$', '$\\dfrac{3}{9}$', '$\\dfrac{2}{10}$'], ans: 0 },
    { text: 'Cel mai mic număr natural $n$ pentru care $3\\sqrt{n}\\in\\left(2\\sqrt{5},\\,4\\sqrt{3}\\right)$ este:', choices: ['$0$', '$1$', '$3$', '$5$'], ans: 2 },
    {
      text: 'Patru eleve, Ana, Crina, Diana și Mihaela, au avut de calculat produsul numerelor $a=1+(3-\\sqrt{2})(1+\\sqrt{2})$ și $b=(\\sqrt{2}+1)^{-1}$. Rezultatele obținute sunt trecute în tabelul de mai jos:\n\n| Ana | Crina | Diana | Mihaela |\n|---|---|---|---|\n| $\\sqrt{2}$ | $2-\\sqrt{2}$ | $1+2\\sqrt{2}$ | $2$ |\n\nEleva care a obținut rezultatul corect este:',
      choices: ['Mihaela', 'Crina', 'Ana', 'Diana'], ans: 0,
    },
    { text: 'Într-o urnă sunt $16$ bile. Un sfert dintre ele sunt albe și restul sunt negre. Irina afirmă: „Numărul bilelor negre din urnă este cu $12$ mai mare decât cel al bilelor albe”. Afirmația Irinei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$ și $C$, cu $BC=2AC$. Dacă $M$ este mijlocul segmentului $AC$, $N$ este mijlocul segmentului $CB$ și $MN=9$ cm, atunci lungimea segmentului $AC$ este egală cu:',
      choices: ['$3$ cm', '$6$ cm', '$18$ cm', '$9$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiul $AOB$ are măsura egală cu $120^\\circ$, $OM$ este bisectoarea sa și $MN$ este paralelă cu $OA$, unde $N\\in OB$. Atunci măsura unghiului $MNO$ este egală cu:',
      choices: ['$90^\\circ$', '$120^\\circ$', '$60^\\circ$', '$30^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi echilateral $ABC$ având aria $9\\sqrt{3}\\text{ cm}^2$. Distanța de la punctul $B$ la dreapta $AC$ este egală cu:',
      choices: ['$3\\sqrt{3}$ cm', '$6\\sqrt{3}$ cm', '$9\\sqrt{3}$ cm', '$12\\sqrt{3}$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un paralelogram în care $AD=12$ cm, $\\sphericalangle ABC=60^\\circ$ și măsura unghiului $BAC$ este egală cu o treime din măsura unghiului $CAD$. Perimetrul paralelogramului $ABCD$ este egal cu:',
      choices: ['$36$ cm', '$24$ cm', '$72$ cm', '$48$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc cu centrul $O$. Măsura arcului mic $AB$ este egală cu $72^\\circ$ și aria porțiunii hașurate este egală cu $4\\pi\\text{ cm}^2$. Lungimea razei cercului este egală cu:',
      choices: ['$4$ cm', '$2\\sqrt{5}$ cm', '$20$ cm', '$10$ cm'], ans: 1, fig: fig11,
    },
    {
      text: "Un paralelipiped dreptunghic $ABCDA'B'C'D'$ are $AB=4$ cm, $AD=3$ cm și $AC'=13$ cm. Volumul paralelipipedului este egal cu:",
      choices: ['$144\\text{ cm}^3$', '$72\\text{ cm}^3$', '$36\\text{ cm}^3$', '$288\\text{ cm}^3$'], ans: 0, fig: fig12,
    },

    {
      text: 'Numărul $\\overline{xyz}$ are proprietatea că $\\overline{xyz}=\\overline{xy}+\\overline{yz}+\\overline{zx}$.',
      parts: [
        { pts: 2, text: 'Este posibil ca cifra $x$ să fie egală cu $2$? Justifică răspunsul.', ans: 'Relația devine $89x=y+10z$; pentru $x=2$ ar trebui $y+10z=178$, imposibil, pentru că $y+10z\\le99$' },
        { pts: 3, text: 'Determină numărul $\\overline{xyz}$ care îndeplinește condiția din enunț.', ans: '$x=1$ și $y+10z=89$, deci $z=8$, $y=9$: numărul $198$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2}{x}-1\\right)\\cdot\\left(\\dfrac{x+2}{2-x}+\\dfrac{2-x}{x+2}-2\\right)-4$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{-8}{x+2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.', ans: 'Paranteza a doua este $\\dfrac{\\left[(x+2)-(2-x)\\right]^2}{(2-x)(x+2)}=\\dfrac{4x^2}{(2-x)(x+2)}$, deci $E(x)=\\dfrac{4x}{x+2}-4=\\dfrac{-8}{x+2}$' },
        { pts: 3, text: 'Determină numerele întregi $n$ pentru care $E(n)$ este număr prim.', ans: '$-\\dfrac{8}{n+2}$ e prim doar pentru $n+2=-4$, adică $n=-6$ ($E(-6)=2$)' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3-2x$.',
      parts: [
        { pts: 2, text: 'Arată că $\\dfrac{f(1)-f(\\sqrt{2})}{\\sqrt{2}-1}$ este număr natural prim.', ans: '$\\dfrac{1-3+2\\sqrt{2}}{\\sqrt{2}-1}=\\dfrac{2(\\sqrt{2}-1)}{\\sqrt{2}-1}=2$' },
        { pts: 3, text: 'Reprezentarea grafică a funcției $f$ intersectează axele $Ox$ și $Oy$ ale sistemului de axe ortogonale $xOy$ în punctele $A$, respectiv $B$. Determină valoarea numărului real $m$, știind că aria triunghiului $PBA$ este egală cu $3$, unde $P(0,\\,m)$.', ans: '$A\\left(\\dfrac{3}{2},\\,0\\right)$, $B(0,\\,3)$; $\\dfrac{PB\\cdot OA}{2}=3$ dă $PB=4$, deci $m=-1$ sau $m=7$' },
      ],
    },
    {
      text: 'În figura alăturată, $ABCD$ este un dreptunghi având $BC=3\\sqrt{6}$ cm și $AB=6\\sqrt{3}$ cm. Punctul $M$ este mijlocul laturii $AB$, iar punctul $E$ aparține diagonalei $DB$ astfel încât $DE=3\\sqrt{2}$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrează că sinusul unghiului $ABD$ este mai mare decât $\\dfrac{1}{2}$.', ans: '$BD=9\\sqrt{2}$ cm, $\\sin\\sphericalangle ABD=\\dfrac{3\\sqrt{6}}{9\\sqrt{2}}=\\dfrac{1}{\\sqrt{3}}>\\dfrac{1}{2}$' },
        { pts: 3, text: 'Arată că dreptele $AE$ și $CM$ sunt paralele.', ans: 'Cu $\\{N\\}=MC\\cap BD$, $\\triangle MNB\\sim\\triangle CND$ dă $BN=\\dfrac{BD}{3}=3\\sqrt{2}$ cm, deci $N$ e mijlocul lui $EB$; $MN$ e linie mijlocie în $\\triangle BAE$, deci $AE\\parallel MN$, adică $AE\\parallel CM$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$ având centrul în $O$, iar punctul $T$ este ales astfel încât triunghiul $DOT$ să fie echilateral, cu perimetrul egal cu $9\\sqrt{2}$ cm.',
      parts: [
        { pts: 2, text: 'Arată că perimetrul pătratului $ABCD$ este egal cu $24$ cm.', ans: '$OD=3\\sqrt{2}$ cm, $BD=6\\sqrt{2}$ cm, deci $AB=6$ cm și perimetrul $24$ cm' },
        { pts: 3, text: 'Determină aria triunghiului $BDT$.', ans: '$OT=\\dfrac{BD}{2}$, deci $\\triangle BTD$ e dreptunghic în $T$; $BT=\\sqrt{72-18}=3\\sqrt{6}$, $\\mathcal{A}=\\dfrac{3\\sqrt{2}\\cdot3\\sqrt{6}}{2}=9\\sqrt{3}\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată, $VABC$ este o piramidă triunghiulară regulată, cu vârful $V$, având $VA=2\\sqrt{7}$ cm și raza cercului circumscris bazei egală cu $4$ cm.',
      parts: [
        { pts: 2, text: 'Arată că lungimea apotemei piramidei este egală cu $4$ cm.', ans: 'Cu $M$ mijlocul lui $BC$: $VO=\\sqrt{28-16}=2\\sqrt{3}$ cm, $OM=2$ cm, $VM=\\sqrt{12+4}=4$ cm' },
        { pts: 3, text: 'Dacă punctul $P\\in VO$ este astfel încât $VP=2\\sqrt{3}-2$ cm, calculează măsura unghiului determinat de planele $(VBC)$ și $(PBC)$.', ans: '$OP=OM=2$ cm, deci $\\sphericalangle PMO=45^\\circ$; $\\sphericalangle VMO=60^\\circ$, deci unghiul este $\\sphericalangle VMP=15^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
