// Testul 5 (Modele de teste pentru Evaluarea Națională, Matematică. Clasa a VIII-a, pages 186–188; answers on 244–245)
import type { EnModel } from '../types'
import { foot, foot3, plane, solid, type Pt } from '../figure'
import { BOX, box, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: pol(160), C: pol(20), B: pol(-20, 1.6), D: pol(200, 1.6), O: [0, 0] }, 150, { s: 'A-B C-D', l: { O: 'n' } })

// II.2: B = 68°, C = 37°
const fig8 = plane(
  { A: pol(68, 0.623), B: [0, 0], C: [1, 0], E: [-0.15, 0], D: [1.15, 0] },
  170,
  { s: 'E-D A-B A-C', l: { E: 's', B: 's', C: 's', D: 's' }, t: [{ at: [-0.08, 0.06], s: '112°', anchor: 'end', size: 11 }, { at: [1.06, 0.06], s: '143°', anchor: 'start', size: 11 }] },
)

const fig9 = plane({ A: [4, 6], B: [0, 0], C: [13, 0], D: [4, 0] }, 150, { s: 'A-B-C-A A-D', ra: ['BAC', 'ADC'] })

const fig10 = plane({ A: [0, 0], B: [84, 0], C: [48, 36], D: [0, 36] }, 150, { s: 'A-B-C-D-A', ra: ['DAB', 'ADC'] })

const B11: Pt = [0, 7], C11: Pt = [10, 0], M11: Pt = [6, 0]
const fig11 = plane({ A: [0, 0], B: B11, C: C11, M: M11, N: foot(M11, B11, C11) }, 160, { s: 'A-B-C-A M-N', ra: ['BAC', 'MNC'] })

const fig16 = plane({ A: [0, 0], B: [24, 0], C: [20, 20], D: [4, 20], O: [12, 12], M: [12, 0], N: [12, 20] }, 150, { s: 'A-B-C-D-A A-C B-D M-N', ra: ['AOB'], l: { O: 'e' } })

const fig17 = plane({ A: [0, 0], B: [0, -18], C: [24, 0], M: [12, 0], N: [0, -16] }, 160, { s: 'A-B-C-A M-N', ra: ['BAC'], l: { N: 'w', B: 's' } })

const b18 = box(6 * s3, 6, 3 * s3)
const fig18 = solid({ ...b18, M: foot3(b18.D, b18.A, b18.C) }, BOX, 170, { seg: "A-C D-M D'-M D'-A D'-C B-D", l: { M: 's' } })

