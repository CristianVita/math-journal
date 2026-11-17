// Testul 6 (Perianu și alții, Matematică pentru Evaluarea Națională, Art Klett, pages 232–237; the book's answers are
// not in the photos, so every answer here is computed).
// În carte, Subiectul I al acestui test are doar 5 exerciții (pag. 232); utilizatorul a ales pe 18 noiembrie 2026 să rămână așa
// (`starts`: Subiectul II începe la al 6-lea exercițiu).
import type { EnModel } from '../types'
import { foot, plane, type Pt } from '../figure'
import { pol } from './shapes'

// II.1: ∡AOB = 46°, OD the bisector, OE opposite to OD
const fig7 = plane({ O: [0, 0], A: pol(58, 4), D: pol(35, 4.4), B: pol(12, 3.6), E: pol(215, 3) }, 160, { s: 'O-A O-D O-B O-E', l: { O: 's' } })

// II.2: d ∥ g cut by s; 6x at d (below s), 3x at g (above s), so x = 20°
const k8 = 1 / Math.tan((60 * Math.PI) / 180)
// redrawn on 18 November 2026 (the labels sat on the arcs and the lines): wider, the measures away from the arcs,
// on the bisector of their angle
const X8: Pt = [2, 2], Y8: Pt = [5.6, 2]
const at8 = (p: Pt, deg: number, r: number): Pt => [p[0] + r * Math.cos((deg * Math.PI) / 180), p[1] + r * Math.sin((deg * Math.PI) / 180)]
const fig8 = plane(
  { s1: [-0.3, 2], s2: [8.6, 2], d1: [X8[0] - 1.8 * k8, 0.2], d2: [X8[0] + 1.8 * k8, 3.8], g1: [Y8[0] - 1.8 * k8, 0.2], g2: [Y8[0] + 1.8 * k8, 3.8], X: X8, Y: Y8 },
  240,
  {
    l: { s1: '', s2: '', d1: '', d2: '', g1: '', g2: '', X: '', Y: '' },
    s: 's1-s2 d1-d2 g1-g2', ang: ['d1Xs2', 's2Yg2'],
    t: [
      { at: [8.5, 2.2], s: 's', italic: true, size: 14 },
      { at: [X8[0] + 1.8 * k8 + 0.3, 3.55], s: 'd', italic: true, size: 14 }, { at: [Y8[0] + 1.8 * k8 + 0.3, 3.55], s: 'g', italic: true, size: 14 },
      { at: at8(X8, 300, 1.05), s: '6x', size: 12, italic: true }, { at: at8(Y8, 30, 1.05), s: '3x', size: 12, italic: true },
    ],
  },
)

// II.3: ABC equilateral of side 8, L the midpoint of BC, LM ⊥ AB, N the reflection of L in M
const A9: Pt = [4, 4 * Math.sqrt(3)], B9: Pt = [0, 0], C9: Pt = [8, 0], L9: Pt = [4, 0]
const M9 = foot(L9, A9, B9)
const fig9 = plane({ A: A9, B: B9, C: C9, L: L9, M: M9, N: [2 * M9[0] - L9[0], 2 * M9[1] - L9[1]] }, 150, { s: 'A-B-C-A A-L N-L', ra: ['LMA'], l: { L: 's', M: 'nw' } })

const fig10 = plane({ A: [0, 0], B: [8, 0], C: [8, 2.5], D: [0, 2.5], M: [6, 2.5] }, 170, { s: 'A-B-C-D-A A-M' })

// II.5: the tangent MA, ∡AOM = 60°, r = 10, AM = 10√3
const fig11 = plane({ O: [0, 0], M: [-20, 0], A: pol(240, 10) }, 150, { s: 'M-O-A-M', ra: ['MAO'], dot: 'O', c: [{ at: 'O', r: 10 }], l: { O: 'e' } })

// III.4: AB = 18, BD = 6, CD = 3, DE ∥ AB
const B16: Pt = [0, 0], C16: Pt = [9, 0], A16: Pt = [7.5, Math.sqrt(18 * 18 - 7.5 * 7.5)]
const fig16 = plane({ A: A16, B: B16, C: C16, D: [6, 0], E: [C16[0] + (A16[0] - C16[0]) / 3, C16[1] + (A16[1] - C16[1]) / 3] }, 90, { s: 'A-B-C-A B-E D-E', l: { D: 's', E: 'e' } })

// III.5: the right trapezoid ABMN (AB ∥ MN vertical), NA = AB + MN, NK = AB
const fig17 = plane({ N: [0, 0], A: [8, 0], B: [8, 5], M: [0, 3], K: [5, 0] }, 150, { s: 'N-A-B-M-N', dot: 'K', l: { K: 's' } })

