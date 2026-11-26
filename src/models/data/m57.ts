// Testul 26 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 124–126; every answer here is computed and checked with the book's answers, p. 279).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)
const OPEN_BOX = "A-B-C-D A-B-B'-A' B-C-C'-B' C-D-D'-C' D-A-A'-D'"

const fig7 = plane({ A: [0, 0], B: [2, 0], C: [5, 0], D: [6.5, 0], L: [-1.5, 0], R: [8, 0] }, 160, { s: 'L-R', dot: 'A B C D', l: { L: '', R: '', A: 's', B: 's', C: 's', D: 's' } })
const fig8 = plane({ A: [0, 0], B: [-10, 0], C: [0, -7] }, 130, {
  s: 'A-B-C-A', ra: ['BAC'], ang: ['ABC', 'BCA'],
  t: [{ at: [-6.2, -1], s: 'x + 15°', size: 10, italic: true }, { at: [-2.1, -5.4], s: '2x + 15°', size: 10, italic: true }],
})
const fig9 = plane({ B: [0, 0], C: [14, 0], A: [5, 12] }, 110, { s: 'A-B-C-A' })
const fig10 = plane({ A: [0, 0], B: [9, 0], C: [9, 3 * s3], D: [0, 3 * s3] }, 130, { s: 'A-B-C-D-A A-C B-D' })
const fig11 = plane({ O: [0, 0], A: [-5, 0], B: [5, 0], C: pol(120, 5) }, 100, { s: 'A-B B-C', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: '' } })
const fig12 = solid(box(4, 4, 4), BOX, 110, { seg: "A-C C-D' D'-A" })

const fig15 = graph({ A: [2, 0], B: [0, 4], L1: [-0.5, 5], L2: [2.6, -1.2] }, 110, [-1.5, 3.5], [-1.5, 5.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'ne', B: 'e', O: 'sw' } })
const fig16 = plane({ A: [0, 0], B: [4, 0], C: [8, 0], D: [12, 0], E: [12, 4], F: [8, 4], G: [4, 4], H: [0, 4], O: [6, 3] }, 150, { s: 'A-D-E-H-A B-G C-F A-F D-G', l: { O: 's' } })
const fig17 = plane({ A: [0, 0], M: [0, 12], B: [-9, 0], C: [-16, 0], R: [3, 0] }, 130, { s: 'C-R A-M M-B M-C', ra: ['MAB'], l: { R: '' }, t: [{ at: [2.6, 0.9], s: 'd', italic: true }] })
const fig18 = solid(box(40, 40, 30), OPEN_BOX, 120)

