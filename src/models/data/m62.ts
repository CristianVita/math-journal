// Testul 31 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 134–136; every answer here is computed and checked with the book's answers, p. 281).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [8, 0], N: [12, 0], P: [14, 0], B: [16, 0] }, 170, { s: 'A-B', dot: 'A M N P B', l: { A: 'n', M: 'n', N: 'n', P: 'n', B: 'n' } })
const X8 = pol(46, 9), C8 = pol(23, 7)
const fig8 = plane({ A: [0, 0], B: [8, 0], Z: [13, 0], X: X8, Y: [8 + X8[0], X8[1]], C: C8, D: [8 + C8[0], C8[1]] }, 140, { s: 'A-Z A-X B-Y A-C B-D' })
const fig9 = plane({ A: [0, 0], C: [6, 0], B: [0, -6 * s3], M: [0, -2 * s3] }, 90, { s: 'A-B-C-A C-M', ra: ['BAC'], l: { M: 'w' } })
const fig10 = plane({ B: [0, 0], C: [5, 3], D: [10, 6], A: [3, 7], M: [4, 5] }, 120, { s: 'A-B-D-A A-C B-M' })
const fig11 = plane({ O: [0, 0], A: pol(100, 5), B: pol(230, 5), C: pol(310, 5) }, 100, { s: 'A-B-C-A', c: [{ at: 'O', r: 5 }], dot: 'O', ang: ['BAC'], l: { O: 'e' } })

const fig15 = graph({ A: [4, 0], H: [2, -2], L1: [-0.5, -4.5], L2: [5, 1] }, 110, [-1.5, 5.5], [-5, 1.5], { s: 'L1-L2 O-H', ra: ['OHA'], l: { L1: '', L2: '', A: 'n', H: 'w', O: 'nw' } })
const fig16 = plane({ A: [0, 0], B: [3 * s3, 0], C: [0, 3], M: [1.5 * s3, 1.5], D: [3 * s3, 6] }, 110, { s: 'A-B-C-A B-D-C A-M', ra: ['BAC'] })
const fig17 = plane({ A: [0, 0], B: [40, 0], C: [40, 10], D: [0, 10], E: [20, 0], M: [30, 0], N: [30, 5], P: [20, 5], F: [20, -10], G: [40, -10] }, 160, {
  s: 'A-B-C-D-A E-F-G-B E-P-N-M', l: { E: 'nw', M: 's' },
})
const fig18 = solid({ ...box(6, 6, 6 * s2), O: [3, 3, 0] }, BOX, 110, { seg: "A-C A'-C' C'-O A-B' A-D' B'-D'", dot: 'O' })

