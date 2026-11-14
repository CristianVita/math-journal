// Model E.N. 5 (the book's pages 117–118)
import type { EnModel } from '../types'
import { along, foot, type Pt } from '../figure'

const A9: Pt = [60, 10], B9: Pt = [25, 118], C9: Pt = [95, 118]
const D9 = along(A9, C9, 0.618)

const A17: Pt = [35, 15], B17: Pt = [95, 15], C17: Pt = [105, 84.3], D17: Pt = [25, 84.3]
const I17: Pt = [65, 49.6]

const A18: Pt = [15, 150], B18: Pt = [115, 175], C18: Pt = [190, 145]
const top = (p: Pt): Pt => [106.7 + 0.45 * (p[0] - 106.7), 36.7 + 0.45 * (p[1] - 156.7)]

export const M5: EnModel = {
  id: 'en-5',
  title: 'Model E.N. 5',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 117–118',
  items: [
    { text: 'Numărul $a=(3{,}6+1{,}4):5$ este egal cu:', choices: ['$0{,}8$', '$1$', '$8$', '$0{,}1$'], ans: 1 },
    { text: 'Pentru orice număr real $x\\ne 0$, numărul $\\dfrac{3}{2}x\\cdot x^3-\\dfrac{5}{2}x^7:x^3$ este egal cu:', choices: ['$-2x^4$', '$x^4$', '$-4x^4$', '$-x^4$'], ans: 3 },
    {
      text: 'Fie funcția $f$ al cărei grafic este reprezentat de punctele $A$, $B$, $C$, $D$ din sistemul de coordonate desenat în figura alăturată. Mulțimea valorilor funcției este:',
      choices: ['$\\{-3;1;2;4\\}$', '$\\{-3;0;1;2;4\\}$', '$\\{-2;0;2;3\\}$', '$\\{-3;0;3\\}$'], ans: 2,
      fig: {
        w: 145, h: 118,
        p: { A: [24, 36], B: [72, 60], C: [96, 84], D: [108, 24], Y3: [60, 24], Ym: [60, 84], Y2: [60, 36], Xa: [24, 60], Xc: [96, 60], Xd: [108, 60] },
        l: { A: 'n', B: 'n', C: 'se', D: 'ne', Y3: '', Ym: '', Y2: '', Xa: '', Xc: '', Xd: '' },
        axes: { o: [60, 60], x: [10, 138], y: [112, 6], xl: 'x', yl: 'y' },
        d: 'Y3-D-Xd Xa-A-Y2 Ym-C-Xc', dot: 'A B C D',
        t: [{ at: [55, 28], s: '3', anchor: 'end' }, { at: [55, 100], s: '−3', anchor: 'end' }, { at: [24, 74], s: '−3' }, { at: [112, 74], s: '4' }, { at: [54, 73], s: 'O', anchor: 'end', italic: true }],
      },
    },
    { text: 'Media geometrică a numerelor $a=\\dfrac{10}{\\sqrt{5}}+1$ și $b=4\\sqrt{15}:\\sqrt{12}-1$ este:', choices: ['$\\sqrt{21}$', '$\\sqrt{19}$', '$2\\sqrt{5}-1$', '$2\\sqrt{5}+1$'], ans: 1 },
    { text: 'Ordinea crescătoare a numerelor $x=2\\sqrt{3}$, $y=3\\sqrt{2}$ și $z=4$ este:', choices: ['$x;y;z$', '$y;z;x$', '$x;z;y$', '$z;x;y$'], ans: 2 },
    {
      text: 'O gărgăriță se deplasează conform graficului din figură. Propoziția „Perioada de timp în care aceasta s-a deplasat este egală cu $120$ de secunde.” este:',
      choices: ['adevărată', 'falsă'], ans: 1,
      fig: {
        w: 175, h: 125,
        p: { O: [30, 95], P: [52, 77], Q: [74, 77], R: [112.5, 23], S: [129, 23], Y4: [30, 23], Y1: [30, 77], Rx: [112.5, 95], Sx: [129, 95] },
        l: { O: '', P: '', Q: '', R: '', S: '', Y4: '', Y1: '', Rx: '', Sx: '' },
        axes: { o: [30, 95], x: [30, 165], y: [95, 6] },
        s: 'O-P-Q-R-S', d: 'Y4-R Y1-P R-Rx S-Sx',
        t: [
          { at: [36, 12], s: 'distanța [cm]', anchor: 'start' }, { at: [170, 120], s: 'timp [min]', anchor: 'end' },
          { at: [25, 27], s: '40', anchor: 'end' }, { at: [25, 45], s: '30', anchor: 'end' }, { at: [25, 63], s: '20', anchor: 'end' }, { at: [25, 81], s: '10', anchor: 'end' },
          { at: [27, 108], s: '0', anchor: 'end' }, { at: [52, 108], s: '1' }, { at: [74, 108], s: '2' }, { at: [96, 108], s: '3' }, { at: [118, 108], s: '4' }, { at: [140, 108], s: '5' },
        ],
      },
    },

    {
      text: 'În desenul alăturat $AB=3$ cm, $BC=2$ cm și $AD=7$ cm. Simetricul lui $D$ față de $C$ este:',
      choices: ['$A$', '$B$', '$C$', '$D$'], ans: 1,
      fig: { w: 170, h: 34, p: { A: [15, 24], B: [75, 24], C: [115, 24], D: [155, 24] }, l: { A: 'n', B: 'n', C: 'n', D: 'n' }, s: 'A-D', dot: 'A B C D' },
    },
    {
      text: 'În desenul alăturat se știe că $a\\parallel b$. Atunci $\\sphericalangle ABC$ și $\\sphericalangle BFG$ sunt:',
      choices: ['congruente', 'suplementare', 'complementare', 'corespondente'], ans: 1,
      fig: {
        w: 180, h: 125,
        p: { A: [140, 10], B: [120.6, 40], C: [45, 40], F: [94.6, 80], G: [150, 80], E: [70, 118], a1: [10, 40], a2: [168, 40], b1: [10, 80], b2: [172, 80] },
        l: { A: 'e', B: 'nw', C: 'n', F: 'se', G: 's', E: 'w', a1: '', a2: '', b1: '', b2: '' },
        s: 'a1-a2 b1-b2 E-A', dot: 'C G',
        t: [{ at: [16, 33], s: 'a', italic: true, size: 14 }, { at: [16, 73], s: 'b', italic: true, size: 14 }],
      },
    },
    {
      text: 'În triunghiul $ABC$ se știe că $\\sphericalangle A=36^\\circ$, $\\sphericalangle C=72^\\circ$, $BD$ este bisectoarea $\\sphericalangle ABC$ și $DM\\perp AB$, $D\\in AC$, $M\\in AB$. Atunci $AM$ este congruentă cu:',
      choices: ['$BD$', '$MD$', '$CD$', '$MB$'], ans: 3,
      fig: { w: 115, h: 132, p: { A: A9, B: B9, C: C9, D: D9, M: foot(D9, A9, B9) }, l: { D: 'e', M: 'w' }, s: 'A-B-C-A', d: 'B-D M-D', ra: ['AMD'] },
    },
    {
      text: 'Un teren în formă de romb este plantat cu flori. Partea hașurată este acoperită cu zambile, iar cea nehașurată cu lalele. Măsura unghiului ascuțit este de $30^\\circ$ și aria suprafeței plantate cu zambile este de $48\\text{ m}^2$. Latura rombului este egală cu:',
      choices: ['$8\\sqrt{3}$ m', '$8$ m', '$4\\sqrt{3}$ m', '$4$ m'], ans: 0,
      fig: { w: 130, h: 125, p: { A: [65, 12], B: [12, 62], C: [65, 112], D: [118, 62], O: [65, 62] }, l: { O: 'nw' }, s: 'A-B-C-D-A', d: 'A-C B-D', hatch: ['A-O-D', 'B-O-C'] },
    },
    { text: 'Un triunghi dreptunghic având catetele de $12$ cm, respectiv $16$ cm are distanța de la ortocentru la centrul cercului circumscris egală cu:', choices: ['$6$ cm', '$8$ cm', '$10$ cm', '$9{,}6$ cm'], ans: 2 },
    { text: 'Volumul unui cub având diagonala egală cu $2\\sqrt{6}$ este egal cu:', choices: ['$16\\sqrt{2}\\text{ cm}^3$', '$24\\sqrt{3}\\text{ cm}^3$', '$8\\text{ cm}^3$', '$48\\sqrt{6}\\text{ cm}^3$'], ans: 0 },

    {
      text: 'Vreau să împart un număr de nuci unui grup de copii. Dacă unui copil îi dau trei nuci, celorlalți le revin câte $7$ nuci. Dacă fiecărui copil îi dau câte $6$ nuci, îmi rămân $12$ nuci.',
      parts: [
        { pts: 2, text: 'Câți copii sunt în grup?', ans: '$16$ copii' },
        { pts: 3, text: 'Câte nuci vreau să împart?', ans: '$108$ nuci' },
      ],
    },
    {
      text: 'Fie expresia $E(x)=\\dfrac{(x-2)^2-x+2}{x^2+4x-12}$, $x\\in\\mathbb{R}\\setminus\\{2;-6\\}$.',
      parts: [
        { pts: 2, text: 'Arătați că $E(x)=\\dfrac{x-3}{x+6}$.', ans: '$E(x)=\\dfrac{(x-2)(x-3)}{(x-2)(x+6)}=\\dfrac{x-3}{x+6}$' },
        { pts: 3, text: 'Aflați $x\\in\\mathbb{Z}$ astfel încât $E(x)\\in\\mathbb{N}$.', ans: '$x\\in\\{-15;-9;-7;3\\}$' },
      ],
    },
    {
      text: '',
      parts: [
        { pts: 2, text: 'Să se determine funcția liniară a cărei reprezentare grafică trece prin punctele $A(0;3)$ și $B(4;5)$.', ans: '$f(x)=\\dfrac{x}{2}+3$' },
        { pts: 3, text: 'Aflați aria triunghiului $ABC$, unde $C(1;1)$.', ans: '$5$' },
      ],
    },
    {
      text: 'O bucată de tablă are forma unui trapez dreptunghic $ABCD$, $\\sphericalangle A=90^\\circ$, $AB\\parallel CD$. Dacă $AB=24$ dm, $CD=16$ dm și tangenta unghiului ascuțit este egală cu $0{,}75$, aflați:',
      parts: [
        { pts: 2, text: 'aria bucății de tablă;', ans: '$120\\text{ dm}^2$' },
        { pts: 3, text: 'distanța de la vârful $A$ la dreapta $BC$.', ans: '$14{,}4$ dm' },
      ],
      fig: { w: 170, h: 75, p: { A: [12, 62], B: [156, 62], C: [108, 26], D: [12, 26] }, s: 'A-B-C-D-A', ra: ['DAB', 'ADC'] },
    },
    {
      text: '$ABCD$ este un trapez isoscel cu $AB\\parallel CD$ și $AB<CD$, în care este înscris un cerc tangent la toate laturile trapezului. Se știe că $AB=12$ cm, raza cercului este de $4\\sqrt{3}$ cm, iar $M\\in AB$, $N\\in BC$, $P\\in CD$ și $R\\in AD$ sunt punctele de tangență.',
      parts: [
        { pts: 2, text: 'Aflați lungimea segmentului $AR$.', ans: '$AR=AM=6$ cm' },
        { pts: 3, text: 'Calculați aria trapezului.', ans: '$CD=16$ cm, aria este $112\\sqrt{3}\\text{ cm}^2$' },
      ],
      fig: {
        w: 130, h: 100,
        p: { A: A17, M: [65, 15], B: B17, N: foot(I17, B17, C17), C: C17, P: [65, 84.3], D: D17, R: foot(I17, A17, D17) },
        l: { M: 'n', P: 's', N: 'e', R: 'w' },
        s: 'A-B-C-D-A', c: [{ at: I17, r: 34.6 }],
      },
    },
    {
      text: 'Un monument din granit are forma unui trunchi de piramidă triunghiulară regulată cu $l=4\\sqrt{3}$ m, $L=12\\sqrt{3}$ m și $h=6$ m.',
      parts: [
        { pts: 2, text: 'Știind că muchiile laterale și ale bazei mici sunt întărite cu profil metalic, aflați dacă ajung $50$ m de profil.', ans: 'Nu: muchia laterală are $10$ m, trebuie $30+12\\sqrt{3}\\approx 50{,}8$ m' },
        { pts: 3, text: 'Calculați sinusul unghiului dintre două muchii laterale.', ans: '$\\dfrac{4\\sqrt{39}}{25}$' },
      ],
      fig: {
        w: 205, h: 190,
        p: { A: A18, B: B18, C: C18, "A'": top(A18), "B'": top(B18), "C'": top(C18) },
        l: { "B'": 's' },
        s: "A-B-C-C'-B'-A'-A B-B' A'-C'", d: 'A-C',
      },
    },
  ],
}
