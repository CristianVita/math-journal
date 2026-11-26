// Testul 45 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 165–167; every answer here is computed and checked with the book's answers, p. 286).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { foot, mid, plane, solid } from '../figure'
import { graph, pol, PYR4, pyr4 } from './shapes'

const fig7 = plane({ A: [0, 0], M: [1.5, 0], B: [3, 0], C: [12, 0], N: [13.5, 0], D: [15, 0] }, 170, { s: 'A-D', dot: 'A M B C N D', l: { A: 'n', M: 'n', B: 'n', C: 'n', N: 'n', D: 'n' } })
const T8 = pol(60, 6), u8: Pt = [Math.cos((-50 * Math.PI) / 180), Math.sin((-50 * Math.PI) / 180)]
const fig8 = plane({
  L: [0, 0], T: T8, R: [T8[0] + (u8[0] * 1.6) / 0.766, 3.6], Q: [T8[0] + (u8[0] * 5.2) / 0.766, 0], A1: [-1.5, 3.6], A2: [8.5, 3.6], B1: [-1.5, 0], B2: [8.5, 0],
}, 140, {
  s: 'A1-A2 B1-B2 L-T-Q', ang: ['TLB2', 'LTQ', 'A2RQ'],
  l: { L: '', T: '', R: '', Q: '', A1: '', A2: '', B1: '', B2: '' },
  t: [{ at: [3, 5.9], s: 'x', italic: true, anchor: 'middle' }, { at: [8.3, 3.9], s: 'a', italic: true }, { at: [8.3, 0.3], s: 'b', italic: true }],
})
const A9: Pt = [0, 0], B9: Pt = [6, 0], C9: Pt = [3, 1.6], D9: Pt = [1, 1.6]
const fig9 = plane({ A: A9, B: B9, C: C9, D: D9, M: mid(A9, D9), N: mid(C9, B9) }, 140, { s: 'A-B-C-D-A M-N' })
const fig10 = plane({ B: [0, 0], C: [5, 0], A: [1.2, 2.4], M: [1.5, 0], N: [3.5, 0] }, 130, { s: 'A-B-C-A A-M A-N' })
const fig11 = plane({ O: [0, 0], A: [-1, 0], B: [1, 0], C: pol(120) }, 100, { s: 'A-B-C-A', c: [{ at: 'O', r: 1 }], dot: 'O', l: { O: 's' } })
const f12 = plane({ O: [0, 0], A: [5, 0], B: [-5, 0], "O'": [0, 4], "A'": [1, 4], "B'": [-1, 4] }, 100, { s: "A-A' B-B' O'-A'", d: "O-O' O-A", dot: "O O'", l: { B: '', "B'": '', O: 's' } })
const r12 = f12.p.A[0] - f12.p.O[0], q12 = f12.p["A'"][0] - f12.p["O'"][0]
const fig12 = { ...f12, e: [{ at: f12.p.O, rx: r12, ry: r12 / 4, back: true }, { at: f12.p["O'"], rx: q12, ry: q12 / 4 }] }

const fig15 = graph({ M: [-1, 5], L1: [-1.75, 6.5], L2: [2.5, -2] }, 110, [-2.5, 3.5], [-2.5, 7], { s: 'L1-L2', dot: 'M', l: { L1: '', L2: '', M: 'ne' } })
const A16 = pol(70, (7 * Math.sin((50 * Math.PI) / 180)) / Math.sin((60 * Math.PI) / 180)), B16: Pt = [0, 0], C16: Pt = [7, 0]
const fig16 = plane({ A: A16, B: B16, C: C16, M: foot(B16, A16, C16), N: foot(C16, A16, B16), P: mid(B16, C16) }, 150, { s: 'A-B-C-A B-M C-N', d: 'M-P-N', dot: 'P', ra: ['BMC', 'CNB'] })
const fig17 = plane({ O: [0, 0], A: [0, 25], B: [-24, 7], C: [24, 7], M: [0, -25] }, 110, { s: 'A-B-C-A A-M C-M', c: [{ at: 'O', r: 25 }], dot: 'O', l: { O: 'e' } })
// drawn taller than the real height 5, as in the book
const fig18 = solid(pyr4(24, 18), PYR4, 130, { seg: 'V-O', dot: 'O' })

