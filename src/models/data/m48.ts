// Testul 17 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 106–107; every answer here is computed and checked with the book's answers, p. 276; III.6 b) the book
// only shows MB ⊥ BD, the distance 2√3 cm is computed here).
import type { EnModel } from '../types'
import { along3, plane, solid, type P3 } from '../figure'
import { box, BOX, graph, pol, PYR4, pyr4 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [1, 0], B: [2, 0], N: [3, 0], C: [4, 0], X0: [-0.3, 0], X1: [4.3, 0] }, 170, { s: 'X0-X1', dot: 'A M B N C', l: { X0: '', X1: '', A: 's', M: 's', B: 's', N: 's', C: 's' } })
const fig8 = plane({ A: [-8, 0], O: [0, 0], C: [8, 0], B: pol(150, 9) }, 130, { s: 'A-C O-B', dot: 'A O C B', l: { A: 's', O: 's', C: 's' } })
const fig9 = plane({ A: [0, 0], B: [6 * s3, 0], C: [0, 6], M: [3 * s3, 9], D: [3 * s3, 3] }, 110, { s: 'A-B-M-C-A C-B A-D D-M', ra: ['BAC'] })
const fig10 = plane({ A: [0, 2], B: [2, 2], C: [2, 0], D: [0, 0], M: [4, 2], N: [2, -2], P: [-2, 0], Q: [0, 4] }, 120, { s: 'A-B-C-D-A M-N-P-Q-M A-M B-N C-P D-Q' })
const fig11 = plane({ O: [0, 0], A: pol(30, 5), D: pol(210, 5), B: pol(170, 5), C: pol(250, 5) }, 100, { s: 'A-B A-C A-D O-B B-D', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 'ne' } })
const p12 = pyr4(6, 8)
const sec12 = (n: string): P3 => along3(p12[n], p12.V, 1 / 3)
const fig12 = solid({ ...p12, a1: sec12('A'), b1: sec12('B'), c1: sec12('C'), d1: sec12('D') }, PYR4, 120, {
  seg: 'a1-b1-c1-d1-a1 V-O', l: { a1: '', b1: '', c1: '', d1: '', O: 's' },
})

const fig15 = graph({ A: [3, 0], B: [0, -9], C: [3, -9], L1: [3.6, 1.8], L2: [-0.3, -9.9] }, 110, [-2, 5], [-11, 3], { s: 'L1-L2 A-C-B', dot: 'A B C', l: { L1: '', L2: '', A: 'nw', B: 'w', C: 'e' } })
const fig16 = plane({ A: [0, 10], B: [10, 10], C: [10, 0], D: [0, 0], M: [5, 10 - 5 * s3], N: [6.34, 3.66] }, 120, { s: 'A-B-C-D-A A-C A-M-B M-C', l: { M: 's', N: 'e' } })
const fig17 = plane({ A: [0, 0], B: [8, 0], C: [0, 6], N: [4, 3], M: [1.75, 0], T: [0, -7 / 3] }, 120, { s: 'A-B-C-A C-T-N', ra: ['BAC', 'BNT'], l: { M: 'se' } })
const p18 = box(3 * s3, 3, 2 * s3)
const fig18 = solid({ ...p18, M: [4 * s3, 3, 0] }, BOX, 140, { s: 'C-M' })

