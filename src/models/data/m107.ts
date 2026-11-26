// Testul 76 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 233–235; every answer here is computed and checked with the book's answers, p. 296).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [2, 0], C: [6, 0], D: [12, 0], E: [18, 0] }, 170, { s: 'A-E', dot: 'A B C D E', l: { A: 'n', B: 'n', C: 'n', D: 'n', E: 'n' } })
// OM bisects ∡AOB = 150°; N on the line MO, beyond O
const fig8 = plane({ O: [0, 0], A: [-4, 0], B: pol(30, 4), M: pol(105, 4), N: pol(-75, 1.6) }, 120, { s: 'A-O-B M-N', dot: 'O', l: { O: 'e' } })
const fig9 = plane({ A: [0, 0], B: [12, 0], C: [8, 10], D: [0, 10], M: [0, 5], N: [10, 5] }, 110, { s: 'A-B-C-D-A M-B M-C M-N', ra: ['BMC'] })
const fig10 = plane({ A: [0, 0], B: [12, 0], C: [12, 6], D: [0, 6], M: [6, 6] }, 140, { s: 'A-B-C-D-A A-M-B' })
// AB ∥ CD with ∡ACD = 60°: A and B mirrored over the diameter perpendicular to the chords
const fig11 = plane({ O: [0, 0], A: pol(120, 4), B: pol(180, 4), D: pol(0, 4), C: pol(-60, 4) }, 110, {
  s: 'A-C-D A-B B-O-C', c: [{ at: 'O', r: 4 }], dot: 'O', l: { O: 'ne' },
})

const fig15 = graph({ L1: [-2.5, -2.5], L2: [3.5, 3.5] }, 130, [-3, 4], [-3, 4], { s: 'L1-L2', l: { L1: '', L2: '' } })
const fig16 = plane({ A: [0, 0], B: [12, 0], C: [8, 3], D: [0, 3], M: [0, 9] }, 100, { s: 'A-B-M-A D-C', ra: ['BAD'] })
const fig17 = plane({ A: [0, 0], B: [5, 0], D: [15, 0], C: [2.5, 2.5 * s3], E: [10, -5 * s3] }, 150, { s: 'A-D A-C-B-E-D' })
// BD' runs inside the cube (dashed), D'P outside it (solid)
const cube18 = solid({ ...box(18, 18, 18), P: [-9, 27, 27] }, BOX, 130, { seg: "B-D'" })
const fig18 = { ...cube18, s: `${cube18.s ?? ''} D'-P`.trim() }

