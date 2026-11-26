// Testul 46 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 167–169; every answer here is computed and checked with the book's answers, p. 286).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { along, mid3, plane, solid } from '../figure'
import { box, BOX, graph, pol, tetra, TETRA } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [6, 0], B: [12, 0], C: [20, 0], N: [28, 0] }, 170, { s: 'A-N', dot: 'A M B C N', l: { A: 's', M: 's', B: 's', C: 'n', N: 'n' } })
const A9 = pol(30, 3)
const fig9 = plane({ B: [0, 0], C: [4, 0], A: A9, D: [A9[0] + 4, A9[1]] }, 140, { s: 'A-B-C-D-A', ang: ['DAB'] })
const C10: Pt = [4, 4 * s3]
const fig10 = plane({ A: [0, 0], B: [8, 0], C: C10, M: along(C10, [8, 0], 3 / 8) }, 100, { s: 'A-B-C-A A-M', l: { M: 'e' } })
const fig11 = plane({ O: [0, 0], A: [4 * s2, 0], B: [2 * s2, 2 * s2], C: [2 * s2, -2 * s2] }, 110, { s: 'A-B A-C', c: [{ at: 'O', r: 4 }], dot: 'O', l: { O: 'w', A: 'e' } })
const fig12 = solid(box(80, 50, 40), BOX, 140)

const fig15 = graph({ M: [-1.5, 0], L1: [-0.5, -2], L2: [2.6, 4.2] }, 120, [-2.5, 3.5], [-2.5, 4.5], { s: 'L1-L2', dot: 'M', l: { L1: '', L2: '', M: 'n' } })
const fig16 = plane({ A: [0, 0], B: [36, 0], C: [0, 27], D: [0, 12], E: [16, 0] }, 150, { s: 'A-B-C-A D-E B-D', ra: ['BAC'] })
const fig17 = plane({ A: [0, 0], B: [10, 0], C: [10, 4], D: [0, 4], M: [2, 4], N: [8, 4] }, 150, { s: 'A-B-C-D-A', dot: 'M N', l: { M: 'n', N: 'n' } })
const t18 = tetra(4, ['B', 'C', 'D', 'A'])
const fig18 = solid({ ...t18, M: mid3(t18.A, t18.B), N: mid3(t18.A, t18.C), P: mid3(t18.A, t18.D) }, TETRA('B', 'C', 'D', 'A'), 120, { seg: 'N-P C-M', l: { M: 'w', P: 'e' } })

