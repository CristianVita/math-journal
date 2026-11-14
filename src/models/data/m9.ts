// Model E.N. 9 (the book's pages 123–124)
import type { EnModel } from '../types'
import { along, meet, mid, type Pt } from '../figure'

const B12: Pt = [70, 135], C12: Pt = [150, 100]

const A16: Pt = [15, 62], B16: Pt = [145, 62], C16: Pt = [170, 12], D16: Pt = [40, 12]
const E16 = along(A16, B16, 2 / 3)

export const M9: EnModel = {
  id: 'en-9',
  title: 'Model E.N. 9',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 123–124',
  items: [
    { text: 'Rezultatul calculului $2^{-1}+(2^2:2)^{-2}$ este:', choices: ['$0{,}75$', '$1$', '$2$', '$-4$'], ans: 0 },
    { text: 'Dacă $2x+1{,}5=8\\dfrac{1}{2}$, atunci inversul lui $x$ este:', choices: ['$\\dfrac{7}{2}$', '$\\dfrac{2}{7}$', '$-\\dfrac{7}{2}$', '$-\\dfrac{2}{7}$'], ans: 1 },
    { text: 'După o reducere de $10\\%$, un obiect costă $108$ lei. Prețul inițial a fost de:', choices: ['$110$ lei', '$120$ lei', '$117$ lei', '$99$ lei'], ans: 1 },
    {
      text: 'În tabelul următor este prezentată situația notelor la o lucrare a elevilor dintr-o clasă. Procentul elevilor care au nota cel puțin egală cu $6$ este:\n\n| Nr. elevi | 3 | 2 | 4 | 2 | 2 | 4 | 3 |\n|---|---|---|---|---|---|---|---|\n| Nota | 4 | 5 | 6 | 7 | 8 | 9 | 10 |',
      choices: ['$25\\%$', '$45\\%$', '$55\\%$', '$75\\%$'], ans: 3,
    },
    { text: 'Dacă $4x^2+9y^2+12(x-y)+13\\le 0$ cu $x,y\\in\\mathbb{R}$, atunci $x+y$ este:', choices: ['$13$', '$5$', '$-5$', '$-\\dfrac{5}{6}$'], ans: 3 },
    { text: 'Valoarea de adevăr a propoziției „Probabilitatea ca la aruncarea unui zar să apară o față cu un număr de puncte cel puțin egal cu trei este $2/3$.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    { text: 'Dacă $A$, $B$ și $C$ sunt trei puncte astfel încât $AB=AC=5\\sqrt{2}$ cm și $BC=10$ cm, avem:', choices: ['$A$, $B$ și $C$ coliniare', '$\\sphericalangle BAC=180^\\circ$', '$\\sphericalangle ABC=90^\\circ$', '$\\sphericalangle ACB=45^\\circ$'], ans: 3 },
    { text: 'Suplementul complementului unghiului de $50^\\circ41\'$ este egal cu:', choices: ['$140^\\circ41\'$', '$150^\\circ41\'$', '$151^\\circ41\'$', '$140^\\circ19\'$'], ans: 0 },
    { text: 'Triunghiul $ABC$ cu $AB=AC=12$ cm și aria de $72\\text{ cm}^2$ este:', choices: ['ascuțitunghic', 'echilateral', 'dreptunghic', 'obtuzunghic'], ans: 2 },
    { text: 'Patrulaterul $ABCD$ în care se știe că $AC\\cap BD=\\{O\\}$, $OB=3$ cm, $OA=4$ cm, $OD=6$ cm și $OC=8$ cm este un:', choices: ['patrulater oarecare', 'paralelogram', 'romb', 'trapez'], ans: 3 },
    {
      text: 'Fie rombul $ABCD$ cu $\\sphericalangle BAC=25^\\circ$. Atunci $\\sphericalangle ABC$ este egal cu:',
      choices: ['$130^\\circ$', '$155^\\circ$', '$50^\\circ$', '$25^\\circ$'], ans: 0,
      fig: { w: 100, h: 115, p: { A: [50, 10], B: [14, 57], C: [50, 104], D: [86, 57] }, s: 'A-B-C-D-A', d: 'A-C B-D' },
    },
    {
      text: 'Dacă apotema unui tetraedru regulat are $3\\sqrt{2}$ cm, perimetrul bazei este egal cu:',
      choices: ['$6\\sqrt{2}$ cm', '$4\\sqrt{6}$ cm', '$6\\sqrt{6}$ cm', '$8\\sqrt{6}$ cm'], ans: 2,
      fig: { w: 165, h: 150, p: { V: [80, 10], A: [15, 105], B: B12, C: C12, M: mid(B12, C12) }, l: { M: 'se' }, s: 'V-A-B-C-V V-B V-M', d: 'A-C' },
    },

    {
      text: 'Din $18$ m de material se confecționează $6$ bluze și $3$ rochii, iar din $27$ m (de același tip de material) se confecționează $8$ bluze și $5$ rochii.',
      parts: [
        { pts: 2, text: 'Câți metri de material sunt necesari pentru o rochie?', ans: '$3$ m' },
        { pts: 3, text: 'Câți metri de material sunt necesari pentru $5$ bluze și $2$ rochii?', ans: '$13{,}5$ m' },
      ],
    },
    {
      text: 'Fie expresia $E(x)=\\dfrac{(2x-1)^2-4x+2}{4x^2-9}$, $x\\in\\mathbb{R}\\setminus\\left\\{\\pm\\dfrac{3}{2}\\right\\}$.',
      parts: [
        { pts: 2, text: 'Să se aducă expresia la forma $E(x)=1+F(x)$.', ans: '$E(x)=\\dfrac{2x-1}{2x+3}=1-\\dfrac{4}{2x+3}$' },
        { pts: 3, text: 'Pentru $x=-\\sqrt{2}$ să se afle valoarea expresiei $E(x)$.', ans: '$E(-\\sqrt{2})=1-\\dfrac{4}{3-2\\sqrt{2}}=1-4(3+2\\sqrt{2})=-11-8\\sqrt{2}$. *Corectat față de culegere, unde baremul dă $-11$.*' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-\\dfrac{4x}{3}+4$.',
      parts: [
        { pts: 2, text: 'Să se reprezinte grafic funcția.', ans: 'dreapta prin $(3;0)$ și $(0;4)$' },
        { pts: 3, text: 'Să se afle distanța de la originea axelor de coordonate la reprezentarea grafică a funcției.', ans: '$2{,}4$' },
      ],
    },
    {
      text: 'În paralelogramul $ABCD$ fie punctul $E\\in AB$ astfel încât $AE=2EB$ și $DE\\cap BC=\\{F\\}$.',
      parts: [
        { pts: 2, text: 'Determinați valoarea raportului dintre $DE$ și $DF$.', ans: '$\\dfrac{2}{3}$' },
        { pts: 3, text: 'Dacă $AD=6$ cm, aflați lungimea lui $BF$.', ans: '$3$ cm' },
      ],
      fig: { w: 185, h: 100, p: { A: A16, B: B16, C: C16, D: D16, E: E16, F: meet(D16, E16, C16, B16) }, l: { E: 'n', F: 's' }, s: 'A-B-C-D-A D-E-F C-B-F' },
    },
    {
      text: 'În $\\triangle ABD$ cu $AB=12$ cm și $BD=16$ cm fie punctul $C\\in BD$ astfel încât $\\sphericalangle BAC=\\sphericalangle ADB$.',
      parts: [
        { pts: 2, text: 'Aflați lungimea lui $CD$.', ans: '$\\triangle BAC\\sim\\triangle BDA$, $BC=9$ cm, $CD=7$ cm' },
        { pts: 3, text: 'Dacă $\\sphericalangle B=30^\\circ$, calculați aria triunghiului $ACD$.', ans: '$21\\text{ cm}^2$' },
      ],
      fig: { w: 100, h: 135, p: { B: [15, 12], A: [15, 108], D: [79, 122.9], C: [51, 74.4] }, l: { C: 'e' }, s: 'B-A-D-B A-C' },
    },
    {
      text: 'Un bazin în formă de paralelipiped dreptunghic având dimensiunile $L=4$ m, $l=3$ m și $h=2$ m se umple cu apă cu ajutorul unei găleți în formă de trunchi de con cu dimensiunile $R=2$ dm, $r=1$ dm și $h=3$ dm.',
      parts: [
        { pts: 2, text: 'Aflați câți litri de apă pot intra într-o găleată.', ans: '$7\\pi$ l' },
        { pts: 3, text: 'Dacă se golesc în bazin $960$ de găleți cu apă, până la ce înălțime se ridică apa?', ans: '$0{,}56\\pi$ m' },
      ],
    },
  ],
}
