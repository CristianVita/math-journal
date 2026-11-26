// Testul 41 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 156–158; every answer here is computed and checked with the book's answers, p. 284).
import type { EnModel } from '../types'
import type { P3, Pt } from '../figure'
import { plane, solid } from '../figure'
import { graph, pol, TETRA } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [5, 0], C: [11, 0], D: [18, 0] }, 160, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const C8: Pt = [6, 0]
const fig8 = plane({ A: [0, 0], C: C8, B: pol(30, 7), D: pol(30, 3, C8) }, 120, { s: 'A-B A-C-D', ang: ['BAC', 'ACD'] })
const fig9 = plane({ B: [0, 0], A: [6, 0], C: [3, 3 * s3], M: [2, 2 * s3] }, 90, { s: 'A-B-C-A', dot: 'M', l: { M: 'w' } })
const fig10 = plane({ A: [0, 0], B: [18, 0], C: [6, 5], D: [0, 5] }, 140, { s: 'A-B-C-D-A', ra: ['DAB'] })
const fig11 = plane({ O: [0, 0], A: [-4, 3], B: [4, 3], D: [-3, 4], C: [-3, -4], P: [-3, 3] }, 110, { s: 'A-B D-C', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 'e', P: 'ne' } })

const fig15 = graph({ L1: [-3.5, -4.5], L2: [5, 4] }, 120, [-4.5, 5.5], [-5, 4.5], { s: 'L1-L2', l: { L1: '', L2: '' } })
const A16 = pol(75, 4 * Math.cos((75 * Math.PI) / 180)), AC16 = 4 * Math.sin((75 * Math.PI) / 180), AB16 = 4 * Math.cos((75 * Math.PI) / 180)
const fig16 = plane({ A: A16, B: [0, 0], C: [4, 0], D: [A16[0], 0], E: [(4 * AB16) / (AB16 + AC16), 0], F: [2, 0] }, 180, { s: 'A-B-C-A A-D A-E A-F', ra: ['ADC'] })
const fig17 = plane({ A: [0, 0], B: [60, 0], C: [60, 50], D: [0, 50], E: [10, 0], F: [10, 10], G: [0, 10], H: [50, 50], I: [50, 40], J: [60, 40] }, 130, {
  s: 'A-B-C-D-A E-F-G H-I-J', l: { F: 'ne', I: 'sw' },
})
const l18 = 6 * s2, y18 = (l18 * s3) / 2
const p18: Record<string, P3> = { A: [0, y18, 0], B: [l18 / 2, 0, 0], C: [l18, y18, 0], V: [l18 / 2, (2 * y18) / 3, 2 * s3] }
const fig18 = solid(p18, TETRA('A', 'B', 'C', 'V'), 120)

