// Testul 35 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 143–145; every answer here is computed and checked with the book's answers, p. 282).
import type { EnModel } from '../types'
import type { Fig, Pt } from '../figure'
import { plane, solid } from '../figure'
import { graph, pol, PRISM3, prism3 } from './shapes'

const s3 = Math.sqrt(3)

// the bar chart of the week: L 5, M 4, M −2, J 4, V −5, S −2, D 3
const temps = [5, 4, -2, 4, -5, -2, 3]
const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const bars: Record<string, Pt> = {}
const barChains: string[] = []
temps.forEach((t, i) => {
  const x = 1.2 + 2 * i
  bars[`b${i}a`] = [x, 0]; bars[`b${i}b`] = [x, t]; bars[`b${i}c`] = [x + 1, t]; bars[`b${i}d`] = [x + 1, 0]
  barChains.push(`b${i}a-b${i}b-b${i}c-b${i}d`)
})
const fig3 = plane({ ...bars, X0: [0, 0], X1: [15.5, 0], Y0: [0, -6.5], Y1: [0, 7.5] }, 190, {
  s: ['X0-X1 Y0-Y1', ...barChains].join(' '), l: Object.fromEntries(Object.keys({ ...bars, X0: 0, X1: 0, Y0: 0, Y1: 0 }).map((k) => [k, ''])),
  t: [
    ...temps.map((t, i) => ({ at: [1.7 + 2 * i, t > 0 ? -1.2 : 0.4] as Pt, s: days[i], anchor: 'middle' as const, italic: true, size: 10 })),
    ...[-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((v) => ({ at: [-0.4, v - 0.3] as Pt, s: String(v), anchor: 'end' as const, size: 9 })),
    { at: [0.6, 7], s: 'Temperatura (°C)', anchor: 'start', size: 10 }, { at: [15.5, 0.6], s: 'Ziua', anchor: 'end', size: 10 },
  ],
})

const fig7 = plane({ A: [0, 0], B: [6, 0], C: [10, 0], D: [12, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(70, 8), D: pol(50, 8), B: pol(30, 8), C: pol(-60, 8) }, 100, { s: 'O-A O-D O-B O-C', l: { O: 'w' } })
const fig9 = plane({ F: [0, 6], A: [0, 0], O: [11, 0], M: [11, 1.6], B: [15, 0] }, 150, { s: 'F-A-B-F O-M', ra: ['FAB', 'MOB'], l: { M: 'n' } })
const fig10 = plane({ A: [0, 0], B: [15, 0], C: [15, 10], D: [0, 10], P1: [10, 0], P2: [10, 10], Q1: [0, 5], Q2: [10, 5] }, 120, {
  s: 'A-B-C-D-A P1-P2 Q1-Q2', l: { P1: '', P2: '', Q1: '', Q2: '' },
})
const twelve = Object.fromEntries('ABCDEFGHIJKL'.split('').map((n, i) => [n, pol(90 + 30 * i, 6)])) as Record<string, Pt>
const fig11 = plane({ O: [0, 0], ...twelve }, 120, {
  s: 'A-E E-O O-A O-K O-I K-I', c: [{ at: 'O', r: 6 }], dot: 'O B C D F G H J L', l: { O: 's' },
  t: [{ at: [-0.9, 2.6], s: 'x', italic: true }, { at: [3.6, 0.8], s: 'y', italic: true }, { at: [1.8, -0.2], s: 'z', italic: true }],
})
const fig12: Fig = {
  w: 140, h: 150,
  p: { "A'": [15, 15], "B'": [125, 15], "O'": [70, 15], A: [15, 125], B: [125, 125], O: [70, 125] },
  l: { "A'": 'w', "B'": 'e', "O'": 'n', A: 'w', B: 'e', O: 's' },
  s: "A-A' B-B' A'-B'",
  d: "A-B O-O'",
  dot: "O O'",
  e: [{ at: [70, 15], rx: 55, ry: 12 }, { at: 'O', rx: 55, ry: 12, back: true }],
}

const fig15 = graph({ P: [0, 2], Q: [3, -3], L1: [-1, 11 / 3], L2: [3.6, -4] }, 110, [-1.5, 5], [-4.5, 4], { s: 'L1-L2', dot: 'P Q', l: { L1: '', L2: '', P: 'e', Q: 'e' } })
const T16: Pt = [26 - 150 / 39, 360 / 39]
const f16 = plane({ A: [0, 0], B: [36, 0], C: [36, 15], O: [26, 0], T: T16, E1: [16, 0], E2: [36, 0] }, 170, { s: 'A-B-C-A', dot: 'O T', l: { E1: '', E2: '', O: 's', T: 'n' } })
const r16 = f16.p.E2[0] - f16.p.O[0]
const fig16 = { ...f16, path: [{ d: `M${f16.p.E1[0]} ${f16.p.E1[1]} A${r16} ${r16} 0 0 1 ${f16.p.E2[0]} ${f16.p.E2[1]}` }] }
const fig17 = plane({ A: [0, 0], B: [12, 0], C: [9, 3 * s3], D: [3, 3 * s3] }, 130, { s: 'A-B-C-D-A' })
// drawn taller than the real height 1, as in the book
const p18 = prism3(12, 5)
const g18 = [(p18.A[0] + p18.B[0] + p18.C[0]) / 3, (p18.A[1] + p18.B[1] + p18.C[1]) / 3]
const top18 = (q: number[]) => [g18[0] + (q[0] - g18[0]) / 2, g18[1] + (q[1] - g18[1]) / 2, q[2]] as [number, number, number]
const fig18 = solid({ ...p18, "A'": top18(p18["A'"]), "B'": top18(p18["B'"]), "C'": top18(p18["C'"]) }, PRISM3, 130)

export const M66: EnModel = {
  id: 'en-66',
  title: 'Paralela 45, Testul 35',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 143–145',
  items: [
    { text: 'Restul împărțirii lui $58$ la $7$ este:', choices: ['$0$', '$2$', '$4$', '$6$'], ans: 1 },
    { text: 'O urnă are $6$ bile roșii, $10$ bile galbene și $4$ bile albastre. Dacă extragem din urnă o bilă la întâmplare, probabilitatea ca aceasta să fie albastră este:', choices: ['$10\\%$', '$20\\%$', '$30\\%$', '$40\\%$'], ans: 1 },
    {
      text: 'În diagrama de mai jos sunt prezentate temperaturile medii într-o săptămână din luna ianuarie. Cea mai mare diferență pozitivă dintre temperaturile medii din două zile consecutive este:',
      choices: ['$5^\\circ$C', '$8^\\circ$C', '$9^\\circ$C', '$10^\\circ$C'], ans: 2, fig: fig3,
    },
    {
      text: 'Patru elevi, Alin, Cristian, Florin și Sorin, au calculat media aritmetică a numerelor raționale $-\\dfrac{3}{5}$, $-\\dfrac{1}{2}$, $\\dfrac{1}{3}$ și $\\dfrac{3}{4}$. Rezultatele obținute de ei sunt înscrise în tabelul alăturat.\n\n| Alin | Cristian | Florin | Sorin |\n|---|---|---|---|\n| $-\\dfrac{1}{240}$ | $-\\dfrac{1}{120}$ | $-\\dfrac{1}{60}$ | $-\\dfrac{1}{15}$ |\n\nElevul care a găsit răspunsul corect este:',
      choices: ['Alin', 'Cristian', 'Florin', 'Sorin'], ans: 0,
    },
    { text: 'Numărul întregilor cuprinși între $-2\\sqrt{3}$ și $3\\sqrt{2}$ este:', choices: ['$3$', '$6$', '$7$', '$8$'], ans: 3 },
    { text: 'La Colegiul „Negruzzi” din Iași, mandatul unui director este de exact $3$ ani. Laura afirmă că un elev care învață la „Negruzzi” din clasa a V-a până în clasa a XII-a poate avea cel mult $4$ directori diferiți. Afirmația Laurei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$ și $D$, în această ordine, astfel încât lungimile segmentelor $AB$, $BC$ și $CD$ (măsurate în cm) sunt invers proporționale cu numerele $2$, $3$, respectiv $6$ și $AD=12$ cm. Lungimea segmentului $AB$ este egală cu:',
      choices: ['$6$ cm', '$4$ cm', '$3$ cm', '$2$ cm'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt desenate unghiurile $\\sphericalangle AOC=130^\\circ$ și $\\sphericalangle BOC=90^\\circ$, astfel încât semidreapta $OB$ se află în interiorul unghiului $AOC$. Dacă $OD$ este bisectoarea unghiului $AOB$, atunci măsura unghiului $COD$ este egală cu:',
      choices: ['$100^\\circ$', '$110^\\circ$', '$120^\\circ$', '$130^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat schematic un felinar $F$ aflat la înălțimea $AF=6$ m față de sol și un copil $OM$, $OM=1{,}6$ m, aflat la distanța $AO=11$ m de felinar. Dacă felinarul luminează, atunci umbra $OB$, lăsată de $OM$ pe pământ, are lungimea de:',
      choices: ['$1{,}6$ m', '$2$ m', '$3$ m', '$4$ m'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată, trei piese de domino dreptunghiulare, cu lățimea de $5$ cm, sunt asamblate pentru a forma un dreptunghi $ABCD$. Aria dreptunghiului $ABCD$ este:',
      choices: ['$75\\text{ cm}^2$', '$100\\text{ cm}^2$', '$125\\text{ cm}^2$', '$150\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'Circumferința cercului, cu centrul $O$, din figura alăturată este împărțită în $12$ arce egale prin punctele $A$, $B$, ..., $L$. Valoarea sumei $x+y+z$ este:',
      choices: ['$120^\\circ$', '$150^\\circ$', '$180^\\circ$', '$200^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentat un cilindru circular drept, cu secțiunea axială pătratul $ABB'A'$, având latura $AB=6$ m. Volumul cilindrului este egal cu:",
      choices: ['$54\\pi\\text{ m}^3$', '$72\\pi\\text{ m}^3$', '$144\\pi\\text{ m}^3$', '$216\\pi\\text{ m}^3$'], ans: 0, fig: fig12,
    },

    {
      text: 'Bursa lunară a unui elev este mai mică decât $450$ de lei cu jumătate din valoarea ei.',
      parts: [
        { pts: 2, text: 'Este posibil ca această bursă să fie $320$ de lei? Justifică răspunsul.', ans: 'Nu: $450-160=290\\neq320$' },
        { pts: 3, text: 'Află valoarea bursei lunare.', ans: '$x=450-\\dfrac{x}{2}$, deci $x=300$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2}{x-2}+\\dfrac{x}{x+2}\\right):\\dfrac{x^2+4}{x^2-x-2}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2-x-2=(x+1)(x-2)$, pentru orice $x\\in\\mathbb{R}$.', ans: '$x^2-x-2=x^2+x-2x-2=x(x+1)-2(x+1)=(x+1)(x-2)$' },
        { pts: 3, text: 'Demonstrează că $E(x)=\\dfrac{x+1}{x+2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,2\\}$.', ans: '$E(x)=\\dfrac{x^2+4}{(x-2)(x+2)}\\cdot\\dfrac{(x+1)(x-2)}{x^2+4}=\\dfrac{x+1}{x+2}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=(m-3)x+2m$, unde $m\\in\\mathbb{R}$ și $xOy$ un sistem de axe ortogonale.',
      parts: [
        { pts: 2, text: 'Determină $m$, știind că $A(1,\\,0)$ aparține graficului funcției $f$.', ans: '$m-3+2m=0$, deci $m=1$' },
        { pts: 3, text: 'Pentru $m=1$, stabilește dacă dreapta din figura alăturată este sau nu reprezentarea grafică a funcției $f$.', ans: '$f(x)=-2x+2$ și $f(3)=-4\\neq-3$, deci $Q(3,\\,-3)\\notin G_f$: dreapta desenată nu este graficul funcției $f$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, semicercul desenat are centrul în punctul $O$, care se află pe segmentul $AB$ și este tangent în $T$ dreptei $AC$ și tangent în $B$ dreptei $BC$. Se știe că $AB=36$ cm și $BC=15$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $AC=39$ cm.', ans: '$BC$ e tangentă la cerc și $OB$ e rază, deci $BC\\perp OB$; cu teorema lui Pitagora, $AC=\\sqrt{36^2+15^2}=39$ cm' },
        { pts: 3, text: 'Determină lungimea razei semicercului.', ans: '$\\triangle AOT\\sim\\triangle ACB$: $\\dfrac{OT}{BC}=\\dfrac{AO}{AC}\\Rightarrow\\dfrac{r}{15}=\\dfrac{36-r}{39}\\Rightarrow r=10$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'Trapezul isoscel $ABCD$ din figura alăturată are baza mare $AB=12$ cm și $AD=DC=CB=6$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrează că $AC$ este bisectoarea unghiului $BAD$.', ans: 'Fie $M$ mijlocul lui $AB$: $AM\\parallel CD$, $AM=CD$ și $AD=DC$, deci $AMCD$ e romb și $AC$ e bisectoarea unghiului $BAD$' },
        { pts: 3, text: 'Determină măsura unghiului $BAD$.', ans: 'Triunghiul $AMD$ e echilateral, deci $\\sphericalangle BAD=60^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat un trunchi de piramidă triunghiulară regulată $ABCA'B'C'$ cu latura bazei mari $AB=12$ m, latura bazei mici $A'B'=6$ m și apotema trunchiului de $2$ m.",
      parts: [
        { pts: 2, text: 'Calculează înălțimea trunchiului.', ans: "În trapezul dreptunghic $OMM'O'$: $OM=2\\sqrt{3}$ m, $O'M'=\\sqrt{3}$ m, $MM'=2$ m, deci $OO'=1$ m" },
        { pts: 3, text: 'Determină măsura unghiului format de una dintre fețele laterale ale trunchiului cu planul orizontal.', ans: "$\\sphericalangle((BCC'),(ABC))=\\sphericalangle M'MO=30^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
