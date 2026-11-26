// Testul 69 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 217–219; every answer here is computed and checked with the book's answers, pp. 293–294).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, plane, solid } from '../figure'
import { graph, pol } from './shapes'

const s2 = Math.SQRT2, s3 = Math.sqrt(3)

// the interval (−4, 5] on the number line: an empty circle at −4, a full dot at 5
const ticks5: Record<string, Pt> = Object.fromEntries([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((v) => [`k${v + 6}`, [v, 0] as Pt]))
const fig5 = plane({ ...ticks5, L: [-6.5, 0], R: [7, 0], P: [-4, 0], Q: [5, 0] }, 200, {
  s: 'L-R', dot: 'Q', c: [{ at: 'P', r: 0.18 }],
  l: Object.fromEntries([...Object.keys(ticks5), 'L', 'R', 'P', 'Q'].map((k) => [k, ''])),
  path: [], t: [{ at: [-4, 0.5], s: '−4', anchor: 'middle', size: 10 }, { at: [5, 0.5], s: '5', anchor: 'middle', size: 10 }],
})
const fig5b = { ...fig5, path: [{ d: `M${fig5.p.P[0] + 4} ${fig5.p.P[1] - 3} H${fig5.p.Q[0]}` }, { d: `M${fig5.p.P[0] + 4} ${fig5.p.P[1] + 3} H${fig5.p.Q[0]}` }] }

const fig7 = plane({ A: [0, 0], M: [1, 0], B: [2, 0], N: [5, 0], C: [8, 0] }, 170, { s: 'A-C', dot: 'A M B N C', l: { A: 'n', M: 'n', B: 'n', N: 'n', C: 'n' } })
const fig9 = plane({ P: [0, 0], Q: [12, 4 * s3], R: [24, 0], S: [16, 0] }, 150, { s: 'P-Q-R-P Q-S', ra: ['PQS'] })
const fig10 = plane({ A: [0, 0], B: [10, 0], C: [10, 6], D: [0, 6], E: [-1, -1], F: [11, -1], G: [11, 7], H: [-1, 7] }, 150, {
  s: 'A-B-C-D-A E-F-G-H-E', l: { E: '', F: '', G: '', H: '', A: 'ne', B: 'nw', C: 'sw', D: 'se' },
  t: [{ at: [-0.5, 4.6], s: '10 m', anchor: 'middle', size: 8 }],
})
const fig11 = plane({ O: [0, 0], A: pol(200, 6), B: pol(320, 6) }, 110, { s: 'A-B', c: [{ at: 'O', r: 6 }], dot: 'O', l: { O: 'e' } })

const fig15 = graph({ A: [1, 0], B: [0, 1], L1: [-2, 3], L2: [3.5, -2.5] }, 120, [-2.5, 4], [-2.5, 3.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'ne', B: 'ne' } })
const B16: Pt = [0, 0], C16: Pt = [6, 0], A16: Pt = [3, 3 * s3], M16: Pt = [2, 0]
const fig16 = plane({ A: A16, B: B16, C: C16, M: M16, E: foot(M16, A16, B16), F: foot(M16, A16, C16) }, 120, { s: 'A-B-C-A E-M-F', ra: ['BEM', 'CFM'] })
const fig17 = plane({ A: [0, 0], B: [16, 0], C: [9, 12], D: [0, 12], E: [-9, 0] }, 150, { s: 'E-B-C-D-A D-E A-C B-D', ra: ['DAB', 'ADC'] })
// the well: a pyramid with the base on top and the vertex V down
const h18 = 3 * s2
const p18: Record<string, P3> = { A: [0, 0, 0], B: [6, 0, 0], C: [6, 6, 0], D: [0, 6, 0], V: [3, 3, -h18], O: [3, 3, 0] }
const fig18 = solid(p18, 'D-C-B-A A-V-B B-V-C C-V-D D-V-A', 110, { seg: 'V-O A-C B-D', dot: 'O' })

