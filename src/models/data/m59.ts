// Testul 28 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 128–130; every answer here is computed and checked with the book's answers, p. 280).
import type { EnModel } from '../types'
import { mid3, plane, solid } from '../figure'
import { graph, pol, PRISM3, prism3 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [16, 0], N: [32, 0], B: [48, 0], P: [60, 0], C: [72, 0] }, 170, { s: 'A-C', dot: 'A M N B P C', l: { A: 'n', M: 'n', N: 'n', B: 'n', P: 'n', C: 'n' } })
const fig8 = plane({ O: [0, 0], A: [10, 0], B: pol(30, 10), C: [0, 9] }, 110, { s: 'O-A O-B O-C', l: { O: 'sw' } })
const fig9 = plane({ A: [4, 6], B: [0, 0], C: [10, 0], D: [4, 0], M: [2, 3], N: [7, 3] }, 120, { s: 'A-B-C-A A-D M-D-N', ra: ['ADC'] })
const fig10 = plane({ A: [6, 8], B: [0, 0], C: [12, 0] }, 110, { s: 'A-B-C-A' })
const f11 = plane({ O: [0, 0], X0: [-3, 0], X1: [3, 0], Y1: [2, 0], T: [0, 3], U: [0, -3] }, 90, {
  dot: 'O', c: [{ at: 'O', r: 3 }, { at: 'O', r: 2 }], l: { O: 'e', X0: '', X1: '', Y1: '', T: '', U: '' },
})
const R11 = f11.p.X1[0] - f11.p.O[0], r11 = f11.p.Y1[0] - f11.p.O[0]
const disc = (r: number) => `M${f11.p.O[0] - r} ${f11.p.O[1]} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`
const fig11 = { ...f11, path: [{ d: disc(R11), fill: '#cfcfcf' }, { d: disc(r11), fill: '#fff' }] }
const fig12 = plane({ A: [0, 0], B: [16, 0], C: [16, 6], D: [0, 6] }, 140, { s: 'A-B-C-D-A', l: { A: '', B: '', C: '', D: '' }, t: [{ at: [8, -1.6], s: 'L = 63 cm', size: 11, italic: true }] })

const fig15 = graph({}, 120, [-4, 4], [-2, 4])
const t16 = Math.acos(50 / 130) * (180 / Math.PI)
const fig16 = plane({ O: [0, 0], A: [130, 0], T: pol(t16, 50), S: pol(-t16, 50) }, 150, { s: 'A-T A-S', c: [{ at: 'O', r: 50 }], dot: 'O', l: { O: 'w' } })
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [6, 2], D: [0, 2], T: [6, -2], O: [3, 1], G: [4, 0] }, 130, { s: 'A-B-C-D-A A-C B-D C-T O-T', l: { O: 'n', G: 'sw' } })
const p18 = prism3(4 * s3, 6)
const fig18 = solid({ ...p18, M: mid3(p18["A'"], p18["C'"]) }, PRISM3, 120, { dot: 'M' })

