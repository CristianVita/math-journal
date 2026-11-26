// Testul 67 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 213–215; every answer here is computed and checked with the book's answers, p. 293).
import type { P3 } from '../figure'
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s2 = Math.SQRT2, s3 = Math.sqrt(3)

// women (F) and men (B): 2 parts to 1
const fig2 = plane({
  X0: [0, 0], X1: [7, 0], Y0: [0, 0], Y1: [0, 5], f1: [2.7, 0], f2: [2.7, 4], f3: [3.3, 4], f4: [3.3, 0], b1: [4.7, 0], b2: [4.7, 2], b3: [5.3, 2], b4: [5.3, 0], k1: [0, 2], k2: [0, 4],
}, 110, {
  s: 'X0-X1 Y0-Y1 f1-f2-f3-f4 b1-b2-b3-b4', d: 'k2-f2 k1-b2',
  l: Object.fromEntries(['X0', 'X1', 'Y0', 'Y1', 'f1', 'f2', 'f3', 'f4', 'b1', 'b2', 'b3', 'b4', 'k1', 'k2'].map((k) => [k, ''])),
  t: [
    { at: [3, -0.8], s: 'F', anchor: 'middle', size: 10 }, { at: [5, -0.8], s: 'B', anchor: 'middle', size: 10 },
    { at: [-0.3, 1.8], s: '1', anchor: 'end', size: 9 }, { at: [-0.3, 3.8], s: '2', anchor: 'end', size: 9 },
    { at: [-0.3, -0.8], s: 'O', anchor: 'end', italic: true, size: 10 }, { at: [7, -0.8], s: 'x', anchor: 'end', italic: true, size: 10 }, { at: [0.3, 4.7], s: 'y', anchor: 'start', italic: true, size: 10 },
  ],
})

