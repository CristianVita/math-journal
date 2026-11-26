// Testul 8 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 88–89; every answer here is computed and checked with the book's answers, p. 272).
import type { EnModel } from '../types'
import { plane, solid, type P3, type Pt } from '../figure'
import { graph, pol, PRISM3, tetra, TETRA } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [7, 0], C: [9, 0] }, 160, { s: 'A-C', dot: 'A B C', l: { A: 'n', B: 'n', C: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(128, 5), B: pol(-52, 5), C: pol(230, 5), D: pol(50, 5) }, 110, { s: 'A-B C-D', l: { O: 'e' } })
const fig9 = plane({ A: [0, 0], B: [6, 0], C: [5, 3], D: [1, 3], M: [3, 9] }, 90, { s: 'A-B-M-A D-C' })
const fig10 = plane({ O: [0, 0], A: pol(180, 5), B: pol(90, 5), C: pol(60, 5) }, 110, { s: 'A-B A-C', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 's' } })
const A11: Pt = [1.8, 2.4]
const fig11 = plane({ A: A11, B: [0, 0], C: [5, 0], G: [(1.8 + 5) / 3, 0.8] }, 120, { s: 'A-B-C-A A-G', dot: 'G', ra: ['BAC'], l: { G: 'ne' } })
const t12 = tetra(12, ['A', 'B', 'C', 'V'])
const fig12 = solid({ ...t12, O: [0, 1, 2].map((k) => (t12.A[k] + t12.B[k] + t12.C[k]) / 3) as P3 }, TETRA('A', 'B', 'C', 'V'), 110, { seg: 'V-O', l: { O: 'e' } })

const fig15 = graph({ A: [-4, 0], B: [0, -4], L1: [-6.5, 2.5], L2: [1.5, -5.5] }, 120, [-7, 2.5], [-6, 3], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'n', B: 'e', O: 'ne' } })
const fig16 = plane({ A: [0, 12], B: [-5, 0], C: [5, 0], D: [0, 5 * s3], E: [0, 0] }, 90, { s: 'A-B-C-A B-D-C A-D', dot: 'E', l: { D: 'e', E: 's' } })
// M on the arc BC, D on AM with MD = MC
const A17 = pol(90, 5), B17 = pol(210, 5), C17 = pol(330, 5), M17 = pol(250, 5)
const k17 = Math.hypot(M17[0] - C17[0], M17[1] - C17[1]) / Math.hypot(M17[0] - A17[0], M17[1] - A17[1])
const D17: Pt = [M17[0] + (A17[0] - M17[0]) * k17, M17[1] + (A17[1] - M17[1]) * k17]
const fig17 = plane({ O: [0, 0], A: A17, B: B17, C: C17, M: M17, D: D17 }, 120, { s: 'A-B-C-A A-M B-M-C D-C', c: [{ at: 'O', r: 5 }], l: { O: '', D: 'e' } })
const fig18 = solid({ A: [0, 0, 0], B: [10, 0, 0], C: [5, 5 * s3, 0], "A'": [0, 0, 15], "B'": [10, 0, 15], "C'": [5, 5 * s3, 15] }, PRISM3, 100, { seg: "C-A' C-B'" })

