// Testul 83 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 247–249; every answer here is computed and checked with the book's answers, p. 299).
import type { Fig, P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, mid, plane, solid } from '../figure'
import { pol, tetra, TETRA } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], E: [1, 0], D: [2, 0], C: [4, 0], B: [8, 0] }, 170, { s: 'A-B', dot: 'A E D C B', l: { A: 'n', E: 'n', D: 'n', C: 'n', B: 'n' } })
// ∡A = 20°, AB = AC; D on AC with BD = BC
const A8: Pt = [0, 0], B8 = pol(-100, 10), C8 = pol(-80, 10)
const fig8 = plane({ A: A8, B: B8, C: C8, D: meet(B8, [B8[0] + Math.cos((20 * Math.PI) / 180), B8[1] + Math.sin((20 * Math.PI) / 180)], A8, C8) }, 90, { s: 'A-B-C-A B-D' })
const fig9 = plane({ A: [0, 4], B: [-4, 0], C: [3, 0], D: [0, 0] }, 130, { s: 'A-B-C-A A-D', ra: ['ADC'] })
const fig10 = plane({ A: [0, 2], B: [4, 0], C: [0, -2], D: [-4, 0], O: [0, 0], M: [-2, 0], N: [0, 1] }, 150, { s: 'A-B-C-D-A A-C B-D M-N', l: { O: 'se', M: 'n', N: 'w' } })
const fig11 = plane({ O: [0, 8], A: [0, 0], B: [8, 0], M: [4 * Math.SQRT2, 8 - 4 * Math.SQRT2] }, 100, { s: 'O-A-B-O', c: [{ at: 'O', r: 8 }], ra: ['OAB'], dot: 'O' })
const fig12: Fig = {
  w: 110, h: 140,
  p: { D: [10, 15], C: [100, 15], A: [10, 125], B: [100, 125] },
  l: { D: 'w', C: 'e', A: 'w', B: 'e' },
  s: 'A-D B-C', d: 'A-B',
  e: [{ at: [55, 15], rx: 45, ry: 10 }, { at: [55, 125], rx: 45, ry: 10, back: true }],
}

const fig16 = plane({ A: [0, 4], B: [4, 4], C: [4, 0], D: [0, 0], M: [8, 8] }, 110, { s: 'A-B-C-D-A D-M A-M' })
const C17: Pt = [0, 0], B17: Pt = [6, 0], A17: Pt = [3, 3 * s3], M17 = mid(A17, C17)
const perp: Pt = [A17[0] - 3 * s3, A17[1] - 3]
const bis = pol(165, 1, B17)
const fig17 = plane({ A: A17, B: B17, C: C17, M: M17, D: meet(A17, perp, B17, M17), E: meet(A17, perp, B17, bis) }, 140, {
  s: 'A-B-C-A A-E B-D B-E C-E', l: { M: 'ne' },
})
const t18 = tetra(12, ['B', 'C', 'D', 'A'])
const O18 = [0, 1, 2].map((k) => (t18.B[k] + t18.C[k] + t18.D[k]) / 3) as P3
const half = (p: P3, q: P3) => [0, 1, 2].map((k) => (p[k] + q[k]) / 2) as P3
const fig18 = solid({ ...t18, O: O18, M: half(t18.C, t18.D), P: half(t18.A, t18.D) }, TETRA('B', 'C', 'D', 'A'), 130, { seg: 'A-O O-P B-M A-M', l: { O: 's', M: 'se', P: 'e' } })

