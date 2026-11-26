// Testul 54 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 184–186; every answer here is computed and checked with the book's answers, p. 289).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { along, meet, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [1, 0], C: [2, 0], D: [3, 0], E: [5, 0] }, 170, { s: 'A-E', dot: 'A B C D E', l: { A: 'n', B: 'n', C: 'n', D: 'n', E: 'n' } })
const fig8 = plane({ O: [0, 0], A: [4, 0], B: pol(30, 4), M: [0, 4], N: pol(210, 3) }, 130, { s: 'O-A O-M B-N', ra: ['MOA'], l: { O: 's' } })
const B9: Pt = [0, 0], C9: Pt = [6, 0]
const fig9 = plane({ D: [-2.5, 0], B: B9, C: C9, A: meet(B9, pol(50), C9, pol(150, 1, C9)) }, 140, { s: 'D-C B-A-C', l: { D: 's', B: 's', C: 's' } })
const a10 = 4 * s2
const D10: Pt = [0, 0], B10: Pt = [a10, a10]
const fig10 = plane({ A: [0, a10], B: B10, C: [a10, 0], D: D10, M: along(D10, B10, 0.75) }, 110, { s: 'A-B-C-D-A D-B A-M M-C', l: { M: 'se' } })
const fig11 = plane({ A: pol(150, 6), B: pol(210, 6), C: pol(30, 6) }, 110, { s: 'A-B A-C', c: [{ at: [0, 0], r: 6 }], ra: ['BAC'] })
const fig12 = solid(box(40, 30, 50), BOX, 120)

const fig15 = graph({ A: [0, 2], B: [-2, 0], C: [2 * s3, 0], F1: [-3, -1], F2: [2.8, 4.8], G1: [-3, 2 + s3], G2: [5, 2 - 5 / s3] }, 140, [-3.5, 5.5], [-1.5, 5.2], {
  s: 'F1-F2 G1-G2', dot: 'A B C', l: { F1: '', F2: '', G1: '', G2: '', A: 'ne', B: 'nw', C: 'n' },
})
const fig16 = plane({ A: [0, 0], B: [25, 0], C: [16, 12], D: [0, 12] }, 140, { s: 'A-B-C-D-A A-C', ra: ['DAB'] })
const fig17 = plane({ A: [0, 0], B: [80, 0], C: [80, 60], D: [0, 60], O: [40, 30], M: [62.5, 0], N: [17.5, 60] }, 140, { s: 'A-B-C-D-A A-C M-N', l: { O: 'se' } })
// the plane (ABC) drawn in perspective by hand: M above A, N above O
const fig18 = plane({ A: [0, 0], B: [4.7, -1.7], C: [10, 0], O: [5, 0], M: [0, 8], N: [5, 4] }, 140, { s: 'A-B-C-A M-A N-O M-N-C', dot: 'O', l: { O: 'se', B: 's' } })

