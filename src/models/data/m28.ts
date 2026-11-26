// Testul 5 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 79–83; every answer here is computed and checked with the book's answers, p. 271).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [2, 0], M: [5, 0], C: [8, 0], D: [10, 0] }, 160, { s: 'A-D', dot: 'A B M C D', l: { A: 'n', B: 'n', M: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(90, 5), B: [5, 0], C: pol(30, 5), D: pol(60, 5), E: pol(240, 5) }, 110,
  { s: 'O-A O-B O-C O-D O-E', ra: ['BOA'], l: { O: 'w' } })
const fig9 = plane({ A: [0, 8], B: [-6, 0], C: [6, 0], D: [0, -8], M: [3, 4], Q: [2, 0], H: [0, 0] }, 90,
  { s: 'A-B-C-A A-D D-M', ra: ['CHA'], l: { H: '', Q: 'se' } })
const fig10 = plane({ A: [0, 6], B: [6, 6], C: [6, 0], D: [0, 0], M: [2 * s3, 0], N: [6, 6 - 2 * s3] }, 110, { s: 'A-B-C-D-A A-M-N-A' })
const fig11 = plane({ O: [0, 0], A: [-10, 0], B: pol(240, 5), C: [-5, 0] }, 150, { s: 'A-O A-B O-B', c: [{ at: 'O', r: 5 }], ra: ['ABO'], l: { C: 'n' } })

const fig15 = graph({ A: [-s2, 0], B: [0, 2], L1: [-2.6, 2 - 2.6 * s2], L2: [1, 2 + s2] }, 120, [-3, 2], [-2, 4], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'nw', B: 'e', O: 'se' } })
const a16 = 8 / Math.sqrt(7), b16 = (s3 / 2) * a16
const O16: [number, number] = [a16 / 2, b16 / 2]
const fig16 = plane({ A: [0, 0], B: [a16, 0], C: [a16, b16], D: [0, b16], O: O16, M: [(3 * a16) / 4, b16 / 4], N: [a16 / 4, (3 * b16) / 4], P: [a16 / 2 - (b16 * b16) / (2 * a16), 0] }, 150,
  { s: 'A-B-C-D-A A-C B-D', dot: 'M N P', l: { O: 'n', M: 'sw', N: 'ne' } })
const fig17 = plane({ A: [0, 0], B: [6 * s2, 0], C: [6 * s2, 3], D: [0, 6], M: [3 * s2, 0] }, 140, { s: 'A-B-C-D-A', dot: 'M', ra: ['DAB', 'ABC'] })
const fig18 = solid({ ...box(4, 4, 6), M: [0, 0, 3], N: [2, 4, 0] }, BOX, 110, { seg: 'M-N', l: { M: 'w', N: 'n' } })

