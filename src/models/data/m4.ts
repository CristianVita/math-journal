// Model E.N. 4 - simulare (the book's pages 116–117)
import type { EnModel } from '../types'
import { mid, onCircle, type Pt } from '../figure'

const O8: Pt = [85, 70]
const B11: Pt = [15, 14], C11: Pt = [112, 70]
const B18: Pt = [105, 158], B18t: Pt = [105, 53]

export const M4: EnModel = {
  id: 'en-4',
  title: 'Model E.N. 4 - simulare',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 116–117',
  items: [
    { text: 'Sfertul lui $8^8$ este:', choices: ['$2^8$', '$2^2$', '$2^{22}$', '$8^2$'], ans: 2 },
    { text: 'Elementele mulțimii $A=\\left\\{x\\in\\mathbb{N}\\;\\middle|\\;\\dfrac{3}{2x-1}\\in\\mathbb{Z}\\right\\}$ sunt:', choices: ['$\\{-1;0;1;2\\}$', '$\\{0;1;2\\}$', '$\\{1;2\\}$', '$\\{1;2;3\\}$'], ans: 1 },
    { text: 'Probabilitatea ca, alegând un număr din mulțimea $\\{x\\in\\mathbb{R}\\mid |x|<4\\}\\cap\\mathbb{Z}^*$, acesta să fie par este:', choices: ['$4/9$', '$1/3$', '$1/2$', '$3/7$'], ans: 1 },
    { text: 'Descompunerea în factori ireductibili a expresiei $x^3-6x^2+9x$ este:', choices: ['$x(x^2+6x+9)$', '$x(x+3)^2$', '$x(x+3)(x-3)$', '$x(x-3)^2$'], ans: 3 },
    { text: 'Dacă $a=\\dfrac{5}{\\sqrt{3}}+\\dfrac{2}{\\sqrt{12}}$ și $b=4\\sqrt{3}+6$, atunci $\\dfrac{b}{a}$ este egal cu:', choices: ['$2+\\sqrt{3}$', '$2+3\\sqrt{3}$', '$6+\\sqrt{3}$', '$5$'], ans: 0 },
    { text: 'Valoarea de adevăr a propoziției „$\\sqrt{7}\\in[2{,}(6);+\\infty)$” este:', choices: ['adevărat', 'fals'], ans: 1 },

    { text: 'Dacă $AB=6$ cm, $BC=3$ cm și $AC=9$ cm, atunci punctele $A$, $B$ și $C$:', choices: ['sunt coliniare', 'formează un triunghi dreptunghic', 'formează un triunghi obtuzunghic', 'formează un triunghi isoscel'], ans: 0 },
    {
      text: 'Dacă unghiurile $\\sphericalangle AOB$ și $\\sphericalangle BOC$ sunt suplementare și $\\sphericalangle AOB=5\\cdot\\sphericalangle BOC$, atunci măsura $\\sphericalangle AOB$ este de:',
      choices: ['$30^\\circ$', '$36^\\circ$', '$144^\\circ$', '$150^\\circ$'], ans: 3,
      fig: { w: 175, h: 85, p: { A: [15, 70], O: O8, C: [165, 70], B: onCircle(O8, 80, 30) }, l: { A: 's', O: 's', C: 's', B: 'n' }, s: 'A-C O-B' },
    },
    { text: 'Dacă $\\triangle ABC\\sim\\triangle SUT$ și $\\sphericalangle A=35^\\circ$, $\\sphericalangle U=78^\\circ$, atunci măsura $\\sphericalangle C$ este de:', choices: ['$78^\\circ$', '$35^\\circ$', '$70^\\circ$', '$67^\\circ$'], ans: 3 },
    {
      text: 'Fie $ABCD$ un romb cu $AC=16$ cm și $BD=12$ cm. Distanța de la $B$ la $AD$ este de:',
      choices: ['$19{,}2$ cm', '$4{,}8$ cm', '$9{,}6$ cm', '$12$ cm'], ans: 2,
      fig: { w: 100, h: 115, p: { A: [50, 10], B: [14, 57], C: [50, 104], D: [86, 57] }, s: 'A-B-C-D-A', d: 'A-C B-D' },
    },
    {
      text: 'Triunghiul dreptunghic $ABC$ are $\\sphericalangle A=90^\\circ$, $\\sphericalangle B=60^\\circ$ și mediana $AM=8$ cm, $M\\in BC$. Lungimea proiecției catetei $AC$ pe ipotenuza $BC$ este de:',
      choices: ['$8\\sqrt{3}$ cm', '$4$ cm', '$8$ cm', '$12$ cm'], ans: 3,
      fig: { w: 130, h: 85, p: { A: [15, 70], B: B11, C: C11, M: mid(B11, C11) }, l: { M: 'ne' }, s: 'A-B-C-A A-M', ra: ['BAC'] },
    },
    {
      text: 'Fie cubul $ABCDA\'B\'C\'D\'$. Măsura $\\sphericalangle(BC;DC\')$ este de:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 3,
      fig: {
        w: 185, h: 172,
        p: { A: [15, 160], B: [130, 160], C: [165, 125], D: [50, 125], "A'": [15, 45], "B'": [130, 45], "C'": [165, 10], "D'": [50, 10] },
        l: { D: 'w' },
        s: "A-B-C-C'-D'-A'-A A'-B'-C' B-B'", d: "A-D-C D-D' D-C'",
      },
    },

    {
      text: 'Într-o clasă numărul fetelor reprezintă $40\\%$ din numărul băieților.',
      parts: [
        { pts: 2, text: 'Este posibil ca numărul băieților să fie $18$?', ans: 'Nu ($40\\%$ din $18$ este $7{,}2$)' },
        { pts: 3, text: 'Dacă în clasă sunt $28$ de elevi, aflați numărul fetelor.', ans: '$8$ fete' },
      ],
    },
    {
      text: 'Fie $a=4\\sqrt{5}\\cdot\\left(\\dfrac{\\sqrt{5}}{4}+\\dfrac{1}{2\\sqrt{5}}\\right)+\\left(\\dfrac{2\\sqrt{6}}{7}+\\dfrac{\\sqrt{54}}{3}-\\sqrt{6}\\right)\\cdot\\dfrac{7}{\\sqrt{6}}$ și $b=[0{,}(6)-0{,}5]:1{,}(3)+5\\cdot 8^{-1}$.',
      parts: [
        { pts: 2, text: 'Arătați că numărul $a$ este pătrat perfect.', ans: '$a=9=3^2$' },
        { pts: 3, text: 'Demonstrați că $b\\in(0{,}5;1)$.', ans: '$b=\\dfrac{1}{8}+\\dfrac{5}{8}=0{,}75$' },
      ],
    },
    {
      text: 'Fie $E(x)=(1-2x)^2-(x-4)(4+x)-(x+3)^2-2x(x-3)$.',
      parts: [
        { pts: 2, text: 'Aduceți $E(x)$ la forma cea mai simplă și arătați că $E(n)\\,\\vdots\\,8$ pentru orice $n\\in\\mathbb{N}$ par.', ans: '$E(x)=8-4x$; pentru $n=2k$, $E(n)=8(1-k)\\,\\vdots\\,8$. *Corectat față de culegere, unde ultimul termen este $-2x(x-2)$ și nu iese $8-4x$.*' },
        { pts: 3, text: 'Rezolvați în $\\mathbb{R}$ inecuația $E(x)\\le E(-x)$.', ans: '$x\\in[0;+\\infty)$' },
      ],
    },
    {
      text: 'În dreptunghiul $ABCD$ cu $AB=12$ cm și $BC=6$ cm se aleg punctele $M\\in CD$ astfel încât $MC=2\\cdot DM$ și $\\{T\\}=BM\\cap AD$.',
      parts: [
        { pts: 2, text: 'Aflați lungimea lui $BM$.', ans: '$10$ cm' },
        { pts: 3, text: 'Calculați aria patrulaterului $DTCB$.', ans: '$TD=3$ cm, aria este $54\\text{ cm}^2$' },
      ],
      fig: { w: 175, h: 135, p: { A: [12, 12], B: [156, 12], C: [156, 84], D: [12, 84], M: [60, 84], T: [12, 120] }, l: { A: 'nw', B: 'ne', C: 'se', D: 'w', M: 's', T: 'sw' }, s: 'A-B-C-D-A B-M-T D-T' },
    },
    {
      text: 'În trapezul dreptunghic $ABCD$ cu $AB\\parallel CD$ se cunosc $AB=6$ cm, $BC=6$ cm și $\\sphericalangle ABC=150^\\circ$.',
      parts: [
        { pts: 2, text: 'Aflați măsura $\\sphericalangle ACD$.', ans: '$15^\\circ$' },
        { pts: 3, text: 'Dacă $E\\in CD$ astfel încât $DE=3\\sqrt{3}$ cm, arătați că $ABCE$ este romb.', ans: '$AD=3$ cm, $CD=6+3\\sqrt{3}$ cm, deci $CE=6$ cm și $AE=\\sqrt{9+27}=6$ cm: $AB=BC=CE=AE=6$ cm. *Corectat față de culegere, unde $DE=4$ cm și $ABCE$ nu iese romb.*' },
      ],
      fig: { w: 200, h: 72, p: { A: [12, 12], B: [108, 12], C: [191, 60], D: [12, 60], E: [95, 60] }, l: { A: 'nw', B: 'ne', D: 'sw', E: 's' }, s: 'A-B-C-D-A A-E A-C', ra: ['DAB', 'ADC'] },
    },
    {
      text: 'În prisma triunghiulară regulată dreaptă $ABCA\'B\'C\'$ se cunosc $AB=8$ cm, $BB\'=12$ cm, $M$ este mijlocul lui $BB\'$ și $C\'M\\cap(ABC)=\\{E\\}$.',
      parts: [
        { pts: 2, text: 'Calculați aria $\\triangle AMC\'$.', ans: '$8\\sqrt{39}\\text{ cm}^2$' },
        { pts: 3, text: 'Demonstrați că $AE\\perp A\'C$.', ans: 'se arată că $AE\\perp(AA\'C)$: $BE=BC=BA$, deci $AE\\perp AC$, și $AE\\perp AA\'$' },
      ],
      fig: {
        w: 210, h: 200,
        p: { A: [40, 135], B: B18, C: [190, 128], "A'": [40, 30], "B'": B18t, "C'": [190, 23], M: mid(B18, B18t), E: [20, 188] },
        l: { M: 'e', B: 'se' },
        s: "A-B-C-C'-B'-A'-A B-B' A'-C' C'-M-E A-E B-E", d: 'A-C',
      },
    },
  ],
}
