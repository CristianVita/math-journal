// Testul 4 (Perianu și alții, Matematică pentru Evaluarea Națională, Art Klett, pages 219–224; the book's answers are
// not in the photos, so every answer here is computed)
import type { EnModel } from '../types'
import { plane } from '../figure'
import { pol } from './shapes'

// II.1: ∡COD = 21°30′, ∡AOB = 43°
const fig7 = plane({ A: [-4, 0], O: [0, 0], D: [4, 0], B: pol(137, 4), C: pol(21.5, 4) }, 170, { s: 'A-D O-B O-C', l: { O: 's', A: 's', D: 's' } })

// II.3: Q inside ∡AMB, C and D its reflections in MA and MB, so MC = MQ = MD
const fig9 = plane(
  { M: [0, 0], A: pol(45, 1.3), B: pol(-5, 1.4), Q: pol(20, 1), C: pol(70, 1), D: pol(-30, 1) },
  140,
  { s: 'M-A M-B M-C M-D C-Q-D', l: { M: 'w' } },
)

// II.4: the bathroom 5 m × 3 m, the shower a quarter of a circle of 2 m in a corner
const f10 = plane({ A: [0, 0], B: [5, 0], C: [5, 3], D: [0, 3] }, 170, { s: 'A-B-C-D-A', l: { A: '', B: '', C: '', D: '' }, t: [{ at: [0.75, 2.35], s: 'cadă', size: 12 }] })
const k10 = (f10.p.B[0] - f10.p.A[0]) / 5
const [dx, dy] = f10.p.D
const fig10 = { ...f10, path: [{ d: `M${dx + 2 * k10} ${dy} A${2 * k10} ${2 * k10} 0 0 1 ${dx} ${dy + 2 * k10}` }] }