export const M62: EnModel = {
  id: 'en-62',
  title: 'Paralela 45, Testul 31',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 134–136',
  items: [
    { text: 'Cel mai mare divizor comun al numerelor $24$ și $36$ este:', choices: ['$6$', '$8$', '$12$', '$36$'], ans: 2 },
    { text: 'Mihai a depus $2500$ de lei la o bancă pentru care a primit, după $1$ an, o dobândă de $125$ de lei. Dobânda anuală oferită de bancă, exprimată în procente, este de:', choices: ['$2\\%$', '$3\\%$', '$4\\%$', '$5\\%$'], ans: 3 },
    { text: 'Valea Morții din California este situată la $-86$ m în raport cu nivelul mării, iar Vârful Toaca al Muntelui Ceahlău este situat la $+1904$ m față de nivelul mării. Diferența de nivel dintre Vârful Toaca și Valea Morții este:', choices: ['$2000$ m', '$1990$ m', '$1904$ m', '$1818$ m'], ans: 1 },
    {
      text: 'Patru colegi, Corina, Delia, Dan și Emil, sunt parteneri la un proiect. În tabelul alăturat se poate vedea a câta parte din lucrare a făcut fiecare după trei zile.\n\n| Corina | Delia | Dan | Emil |\n|---|---|---|---|\n| $\\dfrac{2}{7}$ | $\\dfrac{1}{5}$ | $\\dfrac{4}{15}$ | $\\dfrac{2}{9}$ |\n\nCei doi colegi care au lucrat cel mai mult sunt:',
      choices: ['Corina și Delia', 'Delia și Dan', 'Dan și Emil', 'Corina și Dan'], ans: 3,
    },
    { text: 'Rezultatul calculului $(\\sqrt{8}+\\sqrt{72}):(\\sqrt{50}-\\sqrt{2})$ este:', choices: ['$2$', '$3$', '$\\sqrt{2}$', '$3\\sqrt{2}$'], ans: 0 },
    { text: 'David afirmă că „Intervalul $(-2,\\,1]$ conține două numere întregi negative.” Afirmația lui David este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, segmentul $AB=16$ cm. Punctele $M$, $N$, $P$ sunt mijloacele segmentelor $AB$, $MB$ și, respectiv, $NB$. Lungimea segmentului $MP$ este egală cu:',
      choices: ['$4$ cm', '$6$ cm', '$8$ cm', '$10$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată dreptele $AX$ și $BY$ sunt paralele, punctele $A$, $B$, $Z$ sunt coliniare, iar semidreptele $AC$ și $BD$ sunt bisectoarele unghiurilor $XAZ$, respectiv $YBZ$. Dacă măsura unghiului $XAZ$ este $46^\\circ$, atunci măsura unghiului $DBZ$ este:',
      choices: ['$23^\\circ$', '$30^\\circ$', '$46^\\circ$', '$60^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ având $\\sphericalangle A=90^\\circ$, iar $CM$ este bisectoarea unghiului $BCA$, $M\\in AB$. Dacă $AM=2\\sqrt{3}$ cm și $MC=MB$, atunci lungimea ipotenuzei este egală cu:',
      choices: ['$8$ cm', '$6\\sqrt{3}$ cm', '$6$ cm', '$12$ cm'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$ în care $M$ este mijlocul laturii $AC$ și $D$ este simetricul punctului $B$ față de punctul $C$. Raportul dintre aria triunghiului $ABM$ și aria triunghiului $ABD$ este:',
      choices: ['$\\dfrac{1}{3}$', '$3$', '$4$', '$\\dfrac{1}{4}$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$, cu $\\sphericalangle A=40^\\circ$ este înscris în cercul $\\mathcal{C}$ cu centrul în $O$. Măsura unghiului $BOC$ este:',
      choices: ['$40^\\circ$', '$80^\\circ$', '$90^\\circ$', '$100^\\circ$'], ans: 1, fig: fig11,
    },
    { text: 'Un bazin în formă de paralelipiped dreptunghic are lungimea de $10$ m, lățimea de $4$ m și înălțimea de $1{,}5$ m. Pentru a umple bazinul este nevoie de:', choices: ['$50$ mii $\\ell$ apă', '$60$ mii $\\ell$ apă', '$70$ mii $\\ell$ apă', '$80$ mii $\\ell$ apă'], ans: 1 },

    {
      text: 'Într-o școală sunt $6$ profesori de matematică, având media vârstelor $40$ de ani și $4$ profesori de română cu media vârstelor de $25$ de ani.',
      parts: [
        { pts: 2, text: 'Calculează suma vârstelor profesorilor de matematică.', ans: '$40\\cdot6=240$ de ani' },
        { pts: 3, text: 'Determină media vârstelor tuturor profesorilor de matematică și de română din școală.', ans: '$m=\\dfrac{240+100}{10}=34$ de ani' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x}{x^3+x^2}:\\dfrac{(x+2)(2x-1)-x(x+3)+1}{(2x+2)(3x-3)}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $(x+2)(2x-1)-x(x+3)+1=x^2-1$, pentru orice $x\\in\\mathbb{R}$.', ans: '$2x^2+3x-2-x^2-3x+1=x^2-1$' },
        { pts: 3, text: 'Demonstrează că $E(x)=\\dfrac{6}{x(x+1)}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$E(x)=\\dfrac{x}{x^2(x+1)}\\cdot\\dfrac{6(x^2-1)}{x^2-1}=\\dfrac{6}{x(x+1)}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x-4$ și sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Calculează $f\\big((\\sqrt{2}+1)^2\\big)-f\\big((\\sqrt{2}-1)^2\\big)$.', ans: '$(3+2\\sqrt{2})-(3-2\\sqrt{2})=4\\sqrt{2}$' },
        { pts: 3, text: 'Determină distanța de la $O$, originea sistemului de axe ortogonale $xOy$, la reprezentarea grafică a funcției $f$.', ans: 'Graficul taie axele în $A(4,\\,0)$ și $B(0,\\,-4)$; $AB=4\\sqrt{2}$, deci $d=\\dfrac{OA\\cdot OB}{AB}=2\\sqrt{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, cu $\\sphericalangle A=90^\\circ$ și $\\sphericalangle B=30^\\circ$. În exteriorul lui se construiește triunghiul echilateral $BCD$. Punctul $M$ este mijlocul laturii $BC$ și $AM=3$ cm.',
      parts: [
        { pts: 2, text: 'Arată că perimetrul triunghiului $BCD$ este egal cu $18$ cm.', ans: '$BC=2AM=6$ cm, deci $\\mathcal{P}_{BCD}=18$ cm' },
        { pts: 3, text: 'Demonstrează că dreptele $AM$ și $CD$ sunt paralele.', ans: '$\\sphericalangle AMC=\\sphericalangle MAB+\\sphericalangle MBA=30^\\circ+30^\\circ=60^\\circ=\\sphericalangle DCM$ (alterne interne), deci $AM\\parallel CD$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este schița unei grădini în care există un bazin $EMNP$. Se știe că $ABCD$, $EFGB$, $EMNP$ sunt dreptunghiuri și $AB=40$ m, $BE=20$ m, $BC=BG=EM=10$ m, $PE=5$ m.',
      parts: [
        { pts: 2, text: 'Arată că suprafața bazinului reprezintă mai puțin de $9\\%$ din suprafața grădinii.', ans: '$\\mathcal{A}_{EMNP}:\\mathcal{A}_{grădină}=50:600<9:100$' },
        { pts: 3, text: 'Demonstrează că punctele $D$, $E$, $G$ sunt coliniare.', ans: '$DE+EG=10\\sqrt{5}+10\\sqrt{5}=20\\sqrt{5}=DG$, deci punctele $D$, $E$, $G$ sunt coliniare' },
      ],
      fig: fig17,
    },
    {
      text: "Figura alăturată reprezintă o prismă patrulateră regulată $ABCDA'B'C'D'$ cu muchia bazei $AB=6$ cm și muchia laterală $AA'=6\\sqrt{2}$ cm. Punctul $O$ este centrul pătratului $ABCD$.",
      parts: [
        { pts: 2, text: "Arată că patrulaterul $ACC'A'$ este pătrat.", ans: "$AA'\\parallel CC'$, $AA'=CC'$, $AA'=AC=6\\sqrt{2}$ cm și $AA'\\perp AC$, deci $ACC'A'$ e pătrat" },
        { pts: 3, text: "Demonstrează că dreapta $C'O$ este paralelă cu planul $AB'D'$.", ans: "Fie $O'$ centrul pătratului $A'B'C'D'$: $C'O\\parallel AO'$, $AO'\\subset(AB'D')$ și $C'O\\not\\subset(AB'D')$, deci $C'O\\parallel(AB'D')$" },
      ],
      fig: fig18,
    },
  ],
}