export const M48: EnModel = {
  id: 'en-48',
  title: 'Paralela 45, Testul 17',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 106–107',
  items: [
    { text: 'Dintre următoarele secvențe, cea formată numai din numere prime este:', choices: ['$1,\\ 2,\\ 3,\\ 5$', '$2,\\ 3,\\ 4,\\ 5$', '$5,\\ 7,\\ 9,\\ 11$', '$11,\\ 13,\\ 17,\\ 19$'], ans: 3 },
    { text: 'Fracția supraunitară din mulțimea $\\left\\{\\dfrac{3}{7},\\,\\dfrac{5}{9},\\,\\dfrac{6}{5},\\,\\dfrac{11}{12}\\right\\}$ este:', choices: ['$\\dfrac{5}{9}$', '$\\dfrac{6}{5}$', '$\\dfrac{3}{7}$', '$\\dfrac{11}{12}$'], ans: 1 },
    { text: 'Rezultatul calculului $-12+(3-4\\cdot2)\\cdot|-1|$ este:', choices: ['$17$', '$-7$', '$-17$', '$7$'], ans: 2 },
    {
      text: 'Patru elevi, Andrei, Cătălin, Eduard și George, au avut de aflat media aritmetică a numerelor reale $x$ și $y$ care verifică relațiile $x^2-y^2=16$ și $x-y=2$. Rezultatele obținute sunt trecute în tabelul următor.\n\n| Andrei | Cătălin | Eduard | George |\n|---|---|---|---|\n| $4$ | $8$ | $6$ | $9$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Cătălin', 'George', 'Andrei', 'Eduard'], ans: 2,
    },
    { text: 'Scriind sub formă de interval mulțimea $A=\\{x\\in\\mathbb{R}\\mid x>-1\\text{ și }x<3\\}$, obținem:', choices: ['$A=(0,\\,2)$', '$A=[-1,\\,3]$', '$A=(-\\infty,\\,-1)$', '$A=(-1,\\,3)$'], ans: 3 },
    { text: 'Fie $a$ un număr real și intervalul $I=(-\\infty,\\,1)$. Propoziția „Există numere reale $a$ pentru care numărul $n=1+a^2$ aparține intervalului $I$.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctul $M$ este mijlocul segmentului $AB$, $N$ este mijlocul segmentului $BC$, iar $C$ este simetricul punctului $A$ față de punctul $B$. Valoarea raportului dintre lungimile segmentelor $AB$ și $MC$ este:',
      choices: ['$\\dfrac{2}{3}$', '$\\dfrac{3}{2}$', '$1$', '$2$'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiul $AOB$ are măsura egală cu $30^\\circ$, iar $OC$ este semidreapta opusă semidreptei $OA$. Măsura unghiului $BOC$ este egală cu:',
      choices: ['$60^\\circ$', '$120^\\circ$', '$150^\\circ$', '$180^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic cu $\\sphericalangle A=90^\\circ$, $\\sphericalangle B=30^\\circ$, iar $ABM$ este un triunghi echilateral, punctele $M$ și $C$ fiind de aceeași parte a dreptei $AB$. Punctul $D$ este mijlocul segmentului $BC$, iar $AD=6$ cm. Perimetrul patrulaterului $ADMC$ este egal cu:',
      choices: ['$12$ cm', '$24$ cm', '$36$ cm', '$20$ cm'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat cu latura de $2$ cm. Punctul $M$ este simetricul punctului $A$ față de $B$, $N$ este simetricul punctului $B$ față de $C$, $P$ este simetricul punctului $C$ față de $D$ și $Q$ este simetricul punctului $D$ față de $A$. Aria patrulaterului $MNPQ$ este egală cu:',
      choices: ['$16\\text{ cm}^2$', '$18\\text{ cm}^2$', '$20\\text{ cm}^2$', '$40\\text{ cm}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc. Diametrul $AD$ este bisectoarea unghiului $BAC$ cu măsura de $40^\\circ$. Măsura unghiului $OBD$ este egală cu:',
      choices: ['$20^\\circ$', '$70^\\circ$', '$40^\\circ$', '$160^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'În figura alăturată, $VABCD$ este o piramidă patrulateră regulată, cu muchia bazei $BC=6$ cm. Se secționează piramida cu un plan paralel cu baza, situat la o treime din înălțime față de bază. Aria secțiunii este egală cu:',
      choices: ['$8\\text{ cm}^2$', '$16\\text{ cm}^2$', '$4\\text{ cm}^2$', '$18\\text{ cm}^2$'], ans: 1, fig: fig12,
    },

    {
      text: 'În urmă cu doi ani, vârsta mamei era de cinci ori mai mare decât vârsta fiicei. Peste șase ani, vârsta fiicei va fi de trei ori mai mică decât vârsta mamei.',
      parts: [
        { pts: 2, text: 'Vârsta mamei în prezent poate fi egală cu $40$ de ani? Justifică răspunsul.', ans: 'Nu: acum $2$ ani mama ar fi avut $38$ de ani, care nu se împarte exact la $5$' },
        { pts: 3, text: 'Determină vârsta actuală a fiicei.', ans: '$m-2=5(f-2)$ și $m+6=3(f+6)$ dau $f=10$ ani (și $m=42$ de ani)' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{1}{4x^2-1}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{1}{2},\\,\\dfrac{1}{2}\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)+\\dfrac{1}{4x+2}-\\dfrac{1}{4x-2}=0$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{1}{2},\\,\\dfrac{1}{2}\\right\\}$.', ans: '$\\dfrac{1}{4x+2}-\\dfrac{1}{4x-2}=\\dfrac{-4}{4(4x^2-1)}=-\\dfrac{1}{4x^2-1}=-E(x)$' },
        { pts: 3, text: 'Calculează $a=E(1)+E(2)+\\ldots+E(9)$. Exprimă $a$ sub formă de fracție zecimală cu două zecimale exacte.', ans: '$E(n)=\\dfrac{1}{2}\\left(\\dfrac{1}{2n-1}-\\dfrac{1}{2n+1}\\right)$, deci $a=\\dfrac{1}{2}\\left(1-\\dfrac{1}{19}\\right)=\\dfrac{9}{19}=0{,}47\\ldots$, adică $a\\approx0{,}47$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3x-9$.',
      parts: [
        { pts: 2, text: 'Arată că $f(1)\\cdot f(2)\\cdot f(3)\\cdot f(4)=0$.', ans: '$f(3)=0$, deci produsul este $0$' },
        { pts: 3, text: 'Reprezentarea grafică a funcției $f$ intersectează axele $Ox$ și $Oy$ ale sistemului de axe ortogonale $xOy$ în $A$, respectiv $B$. Determină aria patrulaterului $OACB$, unde punctul $C$ este simetricul punctului $O$ față de mijlocul segmentului $AB$.', ans: '$A(3,\\,0)$, $B(0,\\,-9)$; $OACB$ e dreptunghi, deci $\\mathcal{A}_{OACB}=OA\\cdot OB=27$ (unități de arie)' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat având centrul $O$ și $MAB$ este un triunghi echilateral. Segmentele $AC$ și $MB$ se intersectează în punctul $N$.',
      parts: [
        { pts: 2, text: 'Demonstrează că triunghiul $MNC$ este isoscel.', ans: '$\\sphericalangle NAB=45^\\circ$, $\\sphericalangle ABN=60^\\circ$, deci $\\sphericalangle MNC=\\sphericalangle ANB=75^\\circ$; $MB=BC$ și $\\sphericalangle MBC=30^\\circ$, deci $\\sphericalangle BMC=75^\\circ$; $\\triangle MNC$ e isoscel, cu $CM=CN$' },
        { pts: 3, text: 'Stabilește dacă punctele $M$, $O$ și $G$ sunt coliniare, unde $G$ este centrul de greutate al triunghiului $ABM$.', ans: 'Da: cu $T$ mijlocul lui $AB$, $MT\\perp AB$ și $G\\in MT$, iar $OT\\perp AB$; perpendiculara în $T$ pe $AB$ e unică, deci $M$, $O$, $G$ sunt pe ea' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic având catetele $AB=8$ cm și $AC=6$ cm. Mediatoarea segmentului $BC$ este $NM$, unde $N\\in BC$, iar $M\\in AB$ și intersectează dreapta $AC$ în punctul $T$.',
      parts: [
        { pts: 2, text: 'Demonstrează că $\\mathcal{P}_{MBC}=22{,}5$ cm.', ans: '$MB=MC=x$, $AM=8-x$; în $\\triangle CAM$: $36+(8-x)^2=x^2$, deci $x=6{,}25$ și $\\mathcal{P}_{MBC}=2x+BC=22{,}5$ cm' },
        { pts: 3, text: 'Arată că $CM\\perp TB$.', ans: 'În $\\triangle TBC$: $TN\\perp BC$, $BA\\perp TC$, $BA\\cap TN=\\{M\\}$, deci $M$ e ortocentrul și $CM\\perp TB$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat un paralelipiped dreptunghic $ABCDA'B'C'D'$ având $AB=3\\sqrt{3}$ cm, $AA'=2\\sqrt{3}$ cm și volumul egal cu $54\\text{ cm}^3$. Prelungim muchia $DC$ cu segmentul $CM=\\dfrac{DC}{3}$.",
      parts: [
        { pts: 2, text: 'Arată că diagonala paralelipipedului are lungimea mai mică de $7$ cm.', ans: "$BC=\\dfrac{54}{3\\sqrt{3}\\cdot2\\sqrt{3}}=3$ cm, $AC'=\\sqrt{27+9+12}=\\sqrt{48}<\\sqrt{49}=7$ cm" },
        { pts: 3, text: "Află distanța de la punctul $M$ la planul $(BDD')$.", ans: "$MC=\\sqrt{3}$ cm; $\\text{tg}\\sphericalangle DBC=\\sqrt{3}$ și $\\text{tg}\\sphericalangle CBM=\\dfrac{\\sqrt{3}}{3}$, deci $MB\\perp BD$; și $MB\\perp BB'$, deci $d(M,(BDD'))=MB=\\sqrt{3+9}=2\\sqrt{3}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
