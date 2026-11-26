// Testul 60 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 197–199; every answer here is computed and checked with the book's answers, p. 291).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, meet, plane, solid } from '../figure'
import { graph, pol, PRISM3, prism3 } from './shapes'

const s3 = Math.sqrt(3), s6 = Math.sqrt(6)

const lab = (deg: number, r: number, s: string, p?: string) => [
  { at: pol(deg, r), s, anchor: 'middle' as const, size: 10 },
  ...(p ? [{ at: [pol(deg, r)[0], pol(deg, r)[1] - 1.1] as Pt, s: p, anchor: 'middle' as const, size: 10 }] : []),
]
const fig2 = plane({ O: [0, 0], X: pol(90, 5), Y: pol(36, 5), Z: pol(-36, 5), W: pol(-144, 5) }, 110, {
  s: 'O-X O-Y O-Z O-W', c: [{ at: 'O', r: 5 }], l: { O: '', X: '', Y: '', Z: '', W: '' },
  t: [...lab(63, 3, 'I', '15%'), ...lab(0, 3, 'II', '20%'), ...lab(-90, 2.6, 'III', '30%'), ...lab(153, 2.8, 'IV')],
})
const fig7 = plane({ M: [0, 0], N: [0.5, 0], P: [1.5, 0], Q: [5.5, 0] }, 170, { s: 'M-Q', dot: 'M N P Q', l: { M: 'n', N: 'n', P: 'n', Q: 'n' } })
const C8 = pol(228, 3)
const fig8 = plane({ A: [-2.5, 0], B: [0, 0], E: [1.5, 0], C: C8, D: [C8[0] + 3.5, C8[1]], K: [C8[0] - 1, C8[1]] }, 150, {
  s: 'A-E K-D B-C', l: { K: '', A: 'n', B: 'n', E: 'n', C: 's', D: 's' },
  t: [{ at: [-0.75, -0.55], s: '2x°', anchor: 'middle', size: 11 }, { at: [C8[0] + 1.1, C8[1] + 0.3], s: '120° − 3x°', anchor: 'start', size: 11 }],
})
const fig9 = plane({ M: [0, 0], D: pol(150, 5.5), B: pol(-30, 5.5), A: pol(220, 5.5), C: pol(89.2, 5.5) }, 120, { s: 'A-B-C-D-A B-D A-M M-C', ra: ['DAB', 'BCD'], l: { M: 's' } })
const fig10 = plane({ A: [0, 0], B: [8, 0], C: [10, 2 * s3], D: [2, 2 * s3] }, 140, { s: 'A-B-C-D-A B-D', ra: ['ADB'] })
const fig11 = plane({ O: [0, 0], A: pol(160, 3), B: pol(20, 3), C: pol(-40, 3), D: pol(-140, 3) }, 110, { s: 'A-B D-C A-C B-C', c: [{ at: 'O', r: 3 }], l: { O: '' } })
const fig12 = solid(prism3(8, 4), PRISM3, 120)

const fig15 = graph({ A: [0.5, 0], B: [0, -1], L1: [-1, -3], L2: [2.5, 4] }, 110, [-2, 3.5], [-3.5, 4.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'se', B: 'w' } })
const fig16 = plane({ O: [0, 0], A: [-13, 0], B: [13, 0], C: [13, 5], D: [-13, 5], M: [-12, 5], N: [12, 5] }, 130, { s: 'A-B-C-D-A', c: [{ at: 'O', r: 13 }], dot: 'O M N', l: { O: 's', M: 'n', N: 'n' } })
const A17: Pt = [0, 0], B17: Pt = [6, 0], C17: Pt = [4, 5]
const B1: Pt = foot(B17, A17, C17), C1: Pt = foot(C17, A17, B17)
const fig17 = plane({ A: A17, B: B17, C: C17, B1, C1, H: meet(B17, B1, C17, C1) }, 130, { s: 'A-B-C-A B-B1 C-C1', ra: ['BB1C', 'CC1B'] })
const p18: Record<string, P3> = { T: [3, 0, 0], A: [0, 3 * s3, 0], E: [6, 3 * s3, 0], M: [3, 2 * s3, s6] }
const fig18 = solid(p18, 'A-T-E A-T-M T-E-M E-A-M', 120)

