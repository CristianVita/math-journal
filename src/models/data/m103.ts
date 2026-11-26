// Testul 72 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 224–226; every answer here is computed and checked with the book's answers, p. 294).
import type { Fig, Pt } from '../figure'
import type { EnModel } from '../types'
import { along, foot, meet, plane, solid } from '../figure'
import { box, BOX, graph } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [5, 0], C: [7, 0], D: [12, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ A: [0, 0], B: [10, 0], C: [10, 4], D: [4, 4] }, 150, {
  s: 'A-B-C-D-A', ra: ['ABC', 'BCD'], ang: ['BAD', 'ADC'],
  t: [{ at: [1.6, 0.4], s: 'x°', size: 10 }, { at: [4.7, 3.25], s: '(3x)°', anchor: 'start', size: 9 }],
})
const fig9 = plane({ A: [0, 0], B: [60, 0], C: [60, 60], D: [0, 60], E: [25, 0], F: [25, 60] }, 110, { s: 'A-B-C-D-A E-F' })
const A10: Pt = [3, 3 * s3], C10: Pt = [6, 0]
const fig10 = plane({ A: A10, B: [0, 0], C: C10, M: along(A10, C10, 1 / 3), N: [4, 0] }, 120, { s: 'A-B-C-A M-N', l: { M: 'e', N: 's' } })
// the track: the rectangle ABCD with a half circle on AD and one on BC
const track = plane({ A: [0, 0], B: [100, 0], C: [100, 70], D: [0, 70], L: [-36, 35], R: [136, 35] }, 170, { s: 'A-B-C-D-A', l: { L: '', R: '' } })
const r11 = Math.abs(track.p.A[1] - track.p.D[1]) / 2
const fig11: Fig = {
  ...track,
  path: [
    { d: `M${track.p.B[0]} ${track.p.B[1]} A${r11} ${r11} 0 0 0 ${track.p.C[0]} ${track.p.C[1]}` },
    { d: `M${track.p.D[0]} ${track.p.D[1]} A${r11} ${r11} 0 0 0 ${track.p.A[0]} ${track.p.A[1]}` },
  ],
}

const fig15 = graph({ A: [s3, 0], B: [0, s3], C: [0, -3], F1: [-1, 1 + s3], F2: [3.6, s3 - 3.6], G1: [-0.25, -0.25 * s3 - 3], G2: [2.7, 2.7 * s3 - 3] }, 130, [-1.5, 4], [-3.6, 3.2], {
  s: 'F1-F2 G1-G2', dot: 'A B C', l: { F1: '', F2: '', G1: '', G2: '', A: 'ne', B: 'w', C: 'w' },
})
const A16: Pt = [6, 8], B16: Pt = [0, 0], C16: Pt = [15, 0], D16 = along(A16, B16, 0.4), E16 = along(A16, C16, 0.4), F16: Pt = [6, 0], G16: Pt = [9, 0]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, E: E16, F: F16, G: G16, R: meet(D16, G16, E16, F16) }, 150, { s: 'A-B-C-A D-E D-G E-F', l: { R: 'e' } })
const A17: Pt = [0, 0], B17: Pt = [0, 15], C17: Pt = [20, 0], D17 = foot(A17, B17, C17)
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, E: [0, D17[1]] }, 140, { s: 'A-B-C-A A-D-E', ra: ['BAC', 'ADB'] })
const fig18 = solid(box(2, 2, 4), BOX, 90)

