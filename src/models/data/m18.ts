// Testul 2 (Perianu și alții, Matematică pentru Evaluarea Națională, Art Klett, pages 205–211; the book's answers are
// not in the photos, so every answer here is computed)
import type { EnModel } from '../types'
import { foot, plane, type Pt } from '../figure'
import { pol } from './shapes'

const fig7 = plane({ A: [0, 0], M: [5, 0], B: [10, 0] }, 170, { s: 'A-M-B', dot: 'A M B', l: { A: 's', M: 's', B: 's' } })

// II.2: a ∥ b; s at 55°, t at 115°, so the angle at a is 125°, the angle between s and t 60°, and x = 65°
const X8: Pt = [4, 3]
const dir = (deg: number, k: number, from: Pt = X8): Pt => [from[0] + k * Math.cos((deg * Math.PI) / 180), from[1] + k * Math.sin((deg * Math.PI) / 180)]
const P8: Pt = [4 + 1 / Math.tan((55 * Math.PI) / 180), 4], T8: Pt = [4 + 1.5 / Math.tan((65 * Math.PI) / 180), 1.5]
const fig8 = plane(
  { a1: [0.6, 4], a2: [7.4, 4], b1: [0.6, 1.5], b2: [7.4, 1.5], s1: dir(55, -2.6), s2: dir(55, 2.2), t1: dir(115, 2.2), t2: dir(115, -2.6), P: P8, X: X8, T: T8 },
  170,
  {
    l: { a1: '', a2: '', b1: '', b2: '', s1: '', s2: '', t1: '', t2: '', P: '', X: '', T: '' },
    s: 'a1-a2 b1-b2 s1-s2 t1-t2', ang: ['a1Ps2', 's2Xt1', 'b1Tt1'],
    t: [
      { at: [0.7, 4.25], s: 'a', italic: true, size: 14 }, { at: [0.7, 1.75], s: 'b', italic: true, size: 14 },
      { at: [dir(55, 2.2)[0] + 0.3, dir(55, 2.2)[1] - 0.2], s: 's', italic: true, size: 14 }, { at: [dir(115, 2.2)[0] + 0.35, dir(115, 2.2)[1] - 0.2], s: 't', italic: true, size: 14 },
      { at: [P8[0] - 0.75, 4.25], s: '125°', size: 11 }, { at: [X8[0], X8[1] + 0.55], s: '60°', size: 11 }, { at: [T8[0] - 0.75, 1.75], s: 'x', italic: true, size: 13 },
    ],
  },
)

const A9: Pt = [5, 12], B9: Pt = [0, 0], C9: Pt = [10, 0], D9: Pt = [5, 0]
const fig9 = plane({ A: A9, B: B9, C: C9, D: D9, J: foot(D9, A9, B9), K: foot(D9, A9, C9) }, 140, { s: 'A-B-C-A A-D J-D-K', ra: ['ADC', 'DJA', 'DKA'], l: { D: 's' } })

// II.4: the garden, in metres
const fig10 = plane(
  { a: [0, 0], b: [12, 0], c: [12, 20], d: [0, 20], e: [37, 20], f: [37, 15], g: [12, 15], h: [27, 15], i: [27, 0] },
  190,
  {
    l: { a: '', b: '', c: '', d: '', e: '', f: '', g: '', h: '', i: '' },
    s: 'a-i-h-f-e-d-a b-c g-h',
    t: [
      { at: [6, 21], s: '12' }, { at: [24.5, 21], s: '25' }, { at: [13.2, 16.8], s: '5' }, { at: [-1.6, 9.3], s: '20' }, { at: [19.5, 0.8], s: '15' },
      { at: [6, 9.3], s: 'roșii' }, { at: [24.5, 16.8], s: 'varză' }, { at: [19.5, 7.3], s: 'ardei' },
    ],
  },
)

const fig11 = plane(
  { A: [-3, 0], B: [3, 0], O: [0, 0], N: pol(120, 3), P: pol(150, 3), Q: pol(60, 3) },
  140,
  { s: 'A-B O-N', d: 'O-P O-Q', dot: 'O P Q', c: [{ at: 'O', r: 3 }], l: { O: 's' } },
)

// III.4: AB = AC, ∡B = 72°, BM the bisector
const B16: Pt = [0, 0], C16: Pt = [1, 0], A16: Pt = [0.5, 0.5 * Math.tan((72 * Math.PI) / 180)]
const AB16 = Math.hypot(A16[0], A16[1])
const t16 = AB16 / (AB16 + 1)
const fig16 = plane({ A: A16, B: B16, C: C16, M: [A16[0] + (C16[0] - A16[0]) * t16, A16[1] + (C16[1] - A16[1]) * t16] }, 90, { s: 'A-B-C-A B-M' })

// III.5: the square ABCD and the right triangle CBM, MB = 6
const fig17 = plane({ A: [12, 0], B: [0, 0], C: [0, 12], D: [12, 12], M: [-6, 0] }, 160, { s: 'M-A-D-C-M B-C', ra: ['CBM'] })

