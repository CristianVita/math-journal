// Model E.N. 6 (the book's pages 119–120)
import type { EnModel } from '../types'
import { meet, mid, onCircle, type Pt } from '../figure'

/** The centre and the radius of the circle inscribed in ABC. */
function incircle(A: Pt, B: Pt, C: Pt): [Pt, number] {
  const a = Math.hypot(B[0] - C[0], B[1] - C[1]), b = Math.hypot(C[0] - A[0], C[1] - A[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1])
  const s = a + b + c
  const I: Pt = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s]
  const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2
  return [I, (2 * area) / s]
}

const A9: Pt = [12, 98], B9: Pt = [75, 12], C9: Pt = [135, 98]
const [I9, r9] = incircle(A9, B9, C9)

const O10: Pt = [65, 62]
const A10 = onCircle(O10, 50, 90), B10 = onCircle(O10, 50, 210), C10 = onCircle(O10, 50, 330)

const A17: Pt = [54.4, 72], B17: Pt = [114.4, 72], E17: Pt = [156.9, 114.4], F17: Pt = [12, 114.4]

export const M6: EnModel = {
  id: 'en-6',
  title: 'Model E.N. 6',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 119–120',
  items: [
    { text: 'Ecuația $2x-3=7$, cu $x\\in\\mathbb{N}$, are soluția $x$:', choices: ['$2$', '$5$', '$-5$', '$-2$'], ans: 1 },
    { text: 'Cel mai mare element al mulțimii $\\{2\\sqrt{3};\\sqrt{40};5\\sqrt{2};7\\}$ este:', choices: ['$2\\sqrt{3}$', '$\\sqrt{40}$', '$5\\sqrt{2}$', '$7$'], ans: 2 },
    {
      text: 'În figura alăturată sunt prezentate temperaturile care au fost măsurate în $15$ zile. Temperatura medie din această perioadă este:',
      choices: ['$12^\\circ$C', '$12{,}5^\\circ$C', '$12{,}6^\\circ$C', '$13^\\circ$C'], ans: 2,
      fig: {
        w: 185, h: 128,
        p: {
          P: [50, 84], Q: [75, 68], R: [100, 52], S: [125, 20], T: [150, 36],
          P1: [30, 84], Q1: [30, 68], R1: [30, 52], S1: [30, 20], T1: [30, 36], P0: [50, 100], Q0: [75, 100], R0: [100, 100], S0: [125, 100], T0: [150, 100],
        },
        l: { P: '', Q: '', R: '', S: '', T: '', P1: '', Q1: '', R1: '', S1: '', T1: '', P0: '', Q0: '', R0: '', S0: '', T0: '' },
        axes: { o: [30, 100], x: [30, 178], y: [100, 6] },
        d: 'P1-P-P0 Q1-Q-Q0 R1-R-R0 S1-S-S0 T1-T-T0', dot: 'P Q R S T',
        t: [
          { at: [36, 12], s: 'nr. de zile', anchor: 'start' }, { at: [180, 124], s: 'temperatura', anchor: 'end' },
          { at: [25, 88], s: '1', anchor: 'end' }, { at: [25, 72], s: '2', anchor: 'end' }, { at: [25, 56], s: '3', anchor: 'end' }, { at: [25, 40], s: '4', anchor: 'end' }, { at: [25, 24], s: '5', anchor: 'end' },
          { at: [50, 113], s: '10°' }, { at: [75, 113], s: '11°' }, { at: [100, 113], s: '12°' }, { at: [125, 113], s: '13°' }, { at: [150, 113], s: '14°' },
        ],
      },
    },
    { text: 'Dacă temperatura într-o dimineață era de $-4^\\circ$C și la prânz era de $1^\\circ$C, atunci temperatura a crescut cu:', choices: ['$3^\\circ$C', '$-3^\\circ$C', '$5^\\circ$C', '$-5^\\circ$C'], ans: 2 },
    { text: 'Numerele $12$, $18$, $36$ și $24$ sunt direct proporționale cu:', choices: ['$\\{12;8;4;6\\}$', '$\\{2;3;6;4\\}$', '$\\{4;6;9;8\\}$', '$\\{2;3;4;6\\}$'], ans: 1 },
    { text: 'Propoziția „Numărul $2\\cdot 10^8+1$ este număr prim.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    { text: 'Dacă $\\sphericalangle ABC$ este unghi nul, care din următoarele afirmații este adevărată?', choices: ['$A$, $B$, $C$ sunt coliniare', '$\\sphericalangle BAC=90^\\circ$', '$\\sphericalangle ABC=180^\\circ$', '$\\sphericalangle ABC=90^\\circ$'], ans: 0 },
    { text: 'Complementul suplementului $\\sphericalangle X$ are $40^\\circ$. Atunci măsura $\\sphericalangle X$ este de:', choices: ['$49^\\circ$', '$50^\\circ$', '$130^\\circ$', '$140^\\circ$'], ans: 2 },
    {
      text: 'În $\\triangle ABC$ cu $\\sphericalangle A=40^\\circ$ și $I$ centrul cercului înscris în triunghi, măsura $\\sphericalangle BIC$ este de:',
      choices: ['$140^\\circ$', '$110^\\circ$', '$130^\\circ$', '$120^\\circ$'], ans: 1,
      fig: { w: 148, h: 110, p: { A: A9, B: B9, C: C9, I: I9 }, l: { I: 'e' }, s: 'A-B-C-A', c: [{ at: I9, r: r9 }], dot: 'I' },
    },
    {
      text: 'Triunghiul echilateral care are raza cercului circumscris lui egală cu $2\\sqrt{3}$ cm are perimetrul egal cu:',
      choices: ['$18$ cm', '$6\\sqrt{3}$ cm', '$12\\sqrt{3}$ cm', '$12$ cm'], ans: 0,
      fig: { w: 130, h: 125, p: { A: A10, B: B10, C: C10, O: O10, H: mid(B10, C10) }, l: { O: 'e', H: '' }, s: 'A-B-C-A', d: 'A-H', c: [{ at: O10, r: 50 }], dot: 'O' },
    },
    { text: 'Hexagonul regulat cu apotema de $9$ cm are latura egală cu:', choices: ['$9$ cm', '$6$ cm', '$6\\sqrt{3}$ cm', '$9\\sqrt{3}$ cm'], ans: 2 },
    { text: 'Volumul unei prisme patrulatere regulate care are înălțimea de $5$ cm și aria laterală de $200\\text{ cm}^2$ este egal cu:', choices: ['$250\\text{ cm}^3$', '$500\\text{ cm}^3$', '$750\\text{ cm}^3$', '$1000\\text{ cm}^3$'], ans: 1 },

    {
      text: 'Pentru o serbare s-au cumpărat $480$ de portocale, $720$ de bomboane și $600$ de napolitane, urmând a fi împărțite integral în pachete identice.',
      parts: [
        { pts: 2, text: 'Se pot face $80$ de pachete?', ans: 'Nu ($600$ nu se împarte exact la $80$)' },
        { pts: 3, text: 'Care este numărul maxim de pachete ce se poate obține?', ans: '$(480;720;600)=120$ de pachete' },
      ],
    },
    {
      text: 'Fie $E(x)=\\left(\\dfrac{2x^2+3}{x^2+6x+9}-\\dfrac{2x}{x+3}\\right)\\cdot\\left(\\dfrac{2}{2x-1}+\\dfrac{10}{4x^2-1}\\right)$, $x\\in\\mathbb{R}\\setminus\\left\\{-3;-\\dfrac{1}{2};\\dfrac{1}{2}\\right\\}$.',
      parts: [
        { pts: 2, text: 'Să se aducă expresia la forma cea mai simplă.', ans: '$E(x)=\\dfrac{-12}{(x+3)(2x+1)}$' },
        { pts: 3, text: 'Să se rezolve ecuația $E(x)=\\dfrac{4}{2x+1}$.', ans: '$x=-6$' },
      ],
    },
    {
      text: 'Graficul funcției $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-2x+4$ intersectează axa $Ox$ în punctul $A$.',
      parts: [
        { pts: 2, text: 'Aflați coordonatele punctului $A$.', ans: '$A(2;0)$' },
        { pts: 3, text: 'Aflați distanța de la originea sistemului de axe ortogonale la graficul funcției.', ans: '$\\dfrac{4\\sqrt{5}}{5}$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentată o grădină formată din două dreptunghiuri și un semicerc. $AB=BG=30$ m, $EC=20$ m, $AD=x$ (m), $x>0$.',
      parts: [
        { pts: 2, text: 'Verificați dacă lungimea gardului care împrejmuiește grădina este mai mare decât $130$ m ($\\pi=3{,}14$).', ans: 'gardul are $131{,}4$ m $>130$ m, oricare ar fi $x$' },
        { pts: 3, text: 'Determinați valoarea lui $x$, știind că dreptunghiurile sunt echivalente.', ans: '$30x=20(30-x)$, $x=12$ m' },
      ],
      fig: {
        w: 125, h: 150,
        p: { A: [12, 12], B: [108, 12], D: [12, 50], E: [44, 50], C: [108, 50], F: [44, 108], G: [108, 108] },
        l: { D: 'w', E: 'n', C: 'e', F: 'w', G: 'e' },
        s: 'A-B-G F-E-D-A D-C F-G', path: [{ d: 'M44 108 A32 32 0 0 0 108 108' }],
      },
    },
    {
      text: 'În figura alăturată pătratul $ABCD$ are latura de $10$ cm și $ABEF$ este un trapez isoscel. $AC\\cap DB=\\{O\\}$, $AE\\cap FB=\\{Q\\}$ și $M$ este mijlocul lui $AB$.',
      parts: [
        { pts: 2, text: 'Arătați că punctele $O$, $M$ și $Q$ sunt coliniare.', ans: 'se arată că $OM\\perp AB$ și $MQ\\perp AB$' },
        { pts: 3, text: 'Dacă punctele $D$, $B$ și $E$ sunt coliniare și $BE=10$ cm, calculați aria trapezului $ABEF$.', ans: '$50(1+\\sqrt{2})\\text{ cm}^2$' },
      ],
      fig: {
        w: 172, h: 128,
        p: { D: [54.4, 12], C: [114.4, 12], A: A17, B: B17, E: E17, F: F17, O: [84.4, 42], M: [84.4, 72], Q: meet(A17, E17, F17, B17) },
        l: { A: 'w', B: 'e', O: 'n', M: 'n', Q: 's' },
        s: 'A-B-C-D-A A-C B-D F-E A-F B-E A-E F-B', dot: 'M',
      },
    },
    {
      text: 'Un vas are formă de prismă triunghiulară regulată $ABCA\'B\'C\'$. Se știe că latura bazei este de $8$ cm, iar înălțimea vasului este de $12\\sqrt{3}$ cm.',
      parts: [
        { pts: 2, text: 'Câți litri de apă încap în vas?', ans: '$576\\text{ cm}^3=0{,}576$ l' },
        { pts: 3, text: 'Dacă $M$ este mijlocul lui $BC$, aflați $\\sphericalangle(AM;C\'M)$.', ans: '$AM\\perp(BCC\')$, deci $90^\\circ$' },
      ],
      fig: {
        w: 175, h: 185,
        p: { A: [15, 150], B: [80, 172], C: [160, 140], "A'": [15, 40], "B'": [80, 62], "C'": [160, 30] },
        l: { "B'": 's' },
        s: "A-B-C-C'-B'-A'-A B-B' A'-C'", d: 'A-C',
      },
    },
  ],
}