export const M76: EnModel = {
  id: 'en-76',
  title: 'Paralela 45, Testul 45',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 165–167',
  items: [
    { text: 'Cel mai mic multiplu comun al numerelor $18$ și $24$ este:', choices: ['$54$', '$72$', '$48$', '$144$'], ans: 1 },
    {
      text: 'Patru elevi, Ionuț, Ana, Maria și Andrei, au de calculat valoarea numărului $n=2ab-3ac-7a$, unde $a=-3$ și $2b-3c=5$. Ei obțin rezultatele:\n\n| Elevul | Ionuț | Ana | Maria | Andrei |\n|---|---|---|---|---|\n| Rezultatul | $-6$ | $-12$ | $6$ | $18$ |\n\nRăspunsul corect este cel obținut de:',
      choices: ['Ionuț', 'Ana', 'Maria', 'Andrei'], ans: 2,
    },
    { text: 'Într-o clasă sunt $15$ băieți, iar $40\\%$ din numărul elevilor sunt fete. Numărul elevilor din clasă este:', choices: ['$20$', '$24$', '$25$', '$30$'], ans: 2 },
    { text: 'Considerăm numărul $a=-0{,}8(3)$. Suma dintre inversul numărului $a$ și opusul acestuia este:', choices: ['$-\\dfrac{11}{30}$', '$\\dfrac{11}{30}$', '$-\\dfrac{61}{30}$', '$\\dfrac{61}{30}$'], ans: 0 },
    {
      text: 'Considerăm rezolvările:\n\nA. $\\sqrt{13^2-5^2}=\\sqrt{169-25}=\\sqrt{144}=12$;\n\nB. $\\sqrt{13^2-5^2}=\\sqrt{13\\cdot2-5\\cdot2}=\\sqrt{26-10}=\\sqrt{16}=4$;\n\nC. $\\sqrt{13^2-5^2}=\\sqrt{(13-5)^2}=\\sqrt{8^2}=8$;\n\nD. $\\sqrt{13^2-5^2}=\\sqrt{13^2}-\\sqrt{5^2}=13-5=8$.\n\nDintre rezolvările prezentate, rezolvarea corectă este:',
      choices: ['A', 'B', 'C', 'D'], ans: 0,
    },
    { text: 'Afirmația „Orice număr prim de două cifre are cifrele distincte.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine, astfel încât $AC=BD$ și $AC=12$ cm. Dacă punctele $M$ și $N$ sunt mijloacele segmentelor $AB$, respectiv $CD$, atunci lungimea segmentului $MN$ este egală cu:',
      choices: ['$8$ cm', '$10$ cm', '$12$ cm', '$16$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată dreptele $a$ și $b$ sunt paralele; unghiul marcat de pe dreapta $b$ are $60^\\circ$, iar cel de pe dreapta $a$ are $50^\\circ$. Folosind datele din figură, $x$ este egal cu:',
      choices: ['$40^\\circ$', '$50^\\circ$', '$60^\\circ$', '$70^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este ilustrată schița unui parc $ABCD$ în formă de trapez, $AB\\parallel CD$, $AB=600$ m, $CD=200$ m. Se construiește o alee $MN$, unde $M$ este mijlocul laturii $AD$, iar $N$ este mijlocul laturii $CB$. Lungimea aleii este:',
      choices: ['$300$ m', '$400$ m', '$450$ m', '$500$ m'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$ cu aria de $600\\text{ m}^2$, $BC=500$ m, iar $M$ și $N$ sunt două puncte pe $BC$ astfel încât $MN=200$ m. Aria triunghiului $AMN$ este:',
      choices: ['$200\\text{ m}^2$', '$210\\text{ m}^2$', '$220\\text{ m}^2$', '$240\\text{ m}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ este un diametru al unui cerc $\\mathcal{C}(O,\\,R)$, iar $C$ este un punct pe cerc, astfel încât $AC=R$. Măsura unghiului $ABC$ este:',
      choices: ['$20^\\circ$', '$60^\\circ$', '$45^\\circ$', '$30^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentat un trunchi de con circular drept, cu înălțimea $OO'=3$ cm, raza bazei mari $OA=5$ cm și raza bazei mici $O'A'=1$ cm. Generatoarea trunchiului are lungimea egală cu:",
      choices: ['$2$ cm', '$3$ cm', '$4$ cm', '$5$ cm'], ans: 3, fig: fig12,
    },

    {
      text: 'Într-o clasă, numărul elevilor absenți este $\\dfrac{1}{8}$ din numărul celor prezenți. Dacă din clasă pleacă doi elevi, numărul elevilor absenți devine $\\dfrac{1}{5}$ din numărul celor prezenți.',
      parts: [
        { pts: 2, text: 'Stabilește dacă în clasă pot fi prezenți $24$ de elevi.', ans: 'Nu: ar fi $3$ absenți, iar după plecarea a doi elevi $5$ absenți și $22$ prezenți, dar $5\\neq\\dfrac{22}{5}$' },
        { pts: 3, text: 'Care este numărul total al elevilor clasei?', ans: '$a=\\dfrac{p}{8}$ și $a+2=\\dfrac{p-2}{5}$, deci $p=32$, $a=4$: $36$ de elevi' },
      ],
    },
    {
      text: 'Considerăm expresia $E(x)=1-\\dfrac{8}{x^2-4}\\cdot\\left[\\left(\\dfrac{x^2+4}{4x}-1\\right):\\left(\\dfrac{1}{2}-\\dfrac{1}{x}\\right)\\right]$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x-2}{x+2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.', ans: '$E(x)=1-\\dfrac{8}{(x-2)(x+2)}\\cdot\\dfrac{(x-2)^2}{4x}\\cdot\\dfrac{2x}{x-2}=1-\\dfrac{4}{x+2}=\\dfrac{x-2}{x+2}$' },
        { pts: 3, text: 'Arată că $E(-x)=\\dfrac{1}{E(x)}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.', ans: '$E(-x)=\\dfrac{-x-2}{-x+2}=\\dfrac{x+2}{x-2}=\\dfrac{1}{E(x)}$' },
      ],
    },
    {
      text: 'Considerăm funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3-2x$.',
      parts: [
        { pts: 2, text: 'Calculează media geometrică a numerelor $a=f\\left(\\sqrt{2}\\right)$ și $b=f\\left(-\\sqrt{2}\\right)$.', ans: '$a\\cdot b=\\left(3-2\\sqrt{2}\\right)\\left(3+2\\sqrt{2}\\right)=1$, deci media geometrică este $1$' },
        { pts: 3, text: 'Determină coordonatele punctului $M$, situat pe reprezentarea grafică a funcției $f$ în sistemul de axe ortogonale $xOy$, care are ordonata cu $6$ mai mare decât abscisa.', ans: '$y=3-2x$ și $y=x+6$, deci $x=-1$: $M(-1,\\,5)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În triunghiul $ABC$ din figura alăturată, măsura unghiului $A$ este de $60^\\circ$, $P$ este mijlocul laturii $BC$, iar $BM$ și $CN$ sunt înălțimile din $B$, respectiv $C$, unde $M\\in AC$ și $N\\in AB$.',
      parts: [
        { pts: 2, text: 'Arată că $PM=PN$.', ans: '$MP$ și $NP$ sunt mediane în triunghiurile dreptunghice $BMC$, respectiv $CNB$, deci $MP=NP=\\dfrac{BC}{2}$' },
        { pts: 3, text: 'Arată că triunghiul $MNP$ este echilateral.', ans: '$\\sphericalangle MPN=180^\\circ-\\left[(180^\\circ-2\\sphericalangle C)+(180^\\circ-2\\sphericalangle B)\\right]=2\\cdot120^\\circ-180^\\circ=60^\\circ$, iar $PM=PN$, deci $\\triangle PMN$ este echilateral' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este înscris în cercul $\\mathcal{C}(O,\\,R)$, $AB=AC=30$ cm și $BC=48$ cm. Dreapta $AO$ intersectează cercul $\\mathcal{C}(O,\\,R)$ în punctul $M$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $ACM$ este dreptunghic.', ans: '$AM$ este diametru, deci $\\sphericalangle ACM=90^\\circ$' },
        { pts: 3, text: 'Calculează lungimea razei cercului circumscris triunghiului $ABC$.', ans: 'Fie $\\{D\\}=AM\\cap BC$: $D$ este mijlocul lui $BC$, $AD=\\sqrt{900-576}=18$ cm; în $\\triangle ACM$: $AC^2=AD\\cdot AM$, deci $AM=50$ cm și $R=25$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'Acoperișul unei case, reprezentat în figura alăturată, are forma unei piramide patrulatere regulate $VABCD$ cu latura bazei $AB=24$ m și înălțimea $VO=5$ m.',
      parts: [
        { pts: 2, text: 'Arată că apotema piramidei are lungimea egală cu $13$ m.', ans: 'Fie $M$ mijlocul laturii $BC$: $OM=12$ m, deci $VM=\\sqrt{25+144}=13$ m' },
        { pts: 3, text: 'Întărim cu tablă toate cele opt muchii ale acoperișului. Arată că lungimea totală a întăriturilor este mai mică de $167$ m.', ans: '$VB=\\sqrt{169+144}=\\sqrt{313}$ m, deci lungimea este $4\\left(\\sqrt{313}+24\\right)$ m; $\\sqrt{313}<17{,}75$, deci lungimea $<4\\cdot41{,}75=167$ m' },
      ],
      fig: fig18,
    },
  ],
}
