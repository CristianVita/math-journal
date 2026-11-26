// Testul 37 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 148–149; every answer here is computed and checked with the book's answers, p. 283).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { foot, meet, mid, plane, solid } from '../figure'
import { pol, PYR4, pyr4 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ C: [0, 0], A: [4, 0], B: [8, 0], D: [20, 0] }, 170, { s: 'C-D', dot: 'C A B D', l: { C: 'n', A: 'n', B: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: [5, 0], B: pol(30, 5), C: pol(45, 5.5), D: [0, 5] }, 110, { s: 'D-O-A O-B O-C' })
const fig9 = plane({ B: [0, 0], C: [2, 0], A: [1, Math.tan((67.5 * Math.PI) / 180)] }, 70, { s: 'A-B-C-A' })
const A10: Pt = [0, 0], B10: Pt = [9, 0], C10: Pt = [11, 3], D10: Pt = [2, 3]
const O10 = mid(A10, C10), E10 = mid(B10, C10)
const fig10 = plane({ A: A10, B: B10, C: C10, D: D10, O: O10, E: E10 }, 150, { s: 'A-B-C-D-A A-C B-D O-E', hatch: ['A-B-E-O'], l: { O: 'n', E: 'e' } })
const C11 = pol(100), D11: Pt = [C11[0], 0]
const fig11 = plane({ A: [-1, 0], B: [1, 0], O: [0, 0], C: C11, D: D11 }, 110, { s: 'A-C-B-A C-D', c: [{ at: 'O', r: 1 }], dot: 'O', ra: ['CDB'], l: { D: 'sw', O: 'se' } })
const fig12 = solid(pyr4(6, 3 * Math.SQRT2), PYR4, 110, { l: { O: '' } })

const B16: Pt = [0, 0], C16: Pt = [16, 0], A16: Pt = [8, 8], E16: Pt = [6, 0], F16: Pt = [24, 0], D16: Pt = [15, 9]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, E: E16, F: F16, M: meet(A16, C16, E16, D16), N: [12, 12] }, 150, {
  s: 'B-N-F-B A-C E-D', ra: ['BAC', 'EDF'], l: { M: 'e', N: 'n' },
})
const A17: Pt = [0, 0], B17: Pt = [8, 0], D17: Pt = [3 * s3, 3], C17: Pt = [8 + 3 * s3, 3]
const F17 = foot(D17, B17, C17), G17 = foot(F17, D17, C17)
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, E: [3 * s3, 0], F: F17, G: G17 }, 210, {
  s: 'A-B-C-D-A D-E D-F F-B F-G G-B', ra: ['DEA', 'DFC', 'FGC'], l: { F: 's', G: 'n' },
})
// drawn taller than the real height 3, as in the book
const f18 = plane({ O: [0, 0], A: [6, 0], B: [-6, 0], "O'": [0, 5], "A'": [2, 5], "B'": [-2, 5] }, 110, { s: "A-A' B-B' O'-A'", d: "O-O' O-A", dot: "O O'", l: { B: '', "B'": '', O: 's' } })
const r18 = f18.p.A[0] - f18.p.O[0], q18 = f18.p["A'"][0] - f18.p["O'"][0]
const fig18 = { ...f18, e: [{ at: f18.p.O, rx: r18, ry: r18 / 4, back: true }, { at: f18.p["O'"], rx: q18, ry: q18 / 4 }] }

