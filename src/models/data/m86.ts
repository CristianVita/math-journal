// Testul 55 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 186–188; every answer here is computed and checked with the book's answers, p. 289).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { along, plane } from '../figure'
import { graph, pol } from './shapes'

const s2 = Math.sqrt(2)

const fig7 = plane({ A: [0, 0], M: [2, 0], N: [4, 0], B: [6, 0], P: [10, 0], Q: [14, 0], C: [18, 0] }, 180, { s: 'A-C', dot: 'A M N B P Q C', l: { A: 'n', M: 'n', N: 'n', B: 'n', P: 'n', Q: 'n', C: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(175, 5), B: pol(185, 4), M: pol(265, 4), N: pol(225, 4) }, 120, { s: 'O-A O-B O-M O-N', ra: ['AOM'], l: { O: 'e' } })
const fig9 = plane({ B: [0, 0], D: [2, 0], C: [6, 0], A: [2, 2 * s2] }, 140, { s: 'A-B-C-A A-D', ra: ['BAC', 'ADC'] })
const fig10 = plane({ A: [0, 6], B: [6, 6], C: [6, 0], D: [0, 0], M: [8, 6], N: [6, 4.5] }, 120, { s: 'A-M D-M B-C-D-A', l: { N: 'e' } })
const fig11 = plane({ A: pol(180, 3), B: pol(270, 3), C: pol(0, 3), D: pol(90, 3) }, 100, { c: [{ at: [0, 0], r: 3 }], dot: 'A B C D' })
const p12 = plane({ O: [0, 0], A: [-12, 0], B: [12, 0], "O'": [0, 13], "A'": [-4, 13], "B'": [4, 13] }, 120, { s: "A-A' B-B' A'-B'", d: "O-O' A-B", dot: "O O'", l: { O: 's', "O'": 'n' } })
const fig12 = { ...p12, e: [{ at: p12.p.O, rx: p12.p.B[0] - p12.p.O[0], ry: (p12.p.B[0] - p12.p.O[0]) / 4, back: true }, { at: p12.p["O'"], rx: p12.p["B'"][0] - p12.p["O'"][0], ry: (p12.p["B'"][0] - p12.p["O'"][0]) / 4 }] }

const fig15 = graph({ A: [-4, 0], B: [0, 4], C: [2, 0], D: [0, 2], F1: [-5, -1], F2: [1.5, 5.5], G1: [-3.5, 5.5], G2: [3.5, -1.5] }, 130, [-5.5, 4], [-1.8, 6], {
  s: 'F1-F2 G1-G2', dot: 'A B C D', l: { F1: '', F2: '', G1: '', G2: '', A: 'n', B: 'e', C: 'n', D: 'ne' },
})
const fig16 = plane({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], M: [4, 1.5], N: [-1.5, 4] }, 120, { s: 'A-B-C-D-A N-D A-M A-N' })
const A17: Pt = [0, 6], B17: Pt = [-8, 0], C17: Pt = [8, 0]
const fig17 = plane({ A: A17, B: B17, C: C17, M: along(A17, B17, 0.9), N: along(A17, C17, 0.9) }, 140, { s: 'A-B-C-A M-N' })

