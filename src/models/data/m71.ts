// Testul 40 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 154–156; every answer here is computed and checked with the book's answers, p. 284).
import type { EnModel } from '../types'
import type { P3, Pt } from '../figure'
import { meet, mid, plane, solid } from '../figure'
import { graph, pol, PYR4, pyr4 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [1, 0], N: [2, 0], B: [4, 0] }, 150, { s: 'A-B', dot: 'A M N B', l: { A: 's', M: 's', N: 's', B: 's' } })
const A8 = pol(60, (5 * Math.sin((80 * Math.PI) / 180)) / Math.sin((40 * Math.PI) / 180)), C8: Pt = [5, 0], E8: Pt = [9, 0]
const fig8 = plane({ A: A8, B: [0, 0], C: C8, E: E8, D: meet(A8, C8, E8, [E8[0] + Math.cos((160 * Math.PI) / 180), Math.sin((160 * Math.PI) / 180)]) }, 140, {
  s: 'A-B-E D-E A-C', ang: ['BAC', 'ABC', 'DEB'], l: { D: 'ne' },
})
const fig9 = plane({ A: [0, 0], S: [s3, 0], P: [0, 1] }, 120, { s: 'P-A-S-P', ra: ['PAS'], ang: ['APS'] })
const fig10 = plane({ A: [0, 0], B: [8, 0], C: [8, 6], D: [0, 6], M: [6, 6], N: [2, 6], P: [4, 4] }, 130, { s: 'A-B-C-D-A A-M B-N', l: { P: 's' } })
const fig11 = plane({ A: [-6, 0], B: [6, 0], C: [2, 4 * s3], D: [-2, 4 * s3], I: [0, 2 * s3] }, 120, { s: 'A-B-C-D-A', c: [{ at: 'I', r: 2 * s3 }], l: { I: '' } })
const fig12 = solid(pyr4(10, 12), PYR4, 110, { seg: 'V-O', dot: 'O' })

const fig15 = graph({ P: [-2, 0], L1: [-0.5, -3.5], L2: [5, 2] }, 120, [-3, 5.5], [-4, 2.5], { s: 'L1-L2', dot: 'P', l: { L1: '', L2: '', P: 'n' } })
const D16 = pol(60, 12), C16: Pt = [D16[0] + 24, D16[1]]
const fig16 = plane({ A: [0, 0], B: [24, 0], C: C16, D: D16, E: mid(C16, D16) }, 150, { s: 'A-B-C-D-A B-D A-E-B', l: { E: 'n' } })
const D17 = pol(30, 4), C17: Pt = [D17[0] + 8, D17[1]]
const fig17 = plane({ A: [0, 0], B: [8, 0], C: C17, D: D17, E: [4, -4 * s3], F: [C17[0], -D17[1]] }, 140, { s: 'A-B-C-D-A A-E-B B-F-C D-E-F-D' })
const h18 = 15 * s3
const p18: Record<string, P3> = { A: [0, h18, 0], B: [15, 0, 0], C: [30, h18, 0], D: [0, h18, 40], E: [30, h18, 20] }
const fig18 = solid(p18, 'A-B-C A-B-D B-C-E B-E-D A-D-E-C', 110)