export const M20: EnModel = {
  id: 'en-20',
  title: 'Perianu, Testul 4',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 219–224',
  items: [
    { text: 'Dublul lui $2^6$ este:', choices: ['$2^{12}$', '$2^7$', '$2^8$', '$5^5$'], ans: 1 },
    { text: 'Numerele $6$ și $8$ sunt direct proporționale cu:', choices: ['$7$ și $9$', '$10$ și $12$', '$24$ și $32$', '$-30$ și $40$'], ans: 2 },
    { text: 'Suma dintre $-6$ și produsul numerelor $-3$ și $3$ este:', choices: ['$3$', '$15$', '$-3$', '$-15$'], ans: 3 },
    {
      text: 'Patru elevi obțin, la un test de matematică, următoarele note:\n\n| | |\n|---|---|\n| Alin | 9 |\n| Mihai | 8 |\n| Vera | 10 |\n| George | 5 |\n\nDiferența notelor impare obținute de ei este de:',
      choices: ['$1$ punct', '$2$ puncte', '$4$ puncte', '$5$ puncte'], ans: 2,
    },
    { text: 'Media geometrică dintre $12$ și triplul său este:', choices: ['$12\\sqrt{3}$', '$12$', '$\\sqrt{12}$', '$3\\sqrt{12}$'], ans: 0 },
    {
      text: 'Numerele $3{,}14$; $3{,}(14)$ și $3{,}1(4)$ se așază în ordine crescătoare. Varianta corectă este:',
      choices: ['$3{,}1(4);\\ 3{,}(14);\\ 3{,}14$', '$3{,}14;\\ 3{,}1(4);\\ 3{,}(14)$', '$3{,}14;\\ 3{,}(14);\\ 3{,}1(4)$', '$3{,}1(4);\\ 3{,}(14);\\ 3{,}14$'], ans: 2,
    },

    {
      text: 'În figura alăturată, unghiul $COD$ are $21^\\circ30\'$ și $\\sphericalangle AOB=2\\cdot\\widehat{COD}$. Unghiul $BOC$ este un unghi:',
      choices: ['drept', 'ascuțit', 'obtuz', 'alungit'], ans: 2, fig: fig7,
    },
    {
      text: 'Fie $\\triangle ABC$, $AB=AC$ și $\\sphericalangle BAP=\\sphericalangle CAP$ ($P\\in(BC)$), $BP=5$ cm, $PS\\parallel AB$, $S\\in(AC)$, $PS=50$ mm. Măsura unghiului $C$ este de:',
      choices: ['$45^\\circ$', '$60^\\circ$', '$90^\\circ$', '$30^\\circ$'], ans: 1,
    },
    {
      text: 'În figura alăturată sunt reprezentate aleile unui parc: $MA$, $MB$, $QD$, $QC$, $MC$, $MD$, astfel încât $Q\\in\\text{Int}\\,\\widehat{AMB}$, $C$ este simetricul lui $Q$ față de $MA$ și $D$ este simetricul lui $Q$ față de $MB$. Un vizitator parcurge distanța de la $M$ la $C$, respectiv $20$ m, iar alt vizitator parcurge distanța de la $M$ la $D$. Al doilea vizitator parcurge:',
      choices: ['$10$ m', '$40$ m', '$25$ m', '$20$ m'], ans: 3, fig: fig9,
    },
    {
      text: 'Într-o baie în formă de dreptunghi cu lățimea de $3$ m și lungimea de $5$ m este o cadă de duș în formă de sfert de cerc cu $r=2$ m, ca în figura alăturată. Restul podelei este acoperit cu gresie. Aria suprafeței acoperite cu gresie este de:',
      choices: ['$(25-\\pi)\\text{ m}^2$', '$(15-2\\pi)\\text{ m}^2$', '$(9-\\pi)\\text{ m}^2$', '$(15-\\pi)\\text{ m}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'Fie $\\mathcal{C}(O,\\,r)$ și $A,\\,B\\in\\mathcal{C}(O,\\,r)$ astfel încât $\\sphericalangle OAB=50^\\circ$. Măsura arcului $AB$ este de:',
      choices: ['$50^\\circ$', '$80^\\circ$', '$100^\\circ$', '$25^\\circ$'], ans: 1,
    },
    {
      text: 'Un suport de creioane are forma unui paralelipiped dreptunghic cu dimensiunile de $5$ cm, $8$ cm și $6$ cm. Lungimea maximă, exprimată printr-un număr natural, a unui creion care este în întregime în interiorul suportului este de:',
      choices: ['$11$ cm', '$10$ cm', '$12$ cm', '$13$ cm'], ans: 0,
    },

    {
      text: 'Mai mulți copii vor să cumpere o carte. Dacă fiecare copil dă câte $2{,}5$ lei, mai trebuie $3$ lei. Dacă fiecare dă câte $3$ lei, rămâne în plus un leu.',
      parts: [
        { pts: 2, text: 'Câți copii sunt?', ans: '$2{,}5n+3=3n-1$, deci $n=8$ copii' },
        { pts: 3, text: 'Câți lei costă cartea?', ans: '$23$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2x}{x^2-25}+\\dfrac{2}{x+5}+\\dfrac{1}{5-x}\\right):\\dfrac{x^2-7x+10}{x^2+3x-10}$, unde $x\\in\\mathbb{R}\\setminus\\{-5,\\,5,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2+3x-10=(x+5)(x-2)$, pentru orice număr real $x$.', ans: '$x^2+5x-2x-10=x(x+5)-2(x+5)=(x+5)(x-2)$' },
        { pts: 3, text: 'Demonstrează că $E(x)=\\dfrac{3}{x-5}$, oricare ar fi $x\\in\\mathbb{R}\\setminus\\{-5,\\,5,\\,2\\}$.', ans: 'paranteza este $\\dfrac{3x-15}{x^2-25}=\\dfrac{3}{x+5}$, iar $\\dfrac{3}{x+5}\\cdot\\dfrac{(x+5)(x-2)}{(x-2)(x-5)}=\\dfrac{3}{x-5}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$, unde $a,b\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Determină numerele $a$ și $b$ știind că punctele $M(-2,\\,-2)$ și $P(1,\\,4)$ se găsesc pe graficul funcției $f$.', ans: '$a=2$, $b=2$' },
        { pts: 3, text: 'Dacă $a=b=2$, atunci determină aria triunghiului $CDE$, unde $C(0,\\,f(0))$, $D(s,\\,0)$ și $E(-5s,\\,0)$, unde numărul $s$ este soluția ecuației $f(x)=0$.', ans: '$s=-1$, $C(0,\\,2)$, $D(-1,\\,0)$, $E(5,\\,0)$, aria este $\\dfrac{6\\cdot2}{2}=6$' },
      ],
    },
    {
      text: 'Fie $\\triangle ABC$ dreptunghic, cu ipotenuza $BC$. $AD$ este înălțime, $D\\in(BC)$. Fie $M\\in AB$, astfel ca $B$ să fie între $A$ și $M$, $BD=BM$, $m\\left(\\widehat{DMB}\\right)=120^\\circ$, $MD\\cap AC=\\{N\\}$.',
      parts: [
        { pts: 2, text: 'Determină măsura unghiului $ACB$.', ans: 'unghiul de $120^\\circ$ este $\\sphericalangle DBM$ (în $\\triangle DBM$ isoscel, $\\sphericalangle DMB$ nu poate avea $120^\\circ$), deci $\\sphericalangle ABC=60^\\circ$ și $\\sphericalangle ACB=30^\\circ$' },
        { pts: 3, text: 'Demonstrează că triunghiurile $AMN$ și $ACB$ sunt asemenea.', ans: '$\\sphericalangle AMN=\\sphericalangle BMD=30^\\circ=\\sphericalangle ACB$ și $\\sphericalangle MAN=\\sphericalangle CAB=90^\\circ$' },
      ],
    },
    {
      text: 'Fie $ABCD$ un trapez isoscel, $AB\\parallel CD$, $AB>CD$. Se știe că $AB=10$ cm, $BC=6$ cm și $AC\\perp CB$.',
      parts: [
        { pts: 2, text: 'Arată că $CD=2{,}8$ cm.', ans: 'proiecția lui $BC$ pe $AB$ este $\\dfrac{36}{10}=3{,}6$ cm, deci $CD=10-2\\cdot3{,}6=2{,}8$ cm' },
        { pts: 3, text: 'Cât la sută din aria trapezului reprezintă aria triunghiului $ABC$?', ans: '$h=4{,}8$ cm, $\\mathcal{A}_{ABC}=24\\text{ cm}^2$, $\\mathcal{A}_{ABCD}=30{,}72\\text{ cm}^2$, deci $78{,}125\\%$' },
      ],
    },
    {
      text: "Cutia de ambalaj a unui obiect este cubul $ABCDA'B'C'D'$, de muchie $15$ cm. Se consideră punctele $I$, $J$, $K$ aflate pe segmentele $AB$, $BC$ și, respectiv, $BB'$, astfel încât $IB=BJ=\\dfrac{1}{3}AB$ și $B'K=\\dfrac{2}{3}\\cdot BB'$.",
      parts: [
        { pts: 2, text: 'Arată că $0{,}15\\text{ m}^2$ carton sunt suficienți pentru a confecționa cutia, știind că la confecționare se pierde $10\\%$ din cantitatea de carton necesară pentru confecționare.', ans: '$6\\cdot15^2=1350\\text{ cm}^2$, cu pierderi $1485\\text{ cm}^2<1500\\text{ cm}^2$' },
        { pts: 3, text: "Demonstrează că $D'G\\perp(IJK)$, unde $G$ este centrul de greutate al triunghiului $IJK$.", ans: "$BI=BJ=BK=5$ cm, deci $BD'$ trece prin $G$ și $BD'\\perp(IJK)$ (de exemplu $BD'\\perp IJ$, $BD'\\perp JK$)" },
      ],
    },
  ],
}
