// Perianu și alții, Testul 8 (Matematică pentru Evaluarea Națională, Art Klett, pages 245–250; no answer pages in
// the photos: the answers are computed)
import type { EnModel } from '../types'
import { plane, type Pt } from '../figure'
import { pol } from './shapes'

// II.1: AM the perpendicular bisector of BC, AC ∥ MB, the angle CAT of 40°
const t40 = Math.tan((40 * Math.PI) / 180)
const fig7 = plane({ C: [0, 1.4], B: [0, -1.4], T: [0, 0], A: [1.4 / t40, 0], M: [-1.4 / t40, 0] }, 150, {
  s: 'C-B M-A A-C M-B', l: { T: 'ne' },
})

// II.2: the square and P, the reflection of A in B
const fig8 = plane({ A: [0, 0], B: [9, 0], C: [9, 9], D: [0, 9], P: [18, 0] }, 190, { s: 'A-B-C-D-A B-P', dot: 'P' })

// II.3: the garden, AD ⊥ BC
const fig9 = plane({ C: [-9, 0], D: [0, 0], B: [16, 0], A: [0, -12] }, 180, { s: 'C-B-A-C A-D', ra: ['ADB'], l: { D: 'n' } })

// II.4: the square with four semicircles outside it (drawn in pixels: side 80, radius 40)
const fig10 = {
  w: 200, h: 200,
  p: { A: [60, 140] as Pt, B: [140, 140] as Pt, C: [140, 60] as Pt, D: [60, 60] as Pt },
  s: 'A-B-C-D-A',
  path: [{ d: 'M60 60 A40 40 0 0 1 140 60 A40 40 0 0 1 140 140 A40 40 0 0 1 60 140 A40 40 0 0 1 60 60' }],
}

// II.5: the tangent MN at N, parallel to the diameter AB
const N11 = pol(-70)
const fig11 = plane(
  { A: pol(200), B: pol(20), O: [0, 0], N: N11, M: [N11[0] - 0.95 * Math.cos(Math.PI / 9), N11[1] - 0.95 * Math.sin(Math.PI / 9)], E: [N11[0] + 0.6 * Math.cos(Math.PI / 9), N11[1] + 0.6 * Math.sin(Math.PI / 9)] },
  160,
  { s: 'A-B M-E', dot: 'O M', c: [{ at: 'O', r: 1 }], l: { E: '', O: 's', M: 's', N: 'se' } },
)

// III.4: the trapezoid, AC the bisector of the angle BAD, the angle DAC of 30°
const fig16 = plane({ A: [0, 0], B: [17.32, 0], C: [8.66, 5], D: [2.887, 5] }, 190, { s: 'A-B-C-D-A A-C' })

const fig17 = plane({ A: [0, 16], B: [-12, 0], C: [12, 0] }, 140, { s: 'A-B-C-A' })

