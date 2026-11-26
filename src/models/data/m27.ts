// Testul 4 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 74–78; every answer here is computed and checked with the book's answers, p. 270–271).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, pol, PYR4, pyr4 } from './shapes'

const s3 = Math.sqrt(3), s2 = Math.sqrt(2)
const c75 = Math.cos((75 * Math.PI) / 180), s75 = Math.sin((75 * Math.PI) / 180)

const fig7 = plane({ A: [0, 0], B: [4, 0], C: [6, 0], D: [12, 0] }, 160, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: [5, 0], B: [-5, 0], C: pol(30, 5), D: pol(210, 5), M: pol(-50, 5), N: pol(130, 5) }, 140,
  { s: 'A-B C-D M-N', l: { O: 's' } })
const fig9 = plane({ A: [0, 12], B: [-5, 0], C: [5, 0] }, 90, { s: 'A-B-C-A' })
const fig10 = plane({ A: [0, 0], B: [14, 0], C: [10, 4], D: [4, 4] }, 140, { s: 'A-B-C-D-A' })
const fig11 = plane({ O: [0, 0], A: pol(90, 5), B: pol(150, 5), C: pol(30, 5), D: pol(270, 5) }, 110,
  { s: 'A-B-C-A A-D', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 'e' } })
const fig12 = solid(box(6, 6, 6), BOX, 110)

const fig16 = plane({ B: [0, 0], C: [2 * c75, 0], A: [c75, s75], M: [c75 + s75, s75 + c75] }, 120, { s: 'A-B-C-A A-M-C', ra: ['CAM'] })
const h17 = 6 * s3
const fig17 = plane({ A: [0, h17], D: [12, h17], B: [0, 0], C: [12, 0], M: [h17 * (s3 / 2), h17 / 2] }, 140,
  { s: 'A-B-C-D-A A-M-B D-M', ra: ['AMD'] })
const fig18 = solid(pyr4(6, 3 * s2), PYR4, 130, { seg: 'A-C V-O', l: { O: 's' } })