export const M86: EnModel = {
  id: 'en-86',
  title: 'Paralela 45, Testul 55',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 186–188',
  items: [
    { text: 'Rezultatul calculului $479\\cdot478-478\\cdot477-2\\cdot476$ este:', choices: ['$0$', '$2$', '$4$', '$1642$'], ans: 2 },
    {
      text: 'În tabelul alăturat este descrisă o dependență funcțională.\n\n| $x$ | $-1$ | $2$ | $a$ |\n|---|---|---|---|\n| $y=5-7x$ | $12$ | $-9$ | $26$ |\n\nValoarea lui $a$ este:',
      choices: ['$0$', '$3$', '$-3$', '$4$'], ans: 2,
    },
    { text: 'Fie $a$, $b$ numere întregi distincte, astfel încât $a^3=-64$ și $b^2=16$. Valoarea numărului $b-a$ este:', choices: ['$0$', '$-8$', '$-1$', '$8$'], ans: 3 },
    { text: 'Dacă $x$, $y$ sunt numere reale nenule și $\\dfrac{x}{y}=0{,}6$, valoarea raportului $\\dfrac{4y-3x}{5y-4x}$ este:', choices: ['$1$', '$\\dfrac{11}{12}$', '$\\dfrac{10}{13}$', '$\\dfrac{11}{13}$'], ans: 3 },
    {
      text: 'Considerăm numărul $a=\\dfrac{3+2\\sqrt{2}}{\\sqrt{2}+1}-\\sqrt{2}$ și propozițiile:\n\n$P_1$: Numărul $a$ este irațional.\n\n$P_2$: Numărul $a$ este rațional, neîntreg.\n\n$P_3$: $a$ este număr întreg negativ.\n\n$P_4$: $a$ este număr natural.\n\nDintre aceste propoziții, cea adevărată este:',
      choices: ['$P_1$', '$P_2$', '$P_3$', '$P_4$'], ans: 3,
    },
    { text: 'Un automobil merge cu $72$ km/h. Afirmația: „Automobilul merge cu $20$ m/s.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, și $AC=18$ cm. Punctele $M$ și $N$ se află pe segmentul $AB$ astfel încât $AM=MN=NB$, iar punctele $P$ și $Q$ aparțin segmentului $BC$ astfel încât $BP=PQ=QC$. Lungimea segmentului $MQ$ este egală cu:',
      choices: ['$6$ cm', '$8$ cm', '$12$ cm', '$16$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, $AOB$ este un unghi cu măsura egală cu $10^\\circ$, $OM$ este perpendiculară pe $OA$ și $ON$ este bisectoarea unghiului $BOM$. Măsura unghiului $AON$ este egală cu:',
      choices: ['$50^\\circ$', '$80^\\circ$', '$40^\\circ$', '$20^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$ în care punctul $D$ este proiecția vârfului $A$ pe ipotenuza $BC$. Dacă $DC=2\\cdot BD$ și $AD=2\\sqrt{2}$ cm, atunci lungimea catetei $AC$ este:',
      choices: ['$2\\sqrt{3}$ cm', '$6$ cm', '$4$ cm', '$2\\sqrt{6}$ cm'], ans: 3, fig: fig9,
    },
    {
      text: 'Pătratul $ABCD$ din figura alăturată are latura de $6$ cm, punctul $M$ este situat pe semidreapta $AB$ astfel încât $AM=8$ cm, iar $\\{N\\}=BC\\cap DM$. Lungimea segmentului $BN$ este egală cu:',
      choices: ['$2$ cm', '$1{,}5$ cm', '$1$ cm', '$3$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'Punctele $A$, $B$, $C$, $D$ determină pe cercul din figura alăturată patru arce de măsuri egale. Dacă $BD=6$ cm, atunci aria cercului este:',
      choices: ['$36\\pi\\text{ cm}^2$', '$6\\pi\\text{ cm}^2$', '$9\\text{ cm}^2$', '$9\\pi\\text{ cm}^2$'], ans: 3, fig: fig11,
    },
    {
      text: 'Aerul este un amestec gazos ce conține $20\\%$ oxigen, în procente de volum. Volumul de oxigen dintr-o sală de clasă, în formă de paralelipiped dreptunghic cu dimensiunile $15$ m, $8$ m și $4$ m este:',
      choices: ['$80\\text{ m}^3$', '$96\\text{ m}^3$', '$100\\text{ m}^3$', '$106\\text{ m}^3$'], ans: 1,
    },

    {
      text: 'Media aritmetică a două numere reale $a$ și $b$ este $39$. Mărind primul număr cu $30$ și micșorând al doilea număr cu $12$, primul număr devine de trei ori mai mare decât al doilea.',
      parts: [
        { pts: 2, text: 'Arată că $a+b=78$.', ans: '$(a+b):2=39$, deci $a+b=78$' },
        { pts: 3, text: 'Determină numerele $a$ și $b$.', ans: '$a+30=3(b-12)$, deci $a=3b-66$ și $4b-66=78$: $b=36$, $a=42$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x-1}{x-2}-\\dfrac{x}{x-1}\\right):\\dfrac{x^2+2x+2}{x^2-3x+2}$, unde $x\\in\\mathbb{R}\\setminus\\{1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2-3x+2=(x-2)(x-1)$, pentru orice $x\\in\\mathbb{R}$.', ans: '$(x-2)(x-1)=x^2-x-2x+2=x^2-3x+2$' },
        { pts: 3, text: 'Determină valoarea maximă a expresiei $E(x)$, pentru orice $x\\in\\mathbb{R}\\setminus\\{1,\\,2\\}$.', ans: '$E(x)=\\dfrac{(x-1)^2-x(x-2)}{(x-2)(x-1)}\\cdot\\dfrac{(x-2)(x-1)}{x^2+2x+2}=\\dfrac{1}{(x+1)^2+1}\\leq1$, iar $E(-1)=1$: valoarea maximă este $1$' },
      ],
    },
    {
      text: 'Considerăm funcțiile $f,\\,g:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+4$, $g(x)=-x+2$. Într-un același sistem de axe ortogonale $xOy$, reprezentarea grafică a funcției $f$ intersectează axele $Ox$, respectiv $Oy$ în punctele $A$ și $B$, iar reprezentarea grafică a funcției $g$ intersectează axele $Ox$, respectiv $Oy$ în punctele $C$ și $D$.',
      parts: [
        { pts: 2, text: 'Arată că reprezentările grafice ale celor două funcții sunt perpendiculare.', ans: '$A(-4,\\,0)$, $B(0,\\,4)$, $C(2,\\,0)$, $D(0,\\,2)$: triunghiurile $AOB$ și $COD$ sunt dreptunghice isoscele, deci $\\sphericalangle BAO=\\sphericalangle DCO=45^\\circ$ și dreptele $AB$, $CD$ fac un unghi de $90^\\circ$' },
        { pts: 3, text: 'Demonstrează că $AD\\perp BC$.', ans: '$BO\\perp AC$ și $CD\\perp AB$ se intersectează în $D$, deci $D$ este ortocentrul triunghiului $ABC$ și $AD\\perp BC$' },
      ],
      fig: fig15,
    },
    {
      text: 'Fie $ABCD$ un pătrat și $M$ un punct pe latura $BC$, iar $N$ un punct pe prelungirea laturii $CD$, astfel încât $BM=DN$ (vezi figura alăturată).',
      parts: [
        { pts: 2, text: 'Arată că $AM=AN$.', ans: '$\\triangle ABM\\equiv\\triangle ADN$ (LUL: $AB=AD$, $BM=DN$, unghiurile drepte), deci $AM=AN$' },
        { pts: 3, text: 'Determină măsura unghiului $MAN$.', ans: '$\\sphericalangle MAB=\\sphericalangle NAD$, deci $\\sphericalangle MAN=\\sphericalangle NAD+\\sphericalangle DAM=\\sphericalangle BAM+\\sphericalangle DAM=\\sphericalangle DAB=90^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este isoscel, $AB=AC=10$ cm și $BC=16$ cm. Punctul $M$ este pe latura $AB$, iar punctul $N$ este pe latura $AC$, astfel încât $MN\\parallel BC$ și perimetrul triunghiului $AMN$ este egal cu perimetrul trapezului $BCNM$.',
      parts: [
        { pts: 2, text: 'Arată că $AM=9$ cm.', ans: 'Cu $AM=AN=x$: $2x+MN=2(10-x)+16+MN$, deci $4x=36$ și $x=9$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $MN$.', ans: '$\\triangle AMN\\sim\\triangle ABC$: $\\dfrac{MN}{BC}=\\dfrac{AM}{AB}$, deci $MN=\\dfrac{9\\cdot16}{10}=14{,}4$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "Un trunchi de con cu secțiunea axială $ABB'A'$ are raza bazei mari egală cu $12$ cm, raza bazei mici egală cu $3$ cm și aria laterală egală cu $225\\pi\\text{ cm}^2$ (vezi figura alăturată).",
      parts: [
        { pts: 2, text: 'Arată că generatoarea trunchiului are $15$ cm.', ans: '$\\pi g(R+r)=225\\pi$, deci $15g=225$ și $g=15$ cm' },
        { pts: 3, text: 'Calculează volumul trunchiului.', ans: '$h=\\sqrt{15^2-9^2}=12$ cm și $\\mathcal{V}=\\dfrac{\\pi h}{3}(R^2+r^2+Rr)=4\\pi(144+9+36)=756\\pi\\text{ cm}^3$' },
      ],
      fig: fig12,
    },
  ],
}