export const M100: EnModel = {
  id: 'en-100',
  title: 'Paralela 45, Testul 69',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 217–219',
  items: [
    { text: 'Dacă $x$, $y$ sunt numere naturale și $2^x\\cdot3^y=48$, atunci $x+y$ este:', choices: ['$3$', '$2$', '$5$', '$4$'], ans: 2 },
    { text: 'Dacă $5\\cdot x=y$, $y\\neq0$, atunci $\\dfrac{y}{x}$ este:', choices: ['$\\dfrac{2}{5}$', '$5$', '$\\dfrac{1}{5}$', '$10$'], ans: 1 },
    { text: 'Cel mai mic multiplu comun al numerelor $30$ și $40$ este:', choices: ['$10$', '$70$', '$120$', '$60$'], ans: 2 },
    {
      text: 'Fie mulțimea $M=\\left\\{-\\dfrac{3}{4};\\,0{,}1;\\,\\sqrt{\\dfrac{16}{25}};\\,2\\sqrt{5};\\,1+\\sqrt{2}\\right\\}$. Cardinalul mulțimii $M\\cap\\mathbb{Q}$ este:',
      choices: ['$4$', '$3$', '$1$', '$2$'], ans: 1,
    },
    {
      text: 'Rezolvând cerința: „Scrieți intervalul care are imaginea geometrică alăturată”, patru elevi, Simona, Radu, Costel și David, au obținut rezultatele înregistrate în următorul tabel.\n\n| Simona | Radu | Costel | David |\n|---|---|---|---|\n| $(-4,\\,5)$ | $[-4,\\,5]$ | $[-4,\\,5)$ | $(-4,\\,5]$ |\n\nElevul care a rezolvat corect este:',
      choices: ['David', 'Simona', 'Radu', 'Costel'], ans: 0, fig: fig5b,
    },
    {
      text: 'Denisa este născută pe $7$ martie. Pe $25$ februarie $2020$, Denisa îi spune unei prietene: „Peste $10$ zile va fi ziua mea”. Afirmația Denisei este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, în această ordine. Punctul $M$ este mijlocul segmentului $AB$, iar punctul $N$ este mijlocul segmentului $BC$. Dacă $AB=2$ cm și $MN=4$ cm, atunci lungimea segmentului $BC$ este egală cu:',
      choices: ['$8$ cm', '$1$ cm', '$3$ cm', '$6$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'Măsura suplementului unui unghi este de trei ori mai mare decât măsura complementului aceluiași unghi. Măsura unghiului este egală cu:',
      choices: ['$45^\\circ$', '$60^\\circ$', '$30^\\circ$', '$50^\\circ$'], ans: 0,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi isoscel $PQR$ cu măsura unghiului $PQR$ egală cu $120^\\circ$. Punctul $S$ aparține laturii $PR$, astfel încât $PQ$ este perpendiculară pe $QS$. Dacă $PS=16$ cm, atunci distanța de la $S$ la dreapta $QR$ este egală cu:',
      choices: ['$8$ cm', '$16$ cm', '$4$ cm', '$10$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'Figura alăturată reprezintă schița unui teren dreptunghiular $ABCD$, cu $AB=100$ m și $AD=60$ m. Terenul este înconjurat de o pistă de alergare cu lățimea de $10$ m. Aria suprafeței reprezentând pista de alergare este egală cu:',
      choices: ['$3800\\text{ m}^2$', '$4000\\text{ m}^2$', '$3600\\text{ m}^2$', '$11200\\text{ m}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc cu centrul în $O$, iar coarda $AB$ se află la distanța de $3$ cm de centrul cercului. Dacă raza cercului este egală cu $6$ cm, atunci lungimea arcului mic $AB$ va fi egală cu:',
      choices: ['$\\pi$ cm', '$4\\pi$ cm', '$6\\sqrt{3}$ cm', '$12$ cm'], ans: 1, fig: fig11,
    },
    {
      text: 'Pentru fundația unei construcții se sapă o groapă în formă de trunchi de piramidă patrulateră regulată, având latura bazei mari de $6$ m, latura bazei mici de $4$ m și înălțimea de $3$ m. Pământul este transportat cu un camion care poate duce cel mult $5\\text{ m}^3$ de pământ la un transport. Numărul curselor pe care trebuie să le efectueze camionul este:',
      choices: ['$13$', '$20$', '$15$', '$16$'], ans: 3,
    },

    {
      text: 'Irina a susținut un test-grilă, având $20$ de întrebări. Pentru fiecare răspuns corect a primit $5$ puncte și pentru fiecare răspuns greșit sau lipsă i s-au scăzut $2$ puncte. La final, punctajul Irinei este $72$ de puncte.',
      parts: [
        { pts: 2, text: 'Este posibil ca Irina să fi dat exact $5$ răspunsuri greșite? Justifică răspunsul.', ans: 'Nu: ar fi obținut $15\\cdot5-5\\cdot2=65$ de puncte' },
        { pts: 3, text: 'Determină numărul răspunsurilor corecte ale Irinei.', ans: '$c+g=20$ și $5c-2g=72$, deci $7c=112$ și $c=16$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{(x+1)^2}{(x+3)^2}+\\dfrac{2x+2}{x+3}+1\\right)\\cdot\\dfrac{x^2+6x+9}{8x^2-32}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x+2}{2x-4}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,2\\}$.', ans: 'Paranteza este $\\left(\\dfrac{x+1}{x+3}+1\\right)^2=\\dfrac{4(x+2)^2}{(x+3)^2}$, deci $E(x)=\\dfrac{4(x+2)^2}{(x+3)^2}\\cdot\\dfrac{(x+3)^2}{8(x-2)(x+2)}=\\dfrac{x+2}{2x-4}$' },
        { pts: 3, text: 'Determină numerele întregi $n$ pentru care $E(n)$ este număr întreg.', ans: '$2n-4\\mid n+2$, deci $2n-4\\mid2n+4$ și $2n-4\\mid8$: $2n-4\\in\\{-8,\\,-4,\\,-2,\\,2,\\,4,\\,8\\}$; doar $n=6$ verifică ($E(6)=1$)' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-x+1$.',
      parts: [
        { pts: 2, text: 'Calculează $f(\\sqrt{2})\\cdot f(-\\sqrt{2})$.', ans: '$(1-\\sqrt{2})(1+\\sqrt{2})=-1$' },
        { pts: 3, text: 'Știind că $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, determină distanța de la punctul $C(3,\\,0)$ la dreapta $AB$.', ans: '$A(1,\\,0)$, $B(0,\\,1)$, deci $\\sphericalangle BAO=45^\\circ$; dacă $CT\\perp AB$, $T\\in AB$, $\\triangle ACT$ este dreptunghic isoscel cu $AC=2$, deci $CT=\\sqrt{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, se consideră un punct $M$ pe latura $BC$ a triunghiului echilateral $ABC$ și notăm cu $E$ și $F$ proiecțiile punctului $M$ pe laturile $AB$, respectiv $AC$.',
      parts: [
        { pts: 2, text: 'Arată că $ME\\cdot AB+MF\\cdot AC=2\\cdot\\mathcal{A}_{ABC}$.', ans: '$\\mathcal{A}_{ABC}=\\mathcal{A}_{ABM}+\\mathcal{A}_{ACM}=\\dfrac{ME\\cdot AB}{2}+\\dfrac{MF\\cdot AC}{2}$' },
        { pts: 3, text: 'Demonstrează că valoarea sumei $ME+MF$ nu depinde de poziția punctului $M$.', ans: 'Cu $AB=AC=a$: $a(ME+MF)=2\\cdot\\dfrac{a^2\\sqrt{3}}{4}$, deci $ME+MF=\\dfrac{a\\sqrt{3}}{2}$, aceeași pentru orice $M$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul $ABCD$ cu $AB\\parallel CD$, $AB>CD$, $\\sphericalangle A=\\sphericalangle D=90^\\circ$, $AD=12$ cm și $DC=9$ cm. Diagonalele $AC$ și $BD$ sunt perpendiculare. Paralela prin $D$ la dreapta $AC$ intersectează dreapta $AB$ în punctul $E$.',
      parts: [
        { pts: 2, text: 'Arată că $ED=15$ cm.', ans: '$ACDE$ este paralelogram, deci $ED=AC=\\sqrt{12^2+9^2}=15$ cm' },
        { pts: 3, text: 'Determină aria trapezului $ABCD$.', ans: '$\\sphericalangle EDB=90^\\circ$, deci $DA^2=AB\\cdot AE$, cu $AE=DC=9$: $AB=16$ cm și $\\mathcal{A}_{ABCD}=\\dfrac{(16+9)\\cdot12}{2}=150\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: 'În grădina lui Radu se află o fântână artizanală săpată în piatră, având forma piramidei patrulatere $VABCD$ din figura alăturată. Latura bazei are lungimea de $60$ cm, iar măsura unghiului format de muchia laterală cu planul bazei este egală cu $45^\\circ$.',
      parts: [
        { pts: 2, text: 'Arată că în fântâna lui Radu încap mai mult de $50\\ \\ell$ de apă.', ans: '$VO=AO=30\\sqrt{2}$ cm, deci $V=\\dfrac{60^2\\cdot30\\sqrt{2}}{3}=36000\\sqrt{2}\\text{ cm}^3=36\\sqrt{2}\\ \\ell>50\\ \\ell$' },
        { pts: 3, text: 'Determină măsura unghiului format de dreptele $VA$ și $BC$.', ans: '$VA=AO\\sqrt{2}=60$ cm, deci $\\triangle VAD$ este echilateral; $BC\\parallel AD$, deci $\\sphericalangle(VA,\\,BC)=\\sphericalangle VAD=60^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
