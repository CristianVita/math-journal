// Testul 84 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 249–251; every answer here is computed and checked with the book's answers, pp. 299–300).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, pol, PYR4, pyr4 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [3, 0], M: [6, 0], C: [9, 0], D: [12, 0] }, 170, { s: 'A-D', dot: 'A B M C D', l: { A: 'n', B: 'n', M: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: [4, 0], B: pol(72, 4), C: pol(90, 4) }, 100, { s: 'O-A O-B O-C', ra: ['AOC'] })
const fig9 = plane({ A: [0, 0], B: [10, 0], C: [10, 5], D: [0, 5], M: [3.5, 5] }, 130, { s: 'A-B-C-D-A A-M-B' })
const fig10 = plane({ A: [3, 5], B: [0, 0], C: [8, 0], M: [2.625, 4.375], N: [3.625, 4.375] }, 120, { s: 'A-B-C-A M-N', l: { M: 'w', N: 'e' } })
const fig11 = plane({ O: [0, 0], A: [-4, 0], B: [4, 0], C: pol(150, 4), D: pol(30, 4) }, 110, { s: 'A-B C-D O-C O-D-B', c: [{ at: 'O', r: 4 }], dot: 'O', l: { O: 's' } })
const fig12 = solid({ ...box(6, 6, 6), M: [4, 2, 2] }, BOX, 110, { seg: "D'-B A-M", l: { M: 'e' } })

const fig16 = plane({ A: [0, 0], C: [2, 0], B: [6, 0], M: [1, s3], N: [4, 2 * s3] }, 140, { s: 'A-B A-M-C-N-B M-N' })
// the circles of radii 4 and 9, tangent in C; AB their common tangent
const n17: Pt = [-5 / 13, 12 / 13]
const fig17 = plane({ O1: [0, 0], O2: [13, 0], C: [4, 0], A: [4 * n17[0], 4 * n17[1]], B: [13 + 9 * n17[0], 9 * n17[1]] }, 160, {
  s: 'O1-O2 O1-A-B-O2 A-C-B', c: [{ at: 'O1', r: 4 }, { at: 'O2', r: 9 }], dot: 'O1 O2', ra: ['O1AB', 'ABO2'], l: { O1: 'w', O2: 'e', C: 's' },
})
const fig18 = solid(pyr4(6, 3), PYR4, 120, { seg: 'V-O A-C B-D', l: { O: 's' } })

