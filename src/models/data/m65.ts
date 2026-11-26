// Testul 34 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 141–143; every answer here is computed and checked with the book's answers, p. 282).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { BOX, graph, pol, PRISM3, prism3 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [5, 0], C: [7, 0], D: [8, 0], E: [11, 0] }, 210, {
  s: 'A-E', dot: 'A B C D E', l: { A: 's', B: 's', C: 's', D: 's', E: 's' },
  t: [{ at: [2.5, 0.5], s: '5 km', anchor: 'middle', size: 9 }, { at: [6, 0.5], s: '2 km', anchor: 'middle', size: 9 }, { at: [7.5, 0.5], s: '1 km', anchor: 'middle', size: 9 }, { at: [9.5, 0.5], s: '3 km', anchor: 'middle', size: 9 }],
})
const A8 = pol(60, (10 * Math.sin((48 * Math.PI) / 180)) / Math.sin((72 * Math.PI) / 180))
const fig8 = plane({ B: [0, 0], C: [10, 0], A: A8, M: [A8[0] + 0.3 * (A8[0] - 10), A8[1] * 1.3], N: [-0.3 * A8[0], -0.3 * A8[1]] }, 120, { s: 'M-C A-N B-C' })
const fig9 = plane({ B: [0, 0], C: [6 * s3, 0], A: [3 * s3, 3] }, 120, { s: 'A-B-C-A' })
const fig10 = plane({ A: [0, 0], B: [12, 0], C: [8, 5], D: [2, 5], M: [1, 2.5] }, 120, { s: 'A-B-C-D-A M-B M-C', hatch: ['B-M-C'], l: { M: 'w' } })
const fig11 = plane({ O: [0, 0], Q: [6, 0], A: [3, 3 * s3], B: [3, -3 * s3] }, 120, { dot: 'O Q A B', c: [{ at: 'O', r: 6 }, { at: 'Q', r: 6 }], l: { O: 'w', Q: 'e', A: 'n', B: 's' } })
const fig12 = solid(prism3(12, 12), PRISM3, 110)

const fig15 = graph({ A: [1.5, 0], B: [0, -3], L1: [-0.5, -4], L2: [3, 3] }, 110, [-2, 4], [-5, 3.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'se', B: 'e' } })
const fig16 = plane({ A: [0, 0], B: [8, 0], C: [0, 6], D: [3, 0] }, 130, { s: 'A-B-C-A C-D', ra: ['BAC'] })
const fig17 = plane({ A: [0, 0], B: [15, 0], C: [15, 20], D: [0, 20], E: [9.6, 7.2] }, 110, { s: 'A-B-C-D-A B-D A-E', ra: ['AEB'] })
// drawn as in the book: taller than the real height 3, the small base wider than 2
const fig18 = solid({
  A: [0, 0, 0], B: [10, 0, 0], C: [10, 10, 0], D: [0, 10, 0], "A'": [3, 3, 6], "B'": [7, 3, 6], "C'": [7, 7, 6], "D'": [3, 7, 6], O: [5, 5, 0], "O'": [5, 5, 6],
}, BOX, 130, { seg: "O-O'", dot: "O O'" })