export const M28: EnModel = {
  id: 'en-28',
  title: 'Paralela 45, Testul 5',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 79–83',
  items: [
    { text: 'Suma divizorilor întregi ai numărului $4$ este egală cu:', choices: ['$7$', '$0$', '$-7$', '$14$'], ans: 1 },
    { text: 'Valoarea lui $x$ din proporția $\\dfrac{x-2}{4}=\\dfrac{1}{2}$ este:', choices: ['$0$', '$6$', '$2$', '$4$'], ans: 3 },
    { text: 'Dacă $a=(+2)\\cdot(-3)+|-5|$, atunci suma dintre $a$ și inversul său este egală cu:', choices: ['$0$', '$2$', '$-2$', '$1$'], ans: 2 },
    { text: 'Transformând numărul $0{,}2(7)$ în fracție ordinară se obține:', choices: ['$\\dfrac{27}{90}$', '$\\dfrac{27}{99}$', '$\\dfrac{5}{18}$', '$\\dfrac{27}{100}$'], ans: 2 },
    { text: 'Dacă $a>0$, $b=4$, iar media geometrică a numerelor $a$ și $b$ este $2\\sqrt{3}$, atunci media aritmetică a numerelor $a$ și $b$ este:', choices: ['$7$', '$3{,}5$', '$\\dfrac{4+\\sqrt{3}}{2}$', '$\\sqrt{3}+2$'], ans: 1 },
    { text: 'Un automobil se deplasează cu viteza constantă de $90$ km/h. Șoferul se gândește: „Voi parcurge $60$ km în $40$ de minute”. Raționamentul șoferului este:', choices: ['corect', 'eronat'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $M$, $C$ și $D$, astfel încât $AC=BD$, iar $M$ este mijlocul segmentului $BC$. Dacă $AB=2$ cm și $MC=3$ cm, lungimea segmentului $AD$ este egală cu:',
      choices: ['$4$ cm', '$6$ cm', '$9$ cm', '$10$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat unghiul drept $AOB$, în interiorul căruia punctele $C$ și $D$ au proprietatea că unghiurile $AOD$, $DOC$ și $COB$ sunt congruente. Dacă $OE$ este semidreapta opusă semidreptei $OD$, atunci măsura unghiului $EOC$ este egală cu:',
      choices: ['$150^\\circ$', '$90^\\circ$', '$120^\\circ$', '$100^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi isoscel în care $AB=AC$ și $BC=12$ cm. Punctul $D$ este simetricul punctului $A$ față de dreapta $BC$, $M$ este mijlocul segmentului $AC$ și $Q$ este punctul de intersecție dintre $BC$ și $DM$. Lungimea segmentului $BQ$ este egală cu:',
      choices: ['$4$ cm', '$9$ cm', '$8$ cm', '$7{,}5$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat pătratul $ABCD$. Punctele $M$ și $N$ aparțin segmentelor $DC$, respectiv $BC$, astfel încât $\\sphericalangle DAM=\\sphericalangle BAN=30^\\circ$. Dacă $AB=6$ cm, atunci aria triunghiului $MAN$ este egală cu:',
      choices: ['$12\\text{ cm}^2$', '$8\\sqrt{3}\\text{ cm}^2$', '$24\\text{ cm}^2$', '$12\\sqrt{3}\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc cu centrul în $O$ și raza egală cu $5$ cm. Punctul $A$ este exterior cercului, $AO=10$ cm, $AB$ este tangentă cercului în punctul $B$ și $AO$ intersectează cercul în punctul $C$. Măsura arcului mic $BC$ este egală cu:',
      choices: ['$300^\\circ$', '$30^\\circ$', '$80^\\circ$', '$60^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'O piramidă, având volumul egal cu $288\\text{ cm}^3$, se secționează cu un plan paralel cu planul bazei care trece prin mijlocul înălțimii. Volumul piramidei mici care se formează este egal cu:',
      choices: ['$144\\text{ cm}^3$', '$36\\text{ cm}^3$', '$72\\text{ cm}^3$', '$252\\text{ cm}^3$'], ans: 1,
    },

    {
      text: 'Un dreptunghi are aria egală cu $600\\text{ m}^2$. Dacă se mărește lățimea cu $4$ m și se micșorează lungimea cu $5$ m, aria dreptunghiului rămâne neschimbată.',
      parts: [
        { pts: 2, text: 'Stabilește dacă lățimea dreptunghiului poate fi egală cu $15$ m.', ans: 'Nu: lungimea ar fi $40$ m, iar $19\\cdot35=665\\ne600$' },
        { pts: 3, text: 'Determină perimetrul dreptunghiului.', ans: '$l\\cdot L=600$ și $(l+4)(L-5)=600$ dau $L=30$ m, $l=20$ m, deci $P=100$ m' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(x-\\dfrac{1}{2-x}\\right):\\dfrac{x^3-2x^2+x}{x^2-7x+10}$, unde $x\\in\\mathbb{R}\\setminus\\{0,\\,1,\\,2,\\,5\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x-5}{x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{0,\\,1,\\,2,\\,5\\}$.', ans: '$x-\\dfrac{1}{2-x}=\\dfrac{(x-1)^2}{x-2}$, deci $E(x)=\\dfrac{(x-1)^2}{x-2}\\cdot\\dfrac{(x-2)(x-5)}{x(x-1)^2}=\\dfrac{x-5}{x}$' },
        { pts: 3, text: 'Determină numerele întregi $n$ pentru care $E(n)$ este număr întreg.', ans: '$E(n)=1-\\dfrac{5}{n}$, deci $n\\in\\{\\pm1,\\,\\pm5\\}$; fără valorile excluse, $n\\in\\{-5,\\,-1\\}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x\\sqrt{2}+2$.',
      parts: [
        { pts: 2, text: 'Arată că lungimea segmentului $AB$ este egală cu $\\sqrt{6}$, unde $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$.', ans: '$A(-\\sqrt{2},\\,0)$, $B(0,\\,2)$, $AB=\\sqrt{OA^2+OB^2}=\\sqrt{6}$' },
        { pts: 3, text: 'Rezolvă în mulțimea numerelor reale inecuația $f(x)\\le x$.', ans: '$x(\\sqrt{2}-1)\\le-2$, deci $x\\le-\\dfrac{2}{\\sqrt{2}-1}=-2\\sqrt{2}-2$, adică $x\\in\\left(-\\infty,\\,-2\\sqrt{2}-2\\right]$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un dreptunghi, $O$ este punctul de intersecție a diagonalelor sale, $AB>AD$ și $AC=4$ cm. Punctele $M$ și $N$ sunt mijloacele segmentelor $OB$, respectiv $OD$, iar $P$ este un punct pe $AB$ astfel încât $PM=PN=2$ cm.',
      parts: [
        { pts: 2, text: 'Arată că aria triunghiului $MNP$ este egală cu $\\sqrt{3}\\text{ cm}^2$.', ans: '$MN=OM+ON=\\dfrac{BD}{2}=2$ cm, deci $\\triangle MNP$ este echilateral, cu aria $\\dfrac{4\\sqrt{3}}{4}=\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Determină lungimea segmentului $AB$.', ans: '$PO\\perp BD$, $PO=\\sqrt{3}$, $OB=2$; $\\triangle POB\\sim\\triangle DAB$ dă $AD=\\dfrac{\\sqrt{3}\\,AB}{2}$, iar $AB^2+AD^2=16$, deci $AB=\\dfrac{8\\sqrt{7}}{7}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez dreptunghic $ABCD$ cu $AD\\parallel BC$, $\\sphericalangle A=\\sphericalangle B=90^\\circ$, $AD=2BC=6$ cm și $\\mathcal{A}_{ABCD}=27\\sqrt{2}\\text{ cm}^2$. Punctul $M$ este mijlocul segmentului $AB$.',
      parts: [
        { pts: 2, text: 'Demonstrează că $CD=9$ cm.', ans: '$\\dfrac{(6+3)\\cdot AB}{2}=27\\sqrt{2}$, deci $AB=6\\sqrt{2}$ cm; cu $CT\\perp AD$, $DT=3$ cm, $CT=6\\sqrt{2}$ cm, deci $CD=\\sqrt{9+72}=9$ cm' },
        { pts: 3, text: 'Determină măsura unghiului $DMC$.', ans: '$MD^2=36+18=54$, $MC^2=9+18=27$ și $MD^2+MC^2=81=DC^2$, deci $\\sphericalangle DMC=90^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată, $ABCDA'B'C'D'$ este o prismă patrulateră regulată cu aria laterală egală cu $96\\text{ cm}^2$ și aria totală egală cu $128\\text{ cm}^2$.",
      parts: [
        { pts: 2, text: "Arată că $AA'=6$ cm.", ans: "$2\\cdot\\mathcal{A}_b=128-96=32$, deci $AB=4$ cm și $4\\cdot4\\cdot AA'=96$, $AA'=6$ cm" },
        { pts: 3, text: "Dacă punctele $M$ și $N$ sunt mijloacele muchiilor $AA'$, respectiv $DC$, determină lungimea proiecției segmentului $MN$ pe planul $(BCC')$.", ans: "Cu $P$ mijlocul muchiei $BB'$, proiecția este $PC=\\sqrt{4^2+3^2}=5$ cm" },
      ],
      fig: fig18,
    },
  ],
}
