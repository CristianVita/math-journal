// Testul 53 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 182–184; every answer here is computed and checked with the book's answers, pp. 288–289).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, meet, mid, plane, solid } from '../figure'
import { BOX, graph, pol, TETRA } from './shapes'

const fig7 = plane({ L1: [-1, 0], S12: [0, 0], S13: [2.2, 0], S23: [11, 0], L2: [12, 0] }, 170, { s: 'L1-L2', dot: 'S12 S13 S23', l: { L1: '', L2: '', S12: 'n', S13: 'n', S23: 'n' } })
const fig8 = plane({ C: [-3, 0], O: [0, 0], A: [3, 0], B: pol(50, 3) }, 150, {
  s: 'C-A O-B', l: { C: 's', O: 's', A: 's' },
  t: [{ at: [-1.1, 0.35], s: '4x + 50°', size: 11 }, { at: [1.7, 0.35], s: '2x + 10°', size: 11 }],
})
const C9: Pt = [0, 0], B9: Pt = [0.866, 0], A9: Pt = [0.112, 0.633]
const D9 = foot(B9, A9, C9)
const fig9 = plane({ A: A9, B: B9, C: C9, M: mid(A9, B9), D: D9 }, 120, { s: 'A-B-C-A B-D D-M', ra: ['BDA'] })
const fig10 = plane({ A: [0, 0], B: [66, 0], C: [66, 36], D: [0, 36], M: [54, 36], N: [66, 44] }, 140, { s: 'A-B-C-D-A C-N A-N' })
const fig11 = plane({ A: [-1, 0], B: [1, 0], P: pol(120), Q: pol(60) }, 110, { s: 'A-B', c: [{ at: [0, 0], r: 1 }], dot: 'P Q', l: { A: 'w', B: 'e' } })
const fig12 = solid({
  A: [0, 0, 0], B: [50, 0, 0], C: [50, 50, 0], D: [0, 50, 0],
  "A'": [13, 13, 30], "B'": [37, 13, 30], "C'": [37, 37, 30], "D'": [13, 37, 30],
}, BOX, 130)

const fig15 = graph({ A: [3.5, 0], B: [0, 7], C: [-4, 0], D: [0, 2], F1: [-0.3, 7.6], F2: [4.2, -1.4], G1: [-5, -0.5], G2: [5, 4.5] }, 140, [-5.5, 5.5], [-2, 8.5], {
  s: 'F1-F2 G1-G2', dot: 'A B C D', l: { F1: '', F2: '', G1: '', G2: '', A: 'ne', B: 'e', C: 'n', D: 'nw' },
})
// ∡B = 120°, ∡D = 80°: the bisectors are both horizontal
const A16: Pt = [2, 3.464], B16: Pt = [0, 0], C16: Pt = [3.5, -6.062], D16: Pt = [8.424, -1.929]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, M: meet(B16, [1, 0], A16, D16), N: meet(D16, [0, D16[1]], B16, C16) }, 130, { s: 'A-B-C-D-A B-M D-N' })
const fig17 = plane({ A: [0, 0], B: [100, 0], C: [100, 48], D: [0, 48], M: [36, 48], N: [64, 0] }, 150, { s: 'A-B-C-D-A A-M N-C' })
// drawn freely, as in the book
const p18: Record<string, P3> = { B: [0, 4, 0], C: [9, 1, 0], D: [6, -3, 0], A: [6, 2, 8] }
const fig18 = solid({ ...p18, M: [4.5, 2.5, 0], N: [6, -0.5, 4] }, TETRA('B', 'C', 'D', 'A'), 120, { seg: 'M-N', l: { M: 's', N: 'e' } })

