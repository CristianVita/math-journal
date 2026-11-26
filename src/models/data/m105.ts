// Testul 74 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 228–230; every answer here is computed and checked with the book's answers, p. 295).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [1, 0], M: [3, 0], C: [5, 0] }, 170, { s: 'A-C', dot: 'A B M C', l: { A: 'n', B: 'n', M: 'n', C: 'n' } })
// d1 and d2 parallel, the secants s1 and s2 meeting in M above them
const S1 = pol(-120, 5.8), S2 = pol(-70, 5.9), L1: Pt = [-4, -2], R1: Pt = [4, -2], L2: Pt = [-4, -3.5], R2: Pt = [4, -3.5]
const fig8 = plane({ M: [0, 0], S1, S2, L1, R1, L2, R2, X1: meet([0, 0], S1, L2, R2), X2: meet([0, 0], S2, L1, R1) }, 150, {
  s: 'M-S1 M-S2 L1-R1 L2-R2', ang: ['S1MS2', 'MX1L2', 'MX2R1'],
  l: { M: 'n', S1: '', S2: '', L1: '', R1: '', L2: '', R2: '', X1: '', X2: '' },
  t: [
    { at: [-0.45, -1.55], s: '50°', anchor: 'start', size: 9 }, { at: [-3.4, -3.1], s: '120°', size: 9 }, { at: [1.3, -1.6], s: 'x', italic: true, size: 10 },
    { at: [3.4, -1.7], s: 'd₁', italic: true }, { at: [3.4, -3.2], s: 'd₂', italic: true }, { at: [-3.4, -5], s: 's₁', italic: true }, { at: [2.2, -5.4], s: 's₂', italic: true },
  ],
})
const fig9 = plane({ A: [0, 4], B: [6, 4], C: [6, 0], D: [0, 0], N: [4, 4], M: [6, 6] }, 140, { s: 'A-B-C-D-A D-M B-M', l: { M: 'ne' } })
const fig10 = plane({ A: [10, 10 * s3], B: [30, 10 * s3], C: [40, 0], D: [20, 0], E: [0, 0] }, 150, { s: 'A-B-C-E-A A-D' })
// the circle through A and B tangent to MA and MB: M below, O above
const fig11 = plane({ M: [0, 0], A: [-3, 3 * s3], B: [3, 3 * s3], O: [0, 4 * s3], P: [-4.2, 4.2 * s3], Q: [4.2, 4.2 * s3] }, 110, {
  s: 'M-P M-Q A-O-B A-B', c: [{ at: 'O', r: 2 * s3 }], dot: 'O', l: { P: '', Q: '', O: 'n' },
})

const fig15 = graph({ A: [6, 0], B: [0, 3], L1: [-1, 3.5], L2: [7, -0.5] }, 140, [-1.5, 7.5], [-1, 5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 's', B: 'ne' } })
const A16: Pt = [0, 0], B16 = pol(-108, 10), C16 = pol(-72, 10), D16 = pol(-36, 10), B2: Pt = [B16[0] + D16[0] - C16[0], B16[1] + D16[1] - C16[1]]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, E: meet(B16, B2, A16, D16), F: meet(B16, B2, A16, C16) }, 120, { s: 'A-B-C-D-A A-C B-E' })
const fig17 = plane({ A: [6, 6 * s3], B: [0, 0], C: [12, 0], D: [18, 0] }, 150, { s: 'A-B-D-A A-C' })
const fig18 = solid({ ...box(12, 8, 6), M: [6, 0, 0] }, BOX, 140, { seg: "M-C' M-D'" })

