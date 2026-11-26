// Testul 75 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 231–232; every answer here is computed and checked with the book's answers, pp. 295–296).
import type { Fig, Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, mid, plane } from '../figure'
import { graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [2, 0], B: [4, 0], N: [5, 0], C: [10, 0] }, 170, { s: 'A-C', dot: 'A M B N C', l: { A: 'n', M: 'n', B: 'n', N: 'n', C: 'n' } })
// the parallelogram and the bisectors of the angles A and B meeting in M; AB = 2AD puts M on DC, as in the book
const u8 = Math.hypot(1.5, 3)
const A8: Pt = [1.5, 3], B8: Pt = [1.5 + 2 * u8, 3], D8: Pt = [0, 0], C8: Pt = [2 * u8, 0]
const M8 = meet(A8, [A8[0] + 1 - 1.5 / u8, A8[1] - 3 / u8], B8, [B8[0] - 1 - 1.5 / u8, B8[1] - 3 / u8])
const fig8 = plane({ A: A8, B: B8, C: C8, D: D8, M: M8 }, 150, { s: 'A-B-C-D-A A-M-B', ang: ['AMB'], l: { M: 's' }, t: [{ at: [M8[0] - 0.25, M8[1] + 1.05], s: 'x°', anchor: 'start', size: 9 }] })
const fig9 = plane({ A: pol(0, 12), B: pol(150, 12), C: pol(210, 12) }, 110, { s: 'A-B-C-A' })
const fig10 = plane({ A: [0, 20], B: [30, 20], C: [30, 0], D: [0, 0] }, 120, { s: 'A-B-C-D-A' })
const P5 = { A: pol(90, 3), B: pol(18, 3), C: pol(-54, 3), D: pol(-126, 3), E: pol(162, 3) }
const fig11 = plane({ ...P5, O: [0, 0], P: meet(P5.A, P5.C, P5.B, P5.D) }, 110, { s: 'A-C B-D', c: [{ at: 'O', r: 3 }], l: { O: '', P: 'e' } })

const fig15 = graph({}, 130, [-2, 4], [-4, 2.5])
const B16: Pt = [0, 0], C16: Pt = [6.18, 0], A16: Pt = [3.09, 9.51], D16: Pt = [16.18, 0], Q16 = mid(A16, B16)
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, Q: Q16, I: meet(A16, C16, Q16, D16) }, 170, { s: 'A-B-D-A A-C Q-D', l: { I: 'ne' } })
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [6, 6 * s3], D: [0, 6 * s3], E: [0, -2 * s3] }, 90, { s: 'A-B-C-D-A B-D A-E-B', ra: ['DBE'] })
// the cylinder, drawn by hand, and the insect's path from A to C over the front of it
const fig18: Fig = {
  w: 110, h: 180,
  p: { D: [10, 18], C: [100, 18], A: [10, 160], B: [100, 160] },
  l: { D: 'w', C: 'e', A: 'w', B: 'e' },
  s: 'A-D B-C',
  e: [{ at: [55, 18], rx: 45, ry: 11 }, { at: [55, 160], rx: 45, ry: 11, back: true }],
  path: [{ d: 'M10 160 C 40 185 100 120 100 18' }],
}

