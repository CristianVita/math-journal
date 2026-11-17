// Perianu și alții, Testul 13 (Matematică pentru Evaluarea Națională, Art Klett, pages 277–282; the answers are
// computed)
import type { EnModel } from '../types'
import { meet, mid3, plane, solid, type Pt } from '../figure'
import { PYR4, pol, pyr4 } from './shapes'

const fig7 = plane({ A: [0, 0], B: [1.3, 0], C: [3.1, 0], D: [4.4, 0], l1: [-0.3, 0], l2: [4.7, 0] }, 200, {
  s: 'l1-l2', dot: 'A B C D', l: { l1: '', l2: '', A: 'n', B: 'n', C: 'n', D: 'n' },
})

// II.2: AC and BD meet at O
const A8: Pt = [0, 1.2], B8: Pt = [4.2, 1.2], C8: Pt = [4.4, -0.5], D8: Pt = [0.4, -0.5]
const fig8 = plane({ A: A8, B: B8, C: C8, D: D8, O: meet(A8, C8, B8, D8) }, 190, { s: 'A-C B-D', l: { O: 's' } })

// II.3: M and N on the perpendicular bisector of BC, MB = 4, NC = 8
const fig9 = plane({ B: [0, 0], C: [7, 0], M: [3.5, Math.sqrt(16 - 12.25)], N: [3.5, -Math.sqrt(64 - 12.25)] }, 110, { s: 'B-M B-C C-N' })

// II.4: the parallelogram, M the midpoint of AB, DM ∩ AC = {P}
const A10: Pt = [0, 0], C10: Pt = [10, 4.5], D10: Pt = [2, 4.5], M10: Pt = [4, 0]
const fig10 = plane({ A: A10, B: [8, 0], C: C10, D: D10, M: M10, P: meet(A10, C10, D10, M10) }, 180, { s: 'A-B-C-D-A D-M A-C', l: { P: 'n' } })

// II.5: the circles of centres A and C, tangent at E; GE and EJ diameters, HG = AG
const H11 = pol(240, 2), r11 = 1.1, I11: Pt = [2 + 0.55 * 3, 0.55 * Math.sqrt(3)]
const fig11 = plane(
  { G: [-2, 0], A: [0, 0], E: [2, 0], C: [2 + r11, 0], J: [2 + 2 * r11, 0], H: H11, I: I11 },
  220,
  { s: 'G-J G-H-I-J', dot: 'A C', c: [{ at: 'A', r: 2 }, { at: 'C', r: r11 }], l: { A: 'n', C: 'n', E: 's', I: 'n', H: 's' } },
)

// III.4: the square inscribed in the circle of radius 4, M the midpoint of the minor arc AD
const fig16 = plane({ A: pol(135, 4), B: pol(45, 4), C: pol(-45, 4), D: pol(-135, 4), M: pol(180, 4), O: [0, 0] }, 150, {
  s: 'A-B-C-D-A', dot: 'M O', c: [{ at: 'O', r: 4 }], l: { O: 'ne', M: 'w' },
})

// III.5: the squares ABCD (side 4) and BPST (side 2), T on BC
const fig17 = plane({ A: [4, 0], B: [0, 0], C: [0, 4], D: [4, 4], T: [0, 2], S: [-2, 2], P: [-2, 0] }, 160, { s: 'A-B-C-D-A B-P-S-T', l: { T: 'ne' } })

const p18 = pyr4(16, 6)
const fig18 = solid({ ...p18, M: mid3(p18.B, p18.C) }, PYR4, 170, { seg: 'A-C B-D V-O V-M O-M', l: { O: 's', M: 'se' } })