export const M18: EnModel = {
  id: 'en-18',
  title: 'Perianu, Testul 2',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 205–211',
  items: [
    { text: 'Cel mai mic multiplu comun al numerelor $156$ și $84$ este:', choices: ['$312$', '$1092$', '$326$', '$546$'], ans: 1 },
    {
      text: 'În tabelul de mai jos sunt prezentate informații referitoare la numărul participanților la discipline opționale, astfel:\n\n| Opțional | Număr elevi |\n|---|---|\n| *Educație financiară* | 320 |\n| *Plăcerea lecturii* | 300 |\n| *Istoria matematicii* | 500 |\n| *Matematică aplicată* | 280 |\n\nOpționalele pentru care raportul dintre numărul participanților este pătratul unui număr sunt:',
      choices: ['*Educație financiară* și *Istoria matematicii*', '*Educație financiară* și *Plăcerea lecturii*', '*Istoria matematicii* și *Matematică aplicată*', '*Plăcerea lecturii* și *Matematică aplicată*'], ans: 0,
    },
    { text: 'În luna ianuarie, cea mai mică temperatură a aerului, măsurată la prânz, a fost de $-16\\,^\\circ$C, iar temperatura maximă a fost de $7\\,^\\circ$C. Diferența dintre temperatura maximă și cea minimă, măsurate în luna ianuarie, este de:', choices: ['$-9\\,^\\circ$C', '$-23\\,^\\circ$C', '$23\\,^\\circ$C', '$9\\,^\\circ$C'], ans: 2 },
    { text: 'Dintre numerele $1{,}(17)$; $\\dfrac{6}{5}$; $1{,}17$; $1{,}1(7)$, cel mai mare este:', choices: ['$1{,}(17)$', '$1{,}17$', '$\\dfrac{6}{5}$', '$1{,}1(7)$'], ans: 2 },
    {
      text: 'Patru copii așază în ordine crescătoare numerele $3\\sqrt{2}$, $2\\sqrt{6}$, $2\\sqrt{3}$ și $5$ și obțin:\n\n| | |\n|---|---|\n| Ana: | $3\\sqrt{2}<2\\sqrt{3}<2\\sqrt{6}<5$ |\n| Irina: | $3\\sqrt{2}<2\\sqrt{6}<2\\sqrt{3}<5$ |\n| Gabi: | $2\\sqrt{3}<2\\sqrt{6}<5<3\\sqrt{2}$ |\n| Ion: | $2\\sqrt{3}<3\\sqrt{2}<2\\sqrt{6}<5$ |\n\nDintre cei patru copii, cel care a așezat corect numerele în ordine crescătoare este:',
      choices: ['Ana', 'Irina', 'Gabi', 'Ion'], ans: 3,
    },
    { text: 'Un turist merge pe un traseu de la ora $13{:}40$ la ora $19{:}20$. Turistul afirmă că a mers $6$ ore. Afirmația este:', choices: ['falsă', 'adevărată'], ans: 0 },

    { text: 'În figura alăturată, punctul $M$ este mijlocul segmentului $AB$. Afirmația: „$A$ este simetricul lui $B$ față de $M$” este:', choices: ['adevărată', 'falsă'], ans: 0, fig: fig7 },
    { text: 'În figura alăturată, dreptele $a$ și $b$ sunt paralele, iar dreptele $s$ și $t$ sunt secante. Valoarea lui $x$ este egală cu:', choices: ['$65^\\circ$', '$60^\\circ$', '$55^\\circ$', '$45^\\circ$'], ans: 0, fig: fig8 },
    {
      text: 'În figura alăturată sunt reprezentate alei într-un parc. Se știe că $AD\\perp BC$, $D\\in(BC)$, iar distanțele de la $D$ la aleile $AB$ și $AC$ sunt egale. Dacă $BC=10$ m și $AB=13$ m, atunci suma lungimilor aleilor $AB+BC+CA$ este de:',
      choices: ['$33$ m', '$30$ m', '$36$ m', '$39$ m'], ans: 2, fig: fig9,
    },
    {
      text: 'O grădină de legume este reprezentată în figura alăturată (dimensiunile sunt exprimate în metri). Suprafața grădinii este de:',
      choices: ['$590\\text{ m}^2$', '$600\\text{ m}^2$', '$580\\text{ m}^2$', '$540\\text{ m}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ este diametru în cercul de centru $O$ și rază $R$ și $N\\in\\mathcal{C}(O,\\,R)$, $N\\neq A$, $N\\neq B$. Fie $OP$ bisectoarea unghiului $AON$ și $OQ$ bisectoarea unghiului $NOB$, $P\\in\\mathcal{C}(O,\\,R)$, $Q\\in\\mathcal{C}(O,\\,R)$. Unghiul $OQP$ are măsura de:',
      choices: ['$30^\\circ$', '$60^\\circ$', '$45^\\circ$', '$40^\\circ$'], ans: 2, fig: fig11,
    },
    { text: 'Un vas are forma unui tetraedru regulat $ABCD$ și este plin cu apă. Muchia tetraedrului este de $12$ cm. Afirmația „În tetraedru încap $0{,}3$ l de apă.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: '$8$ kg de mere și $4$ kg de caise costă $48$ de lei, iar $6$ kg de mere și $8$ kg de caise costă $76$ de lei.',
      parts: [
        { pts: 2, text: 'Cât costă $10$ kg de mere?', ans: '$1$ kg de mere costă $2$ lei, $1$ kg de caise $8$ lei; $10$ kg de mere costă $20$ de lei' },
        { pts: 3, text: 'Ajung $54$ de lei pentru a cumpăra $7$ kg de mere și $5$ kg de caise?', ans: 'Da: $7\\cdot2+5\\cdot8=54$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x^2-25}{x^2-1}-1\\right):\\left(\\dfrac{1}{x-1}-\\dfrac{1}{x+1}\\right)+3$, unde $x\\in\\mathbb{R}\\setminus\\{1,\\,-1\\}$.',
      parts: [
        { pts: 2, text: 'Descompune în factori expresia $x^2-25$.', ans: '$(x-5)(x+5)$' },
        { pts: 3, text: 'Arată că $E(x)\\in\\mathbb{Z}$, oricare ar fi $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: '$E(x)=\\dfrac{-24}{x^2-1}\\cdot\\dfrac{x^2-1}{2}+3=-9$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-3$.',
      parts: [
        { pts: 2, text: 'Reprezintă grafic funcția $f$ într-un sistem de axe ortogonale $xOy$.', ans: 'dreapta prin $A\\left(\\dfrac{3}{2},\\,0\\right)$ și $B(0,\\,-3)$' },
        { pts: 3, text: 'Calculează perimetrul triunghiului determinat de graficul funcției $f$ și axele $Ox$ și $Oy$.', ans: '$OA=\\dfrac{3}{2}$, $OB=3$, $AB=\\dfrac{3\\sqrt{5}}{2}$, $\\mathcal{P}=\\dfrac{9+3\\sqrt{5}}{2}$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul isoscel $ABC$ cu baza $BC$ și $\\sphericalangle ABC=72^\\circ$. Fie $BM$ bisectoarea unghiului $B$. Arată că:',
      parts: [
        { pts: 2, text: '$\\sphericalangle BAC\\equiv\\sphericalangle MBC$;', ans: '$\\sphericalangle BAC=180^\\circ-2\\cdot72^\\circ=36^\\circ=\\sphericalangle MBC$' },
        { pts: 3, text: '$BC^2=AC\\cdot CM$.', ans: '$\\triangle CBM\\sim\\triangle CAB$ (unghiurile $36^\\circ$, $72^\\circ$, $72^\\circ$), deci $\\dfrac{BC}{AC}=\\dfrac{CM}{BC}$' },
      ],
      fig: fig16,
    },
    {
      text: 'O terasă este formată din pătratul $ABCD$ și triunghiul dreptunghic $CBM$. Se știe că $AB=12$ m și $\\text{ctg}\\sphericalangle CMB=\\dfrac{1}{2}$.',
      parts: [
        { pts: 2, text: 'Arată că perimetrul terasei $AMCD$ este mai mic decât $56$ m.', ans: '$MB=6$ m, $MC=6\\sqrt{5}$ m, $\\mathcal{P}=42+6\\sqrt{5}<56\\Leftrightarrow 6\\sqrt{5}<14\\Leftrightarrow 180<196$' },
        { pts: 3, text: 'Fie $MN$ mediană în triunghiul $CBM$, $N\\in(BC)$. Arată că $NMBD$ este trapez.', ans: '$\\sphericalangle NMB=45^\\circ=\\sphericalangle DBA$ ($MB=BN=6$ m), deci $MN\\parallel BD$, iar $MB\\nparallel ND$' },
      ],
      fig: fig17,
    },
    {
      text: "O cameră are forma unui paralelipiped dreptunghic $ABCDA'B'C'D'$, cu $AB=6$ m, $AA'=3$ m și volumul de $90\\text{ m}^3$.",
      parts: [
        { pts: 2, text: 'Calculează lungimea segmentului $BC$.', ans: '$BC=\\dfrac{90}{6\\cdot3}=5$ m' },
        { pts: 3, text: 'Se vopsesc pereții și tavanul, aplicându-se $200$ g de vopsea pe $1\\text{ m}^2$. Ajung $20$ de cutii de vopsea de $1$ kg pentru vopsire?', ans: 'Da: $2(6+5)\\cdot3+6\\cdot5=96\\text{ m}^2$, deci $19{,}2$ kg de vopsea' },
      ],
    },
  ],
}
