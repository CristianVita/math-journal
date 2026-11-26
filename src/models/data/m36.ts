// Testul 13 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 98–99; every answer here is computed and checked with the book's answers, p. 274).
import type { EnModel } from '../types'
import { plane, solid, type Pt } from '../figure'
import { graph, pol, PRISM3, PYR4, pyr4 } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [10, 0], N: [20, 0], B: [30, 0], P: [44, 0], Q: [58, 0], C: [72, 0] }, 170,
  { s: 'A-C', dot: 'A M N B P Q C', l: { A: 'n', M: 'n', N: 'n', B: 'n', P: 'n', Q: 'n', C: 'n' } })
const fig8 = plane({ A: [-5, 0], O: [0, 0], B: [5, 0], C: pol(130, 5), D: pol(50, 5) }, 120, { s: 'A-B O-C O-D', ang: ['COD'], l: { O: 's', A: 's', B: 's' } })
const fig9 = plane({ B: [0, 0], C: [4 * s2, 0], A: [2 * s2, 2 * s2], X: [4 * s2 + 2, 0] }, 130, { s: 'A-B-X A-C', ra: ['BAC'], l: { X: '' } })
const D10 = pol(30, 6)
const fig10 = plane({ A: [0, 0], B: [12, 0], D: D10, C: [12 + D10[0], D10[1]], O: [(12 + D10[0]) / 2, D10[1] / 2] }, 140, { s: 'A-B-C-D-A A-C B-D', l: { O: 'n' } })
const r11 = 8, y11 = Math.sqrt(r11 * r11 - 9), x11 = Math.sqrt(r11 * r11 - 16)
const fig11 = plane({ O: [0, 0], A: [3, y11], B: [3, -y11], C: [-x11, 4], D: [x11, 4], P: [3, 4] }, 110,
  { s: 'A-B C-D', c: [{ at: 'O', r: r11 }], dot: 'O', ra: ['APD'], l: { P: 'sw', O: 's' } })
const fig12 = solid({ B: [0, 0, 0], C: [30, 0, 0], A: [15, 0, 20], "B'": [0, 100, 0], "C'": [30, 100, 0], "A'": [15, 100, 20] }, PRISM3, 150, {}, 0.2)

const fig15 = graph({ A: [0, 6], B: [7, 3], C: [2, 1], L2: [9, 15 / 7] }, 140, [-1, 9.5], [-1, 7], { s: 'A-L2 A-C B-C', dot: 'A B C', l: { L2: '', A: 'e', B: 'n', C: 's', O: 'sw' } })
const B16: Pt = [6 * s3, 6]
const fig16 = plane({ A: [0, 0], C: [6 * s3, 0], B: B16, M: [B16[0] / 2, 3] }, 120, { s: 'A-B-C-A M-C', ra: ['ACB'], l: { M: 'nw' } })
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [8, 3], D: [2, 3], E: [4, 6], N: [5, 3] }, 120, { s: 'A-B-C-D A-E B-E', l: { N: 'n', D: 'w' } })
const fig18 = solid(pyr4(15 * s2, 20), PYR4, 130, { seg: 'A-C B-D V-O', l: { O: 's' } })