export const M115: EnModel = {
  id: 'en-115',
  title: 'Paralela 45, Testul 84',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 249–251',
  items: [
    {
      text: 'Rezultatul calculului $\\dfrac{-3^2}{(-2)^4}:\\left(\\dfrac{1}{5}-0{,}5\\right)$ este:',
      choices: ['$-\\dfrac{15}{8}$', '$1{,}875$', '$\\dfrac{27}{160}$', '$1{,}85$'], ans: 1,
    },
    {
      text: 'Dacă $x$, $y$ sunt numere reale, astfel încât $\\dfrac{2x-1}{3}=\\dfrac{3y+1}{2}$, valoarea numărului $27y-12x+5$ este:',
      choices: ['$-10$', '$20$', '$10$', '$-20$'], ans: 0,
    },
    {
      text: 'Andrei, Matei și Vlad pot săpa un șanț în $4$ ore, $6$ ore, respectiv $12$ ore. Lucrând împreună, cei trei muncitori pot săpa șanțul în:',
      choices: ['$2$ ore', '$3$ ore', '$4$ ore', 'o oră'], ans: 0,
    },
    { text: 'Considerăm mulțimile $A=\\{1,\\,2\\}$ și $B=\\{2,\\,3,\\,4\\}$. Numărul elementelor mulțimii $A\\times B$ este egal cu:', choices: ['$2$', '$3$', '$5$', '$6$'], ans: 3 },
    {
      text: 'Mulțimea soluțiilor reale ale inecuației $3-2x>1$ este:',
      choices: ['$(-\\infty,\\,1]$', '$[1,\\,\\infty)$', '$(-\\infty,\\,1)$', '$(1,\\,\\infty)$'], ans: 2,
    },
    {
      text: 'Propoziția: „Dintre numerele $60$ și $147$ mai mulți divizori primi are numărul $147$.” este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine, astfel încât $AC=BD$. Punctul $M$ este mijlocul segmentului $BC$, punctul $B$ este mijlocul segmentului $AM$ și $BD=9$ cm. Lungimea segmentului $AD$ este egală cu:',
      choices: ['$3$ cm', '$10$ cm', '$6$ cm', '$12$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiurile $AOB$ și $BOC$ sunt adiacente și complementare, $\\sphericalangle AOB=72^\\circ$. Măsura unghiului format de semidreapta $OA$ și bisectoarea unghiului $BOC$ este:',
      choices: ['$79^\\circ$', '$80^\\circ$', '$81^\\circ$', '$82^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABCD$ este dreptunghi, $AB=10$ cm, $BC=5$ cm, iar $M$ este un punct pe $CD$. Aria triunghiului $ABM$ este egală cu:',
      choices: ['$25\\text{ cm}^2$', '$50\\text{ cm}^2$', '$25$ cm', '$\\left(10+\\sqrt{29}+\\sqrt{34}\\right)\\text{ cm}^2$'], ans: 0, fig: fig9,
    },
    {
      text: 'În triunghiul $ABC$ considerăm punctele $M\\in(AB)$ și $N\\in(AC)$, astfel încât $\\dfrac{AM}{AB}=\\dfrac{1}{8}$, iar $\\dfrac{AN}{NC}=\\dfrac{1}{7}$. Dacă $BC=16$ cm, lungimea segmentului $MN$ este egală cu:',
      choices: ['$1$ cm', '$2$ cm', '$4$ cm', '$8$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat cercul cu centrul în $O$. Punctele $A$, $B$, $C$ și $D$ aparțin cercului astfel încât măsura unghiului $COD$ este egală cu $120^\\circ$, iar dreptele $AB$ și $CD$ sunt paralele. Măsura unghiului $ODB$ este egală cu:',
      choices: ['$75^\\circ$', '$60^\\circ$', '$30^\\circ$', '$40^\\circ$'], ans: 0, fig: fig11,
    },
    {
      text: "Considerăm un cub $ABCDA'B'C'D'$ și $M$ proiecția punctului $A$ pe dreapta $D'B$. Valoarea raportului $\\dfrac{D'M}{MB}$ este egală cu:",
      choices: ['$2$', '$\\sqrt{2}$', '$\\dfrac{1}{2}$', '$\\sqrt{3}$'], ans: 0, fig: fig12,
    },

    {
      text: 'Maria are $80$ de bile albe sau roșii. Dorind să aibă numai bile albe, ea face schimb cu prietena sa, Ana, care oferă $3$ bile albe pentru $7$ bile roșii. După schimb, Maria are $56$ de bile, toate albe.',
      parts: [
        { pts: 2, text: 'Poate avea Maria $24$ de bile albe inițial?', ans: 'Nu: ar avea $56$ de bile roșii, pe care le schimbă în $8$ grupe, primind $24$ de bile albe; ar avea $48$ de bile albe, nu $56$' },
        { pts: 3, text: 'Câte bile albe a avut Maria la început?', ans: 'Cu $a$ bile albe și $n$ schimburi: $a+7n=80$ și $a+3n=56$, deci $n=6$ și $a=38$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{(x+1)^2-x^2-5}{x^3+3x^2+2x}:\\left(\\dfrac{3}{x^2+x}-\\dfrac{2}{x^2}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,0,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{2x}{x+2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,0,\\,2\\}$.', ans: '$\\dfrac{2(x-2)}{x(x+1)(x+2)}:\\dfrac{x-2}{x^2(x+1)}=\\dfrac{2(x-2)}{x(x+1)(x+2)}\\cdot\\dfrac{x^2(x+1)}{x-2}=\\dfrac{2x}{x+2}$' },
        { pts: 3, text: 'Stabilește dacă există numere întregi $n$ pentru care $E(n)<0$.', ans: '$\\dfrac{2n}{n+2}<0\\iff n\\in(-2,\\,0)$, adică $n=-1$, care este exclus; nu există' },
      ],
    },
    {
      text: 'Considerăm funcția $f:\\mathbb{R}\\to\\mathbb{R}$ care verifică condiția: $f(1-x)=3x-1$, pentru orice $x\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Arată că $f(-1)=5$.', ans: 'Pentru $x=2$: $f(-1)=3\\cdot2-1=5$' },
        { pts: 3, text: 'Determină coordonatele punctului situat pe reprezentarea grafică a funcției $f$, în sistemul de axe ortogonale $xOy$, care are coordonatele egale.', ans: 'Înlocuind pe $x$ cu $1-x$: $f(x)=3(1-x)-1=2-3x$; $f(a)=a$ dă $a=\\dfrac{1}{2}$: punctul $A\\left(\\dfrac{1}{2},\\,\\dfrac{1}{2}\\right)$' },
      ],
    },
    {
      text: 'Pe segmentul $AB$ cu lungimea de $6$ cm considerăm punctul $C$ astfel încât $AC=2$ cm. De aceeași parte a dreptei $AB$ construim triunghiurile echilaterale $MAC$ și $NCB$.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $MCN$.', ans: '$\\sphericalangle MCN=60^\\circ$, $MC=2$ cm, $CN=4$ cm, deci $\\triangle MCN$ este dreptunghic în $M$, cu $MN=2\\sqrt{3}$ cm și $\\mathcal{A}_{MCN}=2\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Dacă $P$ este mijlocul segmentului $MN$, arată că dreptele $AM$, $BN$ și $CP$ sunt concurente.', ans: 'Fie $\\{Q\\}=AM\\cap BN$: $QM\\parallel CN$ și $QN\\parallel CM$, deci $QMCN$ este paralelogram, iar diagonala $QC$ trece prin mijlocul $P$ al diagonalei $MN$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată cercurile $\\mathcal{C}(O_1,\\,r_1)$ și $\\mathcal{C}(O_2,\\,r_2)$ sunt tangente exterior în punctul $C$, $r_1=4$ cm și $r_2=9$ cm. Dreapta $AB$ este tangentă cercului $\\mathcal{C}(O_1,\\,r_1)$ în $A$ și cercului $\\mathcal{C}(O_2,\\,r_2)$ în $B$.',
      parts: [
        { pts: 2, text: 'Arată că $AB=12$ cm.', ans: '$AO_1O_2B$ este trapez dreptunghic; dacă $O_1T\\perp O_2B$, $O_1O_2=13$ cm, $O_2T=9-4=5$ cm, deci $AB=O_1T=\\sqrt{169-25}=12$ cm' },
        { pts: 3, text: 'Demonstrează că $AC\\perp BC$.', ans: 'Tangenta comună în $C$ taie $AB$ în $T$; tangentele din $T$ sunt egale, $TA=TC=TB$, deci $CT$ este mediană egală cu jumătate din $AB$ și $\\sphericalangle ACB=90^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă patrulateră regulată $VABCD$, de înălțime $VO$. Se știe că $VB=3\\sqrt{3}$ cm și $VO=3$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $AB=6$ cm.', ans: '$OB=\\sqrt{27-9}=3\\sqrt{2}$ cm, $BD=6\\sqrt{2}$ cm, iar $BD=AB\\sqrt{2}$, deci $AB=6$ cm' },
        { pts: 3, text: 'Calculează distanța de la vârful $A$ la planul $(VBC)$.', ans: '$\\mathcal{V}_{VABC}=\\dfrac{18\\cdot3}{3}=18\\text{ cm}^3$, apotema este $3\\sqrt{2}$ cm, $\\mathcal{A}_{VBC}=9\\sqrt{2}\\text{ cm}^2$, deci $d(A,(VBC))=\\dfrac{3\\cdot18}{9\\sqrt{2}}=3\\sqrt{2}$ cm' },
      ],
      fig: fig18,
    },
  ],
}