export const M68: EnModel = {
  id: 'en-68',
  title: 'Paralela 45, Testul 37',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 148–149',
  items: [
    { text: 'Rezultatul calculului $12-12:(-4)$ este egal cu:', choices: ['$15$', '$9$', '$6$', '$0$'], ans: 0 },
    { text: 'Dacă $\\dfrac{5}{2x-3}=\\dfrac{3}{y}$, atunci rezultatul calculului $6x-5y$ este:', choices: ['$3$', '$5$', '$7$', '$9$'], ans: 3 },
    { text: 'Diferența dintre opusul numărului $2$ și inversul numărului $\\dfrac{1}{2}$ este egală cu:', choices: ['$-\\dfrac{5}{2}$', '$0$', '$-4$', '$4$'], ans: 2 },
    { text: 'Scris sub formă de fracție ordinară, numărul $1{,}(2)$ este egal cu:', choices: ['$\\dfrac{2}{9}$', '$\\dfrac{11}{90}$', '$\\dfrac{11}{9}$', '$\\dfrac{6}{5}$'], ans: 2 },
    {
      text: 'Patru elevi, Ana, Bogdan, Carmen și Dan, au calculat raportul $\\dfrac{a}{b}$, unde $a=\\sqrt{3}+\\sqrt{2}$ și $b=\\sqrt{3}-\\sqrt{2}$. Rezultatele obținute sunt prezentate în tabelul de mai jos:\n\n| Ana | Bogdan | Carmen | Dan |\n|---|---|---|---|\n| $5$ | $5+2\\sqrt{6}$ | $5-2\\sqrt{6}$ | $1$ |\n\nConform informațiilor din tabel, rezultatul corect a fost obținut de:',
      choices: ['Ana', 'Bogdan', 'Carmen', 'Dan'], ans: 1,
    },
    { text: 'Două caiete și $6$ pixuri costă împreună $48$ de lei. Afirmația „Trei pixuri și un caiet, de același fel, costă împreună $24$ de lei.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată este reprezentat segmentul $AB$ cu lungimea de $4$ cm. Punctul $C$ este simetricul lui $B$ față de punctul $A$, iar punctul $D$ se află pe semidreapta $AB$ astfel încât $BD=3AB$. Lungimea segmentului $CD$ este egală cu:',
      choices: ['$12$ cm', '$16$ cm', '$20$ cm', '$24$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiurile $AOB$ și $BOD$ sunt adiacente complementare. Semidreapta $OC$ este bisectoarea unghiului $AOD$, iar măsura unghiului $AOB$ este jumătate din măsura unghiului $BOD$. Măsura unghiului $BOC$ este egală cu:',
      choices: ['$15^\\circ$', '$20^\\circ$', '$30^\\circ$', '$45^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: "În figura alăturată este reprezentat triunghiul isoscel $ABC$ cu $AB=AC=4$ cm și măsura unghiului $B$ de $67^\\circ30'$. Aria triunghiului $ABC$ este egală cu:",
      choices: ['$4\\sqrt{2}\\text{ cm}^2$', '$4\\sqrt{3}\\text{ cm}^2$', '$8\\text{ cm}^2$', '$8\\sqrt{3}\\text{ cm}^2$'], ans: 0, fig: fig9,
    },
    {
      text: 'Figura alăturată reprezintă schița unui teren în formă de paralelogram $ABCD$ cu suprafața de $24$ ha. Dacă $O$ este punctul de intersecție a diagonalelor $AC$ și $BD$, iar $E$ este mijlocul laturii $BC$, atunci aria trapezului $ABEO$ este:',
      choices: ['$6$ ha', '$9$ ha', '$10$ ha', '$12$ ha'], ans: 1, fig: fig10,
    },
    {
      text: 'Punctele $A$, $B$ și $C$ sunt situate pe un cerc de centru $O$, astfel încât punctele $A$ și $B$ sunt diametral opuse și măsura arcului mic $AC$ este egală cu $80^\\circ$. Dacă punctul $D$ este piciorul perpendicularei din $C$ pe $AB$, atunci măsura unghiului $ACD$ este egală cu:',
      choices: ['$80^\\circ$', '$60^\\circ$', '$40^\\circ$', '$30^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă patrulateră regulată $VABCD$ cu baza pătratul $ABCD$. Dacă triunghiul $VAB$ este echilateral și $AB=6$ cm, atunci aria totală a piramidei este egală cu:',
      choices: ['$36\\sqrt{3}\\text{ cm}^2$', '$9\\left(4+\\sqrt{3}\\right)\\text{ cm}^2$', '$36\\left(1+\\sqrt{3}\\right)\\text{ cm}^2$', '$6\\left(6+\\sqrt{3}\\right)\\text{ cm}^2$'], ans: 2, fig: fig12,
    },

    {
      text: 'Într-o școală sunt $528$ de elevi, băieți și fete.',
      parts: [
        { pts: 2, text: 'Dacă în școală sunt $88$ de fete, află cât la sută din numărul băieților reprezintă numărul fetelor.', ans: '$528-88=440$ de băieți; $\\dfrac{88}{440}=\\dfrac{20}{100}$, deci $20\\%$' },
        { pts: 3, text: 'Dacă $60\\%$ din numărul băieților înseamnă $50\\%$ din numărul fetelor, află câți băieți și câte fete sunt în școală.', ans: '$0{,}6b=0{,}5f\\Rightarrow f=1{,}2b$, $2{,}2b=528$, deci $240$ de băieți și $288$ de fete' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x^2}{x^2+x}-\\dfrac{x}{x-x^2}-\\dfrac{x+1}{x^3+x^2-x-1}\\right)\\cdot\\left(x-\\dfrac{1}{x}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^3+x^2-x-1=(x+1)^2(x-1)$, pentru orice număr real $x$.', ans: '$x^3+x^2-x-1=x^2(x+1)-(x+1)=(x+1)(x^2-1)=(x+1)^2(x-1)$' },
        { pts: 3, text: 'Demonstrează că $E(4x^2+9)-12E(x)\\geq0$, oricare ar fi numărul real $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$E(x)=\\dfrac{x^2}{(x+1)(x-1)}\\cdot\\dfrac{(x-1)(x+1)}{x}=x$, deci $E(4x^2+9)-12E(x)=4x^2-12x+9=(2x-3)^2\\geq0$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+1$.',
      parts: [
        { pts: 2, text: 'Arată că produsul $f\\left(\\dfrac{1}{2}\\right)\\cdot f\\left(\\dfrac{1}{3}\\right)\\cdot f\\left(\\dfrac{1}{4}\\right)\\cdot f\\left(\\dfrac{1}{5}\\right)$ este un număr natural.', ans: '$\\dfrac{3}{2}\\cdot\\dfrac{4}{3}\\cdot\\dfrac{5}{4}\\cdot\\dfrac{6}{5}=3\\in\\mathbb{N}$' },
        { pts: 3, text: 'Calculează lungimea segmentului $AB$, unde $A$ și $B$ sunt punctele de intersecție a graficului funcției $f$ cu axele de coordonate $Ox$, respectiv $Oy$, ale sistemului de axe ortogonale $xOy$.', ans: '$A(-1,\\,0)$, $B(0,\\,1)$, deci $AB=\\sqrt{2}$' },
      ],
    },
    {
      text: 'În figura alăturată sunt reprezentate triunghiurile dreptunghice isoscele $ABC$ și $DEF$, cu ipotenuzele $BC$ și $EF$ situate pe aceeași dreaptă. Segmentele $AC$ și $DE$ se intersectează în punctul $M$, iar dreptele $AB$ și $DF$ se intersectează în punctul $N$.',
      parts: [
        { pts: 2, text: 'Arată că patrulaterul $AMDN$ este dreptunghi.', ans: '$\\sphericalangle NBF=\\sphericalangle NFB=45^\\circ$, deci $\\sphericalangle BNF=90^\\circ$; cum $\\sphericalangle NAM=\\sphericalangle NDM=90^\\circ$, $AMDN$ este dreptunghi' },
        { pts: 3, text: 'Dacă $BC=16$ cm, $EF=18$ cm și $CE=10$ cm, determină lungimea segmentului $MN$.', ans: '$AC=8\\sqrt{2}$ cm, $ME=MC=5\\sqrt{2}$ cm, $DE=9\\sqrt{2}$ cm, deci $AM=3\\sqrt{2}$ cm, $MD=4\\sqrt{2}$ cm și $MN=AD=\\sqrt{18+32}=5\\sqrt{2}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat paralelogramul $ABCD$ cu $AB=8$ cm, $BC=6$ cm și înălțimea $DE=3$ cm, $E\\in(AB)$.',
      parts: [
        { pts: 2, text: 'Arată că $DF=4$ cm, unde $DF\\perp BC$, $F\\in BC$.', ans: '$DE\\cdot AB=DF\\cdot BC$, deci $DF=3\\cdot8:6=4$ cm' },
        { pts: 3, text: 'Dacă $FG\\perp CD$, $G\\in CD$, demonstrează că semidreapta $BG$ este bisectoarea unghiului $ABC$.', ans: 'În $\\triangle CFD$, $DC=2DF$, deci $\\sphericalangle C=30^\\circ$ și $CF=4\\sqrt{3}$ cm; $CG=CF^2:CD=6$ cm $=CB$, deci $\\sphericalangle GBC=(180^\\circ-30^\\circ):2=75^\\circ=\\dfrac{\\sphericalangle ABC}{2}$, căci $\\sphericalangle ABC=150^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat un trunchi de con circular drept cu raza bazei mari $OA=6$ cm, raza bazei mici $O'A'=2$ cm și înălțimea $OO'=3$ cm.",
      parts: [
        { pts: 2, text: 'Arată că volumul trunchiului este egal cu $52\\pi\\text{ cm}^3$.', ans: '$\\mathcal{V}=\\dfrac{\\pi\\cdot3}{3}(36+4+12)=52\\pi\\text{ cm}^3$' },
        { pts: 3, text: 'Calculează aria totală a trunchiului de con.', ans: '$G=\\sqrt{3^2+4^2}=5$ cm, $\\mathcal{A}_t=\\pi\\cdot5\\cdot8+36\\pi+4\\pi=80\\pi\\text{ cm}^2$' },
      ],
      fig: fig18,
    },
  ],
}
