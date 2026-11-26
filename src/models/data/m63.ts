// Testul 32 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 136–138; every answer here is computed and checked with the book's answers, p. 281).
import type { EnModel } from '../types'
import { mid, plane } from '../figure'
import { graph, pol } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [6, 0], C: [16, 0] }, 170, { s: 'A-C', dot: 'A B C', l: { A: 'n', B: 'n', C: 'n' } })
const A8 = pol(70, (10 * Math.sin((50 * Math.PI) / 180)) / Math.sin((60 * Math.PI) / 180))
const fig8 = plane({ B: [0, 0], C: [10, 0], A: A8, M: mid(A8, [0, 0]), N: mid(A8, [10, 0]) }, 130, { s: 'A-B-C-A M-N', ang: ['BAC', 'ABC'] })
const fig9 = plane({ C: [0, 0], B: [12, 0], A: [6, 6 * s3], D: [0, 6 * s3] }, 120, { s: 'A-B-C-D-A A-C', ra: ['ADC'] })
const h10 = 15 * s2
const fig10 = plane({
  A: [-h10, 0], B: [0, -h10], C: [h10, 0], D: [0, h10], E: [0, 0], F: [h10, -h10], G: [2 * h10, 0], H: [h10, h10], P: [h10 / 2, h10 / 2], Q: [h10 / 2, -h10 / 2],
}, 140, { s: 'A-B-C-D-A E-F-G-H-E', hatch: ['E-P-C-Q'], l: { P: '', Q: '', E: 'w', C: 'e' } })
const fig11 = plane({ O: [0, 0], R: pol(30, 4 * s3) }, 90, { s: 'O-R', c: [{ at: 'O', r: 4 * s3 }], dot: 'O', l: { R: '', O: 'w' }, t: [{ at: [3, 2.6], s: 'r', italic: true }] })
const f12 = plane({ O: [0, 0], A: [7, 0], B: [-7, 0], "O'": [0, 7], "A'": [3, 7], "B'": [-3, 7] }, 110, { s: "A-A' B-B' O'-A'", d: "O-O' O-A", dot: "O O'", l: { B: '', "B'": '', O: 's' } })
const r12 = f12.p.A[0] - f12.p.O[0], q12 = f12.p["A'"][0] - f12.p["O'"][0]
const fig12 = { ...f12, e: [{ at: f12.p.O, rx: r12, ry: r12 / 4, back: true }, { at: f12.p["O'"], rx: q12, ry: q12 / 4 }] }

const fig15 = graph({ A: [1, 3], B: [2, 4], L1: [-3, -1], L2: [3, 5] }, 110, [-3.5, 3.5], [-1.5, 5.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'se', B: 'se' } })
const fig16 = plane({ A: [0, 0], B: [8, 0], C: [5, 4], D: [0, 4], E: [3, 0] }, 120, { s: 'A-B-C-D-A D-B', dot: 'E', ra: ['DAB'], l: { E: 's' } })
const k17 = 2 * s2
const fig17 = plane({
  D: [0, 0], C: [4, 0], A: [0, -4], B: [4, -4], F: [k17, k17], E: [4 + k17, k17], O: [2, -2], M: [2, 0], Q: [2 + k17 / 2, k17 / 2],
}, 120, { s: 'A-B-C-D-A D-F-E-C D-E D-B O-M M-Q', dot: 'O M Q' })
// drawn flat, as in the book (the panel ABCD in front, the support ABEF behind it)
const fig18 = plane({
  A: [0, 0], B: [6, -0.5], C: [6, 4.5], D: [0, 5], M: [0, 2.5], N: [6, 2], F: [-1.5, 0.9], E: [4.5, 0.4],
}, 150, { s: 'A-B-C-D-A F-A F-M', d: 'F-E E-B E-N', l: { F: 'w', E: 'n' }, t: [{ at: [3, 3.6], s: 'PUBLICITATE', anchor: 'middle', size: 10 }] })