export const M106: EnModel = {
  id: 'en-106',
  title: 'Paralela 45, Testul 75',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 231–232',
  items: [
    {
      text: 'Dacă $x\\in\\{0,\\,3,\\,4,\\,7\\}$, iar numerele $120$ și $\\overline{20x}$ sunt prime între ele, atunci valoarea lui $x$ este:',
      choices: ['$0$', '$7$', '$3$', '$4$'], ans: 2,
    },
    {
      text: 'Într-o cutie sunt $8$ bile albe și $n$ bile roșii. Dacă probabilitatea de a extrage din cutie o bilă roșie este $\\dfrac{3}{5}$, atunci numărul $n$ este egal cu:',
      choices: ['$10$', '$8$', '$12$', '$6$'], ans: 2,
    },
    { text: 'Numerele întregi $-3$, $x$, $y$, $z$, $t$, $2$ sunt scrise în ordine crescătoare. Valoarea sumei $x+y+z+t$ este:', choices: ['$-1$', '$0$', '$1$', '$-2$'], ans: 3 },
    {
      text: 'Fie $x=\\left(\\dfrac{2}{3}-\\dfrac{1}{2}:\\dfrac{1}{3}\\right)\\cdot1\\dfrac{2}{5}$. Valoarea absolută a numărului $x$ este:',
      choices: ['$-\\dfrac{7}{6}$', '$\\dfrac{7}{6}$', '$-2$', '$\\dfrac{7}{10}$'], ans: 1,
    },
    {
      text: 'Media geometrică a numerelor $x=\\left|1-\\sqrt{5}\\right|$ și $y=\\dfrac{\\left(1+\\sqrt{5}\\right)^2}{2}-2$ este egală cu:',
      choices: ['$2$', '$\\sqrt{5}$', '$-1$', '$1+\\sqrt{5}$'], ans: 0,
    },
    {
      text: 'Tudor spune că cel mai mare număr întreg din intervalul $(-2,\\,3)$ este $3$. Afirmația lui Tudor este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, și $AB<BC$. Dacă punctul $M$ este mijlocul segmentului $AB$, punctul $N$ este mijlocul segmentului $AC$, $AN=5$ cm și $MN=3$ cm, atunci lungimea segmentului $MC$ este egală cu:',
      choices: ['$6$ cm', '$1$ cm', '$8$ cm', '$10$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un paralelogram, iar $M$ este punctul de intersecție a bisectoarelor unghiurilor $DAB$ și $ABC$. Măsura unghiului $AMB$ este $x^\\circ$. Valoarea lui $x$ este:',
      choices: ['$90$', '$120$', '$50$', '$180$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul ascuțitunghic isoscel $ABC$, cu $AB=AC=12$ m și aria egală cu $36\\sqrt{3}\\text{ m}^2$. Distanța dintre punctele $B$ și $C$ este egală cu:',
      choices: ['$24$ m', '$6\\sqrt{3}$ m', '$18$ m', '$12$ m'], ans: 3, fig: fig9,
    },
    {
      text: 'O coală de hârtie are forma dreptunghiului $ABCD$ din figura alăturată, cu $AB=30$ cm și $AD=20$ cm. O astfel de coală are masa de $0{,}8$ g. Suprafața ce poate fi acoperită în întregime, fără suprapuneri, cu foile dintr-un pachet care cântărește $500$ g este:',
      choices: ['$40\\text{ m}^2$', '$37{,}5\\text{ m}^2$', '$38\\text{ m}^2$', '$32\\text{ m}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'Cinci puncte $A$, $B$, $C$, $D$ și $E$ se află pe un cerc, în această ordine, ca în figura alăturată. Dacă arcele mici $\\overset{\\frown}{AB}$, $\\overset{\\frown}{BC}$, $\\overset{\\frown}{CD}$, $\\overset{\\frown}{DE}$ și $\\overset{\\frown}{EA}$ au măsuri egale și $P$ este punctul de intersecție a dreptelor $AC$ și $BD$, atunci măsura unghiului $APB$ este egală cu:',
      choices: ['$108^\\circ$', '$36^\\circ$', '$72^\\circ$', '$90^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'Într-un vas metalic, având formă de prismă patrulateră regulată cu latura bazei de $20$ cm și înălțimea de $30$ cm, se află $6\\ \\ell$ de apă. Dacă introducem în vas o piatră cubică cu latura de $10$ cm, atunci nivelul apei crește cu:',
      choices: ['$1{,}25$ cm', '$2{,}5$ cm', '$2$ cm', '$1$ cm'], ans: 1,
    },

    {
      text: 'Pe o parte a unei alei sunt plantați tei din $10$ m în $10$ m; în ambele capete ale aleii se află câte un tei. Între oricare doi tei consecutivi sunt plantate câte $5$ panseluțe. Numărul panseluțelor este cu $27$ mai mare decât numărul teilor.',
      parts: [
        { pts: 2, text: 'Este posibil să fie $29$ de panseluțe? Justifică răspunsul.', ans: 'Nu: numărul panseluțelor este multiplu de $5$' },
        { pts: 3, text: 'Determină lungimea aleii.', ans: 'Cu $t$ tei, $p=27+t$ și $p=5(t-1)$, deci $t=8$, iar aleea are $7\\cdot10=70$ m' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x^3+x^2-x-1}{x(x+2)+1}$, unde $x\\in\\mathbb{R}\\setminus\\{-1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x(x+2)+1=(x+1)^2$, pentru orice număr real $x$.', ans: '$x^2+2x+1=(x+1)^2$' },
        { pts: 3, text: 'Demonstrează că $E(n)$ este număr natural, pentru orice număr natural nenul $n$.', ans: '$x^3+x^2-x-1=(x+1)^2(x-1)$, deci $E(x)=x-1$ și $E(n)=n-1\\in\\mathbb{N}$, pentru $n\\in\\mathbb{N}^*$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x\\sqrt{3}-3$.',
      parts: [
        { pts: 2, text: 'Reprezintă graficul funcției $f$ în sistemul de axe ortogonale $xOy$ alăturat.', ans: 'Dreapta care trece prin $(0,\\,-3)$ și $(\\sqrt{3},\\,0)$' },
        { pts: 3, text: 'Află valorile numerelor raționale $a$ și $b$, știind că punctul $P\\left(a,\\,b+\\sqrt{12}\\right)$ aparține reprezentării grafice a funcției $f$.', ans: '$a\\sqrt{3}-3=b+2\\sqrt{3}$, adică $\\sqrt{3}(a-2)=b+3$; cu $a,\\,b\\in\\mathbb{Q}$, $a=2$ și $b=-3$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi isoscel $ABC$ cu baza $BC$ și $\\sphericalangle BAC=36^\\circ$. Pe dreapta $BC$ alegem punctul $D$, astfel încât $AC$ este bisectoarea unghiului $BAD$. Punctul $Q$ este mijlocul lui $AB$, iar $I$ este punctul de intersecție a dreptelor $AC$ și $QD$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $BAD$ este isoscel.', ans: '$\\sphericalangle BAD=72^\\circ=\\sphericalangle ABC$, deci triunghiul $ABD$ este isoscel, cu $AD=BD$' },
        { pts: 3, text: 'Demonstrează că $I$ este centrul cercului înscris în triunghiul $ABD$.', ans: 'În $\\triangle ABD$ isoscel cu $AD=BD$, mediana $DQ$ este și bisectoarea unghiului $ADB$; $I$ este intersecția a două bisectoare, deci centrul cercului înscris' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat dreptunghiul $ABCD$. Perpendiculara în $B$ pe $BD$ intersectează prelungirea laturii $AD$ în punctul $E$. Lungimea laturii $AB$ este de $6$ cm, iar lungimea segmentului $BE$ este de $4\\sqrt{3}$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $AE=2\\sqrt{3}$ cm.', ans: '$AE=\\sqrt{BE^2-BA^2}=\\sqrt{48-36}=2\\sqrt{3}$ cm' },
        { pts: 3, text: 'Demonstrează că perimetrul dreptunghiului $ABCD$ este mai mare de $30$ cm.', ans: 'În $\\triangle DBE$, $AB^2=AE\\cdot AD$, deci $AD=\\dfrac{36}{2\\sqrt{3}}=6\\sqrt{3}$ cm și $\\mathcal{P}_{ABCD}=12+12\\sqrt{3}>12+12\\cdot1{,}5=30$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'Sorin are un recipient cilindric cu diametrul bazei de $7$ cm și înălțimea de $12$ cm, reprezentat în figura alăturată.',
      parts: [
        { pts: 2, text: 'Determină până la ce înălțime se ridică apa atunci când turnăm $154$ ml de apă în vas. (Se va utiliza valoarea aproximativă $\\pi=\\dfrac{22}{7}$.)', ans: '$\\dfrac{22}{7}\\cdot\\left(\\dfrac{7}{2}\\right)^2\\cdot h=154$, adică $38{,}5\\,h=154$, deci $h=4$ cm' },
        { pts: 3, text: 'O insectă parcurge drumul minim dintre punctele $A$ și $C$ pe suprafața laterală a cilindrului. Arată că lungimea drumului furnicii, exprimată în centimetri, este un număr din intervalul $(16,\\,17)$.', ans: 'Pe desfășurarea suprafeței laterale, drumul minim este $AC=\\sqrt{(\\pi R)^2+G^2}=\\sqrt{11^2+12^2}=\\sqrt{265}$ cm, iar $256<265<289$' },
      ],
      fig: fig18,
    },
  ],
}
