// Model E.N. 2 - simulare (the book's pages 112–114)
import type { EnModel } from '../types'
import { meet, type Pt } from '../figure'

const A11: Pt = [40, 12], B11: Pt = [180, 12], C11: Pt = [160, 82], D11: Pt = [20, 82]

const A18: Pt = [30, 160], B18: Pt = [130, 160], C18: Pt = [175, 125], D18: Pt = [75, 125]
const O18 = meet(A18, C18, B18, D18)
const V18: Pt = [O18[0], 14]

export const M2: EnModel = {
  id: 'en-2',
  title: 'Model E.N. 2 - simulare',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 112–114',
  items: [
    { text: 'Rezultatul calculului $56:7-5+2$ este egal cu:', choices: ['$14$', '$1$', '$6$', '$5$'], ans: 3 },
    { text: 'Mulțimea soluțiilor inecuației $3x-6\\le 0$ este intervalul:', choices: ['$(-\\infty;2)$', '$(-\\infty;-2)$', '$(-\\infty;2]$', '$(-\\infty;-2]$'], ans: 2 },
    { text: 'Probabilitatea ca la aruncarea unui zar să obținem fața cu numărul de puncte multiplu de $3$ este egală cu:', choices: ['$\\dfrac{1}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{1}{6}$', '$\\dfrac{1}{4}$'], ans: 0 },
    { text: 'Dacă $x\\cdot y=36$ și $y\\cdot z=99$, aflați $x+y+z$ dacă cele trei numere naturale sunt diferite de $1$.', choices: ['$24$', '$\\{24;48\\}$', '$48$', 'orice număr natural'], ans: 1 },
    {
      text: 'Tabelul prezintă notele obținute de elevii unei clase la o lucrare de matematică.\n\n| Nr. elevi | 2 | 8 | 3 | 6 | 5 | 4 |\n|---|---|---|---|---|---|---|\n| Nota | 5 | 6 | 7 | 8 | 9 | 10 |\n\nNumărul de elevi care au luat cel puțin nota $8$ este egal cu:',
      choices: ['$9$', '$15$', '$13$', '$19$'], ans: 1,
    },
    { text: 'Propoziția „$(x+a)^2-x(x+2a)$ este pătrat perfect pentru oricare numere $x$ și $a$ reale.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'Știind că $\\sphericalangle ABC=180^\\circ$, care din următoarele afirmații este adevărată:',
      choices: ['„$A$, $B$, $C$ sunt coliniare”', '„$AB=BC$”', '„$\\sphericalangle ACB=180^\\circ$”', '„$\\sphericalangle BAC=90^\\circ$”'], ans: 0,
      fig: { w: 160, h: 34, p: { A: [15, 24], B: [80, 24], C: [145, 24] }, l: { A: 'n', B: 'n', C: 'n' }, s: 'A-C', dot: 'A B C' },
    },
    {
      text: 'Dacă $ABCD$ este un paralelogram, atunci $\\sphericalangle ABC$ și $\\sphericalangle BCD$ sunt unghiuri:',
      choices: ['egale', 'complementare', 'corespondente', 'interne de aceeași parte a secantei'], ans: 3,
      fig: { w: 180, h: 80, p: { A: [35, 14], B: [165, 14], C: [145, 66], D: [15, 66] }, s: 'A-B-C-D-A' },
    },
    {
      text: 'În triunghiul isoscel $ABC$ se cunosc: $AB=AC$, $BC=12$ cm, perimetrul $\\triangle ABC$ este de $32$ cm și $D$ este mijlocul lui $BC$. Perimetrul triunghiului $ABD$ este de:',
      choices: ['$16$ cm', '$24$ cm', '$20$ cm', '$18$ cm'], ans: 1,
      fig: { w: 130, h: 105, p: { A: [65, 12], B: [15, 88], D: [65, 88], C: [115, 88] }, l: { D: 's' }, s: 'A-B-C-A A-D', ra: ['ADC'] },
    },
    {
      text: 'Aria unui romb $ABCD$ care are $\\sphericalangle A=60^\\circ$ și $BD=6$ cm este egală cu:',
      choices: ['$18\\sqrt{2}\\text{ cm}^2$', '$36\\text{ cm}^2$', '$18\\text{ cm}^2$', '$18\\sqrt{3}\\text{ cm}^2$'], ans: 3,
      fig: { w: 95, h: 120, p: { A: [47, 12], B: [17, 60], C: [47, 108], D: [77, 60] }, s: 'A-B-C-D-A B-D' },
    },
    {
      text: 'Aria unui paralelogram $ABCD$ este $96\\text{ cm}^2$. Dacă $AC\\cap BD=\\{O\\}$, atunci aria $\\triangle AOB$ este egală cu:',
      choices: ['$48\\text{ cm}^2$', '$32\\text{ cm}^2$', '$24\\text{ cm}^2$', '$16\\text{ cm}^2$'], ans: 2,
      fig: { w: 200, h: 95, p: { A: A11, B: B11, C: C11, D: D11, O: meet(A11, C11, B11, D11) }, l: { O: 'n' }, s: 'A-B-C-D-A A-C B-D' },
    },
    {
      text: 'Dacă un tetraedru regulat are muchia de $6$ cm, atunci aria totală este egală cu:',
      choices: ['$36\\sqrt{3}\\text{ cm}^2$', '$36\\sqrt{2}\\text{ cm}^2$', '$72\\sqrt{3}\\text{ cm}^2$', '$144\\text{ cm}^2$'], ans: 0,
      fig: { w: 140, h: 115, p: { A: [60, 12], B: [14, 80], C: [72, 102], D: [125, 74] }, s: 'A-B-C-D-A A-C', d: 'B-D' },
    },

    {
      text: 'Într-o clasă sunt $25$ de elevi. Dacă ar pleca un băiat și ar mai veni două fete, atunci numărul băieților ar fi cu $2$ mai mic decât numărul fetelor.',
      parts: [
        { pts: 2, text: 'Să se afle câți băieți sunt în clasă.', ans: '$13$ băieți' },
        { pts: 3, text: 'Câți băieți ar mai trebui să vină pentru ca numărul lor să fie egal cu dublul numărului fetelor?', ans: '$11$ băieți' },
      ],
    },
    {
      text: 'Fie $E(x)=(2x+1)^2-3(x-2)(2+x)+4x+3$.',
      parts: [
        { pts: 2, text: 'Calculați $E(-2)-E(-6)$.', ans: '$0$' },
        { pts: 3, text: 'Arătați că $E(x)\\ge 0$ pentru orice $x\\in\\mathbb{R}$.', ans: '$E(x)=(x+4)^2\\ge 0$' },
      ],
    },
    {
      text: 'Fie numerele $a=\\left(\\dfrac{10}{\\sqrt{5}}+3\\right)^2-(2+\\sqrt{5})^2$ și $b=\\left(\\dfrac{15}{\\sqrt{5}}+1\\right)^2$.',
      parts: [
        { pts: 2, text: 'Arătați că $a\\in(14\\sqrt{5};38)$.', ans: '$a=20+8\\sqrt{5}$' },
        { pts: 3, text: 'Calculați media aritmetică a lui $a$ și $b$.', ans: '$b=46+6\\sqrt{5}$, media este $33+7\\sqrt{5}$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat un teren împărțit în trei loturi $ABFE$, $DEFG$ și $GCBF$, cu $EF\\parallel AB$ și $GF\\parallel BC$, $[DE]\\equiv[EF]$, $AB=80$ m, $BC=60$ m, $DE=40$ m.',
      parts: [
        { pts: 2, text: 'Câți metri de sârmă sunt necesari pentru a delimita cele trei loturi dacă se folosesc câte patru rânduri de sârmă pentru fiecare delimitare?', ans: '$4(280+80+20\\sqrt{5})=1440+80\\sqrt{5}$ m' },
        { pts: 3, text: 'Arătați că, oriunde am așeza doi stâlpi de curent electric, distanța dintre ei este cel mult $100$ m.', ans: 'cea mai mare distanță este diagonala $AC=100$ m' },
      ],
      fig: { w: 195, h: 150, p: { A: [15, 135], B: [175, 135], C: [175, 15], D: [15, 15], E: [15, 95], F: [95, 95], G: [95, 15] }, l: { E: 'w', F: 'ne', G: 'n' }, s: 'A-B-C-D-A E-F-G F-B' },
    },
    {
      text: 'În figura alăturată punctele $B$ și $C$ sunt diametral opuse în cercul de centru $O$, iar punctele $C$ și $E$ sunt diametral opuse în cercul de centru $Q$. Se știe că $A$ se află pe cercul de centru $O$ și $A\\in CE$, iar $D$ se află pe cercul de centru $Q$ și $D\\in BC$. Știind că $AC=6$ cm, $AB=6\\sqrt{3}$ cm și $DE=18$ cm, aflați:',
      parts: [
        { pts: 2, text: 'raza cercului de centru $O$.', ans: '$BC=12$ cm, raza este $6$ cm' },
        { pts: 3, text: 'raza cercului de centru $Q$.', ans: '$\\sphericalangle DCE=\\sphericalangle ACB=60^\\circ$, $CE=12\\sqrt{3}$ cm, raza este $6\\sqrt{3}$ cm' },
      ],
      fig: {
        w: 180, h: 200,
        p: { B: [112.6, 15.5], O: [119.2, 51], C: [125.1, 86.5], A: [152.7, 63.3], Q: [77.3, 126.5], E: [29.6, 166.6], D: [135.9, 147.8] },
        l: { O: 'w', C: 'e', Q: 'w', A: 'e', D: 'e' },
        c: [{ at: 'O', r: 36 }, { at: 'Q', r: 62.3 }], s: 'B-D A-E B-A D-E', dot: 'O Q',
      },
    },
    {
      text: 'În piramida patrulateră regulată $VABCD$ cu înălțimea $VO$, $\\{O\\}=AC\\cap BD$, fie $P\\in VO$ astfel încât $VP=2PO$. Se știe că $VA=AB$ și punctele $M$ și $N$ sunt mijloacele muchiilor $VB$, respectiv $VC$.',
      parts: [
        { pts: 2, text: 'Arătați că punctele $M$, $N$, $P$ și $A$ sunt coplanare.', ans: 'se arată că $A$, $P$, $N$ sunt coliniare ($P$ e centrul de greutate al $\\triangle VAC$)' },
        { pts: 3, text: 'Aflați măsura unghiului format de $ON$ și $BC$.', ans: '$ON\\parallel VA$, deci unghiul este $\\sphericalangle(VA,AD)=60^\\circ$' },
      ],
      fig: {
        w: 195, h: 178,
        p: { V: V18, A: A18, B: B18, C: C18, D: D18, O: O18, P: [O18[0], V18[1] + (O18[1] - V18[1]) * 2 / 3] },
        l: { O: 's', P: 'e', D: 'n' },
        s: 'V-A-B-C-V V-B', d: 'A-D-C V-D A-C B-D V-O', dot: 'P',
      },
    },
  ],
}