export const M77: EnModel = {
  id: 'en-77',
  title: 'Paralela 45, Testul 46',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 167–169',
  items: [
    { text: 'Rezultatul calculului $45-36:\\left[16-\\left(3^2-2^3\\right)\\cdot7\\right]$ este:', choices: ['$1$', '$41$', '$40$', '$0$'], ans: 1 },
    {
      text: 'Un elev are la limba engleză următoarele note:\n\n| Nota | $5$ | $6$ | $7$ | $8$ | $9$ |\n|---|---|---|---|---|---|\n| Numărul de note | $1$ | $1$ | $2$ | $1$ | $1$ |\n\nNumărul notelor mai mici decât $8$ este:',
      choices: ['$2$', '$4$', '$3$', '$5$'], ans: 1,
    },
    { text: 'Suma divizorilor întregi ai numărului $24$ este:', choices: ['$60$', '$40$', '$0$', '$80$'], ans: 2 },
    {
      text: 'Considerăm numerele raționale $\\dfrac{2}{3}$, $\\dfrac{5}{6}$, $\\dfrac{4}{5}$, $\\dfrac{3}{4}$. Patru elevi, Ion, Mihai, Ana și Maria, trebuie să găsească cel mai mare dintre numerele date. Răspunsurile lor sunt prezentate în tabelul următor.\n\n| Elevul | Ion | Mihai | Ana | Maria |\n|---|---|---|---|---|\n| Răspunsul | $\\dfrac{2}{3}$ | $\\dfrac{3}{4}$ | $\\dfrac{4}{5}$ | $\\dfrac{5}{6}$ |\n\nElevul care a dat răspunsul corect este:',
      choices: ['Ion', 'Mihai', 'Ana', 'Maria'], ans: 3,
    },
    { text: 'Cifrele $a$ și $b$, $a<b$, pentru care numărul $\\sqrt{\\overline{1ab}}$ este natural, sunt:', choices: ['$a=2$, $b=1$', '$a=4$, $b=4$', '$a=6$, $b=9$', '$a=5$, $b=9$'], ans: 2 },
    { text: 'Afirmația: „Numărul $\\sqrt{2}$ este soluție a ecuației $x\\sqrt{2}+3=5$, cu $x\\in\\mathbb{Q}$.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'Pe o dreaptă considerăm punctele $A$, $B$ și $C$ ca în figura următoare, $AB=12$ cm, $AC=20$ cm. Punctul $M$ este mijlocul segmentului $AB$, iar punctul $N$ este simetricul punctului $B$ față de punctul $C$. Lungimea segmentului $MN$ este:',
      choices: ['$20$ cm', '$18$ cm', '$14$ cm', '$22$ cm'], ans: 3, fig: fig7,
    },
    { text: "Un unghi are măsura de $47^\\circ30'$. Măsura complementului său este:", choices: ["$42^\\circ30'$", "$41^\\circ30'$", "$132^\\circ30'$", "$131^\\circ30'$"], ans: 0 },
    {
      text: 'În figura alăturată este reprezentată schița unui parc în formă de paralelogram, în care $AB=300$ m, $BC=400$ m și $\\sphericalangle DAB=150^\\circ$. Aria parcului este:',
      choices: ['$1$ ha', '$6$ ha', '$3$ ha', '$4$ ha'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul echilateral $ABC$, având $AB=8$ cm. Punctul $M$ se află pe latura $BC$, iar $CM=3$ cm. Perimetrul triunghiului $ABM$ este egal cu:',
      choices: ['$20$ cm', '$18$ cm', '$\\left(12+4\\sqrt{3}\\right)$ cm', '$24$ cm'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ și $AC$ sunt tangente la cercul $\\mathcal{C}(O,\\,R)$ în $B$, respectiv $C$, $R=4$ cm, iar $AB=AC=4$ cm. Măsura unghiului $BAC$ este:',
      choices: ['$90^\\circ$', '$70^\\circ$', '$60^\\circ$', '$80^\\circ$'], ans: 0, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentat un acvariu în formă de paralelipiped dreptunghic cu înălțimea de $40$ cm și dimensiunile bazei egale cu $50$ cm și $80$ cm. Punem în acvariu $120\\ \\ell$ de apă. Înălțimea la care urcă apa este:',
      choices: ['$10$ cm', '$20$ cm', '$30$ cm', '$40$ cm'], ans: 2, fig: fig12,
    },

    {
      text: 'Fie $a$, $b$ și $c$ trei numere întregi, astfel încât $2a+3b+1=0$ și $4b-5c-2=0$.',
      parts: [
        { pts: 2, text: 'Arată că $8a+15c=-10$.', ans: '$a=\\dfrac{-3b-1}{2}$ și $c=\\dfrac{4b-2}{5}$, deci $8a+15c=4(-3b-1)+3(4b-2)=-10$' },
        { pts: 3, text: 'Determină $a$ și $b$, știind că $c=2$.', ans: '$4b=12$, deci $b=3$ și $2a=-10$, $a=-5$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{3}{x-1}-\\dfrac{4}{x+1}-\\dfrac{7}{x^2-1}\\right):\\left(\\dfrac{x^2+1}{x^2-1}+1\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=-\\dfrac{1}{2x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$E(x)=\\dfrac{-x}{x^2-1}\\cdot\\dfrac{x^2-1}{2x^2}=-\\dfrac{1}{2x}$' },
        { pts: 3, text: 'Calculează $E(a)$, unde $a=\\dfrac{1}{\\sqrt{5}+1}-\\dfrac{1}{\\sqrt{5}-1}$.', ans: '$a=\\dfrac{\\sqrt{5}-1}{4}-\\dfrac{\\sqrt{5}+1}{4}=-\\dfrac{1}{2}$, deci $E(a)=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-1$.',
      parts: [
        { pts: 2, text: 'Calculează $f\\left(\\sqrt{2}\\right)\\cdot f\\left(\\sqrt{2}+1\\right)$.', ans: '$\\left(2\\sqrt{2}-1\\right)\\left(2\\sqrt{2}+1\\right)=8-1=7$' },
        { pts: 3, text: 'Determină distanța de la punctul $M\\left(-\\dfrac{3}{2},\\,0\\right)$ la reprezentarea grafică a funcției $f$, în sistemul de axe ortogonale $xOy$.', ans: 'Graficul taie axele în $A\\left(\\dfrac{1}{2},\\,0\\right)$ și $B(0,\\,-1)$; $MA=2$, $AB=\\dfrac{\\sqrt{5}}{2}$, deci $d=\\dfrac{MA\\cdot OB}{AB}=\\dfrac{4}{\\sqrt{5}}=\\dfrac{4\\sqrt{5}}{5}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic în $A$, $D$ este un punct pe latura $AC$, astfel încât $AB=36$ cm și $AD=12$ cm și $CD=15$ cm. Paralela prin $D$ la $BC$ intersectează $AB$ în $E$.',
      parts: [
        { pts: 2, text: 'Arată că $DE=20$ cm.', ans: '$AC=27$ cm, $BC=\\sqrt{36^2+27^2}=45$ cm; $\\triangle ADE\\sim\\triangle ACB$, deci $DE=\\dfrac{AD}{AC}\\cdot BC=\\dfrac{12}{27}\\cdot45=20$ cm' },
        { pts: 3, text: 'Arată că $BD$ este bisectoarea unghiului $ABC$.', ans: '$AE=16$ cm, deci $EB=20$ cm $=DE$; $\\triangle DEB$ este isoscel, $\\sphericalangle EDB=\\sphericalangle EBD$, iar $\\sphericalangle EDB=\\sphericalangle CBD$ (alterne), deci $\\sphericalangle CBD=\\sphericalangle DBE$' },
      ],
      fig: fig16,
    },
    {
      text: 'Se consideră dreptunghiul $ABCD$ cu $AB=10$ cm și $BC=4$ cm, desenat în figura alăturată. Punctele $M$ și $N$ sunt pe latura $CD$, $CN=2$ cm, $CM=8$ cm.',
      parts: [
        { pts: 2, text: 'Arată că punctele $M$ și $N$ aparțin cercului de diametru $AB$.', ans: 'Fie $O$ mijlocul lui $AB$: $OM=ON=\\sqrt{3^2+4^2}=5$ cm $=\\dfrac{AB}{2}$' },
        { pts: 3, text: 'Demonstrează că $\\sphericalangle NBC\\equiv\\sphericalangle NAB$.', ans: '$N$ e pe cercul de diametru $AB$, deci $\\sphericalangle ANB=90^\\circ$ și $\\sphericalangle NBC=90^\\circ-\\sphericalangle NBA=\\sphericalangle NAB$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este desenat tetraedrul regulat $ABCD$ cu latura $AB=4$ cm. Punctele $M$, $N$, $P$ sunt mijloacele muchiilor $AB$, $AC$, respectiv $AD$.',
      parts: [
        { pts: 2, text: 'Calculează sinusul unghiului dintre dreptele $NP$ și $CM$.', ans: '$NP\\parallel CD$, deci unghiul este $\\sphericalangle MCD$; în $\\triangle MCD$ isoscel ($MC=MD=2\\sqrt{3}$ cm): $\\cos=\\dfrac{2}{2\\sqrt{3}}$, deci $\\sin(\\sphericalangle MCD)=\\dfrac{\\sqrt{6}}{3}$' },
        { pts: 3, text: 'Arată că aria totală a tetraedrului este mai mică de $28\\text{ cm}^2$.', ans: '$\\mathcal{A}_t=4\\cdot\\dfrac{16\\sqrt{3}}{4}=16\\sqrt{3}\\text{ cm}^2$, iar $16\\sqrt{3}<28\\Leftrightarrow4\\sqrt{3}<7\\Leftrightarrow\\sqrt{48}<\\sqrt{49}$, adevărat' },
      ],
      fig: fig18,
    },
  ],
}