export const M63: EnModel = {
  id: 'en-63',
  title: 'Paralela 45, Testul 32',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 136–138',
  items: [
    { text: 'Cel mai mic multiplu comun al numerelor $18$ și $24$ este:', choices: ['$6$', '$24$', '$72$', '$144$'], ans: 2 },
    { text: 'Un obiect costă $8$ lei, iar după o scumpire prețul său devine $10$ lei. Procentul cu care s-a realizat scumpirea este:', choices: ['$10\\%$', '$20\\%$', '$25\\%$', '$40\\%$'], ans: 2 },
    {
      text: 'În tabelul de mai jos este înregistrată evoluția temperaturii medii din Moldova, în cinci luni consecutive.\n\n| Luna | Noiembrie | Decembrie | Ianuarie | Februarie | Martie |\n|---|---|---|---|---|---|\n| Temperatura medie | $0^\\circ$C | $-3^\\circ$C | $-9^\\circ$C | $-5^\\circ$C | $+8^\\circ$C |\n\nDiferența dintre cea mai scăzută temperatură medie și cea mai ridicată temperatură medie (în această ordine) este:',
      choices: ['$-17^\\circ$C', '$-8^\\circ$C', '$8^\\circ$C', '$17^\\circ$C'], ans: 0,
    },
    { text: 'Fracția ireductibilă echivalentă cu $\\dfrac{60}{84}$ este:', choices: ['$\\dfrac{15}{21}$', '$\\dfrac{30}{42}$', '$\\dfrac{5}{7}$', '$\\dfrac{2}{3}$'], ans: 2 },
    { text: 'Media geometrică a numerelor $6\\sqrt{3}$ și $\\sqrt{12}$ este:', choices: ['$3\\sqrt{3}$', '$6$', '$4\\sqrt{3}$', '$36$'], ans: 1 },
    { text: 'Un drum de la Iași la București are $400$ km, iar viteza maximă permisă pe acest drum este de $90$ km/h. Leon spune că poate parcurge acest drum în $4$ ore și $30$ de minute, fără a depăși viteza legală. Afirmația lui Leon este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ sunt coliniare, în această ordine, astfel încât lungimea segmentului $BC$ este cu $4$ cm mai mare decât lungimea segmentului $AB$, iar lungimile segmentelor $AB$ și $BC$ sunt direct proporționale cu $3$ și $5$. Lungimea segmentului $AC$ este egală cu:',
      choices: ['$16$ cm', '$17$ cm', '$18$ cm', '$19$ cm'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată punctele $M$ și $N$ sunt mijloacele laturilor $AB$, respectiv $AC$ ale triunghiului $ABC$. Dacă măsura unghiului $A$ este $60^\\circ$ și măsura unghiului $B$ este $70^\\circ$, atunci măsura unghiului $ANM$ este:',
      choices: ['$40^\\circ$', '$50^\\circ$', '$60^\\circ$', '$70^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul dreptunghic $ABCD$ având $AD\\parallel BC$ și măsura unghiului $ADC$ egală cu $90^\\circ$. Triunghiul $ABC$ este echilateral cu perimetrul egal cu $36$ cm. Perimetrul trapezului $ABCD$ este egal cu:',
      choices: ['$(30+4\\sqrt{3})$ cm', '$6(5+\\sqrt{3})$ cm', '$30$ cm', '$54\\sqrt{3}$ cm'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este desenat modelul unei ii format din două pătrate $ABCD$ și $EFGH$, astfel încât $AB=EF=30$ cm și $C$ este centrul lui $EFGH$, iar $E$ este centrul lui $ABCD$. Aria suprafeței hașurate este egală cu:',
      choices: ['$60\\text{ cm}^2$', '$225\\text{ cm}^2$', '$450\\text{ cm}^2$', '$900\\text{ cm}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc $\\mathcal{C}(O,\\,r)$. Aria discului mărginit de acest cerc este egală cu $48\\pi\\text{ cm}^2$. Lungimea cercului este:',
      choices: ['$8\\sqrt{3}$ cm', '$14\\pi$ cm', '$8\\pi\\sqrt{3}$ cm', '$16\\pi$ cm'], ans: 2, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentat un trunchi de con circular drept, cu raza bazei mari $OA=7$ cm, raza bazei mici $O'A'=3$ cm și generatoarea $AA'=5$ cm. Aria laterală a trunchiului de con este egală cu:",
      choices: ['$10\\pi\\text{ cm}^2$', '$15\\pi\\text{ cm}^2$', '$35\\pi\\text{ cm}^2$', '$50\\pi\\text{ cm}^2$'], ans: 3, fig: fig12,
    },

    {
      text: 'Notăm cu $n$ un număr natural care, împărțit pe rând la $12$ și la $18$, dă câturile nenule și același rest, $7$.',
      parts: [
        { pts: 2, text: 'Este posibil ca $n$ să fie $43$? Justifică răspunsul dat.', ans: 'Da: $43=12\\cdot3+7=18\\cdot2+7$' },
        { pts: 3, text: 'Află toate valorile lui $n$ pentru care $100<n<200$.', ans: '$n-7=12c_1=18c_2$, deci $n=36k+7$, $k\\in\\mathbb{N}^*$; $n\\in\\{115,\\,151,\\,187\\}$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(x-\\dfrac{1}{1-x}\\right):\\dfrac{x^2-x+1}{x^2-2x+1}$, $x\\in\\mathbb{R}\\setminus\\{1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=x-1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{1\\}$.', ans: '$E(x)=\\dfrac{x^2-x+1}{x-1}\\cdot\\dfrac{(x-1)^2}{x^2-x+1}=x-1$' },
        { pts: 3, text: 'Rezolvă ecuația $|2E(x)-1|=1$, unde $x\\in\\mathbb{R}\\setminus\\{1\\}$.', ans: '$|2x-3|=1\\Leftrightarrow x\\in\\{1,\\,2\\}$; cum $x\\neq1$, $x=2$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=mx+n$, unde $m$ și $n$ sunt numere reale.',
      parts: [
        { pts: 2, text: 'Dacă punctele $A(1,\\,3)$ și $B(2,\\,4)$ aparțin graficului funcției $f$, determină $m$ și $n$.', ans: '$m+n=3$, $2m+n=4$, deci $m=1$, $n=2$' },
        { pts: 3, text: 'Pentru $m=1$ și $n=2$ determină unghiul format de reprezentarea grafică a funcției $f$ cu axa $Ox$, a sistemului de axe ortogonale $xOy$.', ans: 'Graficul taie axele în $(-2,\\,0)$ și $(0,\\,2)$, triunghi dreptunghic isoscel, deci unghiul este de $45^\\circ$' },
      ],
      fig: fig15,
    },
    {
      text: 'Trapezul dreptunghic $ABCD$ din figura alăturată are măsura unghiului $A$ de $90^\\circ$ și bazele $AB=8$ cm, $CD=5$ cm. Diagonala $BD$ este bisectoarea unghiului $ABC$.',
      parts: [
        { pts: 2, text: 'Arată că $AD=4$ cm.', ans: '$\\sphericalangle CDB=\\sphericalangle ABD=\\sphericalangle CBD$, deci $CB=CD=5$ cm; proiecția lui $BC$ pe $AB$ este $8-5=3$ cm, deci $AD=4$ cm' },
        { pts: 3, text: 'Dacă punctul $E$ aparține laturii $AB$, astfel încât $AE=3$ cm, demonstrează că dreptele $BD$ și $CE$ sunt perpendiculare.', ans: '$EB=BC=CD=DE=5$ cm, deci $EBCD$ este romb și $CE\\perp BD$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată $ABCD$ este pătrat, iar $DCEF$ este romb cu măsura unghiului $CDF$ egală cu $45^\\circ$.',
      parts: [
        { pts: 2, text: 'Arată că punctele $A$, $C$ și $E$ sunt coliniare.', ans: '$\\sphericalangle ACD+\\sphericalangle DCE=45^\\circ+135^\\circ=180^\\circ$' },
        { pts: 3, text: 'Dacă $O$, $M$, $Q$ sunt mijloacele segmentelor $DB$, $DC$, respectiv $DE$, demonstrează că $OM=QM$.', ans: '$OM$ și $QM$ sunt mediane în triunghiurile dreptunghice $DOC$ și $DQC$, deci $OM=\\dfrac{DC}{2}=QM$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentat un panou publicitar format din două dreptunghiuri $ABCD$ și $ABEF$, situate în plane diferite și fixate cu tijele $FM$ și $EN$, unde $M$ și $N$ sunt mijloacele segmentelor $AD$, respectiv $BC$. Se știe că $AB=1{,}2$ m, $AD=2$ m, $FD=\\sqrt{3}$ m, $FM=1$ m.',
      parts: [
        { pts: 2, text: 'Arată că punctele $D$, $C$, $E$ și $F$ sunt coplanare.', ans: '$DC\\parallel AB$ și $AB\\parallel EF$, deci $DC\\parallel EF$, iar punctele $D$, $C$, $E$, $F$ sunt coplanare' },
        { pts: 3, text: 'Calculează aria suportului $ABEF$.', ans: '$FM=AM=MD=1$ m, deci $\\sphericalangle AFD=90^\\circ$ și $AF=\\sqrt{4-3}=1$ m; aria este $1{,}2\\text{ m}^2$' },
      ],
      fig: fig18,
    },
  ],
}
