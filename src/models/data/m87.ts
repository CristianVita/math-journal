// Testul 56 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 188–190; every answer here is computed and checked with the book's answers, pp. 289–290).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)
const mirror = (p: Pt, a: Pt, b: Pt): Pt => { const f = foot(p, a, b); return [2 * f[0] - p[0], 2 * f[1] - p[1]] }

const fig7 = plane({ A: [0, 0], B: [1, 0], C: [4, 0], D: [9, 0], E: [10, 0], L1: [-0.6, 0], L2: [10.6, 0] }, 170, { s: 'L1-L2', dot: 'A B C D E', l: { L1: '', L2: '', A: 's', B: 's', C: 's', D: 's', E: 's' } })
const g8 = 22 + 43 / 60
const fig8 = plane({ O: [0, 0], B: pol(5, 5), M: pol(5 + g8, 5), A: pol(55, 5), N: pol(55 + g8, 5) }, 120, { s: 'O-B O-M O-A O-N', l: { O: 'w' } })
const fig9 = plane({ B: [-6 * s3, 0], A: [-2 * s3, 0], O: [0, 0], M: [0, 6] }, 150, { s: 'B-O-M-B M-A', ra: ['BOM'] })
const fig10 = plane({ A: [0, 0], B: [20, 0], C: [20, 15], D: [0, 15] }, 100, { s: 'A-B-C-D-A' })
const fig11 = plane({ O: [0, 0], A: pol(270, 3), B: pol(30, 3), C: pol(150, 3), D: [4.2, -3] }, 120, { s: 'A-B-C-A A-D', c: [{ at: 'O', r: 3 }], dot: 'O' })

const fig15 = graph({ A: [-1, 1], B: [1, 5], L1: [-2.2, -1.4], L2: [1.4, 5.8] }, 110, [-3, 3], [-1.6, 6.2], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'w', B: 'e' } })
const A16: Pt = [3, 5], B16: Pt = [0, 0], C16: Pt = [6, 0], P16: Pt = [2.5, 0]
const fig16 = plane({ A: A16, B: B16, C: C16, P: P16, M: mirror(P16, A16, B16), N: mirror(P16, A16, C16) }, 140, { s: 'A-B-C-A A-M A-N', d: 'P-M P-N', l: { P: 's' } })
const fig17 = plane({ A: [0, 0], B: [12, 0], C: [12, 12], D: [0, 12], O: [6, 6], M: [0, 9], N: [4, 12] }, 120, { s: 'A-B-C-D-A M-N', d: 'O-M O-N', c: [{ at: 'O', r: 6 }], dot: 'O' })
const fig18 = solid(box(6, 6, 6), BOX, 110)

