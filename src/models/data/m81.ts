// Testul 50 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 175–177; every answer here is computed and checked with the book's answers, p. 287).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { along, foot, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [20, 0], C: [24, 0], D: [44, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const lab8 = (deg: number, s: string) => ({ at: pol(deg, 2.1), s, anchor: 'middle' as const, size: 10 })
const fig8 = plane({ O: [0, 0], A: pol(40, 4), B: pol(170, 4), C: pol(235, 4), D: pol(285, 4) }, 130, {
  s: 'O-A O-B O-C O-D', l: { O: 'e' },
  t: [lab8(105, '3x − 20°'), lab8(202.5, 'x + 15°'), lab8(260, 'x'), lab8(342.5, '2x + 15°')],
})
const A9 = pol(60, 12), B9: Pt = [0, 0], C9: Pt = [16, 0]
const fig9 = plane({ A: A9, B: B9, C: C9, E: along(A9, B9, 1 / 3), F: along(A9, C9, 1 / 3) }, 130, { s: 'A-B-C-A E-F' })
const A10: Pt = [0, 0], B10: Pt = [8, 0], C10: Pt = [8, 6]
const fig10 = plane({ A: A10, B: B10, C: C10, D: [0, 6], M: foot(B10, A10, C10), N: [4, 0], P: [8, 3] }, 130, {
  s: 'A-B-C-D-A A-C B-M', d: 'M-N N-P P-M', ra: ['BMC'], l: { N: 's', P: 'e', M: 'n' },
})
const fig11 = plane({ O: [0, 0], A: pol(90), B: pol(210), C: pol(-10) }, 100, { s: 'A-B-C-A', c: [{ at: 'O', r: 1 }], l: { O: '' } })
const fig12 = solid(box(40, 40, 50), BOX, 110)

const fig15 = graph({ A: [3, -1], B: [-6, -4], C: [0, -2], L1: [-7, -7 / 3 - 2], L2: [5, 5 / 3 - 2] }, 150, [-7.5, 5.5], [-5, 1.5], {
  s: 'L1-L2', dot: 'A B C', l: { L1: '', L2: '', A: 's', B: 'n', C: 'se' },
})
const fig16 = plane({ A: [0, 2 * s3], D: [6, 2 * s3], B: [0, 0], C: [6, 0], P: [2, 2 * s3], Q: [4, 2 * s3], M: [3, 3 * s3] }, 130, {
  s: 'A-D-C-B-A P-M-Q', l: { P: 's', Q: 's' },
})
const fig17 = plane({ A: [0, 0], B: [120, 0], M: [90, 0], C: [90, 30 * s3], D: [30, 30 * s3] }, 150, { s: 'A-B-C-D-A A-C C-M', ra: ['ACB', 'CMB'] })
const aA = (96.4 * Math.PI) / 180
const f18 = plane({ O: [0, 0], Q: [0, -8], B: [-6, -8], C: [6, -8], A: [6 * Math.cos(aA), -8 + 1.5 * Math.sin(aA)] }, 110, {
  s: 'B-C', d: 'A-B A-C', c: [{ at: 'O', r: 10 }], dot: 'O', l: { Q: '', O: 'e', A: 'n' },
})
const r18 = f18.p.C[0] - f18.p.Q[0]
const fig18 = { ...f18, e: [{ at: f18.p.Q, rx: r18, ry: r18 / 4, back: true }] }

