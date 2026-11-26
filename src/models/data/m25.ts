// Testul 2 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 64–68; every answer here is computed).
import type { EnModel } from '../types'
import { mid, plane, solid, mid3, type P3, type Pt } from '../figure'
import { graph, pol, PRISM3, prism3 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ O: [0, 0], A: [7, 0], M: [10, 0], B: [13, 0] }, 160, { s: 'O-B', dot: 'O A M B', l: { O: 'n', A: 'n', M: 'n', B: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(0, 5), B: pol(10, 5), X: pol(37, 5), C: pol(74, 5) }, 120, { s: 'O-A O-B O-X O-C', l: { O: 'w' } })
const fig9 = plane({ A: [0, 6], B: [0, 0], C: [8, 0], M: [4, 0] }, 130, { s: 'A-B-C-A A-M', ra: ['ABC'] })
const B10: Pt = [7, 0], C10: Pt = [4, 4]
const fig10 = plane({ A: [0, 0], B: B10, C: C10, D: [0, 4], M: mid(B10, C10) }, 130, { s: 'A-B-C-D-A A-M A-C', hatch: ['A-M-C'], ra: ['DAB'] })
const fig11 = plane({ O: [0, 0], A: pol(60, 6), B: [6, 0], C: [-6, 0] }, 120, { s: 'C-B A-B A-C', c: [{ at: 'O', r: 6 }], dot: 'O', l: { O: 's' } })
const fig12 = solid(prism3(6, 8), PRISM3, 120, { seg: "A'-B A'-C" })

const fig15 = graph({ M: [-1, 6], N: [2, 12], "M'": [-1, 0], "N'": [2, 0], L1: [-4.5, -1], L2: [2.6, 13.2] }, 120, [-5, 3.5], [-1.5, 14], { s: 'L1-L2', d: "M-M' N-N'", dot: 'M N', l: { L1: '', L2: '', M: 'w', N: 'w', "M'": 'sw', "N'": 's', O: 'se' } })
const fig16 = plane({ A: [0, 0], B: [6, 0], C: [4, 2 * s3], D: [0, 2 * s3] }, 130, { s: 'A-B-C-D-A', ra: ['DAB'] })
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [0, 8], E: [0, 3], D: [2.4, 4.8] }, 110, { s: 'A-B-C-A E-D', ra: ['BAC'] })
const t18: Record<string, P3> = { A: [0, 6 * s3, 0], B: [6, 0, 0], C: [12, 6 * s3, 0], V: [6, 4 * s3, 5], O: [6, 4 * s3, 0] }
const fig18 = solid({ ...t18, M: mid3(t18.B, t18.C) }, 'A-B-C A-B-V B-C-V C-A-V', 150, { seg: 'V-O V-M O-M', l: { O: 's', M: 'se' } })

