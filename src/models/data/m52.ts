// Testul 21 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 114–115; every answer here is computed and checked with the book's answers, p. 277).
import type { EnModel } from '../types'
import { along3, plane, solid, type P3 } from '../figure'
import { pol, tetra, TETRA } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ D: [-3, 0], A: [0, 0], B: [3, 0], E: [5, 0], C: [7, 0] }, 170, { s: 'D-C', dot: 'D A B E C', l: { D: 'n', A: 'n', B: 'n', E: 'n', C: 'n' } })
const fig8 = plane({ O: [0, 0], A: [10, 0], B: pol(35, 10), C: [0, 10], M: pol(17.5, 9), N: pol(62.5, 9) }, 110, { s: 'O-A O-B O-C', d: 'O-M O-N', ra: ['AOC'], l: { O: 'sw' } })
const fig9 = plane({ A: [0, 0], B: [2 + 2 * s3, 0], C: [2 + 2 * s3, 4], D: [0, 4], O: [2 * s3, 2] }, 120, { s: 'A-B-C-D-A A-O-D B-O-C', ra: ['BOC'], l: { O: 'n' } })
const fig10 = plane({ A: [-4, 0], C: [4, 0], D: [0, 3], B: [0, -3], Q: [-2, 1.5], P: [2, 1.5], N: [2, -1.5], M: [-2, -1.5] }, 150, {
  s: 'A-B-C-D-A M-N-P-Q-M', hatch: ['M-N-P-Q'],
})
const fig11 = plane({ O: [0, 0], A: pol(240, 8), B: pol(300, 8) }, 100, { s: 'O-A O-B', c: [{ at: 'O', r: 8 }], dot: 'O', l: { O: 'n' } })
const fig12 = solid(tetra(100, ['B', 'C', 'D', 'A']), TETRA('B', 'C', 'D', 'A'), 120)

const fig16 = plane({ A: [0, 6], B: [6 * s3, 6], C: [6 * s3, 0], D: [0, 0], O: [3 * s3, 3], M: [9 * s3, 9], S: [8 * s3, 6] }, 150, {
  s: 'A-S B-C-D-A A-C D-M C-M', l: { O: 's', S: 'e' },
})
const fig17 = plane({ B: [0, 0], C: [30, 0], A: [15, 20], D: [19.2, 14.4] }, 110, { s: 'A-B-C-A B-D', ra: ['BDC'] })
const y18 = 5 * s3
const p18: Record<string, P3> = { A: [0, y18, 0], B: [5, 0, 0], C: [10, y18, 0], S: [5, (2 * y18) / 3, Math.sqrt(169 - 100 / 3)] }
const fig18 = solid({ ...p18, M: along3(p18.S, p18.B, 119 / 169), N: along3(p18.S, p18.C, 119 / 169) }, 'A-B-C A-B-S B-C-S C-A-S', 120, {
  seg: 'A-M A-N M-N', l: { N: 'e' },
})

