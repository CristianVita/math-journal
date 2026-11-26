// Testul 58 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 193–195; every answer here is computed and checked with the book's answers, p. 290).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

// the visitors, read from the book's grid (in tens): Sunday 90 … Saturday 80
const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'], vals = [9, 3, 4, 2, 4, 7, 8]
const pts2: Record<string, Pt> = { X0: [0, 0], X1: [8.6, 0], Y0: [0, 0], Y1: [0, 10.2] }
vals.forEach((v, i) => { pts2[`P${i}`] = [i + 1, v]; pts2[`U${i}`] = [i + 1, 0]; pts2[`W${i}`] = [0, v] })
const fig2 = plane(pts2, 150, {
  s: 'X0-X1 Y0-Y1', d: vals.map((_, i) => `U${i}-P${i}-W${i}`).join(' '), dot: vals.map((_, i) => `P${i}`).join(' '),
  l: Object.fromEntries(Object.keys(pts2).map((k) => [k, ''])),
  t: [
    ...days.map((d, i) => ({ at: [i + 1, -0.9] as Pt, s: d, anchor: 'middle' as const, italic: true, size: 10 })),
    ...[2, 3, 4, 5, 6, 7, 8, 9].map((v) => ({ at: [-0.3, v - 0.25] as Pt, s: String(v * 10), anchor: 'end' as const, size: 9 })),
    { at: [0.4, 9.9], s: 'Nr. plătitori', anchor: 'start', size: 10 }, { at: [8.6, 0.4], s: 'Ziua', anchor: 'end', size: 10 },
  ],
})
const fig7 = plane({ A: [0, 0], B: [6, 0], C: [8, 0], D: [13, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ A: [0, 0], B: [0.985, 0], C: [0.663, 0.557] }, 130, { s: 'A-B-C-A' })
const fig9 = plane({ A: [0, 0], B: [5, 0], x: pol(30, 7), y: pol(-30, 7) }, 140, { s: 'A-x A-y', d: 'A-B', dot: 'B', l: { A: 'w', B: 'e' }, t: [{ at: [2.5, 0.3], s: '5 km', anchor: 'middle', size: 10 }] })
const A10: Pt = [0, 0], B10: Pt = [6 * s3, 0], C10: Pt = [0, 6]
const D10 = foot(A10, B10, C10)
const fig10 = plane({ A: A10, B: B10, C: C10, D: D10, E: [D10[0], 0] }, 150, { s: 'A-B-C-A A-D D-E', ra: ['CAB', 'ADB', 'DEB'] })
const fig11 = plane({ O: [0, 0], A: pol(150, 3), B: pol(30, 3), D: pol(220, 3), C: pol(320, 3) }, 110, { s: 'A-B D-C A-C', c: [{ at: 'O', r: 3 }], l: { O: '' } })

const fig15 = graph({ A: [0, 1], L1: [-2.3, 5.6], L2: [2.3, -3.6] }, 110, [-3, 3], [-4, 6], { s: 'L1-L2', dot: 'A', l: { L1: '', L2: '', A: 'e' } })
const fig16 = plane({ O: [0, 0], A: [-3, 0], B: [3, 0], C: pol(60, 3), D: pol(120, 3) }, 120, { s: 'A-B-C-D-A', c: [{ at: 'O', r: 3 }], dot: 'O', l: { O: 's' } })
const a17 = 5 * s2, m17 = a17 / 2 + (5 * s3) / s2
const fig17 = plane({ A: [0, 0], B: [a17, 0], C: [a17, a17], D: [0, a17], M: [m17, m17] }, 120, { s: 'A-B-C-D-A B-D B-M-D C-M' })
const fig18 = solid({ ...box(30, 30, 30), M: [30, 15, 0] }, BOX, 120, { seg: 'D-M', l: { M: 'se' } })

export const M89: EnModel = {
  id: 'en-89',
  title: 'Paralela 45, Testul 58',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 193–195',
  items: [
    { text: 'Rezultatul calculului $0{,}75+\\dfrac{1}{2}:2$ este:', choices: ['$1$', '$2{,}75$', '$1{,}25$', '$1{,}5$'], ans: 0 },
    {
      text: 'Numărul vizitatorilor plătitori ai ștrandului municipal în decursul unei săptămâni de vară este reprezentat în graficul alăturat. Diferența dintre numărul vizitatorilor din ziua de marți și numărul celor din ziua de sâmbătă este:',
      choices: ['$50$', '$40$', '$-40$', '$60$'], ans: 2, fig: fig2,
    },
    { text: 'Dacă $5$ ouă costă $6$ lei, atunci $12$ ouă costă:', choices: ['$13$ lei', '$14$ lei', '$14{,}5$ lei', '$14{,}4$ lei'], ans: 3 },
    { text: 'Se consideră mulțimea $A=\\left\\{x\\in\\mathbb{Z}\\;\\middle|\\;\\dfrac{x+6}{x-1}\\in\\mathbb{Z}\\right\\}$. Suma elementelor mulțimii $A$ este:', choices: ['$4$', '$2$', '$0$', '$-2$'], ans: 0 },
    { text: 'Ecuația $\\dfrac{x+2}{5}+\\dfrac{mx-1}{4}=m$ are soluția $x=3$. Valoarea numărului real $m$ este:', choices: ['$4$', '$3$', '$2$', '$1$'], ans: 1 },
    { text: 'Iulia amestecă $2\\ \\ell$ de apă, având temperatura de $20^\\circ$C, cu $1\\ \\ell$ de apă, având temperatura de $30^\\circ$C, și spune că a obținut $3\\ \\ell$ de apă, având temperatura de $25^\\circ$C. Afirmația Iuliei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine. Dacă $AB=3BC$, $AD=13$ cm și $BD=7$ cm, atunci lungimea segmentului $CD$ este egală cu:',
      choices: ['$5$ cm', '$6$ cm', '$4$ cm', '$3$ cm'], ans: 0, fig: fig7,
    },
    { text: 'Măsurile unghiurilor $A$, $B$ și $C$ ale triunghiului din figura alăturată sunt direct proporționale cu numerele $2$, $3$ și $4$. Unghiul $A$ are măsura:', choices: ['$30^\\circ$', '$40^\\circ$', '$60^\\circ$', '$80^\\circ$'], ans: 1, fig: fig8 },
    {
      text: 'Două drumuri rectilinii $Ax$ și $Ay$ formează un unghi $xAy$, având măsura $60^\\circ$, ca în figura alăturată. Domnul Ionescu vrea să construiască o casă în punctul $B$, aflată la $5$ km de punctul $A$ și la egală distanță de drumurile $Ax$ și $Ay$. Distanța de la punctul $B$ la $Ax$ este:',
      choices: ['$3$ km', '$2{,}5$ km', '$\\dfrac{5\\sqrt{3}}{2}$ km', '$2$ km'], ans: 1, fig: fig9,
    },
    {
      text: 'Fie $ABC$ un triunghi cu $\\sphericalangle A=90^\\circ$, $\\sphericalangle B=30^\\circ$ și $BC=12$ cm. Construim, ca în figura alăturată, $AD\\perp BC$ și $DE\\perp AB$, cu $D\\in BC$ și $E\\in AB$. Lungimea segmentului $DE$ este:',
      choices: ['$6$ cm', '$3\\sqrt{3}$ cm', '$4$ cm', '$4{,}5$ cm'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ și $CD$ sunt două coarde paralele ale unui cerc, astfel încât $\\overset{\\frown}{AB}=120^\\circ$ și $\\overset{\\frown}{CD}=100^\\circ$. Măsura unghiului $ACD$ este egală cu:',
      choices: ['$140^\\circ$', '$35^\\circ$', '$60^\\circ$', '$50^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'Un vas de forma unui cilindru circular drept cu raza $R=1{,}5$ dm și înălțimea $H=6$ dm. Vasul este plin cu apă. Turnăm toată apa din vas în pahare cilindrice identice, cu raza $r=3$ cm și înălțimea $h=12$ cm. Numărul paharelor necesare este:',
      choices: ['$10$', '$25$', '$125$', '$60$'], ans: 2,
    },

    {
      text: 'Într-un grup de copii, numărul fetelor este de trei cincimi din numărul membrilor grupului. Dacă ar mai veni patru fete, numărul fetelor ar fi dublul numărului băieților.',
      parts: [
        { pts: 2, text: 'Ce procent reprezintă numărul inițial al fetelor din numărul total inițial de copii?', ans: '$\\dfrac{3}{5}=60\\%$' },
        { pts: 3, text: 'Câți băieți sunt în grup?', ans: 'Cu $n$ copii: $\\dfrac{3n}{5}+4=2\\cdot\\dfrac{2n}{5}$, deci $n=20$ și sunt $8$ băieți' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2}{x+1}-\\dfrac{1}{x+2}\\right):\\dfrac{x^2+x-6}{x^3+3x^2-4x-12}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,-1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^3+3x^2-4x-12=(x-2)(x+2)(x+3)$, pentru orice număr real $x$.', ans: '$x^3+3x^2-4x-12=x^2(x+3)-4(x+3)=(x^2-4)(x+3)=(x-2)(x+2)(x+3)$' },
        { pts: 3, text: 'Demonstrează că $E(x)=\\dfrac{x+3}{x+1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,-1,\\,2\\}$.', ans: '$E(x)=\\dfrac{x+3}{(x+1)(x+2)}\\cdot\\dfrac{(x-2)(x+2)(x+3)}{(x-2)(x+3)}=\\dfrac{x+3}{x+1}$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentată grafic funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=1-2x$, într-un sistem ortogonal $xOy$. Notăm cu $A$ punctul de intersecție a reprezentării grafice a funcției $f$ cu axa $Oy$.',
      parts: [
        { pts: 2, text: 'Arată că punctul $A$ are coordonatele $(0,\\,1)$.', ans: '$f(0)=1$, deci $A(0,\\,1)$' },
        { pts: 3, text: 'Află coordonatele punctului $B$, situat pe reprezentarea grafică a funcției, pentru care $AB=2\\sqrt{5}$.', ans: '$B(x,\\,1-2x)$ și $AB=|x|\\sqrt{5}=2\\sqrt{5}$, deci $|x|=2$: $B_1(2,\\,-3)$ și $B_2(-2,\\,5)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $AB$ este un diametru al cercului de centru $O$, iar $C$ și $D$, situate pe același semicerc delimitat de $AB$, sunt astfel încât $\\overset{\\frown}{BC}=\\overset{\\frown}{CD}=\\overset{\\frown}{DA}$.',
      parts: [
        { pts: 2, text: 'Arată că unghiul $COD$ are măsura $60^\\circ$.', ans: 'Cele trei arce au câte $\\dfrac{180^\\circ}{3}=60^\\circ$, deci $\\sphericalangle COD=60^\\circ$' },
        { pts: 3, text: 'Demonstrează că patrulaterul $ABCD$ este un trapez isoscel.', ans: 'Triunghiurile $AOD$, $COD$, $BOC$ sunt echilaterale; din $\\sphericalangle DCO=\\sphericalangle COB=60^\\circ$ (alterne) $DC\\parallel AB$ și, cum $\\sphericalangle A=\\sphericalangle B=60^\\circ$, $ABCD$ este trapez isoscel' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat cu diagonala $AC=10$ cm, iar $BDM$ este un triunghi echilateral (punctele $C$ și $M$ sunt de aceeași parte a dreptei $BD$).',
      parts: [
        { pts: 2, text: 'Calculează aria pătratului.', ans: '$\\mathcal{A}=\\dfrac{AC^2}{2}=50\\text{ cm}^2$' },
        { pts: 3, text: 'Arată că segmentul $CM$ are lungimea $5(\\sqrt{3}-1)$ cm.', ans: 'Fie $O$ centrul pătratului: $CB=CD$ și $MB=MD$, deci $M$, $C$, $O$ sunt pe mediatoarea lui $BD$; $MO=\\dfrac{10\\sqrt{3}}{2}=5\\sqrt{3}$ cm și $CO=5$ cm, deci $MC=5\\sqrt{3}-5=5(\\sqrt{3}-1)$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat cubul $ABCDA'B'C'D'$, având latura $AB=30$ cm. Punctul $M$ este mijlocul laturii $BC$.",
      parts: [
        { pts: 2, text: 'Câți litri de apă încap într-un vas ce are forma și dimensiunile acestui cub?', ans: '$\\mathcal{V}=30^3=27\\,000\\text{ cm}^3=27\\ \\ell$' },
        { pts: 3, text: "Determină distanța de la punctul $A'$ la planul $(MDD')$.", ans: "$AA'\\parallel(MDD')$, deci $d(A',\\,(MDD'))=d(A,\\,(MDD'))=AP$, cu $P$ proiecția lui $A$ pe $DM$ ($AP\\perp DM$, $AP\\perp DD'$); $DM=15\\sqrt{5}$ cm și, din aria triunghiului $MAD$, $AP=\\dfrac{30\\cdot30}{15\\sqrt{5}}=12\\sqrt{5}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