export const M114: EnModel = {
  id: 'en-114',
  title: 'Paralela 45, Testul 83',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 247–249',
  items: [
    { text: 'Rezultatul calculului $2^4:8\\cdot2-0{,}5\\cdot10$ este:', choices: ['$-4$', '$0$', '$35$', '$-1$'], ans: 3 },
    { text: 'Numărul valorilor naturale ale lui $x$ pentru care $2$, $4$, $6$ și $x$ pot forma o proporție este:', choices: ['$12$', '$3$', '$2$', '$1$'], ans: 2 },
    { text: 'Reuniunea mulțimilor $A=\\{-2,\\,-1,\\,1,\\,4\\}$ și $B=\\{-1,\\,0,\\,1,\\,2\\}$ are cardinalul egal cu:', choices: ['$1$', '$7$', '$8$', '$6$'], ans: 3 },
    {
      text: 'Dintre numerele $-\\sqrt{2}$, $-1$, $0$ și $1{,}(6)$, cel care aparține intervalului $I=\\left(-\\dfrac{3}{4};\\,1\\dfrac{1}{2}\\right)$ este:',
      choices: ['$-\\sqrt{2}$', '$1{,}(6)$', '$0$', '$-1$'], ans: 2,
    },
    {
      text: 'Beatrice, Corina, Daniel și Eugen au avut de efectuat calculul $\\left(\\dfrac{\\sqrt{18}}{11}\\right)^{-1}:\\left(\\dfrac{1}{\\sqrt{2}}+\\dfrac{3}{\\sqrt{8}}-\\dfrac{2}{\\sqrt{18}}\\right)$. Rezultatele obținute sunt trecute în tabelul de mai jos.\n\n| Beatrice | Corina | Daniel | Eugen |\n|---|---|---|---|\n| $\\dfrac{1}{2}$ | $-\\dfrac{1}{2}$ | $3\\sqrt{2}$ | $2$ |\n\nCel care a obținut rezultatul corect este:',
      choices: ['Corina', 'Daniel', 'Beatrice', 'Eugen'], ans: 3,
    },
    {
      text: 'Daniel afirmă că „există cinci numere prime mai mici decât $10$”. Afirmația lui Daniel este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $E$, $D$, $C$ și $B$, în această ordine, astfel încât $AB=2AC=4AD=8AE$. Valoarea raportului $\\dfrac{EC}{AB}$ este:',
      choices: ['$\\dfrac{3}{8}$', '$\\dfrac{1}{2}$', '$\\dfrac{8}{3}$', '$\\dfrac{5}{6}$'], ans: 0, fig: fig7,
    },
    {
      text: 'Fie $ABC$ un triunghi isoscel cu baza $BC$, punctul $D\\in AC$, cu $BD=BC$ și $\\sphericalangle ADB=100^\\circ$, ca în figura alăturată. Măsura unghiului $BAC$ este egală cu:',
      choices: ['$40^\\circ$', '$80^\\circ$', '$60^\\circ$', '$20^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi ascuțitunghic, având $\\sphericalangle B=45^\\circ$, $AC=5$ cm, $AD\\perp BC$, $D\\in BC$ și $DC=3$ cm. Lungimea laturii $BC$ este egală cu:',
      choices: ['$4$ cm', '$4\\sqrt{2}$ cm', '$7$ cm', '$6$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un romb în care $AC\\cap BD=\\{O\\}$, iar $M$ și $N$ sunt mijloacele laturilor $DO$, respectiv $AO$. Dacă $MN=2$ cm, atunci perimetrul rombului $ABCD$ este:',
      choices: ['$8$ cm', '$12$ cm', '$20$ cm', '$16$ cm'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, $BA$ este tangentă cercului de centru $O$ în punctul $A$, $OA=AB$ și $OB$ intersectează cercul în punctul $M$. Dacă raza cercului este egală cu $8$ cm, atunci lungimea arcului $AM$ este egală cu:',
      choices: ['$2\\pi$ cm', '$4\\pi$ cm', '$8\\pi$ cm', '$2$ cm'], ans: 0, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentat un cilindru circular drept, având aria bazei egală cu $16\\pi\\text{ cm}^2$ și perimetrul secțiunii axiale egal cu $28$ cm. Volumul cilindrului este:',
      choices: ['$24\\pi\\text{ cm}^3$', '$96\\pi\\text{ cm}^3$', '$45\\pi\\text{ cm}^3$', '$216\\pi\\text{ cm}^3$'], ans: 1, fig: fig12,
    },

    {
      text: 'Prețul unui obiect a fost majorat cu $10\\%$ și, ulterior, noul preț a fost redus cu $10\\%$.',
      parts: [
        { pts: 2, text: 'Justifică dacă prețul final al produsului coincide cu prețul inițial al acestuia.', ans: 'Nu: prețul final este $\\dfrac{90}{100}\\cdot\\dfrac{110}{100}\\cdot p=\\dfrac{99p}{100}\\neq p$' },
        { pts: 3, text: 'Dacă reducerea a fost de $22$ de lei, determină prețul inițial al produsului.', ans: '$\\dfrac{10}{100}\\cdot\\dfrac{11p}{10}=22$, deci $p=200$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x^2}{2x-1}-\\left(x^{-1}-\\dfrac{2}{x^2+x}\\right):\\left(\\dfrac{x-1}{x^2-2x}-\\dfrac{1}{x+1}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,0,\\,\\dfrac{1}{2},\\,2\\right\\}$.',
      parts: [
        { pts: 2, text: 'Verifică dacă $E(x)=\\dfrac{3x-2}{2x-1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,0,\\,\\dfrac{1}{2},\\,2\\right\\}$.', ans: 'Câtul este $\\dfrac{x-1}{x(x+1)}\\cdot\\dfrac{x(x-2)(x+1)}{2x-1}=\\dfrac{x^2-3x+2}{2x-1}$, deci $E(x)=\\dfrac{x^2-x^2+3x-2}{2x-1}=\\dfrac{3x-2}{2x-1}$' },
        { pts: 3, text: 'Demonstrează că $E(n)$ este fracție ireductibilă, pentru orice $n\\in\\mathbb{N}$, $n\\ge3$.', ans: 'Dacă $d\\mid3n-2$ și $d\\mid2n-1$, atunci $d\\mid2(3n-2)-3(2n-1)=-1$, deci $d=1$' },
      ],
    },
    {
      text: 'Fie $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-1$.',
      parts: [
        { pts: 2, text: 'Determină punctele situate pe reprezentarea grafică a funcției $f$, în sistemul de axe ortogonale $xOy$, care au suma coordonatelor egală cu $11$.', ans: '$x+2x-1=11$, deci $x=4$: punctul $M(4,\\,7)$' },
        { pts: 3, text: 'Găsește numerele întregi $m$ care verifică $f(m)\\cdot f(-m)=f(-1)$.', ans: '$(2m-1)(-2m-1)=-3$, adică $4m^2-1=3$, deci $m\\in\\{-1,\\,1\\}$' },
      ],
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat, având perimetrul egal cu $16$ cm, și $M$ este simetricul punctului $D$ față de punctul $B$.',
      parts: [
        { pts: 2, text: 'Arată că distanța de la punctul $B$ la dreapta $AM$ este egală cu $\\dfrac{4}{\\sqrt{5}}$ cm.', ans: 'Fie $\\{O\\}=AC\\cap BD$: $AO=2\\sqrt{2}$ cm, $MO=6\\sqrt{2}$ cm, $MA=4\\sqrt{5}$ cm; $\\mathcal{A}_{ABM}=\\dfrac{MB\\cdot AO}{2}=\\dfrac{MA\\cdot d}{2}$, deci $d=\\dfrac{4\\sqrt{2}\\cdot2\\sqrt{2}}{4\\sqrt{5}}=\\dfrac{4}{\\sqrt{5}}$ cm' },
        { pts: 3, text: 'Demonstrează că punctele $A$, $B$ și mijlocul laturii $MC$ sunt coliniare.', ans: 'Fie $T$ mijlocul lui $MC$: $TB$ este linie mijlocie în $\\triangle MDC$, deci $TB\\parallel DC$; dar și $BA\\parallel DC$, deci $A$, $B$, $T$ sunt coliniare' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul echilateral $ABC$, în care $M$ este mijlocul laturii $AC$. Perpendiculara în $A$ pe $AB$ se intersectează cu dreapta $BM$ în punctul $D$ și cu bisectoarea unghiului $MBC$ în $E$.',
      parts: [
        { pts: 2, text: 'Dacă $MD=\\sqrt{3}$ cm, determină aria triunghiului $ABC$.', ans: 'În $\\triangle DMA$, $\\sphericalangle M=90^\\circ$, $\\sphericalangle DAM=30^\\circ$ și $DM=\\sqrt{3}$ cm, deci $AM=3$ cm, $AC=6$ cm și $\\mathcal{A}_{ABC}=9\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Demonstrează că $\\dfrac{\\sphericalangle BEA}{\\sphericalangle BEC}=\\dfrac{3}{2}$.', ans: '$\\sphericalangle EAB=90^\\circ$ și $\\sphericalangle ABE=30^\\circ+15^\\circ=45^\\circ$, deci $\\sphericalangle BEA=45^\\circ$ și $EA=AB=AC$; $\\triangle CAE$ este isoscel cu $\\sphericalangle EAC=30^\\circ$, deci $\\sphericalangle CEA=75^\\circ$ și $\\sphericalangle BEC=75^\\circ-45^\\circ=30^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentat tetraedrul regulat $ABCD$, în care $O$ este centrul bazei $BCD$, $M$ este mijlocul muchiei $CD$, $P$ este mijlocul muchiei $AD$ și $OP=6$ cm.',
      parts: [
        { pts: 2, text: 'Arată că volumul tetraedrului este $144\\sqrt{2}\\text{ cm}^3$.', ans: '$\\sphericalangle AOD=90^\\circ$, iar $OP$ este mediana corespunzătoare ipotenuzei, deci $AD=12$ cm și $\\mathcal{V}=\\dfrac{12^3\\sqrt{2}}{12}=144\\sqrt{2}\\text{ cm}^3$' },
        { pts: 3, text: 'Determină măsura unghiului format de $OP$ cu planul $(ABM)$.', ans: '$CD\\perp AM$ și $CD\\perp BM$, deci $CD\\perp(ABM)$; fie $T$ mijlocul lui $AM$: $PT\\parallel DM$, deci $PT\\perp(ABM)$ și $PT=3$ cm; $\\sphericalangle(OP,(ABM))=\\sphericalangle TOP$, cu $\\sin=\\dfrac{3}{6}$, deci $30^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
