// Testul 7 (Perianu și alții, Matematică pentru Evaluarea Națională, Art Klett, pages 238–244; the book's answers are
// not in the photos, so every answer here is computed)
import type { EnModel } from '../types'
import { plane, solid, type P3 } from '../figure'
import { pol } from './shapes'

// II.1: ∡AOB and ∡AOC complementary, ∡AOB = 72°
const fig7 = plane({ O: [0, 0], B: [4, 0], C: [0, 4], A: pol(72, 4.1) }, 110, { s: 'C-O-B O-A', ra: ['BOC'], l: { O: 'sw' } })

// II.3: AB = 11, CD = 8, AD = 4, N the midpoint of CD, the arc CM of centre N and radius 4; AMCD hatched
const f9 = plane({ A: [0, 0], B: [11, 0], C: [8, 4], D: [0, 4], N: [4, 4], M: [4, 0] }, 170, { s: 'A-B-C-D-A', dot: 'N M', l: { N: 'n', M: 's' } })
const k9 = (f9.p.B[0] - f9.p.A[0]) / 11
const P9 = f9.p
const fig9 = {
  ...f9,
  path: [
    { d: `M${P9.A[0]} ${P9.A[1]} L${P9.M[0]} ${P9.M[1]} A${4 * k9} ${4 * k9} 0 0 0 ${P9.C[0]} ${P9.C[1]} L${P9.D[0]} ${P9.D[1]} Z`, hatch: true },
  ],
}

// II.4: perpendicular lines through O, AO = 4, OM = 3, ON = 2
const fig10 = plane(
  { O: [0, 0], A: [4, 0], N: [0, 2], M: [0, -3], h1: [-1.8, 0], h2: [5, 0], v1: [0, 2.6], v2: [0, -3.6] },
  130,
  { s: 'h1-h2 v1-v2', dot: 'A N M', l: { h1: '', h2: '', v1: '', v2: '', O: 'sw', A: 'n', N: 'w', M: 'w' } },
)

// III.4: the right trapezoid, AB = 64, AD = 40, DC = 34, DE ∥ BC
const fig16 = plane({ A: [0, 0], B: [64, 0], C: [34, 40], D: [0, 40], E: [30, 0] }, 170, { s: 'A-B-C-D-A D-E', ra: ['DAB'] })

// III.6: the tent, a right triangular prism lying on its side: ABC and DEF equilateral (2 m), AD = 2,5 m
const h = Math.sqrt(3)
const t18: Record<string, P3> = { A: [0, 0, 0], B: [0, 2, 0], C: [0, 1, h], D: [2.5, 0, 0], E: [2.5, 2, 0], F: [2.5, 1, h] }
const fig18 = solid(t18, 'A-B-C D-E-F A-B-E-D B-C-F-E C-A-D-F', 190)

