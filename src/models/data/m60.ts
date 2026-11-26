// Testul 29 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 130–132; every answer here is computed and checked with the book's answers, p. 280).
import type { EnModel } from '../types'
import { along3, plane, solid } from '../figure'
import { graph, pol, PYR4, pyr4 } from './shapes'

const fig7 = plane({ A: [0, 0], B: [6, 0], C: [7, 0], D: [10, 0] }, 160, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: [10, 0], B: [0, 10], C: pol(75, 10), D: pol(165, 10) }, 120, { s: 'O-A O-B O-C O-D', ra: ['AOB'], l: { O: 's' } })
const fig9 = plane({ A: [0, 0], B: [20, 0], C: [0, 15], D: [7.2, 9.6] }, 120, { s: 'A-B-C-A A-D', ra: ['BAC', 'ADB'] })
const fig10 = plane({ A: [0, 0], B: [15, 0], C: [10, 4], D: [3, 4], M: [1.5, 2], N: [12.5, 2], P: [5, 2], Q: [9, 2] }, 150, { s: 'A-B-C-D-A A-C B-D M-N', l: { P: 's', Q: 's' } })
const fig11 = plane({ O: [0, 0], A: pol(90, 4), B: pol(210, 4), C: pol(330, 4) }, 100, { s: 'A-B-C-A', c: [{ at: 'O', r: 4 }], dot: 'O', l: { O: 'e' } })

const fig15 = graph({ A: [2, 3], L1: [-1.5, -2.25], L2: [3, 4.5] }, 110, [-2, 3.5], [-2.5, 5], { s: 'L1-L2', dot: 'A', l: { L1: '', L2: '', A: 'e', O: 'se' } })
const fig16 = plane({ B: [0, 0], A: [0, 8], C: [4, 0], D: [4, 4], M: [-8, 0], N: [-8, 8] }, 130, { s: 'N-A-D-C-B-M-N A-B', ra: ['ABC'] })
const fig17 = plane({ O: [0, 0], A: [5, 0], B: [5, 5], C: [5, -5], U: [5, 7], W: [5, -7] }, 110, {
  s: 'U-W O-B O-C O-A', c: [{ at: 'O', r: 5 }], dot: 'O', ra: ['BOC'], l: { U: '', W: '', O: 'w' }, t: [{ at: [4.3, 6.9], s: 'd', italic: true }],
})
const p18 = pyr4(6, 6 / Math.SQRT2)
const fig18 = solid({ ...p18, P: along3(p18.V, p18.C, 2 / 3) }, PYR4, 130, { seg: 'B-P', dot: 'P', l: { O: '' } })