export const M57: EnModel = {
  id: 'en-57',
  title: 'Paralela 45, Testul 26',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 124–126',
  items: [
    { text: 'Dacă $a$ și $b$ sunt numere prime, $a<b$ și $a+2b=17$, atunci valoarea lui $a$ este:', choices: ['$7$', '$5$', '$2$', '$3$'], ans: 3 },
    { text: 'La deschiderea bursei, o acțiune valora $80$ €. Pe parcursul zilei, valoarea acțiunilor a scăzut cu $15\\%$. La sfârșitul programului, prețul acțiunii este:', choices: ['$65$ €', '$68$ €', '$70$ €', '$92$ €'], ans: 1 },
    { text: 'Pe axa numerelor sunt reprezentate câteva numere întregi: $-3$, $-2$, $-1$, $0$, $1$, $2$. Numărul întreg al cărui opus nu se află în reprezentare este:', choices: ['$1$', '$0$', '$-2$', '$-3$'], ans: 3 },
    {
      text: 'Ionel a avut de transcris tabelul alăturat și de completat ultimele două coloane.\n\n| Numărul | Opusul numărului | Inversul numărului |\n|---|---|---|\n| $x=\\dfrac{7}{3}$ | $-\\dfrac{7}{3}$ | $\\dfrac{3}{7}$ |\n| $y=-\\dfrac{2}{5}$ | $\\dfrac{2}{5}$ | $-\\dfrac{5}{2}$ |\n| $z=-0{,}1(6)$ | $0{,}1(6)$ | $6$ |\n| $t=1\\dfrac{1}{4}$ | $-\\dfrac{5}{4}$ | $0{,}8$ |\n\nSingurul rezultat greșit este în dreptul numărului:',
      choices: ['$t$', '$z$', '$x$', '$y$'], ans: 1,
    },
    {
      text: 'Rezolvând inecuația $\\dfrac{x}{3}+\\dfrac{1-x}{2}<1$ în mulțimea numerelor reale, patru elevi, Cosmin, Raluca, Ioana și Matei, au obținut rezultatele înregistrate în tabelul alăturat.\n\n| Cosmin | Raluca | Ioana | Matei |\n|---|---|---|---|\n| $x\\in\\left(-\\infty,\\,\\dfrac{3}{5}\\right)$ | $x\\in(-\\infty,\\,-3)$ | $x\\in(-3,\\,\\infty)$ | $x\\in(-\\infty,\\,-3]$ |\n\nDintre cei patru elevi, cel care a rezolvat corect inecuația este:',
      choices: ['Matei', 'Cosmin', 'Ioana', 'Raluca'], ans: 2,
    },
    { text: 'Claudiu așteaptă un tren care trebuie să sosească la ora $17{:}15$. La ora $17{:}05$ aude în stație anunțul că trenul întârzie $10$ minute. Claudiu spune că mai are de așteptat $25$ de minute. Afirmația lui Claudiu este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$, $D$. Numărul segmentelor care au capetele în două dintre punctele date este:',
      choices: ['$3$', '$6$', '$10$', '$5$'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi dreptunghic $ABC$, având $\\sphericalangle A=90^\\circ$, $\\sphericalangle B=x+15^\\circ$ și $\\sphericalangle C=2x+15^\\circ$. Valoarea lui $x$ este:',
      choices: ['$20^\\circ$', '$45^\\circ$', '$15^\\circ$', '$30^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată se consideră triunghiul $ABC$, cu $AB=13$ cm, $BC=14$ cm și distanța de la $A$ la dreapta $BC$ egală cu $12$ cm. Perimetrul triunghiului $ABC$ este egal cu:',
      choices: ['$42$ cm', '$30$ cm', '$35$ cm', '$40$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat dreptunghiul $ABCD$, cu latura $AB=9$ cm, $AB>BC$. Diagonalele $AC$ și $BD$ ale dreptunghiului $ABCD$ formează un unghi de $60^\\circ$. Lungimea diagonalei $AC$ este egală cu:',
      choices: ['$3\\sqrt{3}$ cm', '$6\\sqrt{3}$ cm', '$12$ cm', '$18$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'În cercul din figura alăturată, segmentul $AB$ este un diametru, iar $C$ este un punct pe cerc, astfel încât măsura unghiului $CBA$ este egală cu $30^\\circ$. Măsura arcului mic $CB$ este:',
      choices: ['$150^\\circ$', '$180^\\circ$', '$90^\\circ$', '$120^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: "În cubul $ABCDA'B'C'D'$, din figura alăturată, se cunoaște că perimetrul triunghiului $ACD'$ este $12\\sqrt{2}$ cm. Aria totală a cubului este egală cu:",
      choices: ['$48\\text{ cm}^2$', '$64\\text{ cm}^2$', '$96\\text{ cm}^2$', '$112\\text{ cm}^2$'], ans: 2, fig: fig12,
    },

    {
      text: 'Într-un bloc sunt apartamente cu două și trei camere, în total $20$ de apartamente și $49$ de camere.',
      parts: [
        { pts: 2, text: 'Este posibil să fie în bloc $10$ apartamente cu trei camere? Justifică răspunsul.', ans: 'Nu: ar fi și $10$ apartamente cu două camere, în total $50$ de camere, nu $49$' },
        { pts: 3, text: 'Află numărul apartamentelor cu două camere.', ans: '$d+t=20$ și $2d+3t=49$, deci $d=11$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x}{x+1}-\\dfrac{x^2+1}{1+2x+x^2}\\right):\\dfrac{3x-3}{x^3+2x^2+x}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^3+2x^2+x=x(x+1)^2$, pentru orice număr real $x$.', ans: '$x^3+2x^2+x=x(x^2+2x+1)=x(x+1)^2$' },
        { pts: 3, text: 'Demonstrează că media aritmetică a numerelor $a=E(2+\\sqrt{3})$ și $b=E(4-\\sqrt{3})$ este număr natural.', ans: 'Paranteza este $\\dfrac{x(x+1)-x^2-1}{(x+1)^2}=\\dfrac{x-1}{(x+1)^2}$, deci $E(x)=\\dfrac{x}{3}$; $\\dfrac{a+b}{2}=\\dfrac{1}{2}\\cdot\\dfrac{6}{3}=1\\in\\mathbb{N}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-2x+4$.',
      parts: [
        { pts: 2, text: 'Calculează $f(\\sqrt{3})+f(-\\sqrt{3})$.', ans: '$(-2\\sqrt{3}+4)+(2\\sqrt{3}+4)=8$' },
        { pts: 3, text: 'Știind că $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, determină perimetrul triunghiului $AOB$.', ans: '$A(2,\\,0)$, $B(0,\\,4)$, $AB=2\\sqrt{5}$, deci $\\mathcal{P}_{AOB}=6+2\\sqrt{5}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată sunt reprezentate trei pătrate cu laturile egale: $ABGH$, $BCFG$ și $CDEF$. $O$ este punctul de intersecție a dreptelor $AF$ și $DG$, iar aria dreptunghiului $ADEH$ este egală cu $48\\text{ cm}^2$.',
      parts: [
        { pts: 2, text: 'Arată că $AD=12$ cm.', ans: 'Cu $AB=l$: $AD=3l$ și $3l^2=48$, deci $l=4$ cm și $AD=12$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $OF$.', ans: '$\\triangle FOG\\sim\\triangle AOD$, deci $\\dfrac{FO}{AO}=\\dfrac{FG}{AD}=\\dfrac{1}{3}$; $AF=4\\sqrt{5}$ cm și $AO=3OF$, deci $OF=\\sqrt{5}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată sunt reprezentate o dreaptă $d$ și un punct $M$, aflat la distanța de $12$ cm de dreapta $d$. Din punctul $M$ construim perpendiculara $MA$ pe dreapta $d$ și oblicele $MB$ și $MC$, astfel încât $MB=15$ cm, iar $MC=20$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $BC=7$ cm.', ans: '$AB=\\sqrt{225-144}=9$ cm, $AC=\\sqrt{400-144}=16$ cm, deci $BC=7$ cm' },
        { pts: 3, text: 'Demonstrează că sinusul unghiului $BMC$ are valoarea mai mică decât $\\dfrac{2}{7}$.', ans: 'Cu $BT\\perp MC$: $BT=\\dfrac{BC\\cdot MA}{MC}=4{,}2$ cm și $\\sin(\\sphericalangle BMT)=\\dfrac{BT}{BM}=\\dfrac{7}{25}<\\dfrac{2}{7}$ ($49<50$)' },
      ],
      fig: fig17,
    },
    {
      text: "Cristina are un acvariu din sticlă, având forma prismei patrulatere regulate $ABCDA'B'C'D'$ (fără baza superioară) din figura alăturată. Înălțimea prismei este egală cu $30$ cm, iar latura bazei este egală cu $40$ cm. Cristina toarnă în acvariu $32$ litri de apă.",
      parts: [
        { pts: 2, text: 'Determină suprafața sticlei necesare pentru fabricarea acvariului.', ans: '$\\mathcal{A}_l+\\mathcal{A}_b=4\\cdot40\\cdot30+40^2=6400\\text{ cm}^2$' },
        { pts: 3, text: 'O tijă cu lungimea de $60$ cm este scufundată în acvariu. Demonstrează că putem proceda astfel încât tija să fie complet acoperită de apă.', ans: '$32000=40\\cdot40\\cdot h$, deci apa are $20$ cm înălțime; diagonala paralelipipedului de apă este $\\sqrt{40^2+40^2+20^2}=60$ cm, deci tija încape pe ea' },
      ],
      fig: fig18,
    },
  ],
}
