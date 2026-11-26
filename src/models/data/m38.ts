// Testul 15 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 102–103; every answer here is computed and checked with the book's answers, p. 275).
import type { EnModel } from '../types'
import { mid3, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [3, 0], C: [6, 0], D: [12, 0], X: [13, 0] }, 170, { s: 'A-X', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n', X: '' } })
const fig8 = plane({ O: [0, 0], A: pol(195, 9), B: pol(345, 9), N: pol(105, 9), M: pol(75, 9) }, 120, { s: 'O-A O-B O-N O-M', ra: ['AON', 'MOB'], l: { O: 's' } })
const fig9 = plane({ B: [0, 0], D: [1, 0], C: [5, 0], A: [1, 4 * s3] }, 110, { s: 'A-B-C-A A-D', ra: ['ADC'] })
const fig10 = plane({ A: [0, 0], B: [3 * s3, 0], C: [3 * s3, 3], D: [0, 3], O: [1.5 * s3, 1.5] }, 140, { s: 'A-B-C-D-A A-C B-D', l: { O: 'e' } })

const fig15 = graph({ L1: [-3.2, 7.4], L2: [1.2, -1.4] }, 120, [-4, 2.5], [-1.8, 8], { s: 'L1-L2', l: { L1: '', L2: '', O: 'sw' }, t: [{ at: [-2.7, 7.6], s: 'Gf', italic: true }] })
const fig16 = plane({ A: [0, 0], B: [16, 0], C: [9, 12], D: [0, 12], O: [5.76, 7.68] }, 140, { s: 'A-B-C-D-A A-C B-D', ra: ['DAB', 'CDA'], l: { O: 'e' } })
const fig17 = plane({ A: [0, 0], B: [4 * s3, 0], C: [4 * s3, 4], D: [0, 4], E: [s3, 3], M: [4 * s3, 3] }, 140, { s: 'A-B-C-D-A D-B E-M', l: { E: 'n' } })
const p18 = box(8, 8, 11) // drawn tall, as in the book (the real height is 3)
const fig18 = solid({ ...p18, M: mid3(p18["B'"], p18["C'"]) }, BOX, 130, { dot: 'M', l: { "B'": 'sw', M: 'n' } })

export const M38: EnModel = {
  id: 'en-38',
  title: 'Paralela 45, Testul 15',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 102–103',
  items: [
    { text: 'Cel mai mare divizor prim al numărului $156$ este:', choices: ['$2$', '$3$', '$39$', '$13$'], ans: 3 },
    { text: 'Dacă $x=8$ și $y=12$, raportul numerelor $x$ și $y$ are aceeași valoare cu raportul:', choices: ['$\\dfrac{16}{12}$', '$\\dfrac{4}{8}$', '$\\dfrac{16}{36}$', '$\\dfrac{2}{3}$'], ans: 3 },
    { text: 'Cel mai mic număr natural care nu aparține mulțimii $A=\\{x\\in\\mathbb{Z}^*\\mid -3\\le x<2\\}$ este:', choices: ['$-4$', '$2$', '$0$', '$3$'], ans: 2 },
    { text: 'O pereche ordonată de numere reale $(a,\\,b)$ care verifică simultan condițiile $a>b$ și $|a|<|b|$ este:', choices: ['$(2,\\,0)$', '$(-3,\\,-10)$', '$(0,\\,3)$', '$(-5,\\,14)$'], ans: 1 },
    {
      text: 'Patru elevi, David, Miruna, Mihai și Diana, au aflat valoarea parametrului real $m$ pentru care numărul $1-\\sqrt{2}$ este soluție a ecuației $x^2-x+m=0$. Rezultatele obținute sunt trecute în tabelul următor.\n\n| David | Miruna | Mihai | Diana |\n|---|---|---|---|\n| $2-\\sqrt{2}$ | $\\sqrt{2}-2$ | $2\\sqrt{2}+1$ | $-\\sqrt{2}-3$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Diana', 'David', 'Mihai', 'Miruna'], ans: 3,
    },
    { text: 'Mihai are $24$ de colegi în clasă. În catalog, numărul colegilor aflați înaintea sa reprezintă o treime din numărul colegilor aflați după el. Propoziția „Mihai este al șaptelea la catalog.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctul $C$ este simetricul punctului $A$ față de punctul $B$, iar $D$ este simetricul punctului $A$ față de punctul $C$. Dacă $BD=9$ cm, lungimea segmentului $AD$ este egală cu:',
      choices: ['$3$ cm', '$6$ cm', '$12$ cm', '$4$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat unghiul $AOB$ cu măsura egală cu $150^\\circ$. În exteriorul său s-au construit semidreptele $OM\\perp OB$ și $ON\\perp OA$. Măsura unghiului $MON$ este egală cu:',
      choices: ['$40^\\circ$', '$120^\\circ$', '$30^\\circ$', '$180^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'Fie $ABC$ un triunghi oarecare, $AD$ este perpendiculară pe $BC$, $D\\in BC$, $AD=4\\sqrt{3}$ cm, $BC=5$ cm și $BD=1$ cm. Perimetrul triunghiului $ABC$ este egal cu:',
      choices: ['$15$ cm', '$20$ cm', '$(15+4\\sqrt{3})$ cm', '$10\\sqrt{3}$ cm'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un dreptunghi, $O$ este punctul de intersecție a diagonalelor, $AC=6$ cm și $\\sphericalangle DOC=120^\\circ$. Aria dreptunghiului este egală cu:',
      choices: ['$9\\sqrt{3}\\text{ cm}^2$', '$(6+6\\sqrt{3})\\text{ cm}^2$', '$12\\text{ cm}^2$', '$36\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    { text: 'Raza cercului circumscris unui pătrat cu latura de $6$ cm are lungimea egală cu:', choices: ['$6\\sqrt{2}$ cm', '$12$ cm', '$3$ cm', '$3\\sqrt{2}$ cm'], ans: 3 },
    {
      text: 'Un lingou metalic, având forma unui paralelipiped dreptunghic cu dimensiunile de $20$ cm, $30$ cm, respectiv $40$ cm, se topește și $25\\%$ din metalul obținut se transformă în piese cu formă de cub având latura de $5$ mm. Numărul pieselor obținute este:',
      choices: ['$48000$', '$24000$', '$16000$', '$72000$'], ans: 0,
    },

    {
      text: 'Un aprozar a vândut în prima zi o treime din întreaga cantitate de marfă pe care a primit-o, iar în a doua zi a vândut o treime din rest.',
      parts: [
        { pts: 2, text: 'În care dintre primele două zile s-a vândut o cantitate mai mare de marfă? Justifică răspunsul.', ans: 'În prima zi: $\\dfrac{c}{3}=\\dfrac{3c}{9}$, în a doua: $\\dfrac{1}{3}\\cdot\\dfrac{2c}{3}=\\dfrac{2c}{9}$, deci în prima zi' },
        { pts: 3, text: 'Dacă a doua zi s-au vândut $180$ kg de marfă, află câte kilograme de marfă s-au vândut în prima zi.', ans: '$\\dfrac{2c}{9}=180$, deci $c=810$ kg, iar în prima zi $270$ kg' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(4x-\\dfrac{1}{1-x}\\right):\\dfrac{2x^2+x-1}{2x^3+x^2-2x-1}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{1}{2},\\,\\dfrac{1}{2},\\,1\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $2x^2+x-1=(x+1)(2x-1)$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{1}{2},\\,\\dfrac{1}{2},\\,1\\right\\}$.', ans: '$(x+1)(2x-1)=2x^2-x+2x-1=2x^2+x-1$' },
        { pts: 3, text: 'Rezolvă în mulțimea numerelor întregi inecuația $E(x)\\le3$.', ans: '$4x-\\dfrac{1}{1-x}=\\dfrac{(2x-1)^2}{x-1}$, $2x^3+x^2-2x-1=(2x+1)(x-1)(x+1)$, deci $E(x)=4x^2-1$; $x^2\\le1$ dă $x\\in\\{-1,0,1\\}$, iar din condiții rămâne $x=0$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=1-2x$.',
      parts: [
        { pts: 2, text: 'Calculează $f(-1)-f(1)$.', ans: '$f(-1)=3$, $f(1)=-1$, deci $f(-1)-f(1)=4$' },
        { pts: 3, text: 'Se consideră punctele $A$ și $B$ situate pe reprezentarea grafică a funcției $f$ în sistemul de axe ortogonale $xOy$, astfel încât $A$ are abscisa egală cu $1$ și $B$ are ordonata egală cu $7$. Află coordonatele mijlocului segmentului $AB$.', ans: '$A(1,\\,-1)$, $1-2x=7$ dă $B(-3,\\,7)$, deci mijlocul este $M(-1,\\,3)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez dreptunghic cu bazele $AB$ și $CD$ de lungimi $16$ cm, respectiv $9$ cm, iar $\\sphericalangle A=\\sphericalangle D=90^\\circ$. Diagonalele $AC$ și $BD$ se intersectează în punctul $O$ și sunt perpendiculare.',
      parts: [
        { pts: 2, text: 'Arată că $AB^2+CD^2=AD^2+BC^2$.', ans: 'Din triunghiurile dreptunghice $AOB$, $COD$, $AOD$, $BOC$: ambele sume sunt egale cu $AO^2+OB^2+OC^2+OD^2$' },
        { pts: 3, text: 'Determină aria trapezului $ABCD$.', ans: 'Cu $CM\\perp AB$: $BC^2=AD^2+49$, iar din a) $AD^2+BC^2=337$, deci $AD=12$ cm și $\\mathcal{A}_{ABCD}=\\dfrac{(16+9)\\cdot12}{2}=150\\text{ cm}^2$' },
      ],
      fig: fig16,
    },
    {
      text: 'Fie $ABCD$ un dreptunghi având $AD=4$ cm și $AB=4\\sqrt{3}$ cm. Punctul $E$ aparține segmentului $DB$, cu $BE=3DE$, iar paralela dusă prin $E$ la $DC$ intersectează latura $BC$ în punctul $M$.',
      parts: [
        { pts: 2, text: 'Arată că $EM=3\\sqrt{3}$ cm.', ans: '$\\triangle BEM\\sim\\triangle BDC$: $\\dfrac{EM}{DC}=\\dfrac{BE}{BD}=\\dfrac{3}{4}$, deci $EM=3\\sqrt{3}$ cm' },
        { pts: 3, text: 'Demonstrează că $AE\\le AF$, oricare ar fi punctul $F$ pe segmentul $BD$.', ans: '$BD=8$, $DE=2$: $\\dfrac{DE}{DA}=\\dfrac{DA}{DB}=\\dfrac{1}{2}$, deci $\\triangle DEA\\sim\\triangle DAB$ și $AE\\perp BD$; perpendiculara e cel mai scurt drum, deci $AF\\ge AE$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată, $ABCDA'B'C'D'$ este o prismă patrulateră regulată, iar $M$ este mijlocul muchiei $B'C'$. Se știe că $AB=8$ cm și $BM=5$ cm.",
      parts: [
        { pts: 2, text: 'Determină aria totală a prismei.', ans: "$B'M=4$ cm, deci $BB'=3$ cm și $\\mathcal{A}_t=2\\cdot64+4\\cdot8\\cdot3=224\\text{ cm}^2$" },
        { pts: 3, text: "Demonstrează că distanța de la punctul $M$ la planul $BDD'$ este egală cu $2\\sqrt{2}$ cm.", ans: "Fie $O'$ centrul fețelor de sus și $MT\\parallel C'O'$, $T\\in D'B'$; $C'O'\\perp(BDD')$, deci $d(M,(BDD'))=MT=\\dfrac{C'O'}{2}=2\\sqrt{2}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