export const M14: EnModel = {
  id: 'en-14',
  title: 'Testul 5',
  source: 'Modele de teste pentru Evaluarea Națională (Matematică. Clasa a VIII-a), pag. 186–188',
  items: [
    { text: 'Dacă $576=2^x\\cdot 3^y$, atunci diferența $x-y$ este egală cu:', choices: ['$1$', '$2$', '$3$', '$4$'], ans: 3 },
    {
      text: 'În tabelul de mai jos este prezentat numărul elevilor din clasele a VIII-a, de la o școală gimnazială, înscriși la olimpiade.\n\n| Disciplina | Matematică | Fizică | Chimie | Biologie | Informatică |\n|---|---|---|---|---|---|\n| Numărul de elevi | 23 | 12 | 14 | 8 | 27 |\n\nNumărul elevilor participanți la olimpiada de fizică este mai mic decât numărul elevilor participanți la olimpiada de informatică cu:',
      choices: ['$13$', '$14$', '$15$', '$19$'], ans: 2,
    },
    { text: 'Un elev pleacă într-o excursie la munte. La baza muntelui temperatura este de $18^\\circ$C, iar la altitudinea la care a ajuns, temperatura este de $6^\\circ$C. Raportul dintre temperatura de la altitudinea la care a ajuns și temperatura de la baza muntelui este egal cu:', choices: ['$\\dfrac{1}{3}$', '$0{,}5$', '$\\dfrac{5}{9}$', '$0{,}6$'], ans: 0 },
    {
      text: 'Patru elevi au calculat valoarea numărului real $x=\\dfrac{2}{\\sqrt{8}-\\sqrt{6}}+|\\sqrt{6}-3|+|2\\sqrt{2}-3|$. Rezultatele obținute sunt trecute în tabelul de mai jos.\n\n| Ioana | Dinu | Daria | Vlad |\n|---|---|---|---|\n| $-2\\sqrt{2}$ | $-\\sqrt{6}$ | $\\sqrt{6}$ | $6$ |\n\nDintre cei patru elevi, cel care a obținut rezultatul corect este:',
      choices: ['Ioana', 'Dinu', 'Daria', 'Vlad'], ans: 3,
    },
    { text: 'Valoarea lui $a$ pentru care numerele de forma $\\overline{3a7}$, scrise în baza $10$, sunt divizibile cu $9$, este:', choices: ['$6$', '$7$', '$8$', '$9$'], ans: 2 },
    { text: 'Un elev face de acasă până la școală, mergând cu autobuzul, $25$ de minute. Elevul afirmă că a plecat de acasă la ora $11{:}45$ și a ajuns la școală la ora $12{:}20$. Afirmația elevului este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată este reprezentată intersecția segmentelor $AB$ și $CD$, $AB\\cap CD=\\{O\\}$, astfel încât $OA=OC$ și $OB=OD$, cu $OA<OB$. Patrulaterul $ABCD$ este:',
      choices: ['pătrat', 'dreptunghi', 'paralelogram', 'trapez isoscel'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, având unghiurile exterioare $ABE$ și $ACD$ cu măsurile $112^\\circ$, respectiv $143^\\circ$. Măsura unghiului $BAC$ este egală cu:',
      choices: ['$74^\\circ$', '$75^\\circ$', '$76^\\circ$', '$77^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$, cu $\\sphericalangle A=90^\\circ$, $AD\\perp BC$, $D\\in BC$. Dacă $BD=4$ cm și $CD=9$ cm, atunci aria triunghiului $ABC$ este egală cu:',
      choices: ['$36\\text{ cm}^2$', '$38\\text{ cm}^2$', '$39\\text{ cm}^2$', '$42\\text{ cm}^2$'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentată o foaie de tablă sub forma unui trapez dreptunghic $ABCD$, $\\sphericalangle A=\\sphericalangle D=90^\\circ$, $AB\\parallel CD$, $AB=84$ cm, $CD=48$ cm și $\\sphericalangle ABC=45^\\circ$. Lungimea înălțimii $AD$ este egală cu:',
      choices: ['$32$ cm', '$36$ cm', '$40$ cm', '$42$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este dreptunghic în vârful $A$, $\\sphericalangle ABC=55^\\circ$, iar $MN\\perp BC$, $M\\in AC$ și $N\\in BC$. Măsura unghiului $CMN$ este egală cu:',
      choices: ['$45^\\circ$', '$48^\\circ$', '$50^\\circ$', '$55^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'O piscină în formă de paralelipiped dreptunghic, are dimensiunile bazei egale cu $32$ m și $24$ m. Când piscina este plină cu apă, ea conține $2304$ kl. Înălțimea piscinei este egală cu:',
      choices: ['$2$ m', '$2{,}5$ m', '$2{,}75$ m', '$3$ m'], ans: 3,
    },

    {
      text: 'Un excursionist a parcurs cu autocarul un traseu în trei zile. În prima zi a parcurs $20\\%$ din drum, a doua zi $60\\%$ din rest, iar a treia zi ultimii $480$ km.',
      parts: [
        { pts: 2, text: 'În ce zi a parcurs excursionistul cea mai mare distanță?', ans: 'în ziua a doua ($48\\%$ din drum)' },
        { pts: 3, text: 'Determinați lungimea întregului traseu parcurs în cele trei zile.', ans: '$32\\%\\,x=480$, deci $x=1500$ km' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=(x+3)^2-(x-2)^2-4(x+4)-9$, unde $x\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Arătați că $E(x)=6x-20$, pentru orice număr real $x$.', ans: '$E(x)=x^2+6x+9-(x^2-4x+4)-4x-16-9=6x-20$' },
        { pts: 3, text: 'Determinați valorile naturale ale lui $n$, pentru care $E(n)<n-5$.', ans: '$5n<15$, deci $n\\in\\{0,\\,1,\\,2\\}$' },
      ],
    },
    {
      text: 'Într-un sistem de axe ortogonale $xOy$ se consideră punctele $A(3,\\,5)$, $B(-5,\\,-3)$ și $C(3,\\,-3)$.',
      parts: [
        { pts: 2, text: 'Calculați distanța de la punctul $C$ la dreapta $AB$.', ans: '$AC=BC=8$, $\\sphericalangle ACB=90^\\circ$, $AB=8\\sqrt{2}$, deci $d(C,AB)=4\\sqrt{2}$' },
        { pts: 3, text: 'Dacă punctul $M$ este mijlocul segmentului $BC$, calculați aria triunghiului $ABM$.', ans: '$\\mathcal{A}_{\\triangle ABM}=\\dfrac{1}{2}\\mathcal{A}_{\\triangle ACB}=16$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat un trapez isoscel $ABCD$, cu $AB\\parallel CD$, $AB>CD$, $AC\\perp BD$, $AC\\cap BD=\\{O\\}$, $O\\in MN$, $MN\\perp AB$, $AB=24$ cm și $CD=16$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrați că $MN=\\dfrac{AB+CD}{2}$.', ans: '$\\triangle AOB$ și $\\triangle COD$ sunt dreptunghice isoscele, deci $OM=\\dfrac{AB}{2}$ și $ON=\\dfrac{CD}{2}$' },
        { pts: 3, text: 'Calculați lungimea diagonalei $AC$.', ans: '$AC=20\\sqrt{2}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$, cu $\\sphericalangle A=90^\\circ$ și punctele $M\\in AC$, $N\\in AB$, astfel încât $\\sphericalangle AMN\\equiv\\sphericalangle ABC$, iar $AM=12$ cm, $AB=18$ cm, $AC=24$ cm.',
      parts: [
        { pts: 2, text: 'Determinați lungimea segmentului $MN$.', ans: '$\\triangle AMN\\sim\\triangle ABC$, deci $MN=20$ cm' },
        { pts: 3, text: 'Calculați aria patrulaterului $MNBC$.', ans: '$\\mathcal{A}_{MNBC}=\\mathcal{A}_{ABC}-\\mathcal{A}_{AMN}=216-96=120\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat paralelipipedul dreptunghic $ABCDA'B'C'D'$, având dimensiunile $AB=6\\sqrt{3}$ cm, $BC=6$ cm și $CC'=3\\sqrt{3}$ cm.",
      parts: [
        { pts: 2, text: "Calculați distanța de la punctul $D'$ la dreapta $AC$.", ans: "$DM\\perp AC$, $DM=3\\sqrt{3}$ cm, deci $D'M=3\\sqrt{6}$ cm" },
        { pts: 3, text: "Calculați măsura unghiului corespunzător diedrului format de planele $(D'DB)$ și $(BCC')$.", ans: "$\\sphericalangle CBD$, cu $\\operatorname{tg}\\sphericalangle CBD=\\sqrt{3}$, deci $60^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
