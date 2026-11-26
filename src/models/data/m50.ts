// Testul 19 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 110–111; every answer here is computed and checked with the book's answers, pp. 276–277).
import type { EnModel } from '../types'
import { plane, solid, type P3 } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

// not to scale, as in the book, so that the names fit
const fig7 = plane({ A: [0, 0], A1: [2, 0], A2: [4, 0], A9: [11, 0], B: [13, 0] }, 170, {
  s: 'A-A2 A9-B', d: 'A2-A9', dot: 'A A1 A2 A9 B', l: { A: 'n', A1: 'n', A2: 'n', A9: 'n', B: 'n' },
})
const fig8 = plane({ A: [0, 3], D: [4, 3], B: [-1.09, 0], C: [5, 0], L1: [-2, 3], L2: [6, 3], L3: [-2, 0], L4: [6, 0], X: [0.36, 4] }, 130, {
  s: 'L1-L2 L3-L4 B-X', dot: 'A D B C', l: { L1: '', L2: '', L3: '', L4: '', X: '', A: 'nw', D: 'n', B: 's', C: 's' },
})
const fig9 = plane({ B: [0, 0], C: [15, 0], A: [6, 8], M: [3.6, 4.8], N: [9.6, 4.8] }, 110, { s: 'A-B-C-A M-N', dot: 'M N' })
const fig10 = plane({ A: [0, 0], B: [20, 0], C: [20, 20], D: [0, 20], E: [20, 15] }, 100, { s: 'A-B-C-D-A A-E-D', dot: 'E' })
const fig11 = plane({ O: [0, 0], A: [0, 3], M: [4, 3], T: [-2, 3], X: [5, 3] }, 120, { s: 'T-X O-A', c: [{ at: 'O', r: 3 }], dot: 'O', ra: ['OAM'], l: { T: '', X: '', O: 's' } })
const y12 = 3 * s3
const p12: Record<string, P3> = { A: [0, y12, 0], B: [3, 0, 0], C: [6, y12, 0], V: [3, (2 * y12) / 3, 6] } // drawn taller than it is (√6)
const fig12 = solid(p12, 'A-B-C A-B-V B-C-V C-A-V', 110)

const fig15 = graph({ A: [1, 2], B: [2, 5] }, 110, [-1, 3.5], [-1, 6], { dot: 'A B', l: { A: 'e', B: 'e' } })
const fig16 = plane({ A: [0, 0], B: [2 + 2 * s3, 0], C: [2 + 2 * s3, 2], D: [0, 2], M: [2, 2] }, 140, { s: 'A-B-C-D-A A-M', l: { M: 'n' } })
const hex = (deg: number) => pol(deg, 3)
const fig17 = plane({ O: [0, 0], A: hex(180), B: hex(120), C: hex(60), D: hex(0), E: hex(-60), F: hex(-120) }, 100, {
  c: [{ at: 'O', r: 3 }], dot: 'O A B C D E F', l: { O: 's' },
})
const fig18 = solid(box(5, 4, 12), BOX, 110)