export const M59: EnModel = {
  id: 'en-59',
  title: 'Paralela 45, Testul 28',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 128–130',
  items: [
    { text: 'Suma numerelor prime de o cifră este:', choices: ['$16$', '$17$', '$18$', '$26$'], ans: 1 },
    { text: 'Dacă $x=0{,}(8)$, atunci $2\\cdot x$ este egal cu:', choices: ['$\\dfrac{16}{9}$', '$1{,}(6)$', '$1{,}(16)$', '$\\dfrac{4}{9}$'], ans: 0 },
    { text: 'Prețul unui televizor este $1500$ de lei. În cadrul unei promoții, toate produsele electronice se ieftinesc cu $15\\%$. Noul preț al televizorului este:', choices: ['$1250$ de lei', '$1275$ de lei', '$1350$ de lei', '$1485$ de lei'], ans: 1 },
    { text: 'Scriind ca interval mulțimea $A=\\{x\\in\\mathbb{R}\\mid2-x>1\\}$, obținem:', choices: ['$(-\\infty,\\,1)$', '$(-\\infty,\\,-1)$', '$(1,\\,\\infty)$', '$(-1,\\,\\infty)$'], ans: 0 },
    { text: 'Se consideră numerele $a=\\sqrt{72}+\\sqrt{18}-\\sqrt{2}$ și $b=\\dfrac{8}{\\sqrt{2}}$. Numărul $a-2b$ este egal cu:', choices: ['$4\\sqrt{2}$', '$-4\\sqrt{2}$', '$\\sqrt{2}$', '$0$'], ans: 3 },
    { text: 'Ana are $10$ lei, iar Alina are $2$ lei. Alina spune: „Dacă mi-ai da $2$ lei, aș avea jumătate din banii tăi”. Afirmația Alinei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$ și $C$, în această ordine, astfel încât $BC=50\\%\\,AB$, iar lungimea segmentului $AC$ este egală cu $72$ cm. Punctele $M$ și $N$ aparțin segmentului $AB$ și $AM=MN=NB$, iar punctul $P$ este mijlocul segmentului $BC$. Lungimea segmentului $NP$ este egală cu:',
      choices: ['$24$ cm', '$28$ cm', '$36$ cm', '$48$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiurile $AOB$ și $BOC$ sunt adiacente și complementare. Măsurile lor, în grade, sunt $2x-10$, respectiv $3x$, unde $x$ este un număr real. Măsura unghiului $AOB$ este:',
      choices: ['$20^\\circ$', '$30^\\circ$', '$60^\\circ$', '$70^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, în care punctele $M$ și $N$ sunt mijloacele laturilor $AB$, respectiv $AC$, iar $D$ este piciorul înălțimii din $A$. Perimetrul triunghiului $MDN$ este egal cu $12$ cm. Perimetrul triunghiului $ABC$ este:',
      choices: ['$36$ cm', '$20$ cm', '$24$ cm', '$48$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$ cu $AB=AC=10$ cm și $BC=12$ cm. Lungimea celui mai scurt drum care unește punctul $B$ cu un punct situat pe latura $AC$ este:',
      choices: ['$8{,}4$ cm', '$9$ cm', '$9{,}6$ cm', '$10$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'Cercurile $\\mathcal{C}(O,\\,3\\text{ cm})$ și $\\mathcal{C}_1(O,\\,r\\text{ cm})$, $r<3$, sunt concentrice, astfel încât aria suprafeței hașurate este egală cu $5\\pi\\text{ cm}^2$. Lungimea razei $r$ este egală cu:',
      choices: ['$\\sqrt{7}$ cm', '$2$ cm', '$5$ cm', '$-2$ cm'], ans: 1, fig: fig11,
    },
    {
      text: 'Un dreptunghi are lungimea $L=63$ cm. Înfășurându-l ca în figura alăturată, obținem suprafața laterală a unui cilindru circular drept. Raza acestui cilindru, rotunjită la cel mai apropiat număr întreg de centimetri, este:',
      choices: ['$15$ cm', '$9$ cm', '$20$ cm', '$10$ cm'], ans: 3, fig: fig12,
    },

    {
      text: 'Andrei, Barbu și Cosmin au, împreună, $45$ de timbre. Diferența dintre dublul numărului de timbre ale lui Barbu și numărul timbrelor lui Cosmin este $13$. Cosmin are $9$ timbre.',
      parts: [
        { pts: 2, text: 'Poate avea Barbu $12$ timbre? Justifică răspunsul.', ans: 'Nu: atunci Cosmin ar avea $2\\cdot12-13=11$ timbre, nu $9$' },
        { pts: 3, text: 'Câte timbre are Andrei?', ans: '$2b-9=13$, deci Barbu are $11$ timbre și Andrei $45-11-9=25$ de timbre' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2x+1}{2x+4}-\\dfrac{x}{3x-6}+\\dfrac{2x^2}{12-3x^2}\\right)\\cdot\\dfrac{12-6x}{13x+6}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-2,\\,-\\dfrac{6}{13},\\,2\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{1}{x+2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-2,\\,-\\dfrac{6}{13},\\,2\\right\\}$.', ans: 'Paranteza este $\\dfrac{3(2x+1)(x-2)-2x(x+2)-4x^2}{6(x+2)(x-2)}=\\dfrac{-(13x+6)}{6(x+2)(x-2)}$, iar înmulțită cu $\\dfrac{-6(x-2)}{13x+6}$ dă $\\dfrac{1}{x+2}$' },
        { pts: 3, text: 'Determină numerele întregi $k$ pentru care $|E(k)|=\\dfrac{1}{4}$.', ans: '$|k+2|=4$, deci $k=2$ sau $k=-6$; cum $k\\ne2$, rezultă $k=-6$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\dfrac{x}{2}+1$.',
      parts: [
        { pts: 2, text: 'Reprezintă grafic funcția $f$ în sistemul alăturat de axe ortogonale $xOy$.', ans: 'Dreapta prin $(0,\\,1)$ și $(-2,\\,0)$' },
        { pts: 3, text: 'Verifică egalitatea $f(\\sqrt{3})+f(3\\sqrt{3})=2f(2\\sqrt{3})$.', ans: 'Ambii membri au valoarea $2\\sqrt{3}+2$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, cercul de centru $O$ reprezintă un lac, iar segmentele $AT$ și $AS$ sunt două alei care pleacă de la ghereta administratorului ($A$) către două pontoane ($T$ și $S$). Dreptele $AT$ și $AS$ sunt tangente cercului. Se știe că $AT=120$ m și $AO=130$ m.',
      parts: [
        { pts: 2, text: 'Arată că $AS=120$ m.', ans: '$\\triangle TOA\\equiv\\triangle SOA$ ($\\sphericalangle T=\\sphericalangle S=90^\\circ$, $OT=OS$, $OA$ comună), deci $AS=AT=120$ m' },
        { pts: 3, text: 'Demonstrează că suprafața lacului este mai mică decât un hectar.', ans: '$OT=\\sqrt{130^2-120^2}=50$ m, $\\mathcal{A}=2500\\pi\\text{ m}^2<2500\\cdot4=10000\\text{ m}^2$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$ cu $AB=6$ cm și $BC=2$ cm. Prelungim latura $BC$ cu segmentul $BT$, $BT=2$ cm și notăm $\\{G\\}=OT\\cap AB$.',
      parts: [
        { pts: 2, text: 'Arată că dreptele $AT$ și $BD$ sunt paralele.', ans: '$O$ e mijlocul lui $AC$ și $B$ e mijlocul lui $CT$, deci $OB$ e linie mijlocie în $\\triangle ACT$ și $BD\\parallel AT$' },
        { pts: 3, text: 'Determină măsura unghiului $BGC$.', ans: '$G$ e centrul de greutate al $\\triangle ACT$, deci $BG=\\dfrac{AB}{3}=2$ cm $=BC$; $\\triangle BCG$ e dreptunghic isoscel, deci $\\sphericalangle BGC=45^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată prisma triunghiulară regulată $ABCA'B'C'$. Se știe că $AB=4\\sqrt{3}$ cm, $AA'=6$ cm, iar punctul $M$ este mijlocul muchiei $A'C'$.",
      parts: [
        { pts: 2, text: 'Determină volumul prismei.', ans: '$V=\\dfrac{48\\sqrt{3}}{4}\\cdot6=72\\sqrt{3}\\text{ cm}^3$' },
        { pts: 3, text: "Află distanța de la punctul $M$ la planul $(B'BC)$.", ans: "$d(M,(B'BC))=\\dfrac{1}{2}d(A',(B'BC))=\\dfrac{1}{2}\\cdot\\dfrac{4\\sqrt{3}\\cdot\\sqrt{3}}{2}=3$ cm" },
      ],
      fig: fig18,
    },
  ],
}
