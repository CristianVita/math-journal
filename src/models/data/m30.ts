// Testul 7 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 86–87; every answer here is computed and checked with the book's answers, p. 272).
import type { EnModel } from '../types'
import { plane, solid, type Pt } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [1, 0], C: [2, 0], D: [3, 0], E: [4, 0], F: [5, 0] }, 160, { s: 'A-F', dot: 'A B C D E F', l: { A: 'n', B: 'n', C: 'n', D: 'n', E: 'n', F: 'n' } })
const fig8 = plane({ B: [0, 0], C: [6, 0], N: [9, 0], A: pol(25, 5), M: pol(25, 7) }, 150, { s: 'B-M B-N A-C', l: { A: 'n', C: 's', N: 's' } })
// ∡B = 40°, ∡C = 70°; I where the bisectors meet
const A9 = pol(40, 6), B9: Pt = [0, 0], C9: Pt = [6, 0]
const a9 = 6, b9 = (6 * Math.sin((40 * Math.PI) / 180)) / Math.sin((70 * Math.PI) / 180), c9 = 6
const I9: Pt = [0, 1].map((k) => (a9 * A9[k] + b9 * B9[k] + c9 * C9[k]) / (a9 + b9 + c9)) as Pt
const fig9 = plane({ A: A9, B: B9, C: C9, I: I9 }, 100, { s: 'A-B-C-A', dot: 'I', l: { I: 'n' } })
const fig10 = plane({ A: [0, 0], B: [8, 0], C: [0, 6], M: [4, 0] }, 110, { s: 'A-B-C-A', dot: 'M', ra: ['BAC'] })
const fig11 = plane({ O: [0, 0] }, 80, { c: [{ at: 'O', r: 2 }], dot: 'O', l: { O: 'n' } })
const fig12 = solid(box(4, 4, 4), BOX, 100, { seg: "A-D' B'-C" })

const fig15 = graph({ M: [4, 4] }, 120, [-1.5, 5], [-1.5, 5], { dot: 'M', l: { M: 'ne', O: 'sw' } })
const fig16 = plane({ B: [0, 0], C: [8, 0], A: [2.5, Math.sqrt(16 - 6.25)], D: [2, 0] }, 140, { s: 'A-B-C-A A-D', l: { D: 's' } })
const fig17 = plane({ A: [0, 0], B: [12, 0], C: [9, 3 * s3], D: [3, 3 * s3] }, 140, { s: 'A-B-C-D-A' })
const fig18 = solid({ A: [0, 12, 0], B: [4 * s3, 0, 0], C: [8 * s3, 12, 0], V: [4 * s3, 8, 4 * s2], O: [4 * s3, 8, 0], M: [6 * s3, 6, 0] },
  'A-B-C A-B-V B-C-V C-A-V', 140, { seg: 'V-O O-M V-M', l: { O: 'n', M: 'se' } })