export const M105: EnModel = {
  id: 'en-105',
  title: 'Paralela 45, Testul 74',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 228–230',
  items: [
    { text: 'Numărul $\\overline{ab}$ care verifică $\\overline{ab}=72+\\overline{ba}$ este:', choices: ['$19$', '$91$', '$36$', '$63$'], ans: 1 },
    { text: 'Dacă $\\dfrac{a}{3}=0{,}5$, atunci $4\\cdot a$ este egal cu:', choices: ['$6$', '$2$', '$0{,}6$', '$1{,}8$'], ans: 0 },
    {
      text: 'Suma numerelor raționale din mulțimea $\\left\\{3^{-1};\\,\\pi;\\,\\sqrt{2{,}(7)};\\,5^0;\\,\\dfrac{1}{\\sqrt{2}}\\right\\}$ este:',
      choices: ['$\\pi+\\dfrac{\\sqrt{2}}{2}$', '$1$', '$3$', '$2$'], ans: 2,
    },
    {
      text: 'Numerele raționale $\\dfrac{5}{6}$, $-\\dfrac{1}{3}$ și $x$ au media aritmetică egală cu $\\dfrac{1}{2}$. Valoarea lui $x$ este:',
      choices: ['$0$', '$-\\dfrac{1}{2}$', '$\\dfrac{1}{2}$', '$1$'], ans: 3,
    },
    {
      text: 'Partea întreagă a numărului $x=\\sqrt{18}-\\dfrac{6}{\\sqrt{2}}-\\left|1-\\sqrt{2}\\right|$ este egală cu:',
      choices: ['$0$', '$-2$', '$-1$', '$\\sqrt{2}-1$'], ans: 2,
    },
    {
      text: 'Andra a scris în caietul de teme că $(-2,\\,5)\\cap[5,\\,7)=\\varnothing$. Egalitatea scrisă de Andra este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, iar $4AB=BC$. Punctul $M$ este mijlocul segmentului $BC$. Valoarea raportului $\\dfrac{AM}{BC}$ este egală cu:',
      choices: ['$\\dfrac{3}{4}$', '$\\dfrac{3}{5}$', '$\\dfrac{4}{5}$', '$\\dfrac{4}{3}$'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $d_1$ și $d_2$ sunt paralele, iar $s_1$ și $s_2$ sunt două secante concurente în $M$. Măsurile a trei dintre unghiurile care se formează sunt marcate în figură. Valoarea lui $x$ este egală cu:',
      choices: ['$120^\\circ$', '$70^\\circ$', '$110^\\circ$', '$90^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$. Bisectoarea unghiului $ADC$ intersectează dreptele $AB$ și $BC$ în punctele $N$, respectiv $M$. Dacă $AD=4$ cm și $MB=2$ cm, atunci aria dreptunghiului $ABCD$ este egală cu:',
      choices: ['$8\\text{ cm}^2$', '$24\\text{ cm}^2$', '$16\\text{ cm}^2$', '$20\\text{ cm}^2$'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată sunt reprezentate rombul $ABCD$ cu $AB=BD=20$ cm și triunghiul echilateral $ADE$, exterior rombului. Distanța de la punctul $E$ la dreapta $BC$ este egală cu:',
      choices: ['$20\\sqrt{3}$ cm', '$10\\sqrt{3}$ cm', '$20$ cm', '$15\\sqrt{3}$ cm'], ans: 0, fig: fig10,
    },
    {
      text: 'Prin punctele $A$ și $B$ ale triunghiului echilateral $MAB$ se construiește cercul tangent laturilor $MA$ și $MB$, ca în figura alăturată. Măsura unghiului $AOB$ este egală cu:',
      choices: ['$100^\\circ$', '$120^\\circ$', '$90^\\circ$', '$60^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'Volumul cubului care are aria totală egală cu $30\\text{ cm}^2$ este egal cu:',
      choices: ['$\\sqrt{75}\\text{ cm}^3$', '$125\\text{ cm}^3$', '$25\\text{ cm}^3$', '$5\\sqrt{5}\\text{ cm}^3$'], ans: 3,
    },

    {
      text: 'Într-o sală de clasă, dacă stă câte un copil în fiecare bancă, rămân $12$ copii în picioare. Dacă stau câte doi copii în fiecare bancă, atunci în ultima bancă rămâne un singur copil.',
      parts: [
        { pts: 2, text: 'Este posibil să fie $14$ bănci? Justifică răspunsul.', ans: 'Nu: ar fi $14+12=26$ de copii, dar și $2\\cdot13+1=27$ de copii' },
        { pts: 3, text: 'Determină numărul de copii.', ans: 'Cu $b$ bănci, $c=b+12$ și $c=2b-1$, deci $b=13$ și $c=25$ de copii' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{(x^2+4x+3)(x^2+3x+2)}{x^2+5x+6}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2+4x+3=(x+1)(x+3)$, pentru orice $x\\in\\mathbb{R}$.', ans: '$x^2+x+3x+3=x(x+1)+3(x+1)=(x+1)(x+3)$' },
        { pts: 3, text: 'Demonstrează că $E(x)\\ge0$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2\\}$.', ans: '$E(x)=\\dfrac{(x+1)(x+3)(x+1)(x+2)}{(x+2)(x+3)}=(x+1)^2\\ge0$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-\\dfrac{x}{2}+3$.',
      parts: [
        { pts: 2, text: 'Află numărul real $m$, dacă punctul $P(m,\\,m)$ aparține reprezentării grafice a funcției $f$.', ans: '$f(m)=m$, adică $-\\dfrac{m}{2}+3=m$, deci $m=2$' },
        { pts: 3, text: 'Știind că $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, determină tangenta unghiului format de reprezentarea grafică a funcției $f$ cu axa ordonatelor.', ans: '$A(6,\\,0)$, $B(0,\\,3)$, deci $\\operatorname{tg}\\sphericalangle ABO=\\dfrac{OA}{OB}=2$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată sunt reprezentate două triunghiuri isoscele $ABC$ și $ACD$ cu interioarele disjuncte și $AB=AC=AD$. Unghiurile $BAC$ și $CAD$ au măsurile egale cu $36^\\circ$, iar paralela prin $B$ la $CD$ intersectează dreptele $AC$ și $AD$ în punctele $F$, respectiv $E$.',
      parts: [
        { pts: 2, text: 'Demonstrează că dreptele $BD$ și $AC$ sunt perpendiculare.', ans: 'Triunghiul $ABD$ este isoscel cu baza $BD$, iar $AC$ este bisectoarea unghiului $BAD$, deci $AC\\perp BD$' },
        { pts: 3, text: 'Arată că triunghiul $ABF$ este isoscel.', ans: '$BE\\parallel CD$, deci $\\sphericalangle AEB=\\sphericalangle ADC=72^\\circ$ și $\\sphericalangle ABE=180^\\circ-72^\\circ-72^\\circ=36^\\circ=\\sphericalangle BAF$, deci $\\triangle ABF$ este isoscel' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul echilateral $ABC$, cu $AB=12$ cm, iar punctul $D$ aparține prelungirii laturii $BC$, astfel încât $CD=6$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $AD=6\\sqrt{7}$ cm.', ans: 'Fie $M$ mijlocul lui $BC$: $AM=6\\sqrt{3}$ cm, $MD=12$ cm, deci $AD=\\sqrt{AM^2+MD^2}=\\sqrt{252}=6\\sqrt{7}$ cm' },
        { pts: 3, text: 'Demonstrează că aria triunghiului $ACD$ este mai mică decât $32\\text{ cm}^2$.', ans: '$\\mathcal{A}_{ACD}=\\dfrac{CD\\cdot AM}{2}=18\\sqrt{3}\\text{ cm}^2<18\\cdot1{,}75=31{,}5<32\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: "Fie $ABCDA'B'C'D'$ un paralelipiped dreptunghic cu $AB=12$ cm, $BC=8$ cm și $CC'=6$ cm. Punctul $M$ este mijlocul segmentului $AB$ (figura alăturată).",
      parts: [
        { pts: 2, text: "Arată că triunghiul $MC'D'$ este isoscel.", ans: "$MC=MD=10$ cm, deci $MC'=MD'=\\sqrt{100+36}=2\\sqrt{34}$ cm" },
        { pts: 3, text: "Determină distanța de la punctul $C$ la planul $(MC'D')$.", ans: "$AB\\parallel C'D'$, deci $(MC'D')=(ABC'D')$; cu $CP\\perp BC'$, $P\\in BC'$, din reciproca teoremei celor trei perpendiculare $CP\\perp(MC'D')$, iar $CP=\\dfrac{CC'\\cdot BC}{BC'}=\\dfrac{6\\cdot8}{10}=4{,}8$ cm" },
      ],
      fig: fig18,
    },
  ],
}
