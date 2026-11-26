// Testul 10 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 92–93; every answer here is computed and checked with the book's answers, p. 273).
import type { EnModel } from '../types'
import { plane, type Fig, type Pt } from '../figure'
import { graph, pol } from './shapes'

const fig7 = plane({ N: [-4, 0], A: [0, 0], B: [2, 0], M: [4, 0], d: [-5.5, 0] }, 160, { s: 'd-M', dot: 'N A B M', l: { N: 'n', A: 'n', B: 'n', M: 'n', d: 'n' } })
const O8: Pt = [7, 0]
const fig8 = plane({ O: [0, 0], A: [4, 0], B: pol(84, 4), "O'": O8, "A'": [13, 0], "B'": pol(6, 6, O8) }, 170, { s: "O-A O-B O'-A' O'-B'", l: { O: 'w', "O'": 'w', "A'": 's', "B'": 'n' } })
const fig9 = plane({ O: [0, 0], A: pol(150, 6), B: pol(30, 6) }, 110, { s: 'A-B', c: [{ at: 'O', r: 6 }], dot: 'O', l: { O: 's' } })
const fig10 = plane({ A: [0, 0], B: [5, 0], E: [7, 0], F: [7, 3], C: [5, 3], D: [0, 3] }, 140, { s: 'A-E-F-D-A B-C' })
const A11: Pt = [4, Math.sqrt(84)], B11: Pt = [0, 0], C11: Pt = [8, 0]
const at = (p: Pt, q: Pt, t: number): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
const fig11 = plane({ A: A11, B: B11, C: C11, M: [3, 0], P: at(B11, A11, 3 / 8), N: at(C11, A11, 5 / 8) }, 100, { s: 'A-B-C-A P-M-N', l: { M: 's' } })

const fig15 = graph({ A: [3, 0], B: [0, -2], "A'": [3, 2], "B'": [1, -2], L1: [0.5, -3], L2: [3.5, 3] }, 120, [-1, 5], [-3.5, 3.5],
  { s: 'L1-L2', d: "A-A' B-B'", dot: "A B A' B'", l: { L1: '', L2: '', A: 'se', B: 'w', "A'": 'e', "B'": 'se', O: 'nw' } })
const fig16 = plane({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], M: [3, 0], N: [4, 2] }, 120, { s: 'A-B-C-D-A D-M-N-D' })
const B17: Pt = [0, 0], A17: Pt = [6.4, 4.8], C17: Pt = [10, 0]
const fig17 = plane({ A: A17, B: B17, C: C17, M: at(A17, B17, 3 / 8), N: at(A17, C17, 4 / 6) }, 140, { s: 'A-B-C-A M-N', ra: ['BAC'] })
// the cylinder (r = 3, h = 6, so a square axial section), M on the lower circle, ∡AOM = 120°
const fig18: Fig = {
  w: 140, h: 170,
  p: { "A'": [10, 15], "B'": [130, 15], A: [10, 135], B: [130, 135], O: [70, 135], M: [100, 135 + 14 * Math.sin(Math.PI / 3)] },
  l: { "A'": 'w', "B'": 'e', A: 'w', B: 'e', O: 'n', M: 's' },
  s: "A-A' B-B' M-B",
  d: "A-B A'-B A'-M A-M",
  dot: 'O',
  e: [{ at: [70, 15], rx: 60, ry: 14 }, { at: 'O', rx: 60, ry: 14, back: true }],
}