export const M85: EnModel = {
  id: 'en-85',
  title: 'Paralela 45, Testul 54',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 184–186',
  items: [
    { text: 'Dintre numerele $577$, $152$, $306$ și $355$, cel divizibil cu $17$ este:', choices: ['$577$', '$152$', '$306$', '$355$'], ans: 2 },
    {
      text: 'Tabelul alăturat reprezintă situația statistică a absențelor, rezultată în urma monitorizării frecvenței elevilor dintr-o școală, în anul școlar 2019-2020.\n\n| | Semestrul I | Semestrul II |\n|---|---|---|\n| Gimnaziu | $870$ | $590$ |\n| Liceu | $1730$ | $1940$ |\n\nNumărul total de absențe înregistrate în acest an școlar este:',
      choices: ['$5100$', '$5230$', '$4130$', '$5130$'], ans: 3,
    },
    { text: 'Considerăm mulțimea $A=\\{x\\in\\mathbb{Z}\\mid |3x+1|<7\\}$. Numărul elementelor mulțimii $A$ este:', choices: ['$4$', '$5$', '$3$', '$2$'], ans: 0 },
    { text: 'Dintre numerele $x=2\\sqrt{15}$, $y=8$, $z=3\\sqrt{7}$ și $t=\\sqrt{130}:\\sqrt{2}$, cel mai mic este:', choices: ['$t$', '$x$', '$y$', '$z$'], ans: 1 },
    {
      text: 'Considerăm numerele $a=12+3\\sqrt{12}$, $b=6(2-\\sqrt{3})$. Patru elevi, Mihai, Ion, Maria și Ana, trebuie să calculeze media aritmetică a celor două numere. Ei obțin rezultatele din tabelul următor.\n\n| Elevul | Mihai | Ion | Maria | Ana |\n|---|---|---|---|---|\n| Rezultatul obținut | $24$ | $36$ | $6$ | $12$ |\n\nElevul care a calculat corect este:',
      choices: ['Mihai', 'Ion', 'Maria', 'Ana'], ans: 3,
    },
    { text: 'Fie $a=\\dfrac{2}{3\\cdot5}+\\dfrac{3}{5\\cdot8}+\\dfrac{4}{8\\cdot12}$. Vlad afirmă că $a\\in\\left(\\dfrac{1}{5},\\,\\dfrac{1}{3}\\right)$. Afirmația lui Vlad este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$, $D$, $E$, astfel încât $AB=BC=CD=\\dfrac{DE}{2}$. Valoarea raportului $\\dfrac{AD}{BE}$ este:',
      choices: ['$0{,}75$', '$\\dfrac{3}{2}$', '$\\dfrac{4}{3}$', '$1$'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiul $AOB$ are $30^\\circ$, $MO\\perp OA$, iar punctele $B$, $O$, $N$ sunt coliniare. Măsura unghiului $MON$ este:',
      choices: ['$140^\\circ$', '$110^\\circ$', '$120^\\circ$', '$130^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi, punctele $B$, $C$ și $D$ sunt coliniare, $\\sphericalangle ACB=30^\\circ$, iar $\\sphericalangle ABD=130^\\circ$. Măsura unghiului $BAC$ este:',
      choices: ['$90^\\circ$', '$100^\\circ$', '$70^\\circ$', '$110^\\circ$'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat pătratul $ABCD$ având $BD=8$ cm. Punctul $M$ se află pe diagonala $BD$, astfel încât $DM=6$ cm. Aria patrulaterului $AMCD$ este egală cu:',
      choices: ['$60\\text{ cm}^2$', '$52\\text{ cm}^2$', '$48\\text{ cm}^2$', '$24\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată sunt reprezentate două coarde perpendiculare $AB$ și $AC$, ale unui cerc de rază $R$. Măsura unghiului $BCA$ este egală cu $30^\\circ$ și $AB=6$ cm. Raza cercului are lungimea:',
      choices: ['$12$ cm', '$3$ cm', '$6$ cm', '$6\\sqrt{3}$ cm'], ans: 2, fig: fig11,
    },
    {
      text: 'O cutie este confecționată din carton și are formă de paralelipiped dreptunghic cu dimensiunile de $30$ cm, $40$ cm și $50$ cm (vezi figura alăturată). Un metru pătrat de carton cântărește $0{,}5$ kg. Cutia cântărește:',
      choices: ['$500$ g', '$520$ g', '$480$ g', '$470$ g'], ans: 3, fig: fig12,
    },

    {
      text: 'Într-un bidon se află $30$ de litri de lapte. Toader are la dispoziție nouă recipiente de doi litri și nouă recipiente de trei litri, care trebuie umplute în întregime pentru a putea fi sigilate.',
      parts: [
        { pts: 2, text: 'Este posibil ca Toader să golească bidonul folosind exact $12$ recipiente?', ans: 'Da: $2a+3b=30$ și $a+b=12$ dau $a=b=6$, adică șase bidoane de doi litri și șase de trei litri' },
        { pts: 3, text: 'Care este numărul maxim de recipiente în care poate fi golit bidonul?', ans: '$2a+3b=30$ cu $a,\\,b\\leq9$; $a+b=15-\\dfrac{b}{2}$ e maxim pentru $b$ minim; $a=9$ dă $b=4$: $13$ recipiente' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x}{x^2-x}-\\dfrac{4}{4x^2-4}+\\dfrac{3x^2+3x}{6x^2+12x+6}\\right)\\cdot\\left(\\dfrac{1}{2}-\\dfrac{1}{2x^2}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x+1}{4x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$E(x)=\\left[\\dfrac{1}{x-1}-\\dfrac{1}{x^2-1}+\\dfrac{x}{2(x+1)}\\right]\\cdot\\dfrac{x^2-1}{2x^2}=\\dfrac{x(x+1)}{2(x^2-1)}\\cdot\\dfrac{x^2-1}{2x^2}=\\dfrac{x+1}{4x}$' },
        { pts: 3, text: 'Demonstrează că $E(x)+E(-x)=\\dfrac{1}{2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$E(-x)=\\dfrac{-x+1}{-4x}=\\dfrac{x-1}{4x}$, deci $E(x)+E(-x)=\\dfrac{2x}{4x}=\\dfrac{1}{2}$' },
      ],
    },
    {
      text: 'Considerăm funcțiile $f,\\,g:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+2$, $g(x)=-\\dfrac{x}{\\sqrt{3}}+2$ și sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Arată că reprezentările grafice ale celor două funcții se intersectează într-un punct $A\\in Oy$.', ans: '$f(0)=g(0)=2$, deci $A(0,\\,2)\\in Oy$' },
        { pts: 3, text: 'Notăm cu $B$ punctul de intersecție dintre reprezentarea grafică a funcției $f$ și axa $Ox$ și cu $C$ punctul de intersecție dintre reprezentarea grafică a funcției $g$ și axa $Ox$. Calculează măsura unghiului $BAC$.', ans: '$B(-2,\\,0)$, $C(2\\sqrt{3},\\,0)$; $\\sphericalangle BAO=45^\\circ$ și $\\text{tg}\\sphericalangle CAO=\\sqrt{3}$, deci $\\sphericalangle CAO=60^\\circ$ și $\\sphericalangle BAC=105^\\circ$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez dreptunghic, $AB\\parallel CD$, $CD<AB$, având $AD=12$ cm, $AC=20$ cm, $BC=15$ cm.',
      parts: [
        { pts: 2, text: 'Calculează perimetrul trapezului $ABCD$.', ans: '$CD=\\sqrt{400-144}=16$ cm, iar proiecția lui $BC$ pe $AB$ este $\\sqrt{225-144}=9$ cm, deci $AB=25$ cm și perimetrul este $68$ cm' },
        { pts: 3, text: 'Demonstrează că $AC\\perp BC$.', ans: '$AB^2=625=400+225=AC^2+BC^2$, deci $\\sphericalangle ACB=90^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este desenat un dreptunghi $ABCD$, cu $AB=80$ m și $BC=60$ m. Fie $MN$ mediatoarea segmentului $AC$, $M\\in AB$, $N\\in CD$.',
      parts: [
        { pts: 2, text: 'Arată că patrulaterul $AMCN$ este romb.', ans: '$NC\\parallel AM$ și $NC=AM$ (căci $\\triangle NOC\\equiv\\triangle MOA$, CU), deci $AMCN$ este paralelogram; cum $AC\\perp MN$, este romb' },
        { pts: 3, text: 'Calculează lungimea segmentului $MN$.', ans: '$\\triangle CON\\sim\\triangle CDA$: $\\dfrac{NO}{AD}=\\dfrac{CO}{CD}$, deci $NO=\\dfrac{60\\cdot50}{80}=37{,}5$ m și $MN=75$ m' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este dreptunghic în $B$, $BC=6$ m, iar $AC=10$ m. Pe planul $(ABC)$ se ridică perpendicularele $MA$ și $NO$, de lungimi $MA=8$ m și $NO=4$ m, $O$ fiind mijlocul lui $AC$.',
      parts: [
        { pts: 2, text: 'Arată că punctele $M$, $N$ și $C$ sunt coliniare.', ans: '$MA\\parallel NO$ (perpendiculare pe același plan); $\\dfrac{NO}{MA}=\\dfrac{CO}{CA}=\\dfrac{1}{2}$ și $\\sphericalangle NOC=\\sphericalangle MAC=90^\\circ$, deci $\\triangle NOC\\sim\\triangle MAC$, $\\sphericalangle NCO=\\sphericalangle MCA$ și $M$, $N$, $C$ sunt coliniare' },
        { pts: 3, text: 'Determină raza sferei care conține punctele $M$, $A$, $B$ și $C$.', ans: '$BC\\perp AB$ și $BC\\perp MA$, deci $BC\\perp MB$; $N$ e mijlocul lui $MC$, iar $AN$, $BN$ sunt mediane în triunghiurile dreptunghice $MAC$, $MBC$: $AN=BN=MN=CN=\\dfrac{MC}{2}=\\dfrac{\\sqrt{64+100}}{2}=\\sqrt{41}$ m' },
      ],
      fig: fig18,
    },
  ],
}
