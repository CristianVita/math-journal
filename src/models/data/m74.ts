// Testul 43 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 161–163; every answer here is computed and checked with the book's answers, p. 285).
import type { EnModel } from '../types'
import type { P3, Pt } from '../figure'
import { along, along3, mid, plane, solid } from '../figure'
import { graph, pol, PYR4, pyr4, TETRA } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], N: [2.5, 0], M: [5, 0], B: [10, 0] }, 160, { s: 'A-B', dot: 'A N M B', l: { A: 'n', N: 'n', M: 'n', B: 'n' } })
const fig8 = plane({ O: [0, 0], C: [5, 0], B: pol(46, 5), D: pol(68, 5), A: [0, 5] }, 110, { s: 'O-A O-B O-C O-D' })
const fig9 = plane({ B: [0, 0], C: [12, 0], A: pol(60, 6) }, 130, { s: 'A-B-C-A', ra: ['BAC'] })
const B10 = pol(-15, 100), D10 = pol(15, 100)
const fig10 = plane({ A: [0, 0], B: B10, D: D10, C: [B10[0] + D10[0], 0] }, 150, { s: 'A-B-C-D-A', ang: ['DAB'] })
const R11 = 4 / s3
const fig11 = plane({ O: [0, 0], A: pol(-150, R11), B: pol(-30, R11), C: [0, R11], M: [0, -R11 / 2] }, 110, { s: 'A-B', d: 'C-M', c: [{ at: 'O', r: R11 }], dot: 'O C', l: { M: '', O: 'e' } })
const y12 = (9 * s3) / 2
const p12: Record<string, P3> = { A: [0, y12, 0], B: [4.5, 0, 0], C: [9, y12, 0], V: [4.5, (2 * y12) / 3, 13], O: [4.5, (2 * y12) / 3, 0] }
const fig12 = solid(p12, TETRA('A', 'B', 'C', 'V'), 110, { seg: 'V-O', dot: 'O' })

const fig15 = graph({ A: [4, 0], B: [0, 8], L1: [-0.25, 8.5], L2: [4.75, -1.5] }, 120, [-1.5, 5.5], [-1.5, 9], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'ne', B: 'e' } })
const A16: Pt = [0, 0], B16: Pt = [10, 0], M16 = pol(60, 5)
const D16 = along(M16, A16, 0.6), C16 = along(M16, B16, 0.6)
const fig16 = plane({ A: A16, B: B16, M: M16, D: D16, C: C16, N: mid(A16, B16), P: mid(D16, C16) }, 150, { s: 'A-B-M-A D-C', dot: 'N P', l: { N: 's', P: 's', D: 'w', C: 'e' } })
const fig17 = plane({ A: [0, 0], C: [8, 0], B: [3, 4] }, 130, { s: 'A-B-C-A' })
const l18 = 16 * s2, p18 = pyr4(l18, 12)
const fig18 = solid({ ...p18, P: along3(p18.B, p18.A, (2 * Math.sqrt(17)) / l18), N: along3(p18.B, p18.C, 1 / 6) }, PYR4, 130, { seg: 'V-N N-P', l: { O: '', P: 's', N: 'e' } })