export const M87: EnModel = {
  id: 'en-87',
  title: 'Paralela 45, Testul 56',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 188–190',
  items: [
    { text: 'Numărul numerelor naturale de două cifre care împărțite la $7$ dau restul egal cu $2$ este:', choices: ['$10$', '$11$', '$12$', '$13$'], ans: 2 },
    {
      text: 'În tabelul de mai jos este prezentată situația notelor obținute de elevii unei școli la Evaluarea Națională.\n\n| Media | $<4$ | $4-4{,}99$ | $5-5{,}99$ | $6-6{,}99$ | $7-7{,}99$ | $8-8{,}99$ | $9-9{,}99$ | $10$ |\n|---|---|---|---|---|---|---|---|---|\n| Numărul de elevi | $3$ | $4$ | $5$ | $4$ | $11$ | $22$ | $34$ | $7$ |\n\nProcentul care reprezintă numărul mediilor cel puțin egale cu $8$ din numărul total este:',
      choices: ['$70\\%$', '$50\\%$', '$80\\%$', '$41\\%$'], ans: 0,
    },
    { text: 'Cel mai apropiat număr întreg de numărul $-\\dfrac{5}{4}$ este numărul:', choices: ['$-2$', '$-1$', '$-1{,}5$', '$0$'], ans: 1 },
    { text: 'Dacă $x$, $y$ sunt numere reale nenule și $5x=6y$, atunci numărul $\\dfrac{10x}{3y}$ este egal cu:', choices: ['$2$', '$\\dfrac{25}{9}$', '$1$', '$4$'], ans: 3 },
    {
      text: 'Patru elevi, Ion, Maria, Vlad și Elena, calculează media geometrică a numerelor $3\\sqrt{8}$ și $4\\sqrt{18}$. Ei obțin rezultatele:\n\n| Elevul | Ion | Maria | Vlad | Elena |\n|---|---|---|---|---|\n| Rezultatul | $144$ | $12\\sqrt{2}$ | $9\\sqrt{2}$ | $12$ |\n\nRăspunsul corect este cel dat de:',
      choices: ['Ion', 'Maria', 'Vlad', 'Elena'], ans: 3,
    },
    { text: 'Ionuț călătorește cu trenul. El pleacă la ora $21{:}07$ și ajunge la destinație la ora $02{:}42$. El afirmă că a mers cu trenul $5$ h și $35$ minute. Afirmația lui Ionuț este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$, $E$ sunt coliniare și $AC=4$ cm, $BD=8$ cm, $BC=3$ cm, iar $AE=10$ cm. Sunt congruente segmentele:',
      choices: ['$BC$ și $CD$', '$AC$ și $CD$', '$CE$ și $AC$', '$AB$ și $DE$'], ans: 3, fig: fig7,
    },
    {
      text: "În figura alăturată, $AOB$ este un unghi cu măsura $50^\\circ$, $OM$ este o semidreaptă interioară unghiului, $\\sphericalangle MOB=22^\\circ43'7''$, iar $ON$ este o semidreaptă exterioară unghiului $AOB$, $\\sphericalangle AON=22^\\circ43'7''$. Măsura unghiului $MON$ este:",
      choices: ['$40^\\circ$', '$42^\\circ$', "$49^\\circ36'43''$", '$50^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $MOB$, având ipotenuza $MB$ și măsura unghiului $OBM$ egală cu $30^\\circ$. Pe cateta $OB$ se consideră punctul $A$, astfel încât $AB=4\\sqrt{3}$ cm și măsura unghiului $MAO$ este de $60^\\circ$. Lungimea segmentului $OM$ este:',
      choices: ['$4$ cm', '$5$ cm', '$6$ cm', '$8$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'Un teren de joacă pentru copii are formă de dreptunghi. Lungimea acestuia este de $20$ m, iar lățimea are $0{,}75$ din lungime (vezi figura alăturată). Aria terenului este egală cu:',
      choices: ['$300\\text{ m}^2$', '$70\\text{ m}^2$', '$300$ m', '$150\\text{ m}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ înscris în cercul $\\mathcal{C}(O)$. Dreapta $AD$ este tangentă în $A$ la cercul $\\mathcal{C}(O)$ și $\\sphericalangle BAD=60^\\circ$. Măsura unghiului $ACB$ este egală cu:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'Un bazin în formă de cub are latura de $2{,}5$ m. În el se pune apă până la înălțimea de $2$ m. Zilnic se scot $1250\\ \\ell$ de apă din bazin. Numărul de zile în care bazinul se golește este:',
      choices: ['$5$', '$10$', '$4$', '$20$'], ans: 1,
    },

    {
      text: 'Două numere naturale $a$ și $b$ au cel mai mare divizor comun egal cu $15$ și cel mai mic multiplu comun egal cu $420$.',
      parts: [
        { pts: 2, text: 'Arată că $a\\cdot b=6300$.', ans: '$a\\cdot b=(a,\\,b)\\cdot[a,\\,b]=15\\cdot420=6300$' },
        { pts: 3, text: 'Determină numerele $a$ și $b$.', ans: '$a=15x$, $b=15y$, $(x,\\,y)=1$ și $xy=28$: $(a,\\,b)\\in\\{(15,\\,420),\\,(60,\\,105),\\,(105,\\,60),\\,(420,\\,15)\\}$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{1}{x(x+1)}+\\dfrac{1}{(x+1)(x+2)}+\\dfrac{1}{(x+2)(x+3)}+\\dfrac{1}{x+3}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,-1,\\,0\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{1}{x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,-1,\\,0\\}$.', ans: '$E(x)=\\dfrac{1}{x}-\\dfrac{1}{x+1}+\\dfrac{1}{x+1}-\\dfrac{1}{x+2}+\\dfrac{1}{x+2}-\\dfrac{1}{x+3}+\\dfrac{1}{x+3}=\\dfrac{1}{x}$' },
        { pts: 3, text: 'Demonstrează că numărul $n=E(1)+E\\left(\\dfrac{1}{3}\\right)+E\\left(\\dfrac{1}{5}\\right)+E\\left(\\dfrac{1}{7}\\right)+E\\left(\\dfrac{1}{9}\\right)+E\\left(\\dfrac{1}{11}\\right)+E\\left(\\dfrac{1}{13}\\right)$ este pătratul unui număr natural.', ans: '$n=1+3+5+7+9+11+13=49=7^2$' },
      ],
    },
    {
      text: 'Considerăm funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+3$ și punctele $A(-1,\\,a)$ și $B(b,\\,5)$, situate pe reprezentarea grafică a funcției $f$ în sistemul de axe ortogonale $xOy$, cu $a,\\,b\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Arată că $a=1$ și $b=1$.', ans: '$f(-1)=a$, deci $a=1$; $f(b)=5$, deci $2b+3=5$ și $b=1$' },
        { pts: 3, text: 'Calculează lungimea segmentului $AB$.', ans: '$AB=\\sqrt{(1+1)^2+(5-1)^2}=\\sqrt{20}=2\\sqrt{5}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $P$ este un punct pe latura $BC$ a triunghiului ascuțitunghic $ABC$, iar $M$ și $N$ sunt simetricele punctului $P$ față de dreapta $AB$, respectiv $AC$.',
      parts: [
        { pts: 2, text: 'Arată că $AM=AN$.', ans: '$AB$ este mediatoarea lui $PM$, iar $AC$ a lui $PN$, deci $AM=AP=AN$' },
        { pts: 3, text: 'Arată că, oricare ar fi poziția punctului $P$ pe latura $BC$, punctele $M$, $A$ și $N$ nu pot fi coliniare.', ans: '$\\sphericalangle MAB=\\sphericalangle BAP$ și $\\sphericalangle PAC=\\sphericalangle CAN$, deci $\\sphericalangle MAN=2\\sphericalangle BAC<180^\\circ$, căci $\\sphericalangle BAC<90^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat de centru $O$ și latură $AB=12$ cm. Pe latura $AD$ considerăm punctul $M$, astfel încât $DM=3$ cm, iar pe latura $CD$ considerăm punctul $N$, astfel încât $DN=4$ cm.',
      parts: [
        { pts: 2, text: 'Arată că aria triunghiului $OMN$ este egală cu $15\\text{ cm}^2$.', ans: '$\\mathcal{A}_{OMN}=\\mathcal{A}_{ADC}-\\mathcal{A}_{ONC}-\\mathcal{A}_{OMA}-\\mathcal{A}_{DMN}=72-24-27-6=15\\text{ cm}^2$' },
        { pts: 3, text: 'Demonstrează că $MN$ este tangentă cercului înscris pătratului.', ans: '$MN=\\sqrt{9+16}=5$ cm, iar distanța de la $O$ la $MN$ este $\\dfrac{2\\cdot15}{5}=6$ cm, egală cu raza cercului înscris, deci $MN$ este tangentă cercului' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentat un cub din lemn, având muchia de $6$ cm. Tăiem cubul în $27$ de cubulețe egale.',
      parts: [
        { pts: 2, text: 'Arată că muchia unui cubuleț este de $2$ cm.', ans: '$27\\cdot\\ell^3=6^3=216$, deci $\\ell^3=8$ și $\\ell=2$ cm' },
        { pts: 3, text: 'Înainte de tăiere, vopsim cubul în albastru și constatăm că avem nevoie de exact $80$ g de vopsea. Câtă vopsea albastră mai este necesară pentru a vopsi fețele noi, rezultate în urma tăierii?', ans: 'Cele $27$ de cubulețe au $162$ de fețe, dintre care $54$ sunt vopsite; mai trebuie vopsite $108$ fețe, de două ori cât cele $54$: $160$ g de vopsea' },
      ],
      fig: fig18,
    },
  ],
}
