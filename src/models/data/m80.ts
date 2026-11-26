// Testul 49 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 173–175; every answer here is computed and checked with the book's answers, p. 287).
import type { EnModel } from '../types'
import type { P3, Pt } from '../figure'
import { foot, mid3, plane, solid } from '../figure'
import { graph, pol, PRISM3, TETRA } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [1, 0], C: [3, 0], D: [6, 0], L: [-1, 0], R: [7, 0] }, 170, {
  s: 'L-R', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n', L: '', R: '' }, t: [{ at: [6.8, -0.5], s: 'a', italic: true }],
})
const A8: Pt = [4, 0], B8 = pol(180 - 23.5, 4, A8)
const fig8 = plane({ A: A8, B: B8, C: [B8[0], -B8[1]], L: [-0.5, 0], R: [5, 0] }, 120, {
  s: 'L-R A-B A-C', d: 'B-C', dot: 'C', ang: ['BAL'], l: { L: '', R: '', A: 'n' }, t: [{ at: [4.9, 0.15], s: 'a', italic: true }],
})
const A9: Pt = [9, 5]
const fig9 = plane({ A: A9, C: [A9[0] + 6 * Math.cos(Math.PI / 6), 2], B: [A9[0] - 10 * Math.cos(Math.PI / 6), 0], A1: [-1, 2], A2: [16, 2], B1: [-1, 0], B2: [16, 0] }, 150, {
  s: 'A1-A2 B1-B2 A-B A-C', ang: ['ACA1', 'ABB2'], l: { A1: '', A2: '', B1: '', B2: '' },
  t: [{ at: [-1.6, 1.8], s: 'a', italic: true }, { at: [-1.6, -0.2], s: 'b', italic: true }],
})
const fig10 = plane({ A: [0, 4], B: [0, 0], D: [3, 0], C: [3, -6] }, 60, { s: 'A-B-C-D-A B-D', ra: ['ABD', 'BDC'] })
const fig11 = plane({ O1: [-1, 0], O2: [1, 0], T: [0, 0], C: [-2, 0], D: [2, 0], A: pol(-120, 1, [-1, 0]), B: pol(60, 1, [1, 0]) }, 160, {
  s: 'C-D A-B', c: [{ at: 'O1', r: 1 }, { at: 'O2', r: 1 }], dot: 'O1 O2 T', l: { T: 'se', O1: 'n', O2: 'n' },
})
const y12 = 4 * s3, g12: P3 = [4, (2 * y12) / 3, 0], h12 = Math.sqrt(25 - 4 / 3)
const top = (p: P3): P3 => [g12[0] + (p[0] - g12[0]) / 2, g12[1] + (p[1] - g12[1]) / 2, h12]
const A12: P3 = [0, y12, 0], B12: P3 = [4, 0, 0], C12: P3 = [8, y12, 0]
const fig12 = solid({ A: A12, B: B12, C: C12, "A'": top(A12), "B'": top(B12), "C'": top(C12) }, PRISM3, 110)

const fig15 = graph({ A: [2, 0], B: [0, 1], L1: [-2, 2], L2: [3.6, -0.8] }, 130, [-2.5, 4], [-1.2, 2.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'n', B: 'ne' } })
const fig16 = plane({ A: [0, 0], B: [8, 0], C: [5, 4], D: [0, 4], M: [3, 0] }, 130, { s: 'A-B-C-D-A', dot: 'M', ra: ['DAB'], l: { M: 's' } })
const A17: Pt = [0, 15], B17: Pt = [-20, 0], C17: Pt = [20, 0], D17: Pt = [0, 0]
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, M: foot(D17, A17, B17), N: foot(D17, A17, C17), Q: [0, 7.5] }, 150, {
  s: 'A-B-C-A A-D', c: [{ at: 'Q', r: 7.5 }], l: { Q: '' },
})
// drawn taller than the real height 2√6/3, as in the book
const p18: Record<string, P3> = { A: [0, 0, 0], B: [4, 0, 0], C: [2, 2 * s3, 0], S: [2, (2 * s3) / 3, 3] }
const fig18 = solid({ ...p18, D: mid3(p18.S, p18.A), E: mid3(p18.B, p18.C) }, TETRA('A', 'B', 'C', 'S'), 120, { seg: 'D-E', dot: 'D E' })