export const M74: EnModel = {
  id: 'en-74',
  title: 'Paralela 45, Testul 43',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 161–163',
  items: [
    { text: 'Cel mai mare divizor comun al numerelor $360$ și $432$ este:', choices: ['$72$', '$6$', '$8$', '$9$'], ans: 0 },
    {
      text: 'În tabelul următor sunt prezentate temperaturile înregistrate într-o lună într-o localitate.\n\n| Temperatura | $-11^\\circ$ | $-7^\\circ$ | $-1^\\circ$ | $0^\\circ$ | $1^\\circ$ | $8^\\circ$ |\n|---|---|---|---|---|---|---|\n| Numărul de zile | $2$ | $5$ | $9$ | $8$ | $3$ | $4$ |\n\nValoarea medie a temperaturii înregistrate în acea lună în localitate a fost:',
      choices: ['$-2^\\circ$', '$-1^\\circ$', '$0^\\circ$', '$1^\\circ$'], ans: 1,
    },
    { text: 'Dacă $a$ și $b$ sunt numere reale nenule, astfel încât $\\dfrac{2a}{3}=\\dfrac{5}{7b}$, rezultatul calculului $21-28ab$ este:', choices: ['$-8$', '$-9$', '$9$', '$0$'], ans: 1 },
    {
      text: 'Patru elevi, Ion, Maria, Andrei și Elena, măsoară lungimea gardului școlii la care învață. Rezultatele măsurătorilor sunt prezentate în tabelul următor.\n\n| Elevul | Ion | Maria | Andrei | Elena |\n|---|---|---|---|---|\n| Lungimea măsurată | $631{,}87$ m | $632{,}48$ m | $631{,}7$ m | $632{,}4$ m |\n\nȘtiind că lungimea gardului este egală cu $632$ m, elevul care a făcut cea mai bună aproximare este:',
      choices: ['Ion', 'Maria', 'Andrei', 'Elena'], ans: 0,
    },
    { text: 'Fie $a$ un element al mulțimii $\\left\\{\\sqrt{1},\\,\\sqrt{2},\\,\\sqrt{3},\\,\\sqrt{4},\\,\\sqrt{5}\\right\\}$. Probabilitatea ca $1$, $2$ și $a$ să fie lungimile laturilor unui triunghi dreptunghic este:', choices: ['$\\dfrac{5}{2}$', '$1$', '$\\dfrac{1}{5}$', '$0{,}4$'], ans: 3 },
    { text: 'Propoziția: „Pentru orice număr natural $n$, numărul $n^2+3n+4$ este natural par.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată este reprezentat segmentul $AB$, având lungimea de $10$ cm. Punctul $M$ este mijlocul lui $AB$, iar punctul $N$ este mijlocul lui $AM$. Lungimea segmentului $NB$ este:',
      choices: ['$2{,}5$ cm', '$5$ cm', '$7{,}5$ cm', '$8$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiurile adiacente complementare $AOB$ și $BOC$. Dacă semidreapta $OD$ este bisectoarea unghiului $AOB$ și $\\sphericalangle BOC-24^\\circ=\\sphericalangle AOD$, atunci măsura unghiului $BOD$ este egală cu:',
      choices: ['$22^\\circ$', '$30^\\circ$', '$42^\\circ$', '$60^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic cu ipotenuza $BC=12$ cm. Distanța dintre ortocentrul triunghiului și centrul său de greutate este egală cu:',
      choices: ['$5$ cm', '$6$ cm', '$7$ cm', '$4$ cm'], ans: 3, fig: fig9,
    },
    {
      text: 'Terenul din figura alăturată are forma unui romb $ABCD$ cu latura de $100$ m și măsura unghiului $A$ de $30^\\circ$. Aria terenului este:',
      choices: ['$1000\\text{ m}^2$', '$2000\\text{ m}^2$', '$4000\\text{ m}^2$', '$5000\\text{ m}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, $\\mathcal{C}(O,\\,R)$ este un cerc, $AB$ este o coardă de $4$ cm și $\\sphericalangle AOB=120^\\circ$. Perpendiculara din $O$ pe $AB$ intersectează arcul mare $AB$ în punctul $C$. Perimetrul triunghiului $ABC$ este:',
      choices: ['$9$ cm', '$10$ cm', '$11$ cm', '$12$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'În figura alăturată este schița unui stâlp $VO$ ancorat cu trei cabluri, $VA$, $VB$ și $CV$, cu lungimile de $14$ m. Dacă $AB=BC=CA=9$ m, lungimea stâlpului $VO$ este egală cu:',
      choices: ['$13$ m', '$11$ m', '$12$ m', '$10$ m'], ans: 0, fig: fig12,
    },

    {
      text: 'Într-un bloc sunt $28$ de apartamente cu două și cu trei camere. În total sunt $73$ de camere.',
      parts: [
        { pts: 2, text: 'Este posibil ca numărul apartamentelor cu două camere să fie egal cu numărul apartamentelor cu trei camere?', ans: 'Nu: ar fi $14\\cdot2+14\\cdot3=70\\neq73$ de camere' },
        { pts: 3, text: 'Câte dintre apartamente au trei camere?', ans: '$x+y=28$ și $2x+3y=73$, deci $y=17$ apartamente cu trei camere' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2x}{x^2-1}-\\dfrac{1}{x+1}-\\dfrac{1}{1-x}\\right)\\cdot(x^2-2x+1)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $\\dfrac{2x}{x^2-1}-\\dfrac{1}{1+x}=\\dfrac{1}{x-1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: '$\\dfrac{2x-(x-1)}{(x-1)(x+1)}=\\dfrac{x+1}{(x-1)(x+1)}=\\dfrac{1}{x-1}$' },
        { pts: 3, text: 'Demonstrează că numărul $n=\\sqrt{E(2)\\cdot E(4)\\cdot E(7)}$ este natural.', ans: '$E(x)=\\dfrac{2}{x-1}\\cdot(x-1)^2=2(x-1)$, deci $n=\\sqrt{2\\cdot6\\cdot12}=12\\in\\mathbb{N}$' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=8-2x$.',
      parts: [
        { pts: 2, text: 'Calculează $P=f(0)\\cdot f(1)\\cdot\\ldots\\cdot f(10)$.', ans: '$f(4)=0$, deci $P=0$' },
        { pts: 3, text: 'Dacă $A$ și $B$ sunt punctele de intersecție a graficului funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, arată că distanța dintre $A$ și $B$ este mai mică decât $9$.', ans: '$A(4,\\,0)$, $B(0,\\,8)$, $AB=\\sqrt{16+64}=\\sqrt{80}<\\sqrt{81}=9$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez $ABCD$, $AB\\parallel CD$, în care $\\sphericalangle A=60^\\circ$, $\\sphericalangle B=30^\\circ$, $\\{M\\}=AD\\cap BC$, iar $N$ și $P$ sunt mijloacele laturilor $AB$, respectiv $CD$.',
      parts: [
        { pts: 2, text: 'Arată că punctele $M$, $N$ și $P$ sunt coliniare.', ans: '$\\triangle MDC\\sim\\triangle MAB$, deci și triunghiurile $MDP$ și $MAN$ sunt asemenea, de unde $\\sphericalangle DMP=\\sphericalangle AMN$, adică $M$, $N$, $P$ sunt coliniare' },
        { pts: 3, text: 'Dacă $AB=10$ cm și $CD=6$ cm, calculează lungimea segmentului $NP$.', ans: '$\\sphericalangle AMB=90^\\circ$, deci $MN=\\dfrac{AB}{2}=5$ cm, $MP=\\dfrac{CD}{2}=3$ cm și $NP=MN-MP=2$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În triunghiul $ABC$ avem: $AB=5$ cm, $AC=8$ cm, iar sinusul unghiului $BAC$ este egal cu $0{,}8$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea laturii $BC$.', ans: 'Fie $D$ proiecția lui $B$ pe $AC$: $BD=AB\\cdot\\sin A=4$ cm, $AD=3$ cm, $DC=5$ cm, deci $BC=\\sqrt{41}$ cm' },
        { pts: 3, text: 'Determină aria triunghiului $ABC$.', ans: '$\\mathcal{A}_{ABC}=\\dfrac{BD\\cdot AC}{2}=16\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida patrulateră regulată $VABCD$, cu muchia bazei $AB=16\\sqrt{2}$ cm și muchia laterală $VA=20$ cm.',
      parts: [
        { pts: 2, text: 'Calculează perimetrul secțiunii diagonale $VAC$ a piramidei.', ans: '$AC=16\\sqrt{2}\\cdot\\sqrt{2}=32$ cm, deci perimetrul este $20+20+32=72$ cm' },
        { pts: 3, text: 'Punctul $P$ se află pe muchia $AB$, astfel încât $BP=2\\sqrt{17}$ cm, iar punctul $N$ se află pe muchia $BC$ astfel încât suma $VN+NP$ este minimă. Demonstrează că $NC=5NB$.', ans: 'Fie $M$ mijlocul lui $BC$: $VM=\\sqrt{400-128}=4\\sqrt{17}$ cm. Suma e minimă când $V$, $N$, $P$ sunt coliniare pe desfășurare; din $\\triangle PBN\\sim\\triangle VMN$: $\\dfrac{BN}{NM}=\\dfrac{BP}{VM}=\\dfrac{1}{2}$, deci $BN=\\dfrac{BM}{3}=\\dfrac{BC}{6}$ și $NC=5NB$' },
      ],
      fig: fig18,
    },
  ],
}