export const M91: EnModel = {
  id: 'en-91',
  title: 'Paralela 45, Testul 60',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 197–199',
  items: [
    { text: 'Inversul numărului rațional $a=0{,}5-\\dfrac{1}{6}:\\dfrac{2}{3}$ este:', choices: ['$4$', '$-\\dfrac{1}{4}$', '$-4$', '$-\\dfrac{2}{7}$'], ans: 0 },
    {
      text: 'O firmă trebuie să construiască $100$ km de autostradă în $4$ ani. În diagrama alăturată este reprezentat procentul din lucrare realizat în fiecare dintre primii trei ani. Numărul de kilometri care trebuie realizați în ultimul an este:',
      choices: ['$30$', '$35$', '$40$', '$70$'], ans: 1, fig: fig2,
    },
    { text: 'Dacă $30$ de muncitori pot termina o lucrare în $12$ ore, atunci $40$ de muncitori, la fel de harnici, vor termina lucrarea în:', choices: ['$12$ ore', '$16$ ore', '$9$ ore', '$10$ ore'], ans: 2 },
    { text: 'Considerăm mulțimile $A=\\{x\\in\\mathbb{N}\\mid x^2<9\\}$ și $B=\\{x\\in\\mathbb{N}\\mid 2^x<9\\}$. Atunci:', choices: ['$A\\subset B$', '$A=B$', '$A\\supset B$', '$A\\cap B=\\varnothing$'], ans: 0 },
    { text: 'Se dau numerele $a=(2+\\sqrt{2})^2-\\sqrt{8}-\\dfrac{1}{3-2\\sqrt{2}}$ și $b=(0{,}2)^{-1}$. Media aritmetică a numerelor $a$ și $b$ este:', choices: ['$2\\sqrt{2}$', '$2+\\sqrt{2}$', '$4$', '$1$'], ans: 2 },
    { text: 'În școala Anei sunt două clase a V-a: prima are $25$ elevi, iar a doua cu $3$ mai mult. Ana spune că în școala sa învață $52$ de elevi de clasa a V-a. Afirmația Anei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $M$, $N$, $P$ și $Q$ sunt coliniare, în această ordine, astfel încât $NP=2MN$ și $PQ=4NP$. Dacă lungimea segmentului $MQ$ este egală cu $5{,}5$ cm, atunci lungimea segmentului $NP$ este egală cu:',
      choices: ['$0{,}5$ cm', '$1{,}5$ cm', '$2$ cm', '$1$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate dreptele paralele $AB$ și $CD$, astfel încât punctele $A$ și $D$ sunt în semiplanele opuse determinate de dreapta $BC$. Dacă măsura unghiului $ABC$ este egală cu $2x^\\circ$, iar măsura unghiului $BCD$ este egală cu $120^\\circ-3x^\\circ$, atunci măsura unghiului $CBE$ (unde $B\\in(AE)$) este egală cu:',
      choices: ['$120^\\circ$', '$132^\\circ$', '$146^\\circ$', '$150^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un patrulater cu $\\sphericalangle A=\\sphericalangle C=90^\\circ$. Lungimile diagonalelor sale sunt $AC=10$ cm și $BD=11$ cm, iar $M$ este mijlocul segmentului $BD$. Perimetrul triunghiului $MAC$ este:',
      choices: ['$20$ cm', '$20{,}5$ cm', '$21$ cm', '$24$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat paralelogramul $ABCD$, având $AD=4$ cm și perimetrul egal cu $24$ cm. Dacă diagonala $BD$ este perpendiculară pe latura $AD$, atunci măsura unghiului $ABC$ este egală cu:',
      choices: ['$120^\\circ$', '$100^\\circ$', '$30^\\circ$', '$90^\\circ$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ și $CD$ sunt două coarde paralele ale unui cerc. Măsura arcului mic $CD$ este egală cu $100^\\circ$, iar $\\sphericalangle BAC=30^\\circ$. Măsura unghiului $ACB$ este egală cu:',
      choices: ['$120^\\circ$', '$140^\\circ$', '$70^\\circ$', '$55^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: "În figura alăturată este reprezentată o prismă triunghiulară regulată $ABCA'B'C'$ cu muchia bazei $AB=8$ cm și muchia laterală $AA'=4$ cm. Măsura unghiului format de planele $(A'BC)$ și $(ABC)$ este:",
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 0, fig: fig12,
    },

    {
      text: 'Tatăl și fiul au împreună $55$ ani, iar raportul vârstelor lor este $4{,}5$.',
      parts: [
        { pts: 2, text: 'Află vârsta fiului.', ans: '$4{,}5f+f=55$, deci $f=10$ ani' },
        { pts: 3, text: 'Peste câți ani vârsta tatălui va fi dublul vârstei fiului?', ans: 'Tatăl are $45$ de ani: $45+x=2(10+x)$, deci peste $25$ de ani' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{2x}{x+1}+\\left(\\dfrac{x-3}{x+1}+\\dfrac{x+1}{x-3}-2\\right):\\dfrac{8}{x-3}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,3\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(0)=2$.', ans: '$E(0)=0+\\left(-3-\\dfrac{1}{3}-2\\right):\\left(-\\dfrac{8}{3}\\right)=\\dfrac{16}{3}\\cdot\\dfrac{3}{8}=2$' },
        { pts: 3, text: 'Demonstrează că $E(x)$ are valoare constantă, oricare ar fi $x\\in\\mathbb{R}\\setminus\\{-1,\\,3\\}$.', ans: 'Paranteza este $\\dfrac{\\big((x-3)-(x+1)\\big)^2}{(x+1)(x-3)}=\\dfrac{16}{(x+1)(x-3)}$, deci $E(x)=\\dfrac{2x}{x+1}+\\dfrac{2}{x+1}=2$' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-1$. În figura alăturată este reprezentat graficul funcției $f$ într-un reper ortogonal $xOy$.',
      parts: [
        { pts: 2, text: 'Compară numerele $f(1)$ și $f(\\sqrt{2})$.', ans: '$f(1)=1<2\\sqrt{2}-1=f(\\sqrt{2})$' },
        { pts: 3, text: 'Află aria suprafeței delimitate de reprezentarea grafică a funcției și axele de coordonate.', ans: 'Graficul taie axele în $\\left(\\dfrac{1}{2},\\,0\\right)$ și $(0,\\,-1)$, deci aria este $\\dfrac{1}{2}\\cdot\\dfrac{1}{2}\\cdot1=0{,}25$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un dreptunghi cu $AB=26$ cm și $BC=5$ cm, iar cercul de centru $O$ admite segmentul $AB$ ca diametru.',
      parts: [
        { pts: 2, text: 'Demonstrează că dreapta $CD$ este secantă cercului.', ans: '$d(O,\\,CD)=BC=5$ cm, iar raza cercului este $13$ cm $>5$ cm' },
        { pts: 3, text: 'Calculează lungimea segmentului $MN$, unde $M$ și $N$ sunt punctele în care dreapta $CD$ intersectează cercul.', ans: '$MN=2\\sqrt{13^2-5^2}=2\\cdot12=24$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $BB_1$ și $CC_1$ sunt înălțimi în triunghiul ascuțitunghic $BAC$, iar $\\{H\\}=BB_1\\cap CC_1$.',
      parts: [
        { pts: 2, text: 'Arată că dreptele $AH$ și $BC$ sunt perpendiculare.', ans: 'În $H$ se întâlnesc două înălțimi, deci $H$ este ortocentrul triunghiului și $AH$ este, de asemenea, înălțime: $AH\\perp BC$' },
        { pts: 3, text: 'Demonstrează că $BH\\cdot B_1H=CH\\cdot C_1H$.', ans: '$\\triangle B_1CH\\sim\\triangle C_1BH$ (UU: unghiuri drepte și opuse la vârf), deci $\\dfrac{B_1H}{C_1H}=\\dfrac{CH}{BH}$, adică $BH\\cdot B_1H=CH\\cdot C_1H$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida triunghiulară regulată $MATE$, având vârful $M$. Se știe că $MA=3\\sqrt{2}$ cm, iar $\\sphericalangle AME=90^\\circ$.',
      parts: [
        { pts: 2, text: 'Arată că aria laterală a piramidei este $27\\text{ cm}^2$.', ans: 'Fețele laterale sunt triunghiuri dreptunghice isoscele congruente, fiecare cu aria $\\dfrac{(3\\sqrt{2})^2}{2}=9\\text{ cm}^2$: $\\mathcal{A}_l=27\\text{ cm}^2$' },
        { pts: 3, text: 'Determină distanța de la punctul $A$ la planul $(MTE)$.', ans: '$\\triangle MAE\\equiv\\triangle MAT$, deci $\\sphericalangle AMT=90^\\circ$; $AM\\perp ME$ și $AM\\perp MT$, deci $AM\\perp(MTE)$ și $d(A,\\,(MTE))=AM=3\\sqrt{2}$ cm' },
      ],
      fig: fig18,
    },
  ],
}