export const M31: EnModel = {
  id: 'en-31',
  title: 'Paralela 45, Testul 8',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 88–89',
  items: [
    { text: 'Rezultatul calculului $10-10:10$ este:', choices: ['$0$', '$9$', '$10$', '$11$'], ans: 1 },
    {
      text: 'Patru elevi, Andrei, Bogdan, Maria și Ioana, au calculat media geometrică a numerelor $a=1\\dfrac{1}{8}$ și $b=0{,}08$. Rezultatele obținute sunt prezentate în tabelul următor:\n\n| Andrei | Bogdan | Maria | Ioana |\n|---|---|---|---|\n| $0{,}3$ | $0{,}03$ | $3$ | $0{,}09$ |\n\nRăspunsul corect a fost dat de:',
      choices: ['Andrei', 'Bogdan', 'Maria', 'Ioana'], ans: 0,
    },
    { text: 'Un amestec de apă cu sare conține $6\\%$ sare și cântărește $7{,}3$ kg. Cantitatea de sare din amestec, măsurată în grame, este egală cu:', choices: ['$428$', '$538$', '$378$', '$438$'], ans: 3 },
    { text: 'Cel mai mare dintre numerele $a=3{,}12$, $b=3{,}1(2)$, $c=3{,}(12)$ și $d=3{,}1$ este:', choices: ['$a$', '$b$', '$c$', '$d$'], ans: 1 },
    { text: 'Cel mai mic număr natural $a$, pentru care numărul $a+6789$ se divide cu $9$, este:', choices: ['$4$', '$5$', '$6$', '$7$'], ans: 2 },
    { text: 'Trei muncitori vor să repare un gard. Primul muncitor poate repara gardul în două ore, al doilea în trei ore, iar al treilea în $6$ ore. Afirmația „Lucrând împreună, cei trei muncitori pot repara gardul într-o oră.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, $AB=7$ cm, $BC=2$ cm, iar $M$ și $N$ sunt mijloacele segmentelor $AB$, respectiv $AC$. Valoarea raportului $\\dfrac{AN}{MC}$ este egală cu:',
      choices: ['$\\dfrac{9}{11}$', '$\\dfrac{7}{9}$', '$\\dfrac{7}{11}$', '$\\dfrac{9}{7}$'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, $AB$ și $CD$ sunt două drepte secante în $O$. Dacă $\\sphericalangle AOD=5x-7^\\circ$ și $\\sphericalangle BOC=x+61^\\circ$, atunci valoarea lui $x$ este egală cu:',
      choices: ['$15^\\circ$', '$16^\\circ$', '$17^\\circ$', '$18^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez cu $AB\\parallel CD$, $AB=6$ m, $CD=4$ m, iar $M$ este punctul de intersecție dintre dreptele $AD$ și $BC$. Dacă aria trapezului este egală cu $50\\text{ m}^2$, atunci aria triunghiului $MDC$ este egală cu:',
      choices: ['$10\\text{ m}^2$', '$40\\text{ m}^2$', '$50\\text{ m}^2$', '$60\\text{ m}^2$'], ans: 1, fig: fig9,
    },
    {
      text: 'În cercul din figura alăturată, $AB$ este latura unui pătrat înscris în cerc, iar $AC$ este latura unui triunghi echilateral înscris în cerc. Măsura unghiului $BAC$ este egală cu:',
      choices: ['$15^\\circ$', '$30^\\circ$', '$45^\\circ$', '$60^\\circ$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este dreptunghic în $A$, iar $G$ este centrul său de greutate. Valoarea raportului $\\dfrac{AG}{BC}$ este egală cu:',
      choices: ['$\\dfrac{2}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{1}{6}$', '$\\dfrac{1}{3}$'], ans: 3, fig: fig11,
    },
    {
      text: 'În figura alăturată, $VO=4\\sqrt{6}$ m este un stâlp, $VA$, $VB$, $VC$ sunt trei cabluri de susținere, iar triunghiurile $VAB$, $VBC$ și $VCA$ sunt echilaterale. Suma lungimilor cablurilor este egală cu:',
      choices: ['$27$ m', '$30$ m', '$33$ m', '$36$ m'], ans: 3, fig: fig12,
    },

    {
      text: 'Bunica împarte nuci și mere nepoților săi. Numărul nucilor este de trei ori mai mare decât numărul merelor. După ce a dat fiecărui nepot câte trei mere și câte opt nuci, bunicii i-au mai rămas două mere și $14$ nuci.',
      parts: [
        { pts: 2, text: 'Poate avea bunica șase nepoți? Justifică răspunsul.', ans: 'Nu: ar avea $6\\cdot3+2=20$ de mere și $6\\cdot8+14=62$ de nuci, iar $62\\ne3\\cdot20$' },
        { pts: 3, text: 'Determină câți nepoți are bunica.', ans: '$3(3n+2)=8n+14$, deci $n=8$ nepoți' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{1+x^2}{2}-\\left(\\dfrac{1+x}{2}\\right)^2\\right)\\cdot\\left(\\dfrac{1}{(1-x)^2}-\\dfrac{1}{x^2-x}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{1}{4x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{0,\\,1\\}$.', ans: 'Prima paranteză este $\\dfrac{(x-1)^2}{4}$, a doua $\\dfrac{x-(x-1)}{x(x-1)^2}=\\dfrac{1}{x(x-1)^2}$, deci $E(x)=\\dfrac{1}{4x}$' },
        { pts: 3, text: 'Arată că numărul $n=E(1)+E\\left(\\dfrac{1}{3}\\right)+E\\left(\\dfrac{1}{5}\\right)+E\\left(\\dfrac{1}{7}\\right)$ este număr natural, pătrat perfect.', ans: '$n=\\dfrac{1}{4}(1+3+5+7)=4=2^2$ (în $E(1)$ se folosește forma $\\dfrac{1}{4x}$)' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-x-4$ și sistemul de axe ortogonale $xOy$. Se notează cu $A$ punctul de intersecție dintre reprezentarea grafică a funcției $f$ și axa $Ox$ și cu $B$ punctul de intersecție dintre reprezentarea grafică a funcției $f$ și axa $Oy$.',
      parts: [
        { pts: 2, text: 'Determină lungimea segmentului $AB$.', ans: '$A(-4,\\,0)$, $B(0,\\,-4)$, $AB=4\\sqrt{2}$' },
        { pts: 3, text: 'Determină coordonatele punctului $M$ situat pe axa $Ox$, știind că aria triunghiului $MAB$ este egală cu $4$.', ans: '$\\dfrac{AM\\cdot OB}{2}=4$ dă $AM=2$, deci $M(-2,\\,0)$ sau $M(-6,\\,0)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este isoscel, $AB=AC=13$ cm, triunghiul $DBC$ este echilateral de latură $10$ cm, iar $E$ este mijlocul laturii $BC$.',
      parts: [
        { pts: 2, text: 'Arată că punctele $A$, $D$ și $E$ sunt coliniare.', ans: '$AE\\perp BC$ și $DE\\perp BC$ (medianele sunt și înălțimi), deci $A$, $D$, $E$ sunt pe perpendiculara în $E$ pe $BC$' },
        { pts: 3, text: 'Aproximează lungimea segmentului $AD$, exprimată în centimetri, cu o zecimală exactă.', ans: '$AE=12$ cm, $DE=5\\sqrt{3}$ cm, $AD=12-5\\sqrt{3}\\approx3{,}3$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este echilateral, $M$ este un punct pe arcul mic $BC$ al cercului circumscris triunghiului $ABC$, iar $D$ este situat pe segmentul $AM$ astfel încât $MD=MC$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $MDC$ este echilateral.', ans: '$\\sphericalangle AMC=\\dfrac{\\overset{\\frown}{AC}}{2}=\\sphericalangle ABC=60^\\circ$, iar $MD=MC$, deci $\\triangle MDC$ este echilateral' },
        { pts: 3, text: 'Demonstrează că $MA=MB+MC$.', ans: '$\\sphericalangle ACD=60^\\circ-\\sphericalangle DCB=\\sphericalangle BCM$, $CD=CM$, $CA=CB$, deci $\\triangle ADC\\equiv\\triangle BMC$ (LUL) și $AD=BM$; $MA=AD+DM=MB+MC$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată, $ABCA'B'C'$ este o prismă triunghiulară regulată, în care $AB=10$ cm și $BB'=15$ cm.",
      parts: [
        { pts: 2, text: 'Arată că volumul prismei este egal cu $375\\sqrt{3}\\text{ cm}^3$.', ans: '$\\mathcal{A}_{ABC}=\\dfrac{100\\sqrt{3}}{4}=25\\sqrt{3}\\text{ cm}^2$, $V=25\\sqrt{3}\\cdot15=375\\sqrt{3}\\text{ cm}^3$' },
        { pts: 3, text: "Determină măsura unghiului dintre planele $(CA'B')$ și $(ABC)$.", ans: "Dreapta comună trece prin $C$, paralelă cu $AB$; cu $M$, $N$ mijloacele lui $AB$, $A'B'$: $\\text{tg}\\sphericalangle NCM=\\dfrac{15}{5\\sqrt{3}}=\\sqrt{3}$, deci $60^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