export const M25: EnModel = {
  id: 'en-25',
  title: 'Paralela 45, Testul 2',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 64–68',
  items: [
    { text: 'Suma numerelor prime din șirul $0,\\ 1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6,\\ 7,\\ 8,\\ 9,\\ 10$ este egală cu:', choices: ['$10$', '$17$', '$45$', '$55$'], ans: 1 },
    { text: 'Dacă $\\dfrac{5}{2x-1}=\\dfrac{3}{111}$, atunci numărul real $x$ este egal cu:', choices: ['$93$', '$100$', '$278$', '$301$'], ans: 0 },
    { text: 'Produsul dintre cel mai mic element negativ și cel mai mare element negativ ale mulțimii $A=\\{-6,\\,-3,\\,-2,\\,0,\\,1,\\,2,\\,3,\\,4\\}$ este egal cu:', choices: ['$12$', '$0$', '$-12$', '$-24$'], ans: 0 },
    { text: 'Scrierea fracției zecimale $0{,}1(6)$ sub formă de fracție ordinară este:', choices: ['$\\dfrac{16}{99}$', '$\\dfrac{16}{90}$', '$\\dfrac{8}{5}$', '$\\dfrac{1}{6}$'], ans: 3 },
    {
      text: 'Patru elevi, Andrei, Bianca, Codrin și Daniela, efectuează calculul $(2+\\sqrt{3})^2+(2-\\sqrt{3})^2$ și obțin rezultatele înregistrate în tabelul următor:\n\n| Andrei | Bianca | Codrin | Daniela |\n|---|---|---|---|\n| $4$ | $10$ | $14$ | $8\\sqrt{3}$ |\n\nDintre cei patru elevi, cel care a obținut rezultatul corect este:',
      choices: ['Andrei', 'Bianca', 'Codrin', 'Daniela'], ans: 2,
    },
    { text: 'Un biciclist s-a deplasat cu viteza de $15$ km/h pe o distanță de $45$ km, iar un pieton s-a deplasat cu viteza de $4$ km/h pe o distanță de $10$ km. Dintre cei doi, cel care a avut un timp de deplasare mai scurt a fost:', choices: ['biciclistul', 'pietonul'], ans: 1 },

    {
      text: 'În figura alăturată sunt reprezentate, în această ordine, punctele coliniare $O$, $A$, $B$. Se știe că $OA=7$ cm, $OB=13$ cm și că punctul $M$ este mijlocul segmentului $AB$. Lungimea segmentului $OM$ este egală cu:',
      choices: ['$3$ cm', '$7$ cm', '$10$ cm', '$13$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiurile adiacente $AOB$ și $BOC$, cu $\\sphericalangle AOB=10^\\circ$ și $\\sphericalangle BOC=64^\\circ$. Dacă semidreapta $OX$ este bisectoarea unghiului $AOC$, atunci măsura unghiului $BOX$ este egală cu:',
      choices: ['$10^\\circ$', '$20^\\circ$', '$27^\\circ$', '$37^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$ cu $AB=6$ cm și ipotenuza $AC=10$ cm. Lungimea medianei $AM$ este egală cu:',
      choices: ['$2\\sqrt{5}$ cm', '$6$ cm', '$2\\sqrt{13}$ cm', '$8$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul $ABCD$, cu bazele $AB$ și $CD$, în care măsura unghiului $BAD$ este egală cu $90^\\circ$, $AD=4$ cm și $AB=7$ cm. Dacă punctul $M$ este mijlocul laturii $BC$, atunci aria triunghiului $AMC$ este egală cu:',
      choices: ['$6\\text{ cm}^2$', '$7\\text{ cm}^2$', '$14\\text{ cm}^2$', '$28\\text{ cm}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat cercul de centru $O$ și diametru $BC=12$ cm. Punctul $A$ aparține cercului, astfel încât $AB=6$ cm. Măsura arcului mic $AC$ este egală cu:',
      choices: ['$60^\\circ$', '$90^\\circ$', '$120^\\circ$', '$180^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentată prisma triunghiulară regulată $ABCA'B'C'$ cu $AB=6$ cm și $AA'=8$ cm. Perimetrul triunghiului $A'BC$ este egal cu:",
      choices: ['$18$ cm', '$20$ cm', '$22$ cm', '$26$ cm'], ans: 3, fig: fig12,
    },

    {
      text: 'Dana are un coș cu mere roșii, galbene și verzi, în total fiind $52$ de mere. Numerele merelor roșii, galbene și verzi sunt direct proporționale cu $2$, $5$, respectiv $6$.',
      parts: [
        { pts: 2, text: 'Câte mere roșii are Dana în coș?', ans: '$52:13=4$, deci $8$ mere roșii ($20$ galbene, $24$ verzi)' },
        { pts: 3, text: 'Determină câte mere galbene ar trebui să mai pună Dana în coș astfel încât numărul merelor galbene să reprezinte jumătate din numărul total al merelor.', ans: '$20+y=\\dfrac{52+y}{2}$, deci $y=12$ mere' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(x-\\dfrac{x-1}{x+3}\\right):\\left(x-2+\\dfrac{6}{x+3}\\right)-\\dfrac{2x+2}{x^2+x}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,-1,\\,0\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=1-\\dfrac{1}{x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,-1,\\,0\\}$.', ans: '$\\dfrac{(x+1)^2}{x+3}\\cdot\\dfrac{x+3}{x(x+1)}-\\dfrac{2}{x}=\\dfrac{x+1-2}{x}=1-\\dfrac{1}{x}$' },
        { pts: 3, text: 'Arată că numărul $n=E(\\sqrt{2})+E(2+\\sqrt{2})$ este natural.', ans: '$n=2-\\dfrac{\\sqrt{2}}{2}-\\dfrac{2-\\sqrt{2}}{2}=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+8$ și sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Determină distanța de la punctul $O(0,\\,0)$ la dreapta care este reprezentarea grafică a funcției $f$.', ans: 'Graficul taie axele în $A(-4,\\,0)$ și $B(0,\\,8)$; $d=\\dfrac{OA\\cdot OB}{AB}=\\dfrac{32}{4\\sqrt{5}}=\\dfrac{8\\sqrt{5}}{5}$' },
        { pts: 3, text: "Dacă punctele $M(-1,\\,m)$ și $N(n,\\,12)$ aparțin reprezentării grafice a funcției $f$, iar punctele $M'$, respectiv $N'$ sunt proiecțiile lor pe axa $Ox$, calculează aria patrulaterului $MM'N'N$.", ans: "$m=6$, $n=2$; trapezul are aria $\\dfrac{(6+12)\\cdot3}{2}=27$" },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul $ABCD$, cu baza mare $AB=6$ cm, baza mică $CD=4$ cm, $\\sphericalangle A=90^\\circ$ și $\\sphericalangle B=60^\\circ$.',
      parts: [
        { pts: 2, text: 'Calculează aria trapezului $ABCD$.', ans: 'Înălțimea $=2\\,\\text{tg}\\,60^\\circ=2\\sqrt{3}$ cm, aria $=10\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Determină măsura unghiului $BDC$.', ans: '$\\sphericalangle BDC=\\sphericalangle DBA$ și $\\text{tg}\\sphericalangle DBA=\\dfrac{2\\sqrt{3}}{6}=\\dfrac{\\sqrt{3}}{3}$, deci $30^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$, cu catetele $AB=6$ cm și $AC=8$ cm. Punctele $D$ și $E$ sunt situate pe laturile $BC$, respectiv $AC$, astfel încât $CD=4$ cm și $CE=5$ cm.',
      parts: [
        { pts: 2, text: 'Calculează lungimea ipotenuzei $BC$.', ans: '$BC=10$ cm' },
        { pts: 3, text: 'Demonstrează că dreptele $AD$ și $BE$ sunt perpendiculare.', ans: '$\\dfrac{CE}{CB}=\\dfrac{CD}{CA}=\\dfrac12$, deci $\\triangle ECD\\sim\\triangle BCA$ și $DE=\\dfrac{AB}{2}=3$ cm; cum $EA=ED=3$ cm și $BA=BD=6$ cm, $BE$ este mediatoarea segmentului $AD$, deci $BE\\perp AD$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida triunghiulară regulată $VABC$, cu latura bazei $AB=12$ cm și înălțimea $VO=2$ cm.',
      parts: [
        { pts: 2, text: 'Calculează aria laterală a piramidei $VABC$.', ans: 'Apotema bazei $OM=2\\sqrt{3}$, apotema piramidei $VM=4$ cm, $\\mathcal{A}_l=\\dfrac{3\\cdot12\\cdot4}{2}=72\\text{ cm}^2$' },
        { pts: 3, text: 'Determină măsura unghiului format de planele $(ABC)$ și $(VBC)$.', ans: '$\\text{tg}\\sphericalangle VMO=\\dfrac{2}{2\\sqrt{3}}=\\dfrac{\\sqrt{3}}{3}$, deci $30^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