export const M50: EnModel = {
  id: 'en-50',
  title: 'Paralela 45, Testul 19',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 110–111',
  items: [
    { text: 'Cel mai mare număr natural care împărțit la $4$ dă câtul egal cu $19$ este:', choices: ['$76$', '$77$', '$78$', '$79$'], ans: 3 },
    { text: 'Un telefon costă $120$ de lei. Prețul acestuia se mărește cu $10$ lei. Noul preț este:', choices: ['$132$ de lei', '$130$ de lei', '$1200$ de lei', '$12$ lei'], ans: 1 },
    {
      text: 'Notele obținute de elevii unei clase la teza la matematică sunt prezentate în tabelul următor.\n\n| Nota | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ |\n|---|---|---|---|---|---|---|---|---|\n| Numărul de elevi | $2$ | $1$ | $3$ | $6$ | $8$ | $3$ | $2$ | $5$ |\n\nNumărul elevilor care au obținut cel puțin nota $6$, dar cel mult nota $9$ este egal cu:',
      choices: ['$11$', '$17$', '$19$', '$13$'], ans: 2,
    },
    { text: 'Numărul cu $\\dfrac{1}{3}$ mai mare decât diferența numerelor $\\dfrac{3}{4}$ și $\\dfrac{5}{6}$ este egal cu:', choices: ['$\\dfrac{1}{4}$', '$\\dfrac{5}{12}$', '$\\dfrac{1}{3}$', '$\\dfrac{7}{12}$'], ans: 0 },
    { text: 'Media geometrică a numerelor $\\sqrt{24}$ și $3\\sqrt{6}$ este egală cu:', choices: ['$3$', '$4$', '$\\sqrt{6}$', '$6$'], ans: 3 },
    { text: 'Maria afirmă: „Fracția $\\dfrac{105}{119}$ este ireductibilă”. Afirmația Mariei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'Pe segmentul $AB$ considerăm punctele $A_1,\\,A_2,\\,\\ldots,\\,A_9$, astfel încât $AA_1=A_1A_2=\\ldots=A_9B$, ca în figura de mai jos. Valoarea raportului $\\dfrac{A_2A_6}{AB}$ este:',
      choices: ['$\\dfrac{1}{3}$', '$\\dfrac{2}{5}$', '$\\dfrac{4}{9}$', '$\\dfrac{1}{2}$'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $AD$ și $BC$ sunt paralele. Dacă $\\sphericalangle DAB=3x-10^\\circ$ și $\\sphericalangle ABC=x+30^\\circ$, atunci $x$ are valoarea:',
      choices: ['$30^\\circ$', '$40^\\circ$', '$50^\\circ$', '$20^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'Fie $ABC$ un triunghi, iar punctele $M$ și $N$ sunt puncte situate pe laturile $AB$, respectiv $AC$. Dacă $AM=4$ cm, $MB=6$ cm, $BC=15$ cm și $\\dfrac{AN}{NC}=\\dfrac{2}{3}$, lungimea segmentului $MN$ este:',
      choices: ['$5$ cm', '$7$ cm', '$6$ cm', '$10$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat cu latura $AB=20$ cm, iar $E$ este un punct pe latura $BC$. Aria triunghiului $AED$ este egală cu:',
      choices: ['$100\\text{ cm}^2$', '$150\\text{ cm}^2$', '$200\\text{ cm}^2$', '$250\\text{ cm}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată, dreapta $MA$ este tangentă cercului $\\mathcal{C}(O,\\,R)$ în punctul $A$. Dacă $R=3$ cm, iar lungimea segmentului $MO$ este egală cu $5$ cm, lungimea segmentului $MA$ este:',
      choices: ['$2$ cm', '$\\sqrt{34}$ cm', '$3$ cm', '$4$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'În figura alăturată, $VABC$ este o piramidă triunghiulară regulată cu baza $ABC$ și fețele laterale triunghiuri dreptunghice în $V$. Dacă $AB=6$ cm, atunci aria totală a piramidei $VABC$ este egală cu:',
      choices: ['$9(3+\\sqrt{3})\\text{ cm}^2$', '$27\\text{ cm}^2$', '$9(3+\\sqrt{2})\\text{ cm}^2$', '$9\\sqrt{3}\\text{ cm}^2$'], ans: 0, fig: fig12,
    },

    {
      text: 'Ioana a cumpărat mai multe flori și vrea să le pună în vazele pe care le are în casă. Ea a observat că, dacă pune câte cinci flori într-o vază, rămân opt flori pe dinafară, iar dacă ar pune câte șapte flori într-o vază, atunci ar umple toate vazele, cu excepția uneia, care ar avea o singură floare.',
      parts: [
        { pts: 2, text: 'Este posibil ca Ioana să aibă cinci vaze în casă? Justifică răspunsul dat.', ans: 'Nu: cu $5$ vaze ar avea $5\\cdot5+8=33$ de flori, dar $4\\cdot7+1=29\\ne33$' },
        { pts: 3, text: 'Află câte vaze are Ioana.', ans: '$5v+8=7(v-1)+1$, deci $v=7$ vaze (și $43$ de flori)' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{1}{x-1}+\\dfrac{1}{x+1}-\\dfrac{4}{1-x^2}\\right):\\left(\\dfrac{x}{x-1}-\\dfrac{x+2}{x+1}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=x+2$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: 'Prima paranteză este $\\dfrac{2x+4}{x^2-1}$, a doua $\\dfrac{x^2+x-x^2-x+2}{x^2-1}=\\dfrac{2}{x^2-1}$, deci $E(x)=\\dfrac{2x+4}{2}=x+2$' },
        { pts: 3, text: 'Arată că $E^2(678)=E(677)\\cdot E(679)+1$.', ans: '$E(677)\\cdot E(679)=679\\cdot681=(680-1)(680+1)=680^2-1=E^2(678)-1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3x-1$ și punctele $A(1,\\,2)$, $B(2,\\,5)$, în sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Arată că punctele $A$ și $B$ sunt situate pe reprezentarea grafică a funcției $f$, în sistemul $xOy$.', ans: '$f(1)=2$ și $f(2)=5$' },
        { pts: 3, text: "Dacă $A'$, $B'$ sunt proiecțiile punctelor $A$ și $B$ pe axa $Ox$, calculează aria patrulaterului $AA'B'B$.", ans: "$AA'B'B$ e trapez dreptunghic: $\\mathcal{A}=\\dfrac{(AA'+BB')\\cdot A'B'}{2}=\\dfrac{(2+5)\\cdot1}{2}=3{,}5$ (unități de arie)" },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un dreptunghi cu $AB=(2+2\\sqrt{3})$ cm și $BC=2$ cm. Bisectoarea unghiului $BAD$ intersectează latura $CD$ în punctul $M$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $ADM$ este isoscel.', ans: '$\\sphericalangle DAM=45^\\circ$ și $\\sphericalangle ADM=90^\\circ$, deci $\\sphericalangle DMA=45^\\circ$ și $DM=DA$' },
        { pts: 3, text: 'Determină lungimea segmentului $MB$.', ans: '$DM=DA=2$ cm, deci $MC=2\\sqrt{3}$ cm; în $\\triangle MCB$: $MB=\\sqrt{12+4}=4$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$, $E$ și $F$ sunt situate pe cercul $\\mathcal{C}(O,\\,R)$ și împart cercul în șase arce egale.',
      parts: [
        { pts: 2, text: 'Arată că punctele $A$, $O$ și $D$ sunt coliniare.', ans: 'Fiecare arc are $60^\\circ$: $\\sphericalangle AOD=\\sphericalangle AOB+\\sphericalangle BOC+\\sphericalangle COD=180^\\circ$' },
        { pts: 3, text: 'Dacă $AD=6$ cm, calculează perimetrul triunghiului $ACE$.', ans: '$R=3$ cm, $\\triangle ACE$ e echilateral cu $AC=R\\sqrt{3}=3\\sqrt{3}$ cm, deci perimetrul este $9\\sqrt{3}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "Se consideră paralelipipedul dreptunghic $ABCDA'B'C'D'$ din figura alăturată, cu dimensiunile $AB=5$ cm, $BC=4$ cm și $CC'=12$ cm.",
      parts: [
        { pts: 2, text: "Arată că volumul paralelipipedului $ABCDA'B'C'D'$ este egal cu $240\\text{ cm}^3$.", ans: '$V=5\\cdot4\\cdot12=240\\text{ cm}^3$' },
        { pts: 3, text: "Calculează sinusul unghiului format de dreptele $AB'$ și $CC'$.", ans: "$CC'\\parallel AA'$, deci unghiul este $\\sphericalangle A'AB'$; $AB'=\\sqrt{25+144}=13$ cm și $\\sin(\\sphericalangle A'AB')=\\dfrac{A'B'}{AB'}=\\dfrac{5}{13}$" },
      ],
      fig: fig18,
    },
  ],
}
