// Testul 11 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 94–95; every answer here is computed and checked with the book's answers, p. 273).
import type { EnModel } from '../types'
import { plane, solid, type P3 } from '../figure'
import { box, BOX, graph, pol, PRISM3, prism3 } from './shapes'

const fig7 = plane({ A: [0, 0], B: [4, 0], C: [8, 0], D: [16, 0] }, 160, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: [5, 0], B: pol(22.5, 5), C: pol(45, 5), D: pol(67.5, 5), E: [0, 5] }, 100, { s: 'O-A O-B O-C O-D O-E', ra: ['AOE'], l: { O: 'sw' } })
const D9: [number, number] = [6400 / 170, 12000 / 170]
const fig9 = plane({ A: [0, 0], B: [170, 0], D: D9, C: [170 + D9[0], D9[1]] }, 150, { s: 'A-B-C-D-A B-D', ra: ['ADB'] })
const fig10 = plane({ A: [0, 0], B: [8, 0], C: [5, 4], D: [0, 4] }, 120, { s: 'A-B-C-D-A B-D', ra: ['DAB'] })
const fig11 = plane({ O: [0, 0], A: [-6, 0], B: [6, 0], C: pol(60, 6) }, 110, { s: 'A-B B-C A-C', c: [{ at: 'O', r: 6 }], dot: 'O', l: { O: 's' } })
const fig12 = solid(box(12, 3, 4), BOX, 130)

const fig15 = graph({ A: [-4, 0], B: [0, 4], C: [4, 0], L1: [-5, -1], L2: [1.5, 5.5] }, 130, [-5.5, 5.5], [-1.5, 6], { s: 'L1-L2', dot: 'A B C', l: { L1: '', L2: '', A: 'nw', B: 'e', C: 'n', O: 'se' } })
const fig16 = plane({ A: [0, 0], B: [9, 0], C: [4, 6], D: [0, 6] }, 130, { s: 'A-B-C-D-A A-C B-D', ra: ['DAB'] })
const fig17 = plane({ O: [0, 0], A: [-6, 0], C: [6, 0], D: pol(42, 6), B: pol(-18, 6) }, 150, { s: 'A-B-C-D-A A-C B-D O-B O-D', ra: ['ABC', 'CDA'], l: { O: 'n' } })
const p18 = prism3(12, 9)
const O18 = [0, 1, 2].map((k) => (p18["A'"][k] + p18["B'"][k] + p18["C'"][k]) / 3) as P3
const D18 = [0, 1, 2].map((k) => p18.B[k] + (p18["C'"][k] - p18.B[k]) / 3) as P3
const fig18 = solid({ ...p18, O: O18, D: D18 }, PRISM3, 130, { seg: "B-C' D-O", l: { O: 'n', D: 'e' } })