export const M33: EnModel = {
  id: 'en-33',
  title: 'Paralela 45, Testul 10',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 92–93',
  items: [
    { text: 'Restul împărțirii numărului $2023$ la $21$ este egal cu:', choices: ['$96$', '$21$', '$17$', '$7$'], ans: 3 },
    {
      text: 'Tabelul următor descrie o dependență funcțională:\n\n| $x$ | $-1$ | $b$ | $2$ |\n|---|---|---|---|\n| $y=-2x+3$ | $a$ | $-5$ | $c$ |\n\nSuma $a+b+c$ este egală cu:',
      choices: ['$8$', '$4$', '$0$', '$16$'], ans: 0,
    },
    { text: 'Fie $x$, $y$ două numere reale pozitive, astfel încât media geometrică a numerelor $2$ și $x$ este egală cu $3$, iar media geometrică a numerelor $18$ și $y$ este egală cu $4$. Media geometrică a numerelor $x$ și $y$ este egală cu:', choices: ['$12$', '$8$', '$6$', '$2$'], ans: 3 },
    { text: 'Cel mai mic număr natural de patru cifre, divizibil cu $45$, este:', choices: ['$1020$', '$1005$', '$1035$', '$1080$'], ans: 2 },
    { text: 'Se consideră mulțimile $A=\\{-1,\\,2,\\,4\\}$ și $B=\\{-2,\\,1,\\,4\\}$. Mulțimea $A\\setminus B$ este egală cu:', choices: ['$\\{4\\}$', '$\\{-1,\\,2\\}$', '$\\{-2,\\,1\\}$', '$\\{-2,\\,-1,\\,1,\\,4\\}$'], ans: 1 },
    { text: 'Într-un reper cartezian $xOy$ se consideră punctul $A(-3,\\,4)$ și punctul $A\'$, simetricul punctului $A$ față de punctul $O$. Maria afirmă: „Punctul $A\'$ are coordonatele $(4,\\,-3)$”. Afirmația Mariei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, $A$ și $B$ sunt două puncte situate pe dreapta $d$, astfel încât $AB=2$ cm. Se consideră punctele $M$ și $N$ pe dreapta $d$, unde $M$ este simetricul punctului $A$ față de $B$, iar $N$ este simetricul punctului $M$ față de $A$. Lungimea segmentului $MN$ este egală cu:',
      choices: ['$5$ cm', '$6$ cm', '$7$ cm', '$8$ cm'], ans: 3, fig: fig7,
    },
    {
      text: "În figura alăturată, unghiurile $AOB$ și $A'O'B'$ sunt complementare și $\\sphericalangle AOB=2x+72^\\circ$, $\\sphericalangle A'O'B'=3x-12^\\circ$. Valoarea lui $x$ este egală cu:",
      choices: ['$5^\\circ$', '$6^\\circ$', '$24^\\circ$', '$84^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată, $A$ și $B$ sunt două puncte situate pe cercul $\\mathcal{C}(O,\\,R)$, cu $R=6$ cm, astfel încât distanța de la $O$ la coarda $AB$ este egală cu $3$ cm. Măsura unghiului $AOB$ este egală cu:',
      choices: ['$60^\\circ$', '$90^\\circ$', '$30^\\circ$', '$120^\\circ$'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat dreptunghiul $ABCD$ de arie $15\\text{ cm}^2$, iar $AEFD$ este un dreptunghi de arie $21\\text{ cm}^2$. Dacă $BE=2$ cm, atunci perimetrul patrulaterului $BEFC$ este egal cu:',
      choices: ['$20$ cm', '$8$ cm', '$5$ cm', '$10$ cm'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este isoscel cu $AB=AC=10$ cm, iar $M$ este un punct situat pe latura $BC$, astfel încât $MN\\parallel AB$, $PM\\parallel AC$, unde $N\\in AC$, $P\\in AB$. Suma $MN+MP$ este egală cu:',
      choices: ['$5$ cm', '$20$ cm', '$10$ cm', '$12$ cm'], ans: 2, fig: fig11,
    },
    {
      text: 'O placă de faianță are formă de paralelipiped dreptunghic cu dimensiunile $62{,}5$ cm, $40$ cm și $0{,}5$ cm. Volumul plăcii este egal cu:',
      choices: ['$1500\\text{ cm}^3$', '$1400\\text{ cm}^3$', '$1250\\text{ cm}^3$', '$1000\\text{ cm}^3$'], ans: 2,
    },

    {
      text: 'Un turist și-a propus să viziteze, pe un traseu turistic, $52$ de obiective în șase zile. În prima zi a vizitat cinci obiective, iar în fiecare dintre zilele următoare mai multe obiective decât în ziua precedentă.',
      parts: [
        { pts: 2, text: 'Poate vizita turistul $10$ obiective a doua zi? Justifică răspunsul.', ans: 'Nu: în zilele 3–6 ar vizita cel puțin $11+12+13+14=50$ de obiective, deci în total cel puțin $65>52$' },
        { pts: 3, text: 'Care este numărul maxim de obiective pe care le poate vizita turistul a doua zi?', ans: 'Cu $d$ a doua zi: $5+d+(d+1)+(d+2)+(d+3)+(d+4)\\le52$, deci $d\\le7$; de exemplu $5,\\,7,\\,8,\\,9,\\,10,\\,13$: maximum $7$' },
      ],
    },
    {
      text: 'Se consideră expresiile $E_1(x)=\\dfrac{x^3-x^2}{x^2-2x+1}$ și $E_2(x)=\\dfrac{x-1}{x+1}+\\dfrac{x+2}{x-1}+\\dfrac{x-3}{x^2-1}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Calculează $E_1(-1)\\cdot E_1\\left(\\dfrac{1}{2}\\right)$.', ans: '$E_1(x)=\\dfrac{x^2}{x-1}$; $E_1(-1)=-\\dfrac{1}{2}$, $E_1\\left(\\dfrac{1}{2}\\right)=-\\dfrac{1}{2}$, produsul este $\\dfrac{1}{4}$ (cartea folosește $E_1(-1)$, deși $-1$ e exclus)' },
        { pts: 3, text: 'Arată că pentru orice număr natural $n$, $n\\ge2$, numărul $a=E_1(n)-\\dfrac{1}{2}E_2(n)$ este natural.', ans: '$E_2(x)=\\dfrac{2x^2+2x}{x^2-1}=\\dfrac{2x}{x-1}$, deci $a=\\dfrac{n^2-n}{n-1}=n$' },
      ],
    },
    {
      text: "Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-4$ și punctele $A(3,\\,0)$ și $B(0,\\,-2)$ în sistemul de axe ortogonale $xOy$. Paralela prin $A$ la axa $Oy$ intersectează reprezentarea grafică a funcției $f$ în $A'$, iar paralela prin $B$ la axa $Ox$ intersectează reprezentarea grafică a funcției $f$ în punctul $B'$.",
      parts: [
        { pts: 2, text: "Determină coordonatele punctelor $A'$ și $B'$.", ans: "$A'(3,\\,2)$, pentru că $f(3)=2$, și $B'(1,\\,-2)$, pentru că $2x-4=-2$ dă $x=1$" },
        { pts: 3, text: "Arată că $A'B'=2\\sqrt{5}$.", ans: "$A'B'=\\sqrt{(3-1)^2+(2+2)^2}=\\sqrt{20}=2\\sqrt{5}$" },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat cu latura de $4$ cm. Punctul $M$ este situat pe latura $AB$ astfel încât $AM=3$ cm, iar punctul $N$ este mijlocul laturii $BC$.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $DMN$.', ans: '$16-\\mathcal{A}_{DAM}-\\mathcal{A}_{MBN}-\\mathcal{A}_{NCD}=16-6-1-4=5\\text{ cm}^2$' },
        { pts: 3, text: 'Arată că $\\sin(\\sphericalangle MDN)=\\dfrac{1}{\\sqrt{5}}$.', ans: '$DM=5$ cm, $DN=2\\sqrt{5}$ cm; $\\mathcal{A}_{DMN}=\\dfrac{DM\\cdot DN\\cdot\\sin\\sphericalangle MDN}{2}$ dă $\\sin\\sphericalangle MDN=\\dfrac{10}{10\\sqrt{5}}=\\dfrac{1}{\\sqrt{5}}$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ dreptunghic în $A$, cu $AB=8$ cm și $AC=6$ cm, iar punctele $M$ și $N$ sunt situate pe laturile $AB$, respectiv $AC$, astfel încât $AM=3$ cm și $AN=4$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $\\sphericalangle AMN\\equiv\\sphericalangle ACB$.', ans: '$\\dfrac{AM}{AC}=\\dfrac{AN}{AB}=\\dfrac{1}{2}$ și unghiul $A$ comun, deci $\\triangle AMN\\sim\\triangle ACB$' },
        { pts: 3, text: 'Perpendiculara din $A$ pe $BC$ intersectează segmentul $MN$ în $P$. Demonstrează că punctul $P$ este mijlocul segmentului $MN$.', ans: '$\\sphericalangle PAM=\\sphericalangle ACB=\\sphericalangle AMN$, deci $PA=PM$; $\\sphericalangle PAN=\\sphericalangle ABC=\\sphericalangle ANM$, deci $PA=PN$; așadar $PM=PN$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat un cilindru circular drept având secțiune axială pătratul $ABB'A'$ cu latura $AB=6$ cm.",
      parts: [
        { pts: 2, text: 'Calculează volumul cilindrului.', ans: '$R=3$ cm, $G=6$ cm, $V=\\pi\\cdot9\\cdot6=54\\pi\\text{ cm}^3$' },
        { pts: 3, text: "Pe cercul bazei inferioare se consideră punctul $M$ astfel încât $AM=3\\sqrt{3}$ cm. Determină distanța de la punctul $A$ la planul $(A'BM)$.", ans: "$\\sphericalangle AMB=90^\\circ$ și $BM\\perp AA'$, deci $BM\\perp(AA'M)$; distanța este înălțimea din $A$ în $\\triangle AA'M$: $\\dfrac{6\\cdot3\\sqrt{3}}{\\sqrt{63}}=\\dfrac{6\\sqrt{21}}{7}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
