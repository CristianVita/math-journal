// Testul 16 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 104–105; every answer here is computed and checked with the book's answers, p. 275).
import type { EnModel } from '../types'
import { along3, mid3, plane, solid, type P3 } from '../figure'
import { graph, pol, tetra, TETRA } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig8 = plane({ O: [0, 0], B: [10, 0], N: pol(30, 10), M: pol(60, 10), A: [0, 10] }, 110, { s: 'O-B O-N O-M O-A', ra: ['BOA'], l: { O: 'sw' } })
const fig9 = plane({ B: [0, 0], C: [12, 0], A: [3, 3 * s3] }, 120, { s: 'A-B-C-A', ra: ['BAC'] })
const fig10 = plane({ D: [-8, 0], B: [8, 0], A: [0, 6], C: [0, -6], O: [0, 0] }, 130, { s: 'A-B-C-D-A A-C B-D', l: { O: 'ne' } })
const fig11 = plane({ O: [0, 0], A: [0, 10], B: [10, 0] }, 90, { s: 'O-A O-B', c: [{ at: 'O', r: 10 }], dot: 'O', ra: ['AOB'], l: { O: 'sw' } })
const fig12 = solid(tetra(100, ['B', 'C', 'D', 'A']), TETRA('B', 'C', 'D', 'A'), 120)

const fig15 = graph({ L1: [-4.5, 3.5], L2: [1.3, -2.3], M: [1, 0] }, 120, [-5, 3], [-2.5, 4], { s: 'L1-L2', dot: 'M', l: { L1: '', L2: '', M: 'n', O: 'se' } })
const fig16 = plane({ B: [0, 0], D: [4, 0], C: [12, 0], A: [4, 4 * s2] }, 140, { s: 'A-B-C-A A-D', ra: ['BAC', 'ADC'] })
const fig17 = plane({ A: [0, 0], M: [6, 0], B: [12, 0], C: [6, 6 * s3], D: [0, 6 * s3] }, 130, { s: 'A-B-C-D-A D-M', ra: ['DAB', 'CDA'] })
const y18 = 6 * s3
const b18: Record<string, P3> = { A: [0, y18, 0], B: [6, 0, 0], C: [12, y18, 0], O: [6, (2 * y18) / 3, 0], V: [6, (2 * y18) / 3, 14] } // drawn tall (the real height is 1)
const fig18 = solid({ ...b18, M: mid3(b18.B, b18.C), N: mid3(b18.C, b18.V), P: along3(b18.A, b18.C, 0.75) }, 'A-B-C A-B-V B-C-V C-A-V', 130, {
  seg: 'V-O M-N N-P P-M', dot: 'O M N P', l: { O: 's', M: 'se' },
})