export const M40: EnModel = {
  id: 'en-40',
  title: 'Perianu, Testul 8',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 245–250',
  items: [
    { text: 'Cel mai mic multiplu comun al numerelor $24$ și $36$ este:', choices: ['$36$', '$54$', '$72$', '$144$'], ans: 2 },
    {
      text: 'În tabelul de mai jos este prezentată situația notelor obținute de elevii unei clase a opta la un test de matematică:\n\n| Nota | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n|---|---|---|---|---|---|---|---|\n| Număr de elevi | 1 | 3 | 2 | 5 | 4 | 5 | 3 |\n\nAu obținut cel puțin nota $8$ un număr de:',
      choices: ['$15$ elevi', '$8$ elevi', '$11$ elevi', '$12$ elevi'], ans: 3,
    },
    {
      text: 'În cadrul unui experiment, temperatura unei substanțe este modificată de la $-10\\,^\\circ\\text{C}$ la $18\\,^\\circ\\text{C}$. Diferența dintre cele două valori este de:',
      choices: ['$10\\,^\\circ\\text{C}$', '$18\\,^\\circ\\text{C}$', '$8\\,^\\circ\\text{C}$', '$28\\,^\\circ\\text{C}$'], ans: 3,
    },
    {
      text: 'Trei numere raționale cuprinse între $2{,}5$ și $2{,}7$ sunt:',
      choices: ['$2{,}5;\\ 2{,}6;\\ 2{,}7$', '$2{,}4;\\ 2{,}6;\\ 2{,}8$', '$2{,}59;\\ 2{,}6;\\ 2{,}61$', 'nu există trei fracții cuprinse între $2{,}5$ și $2{,}7$'], ans: 2,
    },
    {
      text: 'Dacă $7\\sqrt{5}$ este mai mare decât $x$ cu $2\\sqrt{5}$, atunci opusul lui $x$ este:',
      choices: ['$7\\sqrt{5}$', '$2\\sqrt{5}$', '$-5\\sqrt{5}$', '$5\\sqrt{5}$'], ans: 2,
    },
    {
      text: 'Un spectacol începe la $18{:}30$ și se termină peste două ore și jumătate, adică la ora:',
      choices: ['$20{:}00$', '$20{:}30$', '$21{:}00$', '$21{:}30$'], ans: 2,
    },

    {
      text: 'În figura alăturată, $AM$ este mediatoarea segmentului $BC$, $AM\\cap BC=\\{T\\}$, $AC\\parallel MB$, $\\sphericalangle CAT=40^\\circ$. Măsura unghiului $TBM$ este de:',
      choices: ['$40^\\circ$', '$50^\\circ$', '$60^\\circ$', '$45^\\circ$'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat cu perimetrul de $36$ cm, iar $P$ este simetricul lui $A$ față de $B$. Distanța de la $P$ la $AD$ este de:',
      choices: ['$9$ cm', '$36$ cm', '$18$ cm', '$12$ cm'], ans: 2, fig: fig8,
    },
    {
      text: 'În figură este reprezentată o porțiune dintr-o grădină unde sunt plantate flori în punctele $A$, $B$, $C$, $D$ astfel încât $AD\\perp BC$, $D\\in BC$, $AD=12$ cm, $AB=20$ cm, $AC=15$ cm. Proprietarul grădinii afirmă că $\\sphericalangle CAB=90^\\circ$. Afirmația este:',
      choices: ['adevărată', 'falsă'], ans: 0, fig: fig9,
    },
    {
      text: 'Un obiect ornamental este format din pătratul $ABCD$ și patru semicercuri egale, construite pe laturile pătratului, în exterior, ca în figură. Se cunoaște că lungimea unui semicerc este de $4\\pi$ cm. Aria suprafeței obiectului ornamental este egală cu:',
      choices: ['$16+16\\pi\\text{ cm}^2$', '$64+32\\pi\\text{ cm}^2$', '$64\\text{ cm}^2$', '$64+16\\pi\\text{ cm}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată a fost construită tangenta $MN$ la $\\mathcal{C}(O,\\,R)$. $AB$ este un diametru astfel încât $AB\\parallel MN$. Măsura arcului $\\overset{\\frown}{NAB}$ este de:',
      choices: ['$210^\\circ$', '$150^\\circ$', '$270^\\circ$', '$180^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'Un copil are $27$ de bile sferice din plastilină, cu raza de $2$ cm. El le contopește și formează o singură bilă. Raportul dintre suma ariilor bilelor mici și dublul ariei bilei mari este:',
      choices: ['$\\dfrac{1}{3}$', '$\\dfrac{2}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{3}{2}$'], ans: 3,
    },

    {
      text: 'În două depozite sunt $2080$ kg de cartofi. Din primul depozit se scoate jumătate din cantitatea aflată acolo, iar din cel de-al doilea se scoate $0{,}3$ din cantitatea care era în al doilea depozit. Administratorul observă că în cele două depozite au mai rămas, în total, $1240$ kg de cartofi.',
      parts: [
        { pts: 2, text: 'Arată că $2080$ este un multiplu al lui $65$.', ans: '$2080=65\\cdot32$' },
        { pts: 3, text: 'Ce cantitate era inițial în fiecare depozit?', ans: '$1080$ kg în primul depozit și $1000$ kg în al doilea ($0{,}5x+0{,}7(2080-x)=1240$)' },
      ],
    },
    {
      text: 'Fie expresia $E(x)=\\left(\\dfrac{x^2-x}{x^2+1}-\\dfrac{2x^2}{1-x+x^2-x^3}\\right):\\dfrac{x^2}{x^2-1}\\cdot\\dfrac{2x^2}{x^2-2x-3}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{2x}{x-3}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1,\\,3\\}$.', ans: '$1-x+x^2-x^3=(1-x)(1+x^2)$, paranteza este $\\dfrac{x}{x-1}$, iar $\\dfrac{x}{x-1}\\cdot\\dfrac{(x-1)(x+1)}{x^2}\\cdot\\dfrac{2x^2}{(x-3)(x+1)}=\\dfrac{2x}{x-3}$' },
        { pts: 3, text: 'Determină numerele întregi $n$ pentru care $E(n)$ este număr întreg.', ans: '$E(n)=2+\\dfrac{6}{n-3}$, deci $n\\in\\{-3,\\,2,\\,4,\\,5,\\,6,\\,9\\}$' },
      ],
    },
    {
      text: 'Reprezentarea grafică a funcției $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$, este o dreaptă care trece prin punctele $A(-3,\\,0)$ și $B(0,\\,-6)$.',
      parts: [
        { pts: 2, text: 'Stabilește dacă punctul $P(-1,\\,-3)$ aparține graficului lui $f$.', ans: 'Nu: $f(x)=-2x-6$ și $f(-1)=-4\\neq-3$' },
        { pts: 3, text: 'Determină coordonatele punctului $C$, $C\\in Ox$, astfel încât triunghiul $ABC$ să fie dreptunghic în $B$.', ans: '$C(12,\\,0)$' },
      ],
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez ($AB\\parallel CD$, $AB>CD$) în care diagonala $AC$ este bisectoarea unghiului $BAD$, $\\sphericalangle DAC=30^\\circ$ și $\\dfrac{AC}{AB}=\\dfrac{AD}{AC}$.',
      parts: [
        { pts: 2, text: 'Calculează măsura unghiului $ADC$.', ans: '$\\sphericalangle DCA=\\sphericalangle CAB=30^\\circ$, deci $\\sphericalangle ADC=120^\\circ$' },
        { pts: 3, text: 'Știind că $AC=10$ cm, calculează lungimea segmentului $BC$.', ans: '$\\triangle ADC\\sim\\triangle ACB$, deci $\\sphericalangle ABC=30^\\circ=\\sphericalangle CAB$ și $BC=AC=10$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul isoscel $ABC$ ($AB=AC$), cu $AB=20$ cm și $BC=24$ cm.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $ABC$.', ans: '$192\\text{ cm}^2$ (înălțimea din $A$ este $16$ cm)' },
        { pts: 3, text: 'Arată că raportul dintre raza cercului înscris în triunghiul $ABC$ și raza cercului circumscris triunghiului $ABC$ este mai mic decât $\\dfrac{1}{4}$.', ans: '$r=\\dfrac{192}{32}=6$ cm, $R=\\dfrac{20\\cdot20\\cdot24}{4\\cdot192}=\\dfrac{25}{2}$ cm, $\\dfrac{r}{R}=\\dfrac{12}{25}$; atenție: $\\dfrac{12}{25}>\\dfrac14$, deci afirmația din carte nu se verifică (este adevărat că $\\dfrac{12}{25}<\\dfrac12$)' },
      ],
      fig: fig17,
    },
    {
      text: 'O piesă metalică are forma unei piramide triunghiulare regulate $VABC$, cu volumul egal cu $16\\sqrt{6}\\text{ cm}^3$ și perimetrul bazei de $12\\sqrt{3}$ cm.',
      parts: [
        { pts: 2, text: 'Arată că înălțimea piramidei este egală cu $4\\sqrt{2}$ cm.', ans: '$AB=4\\sqrt3$ cm, $\\mathcal{A}_b=12\\sqrt3\\text{ cm}^2$, $h=\\dfrac{3\\cdot16\\sqrt6}{12\\sqrt3}=4\\sqrt2$ cm' },
        { pts: 3, text: 'Determină măsura unghiului dintre dreptele $VA$ și $BC$.', ans: '$90^\\circ$ ($BC\\perp(VAM)$, unde $M$ este mijlocul lui $BC$)' },
      ],
    },
  ],
}