export const M60: EnModel = {
  id: 'en-60',
  title: 'Paralela 45, Testul 29',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 130–132',
  items: [
    { text: 'Rezultatul calculului $2:\\dfrac{1}{2}+3:\\dfrac{1}{3}$ este:', choices: ['$2$', '$5$', '$10$', '$13$'], ans: 3 },
    {
      text: 'În tabelul următor este reprezentată o dependență funcțională.\n\n| $x$ | $-1$ | $0$ | $b$ | $2$ | $3$ |\n|---|---|---|---|---|---|\n| $y=2x-2$ | $-4$ | $a$ | $0$ | $2$ | $c$ |\n\nValoarea sumei $a+b+c$ este:',
      choices: ['$-2$', '$0$', '$3$', '$5$'], ans: 2,
    },
    { text: 'Numărul întreg $n$ cu proprietatea că $n<1-\\sqrt{2}<n+1$ este:', choices: ['$-2$', '$-1$', '$0$', '$1$'], ans: 1 },
    { text: 'Scara unei hărți este $1:250\\,000$. Distanța între două localități, pe hartă, este $12$ cm. Distanța reală dintre cele două localități este:', choices: ['$3$ km', '$30$ km', '$300$ km', '$3000$ km'], ans: 1 },
    { text: 'Suma soluțiilor ecuației $|x-1|=3$ este:', choices: ['$0$', '$1$', '$2$', '$3$'], ans: 2 },
    { text: 'Un suc și două cornuri costă $7$ lei. Afirmația „Trei sucuri și șase cornuri, de același fel, costă $20$ de lei” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$ sunt coliniare, în această ordine, $AC=7$ cm și $BD=4$ cm. Lungimea segmentului $AB$ este mai mare decât lungimea segmentului $CD$ cu:',
      choices: ['$2$ cm', '$3$ cm', '$4$ cm', '$5$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiurile drepte $AOB$ și $COD$, semidreptele $OC$ și $OB$ fiind interioare unghiurilor $AOB$, respectiv $COD$. Dacă $\\sphericalangle BOD=5\\cdot\\sphericalangle BOC$, atunci măsura unghiului $AOD$ este egală cu:',
      choices: ['$100^\\circ$', '$125^\\circ$', '$150^\\circ$', '$165^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic, $\\sphericalangle A=90^\\circ$, iar $AD\\perp BC$, cu $D\\in BC$. Dacă $BD=16$ m și $CD=9$ m, aria triunghiului $ABC$ este:',
      choices: ['$150\\text{ m}^2$', '$144\\text{ m}^2$', '$25\\text{ m}^2$', '$250\\text{ m}^2$'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată, linia mijlocie $MN$ a trapezului $ABCD$ ($AB\\parallel CD$) intersectează diagonalele $AC$ și $BD$ în punctele $P$, respectiv $Q$. Se știe că $CD=7$ cm și $PQ=4$ cm. Lungimea segmentului $MN$ este:',
      choices: ['$10$ cm', '$10{,}5$ cm', '$11$ cm', '$11{,}75$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'Triunghiul echilateral $ABC$ din figura alăturată are vârfurile situate pe cercul de centru $O$. Perimetrul triunghiului este $12\\sqrt{3}$ cm. Raza cercului are lungimea:',
      choices: ['$4$ cm', '$2\\sqrt{3}$ cm', '$3\\sqrt{3}$ cm', '$6$ cm'], ans: 0, fig: fig11,
    },
    { text: 'Marian are o sută de cubulețe identice și construiește, cu ajutorul lor, un cub cât mai mare posibil. Numărul cubulețelor care rămân nefolosite de Marian este:', choices: ['$0$', '$25$', '$19$', '$36$'], ans: 3 },

    {
      text: 'Dacă elevii clasei a VIII-a B s-ar așeza câte unul în fiecare bancă, ar rămâne $13$ elevi în picioare. Pentru a fi câte doi elevi în fiecare bancă, ar mai fi nevoie de încă doi elevi.',
      parts: [
        { pts: 2, text: 'Arată că, dacă se scoate o bancă din clasă și elevii se așază câte doi în fiecare bancă, toate băncile vor fi complet ocupate.', ans: 'Cu $b$ bănci: $b+13=2b-2$, deci $b=15$ și sunt $28$ de elevi; în $14$ bănci încap exact $28$ de elevi' },
        { pts: 3, text: 'Câți elevi sunt în clasa a VIII-a B?', ans: '$b+13=2b-2$, deci $b=15$ bănci și $28$ de elevi' },
      ],
    },
    {
      text: 'Se consideră $E(x)=\\dfrac{x^3}{x-1}\\cdot\\left(\\dfrac{1}{x^2}-\\dfrac{1}{x^4}\\right)-\\dfrac{x+3}{x}$, unde $x$ este un număr real, $x\\ne0$ și $x\\ne1$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=-\\dfrac{2}{x}$, oricare ar fi $x\\in\\mathbb{R}\\setminus\\{0,\\,1\\}$.', ans: '$\\dfrac{x^3}{x-1}\\cdot\\dfrac{(x-1)(x+1)}{x^4}=\\dfrac{x+1}{x}$, iar $\\dfrac{x+1}{x}-\\dfrac{x+3}{x}=-\\dfrac{2}{x}$' },
        { pts: 3, text: 'Determină numerele întregi $n$ pentru care $E(n)$ este număr întreg.', ans: '$n$ divide $2$ și $n\\notin\\{0,\\,1\\}$, deci $n\\in\\{-2,\\,-1,\\,2\\}$' },
      ],
    },
    {
      text: 'În raport cu un sistem de axe ortogonale $xOy$ se consideră punctul $A(2,\\,3)$. Dreapta $OA$ este reprezentarea graficului funcției $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$.',
      parts: [
        { pts: 2, text: 'Arată că $a=1{,}5$ și $b=0$.', ans: '$f(0)=0$ dă $b=0$, iar $f(2)=3$ dă $a=1{,}5$' },
        { pts: 3, text: 'Calculează sinusul unghiului format de reprezentarea grafică a funcției $f$ și axa $Oy$.', ans: '$OA=\\sqrt{13}$, iar distanța de la $A$ la $Oy$ este $2$, deci $\\sin(\\sphericalangle AOy)=\\dfrac{2}{\\sqrt{13}}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez dreptunghic cu $AB\\parallel CD$, $AB=2CD=8$ cm, $BC=4$ cm și $AD=4\\sqrt{2}$ cm, iar $ABMN$ este un pătrat.',
      parts: [
        { pts: 2, text: 'Arată că unghiul $BAD$ are măsura $45^\\circ$.', ans: 'Cu $DE\\perp AB$: $DE=4$ cm, $AE=4$ cm, deci $\\triangle AED$ e dreptunghic isoscel și $\\sphericalangle BAD=45^\\circ$' },
        { pts: 3, text: 'Demonstrează că lungimea segmentului $DN$ este mai mică de $13$ cm.', ans: 'Cu $S$ proiecția lui $D$ pe $MN$: $DS=12$ cm, $SN=4$ cm, $ND=\\sqrt{160}=4\\sqrt{10}<\\sqrt{169}=13$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, dreapta $d$ este tangentă în $A$ la cercul de centru $O$, iar $B$ și $C$ sunt două puncte situate pe dreapta $d$, astfel încât $AB=AC$, $\\sphericalangle BOC=90^\\circ$ și $BC=10$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $OB=OC$.', ans: 'Tangenta e perpendiculară pe raza $OA$; în $\\triangle OBC$, $OA$ e mediană și înălțime, deci $OB=OC$' },
        { pts: 3, text: 'Determină lungimea razei cercului.', ans: '$OA$ e mediana din unghiul drept, deci $OA=\\dfrac{BC}{2}=5$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida patrulateră $VABCD$ cu vârful $V$. Toate muchiile piramidei au lungimea de $6$ cm. Punctul $P$ se află pe muchia $VC$, astfel încât $VP=2PC$.',
      parts: [
        { pts: 2, text: 'Calculează aria laterală a piramidei.', ans: '$\\mathcal{A}_l=4\\cdot\\dfrac{36\\sqrt{3}}{4}=36\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Află tangenta unghiului format de dreptele $AD$ și $BP$.', ans: '$AD\\parallel BC$, deci unghiul este $\\sphericalangle PBC$; cu $S$ proiecția lui $P$ pe $BC$: $BS=\\dfrac{5}{6}BC=5$ cm, $PS=\\dfrac{1}{3}d(V,BC)=\\sqrt{3}$ cm, deci $\\text{tg}(\\sphericalangle PBC)=\\dfrac{\\sqrt{3}}{5}$' },
      ],
      fig: fig18,
    },
  ],
}