export const M71: EnModel = {
  id: 'en-71',
  title: 'Paralela 45, Testul 40',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 154–156',
  items: [
    { text: 'Scrierea numărului $144$ ca produs de puteri de numere prime distincte este:', choices: ['$2^4\\cdot9$', '$9\\cdot16$', '$2^4\\cdot3^3$', '$2^4\\cdot3^2$'], ans: 3 },
    {
      text: 'La un concurs s-au acordat mai multe diplome conform tabelului următor:\n\n| Diploma | Premiul I | Premiul al II-lea | Premiul al III-lea | Mențiune |\n|---|---|---|---|---|\n| Număr elevi | $3$ | $6$ | $9$ | $18$ |\n\nDacă numărul premiilor reprezintă $p\\%$ din numărul total de diplome acordate, atunci $p$ este egal cu:',
      choices: ['$30$', '$40$', '$50$', '$60$'], ans: 2,
    },
    { text: 'Roma Antică a fost un oraș-stat a cărui istorie începe în anul $753$ î.Hr. și se sfârșește în anul $476$ d.Hr. Existența Romei Antice s-a întins pe o perioadă de:', choices: ['$277$ ani', '$476$ ani', '$753$ ani', '$1229$ ani'], ans: 3 },
    { text: 'Opusul numărului $a=\\left(\\dfrac{1}{4}-\\dfrac{1}{6}\\right):\\left(-\\dfrac{1}{24}\\right)$ este:', choices: ['$-10$', '$-\\dfrac{1}{2}$', '$\\dfrac{5}{6}$', '$2$'], ans: 3 },
    {
      text: 'Patru eleve, Ana, Maria, Ioana și Sabina, au primit ca temă să efectueze operațiile indicate în tabelul alăturat.\n\n| Ana | $x=\\sqrt{2}+\\sqrt{3}$ | $y=\\sqrt{2}-\\sqrt{3}$ | $x-y$ |\n|---|---|---|---|\n| Maria | $x=3\\sqrt{2}$ | $y=-\\sqrt{18}$ | $x+y$ |\n| Ioana | $x=\\sqrt{2}+\\dfrac{1}{\\sqrt{8}}$ | $y=\\sqrt{2}$ | $x\\cdot y$ |\n| Sabina | $x=2\\sqrt{6}$ | $y=5\\sqrt{3}$ | $x:y$ |\n\nDacă operațiile s-au efectuat corect, atunci elevele care au obținut ca rezultat un număr rațional sunt:',
      choices: ['Maria și Ioana', 'Ana și Ioana', 'Maria și Sabina', 'Ana și Sabina'], ans: 0,
    },
    { text: 'Iustina și Elena merg la același bazin de înot. Iustina poate înota $10$ lungimi de bazin în $25$ de minute, iar Elena poate înota $12$ lungimi de bazin în $32$ de minute. Afirmația că Elena înoată mai repede decât Iustina este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctul $A$ este simetricul punctului $N$ față de punctul $M$, iar punctul $B$ este simetricul punctului $A$ față de punctul $N$. Valoarea raportului $\\dfrac{MN}{AB}$ este egală cu:',
      choices: ['$\\dfrac{1}{2}$', '$\\dfrac{1}{3}$', '$\\dfrac{1}{4}$', '$\\dfrac{2}{3}$'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, punctul $D$ se află pe latura $AC$, iar punctul $E$ se află pe prelungirea laturii $BC$ a triunghiului $ABC$. Dacă $\\sphericalangle A=40^\\circ$, $\\sphericalangle B=60^\\circ$ și $\\sphericalangle E=20^\\circ$, atunci măsura unghiului $CDE$ este:',
      choices: ['$40^\\circ$', '$50^\\circ$', '$60^\\circ$', '$70^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'O pisică $P$ sare de pe un zid $PA=1$ m pentru a prinde un șoarece $S$ pe care îl vede sub un unghi de $60^\\circ$ (vezi figura alăturată). Distanța $AS$ de la șoarece la zid este:',
      choices: ['$1$ m', '$\\sqrt{3}$ m', '$2$ m', '$2\\sqrt{3}$ m'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$ având $AB=8$ cm și $AD=6$ cm. Bisectoarele $AM$ și $BN$ ale unghiurilor $DAB$, respectiv $ABC$ se intersectează în punctul $P$ $(M,\\,N\\in DC)$. Aria patrulaterului $BCMP$ este egală cu:',
      choices: ['$17\\text{ cm}^2$', '$15\\text{ cm}^2$', '$11\\text{ cm}^2$', '$14\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, laturile trapezului isoscel $ABCD$ cu bazele $AB=12$ cm și $CD=4$ cm sunt tangente unui cerc. Perimetrul trapezului $ABCD$ este egal cu:',
      choices: ['$16$ cm', '$24$ cm', '$32$ cm', '$48$ cm'], ans: 2, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentată piramida patrulateră regulată $VABCD$, cu vârful $V$, înălțimea $VO=12$ cm și latura bazei $AB=10$ cm. Aria totală a piramidei $VABCD$ este egală cu:',
      choices: ['$240\\text{ cm}^2$', '$260\\text{ cm}^2$', '$360\\text{ cm}^2$', '$400\\text{ cm}^2$'], ans: 2, fig: fig12,
    },

    {
      text: 'De pe două loturi, având împreună $206$ ha, s-a strâns recolta de cartofi, obținându-se, de pe fiecare lot, câte $19$ tone la hectar.',
      parts: [
        { pts: 2, text: 'Află câte tone de cartofi s-au recoltat de pe cele $206$ ha.', ans: '$206\\cdot19=3914$ t' },
        { pts: 3, text: 'Determină câte hectare are fiecare lot, știind că de pe primul s-au obținut cu $608$ tone de cartofi mai mult decât de pe al doilea.', ans: 'Primul lot are cu $608:19=32$ ha mai mult: $(206+32):2=119$ ha și $87$ ha' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(x-1+\\dfrac{1}{x+1}\\right):\\left(\\dfrac{1}{x}-\\dfrac{1}{x+1}\\right)-x$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=x^3-x$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0\\}$.', ans: '$E(x)=\\dfrac{x^2}{x+1}\\cdot\\dfrac{x(x+1)}{1}-x=x^3-x$' },
        { pts: 3, text: 'Demonstrează că numărul natural $E(n)$ este divizibil cu $6$, pentru orice $n\\in\\mathbb{N}^*$.', ans: '$E(n)=(n-1)n(n+1)$, produsul a trei numere naturale consecutive, deci divizibil cu $2$ și cu $3$, adică cu $6$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x-3$.',
      parts: [
        { pts: 2, text: 'Calculează $f\\left(\\sqrt{7}\\right)\\cdot f\\left(\\sqrt{8}\\right)\\cdot f\\left(\\sqrt{9}\\right)\\cdot f\\left(\\sqrt{10}\\right)\\cdot f\\left(\\sqrt{11}\\right)$.', ans: '$f\\left(\\sqrt{9}\\right)=3-3=0$, deci produsul este $0$' },
        { pts: 3, text: 'Determină distanța de la punctul $P(-2,\\,0)$ la reprezentarea grafică a funcției $f$, în sistemul de axe ortogonale $xOy$.', ans: 'Graficul taie axele în $A(3,\\,0)$ și $B(0,\\,-3)$; în $\\triangle PAB$: $PA=5$, $AB=3\\sqrt{2}$, $d=\\dfrac{PA\\cdot OB}{AB}=\\dfrac{15}{3\\sqrt{2}}=\\dfrac{5\\sqrt{2}}{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este desenat paralelogramul $ABCD$ cu $AB=24$ cm, $BC=12$ cm și $\\sphericalangle BAD=60^\\circ$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea diagonalei $BD$.', ans: 'Fie $DP\\perp AB$: $AP=6$ cm, $PB=18$ cm, $DP=6\\sqrt{3}$ cm, deci $BD=\\sqrt{324+108}=12\\sqrt{3}$ cm' },
        { pts: 3, text: 'Arată că, dacă $E$ este mijlocul laturii $CD$, atunci unghiul $AEB$ este drept.', ans: 'Fie $F$ mijlocul lui $AB$: $BFEC$ este paralelogram, $EF=BC=12$ cm $=AF=BF$, deci $\\sphericalangle AEB=90^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este desenat un paralelogram $ABCD$ cu $\\sphericalangle BAD=30^\\circ$, $AB=8$ cm și $BC=4$ cm și triunghiurile echilaterale $ABE$ și $BCF$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea segmentului $DE$.', ans: '$\\sphericalangle DAE=30^\\circ+60^\\circ=90^\\circ$, deci $DE=\\sqrt{16+64}=4\\sqrt{5}$ cm' },
        { pts: 3, text: 'Demonstrează că triunghiul $DEF$ este echilateral.', ans: 'Tot cu teorema lui Pitagora, în triunghiurile dreptunghice $DCF$ și $EBF$ ($\\sphericalangle DCF=\\sphericalangle EBF=90^\\circ$): $DF=EF=4\\sqrt{5}$ cm $=DE$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi echilateral $ABC$ cu $AB=30$ cm și punctele $D$ și $E$ situate de aceeași parte a planului $(ABC)$, astfel încât $DA\\perp(ABC)$, $EC\\perp(ABC)$, $AD=40$ cm și $CE=20$ cm.',
      parts: [
        { pts: 2, text: 'Află măsura unghiului format de planele $(ABD)$ și $(CBE)$.', ans: 'Ambele plane sunt perpendiculare pe $(ABC)$, deci unghiul lor este $\\sphericalangle ABC=60^\\circ$' },
        { pts: 3, text: 'Calculează distanța de la punctul $D$ la dreapta de intersecție a planelor $(ABC)$ și $(DBE)$.', ans: 'Fie $DE\\cap AC=\\{F\\}$: $CE\\parallel AD$, $AD=2CE$, deci $CF=AC=BC$ și $AB\\perp BF$; $(ABC)\\cap(DBE)=BF$ și, cu teorema celor trei perpendiculare, $DB\\perp BF$, deci distanța este $BD=\\sqrt{900+1600}=50$ cm' },
      ],
      fig: fig18,
    },
  ],
}
