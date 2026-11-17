// Testul 3 (Perianu și alții, Matematică pentru Evaluarea Națională, Art Klett, pages 212–218; the book's answers are
// not in the photos, so every answer here is computed)
import type { EnModel } from '../types'
import { meet, mid, plane, type Pt } from '../figure'

// II.2: a ∥ b, the secant at 50° to them, so the angle marked at each line is 130°
const k8 = 1 / Math.tan((50 * Math.PI) / 180)
const P8: Pt = [4, 4], Q8: Pt = [4 + 2.5 * k8, 1.5]
const fig8 = plane(
  { a1: [0.5, 4], a2: [8.5, 4], b1: [0.5, 1.5], b2: [8.5, 1.5], s1: [4 - 1.4 * k8, 5.4], s2: [4 + 3.9 * k8, 0.1], P: P8, Q: Q8 },
  180,
  {
    l: { a1: '', a2: '', b1: '', b2: '', s1: '', s2: '', P: '', Q: '' },
    s: 'a1-a2 b1-b2 s1-s2', ang: ['a2Ps1', 'b2Qs1'],
    t: [
      { at: [0.7, 4.25], s: 'a', italic: true, size: 14 }, { at: [0.7, 1.75], s: 'b', italic: true, size: 14 },
      { at: [P8[0] + 1.3, 4.3], s: '130°', size: 11 }, { at: [Q8[0] + 1.6, 1.8], s: '3x + 10°', size: 11 },
    ],
  },
)

// II.3: the medians AD and BE, the triangle AGE shaded
const A9: Pt = [3.5, 8], B9: Pt = [0, 0], C9: Pt = [10, 0]
const D9 = mid(B9, C9), E9 = mid(A9, C9)
const fig9 = plane({ A: A9, B: B9, C: C9, D: D9, E: E9, G: meet(A9, D9, B9, E9) }, 150, { s: 'A-B-C-A A-D B-E', hatch: ['A-G-E'], l: { G: 'w', E: 'ne', D: 's' } })

// II.4: the square ABCD of 10 m and the isosceles trapezoid CDMN, MN = 4 m, ∡CDM = 45°
const fig10 = plane({ A: [0, 0], B: [10, 0], C: [10, 10], D: [0, 10], M: [3, 13], N: [7, 13] }, 120, { s: 'A-B-C-D-A D-M-N-C' })

// III.4: the rhombus, M on BC, Q = DM ∩ AB
const A16: Pt = [0, 0], B16: Pt = [5.29, 6], C16: Pt = [0, 12], D16: Pt = [-5.29, 6]
const M16: Pt = [C16[0] + (B16[0] - C16[0]) * 0.62, C16[1] + (B16[1] - C16[1]) * 0.62]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, M: M16, Q: meet(D16, M16, A16, B16) }, 130, { s: 'A-B-C-D-A A-C D-B D-Q B-Q', l: { M: 'n', B: 'se' } })

// III.5: the carpet, EC = BC = 4 m, I = AC ∩ EB
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [6, 4], D: [0, 4], E: [2, 4], I: meet([0, 0], [6, 4], [2, 4], [6, 0]) }, 170, { s: 'A-B-C-D-A A-C E-B', l: { I: 's' } })