export const M27: EnModel = {
  id: 'en-27',
  title: 'Paralela 45, Testul 4',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 74–78',
  items: [
    { text: 'Rezultatul calculului $16:8\\cdot2-0^3+(-1)^{101}$ este:', choices: ['$-2023$', '$-1$', '$3$', '$-2020$'], ans: 2 },
    { text: 'Un obiect costă $80$ de lei. După o scumpire cu $15\\%$, prețul obiectului crește cu:', choices: ['$92$ de lei', '$68$ de lei', '$95$ de lei', '$12$ lei'], ans: 3 },
    { text: 'Probabilitatea ca, alegând la întâmplare un element $x$ al mulțimii $A=\\{6,\\,7,\\,8,\\,9,\\,10\\}$, fracția $\\dfrac{7}{x-1}$ să fie subunitară, este:', choices: ['$1$', '$\\dfrac{2}{5}$', '$\\dfrac{3}{5}$', '$\\dfrac{5}{2}$'], ans: 1 },
    { text: 'Valoarea numărului natural $n$ pentru care intervalul $(-n,\\,n]$ conține exact trei numere întregi pare este:', choices: ['$2$', '$1$', '$3$', '$4$'], ans: 2 },
    { text: 'Media aritmetică a numerelor $x=\\sqrt{2}+\\dfrac{2}{\\sqrt{2}}$ și $y=\\sqrt{2}+\\sqrt{8}-\\sqrt{32}+\\sqrt{50}$ este egală cu:', choices: ['$4$', '$6\\sqrt{2}$', '$3\\sqrt{2}$', '$2$'], ans: 2 },
    { text: 'Silviu a cumpărat un pix și un creion, pentru care a plătit $5$ lei. Pixul costă cu $3$ lei mai mult decât creionul. Dacă Silviu afirmă: „Prețul creionului este $1$ leu.”, afirmația lui este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$ și $D$, în această ordine, astfel încât $AD=2AC=3AB=12$ cm. Lungimea segmentului $BC$ este egală cu:',
      choices: ['$4$ cm', '$6$ cm', '$8$ cm', '$2$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate dreptele $AB$, $CD$ și $MN$, concurente în punctul $O$. Dacă măsura unghiului $NOA$ este egală cu $130^\\circ$, iar unghiul $COM$ are măsura egală cu $80^\\circ$, atunci măsura unghiului $DOB$ este egală cu:',
      choices: ['$210^\\circ$', '$50^\\circ$', '$10^\\circ$', '$30^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ cu $AB=AC=13$ cm și $BC=10$ cm. Aria triunghiului $ABC$ este egală cu:',
      choices: ['$130\\text{ cm}^2$', '$120\\text{ cm}^2$', '$60\\text{ cm}^2$', '$65\\text{ cm}^2$'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez isoscel având $AB\\parallel CD$, $AB>CD$, $CD=6$ cm, $AD=4\\sqrt{2}$ cm și măsura unghiului $DAB$ egală cu $45^\\circ$. Lungimea liniei mijlocii a trapezului este egală cu:',
      choices: ['$14$ cm', '$20$ cm', '$4$ cm', '$10$ cm'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc cu centrul în $O$, în care este înscris triunghiul isoscel $ABC$, cu $AB=AC$ și măsura unghiului $ABC$ egală cu $30^\\circ$. Dacă $D$ este punctul diametral opus punctului $A$, atunci măsura unghiului $DOB$ este egală cu:',
      choices: ['$60^\\circ$', '$120^\\circ$', '$150^\\circ$', '$30^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'În cubul din figura alăturată, volumul și aria totală se exprimă prin același număr real (diferă unitățile de măsură). Lungimea diagonalei cubului, exprimată în centimetri, este egală cu:',
      choices: ['$6$', '$12$', '$3\\sqrt{3}$', '$6\\sqrt{3}$'], ans: 3, fig: fig12,
    },

    {
      text: 'Alin, Bianca și Codrin au împreună $57$ de lei. Alin are cu $6$ lei mai mult decât Codrin și cu $1$ leu mai puțin decât dublul sumei Biancăi.',
      parts: [
        { pts: 2, text: 'Justifică dacă Bianca poate avea $15$ lei.', ans: 'Nu: Alin ar avea $29$ de lei, Codrin $23$ de lei, iar $29+23+15=67\\ne57$' },
        { pts: 3, text: 'Determină suma de bani pe care o are fiecare copil.', ans: 'Cu $b$ suma Biancăi: $(2b-1)+b+(2b-7)=57$, deci $b=13$; Alin $25$ de lei, Bianca $13$ lei, Codrin $19$ lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=1-\\dfrac{2}{x^2-9}\\cdot\\left[\\left(\\dfrac{x^2+9}{6x}-1\\right):\\left(\\dfrac{1}{3}-\\dfrac{1}{x}\\right)\\right]$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,0,\\,3\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x+2}{x+3}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,0,\\,3\\}$.', ans: '$\\dfrac{(x-3)^2}{6x}\\cdot\\dfrac{3x}{x-3}=\\dfrac{x-3}{2}$, deci $E(x)=1-\\dfrac{2}{(x-3)(x+3)}\\cdot\\dfrac{x-3}{2}=1-\\dfrac{1}{x+3}=\\dfrac{x+2}{x+3}$' },
        { pts: 3, text: 'Ordonează crescător numerele: $a=E(99)$, $b=E(100)$, $c=E(101)$.', ans: '$E(x)=1-\\dfrac{1}{x+3}$ și $\\dfrac{1}{102}>\\dfrac{1}{103}>\\dfrac{1}{104}$, deci $a<b<c$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-x+3$.',
      parts: [
        { pts: 2, text: 'Arată că $f(\\sqrt{5})\\cdot f(-\\sqrt{5})=4$.', ans: '$(3-\\sqrt{5})(3+\\sqrt{5})=9-5=4$' },
        { pts: 3, text: 'Demonstrează că simetricul punctului $P(1,\\,4)$ față de axa ordonatelor a sistemului de axe ortogonale $xOy$ aparține reprezentării grafice a funcției $f$.', ans: 'Simetricul este $P\'(-1,\\,4)$ și $f(-1)=1+3=4$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul isoscel $ABC$, având baza $BC$ și măsura unghiului $ABC$ egală cu $75^\\circ$. În exteriorul său este reprezentat triunghiul dreptunghic isoscel $AMC$, având ipotenuza $MC$.',
      parts: [
        { pts: 2, text: 'Arată că măsura unghiului $BMC$ este egală cu $15^\\circ$.', ans: '$\\sphericalangle BAC=30^\\circ$, deci $\\sphericalangle BAM=120^\\circ$; $AB=AM$, deci $\\sphericalangle AMB=30^\\circ$ și $\\sphericalangle BMC=45^\\circ-30^\\circ=15^\\circ$' },
        { pts: 3, text: 'Dacă $P$ este punctul de intersecție a dreptelor $AC$ și $BM$, demonstrează că $AB^2=AP\\cdot BM$.', ans: '$\\sphericalangle PAB=\\sphericalangle PBA=30^\\circ$, deci $AP=BP$; $\\triangle ABP\\sim\\triangle MBA$ (unghiurile de $30^\\circ$), deci $AB^2=BP\\cdot BM=AP\\cdot BM$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un dreptunghi în care $AD=12$ cm, $M$ este un punct interior astfel încât triunghiul $ABM$ este echilateral, iar $AM$ și $DM$ sunt drepte perpendiculare.',
      parts: [
        { pts: 2, text: 'Demonstrează că perimetrul dreptunghiului este mai mic decât $45$ cm.', ans: '$\\sphericalangle MAD=30^\\circ$, deci $AB=AM=AD\\cos30^\\circ=6\\sqrt{3}$ cm; $P=24+12\\sqrt{3}<45$, pentru că $12\\sqrt{3}=\\sqrt{432}<21$' },
        { pts: 3, text: 'Stabilește ce procent din aria dreptunghiului $ABCD$ reprezintă aria triunghiului $MAD$.', ans: '$DM=6$ cm, $\\mathcal{A}_{MAD}=\\dfrac{6\\sqrt{3}\\cdot6}{2}=18\\sqrt{3}$, $\\mathcal{A}_{ABCD}=72\\sqrt{3}$, deci $25\\%$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată, $VABCD$ este o piramidă patrulateră regulată, cu $AB=6$ cm și $\\sphericalangle AVC=90^\\circ$.',
      parts: [
        { pts: 2, text: 'Demonstrează că volumul piramidei este egal cu $36\\sqrt{2}\\text{ cm}^3$.', ans: '$AC=6\\sqrt{2}$, $VO=\\dfrac{AC}{2}=3\\sqrt{2}$ cm (mediana din unghiul drept), $V=\\dfrac{36\\cdot3\\sqrt{2}}{3}=36\\sqrt{2}\\text{ cm}^3$' },
        { pts: 3, text: 'Determină tangenta unghiului format de înălțimea piramidei cu planul unei fețe laterale.', ans: 'Cu $M$ mijlocul lui $BC$, unghiul este $\\sphericalangle OVM$: $\\text{tg}=\\dfrac{OM}{VO}=\\dfrac{3}{3\\sqrt{2}}=\\dfrac{\\sqrt{2}}{2}$' },
      ],
      fig: fig18,
    },
  ],
}