export const M34: EnModel = {
  id: 'en-34',
  title: 'Paralela 45, Testul 11',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 94–95',
  items: [
    { text: 'Suma divizorilor naturali ai numărului $21$ este:', choices: ['$11$', '$21$', '$31$', '$32$'], ans: 3 },
    { text: 'O carte costă $36$ de lei. După o ieftinire cu $20\\%$, prețul cărții va fi:', choices: ['$7{,}2$ lei', '$28{,}8$ lei', '$32$ de lei', '$34{,}2$ lei'], ans: 1 },
    { text: 'Dacă $a=3\\cdot4-(-2)\\cdot(-5)$ și $b=(-2)^3:2+3^5:(-3)^4$, atunci diferența $a-b$ este egală cu:', choices: ['$1$', '$2$', '$3$', '$4$'], ans: 2 },
    { text: 'Dintre intervalele $(-2,\\,7)$, $[-4,\\,6)$, $(12,\\,21]$ și $[-16,\\,-10]$, cel care conține cele mai multe numere întregi este:', choices: ['$(-2,\\,7)$', '$[-4,\\,6)$', '$(12,\\,21]$', '$[-16,\\,-10]$'], ans: 1 },
    {
      text: 'Patru elevi, Andrei, Barbu, Călin și Dan, au calculat media geometrică a numerelor $a=\\sqrt{8}+2\\sqrt{18}$ și $b=2\\sqrt{50}-\\sqrt{162}$. Rezultatele obținute de ei sunt trecute în tabelul următor:\n\n| Andrei | Barbu | Călin | Dan |\n|---|---|---|---|\n| $\\sqrt{2}$ | $4$ | $8\\sqrt{2}$ | $16$ |\n\nDintre cei patru elevi, cel care a obținut rezultatul corect este:',
      choices: ['Andrei', 'Barbu', 'Călin', 'Dan'], ans: 1,
    },
    {
      text: 'Cei $30$ de elevi ai unei clase au ales prin vot șeful clasei, dintre colegii lor: Ana, Bogdan și Carmen. Procentele voturilor obținute de cei trei candidați sunt prezentate în tabelul de mai jos.\n\n| Ana | Bogdan | Carmen |\n|---|---|---|\n| $p\\%$ | $50\\%$ | $30\\%$ |\n\nAfirmația „Ana a fost votată de $5$ elevi.” este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată este desenat segmentul $AB=4$ cm. Punctul $C$ este simetricul lui $A$ față de $B$, iar punctul $D$ este simetricul lui $A$ față de $C$. Lungimea segmentului $BD$ este egală cu:',
      choices: ['$6$ cm', '$8$ cm', '$12$ cm', '$16$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiul $AOE$ este drept, iar $\\sphericalangle AOB\\equiv\\sphericalangle BOC\\equiv\\sphericalangle COD\\equiv\\sphericalangle DOE$. Măsura unghiului $BOD$ este egală cu:',
      choices: ['$15^\\circ$', '$30^\\circ$', '$45^\\circ$', '$60^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'Terenul din figura alăturată are forma unui paralelogram cu laturile $AB=170$ m, $BC=80$ m și diagonala $BD=150$ m. Aria terenului este egală cu:',
      choices: ['$6000\\text{ m}^2$', '$12000\\text{ m}^2$', '$13600\\text{ m}^2$', '$25500\\text{ m}^2$'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul dreptunghic $ABCD$, cu $AB\\parallel CD$ și $\\sphericalangle A=90^\\circ$. Diagonala $BD$ este bisectoarea unghiului $ABC$, $AB=8$ cm și $CD=5$ cm. Lungimea laturii $AD$ este egală cu:',
      choices: ['$3$ cm', '$4$ cm', '$3\\sqrt{2}$ cm', '$5$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc cu centrul $O$ și raza egală cu $6$ cm. Punctele $A$ și $B$ sunt diametral opuse, iar coarda $BC$ are lungimea de $6$ cm. Lungimea coardei $AC$ este egală cu:',
      choices: ['$6$ cm', '$6\\sqrt{2}$ cm', '$6\\sqrt{3}$ cm', '$12$ cm'], ans: 2, fig: fig11,
    },
    {
      text: "În figura alăturată este desenată o cutie în formă de paralelipiped dreptunghic cu dimensiunile $AB=12$ dm, $BC=3$ dm și $AA'=4$ dm. Maria vrea să cumpere o coală de hârtie cu suprafața de $x\\text{ dm}^2$, pentru a împacheta cutia. Știind că $20\\%$ din $x$ se pierde la ambalare, valoarea minimă a numărului $x$ este:",
      choices: ['$96$', '$192$', '$240$', '$300$'], ans: 2, fig: fig12,
    },

    {
      text: 'Într-o pungă sunt mai multe bomboane. Dacă toate bomboanele se împart în mod egal unui grup de $6$ copii, atunci în pungă rămân $4$ bomboane, iar dacă toate bomboanele se împart în mod egal unui grup de $8$ copii, atunci în pungă rămân $6$ bomboane.',
      parts: [
        { pts: 2, text: 'Verifică dacă în pungă puteau fi $46$ de bomboane. Justifică răspunsul dat.', ans: 'Da: $46=6\\cdot7+4$ și $46=8\\cdot5+6$' },
        { pts: 3, text: 'Află care poate fi cel mai mic număr de bomboane din pungă.', ans: '$n+2$ se împarte la $6$ și la $8$, deci la $24$; cel mai mic: $n=22$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x-1}{x^2-2x+1}+\\dfrac{x+1}{x^3+x^2-x-1}+\\dfrac{3x}{6x^2+6x}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^3+x^2-x-1=(x+1)^2(x-1)$, pentru $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$x^2(x+1)-(x+1)=(x+1)(x^2-1)=(x+1)^2(x-1)$' },
        { pts: 3, text: 'Arată că $(x-1)E(x)=\\dfrac{3}{2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$E(x)=\\dfrac{1}{x-1}+\\dfrac{1}{(x+1)(x-1)}+\\dfrac{1}{2(x+1)}$, deci $(x-1)E(x)=1+\\dfrac{2+x-1}{2(x+1)}=1+\\dfrac{1}{2}=\\dfrac{3}{2}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+4$.',
      parts: [
        { pts: 2, text: 'Determină numărul real $a$ pentru care are loc egalitatea $f(2a)=a^2+5$.', ans: '$2a+4=a^2+5$, deci $(a-1)^2=0$ și $a=1$' },
        { pts: 3, text: 'Graficul funcției $f$ intersectează axele $Ox$ și $Oy$ ale sistemului de axe ortogonale $xOy$ în punctele $A$, respectiv $B$. Determină distanța de la punctul $C(4,\\,0)$ la dreapta $AB$.', ans: '$A(-4,\\,0)$, $B(0,\\,4)$; $\\mathcal{A}_{ABC}=\\dfrac{8\\cdot4}{2}=16$, $AB=4\\sqrt{2}$, deci $d=\\dfrac{2\\cdot16}{4\\sqrt{2}}=4\\sqrt{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este desenat trapezul $ABCD$ cu $AB\\parallel CD$, $\\sphericalangle A=90^\\circ$, $AB=9$ cm, $CD=4$ cm și $AD=6$ cm.',
      parts: [
        { pts: 2, text: 'Calculează lungimea laturii $BC$.', ans: 'Cu $CT\\perp AB$: $CT=6$ cm, $TB=5$ cm, $BC=\\sqrt{61}$ cm' },
        { pts: 3, text: 'Arată că diagonalele $AC$ și $BD$ sunt perpendiculare.', ans: '$\\text{tg}\\sphericalangle CAD=\\dfrac{4}{6}=\\dfrac{6}{9}=\\text{tg}\\sphericalangle ABD$, deci $\\sphericalangle CAD=\\sphericalangle ABD$; cu $\\sphericalangle ABD+\\sphericalangle ADB=90^\\circ$ rezultă $\\sphericalangle CAD+\\sphericalangle ADB=90^\\circ$, adică $AC\\perp BD$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat patrulaterul convex $ABCD$ cu $\\sphericalangle B=\\sphericalangle D=90^\\circ$, $AC=12$ cm și $BD=6$ cm. Punctul $O$ este mijlocul diagonalei $AC$.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $BOD$.', ans: '$OB=OD=\\dfrac{AC}{2}=6$ cm $=BD$, deci $\\triangle BOD$ e echilateral, cu aria $9\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Află măsura unghiului $BAD$.', ans: '$A$, $B$, $C$, $D$ sunt pe cercul de centru $O$ și diametru $AC$; $\\sphericalangle BAD=\\dfrac{\\sphericalangle BOD}{2}=30^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o prismă triunghiulară regulată cu latura bazei $AB=12$ cm și muchia laterală $AA'=9$ cm. Punctul $O$ este centrul bazei $A'B'C'$, iar punctul $D$ este situat pe segmentul $BC'$, astfel încât $BD=5$ cm.",
      parts: [
        { pts: 2, text: "Calculează distanța de la punctul $A'$ la planul $(BCC')$.", ans: "Este înălțimea triunghiului echilateral $A'B'C'$: $\\dfrac{12\\sqrt{3}}{2}=6\\sqrt{3}$ cm" },
        { pts: 3, text: "Demonstrează că dreapta $DO$ este paralelă cu planul $(ABB')$.", ans: "$BC'=15$ cm, $\\dfrac{C'D}{C'B}=\\dfrac{10}{15}=\\dfrac{2}{3}=\\dfrac{C'O}{C'M}$, cu $M$ mijlocul lui $A'B'$; deci $DO\\parallel BM\\subset(ABB')$" },
      ],
      fig: fig18,
    },
  ],
}
