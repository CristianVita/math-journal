// Model E.N. 3 - simulare (the book's pages 114–115)
import type { EnModel } from '../types'
import { along, meet, mid, onCircle, type Pt } from '../figure'

const A10: Pt = [70, 12], B10: Pt = [15, 115], C10: Pt = [155, 115]

const A11: Pt = [40, 12], B11: Pt = [200, 12], C11: Pt = [172, 62], D11: Pt = [12, 62]

const hex = (k: number): Pt => [80 + 65 * Math.cos(((210 + 60 * k) * Math.PI) / 180), 130 - 22 * Math.sin(((210 + 60 * k) * Math.PI) / 180)]

const B18: Pt = [85, 10], C18: Pt = [95, 150]

const O9: Pt = [15, 95]

export const M3: EnModel = {
  id: 'en-3',
  title: 'Model E.N. 3 - simulare',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 114–115',
  items: [
    { text: 'Numărul natural $x$ care verifică relația $\\sqrt{x}\\in(5;3\\sqrt{3})$ este:', choices: ['$5$', '$25$', '$5{,}1$', '$26$'], ans: 3 },
    { text: 'Scrisă sub formă de interval, mulțimea $\\{x\\in\\mathbb{R}\\mid 5x\\le x\\}$ este:', choices: ['$(-\\infty;5]$', '$(-\\infty;0]$', '$(-\\infty;4)$', '$(-\\infty;0)$'], ans: 1 },
    { text: 'Media aritmetică a numerelor $\\sqrt{27}-5$ și $5+3\\sqrt{3}$ este:', choices: ['$2$', '$\\sqrt{2}$', '$2\\sqrt{13}$', '$3\\sqrt{3}$'], ans: 3 },
    { text: 'Dacă $x\\in\\mathbb{R}^*$, rezultatul calculului $[18x^2:(2x)-x]:(x+x\\sqrt{9})$ este:', choices: ['$2$', '$2x$', '$x$', '$3$'], ans: 0 },
    { text: 'Mulțimea soluțiilor reale ale inecuației $(x+1)^2<x^2$ este:', choices: ['$(-\\infty;-0{,}5)$', '$(-\\infty;0{,}5)$', '$(-\\infty;-0{,}5]$', '$(-\\infty;0{,}5]$'], ans: 0 },
    { text: 'Un joc ce costa $20$ de lei s-a scumpit cu $20\\%$. Prețul actual al jocului este de:', choices: ['$4$ lei', '$5$ lei', '$24$ lei', '$25$ lei'], ans: 2 },

    {
      text: 'Dacă $A$, $B$, $C$ și $D$ sunt patru puncte coliniare astfel încât lungimile segmentelor $AB$, $BC$ și $CD$ sunt numere naturale consecutive și $AD=12$ cm, atunci lungimea lui $BD$ este de:',
      choices: ['$5$ cm', '$7$ cm', '$8$ cm', '$9$ cm'], ans: 3,
      fig: { w: 160, h: 34, p: { A: [15, 24], B: [48, 24], C: [92, 24], D: [147, 24] }, l: { A: 'n', B: 'n', C: 'n', D: 'n' }, s: 'A-D', dot: 'A B C D' },
    },
    {
      text: 'Triunghiul $ABC$ are $\\sphericalangle A=2x^\\circ$ și $\\sphericalangle B=x^\\circ$. Fie $D\\in BC$ astfel încât $C$ se găsește între $B$ și $D$. Dacă $\\sphericalangle ACD=90^\\circ+x^\\circ$, valoarea lui $x$ este:',
      choices: ['$60^\\circ$', '$45^\\circ$', '$22{,}5^\\circ$', '$30^\\circ$'], ans: 1,
      fig: { w: 175, h: 95, p: { A: [80, 12], B: [12, 80], C: [120, 80], D: [165, 80] }, l: { C: 's', D: 's' }, s: 'A-B-D A-C' },
    },
    {
      text: 'Dacă $\\sphericalangle AOB$ și $\\sphericalangle COB$ sunt unghiuri complementare, iar măsura $\\sphericalangle AOB$ este cu $16^\\circ$ mai mică decât $\\sphericalangle COB$, atunci măsura $\\sphericalangle COB$ este:',
      choices: ['$53^\\circ$', '$37^\\circ$', '$98^\\circ$', '$82^\\circ$'], ans: 0,
      fig: { w: 145, h: 110, p: { O: O9, A: [130, 95], B: onCircle(O9, 95, 37), C: [15, 10] }, l: { O: 'sw', A: 's', C: 'w' }, s: 'O-A O-B O-C', ra: ['AOC'] },
    },
    {
      text: 'Fie $\\triangle ABC$ cu punctele $E\\in AB$ și $D\\in AC$ astfel încât $AE=4$ cm, $EB=2$ cm, $AD=3$ cm, $CD=5$ cm și $BC=12$ cm. Perimetrul $\\triangle AED$ este de:',
      choices: ['$15$ cm', '$13$ cm', '$11{,}5$ cm', '$10$ cm'], ans: 1,
      fig: { w: 170, h: 130, p: { A: A10, B: B10, C: C10, E: along(A10, B10, 2 / 3), D: along(A10, C10, 3 / 8) }, s: 'A-B-C-A E-D' },
    },
    {
      text: '$ABCD$ este un paralelogram cu $AD=4$ cm, $CD=20$ cm, $\\sphericalangle C=150^\\circ$ și $AC\\cap BD=\\{O\\}$. Aria $\\triangle BOC$ este de:',
      choices: ['$80\\text{ cm}^2$', '$40\\text{ cm}^2$', '$10\\text{ cm}^2$', '$10\\sqrt{3}\\text{ cm}^2$'], ans: 2,
      fig: { w: 215, h: 76, p: { A: A11, B: B11, C: C11, D: D11, O: meet(A11, C11, B11, D11) }, l: { O: 'n' }, s: 'A-B-C-D-A A-C B-D' },
    },
    {
      text: 'Fie $VABCDEF$ o piramidă hexagonală regulată cu $AB=6$ cm și $VB=6\\sqrt{2}$ cm. Măsura $\\sphericalangle(VB;CD)$ este de:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 1,
      fig: {
        w: 160, h: 165,
        p: { V: [80, 15], A: hex(0), B: hex(1), C: hex(2), D: hex(3), E: hex(4), F: hex(5) },
        l: { E: 'n', V: 'n' },
        s: 'F-A-B-C-D V-A V-B V-C V-D V-F', d: 'D-E-F V-E',
      },
    },

    {
      text: 'La un spectacol s-au vândut în total $238$ de bilete pentru adulți și pentru copii, încasându-se suma totală de $10\\,640$ de lei. Un bilet pentru adulți costă $50$ de lei și un bilet pentru copii costă $15$ lei.',
      parts: [
        { pts: 2, text: 'Este posibil ca numărul de bilete pentru copii vândute să fie de $28$?', ans: 'Nu ($210\\cdot 50+28\\cdot 15=10\\,920\\ne 10\\,640$)' },
        { pts: 3, text: 'Câți adulți au vizionat spectacolul?', ans: '$202$ adulți' },
      ],
    },
    {
      text: 'Fie expresia $E(x)=(2x-3)^2-5x(x+3)+(x+1)^2$, $x\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Să se aducă expresia la forma cea mai simplă.', ans: '$E(x)=-25x+10$' },
        { pts: 3, text: 'Calculați valoarea expresiei $E(x)$ pentru $x=-0{,}2$.', ans: '$15$' },
      ],
    },
    {
      text: 'Fie numerele $a=\\sqrt{3}\\cdot\\left(\\sqrt{8\\tfrac{1}{3}}+\\sqrt{16{,}(3)}\\right)$ și $b=\\sqrt{3}\\cdot\\left(\\sqrt{3}-\\sqrt{3^{-1}}\\right)+\\sqrt{2}\\cdot\\left(\\sqrt{8}-\\dfrac{4}{\\sqrt{2}}\\right)$.',
      parts: [
        { pts: 2, text: 'Arătați că $a=12$.', ans: '$a=\\sqrt{3}\\left(\\dfrac{5}{\\sqrt{3}}+\\dfrac{7}{\\sqrt{3}}\\right)=12$' },
        { pts: 3, text: 'Calculați media geometrică a numerelor $a$ și $b$.', ans: '$b=2$, media geometrică este $2\\sqrt{6}$' },
      ],
    },
    {
      text: 'În triunghiul dreptunghic $ABC$ cu $\\sphericalangle A=90^\\circ$ și $BC=20$ cm se duce $AD\\perp BC$, $D\\in BC$, cu $CD=4\\cdot BD$.',
      parts: [
        { pts: 2, text: 'Aflați lungimea lui $AD$.', ans: '$BD=4$ cm, $CD=16$ cm, $AD=8$ cm' },
        { pts: 3, text: 'Arătați că perimetrul $\\triangle ABC$ este mai mic de $56$ cm.', ans: '$P_{\\triangle ABC}=12\\sqrt{5}+20$ cm $<56$ cm' },
      ],
      fig: { w: 135, h: 155, p: { B: [110, 12], D: [110, 38], C: [110, 142], A: [58, 38] }, l: { A: 'w', D: 'e' }, s: 'A-B-C-A A-D', ra: ['BAC', 'ADB'] },
    },
    {
      text: 'În trapezul dreptunghic $ABCD$ cu $AB\\parallel CD$ se cunosc $AB=9$ cm, $CD=12$ cm, $AD=6$ cm și $S\\in BC$ astfel încât $BS=\\sqrt{5}$ cm. Se duce $DS\\cap AB=\\{E\\}$.',
      parts: [
        { pts: 2, text: 'Aflați lungimea lui $BC$.', ans: '$3\\sqrt{5}$ cm' },
        { pts: 3, text: 'Calculați aria triunghiului $BSE$.', ans: '$6\\text{ cm}^2$' },
      ],
      fig: { w: 192, h: 92, p: { A: [12, 12], B: [111, 12], E: [177, 12], D: [12, 78], C: [144, 78], S: [122, 34] }, l: { A: 'nw', B: 'n', E: 'n', S: 'e' }, s: 'A-B-C-D-A D-S-E B-E', ra: ['DAB', 'ADC'] },
    },
    {
      text: 'În tetraedrul regulat $ABCD$ se cunosc $AB=6$ cm și $M$ mijlocul lui $BC$.',
      parts: [
        { pts: 2, text: 'Calculați aria $\\triangle AMD$.', ans: '$9\\sqrt{2}\\text{ cm}^2$' },
        { pts: 3, text: 'Determinați măsura unghiului dintre $AD$ și $BC$.', ans: '$90^\\circ$' },
      ],
      fig: { w: 185, h: 160, p: { B: B18, A: [15, 120], D: [170, 110], C: C18, M: mid(B18, C18) }, l: { M: 'e' }, s: 'B-A-C-D-B B-C A-M-D', d: 'A-D' },
    },
  ],
}