export const M45: EnModel = {
  id: 'en-45',
  title: 'Perianu, Testul 13',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 277–282',
  items: [
    { text: 'Numărul divizibil cu $3$ este:', choices: ['$123456$', '$1234$', '$123457$', '$1234567$'], ans: 0 },
    {
      text: 'Într-o urnă sunt $24$ de bile albe, verzi și roșii. Probabilitatea ca, alegând la întâmplare o bilă, aceasta să fie albă este de $\\dfrac{3}{8}$. Numărul bilelor albe din urnă este:',
      choices: ['$8$', '$3$', '$9$', '$15$'], ans: 2,
    },
    { text: 'Ce număr înmulțit cu $-8$ are ca rezultat $-48$?', choices: ['$-6$', '$384$', '$6$', '$-384$'], ans: 2 },
    { text: 'Rezultatul calculului $1{,}234\\cdot0{,}45$ este egal cu:', choices: ['$0{,}5553$', '$5{,}553$', '$55{,}53$', '$555{,}3$'], ans: 0 },
    {
      text: 'Care este modalitatea corectă de efectuare a calculului $\\left(\\sqrt{3}-\\sqrt{2}\\right)^2$?',
      choices: [
        '$\\left(\\sqrt3-\\sqrt2\\right)^2=3-2$', '$\\left(\\sqrt3-\\sqrt2\\right)^2=3-\\sqrt6+2$',
        '$\\left(\\sqrt3-\\sqrt2\\right)^2=5-2\\sqrt6$', '$\\left(\\sqrt3-\\sqrt2\\right)^2=3+2$',
      ],
      ans: 2,
    },
    { text: 'Dintre numerele $3\\sqrt{2}$ și $2\\sqrt{3}$, mai mare este $2\\sqrt{3}$?', choices: ['Adevărat', 'Fals'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare. Care dintre afirmațiile de mai jos este falsă?',
      choices: ['$AD=AB+BC+CD$', '$BC=AD-CD$', '$BD-CD=BC$', '$AB+CD=AD-BC$'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $AC$ și $BD$ sunt concurente în punctul $O$. Care dintre afirmațiile de mai jos este adevărată?',
      choices: ['Unghiurile $AOD$ și $AOB$ sunt complementare.', 'Măsura unghiului $AOC$ este de $0^\\circ$.', 'Unghiurile $AOD$ și $BOC$ sunt opuse la vârf.', 'Unghiurile $AOD$ și $AOC$ sunt adiacente.'],
      ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un segment $BC$. Punctele $M$ și $N$ se află pe mediatoarea segmentului $BC$. Dacă $MB=4$ cm și $NC=8$ cm, atunci valoarea sumei $MC+NB$ este:',
      choices: ['$12$ cm', '$6$ cm', '$32$ cm', '$4$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată, patrulaterul $ABCD$ este paralelogram, punctul $M$ este mijlocul laturii $AB$ și $DM\\cap AC=\\{P\\}$. Valoarea raportului $\\dfrac{PM}{PD}$ este egală cu:',
      choices: ['$0{,}4$', '$0{,}5$', '$1$', '$2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată, cercurile de centre $A$ și $C$ sunt tangente exterior. Segmentele $GE$ și $EJ$ sunt diametre în cercurile date, $A$, $E$, $C$ coliniare și $H$, $E$, $I$ coliniare. Dacă $HG=AG$, atunci măsura unghiului $IJE$ este egală cu:',
      choices: ['$45^\\circ$', '$90^\\circ$', '$60^\\circ$', '$30^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: "Se consideră o prismă dreaptă $ABCA'B'C'$, cu baza triunghi echilateral. Dacă $AB=6$ cm și $BB'=3$ cm, atunci aria laterală a prismei este egală cu:",
      choices: ['$27\\sqrt{2}\\text{ cm}^2$', '$54\\text{ cm}^2$', '$27\\text{ cm}^2$', '$27\\sqrt{3}\\text{ cm}^2$'], ans: 1,
    },

    {
      text: 'Se consideră ecuațiile $a\\cdot x+4=0$ și $6\\cdot x+b=0$, unde $a$ și $b$ sunt numere reale nenule.',
      parts: [
        { pts: 2, text: 'Dacă $3$ este soluție a celor două ecuații, determină numerele reale $a$ și $b$.', ans: '$a=-\\dfrac43$, $b=-18$' },
        { pts: 3, text: 'Știind că cele două ecuații sunt echivalente, calculează produsul numerelor $a$ și $b$.', ans: '$-\\dfrac4a=-\\dfrac b6$, deci $ab=24$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{4}{x-1}+\\dfrac{13-5x}{1-x^2}-\\dfrac{2x+6}{x^2+4x+3}\\right):\\dfrac{1}{x+1}$, unde $x$ este număr real, $x\\neq-1$, $x\\neq-3$ și $x\\neq1$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2+4x+3=(x+1)(x+3)$, pentru orice număr real $x$.', ans: '$x^2+x+3x+3=x(x+1)+3(x+1)=(x+1)(x+3)$' },
        { pts: 3, text: 'Arată că $E(x)=7$, pentru orice număr real $x$, $x\\neq-1$, $x\\neq-3$ și $x\\neq1$.', ans: 'paranteza este $\\dfrac{4(x+1)-(13-5x)-2(x-1)}{(x-1)(x+1)}=\\dfrac{7(x-1)}{(x-1)(x+1)}=\\dfrac{7}{x+1}$, deci $E(x)=7$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+2$.',
      parts: [
        { pts: 2, text: 'Calculează $f\\left(\\sqrt{2}\\right)\\cdot f\\left(-\\sqrt{2}\\right)$.', ans: '$\\left(2+\\sqrt2\\right)\\left(2-\\sqrt2\\right)=2$' },
        { pts: 3, text: 'Determină aria triunghiului determinat de reprezentarea grafică a funcției $f$ și axele de coordonate $xOy$.', ans: '$2$ (vârfurile $O$, $(-2,\\,0)$ și $(0,\\,2)$)' },
      ],
    },
    {
      text: 'În figura alăturată, pătratul $ABCD$ este înscris într-un cerc de centru $O$ și rază $4$ cm. Punctul $M$ este mijlocul arcului mic $AD$.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $MBC$.', ans: '$BC=4\\sqrt2$ cm, $d(M,BC)=4+2\\sqrt2$ cm, aria este $8+8\\sqrt2\\text{ cm}^2$' },
        { pts: 3, text: 'Dacă $BM\\cap AD=\\{T\\}$, atunci arată că triunghiurile $ABT$ și $MBD$ sunt asemenea.', ans: '$\\sphericalangle BAT=\\sphericalangle BMD=90^\\circ$ și $\\sphericalangle ABT=\\sphericalangle MBD$ (arcele $AM$ și $MD$ sunt egale), deci $\\triangle ABT\\sim\\triangle MBD$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, patrulaterele $ABCD$ și $BPST$ sunt pătrate, $T\\in BC$. Dacă $AB=4$ cm și $BP=2$ cm, atunci:',
      parts: [
        { pts: 2, text: 'arată că dreptele $AC$ și $BS$ sunt paralele;', ans: '$\\sphericalangle CAB=\\sphericalangle SBP=45^\\circ$ (diagonale în pătrate), unghiuri corespondente' },
        { pts: 3, text: 'determină aria trapezului $ABSC$.', ans: '$\\mathcal{A}_{ABC}+\\mathcal{A}_{BSC}=8+4=12\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă patrulateră regulată $VABCD$, cu $AB=16$ cm, $AC\\cap BD=\\{O\\}$, aria totală de $576\\text{ cm}^2$ și punctul $M$, mijlocul muchiei $BC$.',
      parts: [
        { pts: 2, text: 'Arată că $VM=10$ cm.', ans: '$\\mathcal{A}_l=576-256=320\\text{ cm}^2=4\\cdot\\dfrac{16\\cdot VM}{2}$, deci $VM=10$ cm' },
        { pts: 3, text: 'Calculează sinusul unghiului dintre dreptele $BD$ și $VM$.', ans: '$\\dfrac{\\sqrt{17}}{5}$ ($MN\\parallel BD$, $N$ mijlocul lui $CD$; în $\\triangle VMN$: $VM=VN=10$, $MN=8\\sqrt2$, $\\cos=\\dfrac{2\\sqrt2}{5}$)' },
      ],
      fig: fig18,
    },
  ],
}