export const M81: EnModel = {
  id: 'en-81',
  title: 'Paralela 45, Testul 50',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 175–177',
  items: [
    { text: 'Rezultatul calculului $-12:2\\cdot3+(-2)^4+1^{10}$ este:', choices: ['$24$', '$-1$', '$-33$', '$15$'], ans: 1 },
    {
      text: 'În timpul unei excursii de patru zile un drumeț a parcurs distanțele înregistrate în tabelul alăturat.\n\n| Ziua | Marți | Miercuri | Joi | Vineri |\n|---|---|---|---|---|\n| Nr. kilometri | $30$ | $25$ | $20$ | $25$ |\n\nLungimea totală a traseului este:',
      choices: ['$90$ km', '$70$ km', '$75$ km', '$100$ km'], ans: 3,
    },
    { text: 'Din $9$ kg de grâu, prin măcinare, obținem $8{,}25$ kg de făină. Cantitatea de făină obținută prin măcinarea a $300$ kg de grâu este:', choices: ['$275$ kg', '$285$ kg', '$270$ kg', '$291{,}25$ kg'], ans: 0 },
    { text: 'Media aritmetică a șase numere este $0{,}5$, iar media aritmetică a cinci dintre ele este $0{,}4$. Al șaselea număr este:', choices: ['$0{,}1$', '$0{,}6$', '$1$', '$0{,}2$'], ans: 2 },
    { text: 'Numărul $a=\\sqrt{2}-\\dfrac{3-2\\sqrt{2}}{\\sqrt{2}-1}$ aparține mulțimii:', choices: ['$\\mathbb{Q}\\setminus\\mathbb{Z}$', '$\\mathbb{R}\\setminus\\mathbb{Q}$', '$\\mathbb{Z}\\setminus\\mathbb{N}$', '$\\mathbb{N}$'], ans: 3 },
    { text: 'Considerăm mulțimile $A=\\{-1,\\,0,\\,5\\}$ și $B=\\{2,\\,-1,\\,6\\}$. Mihai afirmă că $5\\in A\\setminus B$. Afirmația lui Mihai este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine, astfel încât $AB=5BC$, $AB=CD$ și $BD=24$ cm. Lungimea segmentului $AD$ este egală cu:',
      choices: ['$36$ cm', '$42$ cm', '$44$ cm', '$48$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, $\\sphericalangle AOB$, $\\sphericalangle BOC$, $\\sphericalangle COD$, $\\sphericalangle DOA$ sunt unghiuri în jurul punctului $O$. Valoarea lui $x$, conform informațiilor din figura alăturată, este:',
      choices: ['$50^\\circ$', '$70^\\circ$', '$60^\\circ$', '$40^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este desenat triunghiul $ABC$ și punctele $E\\in AB$, $F\\in AC$, astfel încât $EF\\parallel BC$, $AE=4$ cm, $AB=12$ cm și $FC=12$ cm. Lungimea segmentului $AF$ este:',
      choices: ['$8$ cm', '$5$ cm', '$6$ cm', '$7$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat dreptunghiul $ABCD$, având $AB=8$ cm și $AD=6$ cm. Dacă $BM\\perp AC$, $M\\in AC$, iar $N$ și $P$ sunt mijloacele laturilor $AB$, respectiv $BC$, atunci perimetrul triunghiului $MNP$ este:',
      choices: ['$9{,}8$ cm', '$10{,}8$ cm', '$11$ cm', '$12$ cm'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este înscris în cercul $\\mathcal{C}(O,\\,R)$, iar măsurile arcelor mici $AB$ și $AC$ sunt de $120^\\circ$, respectiv $100^\\circ$. Măsura unghiului $BAC$ este:',
      choices: ['$70^\\circ$', '$40^\\circ$', '$60^\\circ$', '$80^\\circ$'], ans: 0, fig: fig11,
    },
    {
      text: "Fie o prismă patrulateră regulată $ABCDA'B'C'D'$ cu latura bazei $AB=40$ cm și suma lungimilor tuturor muchiilor egală cu $520$ cm (vezi figura alăturată). Lungimea muchiei laterale $AA'$ este egală cu:",
      choices: ['$30$ cm', '$90$ cm', '$50$ cm', '$60$ cm'], ans: 2, fig: fig12,
    },

    {
      text: 'O cantitate de mere a fost împărțită în mod egal într-un număr de lădițe. Mai întâi s-au pus câte $7$ kg în fiecare lădiță și au rămas $65$ kg. Apoi s-au mai adăugat câte $8$ kg în fiecare lădiță și a mai rămas un kilogram.',
      parts: [
        { pts: 2, text: 'Pot fi nouă lădițe? Justifică răspunsul.', ans: 'Nu: s-ar adăuga $9\\cdot8=72>65$ kg' },
        { pts: 3, text: 'Află cantitatea inițială de mere.', ans: '$65-8n=1$, deci $n=8$ lădițe și $8\\cdot7+65=121$ kg de mere' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{4x}{x+1}+\\dfrac{1}{x^2-1}\\right)\\cdot(x^2-1)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=(2x-1)^2$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: '$E(x)=4x(x-1)+1=4x^2-4x+1=(2x-1)^2$' },
        { pts: 3, text: 'Determină numărul natural $a$, pentru care numărul $E\\left(\\sqrt{3}\\right)+(a-1)\\sqrt{3}$ este natural.', ans: '$E\\left(\\sqrt{3}\\right)=13-4\\sqrt{3}$, deci numărul este $13+(a-5)\\sqrt{3}$, natural numai dacă $a=5$' },
      ],
    },
    {
      text: 'Considerăm funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$, $a,\\,b\\in\\mathbb{R}$ și punctele $A(3,\\,-1)$ și $B(-6,\\,-4)$ situate pe reprezentarea grafică a funcției $f$ în sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Arată că $a=\\dfrac{1}{3}$ și $b=-2$.', ans: '$3a+b=-1$ și $-6a+b=-4$, deci $9a=3$, $a=\\dfrac{1}{3}$ și $b=-2$' },
        { pts: 3, text: 'Demonstrează că punctele $A(3,\\,-1)$, $B(-6,\\,-4)$ și $C(0,\\,-2)$ sunt coliniare.', ans: '$f(0)=-2$, deci $A$, $B$, $C$ sunt pe graficul funcției $f$, adică sunt coliniare' },
      ],
      fig: fig15,
    },
    {
      text: 'Un tablou, în formă de dreptunghi $ABCD$, $AD=6$ cm, $AB=2\\sqrt{3}$ cm este fixat pe un perete printr-un fir de ață $PMQ$, ca în figura alăturată, astfel încât $AP=PQ=QD$ și $\\sphericalangle APM=\\sphericalangle DQM=120^\\circ$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $MPQ$ este echilateral.', ans: '$\\sphericalangle MPQ=\\sphericalangle MQP=180^\\circ-120^\\circ=60^\\circ$, deci $\\triangle MPQ$ este echilateral' },
        { pts: 3, text: 'Demonstrează că punctele $M$, $P$, $B$ sunt coliniare.', ans: '$AP=2$ cm, $\\operatorname{tg}(\\sphericalangle APB)=\\dfrac{2\\sqrt{3}}{2}=\\sqrt{3}$, deci $\\sphericalangle APB=60^\\circ$ și $\\sphericalangle MPB=120^\\circ+60^\\circ=180^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este schița unei grădini în formă de trapez isoscel $ABCD$, având $AB=120$ m, $CD=60$ m, $AC\\perp BC$, iar punctul $M$ este proiecția punctului $C$ pe $AB$.',
      parts: [
        { pts: 2, text: 'Arată că aria grădinii este mai mică decât o jumătate de hectar.', ans: '$MB=30$ m, $AM=90$ m, $CM=\\sqrt{90\\cdot30}=30\\sqrt{3}$ m, deci aria este $\\dfrac{180\\cdot30\\sqrt{3}}{2}=2700\\sqrt{3}\\text{ m}^2<5000\\text{ m}^2$' },
        { pts: 3, text: 'Dacă $N$ este simetricul lui $B$ față de $M$, demonstrează că $DN$ este bisectoarea unghiului $ADC$.', ans: '$AN=120-60=60$ m $=DC$, $AN\\parallel DC$, iar $AD=BC=\\sqrt{900+2700}=60$ m, deci $ANCD$ este romb și diagonala $DN$ este bisectoarea unghiului $ADC$' },
      ],
      fig: fig17,
    },
    {
      text: 'Pe o sferă de centru $O$ și rază $R=10$ cm considerăm punctele $A$, $B$, $C$, astfel încât $AB=8$ cm, $BC=12$ cm și $AC=4\\sqrt{5}$ cm (vezi figura alăturată).',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $ABC$ este dreptunghic.', ans: '$AB^2+AC^2=64+80=144=BC^2$, deci $\\triangle ABC$ este dreptunghic în $A$' },
        { pts: 3, text: 'Calculează distanța de la punctul $O$ la planul $(ABC)$.', ans: 'Proiecția lui $O$ pe $(ABC)$ este centrul cercului circumscris, $Q$, mijlocul lui $BC$; $QB=6$ cm, deci $d=OQ=\\sqrt{100-36}=8$ cm' },
      ],
      fig: fig18,
    },
  ],
}