export const M84: EnModel = {
  id: 'en-84',
  title: 'Paralela 45, Testul 53',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 182–184',
  items: [
    { text: 'Rezultatul calculului $(2^6-2^5:8):12-3$ este:', choices: ['$2$', '$3$', '$4$', '$5$'], ans: 0 },
    {
      text: 'Situația mediilor generale ale unor absolvenți de clasa a VIII-a, dintr-o unitate școlară, este redată în următorul tabel.\n\n| Interval medii | $[5,\\,6)$ | $[6,\\,7)$ | $[7,\\,8)$ | $[8,\\,9)$ | $[9,\\,10)$ | $10$ |\n|---|---|---|---|---|---|---|\n| Numărul de elevi | $4$ | $15$ | $20$ | $60$ | $76$ | $3$ |\n\nNumărul de elevi care au medii cel puțin egale cu $8$ este:',
      choices: ['$159$', '$60$', '$136$', '$139$'], ans: 3,
    },
    { text: 'Cel mai mic element din mulțimea $A=\\{x\\in\\mathbb{Z}\\mid -20<x\\leq15\\}$ este:', choices: ['$-21$', '$-20$', '$-19$', '$0$'], ans: 2 },
    { text: 'Media aritmetică a șase numere este $0{,}5$, iar media aritmetică a altor patru numere este $0{,}25$. Media aritmetică a celor zece numere este:', choices: ['$0{,}1$', '$0{,}4$', '$0{,}5$', '$0{,}375$'], ans: 1 },
    { text: 'Numărul real $a=\\left|2-\\sqrt{3}\\right|-\\left|\\dfrac{3}{2}-\\sqrt{3}\\right|+\\sqrt{12}-0{,}5$ este:', choices: ['natural', 'întreg negativ', 'rațional neîntreg', 'irațional'], ans: 0 },
    { text: 'Ionuț merge cu bicicleta o distanță de $24$ km între orele $8{:}10$ și $11{:}40$. El afirmă că a mers cu o viteză medie mai mare de $7$ km/h. Afirmația lui Ionuț este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată este prezentată schematic o stradă. Stâlpii de pe stradă sunt puși din $12$ m în $12$ m. Distanța dintre stâlpul $S_{12}$ și $S_{23}$ este:',
      choices: ['$132$ m', '$120$ m', '$144$ m', '$276$ m'], ans: 0, fig: fig7,
    },
    { text: 'Unghiurile $AOB$ și $BOC$, din figura alăturată, sunt adiacente suplementare. Valoarea lui $x$ este:', choices: ['$10^\\circ$', '$20^\\circ$', '$30^\\circ$', '$15^\\circ$'], ans: 1, fig: fig8 },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, având $\\sphericalangle ABC=40^\\circ$ și $\\sphericalangle ACB=80^\\circ$. Dacă $M$ este mijlocul laturii $AB$ și $BD\\perp AC$, atunci măsura unghiului $BMD$ este:',
      choices: ['$10^\\circ$', '$30^\\circ$', '$60^\\circ$', '$120^\\circ$'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un dreptunghi cu $AB=66$ cm și $BC=36$ cm, iar $M$ este un punct pe latura $CD$, $DM=54$ cm. Dreapta $AM$ intersectează dreapta $BC$ în punctul $N$. Lungimea segmentului $NC$ este:',
      choices: ['$6$ cm', '$10$ cm', '$8$ cm', '$12$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc, având diametrul $AB=2$ cm. Dacă $P$ și $Q$ sunt puncte pe cerc, astfel încât $\\overset{\\frown}{AP}=\\overset{\\frown}{PQ}=\\overset{\\frown}{QB}$, atunci perimetrul patrulaterului $ABQP$ este:',
      choices: ['$6$ cm', '$4$ cm', '$2$ cm', '$5$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'Un postament al unei statui este reprezentat, în figura alăturată, sub forma de trunchi de piramidă patrulateră regulată cu latura bazei mari de $50$ cm, latura bazei mici de $20$ cm și înălțimea de $30$ cm. Cantitatea de beton folosită pentru confecționarea postamentului este:',
      choices: ['$39\\text{ dm}^3$', '$39\\text{ cm}^3$', '$3900\\text{ cm}^3$', '$0{,}39\\text{ m}^3$'], ans: 0, fig: fig12,
    },

    {
      text: 'Suma de $300$ de lei este plătită cu bancnote de $10$ lei și de $5$ lei, cel puțin câte o bancnotă de fiecare fel.',
      parts: [
        { pts: 2, text: 'Care este numărul maxim de bancnote de $5$ lei care poate fi folosit?', ans: 'Cu $a$ bancnote de $10$ lei și $b$ de $5$ lei: $10a+5b=300$, deci $b=60-2a$; maximul e pentru $a=1$: $58$ de bancnote' },
        { pts: 3, text: 'În câte moduri putem plăti suma de $300$ de lei, în condițiile problemei?', ans: '$b=60-2a\\geq1$ dă $a\\in\\{1,\\,2,\\,\\ldots,\\,29\\}$: $29$ de moduri' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(2+\\dfrac{1}{x-3}\\right):\\left[1-\\left(\\dfrac{x-2}{x-3}\\right)^2\\right]$, unde $x\\in\\mathbb{R}\\setminus\\left\\{\\dfrac{5}{2},\\,3\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=3-x$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{\\dfrac{5}{2},\\,3\\right\\}$.', ans: '$E(x)=\\dfrac{2x-5}{x-3}\\cdot\\dfrac{(x-3)^2}{(-1)(2x-5)}=3-x$' },
        { pts: 3, text: 'Calculează $E^2(547)-E(546)\\cdot E(548)$.', ans: '$544^2-543\\cdot545=544^2-(544^2-1)=1$' },
      ],
    },
    {
      text: 'În figura alăturată sunt trasate graficele funcțiilor $f$ și $g$, într-un sistem de axe ortogonale $xOy$, unde $f,\\,g:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-2x+7$, $g(x)=\\dfrac{1}{2}x+2$. $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$, iar $C$ și $D$ sunt punctele de intersecție a reprezentării grafice a funcției $g$ cu axele $Ox$, respectiv $Oy$.',
      parts: [
        { pts: 2, text: 'Arată că $M(2,\\,3)$ este punct comun celor două reprezentări grafice.', ans: '$f(2)=g(2)=3$' },
        { pts: 3, text: 'Demonstrează că $D$ este ortocentrul triunghiului $ABC$.', ans: '$A\\left(\\dfrac{7}{2},\\,0\\right)$, $B(0,\\,7)$, $C(-4,\\,0)$, $D(0,\\,2)$; $BO\\perp AC$ și $D\\in BO$; pantele dreptelor $CD$ și $AB$ sunt $\\dfrac{1}{2}$ și $-2$, deci $CD\\perp AB$: $D$ este intersecția a două înălțimi, deci ortocentrul' },
      ],
      fig: fig15,
    },
    {
      text: 'Fie $ABCD$ un patrulater convex, $BM$ ($M\\in AD$) bisectoarea unghiului $ABC$ și $DN$ ($N\\in BC$) bisectoarea unghiului $ADC$ (vezi figura alăturată).',
      parts: [
        { pts: 2, text: 'Dacă $\\sphericalangle BAD=80^\\circ$ și $BM\\parallel DN$, calculează măsura unghiului $BCD$.', ans: 'Fie $\\sphericalangle ABC=2a$, $\\sphericalangle ADC=2b$; $\\sphericalangle AMB=\\sphericalangle ADN$ (corespondente), adică $100^\\circ-a=b$, deci $a+b=100^\\circ$ și $\\sphericalangle BCD=360^\\circ-80^\\circ-200^\\circ=80^\\circ$' },
        { pts: 3, text: 'Știind că $\\sphericalangle BAD=\\sphericalangle DCB=80^\\circ$, demonstrează că $BM\\parallel DN$.', ans: '$2a+2b=200^\\circ$, deci $a+b=100^\\circ$ și $\\sphericalangle AMB=180^\\circ-80^\\circ-a=b=\\sphericalangle ADN$; unghiurile corespondente sunt egale, deci $BM\\parallel DN$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$ cu $AB=100$ m și $BC=48$ m. Pe laturile $AB$ și $CD$ se consideră punctele $N$, respectiv $M$ astfel încât $DM=BN=36$ m.',
      parts: [
        { pts: 2, text: 'Arată că $AM\\parallel CN$.', ans: '$AN=MC=64$ m și $AN\\parallel MC$, deci $ANCM$ este paralelogram și $AM\\parallel CN$' },
        { pts: 3, text: 'Calculează distanța dintre dreptele $AM$ și $CN$.', ans: 'Aria paralelogramului $ANCM$ este $64\\cdot48=3072\\text{ m}^2$ și $AM=60$ m, deci distanța este $h=\\dfrac{3072}{60}=51{,}2$ m' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentat un tetraedru $ABCD$ cu $AB=AC=5$ cm, $DB=DC=5\\sqrt{3}$ cm și $BC=8$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrează că $BC\\perp AD$.', ans: 'Cu $M$ mijlocul lui $BC$: $AM\\perp BC$ și $DM\\perp BC$ (triunghiuri isoscele), deci $BC\\perp(AMD)$ și $BC\\perp AD$' },
        { pts: 3, text: 'Dacă, în plus, $AD=10$ cm, calculează lungimea segmentului $MN$, unde $M$ este mijlocul segmentului $BC$, iar $N$ este mijlocul segmentului $AD$.', ans: '$AD^2=100=AC^2+DC^2$, deci $\\triangle ACD$ e dreptunghic în $C$ și $CN=\\dfrac{AD}{2}=5$ cm; la fel $BN=5$ cm; în $\\triangle NMC$, $MN=\\sqrt{25-16}=3$ cm' },
      ],
      fig: fig18,
    },
  ],
}