export const M19: EnModel = {
  id: 'en-19',
  title: 'Perianu, Testul 3',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 212–218',
  items: [
    { text: 'Cel mai mare divizor comun al numerelor $220$ și $330$ este:', choices: ['$55$', '$10$', '$110$', '$220$'], ans: 2 },
    {
      text: 'În tabelul de mai jos sunt înregistrate temperaturile la o stație meteo, timp de o săptămână.\n\n| Luni | Marți | Miercuri | Joi | Vineri | Sâmbătă | Duminică |\n|---|---|---|---|---|---|---|\n| $3\\,^\\circ$C | $-3\\,^\\circ$C | $-3\\,^\\circ$C | $4\\,^\\circ$C | $-2\\,^\\circ$C | $4\\,^\\circ$C | $4\\,^\\circ$C |\n\nTemperatura medie este egală cu:',
      choices: ['$2\\,^\\circ$C', '$0\\,^\\circ$C', '$1\\,^\\circ$C', '$-1\\,^\\circ$C'], ans: 2,
    },
    { text: 'Alin are $5$ lei, iar bunica îi mai dă $7$ lei. El ar vrea să cumpere o minge care costă $18{,}5$ lei. I-ar mai trebui:', choices: ['$6{,}5$ lei', '$6$ lei', '$7{,}25$ lei', '$7$ lei'], ans: 0 },
    {
      text: 'Un biciclist parcurge în prima zi o treime din drum, în a doua zi, $\\dfrac{2}{5}$ din drum, în a treia zi, $\\dfrac{1}{4}$ din drum, iar în a patra zi, restul. Cea mai mare distanță a parcurs-o în:',
      choices: ['prima zi', 'a doua zi', 'a treia zi', 'a patra zi'], ans: 1,
    },
    {
      text: 'Ordinea descrescătoare a numerelor $7\\sqrt{2}$, $6\\sqrt{3}$, $-5\\sqrt{5}$, $-4\\sqrt{7}$ este:',
      choices: ['$6\\sqrt{3}>7\\sqrt{2}>-5\\sqrt{5}>-4\\sqrt{7}$', '$7\\sqrt{2}>6\\sqrt{3}>-4\\sqrt{7}>-5\\sqrt{5}$', '$6\\sqrt{3}>-4\\sqrt{7}>7\\sqrt{2}>-5\\sqrt{5}$', '$6\\sqrt{3}>7\\sqrt{2}>-4\\sqrt{7}>-5\\sqrt{5}$'], ans: 3,
    },
    { text: 'Un automobil merge cu $60$ km/h. Afirmația „În $25$ de minute parcurge o distanță mai mică de $35$ km.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'Un punct $M$ este situat pe mediatoarea segmentului $CD$. Punctul $M$ se află:',
      choices: ['mai aproape de punctul $C$ decât de punctul $D$', 'mai aproape de punctul $D$ decât de punctul $C$', 'la distanță egală de punctele $C$ și $D$', 'în punctul $C$'], ans: 2,
    },
    { text: 'În figura alăturată, dreptele $a$ și $b$ sunt paralele. Valoarea lui $x$ este egală cu:', choices: ['$40^\\circ$', '$35^\\circ$', '$30^\\circ$', '$20^\\circ$'], ans: 0, fig: fig8 },
    {
      text: 'În figura alăturată este reprezentat un ornament în forma triunghiului $ABC$, în care $AD$ și $BE$ sunt mediane, $AD\\cap BE=\\{G\\}$, $AD=24$ cm, $BE=15$ cm, $AC=31$ cm. Un copil vrea să așeze un șnur pe segmentele $AG$–$GE$–$EA$. Afirmația că, pentru acest lucru, ajung $0{,}4$ m de șnur este:',
      choices: ['adevărată', 'falsă'], ans: 0, fig: fig9,
    },
    {
      text: 'O sală de mese are forma din figura alăturată, fiind alcătuită din pătratul $ABCD$ cu latura de $10$ m și trapezul isoscel $CDMN$, cu $MN=4$ m și $\\sphericalangle CDM=45^\\circ$. Aria sălii de mese este:',
      choices: ['$110\\text{ m}^2$', '$121\\text{ m}^2$', '$120\\text{ m}^2$', '$140\\text{ m}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'Pe un cerc de centru $O$ și rază $r$ se iau punctele $M$, $N$, $P$ și $Q$ (în sensul acelor de ceas), astfel ca $\\overset{\\frown}{MN}=140^\\circ$, $\\overset{\\frown}{NP}=60^\\circ$, $\\overset{\\frown}{PQ}=120^\\circ$. Măsurile unghiurilor patrulaterului $MNPQ$ sunt:',
      choices: ['$90^\\circ,\\ 60^\\circ,\\ 100^\\circ,\\ 110^\\circ$', '$95^\\circ,\\ 75^\\circ,\\ 85^\\circ,\\ 105^\\circ$', '$90^\\circ,\\ 80^\\circ,\\ 90^\\circ,\\ 100^\\circ$', '$90^\\circ,\\ 82^\\circ,\\ 88^\\circ,\\ 100^\\circ$'], ans: 2,
    },
    {
      text: 'Un acoperiș are forma unei piramide patrulatere regulate $SABCD$, cu muchia bazei $AB=10$ m și muchia laterală $SA=13$ m. Pe acoperiș se pune țiglă metalică și se cumpără cu $10\\%$ mai multă țiglă decât suprafața de acoperit. Se vor cumpăra:',
      choices: ['$264\\text{ m}^2$', '$240\\text{ m}^2$', '$260\\text{ m}^2$', '$250\\text{ m}^2$'], ans: 0,
    },

    {
      text: 'Din dublul unui număr se scade $16$, rezultatul se împarte la $1{,}(6)$ și se obține $24$.',
      parts: [
        { pts: 2, text: 'Determină numărul.', ans: '$(2x-16):\\dfrac{5}{3}=24$, deci $x=28$' },
        { pts: 3, text: 'Scrie toți multiplii numărului găsit, mai mici decât $352$ și care nu sunt multipli ai lui $3$.', ans: '$28,\\ 56,\\ 112,\\ 140,\\ 196,\\ 224,\\ 280,\\ 308$' },
      ],
    },
    {
      text: 'Fie expresia $E(x)=\\left(\\dfrac{2x^2-x+2}{4x^2-1}-\\dfrac{x-1}{2x+1}-\\dfrac{x+1}{1-2x}\\right):\\dfrac{x^2-2x-8}{2x^2-5x+2}\\cdot\\dfrac{1}{x-2}$, $x\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{1}{2},\\,\\dfrac{1}{2},\\,2,\\,4,\\,-2\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $2x^2-5x+2=(x-2)(2x-1)$, oricare ar fi numărul real $x$.', ans: '$2x^2-4x-x+2=2x(x-2)-(x-2)=(x-2)(2x-1)$' },
        { pts: 3, text: 'Demonstrează că $E(x)=\\dfrac{1}{x-4}$, oricare ar fi $x\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{1}{2},\\,\\dfrac{1}{2},\\,2,\\,4,\\,-2\\right\\}$.', ans: 'paranteza este $\\dfrac{(2x+1)(x+2)}{4x^2-1}=\\dfrac{x+2}{2x-1}$, iar $\\dfrac{x+2}{2x-1}\\cdot\\dfrac{(x-2)(2x-1)}{(x-4)(x+2)}\\cdot\\dfrac{1}{x-2}=\\dfrac{1}{x-4}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-4x+10$.',
      parts: [
        { pts: 2, text: 'Determină punctele de pe graficul funcției care au coordonatele egale.', ans: '$-4a+10=a$, deci punctul $(2,\\,2)$' },
        { pts: 3, text: 'Fie $A$ punctul de intersecție a reprezentării grafice a funcției $f$ cu axa $Ox$ și $M(1,\\,2)$. Determină distanța dintre punctele $A$ și $M$.', ans: '$A\\left(\\dfrac{5}{2},\\,0\\right)$, $AM=\\dfrac{5}{2}$' },
      ],
    },
    {
      text: 'În figura alăturată, $ABCD$ este un romb de latură $8$ cm și fie $M$ un punct oarecare pe $BC$.',
      parts: [
        { pts: 2, text: 'Calculează perimetrul rombului $ABCD$.', ans: '$32$ cm' },
        { pts: 3, text: 'Arată că $CD^2=AQ\\cdot CM$, unde $DM\\cap AB=\\{Q\\}$.', ans: '$\\triangle MBQ\\sim\\triangle MCD$: $BQ=\\dfrac{8\\cdot BM}{CM}$, deci $AQ=8+BQ=\\dfrac{64}{CM}$' },
      ],
      fig: fig16,
    },
    {
      text: 'Un covor de forma unui dreptunghi $ABCD$ are dimensiunile $AB=6$ m și $BC=4$ m, ca în figura alăturată. Fie un punct $E$ pe segmentul $CD$ astfel încât aria triunghiului $EBC$ să reprezinte o treime din aria covorului.',
      parts: [
        { pts: 2, text: 'Arată că $EC=BC$.', ans: '$\\dfrac{EC\\cdot4}{2}=\\dfrac{24}{3}$, deci $EC=4$ m $=BC$' },
        { pts: 3, text: 'Demonstrează că lungimea segmentului $IB$ este mai mare decât $3{,}3$ m, unde $\\{I\\}=AC\\cap EB$.', ans: '$\\dfrac{IB}{IE}=\\dfrac{AB}{EC}=\\dfrac{3}{2}$, $EB=4\\sqrt{2}$, $IB=\\dfrac{12\\sqrt{2}}{5}>3{,}3\\Leftrightarrow 288>272{,}25$' },
      ],
      fig: fig17,
    },
    {
      text: 'Un vas are forma unui trunchi de con circular drept cu baza mică în jos și având $R=15$ cm, $g=26$ cm și $h=24$ cm.',
      parts: [
        { pts: 2, text: 'Calculează volumul vasului și exprimă rezultatul în litri ($\\pi\\simeq3{,}14$).', ans: '$r=5$ cm, $V=\\dfrac{24\\pi}{3}(225+75+25)=2600\\pi\\text{ cm}^3\\approx8{,}164$ l' },
        { pts: 3, text: 'Arată că măsura unghiului sectorului de cerc obținut prin desfășurarea suprafeței laterale a conului din care provine trunchiul este mai mică decât $140^\\circ$.', ans: 'generatoarea conului $G=39$ cm, unghiul $\\dfrac{360^\\circ\\cdot15}{39}\\approx138{,}5^\\circ<140^\\circ$' },
      ],
    },
  ],
}