const fig7 = plane({ M: [0, 0], A: [5, 0], N: [6, 0], B: [8, 0], P: [10, 0] }, 170, { s: 'M-P', dot: 'M A N B P', l: { M: 'n', A: 'n', N: 'n', B: 'n', P: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(72, 6), M: pol(36, 6), N: pol(18, 6), B: pol(0, 6) }, 130, { s: 'O-A O-M O-N O-B', dot: 'A M N B', l: { O: 'w' } })
const fig9 = plane({ A: [0, 4 * s3], B: [4, 0], C: [0, -4 * s3], D: [-4, 0] }, 90, { s: 'A-B-C-D-A A-C B-D' })
const fig10 = plane({ A: [0, 2], B: [2, 2], C: [2, 0], D: [0, 0], N: [1, 2], M: [2, 1] }, 110, { s: 'A-B-C-D-A D-N-M-D' })
const f11 = plane({ O: [0, 0], A: [-6, 0], B: [6, 0], D: pol(60, 6), C: pol(240, 6) }, 110, { s: 'A-B C-D', c: [{ at: 'O', r: 6 }], l: { O: 'se' } })
const r11 = f11.p.B[0] - f11.p.O[0]
const fig11 = { ...f11, path: [{ d: `M${f11.p.O[0]} ${f11.p.O[1]} L${f11.p.A[0]} ${f11.p.A[1]} A${r11} ${r11} 0 0 0 ${f11.p.C[0]} ${f11.p.C[1]} Z`, hatch: true }] }
const fig12 = solid(box(10, 2, 6), BOX, 120, { l: Object.fromEntries(['A', 'B', 'C', 'D', "A'", "B'", "C'", "D'"].map((k) => [k, ''])) })

const fig15 = graph({}, 120, [-4, 3], [-1, 6])
const fig16 = plane({ B: [0, 0], C: [5, 0], D: [10, 0], A: [2.5, 2.5 * s3] }, 140, { s: 'A-B-D-A A-C' })
const fig17 = plane({ A: [0, 12], B: [12, 12], C: [12, 0], D: [0, 0], O: [6, 6], M: [12, 6], N: [9, 3] }, 110, { s: 'A-B-C-D-A A-C D-O M-N', ra: ['DOC', 'MNC'] })
const h18 = 3 * s2
const p18: Record<string, P3> = {
  A: [0, 0, 0], B: [12, 0, 0], C: [12, 12, 0], D: [0, 12, 0], M: [3, 3, h18], N: [9, 3, h18], P: [9, 9, h18], Q: [3, 9, h18], O: [6, 6, 0], "O'": [6, 6, h18],
}
const fig18 = solid(p18, 'A-B-C-D M-N-P-Q A-B-N-M B-C-P-N C-D-Q-P D-A-M-Q', 140, { seg: "O-O'", dot: "O O'" })

export const M98: EnModel = {
  id: 'en-98',
  title: 'Paralela 45, Testul 67',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 213–215',
  items: [
    { text: 'Câtul împărțirii numărului $1234$ la $5$ este:', choices: ['$24$', '$244$', '$246$', '$248$'], ans: 2 },
    {
      text: 'În figura alăturată este reprezentată proporția femei/bărbați dintr-un sat cu $480$ de locuitori. Numărul bărbaților din sat este:',
      choices: ['$160$', '$240$', '$144$', '$200$'], ans: 0, fig: fig2,
    },
    { text: 'Se dau mulțimile $A=\\{-2,\\,0,\\,1,\\,3\\}$ și $B=\\{-1,\\,0,\\,2,\\,3\\}$. Cardinalul mulțimii $A\\cup B$ este:', choices: ['$5$', '$6$', '$7$', '$8$'], ans: 1 },
    { text: 'Numerele reale pozitive $x$ și $y$ sunt invers proporționale cu numerele $2$ și $3$, iar produsul lor este $24$. Suma $x+y$ este:', choices: ['$16$', '$10$', '$8$', '$4$'], ans: 1 },
    { text: 'Rezultatul calculului $|5-\\sqrt{5}|+|2-\\sqrt{5}|-2$ este:', choices: ['$4-2\\sqrt{5}$', '$5-2\\sqrt{5}$', '$5$', '$1$'], ans: 3 },
    { text: 'Afirmația „Numărul real $a=12-5\\sqrt{6}$ este pozitiv” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $M$, $N$ și $P$ sunt coliniare, în această ordine, iar $MN>NP$. Dacă $A$ este mijlocul segmentului $MP$, $B$ este mijlocul segmentului $NP$, $AN=1$ cm și $MB=8$ cm, atunci lungimea segmentului $BP$ este egală cu:',
      choices: ['$1$ cm', '$3$ cm', '$5$ cm', '$2$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată, semidreapta $OM$ este bisectoarea unghiului $AOB$, iar semidreapta $ON$ este bisectoarea unghiului $BOM$. Dacă măsura unghiului $AON$ este egală cu $54^\\circ$, atunci unghiul $AOB$ are măsura egală cu:',
      choices: ['$36^\\circ$', '$48^\\circ$', '$60^\\circ$', '$72^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat rombul $ABCD$, având $AC=8\\sqrt{3}$ cm și măsura unghiului $ABC$ egală cu $120^\\circ$. Perimetrul triunghiului $ADB$ este egal cu:',
      choices: ['$24$ cm', '$16$ cm', '$(16+8\\sqrt{3})$ cm', '$(4\\sqrt{3}+8)$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat, iar $M$ și $N$ sunt mijloacele segmentelor $BC$, respectiv $AB$. Raportul dintre aria triunghiului $DMN$ și aria pătratului $ABCD$ este egal cu:',
      choices: ['$\\dfrac{8}{3}$', '$\\dfrac{3}{4}$', '$\\dfrac{3}{8}$', '$\\dfrac{2}{5}$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ și $CD$ sunt două diametre ale cercului de centru $O$. Triunghiul $OBD$ este echilateral, cu latura de $6$ cm. Aria sectorului de cerc $OAC$ este:',
      choices: ['$18\\pi\\text{ cm}^2$', '$12\\pi\\text{ cm}^2$', '$9\\pi\\text{ cm}^2$', '$6\\pi\\text{ cm}^2$'], ans: 3, fig: fig11,
    },
    {
      text: 'Folosind cărămizi paralelipipedice cu dimensiunile $25\\text{ cm}\\times12{,}5\\text{ cm}\\times6\\text{ cm}$, se construiește zidul paralelipipedic din figura alăturată, având dimensiunile $10\\text{ m}\\times2\\text{ m}\\times6\\text{ m}$. Numărul de cărămizi care intră în componența zidului este:',
      choices: ['$64$', '$640$', '$6400$', '$64000$'], ans: 3, fig: fig12,
    },

    {
      text: 'Prețul unui telefon este $2000$ de lei. În cadrul unei promoții, prețul se micșorează cu $20\\%$. După un timp, telefonul se ieftinește din nou, tot cu $20\\%$.',
      parts: [
        { pts: 2, text: 'Arată că, în urma celor două ieftiniri, telefonul ajunge să coste $1280$ de lei.', ans: '$2000\\cdot0{,}8=1600$ de lei, apoi $1600\\cdot0{,}8=1280$ de lei' },
        { pts: 3, text: 'Cu ce procent ar trebui să se ieftinească telefonul, o singură dată, pentru ca prețul său să coboare de la $2000$ de lei la $1280$ de lei?', ans: '$\\dfrac{2000-1280}{2000}=\\dfrac{720}{2000}=36\\%$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{(2x+3)^2-(x+1)^2}{x^2-4}\\cdot\\dfrac{x^2-x-2}{x+1}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=3x+4$, pentru $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,2\\}$.', ans: '$E(x)=\\dfrac{(x+2)(3x+4)}{(x-2)(x+2)}\\cdot\\dfrac{(x-2)(x+1)}{x+1}=3x+4$' },
        { pts: 3, text: 'Calculează produsul $E\\left(-\\dfrac{10}{9}\\right)\\cdot E\\left(-\\dfrac{9}{8}\\right)\\cdot\\ldots\\cdot E\\left(-\\dfrac{3}{2}\\right)$.', ans: 'Printre factori este $E\\left(-\\dfrac{4}{3}\\right)=0$, deci produsul este $0$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+3$.',
      parts: [
        { pts: 2, text: 'Reprezintă grafic funcția $f$ în sistemul de axe ortogonale $xOy$ alăturat.', ans: 'Dreapta prin $(0,\\,3)$ și $(-1,\\,1)$' },
        { pts: 3, text: 'Punctele $A(-1,\\,a)$ și $B(b,\\,5)$ sunt situate pe reprezentarea grafică a funcției $f$. Află lungimea segmentului $AB$.', ans: '$a=f(-1)=1$, $2b+3=5$, deci $b=1$: $A(-1,\\,1)$, $B(1,\\,5)$ și $AB=\\sqrt{2^2+4^2}=2\\sqrt{5}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABD$, iar punctul $C$ este situat pe segmentul $BD$ astfel încât $AB=AC=BC=CD=5$ cm.',
      parts: [
        { pts: 2, text: 'Arată că măsura unghiului $BAD$ este $90^\\circ$.', ans: '$\\triangle ABC$ este echilateral, iar $\\sphericalangle CAD\\equiv\\sphericalangle CDA=\\dfrac{1}{2}\\sphericalangle ACB=30^\\circ$, deci $\\sphericalangle BAD=60^\\circ+30^\\circ=90^\\circ$' },
        { pts: 3, text: 'Calculează lungimea segmentului $AD$.', ans: '$AD=\\sqrt{BD^2-AB^2}=\\sqrt{100-25}=5\\sqrt{3}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'Pătratul $ABCD$ din figura alăturată are perimetrul $48$ cm. Punctul $M$ este mijlocul laturii $BC$, iar $O$ și $N$ sunt proiecțiile pe diagonala $AC$ ale punctelor $D$, respectiv $M$.',
      parts: [
        { pts: 2, text: 'Arată că patrulaterul $DOMN$ este un trapez.', ans: '$DO$ și $MN$ sunt perpendiculare pe $AC$, deci $DO\\parallel MN$; cum $DO=6\\sqrt{2}$ cm $\\neq3\\sqrt{2}$ cm $=MN$, $DOMN$ este trapez' },
        { pts: 3, text: 'Demonstrează că aria trapezului $DOMN$ este $27\\text{ cm}^2$.', ans: '$ON=MN=3\\sqrt{2}$ cm ($\\triangle MNC$ dreptunghic isoscel, $NC=3\\sqrt{2}$, $OC=6\\sqrt{2}$), deci $\\mathcal{A}_{DOMN}=\\dfrac{(6\\sqrt{2}+3\\sqrt{2})\\cdot3\\sqrt{2}}{2}=27\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat un trunchi de piramidă patrulateră regulată $ABCDMNPQ$ cu muchia bazei mari $AB=12$ cm și înălțimea $OO'=3\\sqrt{2}$ cm. Unghiul format de muchia laterală cu planul bazei mari are măsura $45^\\circ$.",
      parts: [
        { pts: 2, text: 'Arată că muchia bazei mici are lungimea $6$ cm.', ans: "Fie $T$ proiecția lui $M$ pe $(ABC)$; $T\\in AO$ și $\\sphericalangle MAT=45^\\circ$, deci $AT=MT=3\\sqrt{2}$ cm. $TO=MO'=6\\sqrt{2}-3\\sqrt{2}=3\\sqrt{2}$ cm, deci $MP=6\\sqrt{2}$ cm și $MN=6$ cm" },
        { pts: 3, text: 'Demonstrează că unghiul format de dreptele $AM$ și $BP$ are sinusul egal cu $\\dfrac{\\sqrt{6}}{3}$.', ans: "$MP\\parallel AO$ și $MP=AO=6\\sqrt{2}$ cm, deci $AMPO$ este paralelogram și $AM\\parallel OP$; $\\sphericalangle(AM,\\,BP)=\\sphericalangle OPB$. În $\\triangle OPB$ dreptunghic în $O$: $OB=6\\sqrt{2}$, $OP=AM=6$, $BP=6\\sqrt{3}$, deci $\\sin\\sphericalangle OPB=\\dfrac{OB}{BP}=\\dfrac{\\sqrt{6}}{3}$" },
      ],
      fig: fig18,
    },
  ],
}