export const M23: EnModel = {
  id: 'en-23',
  title: 'Perianu, Testul 7',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 238–244',
  items: [
    { text: 'Raportul dintre $2^3\\cdot3^2\\cdot5$ și $2^2\\cdot3^3\\cdot5^2$ este egal cu:', choices: ['$\\dfrac{2}{3}$', '$\\dfrac{2}{15}$', '$\\dfrac{2}{5}$', '$\\dfrac{6}{10}$'], ans: 1 },
    { text: 'Cei $8$ băieți reprezintă două cincimi din numărul total de elevi ai unei clase. Numărul fetelor din clasă este de:', choices: ['$16$', '$14$', '$12$', '$20$'], ans: 2 },
    { text: 'Adunând pe $-8$ cu $4$ și apoi scăzând opusul lui $5$, obținem:', choices: ['$9$', '$-1$', '$1$', '$-9$'], ans: 2 },
    {
      text: 'Alin și Maria au bile de diverse culori, așa cum se vede în tabelul de mai jos:\n\n| | Bile albe | Bile roșii | Bile verzi | Bile negre |\n|---|---|---|---|---|\n| Alin | 3 | 5 | 2 | 7 |\n| Maria | 8 | 4 | 6 | 1 |\n\nBilele verzi ale Mariei sunt în număr mai mare față de cele albe ale lui Alin cu:',
      choices: ['$4$', '$3$', '$2$', '$1$'], ans: 1,
    },
    { text: 'Jumătatea sumei dintre $5\\sqrt{3}$, $-3\\sqrt{3}$ și $4\\sqrt{3}$ este:', choices: ['$6\\sqrt{3}$', '$12\\sqrt{3}$', '$3\\sqrt{3}$', '$-\\sqrt{3}$'], ans: 2 },
    { text: 'Într-un vagon sunt $2$ tone și jumătate de piatră. Dacă se mai adaugă $30$ de chintale, atunci în vagon ar fi:', choices: ['$2800$ kg', '$32{,}5$ t', '$5500$ kg', '$3250$ kg'], ans: 2 },

    {
      text: 'În figura alăturată sunt reprezentate unghiurile adiacente și complementare $AOB$ și $AOC$. Se știe că măsura unuia este de $4$ ori mai mare decât măsura celuilalt. Măsura unghiului mai mare este de:',
      choices: ['$18^\\circ$', '$54^\\circ$', '$72^\\circ$', '$80^\\circ$'], ans: 2, fig: fig7,
    },
    { text: 'Într-un triunghi isoscel $ABC$, cu baza $BC$, se construiește $MN\\parallel BC$, unde $M\\in AB$ și $N\\in AC$. Triunghiul $AMN$ este:', choices: ['echilateral', 'isoscel', 'dreptunghic', 'oarecare'], ans: 1 },
    {
      text: 'Figura alăturată reprezintă schița unei terase în formă de trapez dreptunghic $ABCD$, în care: $AB\\parallel CD$, $\\hat{A}=90^\\circ$, $AB=11$ m, $CD=8$ m, $CD=2\\cdot AD$, $N$ este mijlocul lui $CD$ și $M\\in AB$ astfel încât $AM=4$ m. Arcul $CM$ este o parte din cercul de centru $N$ și rază $NC$. Pe suprafața hașurată $AMCD$ se pune gresie. (Se consideră că $\\pi\\simeq3{,}14$.) Aria suprafeței pe care nu se pune gresie este aproximativ egală cu:',
      choices: ['$12{,}56\\text{ m}^2$', '$10\\text{ m}^2$', '$9{,}56\\text{ m}^2$', '$9{,}44\\text{ m}^2$'], ans: 3, fig: fig9,
    },
    { text: 'În figura alăturată, $AO=4$ cm, $OM=3$ cm, $ON=2$ cm. Distanța de la $N$ la $AM$ este egală cu:', choices: ['$3$ cm', '$4$ cm', '$5$ cm', '$5\\sqrt{2}$ cm'], ans: 1, fig: fig10 },
    { text: 'În cercul de centru $O$ și rază $r$, $MN$ este un diametru și $A$ un punct de pe cerc. Triunghiul $AMN$ este:', choices: ['ascuțitunghic', 'obtuzunghic', 'echilateral', 'dreptunghic'], ans: 3 },
    {
      text: "O cutie are forma unei prisme patrulatere regulate, în care $AB=10$ cm și $AA'=20$ cm. Cutia este plină cu lapte. Laptele din cutie se pune în pahare de $250$ ml. Numărul paharelor care se umplu cu lapte este:",
      choices: ['$7$', '$8$', '$10$', '$6$'], ans: 1,
    },

    {
      text: 'Prețul unui televizor s-a mărit cu $10\\%$, apoi s-a micșorat cu $20\\%$, ajungând să coste $1056$ de lei.',
      parts: [
        { pts: 2, text: 'Arată că $1056$ este produsul a două numere naturale consecutive.', ans: '$1056=32\\cdot33$' },
        { pts: 3, text: 'Determină prețul inițial al televizorului.', ans: '$p\\cdot1{,}1\\cdot0{,}8=1056$, deci $p=1200$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{4x}{x-4}+\\dfrac{8+x^2}{x^2-5x+4}-\\dfrac{3x}{x-1}\\right):\\dfrac{6x+12}{x^2-16}$, unde $x\\in\\mathbb{R}\\setminus\\{-4,\\,-2,\\,1,\\,4\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2-5x+4=(x-1)(x-4)$, pentru orice număr real $x$.', ans: '$x^2-x-4x+4=x(x-1)-4(x-1)=(x-1)(x-4)$' },
        { pts: 3, text: 'Arată că $E(x)=\\dfrac{(x+2)(x+4)}{3(x-1)}$, oricare ar fi $x\\in\\mathbb{R}\\setminus\\{-4,\\,-2,\\,1,\\,4\\}$.', ans: 'paranteza este $\\dfrac{2x^2+8x+8}{(x-1)(x-4)}=\\dfrac{2(x+2)^2}{(x-1)(x-4)}$, iar $\\cdot\\dfrac{(x-4)(x+4)}{6(x+2)}$ dă $\\dfrac{(x+2)(x+4)}{3(x-1)}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x\\sqrt{3}-4$.',
      parts: [
        { pts: 2, text: 'Reprezintă grafic funcția $f$.', ans: 'dreapta prin $A\\left(\\dfrac{4\\sqrt{3}}{3},\\,0\\right)$ și $B(0,\\,-4)$' },
        { pts: 3, text: 'Determină măsura unghiului format de graficul funcției cu axa $Oy$.', ans: '$\\text{tg}\\sphericalangle OBA=\\dfrac{OA}{OB}=\\dfrac{\\sqrt{3}}{3}$, deci unghiul are $30^\\circ$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentată o grădină de forma unui trapez dreptunghic $ABCD$: $AB\\parallel CD$, $\\sphericalangle A=90^\\circ$, $AB=64$ m, $AD=40$ m, $DC=34$ m. Se construiește gardul $DE\\parallel BC$, $E\\in AB$.',
      parts: [
        { pts: 2, text: 'Arată că $DE=50$ m.', ans: '$DEBC$ e paralelogram, $EB=34$ m, $AE=30$ m, $DE=\\sqrt{30^2+40^2}=50$ m' },
        { pts: 3, text: 'Știind că $DE\\cap AC=\\{Q\\}$, arată că $DQ<27$ m.', ans: '$\\triangle QDC\\sim\\triangle QEA$: $\\dfrac{DQ}{QE}=\\dfrac{34}{30}$, deci $DQ=\\dfrac{50\\cdot34}{64}=26{,}5625$ m $<27$ m' },
      ],
      fig: fig16,
    },
    {
      text: 'Un covor dreptunghiular are diagonala de $2\\sqrt{13}$ m. Se știe că raportul dintre lungime și lățime este de $\\dfrac{3}{2}$.',
      parts: [
        { pts: 2, text: 'Arată că diagonala covorului este mai mare decât $7$ m.', ans: '$2\\sqrt{13}>7\\Leftrightarrow 52>49$' },
        { pts: 3, text: 'Covorul este dus la spălătorie, iar $1\\text{ m}^2$ de covor spălat costă $8$ lei. Câți lei vor fi plătiți pentru a-l spăla?', ans: '$L=6$ m, $l=4$ m, $24\\text{ m}^2$, deci $192$ de lei' },
      ],
    },
    {
      text: 'Un cort are forma unei prisme triunghiulare drepte $ABCDEF$, cu bazele triunghiurile echilaterale $ABC$ și $DEF$. Știm că $AB=2$ m și $AD=25$ dm.',
      parts: [
        { pts: 2, text: 'Arată că aria totală a prismei este egală cu $15+2\\sqrt{3}\\text{ m}^2$.', ans: '$\\mathcal{A}_l=3\\cdot2\\cdot2{,}5=15\\text{ m}^2$, $2\\mathcal{A}_b=2\\sqrt{3}\\text{ m}^2$' },
        { pts: 3, text: 'Calculează distanța de la $F$ la $AM$, unde $M$ este mijlocul lui $BC$.', ans: '$FC\\perp(ABC)$, $CM\\perp AM$, deci $FM\\perp AM$ și $d=FM=\\sqrt{2{,}5^2+1^2}=\\dfrac{\\sqrt{29}}{2}$ m' },
      ],
      fig: fig18,
    },
  ],
}