export const M72: EnModel = {
  id: 'en-72',
  title: 'Paralela 45, Testul 41',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 156–158',
  items: [
    { text: 'Rezultatul calculului $5-24:(-6)$ este egal cu:', choices: ['$9$', '$10$', '$11$', '$14$'], ans: 0 },
    {
      text: 'În tabelul de mai jos este prezentată contribuția fiecăruia dintre cei patru muncitori, Costel, Nicolae, Remus și Vasile, care au colaborat pentru finalizarea unei lucrări.\n\n| Numele | Costel | Nicolae | Remus | Vasile |\n|---|---|---|---|---|\n| Contribuția | $20\\%$ | $30\\%$ | $10\\%$ | $40\\%$ |\n\nCei patru muncitori sunt plătiți proporțional cu volumul de muncă depusă pentru realizarea lucrării. Dacă Nicolae a primit $3600$ de lei, atunci Vasile a primit:',
      choices: ['$3600$ de lei', '$4000$ de lei', '$4800$ de lei', '$6000$ de lei'], ans: 2,
    },
    { text: 'Numărul divizorilor întregi ai numărului $6$ este:', choices: ['$2$', '$4$', '$6$', '$8$'], ans: 3 },
    { text: 'Cel mai mic dintre numerele $-\\dfrac{2}{3}$, $-\\dfrac{3}{20}$, $-\\dfrac{8}{15}$ și $-\\dfrac{9}{8}$ este:', choices: ['$-\\dfrac{2}{3}$', '$-\\dfrac{3}{20}$', '$-\\dfrac{8}{15}$', '$-\\dfrac{9}{8}$'], ans: 3 },
    {
      text: 'În tabelul alăturat sunt scrise patru inegalități între numere reale.\n\n| | |\n|---|---|\n| A | $2\\sqrt{6}<2\\sqrt{7}<3\\sqrt{3}$ |\n| B | $2\\sqrt{6}<3\\sqrt{3}<2\\sqrt{7}$ |\n| C | $3\\sqrt{3}<2\\sqrt{6}<2\\sqrt{7}$ |\n| D | $2\\sqrt{7}<3\\sqrt{3}<2\\sqrt{6}$ |\n\nRelația corectă este:',
      choices: ['A', 'B', 'C', 'D'], ans: 1,
    },
    { text: 'Andrei afirmă că „Numărul $\\pi$ aparține intervalului $\\left(3,\\,\\dfrac{7}{2}\\right)$.” Afirmația sa este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine, astfel încât $AB<BC<CD$ și $AD=18$ cm. Lungimile segmentelor $AB$, $BC$ și $CD$, exprimate în centimetri, sunt trei numere naturale consecutive. Lungimea segmentului $AC$ este egală cu:',
      choices: ['$10$ cm', '$11$ cm', '$12$ cm', '$13$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $AB$ și $CD$ sunt paralele, iar măsura unghiului $ACD$ este de cinci ori mai mare decât măsura unghiului $BAC$. Măsura unghiului $BAC$ este:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$20^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi echilateral $ABC$ cu latura de $6$ cm. Punctul $M$ aparține laturii $BC$ și $BM=2MC$. Distanța de la $M$ la dreapta $AB$ este egală cu:',
      choices: ['$\\sqrt{3}$ cm', '$2$ cm', '$2\\sqrt{3}$ cm', '$3\\sqrt{3}$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez dreptunghic $ABCD$, cu baza mică $CD=6$ m și laturile $AD=5$ m, respectiv $BC=13$ m. Aria trapezului $ABCD$ este:',
      choices: ['$40\\text{ m}^2$', '$60\\text{ m}^2$', '$80\\text{ m}^2$', '$100\\text{ m}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată sunt desenate două coarde perpendiculare, $AB=CD=8$ cm, ale cercului cu centrul în $O$ și raza de $5$ cm. Dacă $P$ este punctul comun al celor două coarde, atunci lungimea segmentului $OP$ este:',
      choices: ['$3$ cm', '$4$ cm', '$3\\sqrt{2}$ cm', '$4\\sqrt{3}$ cm'], ans: 2, fig: fig11,
    },
    {
      text: 'O găleată are forma unui trunchi de con circular drept cu raza bazei mici de $10$ cm, raza bazei mari de $15$ cm și înălțimea de $27$ cm. Cantitatea maximă de apă care încape în găleată este de aproximativ:',
      choices: ['$13\\ \\ell$', '$14\\ \\ell$', '$15\\ \\ell$', '$16\\ \\ell$'], ans: 0,
    },

    {
      text: 'Sorina a citit o carte în $4$ zile astfel: în prima zi a citit $25\\%$ din carte, a doua zi a citit $\\dfrac{1}{3}$ din rest, a treia zi a citit $50\\%$ din noul rest, iar a patra zi a citit ultimele $50$ de pagini.',
      parts: [
        { pts: 2, text: 'Află câte pagini a citit Sorina în a treia zi.', ans: 'În a treia zi a citit jumătate din ce rămăsese, deci cât în a patra zi: $50$ de pagini' },
        { pts: 3, text: 'Determină câte pagini are cartea citită de Sorina.', ans: 'Fiecare zi a citit $\\dfrac{1}{4}$ din carte ($\\dfrac{1}{3}\\cdot\\dfrac{3}{4}=\\dfrac{1}{4}$, $\\dfrac{1}{2}\\cdot\\dfrac{1}{2}=\\dfrac{1}{4}$), deci cartea are $4\\cdot50=200$ de pagini' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{(x^2+2x+2)^2-1}{(x^2+2x)(x^2+2x+5)+6}$, unde $x\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Arată că $(x^2+2x)(x^2+2x+5)+6=(x^2+2x+2)(x^2+2x+3)$, pentru orice $x\\in\\mathbb{R}$.', ans: 'Cu $a=x^2+2x$: $a(a+5)+6=a^2+5a+6=(a+2)(a+3)$' },
        { pts: 3, text: 'Determină valoarea minimă a lui $E(x)$, $x\\in\\mathbb{R}$.', ans: '$E(x)=\\dfrac{(a+1)(a+3)}{(a+2)(a+3)}=\\dfrac{(x+1)^2}{(x+1)^2+1}\\geq0$ și $E(-1)=0$, deci valoarea minimă este $0$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x-1$.',
      parts: [
        { pts: 2, text: 'Calculează $f(a)+f(-a)+2$, unde $a$ este un număr real oarecare.', ans: '$a-1-a-1+2=0$' },
        { pts: 3, text: 'Determină coordonatele punctelor $P$, situate pe reprezentarea grafică a funcției $f$, știind că $OP=5$, unde $O$ este originea sistemului de axe ortogonale $xOy$.', ans: '$P(t,\\,t-1)$, $t^2+(t-1)^2=25\\Leftrightarrow t^2-t-12=0$, deci $P_1(-3,\\,-4)$ și $P_2(4,\\,3)$' },
      ],
      fig: fig15,
    },
    {
      text: 'Triunghiul $ABC$ din figura alăturată are $\\sphericalangle BAC=90^\\circ$ și $\\sphericalangle ACB=15^\\circ$. În triunghiul $ABC$, $AD$ este înălțime, $AE$ este bisectoare, iar $AF$ este mediană.',
      parts: [
        { pts: 2, text: 'Arată că $2AD=AF$.', ans: '$AF=FC$, deci $\\sphericalangle AFD=2\\cdot15^\\circ=30^\\circ$ și, în $\\triangle ADF$ dreptunghic, $AD=\\dfrac{AF}{2}$' },
        { pts: 3, text: 'Demonstrează că $AE=EF$.', ans: '$\\sphericalangle EAF=\\sphericalangle BAF-\\sphericalangle BAE=75^\\circ-45^\\circ=30^\\circ=\\sphericalangle EFA$, deci $AE=EF$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un teren dreptunghiular $ABCD$ cu dimensiunile $AB=60$ m și $BC=50$ m. Pătratele egale $AEFG$ și $CHIJ$ cu laturile de $10$ m reprezintă două parcuri amplasate în colțurile opuse ale terenului.',
      parts: [
        { pts: 2, text: 'Află distanța dintre colțurile $F$ și $I$ ale celor două parcuri.', ans: 'Paralela prin $I$ la $BC$ și paralela prin $F$ la $AB$ se taie în $P$: $PF=40$ m, $PI=30$ m, deci $FI=50$ m' },
        { pts: 3, text: 'Demonstrează că dacă pe terenul $ABCD$ s-ar construi o piscină circulară cu diametrul $FI$, aceasta ar fi tangentă laturilor $AB$ și $CD$ în mijloacele acestora.', ans: 'Centrul $O$ (mijlocul lui $FI$) e la $25$ m de $AB$ și de $CD$, iar $OM\\perp AB$ cu $M$ mijlocul lui $AB$; cum raza este $\\dfrac{FI}{2}=25$ m, cercul e tangent în $M$ lui $AB$ și, la fel, în mijlocul lui $CD$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă triunghiulară regulată $VABC$ cu vârful $V$, $AB=6\\sqrt{2}$ cm și $\\sphericalangle AVB=90^\\circ$.',
      parts: [
        { pts: 2, text: 'Calculează distanța de la punctul $A$ la planul $(VBC)$.', ans: '$\\sphericalangle CVA=\\sphericalangle AVB=90^\\circ$, deci $VA\\perp(VBC)$ și distanța este $VA=6$ cm' },
        { pts: 3, text: 'Determină tangenta unghiului format de dreapta $VA$ cu planul $(ABC)$.', ans: 'Fie $M$ mijlocul lui $BC$: $VM=3\\sqrt{2}$ cm; proiecția lui $VA$ pe $(ABC)$ este $AM$, deci $\\operatorname{tg}=\\operatorname{tg}(\\sphericalangle VAM)=\\dfrac{VM}{VA}=\\dfrac{\\sqrt{2}}{2}$' },
      ],
      fig: fig18,
    },
  ],
}