export const M80: EnModel = {
  id: 'en-80',
  title: 'Paralela 45, Testul 49',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 173–175',
  items: [
    { text: 'Suma valorilor cifrei $x$ pentru care numărul $\\overline{4x1}$ se divide cu $3$ este:', choices: ['$9$', '$12$', '$15$', '$18$'], ans: 1 },
    {
      text: 'Fie $a=-0{,}08$. Patru elevi, Ionuț, Maria, Ana și Ioana, au de determinat următoarele numere:\n\nIonuț: numărul de trei ori mai mare decât $a$;\n\nMaria: numărul de $0{,}4$ ori mai mare decât $a$;\n\nAna: numărul cu $-0{,}6$ mai mic decât $a$;\n\nIoana: numărul cu $-0{,}09$ mai mare decât $a$.\n\n| Elevul | Ionuț | Maria | Ana | Ioana |\n|---|---|---|---|---|\n| Rezultatul | $-0{,}024$ | $-0{,}02$ | $0{,}52$ | $0{,}17$ |\n\nRezultatele obținute de elevi sunt trecute în tabelul alăturat. Elevul care a calculat corect este:',
      choices: ['Ionuț', 'Maria', 'Ana', 'Ioana'], ans: 2,
    },
    { text: 'Considerăm numărul $a=3\\cdot(-1)^7-2\\cdot(-1)^9$. Valoarea absolută a numărului $a$ este:', choices: ['$-1$', '$1$', '$5$', '$-5$'], ans: 1 },
    { text: 'Șase muncitori termină o lucrare în $18$ zile. Lucrarea poate fi terminată de $12$ muncitori în:', choices: ['$6$ zile', '$8$ zile', '$9$ zile', '$12$ zile'], ans: 2 },
    { text: 'Dintre numerele $-\\sqrt{3}$, $-3\\sqrt{2}$, $-3$, $-2\\sqrt{3}$, mai mare este numărul:', choices: ['$-\\sqrt{3}$', '$-2\\sqrt{3}$', '$-3$', '$-2\\sqrt{3}$'], ans: 0 },
    { text: 'În timpul vacanței un grup de copii participă la activități sportive. Încep programul la ora $9{:}00$ și alternează $40$ minute de activități, urmate apoi de o pauză de $10$ minute. Ana afirmă că la ora $11{:}40$ este pauză. Afirmația Anei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, $A$, $B$, $C$, $D$ sunt patru puncte pe dreapta $a$, astfel încât $AB=1$ cm, $AC=3$ cm, $AD=6$ cm. Considerăm propozițiile:\n\n$P_1$: $BD=4$ cm;\n\n$P_2$: $C$ este mijlocul segmentului $AD$;\n\n$P_3$: $B$ este pe segmentul $CD$;\n\n$P_4$: Lungimea segmentului $AC$ este mai mare decât lungimea segmentului $BD$.\n\nDintre cele patru propoziții, cea adevărată este:',
      choices: ['$P_1$', '$P_2$', '$P_3$', '$P_4$'], ans: 1, fig: fig7,
    },
    {
      text: "În figura alăturată, punctul $A$ este pe dreapta $a$, iar punctul $B$ este exterior dreptei $a$, astfel încât unghiul dintre $AB$ și $a$ are $23^\\circ30'$. Punctul $C$ este simetricul punctului $B$ față de dreapta $a$. Măsura unghiului $BAC$ este:",
      choices: ['$44^\\circ$', '$45^\\circ$', '$46^\\circ$', '$47^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată, dreptele $a$, $b$ sunt paralele. Dacă $AB=10$ cm, $AC=6$ cm, unghiul dintre $AB$ și $b$ are $30^\\circ$, iar unghiul dintre $AC$ și $a$ are $30^\\circ$, distanța dintre dreptele $a$ și $b$ este:',
      choices: ['$1$ cm', '$2$ cm', '$3$ cm', '$4$ cm'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este desenat un patrulater $ABCD$, în care $\\sphericalangle ABD=\\sphericalangle BDC=90^\\circ$, $AB=400$ m, $BD=300$ m și $CD=600$ m. Aria patrulaterului $ABCD$ este egală cu:',
      choices: ['$18$ ha', '$20$ ha', '$21$ ha', '$15$ ha'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, cercurile $\\mathcal{C}(O_1,\\,r_1)$ și $\\mathcal{C}(O_2,\\,r_2)$ sunt tangente în punctul $T$. O dreaptă care trece prin punctul $T$ intersectează a doua oară cercurile în punctele $A$, respectiv $B$. Punctele diametral opuse lui $T$ în cele două cercuri sunt $C$, respectiv $D$. Dacă unghiul $AO_1T$ are $120^\\circ$, atunci măsura arcului mic $BD$ este:',
      choices: ['$40^\\circ$', '$90^\\circ$', '$60^\\circ$', '$50^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentat un trunchi de piramidă triunghiulară regulată $ABCA'B'C'$, cu latura bazei mari $AB=8$ cm, latura bazei mici $A'B'=4$ cm și apotema trunchiului egală cu $5$ cm. Aria laterală a trunchiului considerat este egală cu:",
      choices: ['$30\\text{ cm}^2$', '$60\\text{ cm}^2$', '$90\\text{ cm}^2$', '$120\\text{ cm}^2$'], ans: 2, fig: fig12,
    },

    {
      text: 'La un examen $\\dfrac{1}{15}$ din numărul candidaților au fost respinși la vizita medicală. $\\dfrac{2}{7}$ din numărul candidaților rămași au fost respinși la proba scrisă. Din candidații rămași au mai fost respinși $\\dfrac{3}{4}$ la proba orală. Au fost admiși $25$ candidați.',
      parts: [
        { pts: 2, text: 'Numărul candidaților înscriși la examen poate fi $120$? Justifică răspunsul.', ans: 'Nu: ar rămâne $\\dfrac{14}{15}\\cdot120=112$, apoi $\\dfrac{5}{7}\\cdot112=80$, iar după proba orală $\\dfrac{1}{4}\\cdot80=20\\neq25$ de candidați' },
        { pts: 3, text: 'Câți candidați s-au înscris la examen?', ans: '$\\dfrac{1}{4}\\cdot\\dfrac{5}{7}\\cdot\\dfrac{14}{15}\\cdot N=\\dfrac{N}{6}=25$, deci $N=150$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left[\\left(1-\\dfrac{3x^2}{1-x^2}\\right)\\cdot\\dfrac{x-1}{2x+1}-1\\right]\\cdot\\dfrac{x^2+2x+1}{x-2}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{1}{2},\\,0,\\,1,\\,2\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=x+1$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{1}{2},\\,0,\\,1,\\,2\\right\\}$.', ans: '$\\left(\\dfrac{2x-1}{x+1}-1\\right)\\cdot\\dfrac{(x+1)^2}{x-2}=\\dfrac{x-2}{x+1}\\cdot\\dfrac{(x+1)^2}{x-2}=x+1$' },
        { pts: 3, text: 'Calculează $E(10)+E(11)+\\ldots+E(20)$.', ans: '$11+12+\\ldots+21=\\dfrac{(11+21)\\cdot11}{2}=176$' },
      ],
    },
    {
      text: 'Considerăm funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=1-0{,}5x$.',
      parts: [
        { pts: 2, text: 'Arată că numărul $a=f\\left(\\sqrt{2}-1\\right)-f\\left(\\sqrt{2}-3\\right)$ este întreg.', ans: '$a=-0{,}5\\left(\\sqrt{2}-1\\right)+0{,}5\\left(\\sqrt{2}-3\\right)=0{,}5-1{,}5=-1\\in\\mathbb{Z}$' },
        { pts: 3, text: 'Calculează aria triunghiului determinat de reprezentarea grafică a funcției $f$ și axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$.', ans: '$A(2,\\,0)$, $B(0,\\,1)$, deci aria este $\\dfrac{2\\cdot1}{2}=1$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez dreptunghic $ABCD$ având $AB=8$ m și $BC=CD=5$ m.',
      parts: [
        { pts: 2, text: 'Află aria trapezului.', ans: 'Fie $CE\\perp AB$: $EB=3$ m, $CE=4$ m, deci aria este $\\dfrac{(8+5)\\cdot4}{2}=26\\text{ m}^2$' },
        { pts: 3, text: 'Dacă $M$ este un punct pe latura $AB$, $AM=3$ m, arată că dreptele $CM$ și $BD$ sunt perpendiculare.', ans: '$MB=5$ m $=DC$ și $MB\\parallel DC$, deci $DMBC$ este paralelogram cu $BC=MB$, adică romb, iar diagonalele lui sunt perpendiculare' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este desenat triunghiul $ABC$ cu $AB=AC=25$ cm și $BC=40$ cm. Cercul de diametru $AD$, unde $D$ este proiecția punctului $A$ pe $BC$, intersectează laturile $AB$ și $AC$ în punctele $M$ și respectiv $N$.',
      parts: [
        { pts: 2, text: 'Arată că $AM=AN$.', ans: '$\\sphericalangle AMD=\\sphericalangle AND=90^\\circ$, iar triunghiurile dreptunghice $AMD$ și $AND$ sunt congruente ($AD$ comună, $\\sphericalangle MAD=\\sphericalangle NAD$), deci $AM=AN$' },
        { pts: 3, text: 'Calculează lungimea segmentului $MN$.', ans: '$AD=15$ cm, $AM=\\dfrac{AD^2}{AB}=9$ cm; $\\dfrac{AM}{AB}=\\dfrac{AN}{AC}$, deci $MN\\parallel BC$ și $\\dfrac{MN}{BC}=\\dfrac{9}{25}$, $MN=14{,}4$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată, $SABC$ este o piramidă triunghiulară regulată cu fețele laterale triunghiuri dreptunghice în $S$ și $AB=4$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $AS\\perp(SBC)$.', ans: '$AS\\perp SB$ și $AS\\perp SC$, deci $AS\\perp(SBC)$' },
        { pts: 3, text: 'Calculează lungimea segmentului $DE$, unde $D$ este mijlocul laturii $SA$, iar $E$ este mijlocul laturii $BC$.', ans: '$SA=SB=SC=2\\sqrt{2}$ cm, $SD=\\sqrt{2}$ cm, $SE=\\dfrac{BC}{2}=2$ cm; $\\triangle DSE$ e dreptunghic în $S$, deci $DE=\\sqrt{2+4}=\\sqrt{6}$ cm' },
      ],
      fig: fig18,
    },
  ],
}