export const M30: EnModel = {
  id: 'en-30',
  title: 'Paralela 45, Testul 7',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 86–87',
  items: [
    { text: 'Rezultatul calculului $3-(-2)-3\\cdot2$ este:', choices: ['$-7$', '$4$', '$-1$', '$1$'], ans: 2 },
    { text: 'Un frigider costă $1600$ de lei. După o scumpire cu $5\\%$, prețul frigiderului devine:', choices: ['$2400$ de lei', '$1680$ de lei', '$1700$ de lei', '$1760$ de lei'], ans: 1 },
    { text: 'Dintre următoarele numere, cel întreg este:', choices: ['$\\sqrt{169}$', '$\\dfrac{17}{2}$', '$2{,}5$', '$-1{,}3$'], ans: 0 },
    { text: 'Numărul natural $n$ cu proprietatea $4\\sqrt{3}<\\sqrt{n}<5\\sqrt{2}$ este:', choices: ['$48$', '$49$', '$50$', '$51$'], ans: 1 },
    {
      text: 'Patru elevi, Andrei, Bianca, Cristina și Daniel, au efectuat calculul $\\dfrac{1}{3-2\\sqrt{2}}-\\dfrac{1}{3+2\\sqrt{2}}$, iar rezultatele pe care le-au obținut sunt prezentate în tabelul următor:\n\n| Andrei | Bianca | Cristina | Daniel |\n|---|---|---|---|\n| $6$ | $4\\sqrt{2}$ | $10$ | $-4\\sqrt{2}$ |\n\nDintre cei patru elevi, cel care a răspuns corect este:',
      choices: ['Andrei', 'Bianca', 'Cristina', 'Daniel'], ans: 1,
    },
    { text: 'Diriginta împarte elevilor bomboanele dintr-o cutie. Maria observă că unii copii au luat câte două bomboane, ceilalți cinci doar câte una, iar în cutie au rămas trei bomboane. Ea afirmă că, inițial, în cutie a fost un număr par de bomboane. Afirmația Mariei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$, $E$ și $F$ sunt coliniare, în această ordine, astfel încât $AB=BC=CD=DE=EF$. Simetricul punctului $D$ față de punctul $C$ este:',
      choices: ['$A$', '$B$', '$E$', '$F$'], ans: 1, fig: fig7,
    },
    {
      text: 'Măsura unghiului $ABC$ din figura alăturată este egală cu $25^\\circ$. Suma măsurilor unghiurilor $MAC$ și $NCA$ este egală cu:',
      choices: ['$155^\\circ$', '$120^\\circ$', '$205^\\circ$', '$215^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'Punctul $I$ din figura alăturată este centrul cercului înscris în triunghiul $ABC$, iar unghiul $ABI$ are măsura de $20^\\circ$. Măsura unghiului $AIC$ este egală cu:',
      choices: ['$140^\\circ$', '$160^\\circ$', '$120^\\circ$', '$110^\\circ$'], ans: 3, fig: fig9,
    },
    {
      text: 'Triunghiul $ABC$ din figura alăturată este dreptunghic în $A$, iar punctul $M$ este mijlocul catetei $AB$. Dacă $AB=8$ cm și $AC=6$ cm, atunci distanța de la punctul $M$ la dreapta $BC$ este egală cu:',
      choices: ['$1{,}2$ cm', '$1{,}8$ cm', '$2{,}4$ cm', '$4{,}8$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'Cercul din figura alăturată are lungimea egală cu $4\\pi$ cm. Aria discului este egală cu:',
      choices: ['$\\pi\\text{ cm}^2$', '$2\\pi\\text{ cm}^2$', '$4\\pi\\text{ cm}^2$', '$16\\pi\\text{ cm}^2$'], ans: 2, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentat cubul $ABCDA'B'C'D'$. Măsura unghiului format de dreptele $AD'$ și $B'C$ este egală cu:",
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 3, fig: fig12,
    },

    {
      text: 'Dacă Diana ar pune câte trei trandafiri în fiecare vază pe care o are, ar rămâne cu un trandafir în mână. Dacă ar pune câte cinci trandafiri în fiecare vază, trei vaze ar rămâne goale.',
      parts: [
        { pts: 2, text: 'Stabilește dacă numărul vazelor poate fi egal cu $6$.', ans: 'Nu: ar fi $3\\cdot6+1=19$ trandafiri, dar $5\\cdot(6-3)=15\\ne19$' },
        { pts: 3, text: 'Câți trandafiri și câte vaze are Diana?', ans: '$t=3v+1=5(v-3)$, deci $v=8$ vaze și $t=25$ de trandafiri' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\left(\\dfrac{x+1}{x-1}\\right)^2+\\dfrac{2x+2}{1-x}+1\\right)\\cdot\\left(1-\\dfrac{2}{x+1}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{4}{x^2-1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: 'Prima paranteză este $\\left(\\dfrac{x+1}{x-1}-1\\right)^2=\\dfrac{4}{(x-1)^2}$, a doua $\\dfrac{x-1}{x+1}$, deci $E(x)=\\dfrac{4}{(x-1)(x+1)}$' },
        { pts: 3, text: 'Determină numerele reale $x$ pentru care $|E(x)|=1$.', ans: '$|x^2-1|=4$, deci $x^2=5$ ($x^2=-3$ nu se poate), adică $x\\in\\{-\\sqrt{5},\\,\\sqrt{5}\\}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3-x$.',
      parts: [
        { pts: 2, text: 'Reprezintă graficul funcției $f$ în sistemul de axe ortogonale $xOy$ din figura alăturată.', ans: 'Dreapta care trece prin $A(3,\\,0)$ și $B(0,\\,3)$' },
        { pts: 3, text: 'Considerăm punctul $M(4,\\,4)$ în sistemul de axe ortogonale $xOy$. Demonstrează că dreapta $OM$ este perpendiculară pe reprezentarea grafică a funcției $f$ în sistemul $xOy$ considerat.', ans: '$OA=OB=3$ și $MA=MB=\\sqrt{17}$, deci $OM$ este mediatoarea segmentului $AB$, adică $OM\\perp AB$' },
      ],
      fig: fig15,
    },
    {
      text: 'Pe latura $BC$ a triunghiului $ABC$ din figura alăturată se consideră un punct $D$. Se știe că $AB=4$ cm, $BD=2$ cm și $CD=6$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $AB^2=BD\\cdot BC$.', ans: '$AB^2=16$ și $BD\\cdot BC=2\\cdot8=16$' },
        { pts: 3, text: 'Demonstrează că $\\sphericalangle BAD\\equiv\\sphericalangle ACB$.', ans: '$\\sphericalangle ABD\\equiv\\sphericalangle CBA$ și $\\dfrac{AB}{BD}=\\dfrac{CB}{AB}=2$, deci $\\triangle ABD\\sim\\triangle CBA$ și $\\sphericalangle BAD\\equiv\\sphericalangle ACB$' },
      ],
      fig: fig16,
    },
    {
      text: 'Se consideră trapezul $ABCD$ din figura alăturată, cu baza mare $AB=12$ cm și celelalte trei laturi de $6$ cm.',
      parts: [
        { pts: 2, text: 'Arată că aria trapezului este egală cu $27\\sqrt{3}\\text{ cm}^2$.', ans: 'Înălțimea este $\\sqrt{36-9}=3\\sqrt{3}$ cm, aria $=\\dfrac{(12+6)\\cdot3\\sqrt{3}}{2}=27\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Determină distanța de la punctul $A$ la dreapta $BC$.', ans: '$\\sphericalangle B=60^\\circ$ și $AC^2=144+36-72=108=AB^2-BC^2$, deci $AC\\perp BC$ și $d=AC=6\\sqrt{3}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida triunghiulară regulată $VABC$, cu latura bazei $AB=8\\sqrt{3}$ cm și înălțimea $VO=4\\sqrt{2}$ cm. Notăm cu $M$ mijlocul segmentului $BC$.',
      parts: [
        { pts: 2, text: 'Arată că lungimea apotemei piramidei, $VM$, este egală cu $4\\sqrt{3}$ cm.', ans: '$OM=\\dfrac{8\\sqrt{3}\\cdot\\sqrt{3}}{6}=4$ cm, $VM=\\sqrt{32+16}=4\\sqrt{3}$ cm' },
        { pts: 3, text: 'Dacă $P$ este proiecția punctului $O$ pe planul $(VBC)$, demonstrează că punctul $P$ este centrul de greutate al triunghiului $VBC$.', ans: '$BC\\perp(VAM)$, deci $(VAM)\\perp(VBC)$ și $P\\in VM$; din teorema catetei, $\\dfrac{VP}{PM}=\\dfrac{VO^2}{OM^2}=\\dfrac{32}{16}=2$, deci $P$ este centrul de greutate' },
      ],
      fig: fig18,
    },
  ],
}
