// Model E.N. 1 - simulare (the book's pages 111–112)
import type { EnModel } from '../types'
import { along, meet, mid, onCircle, type Pt } from '../figure'

const circle8: Pt = [70, 72]
const A8 = onCircle(circle8, 56, 62)
const B8 = onCircle(circle8, 56, -12)
const C8 = onCircle(circle8, 56, -118)
const D8 = onCircle(circle8, 56, 172)

const A11: Pt = [42, 12], B11: Pt = [202, 12], C11: Pt = [172, 92], D11: Pt = [12, 92]
const E11 = mid(A11, D11)

const A16: Pt = [15, 150], B16: Pt = [175, 150], E16: Pt = [95, 11.4]

const A18: Pt = [40, 172], C18: Pt = [185, 142]

export const M1: EnModel = {
  id: 'en-1',
  title: 'Model E.N. 1 - simulare',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 111–112',
  items: [
    { text: 'Rezultatul calculului $\\left(0{,}5+\\dfrac{\\sqrt{49}}{2}\\right)^{-1}\\cdot(6-8)^2$ este:', choices: ['$1$', '$-16$', '$0$', '$-1$'], ans: 0 },
    { text: 'Fie mulțimea $A=\\{x \\mid x\\in\\mathbb{N}$ și $x\\in(-2;4]\\}$. Numărul elementelor mulțimii $A$ este:', choices: ['$4$', '$5$', '$6$', '$7$'], ans: 1 },
    { text: 'Dacă $\\dfrac{x}{12}=\\dfrac{38}{4}$, atunci $x$ este egal cu:', choices: ['$104$', '$124$', '$19$', '$114$'], ans: 3 },
    { text: 'O persoană a depus la bancă o sumă de bani. După un an a scos toți banii, adică $312$ lei. Ce sumă a depus persoana dacă dobânda băncii este de $4\\%$?', choices: ['$250$ lei', '$300$ lei', '$310$ lei', '$400$ lei'], ans: 1 },
    { text: 'Fracția $\\dfrac{4^{19}}{8^{12}}$ este:', choices: ['ireductibilă', 'supraunitară', 'subunitară', 'echiunitară'], ans: 1 },
    {
      text: 'Notele obținute de elevii unei clase la un test sunt în tabelul următor.\n\n| Nr. elevi | 3 | 4 | 5 | 2 | 6 | 3 | 2 |\n|---|---|---|---|---|---|---|---|\n| Nota | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n\nMedia clasei este:',
      choices: ['$7$', '$6{,}84$', '$6{,}8(4)$', '$6{,}52$'], ans: 1,
    },

    {
      text: 'În triunghiul $ABC$ cu $\\sphericalangle C=90^\\circ$, punctul $C$ este:',
      choices: ['ortocentrul', 'centrul de greutate', 'centrul cercului înscris în triunghi', 'centrul cercului circumscris triunghiului'], ans: 0,
      fig: { w: 170, h: 90, p: { A: [18, 14], C: [18, 72], B: [150, 72] }, s: 'A-C-B-A', ra: ['ACB'] },
    },
    {
      text: '$A$, $B$, $C$ și $D$ sunt puncte pe un cerc în această ordine. Dacă $\\overset{\\frown}{AB}=40^\\circ$, $\\overset{\\frown}{CD}=60^\\circ$ și $AC\\cap BD=\\{E\\}$, atunci $\\sphericalangle BEC$ are:',
      choices: ['$100^\\circ$', '$110^\\circ$', '$120^\\circ$', '$130^\\circ$'], ans: 3,
      fig: { w: 150, h: 145, p: { A: A8, B: B8, C: C8, D: D8, E: meet(A8, C8, B8, D8) }, l: { E: 'n' }, c: [{ at: circle8, r: 56 }], s: 'A-C B-D' },
    },
    {
      text: 'Triunghiul $ABC$ are $AB=AC=10$ cm și $\\sphericalangle BAC=120^\\circ$. Distanța de la $B$ la $AC$ este:',
      choices: ['$5$ cm', '$5\\sqrt{3}$ cm', '$10$ cm', '$10\\sqrt{3}$ cm'], ans: 1,
      fig: { w: 205, h: 78, p: { A: [102, 14], B: [16, 63], C: [188, 63] }, s: 'A-B-C-A' },
    },
    { text: 'Dacă apotema unui pătrat este egală cu $2$ cm, atunci pătratul are aria de:', choices: ['$4\\text{ cm}^2$', '$8\\text{ cm}^2$', '$2\\text{ cm}^2$', '$16\\text{ cm}^2$'], ans: 3 },
    {
      text: 'În paralelogramul $ABCD$, fie $E$ mijlocul lui $AD$ și $BD\\cap CE=\\{F\\}$. Valoarea raportului $\\dfrac{EF}{FC}$ este egală cu:',
      choices: ['$\\dfrac{1}{3}$', '$\\dfrac{2}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{1}{4}$'], ans: 2,
      fig: { w: 215, h: 105, p: { A: A11, B: B11, C: C11, D: D11, E: E11, F: meet(B11, D11, C11, E11) }, l: { F: 'n' }, s: 'A-B-C-D-A B-D C-E' },
    },
    { text: 'O prismă triunghiulară cu toate muchiile egale are suma lor egală cu $45$ cm. Aria laterală este:', choices: ['$25\\text{ cm}^2$', '$75\\text{ cm}^2$', '$5\\text{ cm}^2$', '$100\\text{ cm}^2$'], ans: 1 },

    {
      text: 'Un muncitor trebuia să producă un număr de piese în $6$ ore. El a realizat cu $3$ piese mai puțin pe oră și a terminat piesele în $8$ ore.',
      parts: [
        { pts: 2, text: 'Câte piese trebuia să producă într-o oră?', ans: '$12$ piese' },
        { pts: 3, text: 'Câte piese trebuia să realizeze în total?', ans: '$72$ de piese' },
      ],
    },
    {
      text: 'Fie expresia $E(x)=(3-2x)^2-5(3-x)(x+3)+42$.',
      parts: [
        { pts: 2, text: 'Aflați $x\\in\\mathbb{R}$ care îndeplinește condiția $E(x)=(3x+1)(3x-2)$.', ans: '$x=\\dfrac{8}{9}$' },
        { pts: 3, text: 'Aflați minimul expresiei $E(x)$.', ans: '$E(x)=(3x-2)^2+2$, minimul este $2$ (pentru $x=\\dfrac{2}{3}$)' },
      ],
    },
    {
      text: 'Fie numărul $a=(5\\sqrt{6}+3)^2-\\dfrac{180}{\\sqrt{6}}+10$.',
      parts: [
        { pts: 2, text: 'Demonstrați că $\\sqrt{a}\\in\\mathbb{N}$.', ans: '$a=169$, $\\sqrt{a}=13$' },
        { pts: 3, text: 'Arătați că $\\sqrt{3a}-5<18$.', ans: '$\\sqrt{3a}-5=13\\sqrt{3}-5$ și $13\\sqrt{3}=\\sqrt{507}<23$' },
      ],
    },
    {
      text: 'Trapezul isoscel $ABCD$ are $AB\\parallel CD$, $CD<AB$, $AD=BC=10$ cm, $AB=20$ cm, $BD$ bisectoarea $\\sphericalangle ABC$, $AD\\cap BC=\\{E\\}$.',
      parts: [
        { pts: 2, text: 'Aflați valoarea raportului dintre $ED$ și $AD$.', ans: '$CD=BC=10$ cm, $CD$ e linie mijlocie în $\\triangle EAB$, deci $\\dfrac{ED}{AD}=1$' },
        { pts: 3, text: 'Calculați distanța de la $B$ la $AD$.', ans: '$\\triangle EAB$ echilateral cu latura $20$ cm, distanța este $10\\sqrt{3}$ cm' },
      ],
      fig: { w: 190, h: 165, p: { E: E16, D: mid(E16, A16), C: mid(E16, B16), A: A16, B: B16 }, s: 'A-B-C-D-A D-B', d: 'D-E-C' },
    },
    {
      text: 'Triunghiul $ABC$ din figura alăturată are $\\sphericalangle A=90^\\circ$, $\\sphericalangle B=30^\\circ$ și $AC=6$ cm. Fie $E$ simetricul lui $A$ față de $BC$ și $F$ simetricul lui $E$ față de $C$.',
      parts: [
        { pts: 2, text: 'Arătați că $BE\\perp CE$.', ans: 'se arată că $\\triangle ABC\\equiv\\triangle EBC$, deci $\\sphericalangle BEC=\\sphericalangle BAC=90^\\circ$' },
        { pts: 3, text: 'Aflați aria patrulaterului $AFCB$.', ans: '$27\\sqrt{3}\\text{ cm}^2$' },
      ],
      fig: { w: 225, h: 165, p: { A: [132, 12], F: [210, 12], B: [15, 79.5], C: [171, 79.5], E: [132, 147] }, l: { A: 'n', F: 'ne', C: 'e' }, s: 'A-B-C-A A-F-C', d: 'B-E-C', ra: ['BAC'] },
    },
    {
      text: 'Dintr-o coală de carton se confecționează o prismă patrulateră regulată $ABCDA\'B\'C\'D\'$ cu o singură bază, de latură $6$ cm și cu înălțimea de $10$ cm, folosită pentru păstrarea creioanelor.',
      parts: [
        { pts: 2, text: 'Un creion se sprijină în punctul $C\'$ și ajunge în punctul $M\\in[AC]$ astfel încât $\\dfrac{AM}{AC}=\\dfrac{2}{3}$. Aflați lungimea creionului.', ans: '$MC=2\\sqrt{2}$ cm, $C\'M=6\\sqrt{3}$ cm' },
        { pts: 3, text: 'În prisma de carton se introduc zaruri cu muchia de $10$ mm până la înălțimea de $7$ cm, fără a lăsa spații goale. Câte zaruri au fost introduse în cutie?', ans: '$6\\cdot 6\\cdot 7=252$ de zaruri' },
      ],
      fig: {
        w: 205, h: 190,
        p: { A: A18, B: [150, 172], C: C18, D: [75, 142], "A'": [40, 60], "B'": [150, 60], "C'": [185, 30], "D'": [75, 30], M: along(A18, C18, 2 / 3) },
        l: { M: 's', D: 'w', C: 'e' },
        s: "A-B-C-C'-D'-A'-A A'-B'-C' B-B'", d: "A-D-C D-D' A-C C'-M",
      },
    },
  ],
}