export const M22: EnModel = {
  id: 'en-22',
  title: 'Perianu, Testul 6',
  starts: [5, 11],
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 232–237',
  items: [
    { text: 'Scrierea numărului $10\\cdot63$ ca produs de puteri de numere prime este:', choices: ['$2\\cdot5\\cdot7\\cdot9$', '$2\\cdot5\\cdot3\\cdot21$', '$2\\cdot3^2\\cdot5\\cdot7$', '$2^2\\cdot3\\cdot5\\cdot7$'], ans: 2 },
    {
      text: 'La o stație meteo, temperatura înregistrată într-o zi, la ora $7{:}00$, a fost de $-5\\,^\\circ$C, iar la ora $12{:}00$ a fost de $4\\,^\\circ$C. Între cele două măsurători, temperatura a crescut cu:',
      choices: ['$4\\,^\\circ$C', '$9\\,^\\circ$C', '$-9\\,^\\circ$C', '$5\\,^\\circ$C'], ans: 1,
    },
    { text: 'Raportul numerelor $\\dfrac{21}{22}$ și $\\dfrac{35}{44}$ este:', choices: ['$\\dfrac{21}{44}$', '$\\dfrac{6}{5}$', '$\\dfrac{35}{22}$', '$\\dfrac{735}{968}$'], ans: 1 },
    {
      text: 'Radu calculează diferența dintre $13\\sqrt{3}$ și dublul lui $8\\sqrt{3}-3\\sqrt{5}$, apoi împarte rezultatul la $3$. Trebuie să obțină:',
      choices: ['$\\sqrt{3}-2\\sqrt{5}$', '$2\\sqrt{5}-\\sqrt{3}$', '$2\\sqrt{3}-\\sqrt{5}$', '$2\\sqrt{5}+\\sqrt{3}$'], ans: 1,
    },
    { text: 'Un obiect se scumpește cu $10\\%$. Dacă înainte de scumpire obiectul a costat $500$ de lei, după scumpire el va costa:', choices: ['$510$ lei', '$520$ lei', '$550$ lei', '$600$ lei'], ans: 2 },

    {
      text: 'În figura alăturată, $OD$ este bisectoarea unghiului $AOB$ și $OE$ este semidreapta opusă ei. Se știe că $\\widehat{AOB}=46^\\circ$. Măsura unghiului $BOE$ este:',
      choices: ['$120^\\circ$', '$160^\\circ$', '$134^\\circ$', '$157^\\circ$'], ans: 3, fig: fig7,
    },
    { text: 'În figura alăturată, dreptele $d$ și $g$ sunt tăiate de secanta $s$. Valoarea lui $x$ pentru care dreptele $d$ și $g$ sunt paralele este de:', choices: ['$30^\\circ$', '$20^\\circ$', '$10^\\circ$', '$50^\\circ$'], ans: 1, fig: fig8 },
    {
      text: 'Într-o livadă, reprezentată în figura alăturată, sunt plantați copaci în punctele $A$, $B$, $C$, $L$, $M$, $N$, luate astfel încât triunghiul $ABC$ să fie echilateral. Se știe că: $L$ este mijlocul laturii $BC$, $LM\\perp AB$, $M\\in AB$, $N$ este simetricul lui $L$ față de $M$, $AL=4\\sqrt{3}$ m. Distanța dintre copacii din punctele $N$ și $L$ este egală cu:',
      choices: ['$8$ m', '$4\\sqrt{2}$ m', '$4\\sqrt{3}$ m', '$8\\sqrt{3}$ m'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ reprezintă peretele unei camere în formă de dreptunghi, cu $AB=8$ m și perimetrul de $21$ m. Fie $M$ un punct situat pe $CD$ astfel ca $DM=\\dfrac{3}{4}\\cdot CD$. Suprafața $ABCM$ este vopsită în galben. Aria suprafeței vopsite galben este de:',
      choices: ['$12{,}5\\text{ m}^2$', '$20\\text{ m}^2$', '$15\\text{ m}^2$', '$10\\text{ m}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $M$ este un punct exterior cercului $\\mathcal{C}(O,\\,r)$ și $MA$, o tangentă la cerc în $A$. Dacă $AM=10\\sqrt{3}$ cm și $\\widehat{AOM}=60^\\circ$, atunci raza $r$ a cercului este egală cu:',
      choices: ['$10\\sqrt{3}$ cm', '$10\\sqrt{2}$ cm', '$5\\sqrt{3}$ cm', '$10$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'O magazie are forma unei prisme patrulatere regulate cu latura bazei de $60$ m și înălțimea de $5$ m. În ea se depozitează cutii în formă de cub cu lungimea muchiei de $1{,}5$ m. Numărul maxim de cutii care se pot depozita este:',
      choices: ['$300$', '$480$', '$3600$', '$4800$'], ans: 3,
    },

    {
      text: 'Într-o excursie merg fete și băieți. Dintre acești copii, $40\\%$ sunt fete. Dacă ar mai veni $9$ băieți și ar pleca $2$ fete, atunci numărul fetelor ar fi jumătate din numărul băieților.',
      parts: [
        { pts: 2, text: 'Câți băieți și câte fete merg în excursie?', ans: '$2(0{,}4n-2)=0{,}6n+9$, $n=65$: $26$ de fete și $39$ de băieți' },
        { pts: 3, text: 'Profesorii vor să formeze grupuri mai mici care au același număr de elevi astfel încât toate grupurile să aibă același număr de fete și același număr de băieți. Care este numărul maxim de astfel de grupuri?', ans: '$(26,\\,39)=13$ grupuri' },
      ],
    },
    {
      text: 'Fie expresia $E(x)=\\left[\\dfrac{4}{x+3}+\\dfrac{x}{x+2}+\\dfrac{x+8}{(x+2)(x+3)}\\right]:\\dfrac{x+4}{x^2+5x+6}\\cdot\\dfrac{x+5}{x+3}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{(x+4)(x+5)}{x+3}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,-3,\\,-4\\}$.', ans: 'paranteza este $\\dfrac{x^2+8x+16}{(x+2)(x+3)}=\\dfrac{(x+4)^2}{(x+2)(x+3)}$, iar împărțirea dă $x+4$' },
        { pts: 3, text: 'În mulțimea $\\mathbb{R}\\setminus\\{-2,\\,-3,\\,-4\\}$, rezolvă ecuația: $E(x)=x-1$.', ans: '$(x+4)(x+5)=(x-1)(x+3)$, $7x=-23$, $x=-\\dfrac{23}{7}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-3x+4$.',
      parts: [
        { pts: 2, text: 'Determină numărul întreg $a$ astfel încât punctul $P(2a,\\,16)$ să aparțină graficului funcției $f$.', ans: '$-6a+4=16$, $a=-2$' },
        { pts: 3, text: 'Determină punctele de pe graficul funcției $f$ care au modulul abscisei egal cu triplul modulului ordonatei.', ans: '$|x|=3|-3x+4|$: $\\left(\\dfrac{6}{5},\\,\\dfrac{2}{5}\\right)$ și $\\left(\\dfrac{3}{2},\\,-\\dfrac{1}{2}\\right)$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, cu $AB=18$ cm. Se știe că $D\\in BC$ astfel încât $CD=\\dfrac{BD}{2}$, $DE\\parallel AB$, $E\\in AC$, și că $BE$ este bisectoarea unghiului $ABC$.',
      parts: [
        { pts: 2, text: 'Arată că $BD=DE$.', ans: '$\\sphericalangle DEB=\\sphericalangle EBA=\\sphericalangle EBD$, deci $\\triangle BDE$ e isoscel' },
        { pts: 3, text: 'Calculează lungimea segmentului $BC$.', ans: '$\\dfrac{DE}{AB}=\\dfrac{CD}{CB}=\\dfrac{1}{3}$, $DE=6$ cm $=BD$, deci $BC=9$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABMN$ este un trapez dreptunghic cu $AB\\parallel MN$, $\\hat{N}=\\hat{A}=90^\\circ$ și înălțimea egală cu suma bazelor sale. Fie $K\\in AN$ astfel ca $NK=AB$.',
      parts: [
        { pts: 2, text: 'Arată că $\\triangle ABK\\equiv\\triangle NKM$.', ans: '$AK=AN-NK=MN$, $AB=NK$, $\\hat{A}=\\hat{N}=90^\\circ$ (C.C.)' },
        { pts: 3, text: 'Demonstrează că $\\triangle MKB$ este dreptunghic în $K$.', ans: '$\\sphericalangle NKM+\\sphericalangle AKB=\\sphericalangle NKM+\\sphericalangle NMK=90^\\circ$, deci $\\sphericalangle MKB=90^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: 'Un scaun are forma unui trunchi de con circular drept din lemn, cu înălțimea de $45$ cm și diametrul bazei mici de $32$ cm. Media aritmetică a razelor trunchiului de con este de $18$ cm.',
      parts: [
        { pts: 2, text: 'Determină volumul unui astfel de trunchi de con.', ans: '$r=16$ cm, $R=20$ cm, $V=\\dfrac{45\\pi}{3}(400+320+256)=14640\\pi\\text{ cm}^3$' },
        { pts: 3, text: 'Se vopsește suprafața scaunului (dar nu și baza mare). Ce cantitate de vopsea se folosește, știind că pentru un metru pătrat este nevoie de $0{,}4$ kg de vopsea? (Se consideră $\\pi\\simeq3{,}14$.)', ans: '$G=\\sqrt{2041}$ cm, $\\mathcal{A}=\\pi\\left(36\\sqrt{2041}+256\\right)\\approx5911\\text{ cm}^2\\approx0{,}591\\text{ m}^2$, deci aproximativ $0{,}236$ kg' },
      ],
    },
  ],
}