export const M52: EnModel = {
  id: 'en-52',
  title: 'Paralela 45, Testul 21',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 114–115',
  items: [
    { text: 'Suma numerelor prime care divid numărul $420$ este egală cu:', choices: ['$15$', '$17$', '$18$', '$19$'], ans: 1 },
    {
      text: 'În tabelul alăturat sunt prezentate rezultatele obținute de patru elevi la câte un test. Elevii care au același procent de probleme rezolvate din totalul problemelor date la test sunt:\n\n| | Nr. probleme rezolvate | Nr. probleme test |\n|---|---|---|\n| Maria | $15$ | $20$ |\n| Ioana | $20$ | $25$ |\n| Matei | $20$ | $30$ |\n| Alex | $8$ | $10$ |',
      choices: ['Maria și Ioana', 'Ioana și Matei', 'Ioana și Alex', 'Alex și Matei'], ans: 2,
    },
    {
      text: 'Temperaturile medii zilnice din luna ianuarie a anului 2021 sunt înregistrate în tabelul următor.\n\n| Număr zile | $4$ | $10$ | $11$ | $6$ |\n|---|---|---|---|---|\n| Temperatura | $-10^\\circ$C | $-6^\\circ$C | $3^\\circ$C | $6^\\circ$C |\n\nTemperatura medie din luna ianuarie 2021 a fost:',
      choices: ['$-6^\\circ$C', '$-1^\\circ$C', '$-2^\\circ$C', '$3^\\circ$C'], ans: 1,
    },
    { text: 'Inversul numărului $a=0{,}5+0{,}(3)$ este egal cu:', choices: ['$\\dfrac{5}{6}$', '$\\dfrac{6}{5}$', '$\\dfrac{5}{4}$', '$\\dfrac{15}{8}$'], ans: 1 },
    { text: 'Numărul real $x=\\sqrt{3^6+3^7}$ este egal cu:', choices: ['$2\\cdot3^3$', '$\\sqrt{3^{13}}$', '$3^{12}$', '$3^3\\sqrt{3}$'], ans: 0 },
    { text: 'Rareș afirmă: „Reuniunea dintre mulțimea $A=\\{1,\\,2,\\,3,\\,4,\\,5,\\,6\\}$ și mulțimea $B=\\{-1,\\,0,\\,3,\\,7,\\,8,\\,9\\}$ este o mulțime cu douăsprezece elemente”. Afirmația lui Rareș este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$, în această ordine, $AB=3$ cm și $AC=7$ cm. Punctul $D$ este simetricul punctului $B$ față de punctul $A$, iar punctul $E$ este mijlocul segmentului $BC$. Lungimea segmentului $DE$ este egală cu:',
      choices: ['$5$ cm', '$6$ cm', '$7$ cm', '$8$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt desenate două unghiuri adiacente complementare, $AOB$ și $BOC$, și bisectoarele lor, $OM$, respectiv $ON$. Măsura unghiului $MON$ este egală cu:',
      choices: ['$15^\\circ$', '$30^\\circ$', '$45^\\circ$', '$90^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'Figura alăturată reprezintă schița unui covor, având forma unui dreptunghi $ABCD$ cu $AD=4$ m. Modelul covorului este format din triunghiul echilateral $AOD$ și triunghiul dreptunghic $BOC$ cu ipotenuza $BC$. Lungimea $AB$ a covorului este egală cu:',
      choices: ['$4$ m', '$2\\sqrt{3}$ m', '$2(1+\\sqrt{3})$ m', '$8$ m'], ans: 2, fig: fig9,
    },
    {
      text: 'Figura alăturată reprezintă schița unei grădini în formă de romb $ABCD$ cu diagonalele $AC=8$ m și $BD=6$ m. Mijloacele laturilor rombului sunt vârfurile dreptunghiului $MNPQ$, iar în interiorul acestui dreptunghi au fost plantate flori. Aria suprafeței acoperite cu flori este:',
      choices: ['$48\\text{ m}^2$', '$24\\text{ m}^2$', '$12\\text{ m}^2$', '$6\\text{ m}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'Cercul din figura alăturată are centrul în $O$ și raza de $8$ cm. Arcul mic $AB$ al cercului are măsura de $60^\\circ$. Lungimea segmentului $AB$ este:',
      choices: ['$4$ cm', '$4\\sqrt{3}$ cm', '$8$ cm', '$8\\sqrt{3}$ cm'], ans: 2, fig: fig11,
    },
    {
      text: 'O cutie pentru bomboane are forma unui tetraedru regulat cu latura de $10$ cm și este confecționată din carton. Pentru confecționarea cutiei este nevoie de o coală de carton cu suprafața minimă de:',
      choices: ['$40\\text{ cm}^2$', '$100\\text{ cm}^2$', '$150\\text{ cm}^2$', '$100\\sqrt{3}\\text{ cm}^2$'], ans: 3, fig: fig12,
    },

    {
      text: 'Andrei și Bogdan au împreună $210$ lei. Dacă Andrei i-ar da lui Bogdan o șesime din suma pe care o are, atunci Bogdan ar avea jumătate din suma rămasă lui Andrei.',
      parts: [
        { pts: 2, text: 'Este posibil ca Andrei să aibă $162$ de lei? Justifică răspunsul dat.', ans: 'Nu: Andrei i-ar da $27$ de lei, Bogdan ar avea $210-162+27=75$ de lei, iar jumătate din cei $135$ rămași lui Andrei este $67{,}5$' },
        { pts: 3, text: 'Află ce sumă are Andrei.', ans: '$\\dfrac{5x}{6}\\cdot\\dfrac{1}{2}=210-x+\\dfrac{x}{6}$, deci $x=168$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x+1}{x^2+1}:\\left(\\dfrac{x+3}{4x-4}-\\dfrac{1}{x-1}\\right)\\cdot\\left(1-\\dfrac{1}{x+1}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{4x}{x^2+1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: 'Paranteza a doua este $\\dfrac{x+3-4}{4(x-1)}=\\dfrac{1}{4}$, deci $E(x)=\\dfrac{x+1}{x^2+1}\\cdot4\\cdot\\dfrac{x}{x+1}=\\dfrac{4x}{x^2+1}$' },
        { pts: 3, text: 'Demonstrează că $-2<E(x)<2$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: '$-2<E(x)\\Leftrightarrow(x+1)^2>0$, adevărat pentru $x\\ne-1$; $E(x)<2\\Leftrightarrow(x-1)^2>0$, adevărat pentru $x\\ne1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\dfrac{12-4x}{3}$.',
      parts: [
        { pts: 2, text: 'Calculează $f(1)\\cdot f(2)\\cdot f(3)\\cdot f(4)$.', ans: '$f(3)=0$, deci produsul este $0$' },
        { pts: 3, text: 'Dacă $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, determină lungimea segmentului $AB$.', ans: '$A(3,\\,0)$, $B(0,\\,4)$; în triunghiul dreptunghic $AOB$: $AB=\\sqrt{9+16}=5$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat dreptunghiul $ABCD$ de centru $O$, cu $AB=6\\sqrt{3}$ cm și $AO=6$ cm. Fie $M$ simetricul punctului $O$ față de punctul $B$ și $S$ punctul de intersecție dintre dreptele $AB$ și $CM$.',
      parts: [
        { pts: 2, text: 'Arată că aria dreptunghiului $ABCD$ este egală cu $36\\sqrt{3}\\text{ cm}^2$.', ans: '$AC=12$ cm, $BC=\\sqrt{144-108}=6$ cm, $\\mathcal{A}_{ABCD}=6\\sqrt{3}\\cdot6=36\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Află lungimea segmentului $SB$.', ans: '$MB=BO=6$ cm, $MD=18$ cm; $\\triangle MBS\\sim\\triangle MDC$, deci $\\dfrac{SB}{CD}=\\dfrac{MB}{MD}=\\dfrac{1}{3}$ și $SB=2\\sqrt{3}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul isoscel $ABC$ cu $AB=AC=25$ cm și $BC=30$ cm.',
      parts: [
        { pts: 2, text: 'Arată că aria triunghiului $ABC$ este egală cu $300\\text{ cm}^2$.', ans: 'Cu $AM\\perp BC$, $M\\in BC$: $AM=20$ cm și $\\mathcal{A}_{ABC}=\\dfrac{20\\cdot30}{2}=300\\text{ cm}^2$' },
        { pts: 3, text: 'Dacă punctul $D$ aparține dreptei $AC$ astfel încât $BD=24$ cm, demonstrează că dreptele $AC$ și $BD$ sunt perpendiculare.', ans: "Fie $BD'\\perp AC$, $D'\\in AC$: $BD'=\\dfrac{2\\cdot300}{25}=24$ cm $=BD$; dacă $D\\ne D'$, atunci $BD>BD'$, fals; deci $D=D'$ și $BD\\perp AC$" },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida triunghiulară regulată $SABC$ cu latura bazei $AB=10$ cm și muchia laterală $SA=13$ cm. Punctele $M$ și $N$ sunt proiecțiile punctului $A$ pe dreptele $SB$, respectiv $SC$.',
      parts: [
        { pts: 2, text: 'Arată că aria feței $SBC$ este egală cu $60\\text{ cm}^2$.', ans: 'Cu $SP\\perp BC$, $P\\in BC$: $SP=\\sqrt{169-25}=12$ cm și $\\mathcal{A}_{SBC}=\\dfrac{12\\cdot10}{2}=60\\text{ cm}^2$' },
        { pts: 3, text: 'Demonstrează că dreapta $MN$ este paralelă cu planul $ABC$.', ans: '$\\triangle ASM\\equiv\\triangle ASN$ (ipotenuza $AS$ comună, $\\sphericalangle ASB=\\sphericalangle ASC$), deci $SM=SN$, $\\dfrac{SM}{SB}=\\dfrac{SN}{SC}$ și $MN\\parallel BC$; cum $BC\\subset(ABC)$ și $MN\\not\\subset(ABC)$, $MN\\parallel(ABC)$' },
      ],
      fig: fig18,
    },
  ],
}