export const M39: EnModel = {
  id: 'en-39',
  title: 'Paralela 45, Testul 16',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 104–105',
  items: [
    { text: 'Jumătatea numărului $4^6$ este numărul:', choices: ['$2^6$', '$4^3$', '$2^3$', '$2048$'], ans: 3 },
    { text: 'Dacă $20\\%$ din $n$ este $40$, atunci $30\\%$ din $n$ este:', choices: ['$50$', '$30$', '$60$', '$90$'], ans: 2 },
    { text: 'Suma numerelor întregi negative din intervalul $(-3,\\,2]$ este egală cu:', choices: ['$-6$', '$-3$', '$0$', '$3$'], ans: 1 },
    {
      text: 'Dintre următoarele seturi de numere, cel scris în ordine descrescătoare este:',
      choices: ['$1,\\ \\dfrac{3}{2},\\ \\dfrac{5}{3},\\ \\dfrac{3}{4}$', '$\\dfrac{1}{2},\\ \\dfrac{7}{12},\\ \\dfrac{2}{3},\\ \\dfrac{3}{4}$', '$\\dfrac{2}{5},\\ \\dfrac{3}{4},\\ \\dfrac{1}{2},\\ 1$', '$\\dfrac{3}{4},\\ \\dfrac{2}{3},\\ \\dfrac{7}{12},\\ \\dfrac{1}{2}$'], ans: 3,
    },
    {
      text: 'Patru elevi, Eliza, Emilia, Eduard și Eugen, au avut de aflat media geometrică a numerelor $a=\\dfrac{4}{3+\\sqrt{5}}$ și $b=\\dfrac{(1+\\sqrt{5})^2}{2}$. Rezultatele obținute sunt trecute în tabelul următor.\n\n| Eliza | Emilia | Eduard | Eugen |\n|---|---|---|---|\n| $3$ | $1$ | $2$ | $2\\sqrt{5}$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Eliza', 'Emilia', 'Eduard', 'Eugen'], ans: 2,
    },
    { text: 'Se consideră intervalul $I=\\left(1,\\,\\dfrac{3}{2}\\right)$. Propoziția „Numărul $\\sqrt{2}$ aparține intervalului $I$.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    { text: 'Pe o semidreaptă cu originea în punctul $A$ se consideră punctele $B$, $C$, $D$ și $E$, astfel încât $AC=2AB=3AD=4AE$. Dintre cele patru puncte, cel mai apropiat de originea semidreptei este punctul:', choices: ['$E$', '$C$', '$D$', '$B$'], ans: 0 },
    {
      text: 'În figura alăturată, semidreptele $OM$ și $ON$ împart unghiul drept $AOB$ în trei unghiuri congruente. Măsura unghiului $MOB$ este egală cu:',
      choices: ['$30^\\circ$', '$60^\\circ$', '$90^\\circ$', '$45^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'Triunghiul dreptunghic $ABC$ are ipotenuza $BC=12$ cm și $\\sphericalangle C=30^\\circ$. Lungimea proiecției ortogonale a catetei $AB$ pe ipotenuză este egală cu:',
      choices: ['$6$ cm', '$3$ cm', '$9$ cm', '$12$ cm'], ans: 1, fig: fig9,
    },
    {
      text: 'Rombul $ABCD$ are perimetrul egal cu $40$ cm; $AC\\cap BD=\\{O\\}$, iar perimetrul triunghiului $AOB$ este egal cu $24$ cm. Suma lungimilor diagonalelor rombului este egală cu:',
      choices: ['$14$ cm', '$96$ cm', '$28$ cm', '$24$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'Dacă $OA$ și $OB$ sunt două raze perpendiculare ale aceluiași cerc și lungimea arcului mic $AB$ este egală cu $5\\pi$ cm, atunci lungimea razei cercului este egală cu:',
      choices: ['$10$ cm', '$5$ cm', '$20$ cm', '$5\\sqrt{2}$ cm'], ans: 0, fig: fig11,
    },
    {
      text: 'Aria laterală a unui tetraedru regulat $ABCD$ este egală cu $27\\sqrt{3}\\text{ cm}^2$. Suma lungimilor muchiilor care pornesc din vârful $A$ este egală cu:',
      choices: ['$9\\sqrt{3}$ cm', '$18$ cm', '$12$ cm', '$18\\sqrt{3}$ cm'], ans: 1, fig: fig12,
    },

    {
      text: 'Un elev se pregătește pentru Evaluarea Națională la matematică rezolvând o fișă de probleme. În prima zi a rezolvat $\\dfrac{2}{5}$ din numărul problemelor și încă $5$ probleme, a doua zi $\\dfrac{3}{5}$ din rest, iar în ultima zi cele $22$ de probleme rămase.',
      parts: [
        { pts: 2, text: 'Este posibil ca a doua zi elevul să fi rezolvat $30$ de probleme? Justifică răspunsul.', ans: 'Nu: $22$ reprezintă $\\dfrac{2}{5}$ din rest, deci restul e $55$ și a doua zi a rezolvat $33$ de probleme' },
        { pts: 3, text: 'Câte probleme erau pe fișă?', ans: '$\\dfrac{3n}{5}-5=55$, deci $n=100$ de probleme' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{3x}{2x+4}-\\dfrac{2}{3x-6}+\\dfrac{7}{24-6x^2}\\right)\\cdot\\dfrac{6x+12}{9x+5}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-2,\\,-\\dfrac{5}{9},\\,2\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $9x^2-22x-15=(x-3)(9x+5)$, pentru orice $x$ număr real.', ans: '$(x-3)(9x+5)=9x^2+5x-27x-15=9x^2-22x-15$' },
        { pts: 3, text: 'Arată că $E(x)-\\dfrac{2-x}{x^2-4x+4}=1$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-2,\\,-\\dfrac{5}{9},\\,2\\right\\}$.', ans: 'Paranteza este $\\dfrac{9x^2-22x-15}{6(x-2)(x+2)}$, deci $E(x)=\\dfrac{x-3}{x-2}$, iar $\\dfrac{x-3}{x-2}+\\dfrac{x-2}{(x-2)^2}=\\dfrac{x-2}{x-2}=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-x-1$.',
      parts: [
        { pts: 2, text: 'Arată că $f(-2)\\cdot f(0)=-1$.', ans: '$f(-2)=1$, $f(0)=-1$, deci produsul este $-1$' },
        { pts: 3, text: 'Determină distanța de la punctul $M(1,\\,0)$ la reprezentarea grafică a funcției $f$, în sistemul de axe ortogonale $xOy$.', ans: 'Graficul taie axele în $A(-1,\\,0)$ și $B(0,\\,-1)$; $\\sphericalangle MBA=90^\\circ$, deci distanța este $MB=\\sqrt{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic cu $\\sphericalangle A=90^\\circ$, având înălțimea $AD=4\\sqrt{2}$ cm, $D\\in BC$ și $\\mathcal{A}_{ADC}=2\\cdot\\mathcal{A}_{ABD}$.',
      parts: [
        { pts: 2, text: 'Arată că $BC=12$ cm.', ans: '$DC=2BD$ și $AD^2=BD\\cdot DC=2BD^2=32$, deci $BD=4$ cm, $DC=8$ cm, $BC=12$ cm' },
        { pts: 3, text: 'Demonstrează că $\\sin(\\sphericalangle BCA)=\\dfrac{\\sqrt{3}}{3}$.', ans: '$AB^2=BD\\cdot BC=48$, $AB=4\\sqrt{3}$ cm, iar $\\sin(\\sphericalangle BCA)=\\dfrac{AB}{BC}=\\dfrac{\\sqrt{3}}{3}$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez dreptunghic $ABCD$ cu $AB\\parallel CD$, $AB>CD$, $CD=6$ cm, $BC=12$ cm și $\\sphericalangle ABC=60^\\circ$. Paralela prin $D$ la dreapta $BC$ intersectează latura $AB$ în punctul $M$.',
      parts: [
        { pts: 2, text: 'Arată că punctul $M$ este mijlocul segmentului $AB$.', ans: '$BCDM$ e paralelogram: $MB=DC=6$ cm, $DM=BC=12$ cm; în $\\triangle ADM$, $\\sphericalangle ADM=30^\\circ$, deci $AM=\\dfrac{DM}{2}=6$ cm $=MB$' },
        { pts: 3, text: 'Demonstrează că aria trapezului $ABCD$ este mai mare de $90\\text{ cm}^2$.', ans: '$AD=6\\sqrt{3}$ cm, $\\mathcal{A}_{ABCD}=\\dfrac{(12+6)\\cdot6\\sqrt{3}}{2}=54\\sqrt{3}=\\sqrt{8748}>\\sqrt{8100}=90$ ($\\text{cm}^2$)' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată, $VABC$ este o piramidă triunghiulară regulată cu vârful $V$. Punctele $M$ și $N$ sunt mijloacele muchiilor $BC$, respectiv $CV$, $MN=3{,}5$ cm, iar înălțimea piramidei este $VO=1$ cm. Punctul $P$ aparține laturii $AC$, astfel încât $AP=3PC$.',
      parts: [
        { pts: 2, text: 'Arată că $\\mathcal{A}_{ABC}=36\\sqrt{3}\\text{ cm}^2$.', ans: '$VB=2MN=7$ cm, $BO=\\sqrt{49-1}=4\\sqrt{3}$ cm, $AB=BO\\sqrt{3}=12$ cm, $\\mathcal{A}_{ABC}=\\dfrac{144\\sqrt{3}}{4}=36\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Demonstrează că planele $(MNP)$ și $(VOB)$ sunt paralele.', ans: 'Cu $T$ mijlocul lui $AC$ ($O\\in BT$): $P$ e mijlocul lui $TC$, deci $MP\\parallel BT$; $MN\\parallel VB$; $MN\\cap MP=\\{M\\}$, $BT\\cap VB=\\{B\\}$, deci $(MNP)\\parallel(VOB)$' },
      ],
      fig: fig18,
    },
  ],
}