export const M36: EnModel = {
  id: 'en-36',
  title: 'Paralela 45, Testul 13',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 98–99',
  items: [
    { text: 'Dintre numerele $21$, $18$, $25$ și $23$, numărul cu cei mai mulți divizori întregi este:', choices: ['$21$', '$18$', '$25$', '$23$'], ans: 1 },
    { text: 'Dacă $a$ și $b$ sunt două numere reale, astfel încât $a=25\\%\\,b$ și $a+b=105$, atunci numărul $b$ este egal cu:', choices: ['$21$', '$25$', '$84$', '$100$'], ans: 2 },
    {
      text: 'În tabelul de mai jos sunt înregistrate temperaturile medii zilnice dintr-o săptămână.\n\n| Ziua | L | M | M | J | V | S | D |\n|---|---|---|---|---|---|---|---|\n| Temperatura | $-3^\\circ$C | $-2^\\circ$C | $-5^\\circ$C | $0^\\circ$C | $2^\\circ$C | $0^\\circ$C | $x^\\circ$C |\n\nDacă temperatura medie din această săptămână a fost $-1^\\circ$C, atunci $x$ este egal cu:',
      choices: ['$-2$', '$-1$', '$0$', '$1$'], ans: 3,
    },
    { text: 'Cel mai mic dintre numerele raționale $-\\dfrac{1}{2}$, $-0{,}5(3)$, $-0{,}(53)$, $-0{,}53$ este:', choices: ['$-\\dfrac{1}{2}$', '$-0{,}5(3)$', '$-0{,}(53)$', '$-0{,}53$'], ans: 2 },
    { text: 'Dacă $a=5\\sqrt{12}-2\\sqrt{27}-\\sqrt{75}$, atunci $a^4$ este egal cu:', choices: ['$0$', '$3$', '$9$', '$81$'], ans: 2 },
    { text: 'De la Iași la Pașcani sunt $80$ km. Un biciclist pleacă din Iași la ora $8{:}00$ și merge cu viteza constantă de $15$ km/h. Lucian afirmă că biciclistul va ajunge la Pașcani la ora $13{:}30$. Afirmația lui Lucian este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $M$, $N$, $B$, $P$, $Q$, $C$ sunt coliniare, în această ordine, iar $AM=MN=NB$ și $BP=PQ=QC$. Dacă $AC=72$ cm, atunci lungimea segmentului $MQ$ este egală cu:',
      choices: ['$24$ cm', '$36$ cm', '$48$ cm', '$60$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, punctele $A$, $O$ și $B$ sunt coliniare, în această ordine, iar măsura unghiului $COD$ este egală cu $80^\\circ$. Măsura unghiului format de bisectoarele unghiurilor $AOC$ și $BOD$ este egală cu:',
      choices: ['$130^\\circ$', '$135^\\circ$', '$140^\\circ$', '$160^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ cu $\\sphericalangle ABC=45^\\circ$, $AB=4$ cm și măsura unghiului exterior din vârful $C$ egală cu $135^\\circ$. Perimetrul triunghiului $ABC$ este egal cu:',
      choices: ['$12$ cm', '$(4+4\\sqrt{2})$ cm', '$4(2+\\sqrt{2})$ cm', '$12\\sqrt{2}$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat paralelogramul $ABCD$, cu $AB=12$ cm, $AD=6$ cm și $\\sphericalangle BAD=30^\\circ$. Dacă $O$ este punctul de intersecție a diagonalelor $AC$ și $BD$, atunci aria triunghiului $AOB$ este egală cu:',
      choices: ['$9\\text{ cm}^2$', '$12\\text{ cm}^2$', '$24\\text{ cm}^2$', '$36\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ și $CD$ sunt două coarde perpendiculare ale unui cerc cu centrul în $O$. Cele două coarde se intersectează în punctul $P$ și distanțele de la $O$ la dreptele $AB$ și $CD$ sunt de $3$ cm, respectiv $4$ cm. Lungimea segmentului $OP$ este egală cu:',
      choices: ['$3$ cm', '$5$ cm', '$6$ cm', '$7$ cm'], ans: 1, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentat un cort de campanie $ABCA'B'C'$, în formă de prismă, cu muchiile laterale $AA'=BB'=CC'=100$ dm și $AB=AC=25$ dm, $BC=30$ dm. Se știe că dreapta $AA'$ este perpendiculară pe planul $(ABC)$. Pânza din care este confecționat cortul are aria (aria totală a prismei) egală cu:",
      choices: ['$8000\\text{ dm}^2$', '$8100\\text{ dm}^2$', '$8300\\text{ dm}^2$', '$8600\\text{ dm}^2$'], ans: 3, fig: fig12,
    },

    {
      text: 'Andrei, Barbu și Costel au participat la un joc de darts, obținând împreună $90$ de puncte. Punctajul lui Andrei reprezintă $60\\%$ din punctajul lui Barbu, iar punctajul lui Barbu reprezintă $50\\%$ din punctajul lui Costel.',
      parts: [
        { pts: 2, text: 'Justifică dacă Andrei și Barbu au obținut împreună $50$ de puncte.', ans: 'Nu: Costel ar avea $40$, Barbu $20$, Andrei $12$, iar $12+20\\ne50$' },
        { pts: 3, text: 'Determină numărul punctelor obținute de Costel.', ans: '$\\dfrac{3c}{10}+\\dfrac{c}{2}+c=90$, deci $c=50$ de puncte' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{7x}{12x-12}-\\dfrac{3}{2x+2}+\\dfrac{2}{1-x^2}\\right)\\cdot\\dfrac{6x-6}{7x+3}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{3}{7},\\,1\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $7x^2-11x-6=(7x+3)(x-2)$, pentru orice $x$ număr real.', ans: '$(7x+3)(x-2)=7x^2-14x+3x-6=7x^2-11x-6$' },
        { pts: 3, text: 'Arată că $E(x)=\\dfrac{x-2}{2(x+1)}$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{3}{7},\\,1\\right\\}$.', ans: 'Paranteza este $\\dfrac{7x(x+1)-18(x-1)-24}{12(x-1)(x+1)}=\\dfrac{(7x+3)(x-2)}{12(x-1)(x+1)}$, iar înmulțită cu $\\dfrac{6(x-1)}{7x+3}$ dă $\\dfrac{x-2}{2(x+1)}$' },
      ],
    },
    {
      text: 'În figura alăturată sunt reprezentate punctele $A(0,\\,6)$, $B(7,\\,3)$ și $C(2,\\,1)$ în sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Arată că dreapta $AB$ reprezintă graficul funcției $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\dfrac{42-3x}{7}$.', ans: '$f(0)=6$, deci $A\\in G_f$, și $f(7)=3$, deci $B\\in G_f$' },
        { pts: 3, text: 'Demonstrează că triunghiul $ABC$ este dreptunghic isoscel.', ans: '$AC^2=29=BC^2$, $AB^2=58=AC^2+BC^2$, deci $\\triangle ABC$ e dreptunghic isoscel, cu ipotenuza $AB$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ cu măsurile unghiurilor $A$, $B$ și $C$ direct proporționale cu $1$, $2$, respectiv $3$. Lungimea laturii $BC$ este egală cu $6$ cm.',
      parts: [
        { pts: 2, text: 'Află măsura unghiului $C$.', ans: '$\\sphericalangle A=30^\\circ$, $\\sphericalangle B=60^\\circ$, $\\sphericalangle C=90^\\circ$' },
        { pts: 3, text: 'Calculează perimetrul triunghiului $BMC$, știind că $M$ este mijlocul laturii $AB$.', ans: '$AB=2BC=12$ cm, $MC=MB=6$ cm, deci $\\triangle BMC$ e echilateral și perimetrul este $18$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un paralelogram $ABCD$. Punctul $N$ este mijlocul laturii $CD$, iar punctul $E$ este simetricul lui $A$ față de punctul $D$.',
      parts: [
        { pts: 2, text: 'Demonstrează că punctele $B$, $N$ și $E$ sunt coliniare.', ans: '$DE\\parallel BC$ și $DE=AD=BC$, deci $BCED$ e paralelogram; diagonalele $BE$ și $CD$ se înjumătățesc, deci $N\\in BE$' },
        { pts: 3, text: 'Dacă $\\mathcal{A}_{BNC}=p\\%\\cdot\\mathcal{A}_{ABE}$, află numărul $p$.', ans: '$\\mathcal{A}_{ABE}=\\mathcal{A}_{ABCD}$ (baza $AE=2AD$) și $\\mathcal{A}_{BNC}=\\dfrac{1}{4}\\mathcal{A}_{ABCD}$, deci $p=25$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida patrulateră regulată $VABCD$ cu latura bazei $AB=15\\sqrt{2}$ cm și înălțimea $VO=20$ cm.',
      parts: [
        { pts: 2, text: 'Calculează volumul piramidei $VABCD$.', ans: '$V=\\dfrac{450\\cdot20}{3}=3000\\text{ cm}^3$' },
        { pts: 3, text: 'Determină tangenta unghiului format de planele $(VAC)$ și $(VBC)$.', ans: 'Cu $OE\\perp VC$, $E\\in VC$: $BO\\perp(VAC)$, deci unghiul este $\\sphericalangle BEO$; $OC=15$, $VC=25$, $OE=12$, $\\text{tg}\\sphericalangle BEO=\\dfrac{15}{12}=\\dfrac{5}{4}$' },
      ],
      fig: fig18,
    },
  ],
}