export const M103: EnModel = {
  id: 'en-103',
  title: 'Paralela 45, Testul 72',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 224–226',
  items: [
    { text: 'Rezultatul calculului $(-15+1):(-6-1)$ este:', choices: ['$-2$', '$2$', '$3$', '$1$'], ans: 1 },
    { text: 'Numărul natural $\\overline{xy}$ pentru care $\\dfrac{x+y}{x}=2\\dfrac{2}{3}$ este:', choices: ['$53$', '$35$', '$81$', '$18$'], ans: 1 },
    { text: 'Suma tuturor numerelor întregi din intervalul $[-3,\\,4)$ este:', choices: ['$4$', '$-6$', '$0$', '$16$'], ans: 2 },
    {
      text: 'Soluția inecuației $\\dfrac{-4}{2x+1}\\ge0$ este:',
      choices: ['$\\left(-\\infty,\\,-\\dfrac{1}{2}\\right]$', '$\\left(-\\dfrac{1}{2},\\,\\infty\\right)$', '$\\left(-\\infty,\\,-\\dfrac{1}{2}\\right)$', '$\\left[-\\dfrac{1}{2},\\,\\infty\\right)$'], ans: 2,
    },
    {
      text: 'Patru elevi, Alin, Bogdan, Cristi și Diana, au avut de calculat media aritmetică și media geometrică a numerelor $a=2-\\sqrt{3}$, $b=2+\\sqrt{3}$ și de ordonat crescător numerele $a$, $b$, $m_a$ și $m_g$. Rezultatele lor sunt înregistrate mai jos.\n\n| Alin | Bogdan | Cristi | Diana |\n|---|---|---|---|\n| $a<b<m_g<m_a$ | $a<m_g<m_a<b$ | $m_g<a<b<m_a$ | $b<m_a<m_g<a$ |\n\nDintre cei patru elevi, cel care a scris ordinea corectă este:',
      choices: ['Diana', 'Alin', 'Bogdan', 'Cristi'], ans: 2,
    },
    {
      text: 'Bacul de la Galați poate transporta la o cursă fie $20$ de automobile, fie $12$ camioane. Când începe îmbarcarea, în fața lui Alin (care conduce un automobil) sunt $9$ automobile și $6$ camioane. Alin afirmă că va avea loc în prima cursă. Afirmația lui Alin este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine, iar $AC=BD$. Dacă $AC=7$ cm și $CD=5$ cm, atunci lungimea segmentului $BC$ este egală cu:',
      choices: ['$2$ cm', '$12$ cm', '$6$ cm', '$1$ cm'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez dreptunghic cu $\\sphericalangle B=\\sphericalangle C=90^\\circ$, $\\sphericalangle A=x^\\circ$ și $\\sphericalangle D=(3x)^\\circ$. Valoarea lui $x$ este:',
      choices: ['$45$', '$90$', '$135$', '$60$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentată o suprafață pătratică $ABCD$, obținută prin alăturarea a două suprafețe dreptunghiulare $AEFD$ și $FEBC$, având ariile egale cu $1500\\text{ m}^2$, respectiv $2100\\text{ m}^2$. Lungimea segmentului $AE$ este egală cu:',
      choices: ['$15$ m', '$50$ m', '$25$ m', '$60$ m'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi echilateral $ABC$ cu latura de $6$ cm. Punctele $M$ și $N$ aparțin laturilor $AC$, respectiv $BC$, astfel încât $AM=CN=2$ cm. Măsura unghiului $CMN$ este:',
      choices: ['$15^\\circ$', '$30^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 1, fig: fig10,
    },
    {
      text: 'O pistă de atletism are forma din figura alăturată. Dreptunghiul $ABCD$, cu $AB=100$ m și $AD=70$ m, are la capete două semicercuri. Cea mai bună aproximare a distanței parcurse de un atlet care pleacă din $A$ și înconjoară complet pista este de: (Se va considera valoarea aproximativă $\\pi\\approx\\dfrac{22}{7}$.)',
      choices: ['$420$ m', '$490$ m', '$485$ m', '$455$ m'], ans: 0, fig: fig11,
    },
    {
      text: 'Apa aflată într-un recipient plin, în formă de con circular drept cu înălțimea de $12$ cm și raza bazei de $5$ cm, se toarnă într-un vas cilindric cu înălțimea de $6$ cm și raza bazei de $10$ cm. Înălțimea la care se ridică apa în cilindru este:',
      choices: ['$1$ cm', '$0{,}5$ cm', '$2$ cm', '$4$ cm'], ans: 0,
    },

    {
      text: 'Bunica își așteaptă nepoții cu pere și caise. Numărul perelor este cu trei mai mare decât dublul numărului caiselor. Fiecare nepot a primit câte o caisă și câte trei pere și au rămas patru caise și patru pere.',
      parts: [
        { pts: 2, text: 'Este posibil ca bunica să aibă exact $16$ pere? Justifică răspunsul.', ans: 'Nu: numărul perelor, $2c+3$, este impar, iar $16$ este par' },
        { pts: 3, text: 'Determină numărul nepoților bunicii.', ans: 'Caisele: $c=n+4$, perele: $p=3n+4=2c+3=2n+11$, deci $n=7$ nepoți' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x^2+6}{x^2+6x+9}-\\dfrac{x}{x+3}\\right):\\left(\\dfrac{1}{x-3}+\\dfrac{5}{9-x^2}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,2,\\,3\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{3(3-x)}{x+3}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,2,\\,3\\}$.', ans: '$\\dfrac{-3(x-2)}{(x+3)^2}:\\dfrac{x-2}{(x-3)(x+3)}=\\dfrac{-3(x-2)}{(x+3)^2}\\cdot\\dfrac{(x-3)(x+3)}{x-2}=\\dfrac{3(3-x)}{x+3}$' },
        { pts: 3, text: 'Demonstrează că numărul $\\sqrt{E(\\sqrt{2})\\cdot E(-\\sqrt{2})}$ aparține mulțimii numerelor naturale.', ans: '$E(\\sqrt{2})\\cdot E(-\\sqrt{2})=\\dfrac{9(3-\\sqrt{2})(3+\\sqrt{2})}{(\\sqrt{2}+3)(3-\\sqrt{2})}=9$, iar $\\sqrt{9}=3\\in\\mathbb{N}$' },
      ],
    },
    {
      text: 'Se consideră funcțiile $f,\\,g:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-x+a$, $g(x)=bx-3$, unde $a,\\,b\\in\\mathbb{R}$, și sistemul de axe ortogonale $xOy$. Reprezentările grafice ale celor două funcții, $f$ și $g$, se intersectează în punctul $A(\\sqrt{3},\\,0)$.',
      parts: [
        { pts: 2, text: 'Arată că $a=b=\\sqrt{3}$.', ans: '$f(\\sqrt{3})=0$ dă $a=\\sqrt{3}$; $g(\\sqrt{3})=0$ dă $b\\sqrt{3}=3$, deci $b=\\sqrt{3}$' },
        { pts: 3, text: 'Știind că $B$ și $C$ sunt punctele de intersecție a reprezentărilor grafice ale funcțiilor $f$, respectiv $g$, cu axa $Oy$ a sistemului de axe ortogonale $xOy$, determină măsura unghiului $BAC$.', ans: '$B(0,\\,\\sqrt{3})$, $C(0,\\,-3)$: $\\operatorname{tg}\\sphericalangle BAO=1$, deci $\\sphericalangle BAO=45^\\circ$; $\\operatorname{tg}\\sphericalangle CAO=\\sqrt{3}$, deci $\\sphericalangle CAO=60^\\circ$; $\\sphericalangle BAC=105^\\circ$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ cu $AB=10$ cm și $BC=15$ cm. Se consideră punctul $D$ pe latura $AB$, cu $AD=4$ cm. Construim $DG$ paralelă cu $AC$, $G\\in BC$, $DE$ paralelă cu $BC$, $E\\in AC$ și $EF$ paralelă cu $AB$, $F\\in BC$. Dreptele $DG$ și $EF$ se intersectează în punctul $R$.',
      parts: [
        { pts: 2, text: 'Arată că $BF=GC=6$ cm.', ans: '$\\triangle ADE\\sim\\triangle ABC$, deci $DE=\\dfrac{4\\cdot15}{10}=6$ cm; $BDEF$ și $GCED$ sunt paralelograme, deci $BF=GC=DE=6$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $ER$.', ans: '$FG=15-12=3$ cm și $\\triangle FRG\\sim\\triangle ERD$, deci $ER=2\\cdot FR$; cum $EF=BD=6$ cm, $ER=\\dfrac{2}{3}\\cdot6=4$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$ cu $AB=15$ cm, $AC=20$ cm și măsura unghiului $BAC$ de $90^\\circ$. Construim $AD$ perpendiculară pe $BC$, $D\\in BC$ și $DE$ paralelă cu $AC$, $E\\in AB$.',
      parts: [
        { pts: 2, text: 'Arată că $AD=12$ cm.', ans: '$BC=25$ cm și $AD=\\dfrac{AB\\cdot AC}{BC}=\\dfrac{15\\cdot20}{25}=12$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $DE$.', ans: '$BD=\\dfrac{AB^2}{BC}=9$ cm și $\\triangle BED\\sim\\triangle BAC$, deci $\\dfrac{DE}{AC}=\\dfrac{BD}{BC}$, adică $\\dfrac{DE}{20}=\\dfrac{9}{25}$ și $DE=7{,}2$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "Un garaj are forma paralelipipedului dreptunghic $ABCDA'B'C'D'$ din figura alăturată. Dimensiunile paralelipipedului sunt $AB=AD=2$ m, iar $AA'=4$ m.",
      parts: [
        { pts: 2, text: 'Arată că o vergea cu lungimea de $5$ m nu poate încăpea în întregime în garaj, fără a fi ruptă.', ans: "Cea mai mare lungime o are diagonala: $DB'=\\sqrt{2^2+2^2+4^2}=\\sqrt{24}$ m $<\\sqrt{25}=5$ m" },
        { pts: 3, text: "Determină măsura unghiului format de dreptele $AB$ și $B'D'$.", ans: "$B'D'\\parallel BD$, deci $\\sphericalangle(AB,\\,B'D')=\\sphericalangle ABD=45^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
