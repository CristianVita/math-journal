// Model E.N. 7 (the book's pages 120–121)
import type { EnModel } from '../types'
import { mid, type Pt } from '../figure'

const T = [16, 20, 20, 25, 21, 17, 12]
const DAYS = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']
const yOf = (t: number) => 105 - (t - 5) * 4

const A11: Pt = [70, 10], B11: Pt = [15, 100], C11: Pt = [135, 100]

export const M7: EnModel = {
  id: 'en-7',
  title: 'Model E.N. 7',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 120–121',
  items: [
    { text: 'Rezultatul calculului $763:7$ este:', choices: ['$19$', '$1{,}9$', '$109$', '$10{,}9$'], ans: 2 },
    { text: 'Raportul dintre prețul unui creion și al unui caiet este $1/5$, iar prețul caietului reprezintă $35\\%$ din prețul unei cărți. Ce procent reprezintă prețul creionului din prețul cărții?', choices: ['$20\\%$', '$70\\%$', '$7\\%$', '$35\\%$'], ans: 2 },
    { text: 'Aflați suma cifrelor numărului $A=10^{13}-2$.', choices: ['$116$', '$107$', '$125$', '$117$'], ans: 0 },
    { text: 'În șirul de numere naturale $0, 1, 4, 9, 16$, al șaselea termen va fi:', choices: ['$20$', '$25$', '$24$', '$27$'], ans: 1 },
    {
      text: 'În graficul alăturat sunt prezentate temperaturile pentru zilele unei săptămâni din luna aprilie. Ziua cu cea mai scăzută temperatură a fost:',
      choices: ['luni', 'joi', 'sâmbătă', 'duminică'], ans: 3,
      fig: {
        w: 200, h: 130, p: {},
        axes: { o: [30, 105], x: [30, 195], y: [105, 8] },
        path: T.map((t, k) => ({ d: `M${42 + 21 * k} 105 V${yOf(t)} H${52 + 21 * k} V105 Z`, fill: '#555' })),
        t: [
          { at: [36, 14], s: 'temperatura [°C]', anchor: 'start' }, { at: [198, 97], s: 'ziua', anchor: 'end' },
          ...[10, 15, 20, 25].map((v) => ({ at: [25, yOf(v) + 4] as Pt, s: String(v), anchor: 'end' as const, size: 11 })),
          ...DAYS.map((d, k) => ({ at: [47 + 21 * k, 120] as Pt, s: d })),
        ],
      },
    },
    { text: 'Valoarea de adevăr a propoziției „$5\\sqrt{2}\\in(3;7]$” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'Câte triunghiuri sunt desenate în figura alăturată?',
      choices: ['$4$', '$5$', '$6$', '$7$'], ans: 2,
      fig: {
        w: 160, h: 100,
        p: { K: [10, 10], L: [10, 50], N: [10, 90], P: [150, 10], Q: [150, 50], R: [150, 90] },
        l: { K: '', L: '', N: '', P: '', Q: '', R: '' },
        s: 'K-N P-R K-Q L-P L-R N-Q',
      },
    },
    {
      text: 'Două unghiuri interne de aceeași parte a secantei, formate de o secantă ce intersectează două drepte paralele, sunt:',
      choices: ['complementare', 'congruente', 'opuse la vârf', 'suplementare'], ans: 3,
      fig: { w: 180, h: 85, p: { K: [10, 22], L: [170, 22], N: [10, 62], P: [170, 62], Q: [40, 82], R: [130, 4] }, l: { K: '', L: '', N: '', P: '', Q: '', R: '' }, s: 'K-L N-P Q-R' },
    },
    { text: 'Dacă lungimile catetelor unui triunghi dreptunghic sunt de $24$ cm și $7$ cm, atunci raza cercului circumscris triunghiului este egală cu:', choices: ['$12{,}5$ cm', '$12$ cm', '$7$ cm', '$13$ cm'], ans: 0 },
    { text: 'Patrulaterul în care diagonalele se înjumătățesc, sunt congruente și perpendiculare una pe cealaltă se numește:', choices: ['paralelogram', 'dreptunghi', 'romb', 'pătrat'], ans: 3 },
    {
      text: 'În $\\triangle ABC$ cu aria de $48\\text{ cm}^2$, punctele $D$ și $E$ sunt mijloacele laturilor $AB$ și $AC$. Aria $\\triangle ADE$ este:',
      choices: ['$24\\text{ cm}^2$', '$16\\text{ cm}^2$', '$12\\text{ cm}^2$', '$8\\text{ cm}^2$'], ans: 2,
      fig: { w: 150, h: 115, p: { A: A11, B: B11, C: C11, D: mid(A11, B11), E: mid(A11, C11) }, s: 'A-B-C-A D-E' },
    },
    { text: 'Aria laterală a unui cub care are diagonala egală cu $3\\sqrt{6}$ cm este egală cu:', choices: ['$72\\text{ cm}^2$', '$72\\sqrt{2}\\text{ cm}^2$', '$72\\sqrt{3}\\text{ cm}^2$', '$72\\sqrt{6}\\text{ cm}^2$'], ans: 0 },

    {
      text: 'Prețul unei cărți a scăzut cu $10\\%$, iar după două săptămâni s-a redus din nou cu $10\\%$, ajungând să coste $24{,}30$ lei.',
      parts: [
        { pts: 2, text: 'Care a fost prețul inițial?', ans: '$30$ de lei' },
        { pts: 3, text: 'Cu ce procent ar fi trebuit micșorat prețul inițial pentru a ajunge la cel final?', ans: '$19\\%$' },
      ],
    },
    {
      text: 'Fie expresia $E(x)=\\left[\\dfrac{1}{x-2}-\\dfrac{x(3-x)}{x^2-x-2}\\right]:\\dfrac{4x^2-4}{x^2-3x+2}$, unde $x\\in\\mathbb{R}\\setminus\\{\\pm1;2\\}$.',
      parts: [
        { pts: 2, text: 'Dacă $E(x)=[F(x)]^2$, determinați $F(x)$.', ans: '$E(x)=\\dfrac{(x-1)^2}{4(x+1)^2}$, $F(x)=\\dfrac{x-1}{2(x+1)}$' },
        { pts: 3, text: 'Aflați $a\\in\\mathbb{R}$ dacă $F(a)=0{,}25$.', ans: '$a=3$' },
      ],
    },
    {
      text: 'Fie funcția $f:A\\to\\mathbb{R}$, $f(x)=mx+2$, cu $A=\\{x\\in\\mathbb{Z}\\mid |2x-3|\\le 5\\}$.',
      parts: [
        { pts: 2, text: 'Să se determine $m\\in\\mathbb{R}$ dacă punctul $M(2;-2)$ aparține reprezentării grafice a funcției.', ans: '$m=-2$' },
        { pts: 3, text: 'Pentru $m=-2$, să se reprezinte grafic funcția.', ans: '$A=\\{-1;0;1;2;3;4\\}$; graficul: $A(-1;4)$, $B(0;2)$, $C(1;0)$, $M(2;-2)$, $D(3;-4)$, $E(4;-6)$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentată o grădină în formă de dreptunghi $ABCD$, având lățimea de $6$ m și aria de $54\\text{ m}^2$.',
      parts: [
        { pts: 2, text: 'Pe laturile terenului se plantează pomi la distanțe de $1{,}5$ m unul față de celălalt. Aflați câți pomi sunt necesari.', ans: '$20$ de pomi' },
        { pts: 3, text: 'O fântână în formă circulară este înconjurată de o suprafață plantată cu iarbă (partea hașurată), formând pătratul $AMND$. Raza cercului este de $2$ m. Să se verifice dacă aria porțiunii hașurate este mai mică de $23\\text{ m}^2$.', ans: 'nu: aria este $36-4\\pi\\approx 23{,}43\\text{ m}^2$' },
      ],
      fig: {
        w: 135, h: 98,
        p: { A: [12, 84], M: [84, 84], B: [120, 84], C: [120, 12], N: [84, 12], D: [12, 12] },
        l: { A: 'sw', M: 's', B: 'se', C: 'ne', N: 'n', D: 'nw' },
        s: 'A-B-C-D-A M-N',
        path: [{ d: 'M12 12 H84 V84 H12 Z M24 48 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0', hatch: true }],
      },
    },
    {
      text: 'Figura alăturată reprezintă o grădină în formă de trapez dreptunghic $ABCD$ cu $AB=8$ m și linia mijlocie de $6$ m. Punctul $M$ este mijlocul laturii $AD$ și $\\sphericalangle BMC=90^\\circ$.',
      parts: [
        { pts: 2, text: 'Aflați lungimea lui $AD$.', ans: '$CD=4$ m, $BC=12$ m, $AD=8\\sqrt{2}$ m' },
        { pts: 3, text: 'Demonstrați că $\\mathcal{A}_{\\triangle BCM}=\\mathcal{A}_{\\triangle DCM}+\\mathcal{A}_{\\triangle ABM}$.', ans: 'se calculează ariile: fiecare parte este jumătate din aria trapezului' },
      ],
      fig: { w: 100, h: 128, p: { A: [12, 114], B: [84, 114], C: [48, 12], D: [12, 12], M: [12, 63] }, l: { M: 'w' }, s: 'A-B-C-D-A M-B M-C', ra: ['DAB', 'ADC', 'BMC'] },
    },
    {
      text: 'Un vas în formă de paralelipiped dreptunghic, cu dimensiunile bazei de $2$ m și $1{,}2$ m, iar înălțimea de $5$ m, este plin cu apă. Se golește toată apa într-un alt vas în formă de prismă hexagonală regulată $ABCDEFA\'B\'C\'D\'E\'F\'$ având latura bazei de $2$ m și înălțimea de $5\\sqrt{3}$ m.',
      parts: [
        { pts: 2, text: 'Calculați câți litri de apă erau în vasul paralelipipedic.', ans: '$12\\text{ m}^3=12\\,000$ l' },
        { pts: 3, text: 'În vasul în forma de prismă se introduce o prăjină de lungime $\\dfrac{7\\sqrt{3}}{3}$ m în poziția $AM$, $M\\in DD\'$. Ce porțiune din prăjină nu este acoperită de apă?', ans: 'apa urcă la $\\dfrac{2\\sqrt{3}}{3}$ m, iar $M$ e la $\\dfrac{\\sqrt{3}}{3}$ m: prăjina e în întregime sub apă' },
      ],
    },
  ],
}