export const M65: EnModel = {
  id: 'en-65',
  title: 'Paralela 45, Testul 34',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 141–143',
  items: [
    { text: 'Suma numerelor prime mai mici decât douăzeci este:', choices: ['$60$', '$64$', '$77$', '$92$'], ans: 2 },
    { text: 'Numărul natural nenul $x$ pentru care $\\dfrac{6}{x}=\\dfrac{3x}{2}$ este:', choices: ['$4$', '$2$', '$-2$', '$3$'], ans: 1 },
    { text: 'Suma numerelor întregi din intervalul $(-10,\\,7]$ este:', choices: ['$-27$', '$-17$', '$0$', '$17$'], ans: 1 },
    {
      text: 'Un bazin gol poate fi umplut cu apă, deschizând oricare dintre robinetele $R_1$, $R_2$, $R_3$, după cum se poate vedea în tabelul alăturat.\n\n| Robinetul | $R_1$ | $R_2$ | $R_3$ |\n|---|---|---|---|\n| Timpul de umplere a bazinului | $4$ h | $6$ h | $12$ h |\n\nDacă sunt deschise toate cele trei robinete, atunci bazinul gol se umple în:',
      choices: ['$1$ h', '$2$ h', '$3$ h', '$6$ h'], ans: 1,
    },
    {
      text: 'Fie mulțimea $A=\\left\\{-5;\\ -\\dfrac{2}{\\sqrt{13}};\\ -0{,}3;\\ 1{,}(4);\\ \\sqrt{3};\\ 3\\right\\}$. Care dintre următoarele afirmații nu este adevărată?',
      choices: ['Un singur element al mulțimii $A$ este număr natural.', 'Un singur element al mulțimii $A$ este număr întreg.', 'În mulțimea $A$ sunt patru numere raționale.', 'În mulțimea $A$ sunt două numere iraționale.'], ans: 1,
    },
    { text: 'Mașina lui Andrei are un rezervor de $46\\ \\ell$ și consumă $6\\ \\ell$ de benzină pentru a parcurge $100$ de km. Andrei spune că poate parcurge $800$ km, plecând cu rezervorul plin și fără să alimenteze pe parcurs. Afirmația lui Andrei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, $A$, $B$, $C$, $D$, $E$ sunt obiective turistice situate pe un traseu, acestea sunt situate pe o dreaptă $a$, iar distanța dintre ele este indicată pe figură. Un turist pleacă din punctul $C$, vizitează obiectivul $E$, apoi se întoarce, vizitează obiectivul $D$, apoi vizitează obiectivul $A$. Lungimea drumului parcurs de turist este egală cu:',
      choices: ['$10$ km', '$12$ km', '$14$ km', '$15$ km'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$ și două dintre unghiurile sale exterioare. Dacă $\\sphericalangle MAB=108^\\circ$ și $\\sphericalangle CBN=120^\\circ$, atunci măsura unghiului $ACB$ este:',
      choices: ['$132^\\circ$', '$48^\\circ$', '$72^\\circ$', '$60^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi isoscel $ABC$, având baza $BC=6\\sqrt{3}$ cm și $\\sphericalangle A=120^\\circ$. Lungimea proiecției ortogonale a segmentului $BC$ pe dreapta $AB$ este egală cu:',
      choices: ['$3\\sqrt{3}$ cm', '$9$ cm', '$3$ cm', '$12\\sqrt{3}$ cm'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez $ABCD$ cu aria de $60\\text{ cm}^2$ și $AB\\parallel CD$. Dacă punctul $M$ este mijlocul laturii $AD$, atunci aria triunghiului $BMC$ este egală cu:',
      choices: ['$20\\text{ cm}^2$', '$30\\text{ cm}^2$', '$40\\text{ cm}^2$', '$50\\text{ cm}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată sunt desenate două cercuri, cu centrele în $O$ și $Q$, astfel încât fiecare cerc are centrul pe celălalt cerc. Cele două cercuri se intersectează în $A$ și $B$. Dacă $OQ=6$ cm, atunci lungimea segmentului $AB$ este:',
      choices: ['$6$ cm', '$4\\sqrt{3}$ cm', '$6\\sqrt{3}$ cm', '$12$ cm'], ans: 2, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentată o prismă triunghiulară regulată $ABCA'B'C'$ ale cărei fețe laterale sunt pătrate cu aria egală cu $144\\text{ cm}^2$. Volumul prismei este egal cu:",
      choices: ['$432\\text{ cm}^3$', '$36\\sqrt{3}\\text{ cm}^3$', '$432\\sqrt{3}\\text{ cm}^3$', '$108\\sqrt{3}\\text{ cm}^3$'], ans: 2, fig: fig12,
    },

    {
      text: 'La un test cu $20$ de întrebări se acordă $2$ puncte pentru un răspuns corect și se scad $5$ puncte pentru un răspuns greșit sau lipsă.',
      parts: [
        { pts: 2, text: 'Află punctajul maxim posibil și punctajul minim posibil.', ans: 'Maxim $40$ de puncte, minim $-100$ de puncte' },
        { pts: 3, text: 'Dacă Andrei a obținut la test $19$ puncte, determină la câte întrebări a răspuns el corect.', ans: '$2c-5(20-c)=19$, deci $c=17$ întrebări' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x^2+4}{2x}-2\\right):\\left(\\dfrac{2x^2+4x}{x^2+4x+4}-1\\right)\\cdot\\left(\\dfrac{1}{x+2}+\\dfrac{1}{x-2}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $\\dfrac{2x^2+4x}{x^2+4x+4}-1=\\dfrac{x-2}{x+2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2\\}$.', ans: '$\\dfrac{x^2-4}{(x+2)^2}=\\dfrac{x-2}{x+2}$' },
        { pts: 3, text: 'Demonstrează că $[E(x)-2]^{100}=1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.', ans: '$E(x)=\\dfrac{(x-2)^2}{2x}\\cdot\\dfrac{x+2}{x-2}\\cdot\\dfrac{2x}{(x+2)(x-2)}=1$, deci $(1-2)^{100}=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-3$.',
      parts: [
        { pts: 2, text: 'Determină coordonatele punctelor $A$ și $B$, intersecțiile reprezentării grafice a funcției $f$ cu axa $Ox$, respectiv axa $Oy$ ale unui sistem de axe ortogonale $xOy$.', ans: '$A\\left(\\dfrac{3}{2},\\,0\\right)$, $B(0,\\,-3)$' },
        { pts: 3, text: 'Determină coordonatele punctelor de pe reprezentarea grafică a funcției $f$ care se află la $3$ unități de originea $O$ a sistemului $xOy$.', ans: '$x^2+(2x-3)^2=9\\Leftrightarrow x\\in\\left\\{0,\\,\\dfrac{12}{5}\\right\\}$: $P_1(0,\\,-3)$ și $P_2\\left(\\dfrac{12}{5},\\,\\dfrac{9}{5}\\right)$' },
      ],
      fig: fig15,
    },
    {
      text: 'Triunghiul dreptunghic $ABC$ din figura alăturată are ipotenuza $BC=10$ cm și cateta $AC=6$ cm. Punctul $D$ aparține dreptei $AB$, astfel încât $AD=3$ cm.',
      parts: [
        { pts: 2, text: 'Află distanța de la punctul $D$ la dreapta $BC$.', ans: 'Fie $DE\\perp BC$, $E\\in BC$: $DE\\cdot BC=CA\\cdot BD$, deci $DE=\\dfrac{6\\cdot5}{10}=3$ cm' },
        { pts: 3, text: 'Demonstrează că $CD$ este bisectoarea unghiului $ACB$.', ans: '$\\triangle CAD\\equiv\\triangle CED$ (IC), deci $\\sphericalangle ACD=\\sphericalangle ECD$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este desenat dreptunghiul $ABCD$, cu $AB=15$ cm, $BC=20$ cm. Punctul $E$ este proiecția lui $A$ pe $BD$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea segmentului $BE$.', ans: '$BD=25$ cm, $BE=\\dfrac{AB^2}{BD}=9$ cm' },
        { pts: 3, text: 'Determină distanța de la punctul $E$ la dreapta $CD$.', ans: 'Fie $EF\\perp CD$, $F\\in CD$: $\\triangle DEF\\sim\\triangle DBC$, deci $\\dfrac{EF}{20}=\\dfrac{16}{25}$, $EF=12{,}8$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat acoperișul unei case $ABCDA'B'C'D'$ în formă de trunchi de piramidă patrulateră regulată cu latura bazei mari $AB=10$ m, latura bazei mici $A'B'=2$ m și înălțimea $OO'=3$ m ($O$ și $O'$ fiind centrele bazelor).",
      parts: [
        { pts: 2, text: 'Calculează câți metri pătrați de tablă sunt necesari pentru acest acoperiș (acoperim cu tablă suprafața laterală și baza mică a trunchiului, iar pierderile le considerăm neglijabile).', ans: "Apotema trunchiului $MM'=5$ m; $\\mathcal{A}_l=4\\cdot\\dfrac{(10+2)\\cdot5}{2}=120\\text{ m}^2$, plus baza mică $4\\text{ m}^2$: $124\\text{ m}^2$" },
        { pts: 3, text: "Determină distanța de la punctul $O$ la fața laterală $BCC'B'$.", ans: "Perpendiculara din $O$ pe $MM'$ este perpendiculara pe planul $(BCC')$; în trapezul $OMM'O'$: $d=\\dfrac{OM\\cdot OO'}{MM'}=\\dfrac{5\\cdot3}{5}=3$ m" },
      ],
      fig: fig18,
    },
  ],
}