export const M107: EnModel = {
  id: 'en-107',
  title: 'Paralela 45, Testul 76',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 233–235',
  items: [
    { text: 'Cel mai mare număr de forma $\\overline{x1y}$, divizibil cu $4$, pentru care $x+y=10$, este:', choices: ['$918$', '$812$', '$218$', '$416$'], ans: 1 },
    { text: 'Dacă $\\dfrac{x+1}{5x+1}=0{,}(27)$, atunci valoarea lui $x$ este:', choices: ['$7$', '$1$', '$2$', '$4$'], ans: 2 },
    {
      text: 'Temperaturile înregistrate într-o săptămână din ianuarie, la ora $6^{00}$, sunt prezentate în tabelul următor.\n\n| Luni | Marți | Miercuri | Joi | Vineri | Sâmbătă | Duminică |\n|---|---|---|---|---|---|---|\n| $-4^\\circ$C | $-6^\\circ$C | $-7^\\circ$C | $-5^\\circ$C | $-3^\\circ$C | $0^\\circ$C | $1^\\circ$C |\n\nNumărul zilelor în care nu au fost înregistrate temperaturi negative este:',
      choices: ['$1$', '$2$', '$5$', '$3$'], ans: 1,
    },
    {
      text: 'Scrierea sub formă de interval a mulțimii $M=\\{x\\in\\mathbb{R}\\mid-1<2x+1<3\\}$ este:',
      choices: ['$(-1,\\,1)$', '$(-1,\\,2)$', '$(0,\\,1)$', '$(0,\\,2)$'], ans: 0,
    },
    {
      text: 'Patru elevi, Cristi, Eugen, Maria și Radu, au avut de calculat numărul $xz+xt+yz+yt$, știind că $x+y=\\sqrt{5}+1$ și $t+z=\\sqrt{5}-1$. Rezultatele obținute sunt înregistrate în tabelul următor.\n\n| Maria | Cristi | Radu | Eugen |\n|---|---|---|---|\n| $2$ | $2\\sqrt{5}$ | $-4$ | $4$ |\n\nNumele elevului care a obținut rezultatul corect este:',
      choices: ['Cristi', 'Eugen', 'Radu', 'Maria'], ans: 1,
    },
    {
      text: 'Radu afirmă că mulțimea $\\{-1,\\,0,\\,1\\}$ este o submulțime a mulțimii $\\mathbb{N}$. Afirmația lui Radu este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$ și $E$ sunt coliniare, în această ordine, astfel încât $AC=3AB$, $AE=3AC$ și $D$ este mijlocul segmentului $CE$. Dacă $BD=10$ cm, atunci lungimea segmentului $AD$ este egală cu:',
      choices: ['$12$ cm', '$9$ cm', '$18$ cm', '$2$ cm'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, punctele $M$, $O$ și $N$ sunt coliniare și $OM$ este bisectoarea unghiului $AOB$. Dacă măsura unghiului $AON$ este egală cu $105^\\circ$, atunci măsura unghiului $AOB$ este egală cu:',
      choices: ['$75^\\circ$', '$150^\\circ$', '$130^\\circ$', '$180^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În trapezul $ABCD$ din figura alăturată, $AB\\parallel CD$, punctele $M$ și $N$ sunt mijloacele laturilor neparalele $AD$, respectiv $BC$, $AB=12$ cm, $CD=8$ cm și măsura unghiului $BMC$ este egală cu $90^\\circ$. Lungimea segmentului $BC$ este:',
      choices: ['$20$ cm', '$4$ cm', '$10$ cm', '$16$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'Dreptunghiul $ABCD$, din figura alăturată, are $AD=6$ cm, iar bisectoarele unghiurilor $A$ și $B$ se intersectează în punctul $M$, situat pe latura $CD$. Aria dreptunghiului este egală cu:',
      choices: ['$72$ cm', '$36\\text{ cm}^2$', '$30\\text{ cm}^2$', '$72\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În cercul de centru $O$ din figura alăturată, $AB$ și $CD$ sunt două coarde paralele, iar măsura unghiului $ACD$ este egală cu $60^\\circ$. Măsura unghiului $BOC$ este:',
      choices: ['$180^\\circ$', '$60^\\circ$', '$30^\\circ$', '$120^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'Dintr-un corp metalic, având formă de piramidă patrulateră regulată cu latura bazei de $4$ cm și înălțimea de $6$ cm, se obțin, prin topire, cubulețe cu latura de $5$ mm. Numărul maxim de cubulețe ce pot fi obținute este:',
      choices: ['$128$', '$256$', '$120$', '$300$'], ans: 1,
    },

    {
      text: 'Aflat în concediu, domnul Ionescu și-a împărțit banii astfel: $40\\%$ din sumă pentru cazare, $75\\%$ din rest pentru mâncare, iar ceilalți $375$ de lei pentru alte cheltuieli.',
      parts: [
        { pts: 2, text: 'Suma pentru cazare este mai mare decât suma stabilită pentru mâncare? Justifică răspunsul.', ans: 'Nu: pentru mâncare a pus $75\\%\\cdot60\\%=45\\%$ din sumă, mai mult decât cei $40\\%$ pentru cazare' },
        { pts: 3, text: 'Determină suma inițială pe care a avut-o domnul Ionescu.', ans: 'Restul de $375$ de lei reprezintă $15\\%$ din sumă: $\\dfrac{15}{100}\\cdot S=375$, deci $S=2500$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x+2}{x-1}:\\left(\\dfrac{1}{x^2-x}-\\dfrac{1}{x^2+x}+\\dfrac{2}{x^2-1}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x^2+2x}{2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: 'Paranteza este $\\dfrac{(x+1)-(x-1)+2x}{x(x-1)(x+1)}=\\dfrac{2}{x(x-1)}$, deci $E(x)=\\dfrac{x+2}{x-1}\\cdot\\dfrac{x(x-1)}{2}=\\dfrac{x^2+2x}{2}$' },
        { pts: 3, text: 'Determină numerele reale $a$, pentru care $E(a)=a$.', ans: '$\\dfrac{a^2+2a}{2}=a$ dă $a^2=0$, adică $a=0$, care nu convine; nu există astfel de numere' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x$.',
      parts: [
        { pts: 2, text: 'Calculează $f(-\\sqrt{2})+f(1+\\sqrt{2})$.', ans: '$-\\sqrt{2}+1+\\sqrt{2}=1$' },
        { pts: 3, text: 'Demonstrează că orice punct situat pe reprezentarea grafică a funcției $f$ se află la egală distanță față de axele $Ox$ și $Oy$ ale sistemului de axe ortogonale $xOy$.', ans: 'Un punct al graficului are coordonatele $(a,\\,a)$, $a\\in\\mathbb{R}$, deci $d(M,\\,Ox)=|a|=d(M,\\,Oy)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez dreptunghic $ABCD$ cu $AB\\parallel CD$ și $\\sphericalangle A=90^\\circ$. Se știe că $AB=12$ cm, $AD=3$ cm, iar $\\mathcal{A}_{ABCD}=30\\text{ cm}^2$. Laturile neparalele $AD$ și $BC$ se intersectează în punctul $M$.',
      parts: [
        { pts: 2, text: 'Arată că $DC=8$ cm.', ans: '$\\dfrac{(AB+CD)\\cdot AD}{2}=30$, adică $(12+DC)\\cdot3=60$, deci $DC=8$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $MC$.', ans: '$\\triangle MDC\\sim\\triangle MAB$, deci $\\dfrac{MD}{MD+3}=\\dfrac{8}{12}$, $MD=6$ cm, $MA=9$ cm, $MB=\\sqrt{81+144}=15$ cm și $MC=\\dfrac{2}{3}\\cdot15=10$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată sunt reprezentate două triunghiuri echilaterale $ABC$ și $BDE$. Punctele $A$, $B$ și $D$ sunt coliniare, $C$ și $E$ sunt situate de o parte și de alta a dreptei $AD$, $AB=5$ cm și $BD=10$ cm.',
      parts: [
        { pts: 2, text: 'Arată că dreptele $AC$ și $DE$ sunt paralele.', ans: '$\\sphericalangle CAD=\\sphericalangle ADE=60^\\circ$ sunt alterne interne, deci $AC\\parallel DE$' },
        { pts: 3, text: 'Determină lungimea segmentului $AE$.', ans: 'Dacă $EF\\perp BD$, $F\\in BD$, atunci $BF=5$ cm, $EF=5\\sqrt{3}$ cm, $AF=10$ cm și $AE=\\sqrt{100+75}=5\\sqrt{7}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "Fie $ABCDA'B'C'D'$ un cub cu muchia $AB=18$ cm. Prelungim diagonala $BD'$ cu segmentul $D'P$, astfel încât $BD'=2D'P$, ca în figura alăturată.",
      parts: [
        { pts: 2, text: 'Arată că lungimea segmentului $BP$ este $27\\sqrt{3}$ cm.', ans: "$BD'=18\\sqrt{3}$ cm, deci $BP=\\dfrac{3}{2}\\cdot BD'=27\\sqrt{3}$ cm" },
        { pts: 3, text: 'Află distanța de la punctul $P$ la planul $(ABC)$.', ans: "Fie $Q=\\mathrm{pr}_{(ABC)}P$; punctele $B$, $D$ și $Q$ sunt coliniare și $\\triangle BDD'\\sim\\triangle BQP$, deci $d(P,(ABC))=PQ=\\dfrac{3}{2}\\cdot DD'=27$ cm" },
      ],
      fig: fig18,
    },
  ],
}
