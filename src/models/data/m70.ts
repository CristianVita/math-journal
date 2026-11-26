// Testul 39 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 152–154; every answer here is computed and checked with the book's answers, p. 283).
import type { EnModel } from '../types'
import type { Fig, Pt } from '../figure'
import { mid, plane } from '../figure'
import { graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [15, 0], N: [16, 0], B: [40, 0] }, 170, { s: 'A-B', dot: 'A M N B', l: { A: 's', M: 'sw', N: 'se', B: 's' } })
const fig8 = plane({ O: [0, 0], D: pol(75, 5), C: pol(45, 5), A: pol(165, 5), B: pol(-45, 5) }, 110, { s: 'O-A O-B O-C O-D' })
const fig9 = plane({ A: [0, 0], B: [7, 0], C: [7, 24], D: [14, 24] }, 80, { s: 'A-B-D-C-A B-C', ra: ['ABC'] })
const h10: Record<string, Pt> = { A: pol(90, 2), B: pol(30, 2), C: pol(-30, 2), D: pol(-90, 2), E: pol(-150, 2), F: pol(150, 2), O: [0, 0] }
const fig10 = plane({ ...h10, M: mid(h10.A, h10.B) }, 110, { s: 'A-B-C-D-E-F-A M-O-E', hatch: ['M-O-E-F-A'], l: { O: 'e' } })
const fig11 = plane({ O: [0, 0], B: [-6.25, 0], C: [6.25, 0], A: [1.75, 6] }, 120, { s: 'A-B-C-A', c: [{ at: 'O', r: 6.25 }], l: { O: '' } })
const fig12: Fig = {
  w: 100, h: 110,
  p: { D: [10, 12], C: [90, 12], A: [10, 92], B: [90, 92] },
  l: { D: 'w', C: 'e', A: 'w', B: 'e' },
  s: 'A-D B-C D-C',
  d: 'A-B',
  e: [{ at: [50, 12], rx: 40, ry: 10 }, { at: [50, 92], rx: 40, ry: 10, back: true }],
}

const fig15 = graph({ A: [3, 0], B: [0, 6], P: [-1, 8], Q: [-1, 0], F1: [-1.5, 9], F2: [3.5, -1], G1: [-4, 5], G2: [0, 9] }, 150, [-4.5, 4.5], [-1.5, 9.5], {
  s: 'F1-F2 G1-G2', d: 'P-Q', dot: 'A B P', l: { F1: '', F2: '', G1: '', G2: '', Q: '', A: 'ne', B: 'e', P: 'w' },
  t: [{ at: [2.4, 2.6], s: 'f', italic: true }, { at: [-3.4, 3.2], s: 'g', italic: true }],
})
const fig16 = plane({ A: [0, 0], B: [0, 12], P: [12 * s3, 0], C: [24 * s3, 0], D: [24 * s3, 36] }, 130, { s: 'A-C A-B-P-D-C', ra: ['BAP', 'DCP'] })
const fig17 = plane({ B: [0, 0], C: [10 * s3, 0], A: [5 * s3, 5], D: [(20 * s3) / 3, 0] }, 150, { s: 'A-B-C-A A-D' })
const f18 = plane({ V: [0, 4], A: [-3, 0], B: [3, 0], O: [0, 0], T: [0, -1] }, 90, { s: 'A-V-B', d: 'V-O A-B', dot: 'O', l: { T: '', O: 's' } })
const r18 = f18.p.B[0] - f18.p.O[0]
const fig18 = { ...f18, e: [{ at: f18.p.O, rx: r18, ry: r18 / 4, back: true }] }

export const M70: EnModel = {
  id: 'en-70',
  title: 'Paralela 45, Testul 39',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 152–154',
  items: [
    { text: 'Numărul perechilor ordonate $(x,\\,y)$ pentru care numărul $\\overline{1xy}$ se divide cu $2$ și cu $9$ este:', choices: ['$4$', '$5$', '$6$', '$7$'], ans: 2 },
    {
      text: 'În tabelul de mai jos sunt prezentate prețurile a patru produse, $A$, $B$, $C$, $D$, înainte și după o ieftinire.\n\n| Produsul | $A$ | $B$ | $C$ | $D$ |\n|---|---|---|---|---|\n| Prețul inițial | $200$ de lei | $1000$ de lei | $80$ de lei | $250$ de lei |\n| Prețul redus | $180$ de lei | $950$ de lei | $56$ de lei | $200$ de lei |\n\nCel mai mare procent cu care s-a redus prețul unuia dintre cele patru produse este:',
      choices: ['$20\\%$', '$30\\%$', '$40\\%$', '$50\\%$'], ans: 1,
    },
    { text: 'Rezultatul calculului $1-2+3-4+5-6+7-8+9-10$ este:', choices: ['$-55$', '$-10$', '$-5$', '$0$'], ans: 2 },
    { text: 'Cel mai mic numitor comun al fracțiilor $\\dfrac{3}{10}$, $\\dfrac{7}{12}$ și $\\dfrac{1}{15}$ este:', choices: ['$10$', '$30$', '$60$', '$120$'], ans: 2 },
    {
      text: 'În tabelul alăturat sunt înscrise patru valori ale numărului $\\overline{ab}$. Dintre aceste valori, cea pentru care numărul $\\sqrt{\\overline{ab}+\\overline{ba}}$ nu aparține lui $\\mathbb{N}$ este:\n\n| | I | II | III | IV |\n|---|---|---|---|---|\n| $\\overline{ab}$ | $16$ | $38$ | $56$ | $92$ |',
      choices: ['I', 'II', 'III', 'IV'], ans: 0,
    },
    { text: 'Apa plată Armonia se vinde doar în pachete de $6$, $12$ sau $24$ de sticle. Propoziția: „Trebuie să cumpărăm minim $6$ pachete pentru a avea exact $90$ de sticle de apă plată Armonia.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, segmentul $AB=40$ cm, iar $M$ și $N$ sunt două puncte situate pe segmentul $AB$ astfel încât $\\dfrac{MA}{MB}=\\dfrac{3}{5}$ și $\\dfrac{NA}{NB}=\\dfrac{2}{3}$. Lungimea segmentului $MN$ este egală cu:',
      choices: ['$1$ cm', '$3$ cm', '$5$ cm', '$4$ cm'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiurile $AOB$, $BOC$, $COD$ și $DOA$, formate în jurul punctului $O$, astfel încât $\\sphericalangle AOD=\\sphericalangle BOC=90^\\circ$. Dacă $\\sphericalangle AOB=5\\cdot\\sphericalangle DOC$, atunci măsura unghiului $DOC$ este egală cu:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$50^\\circ$', '$60^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$ cu ipotenuza $AC=25$ cm, cateta $AB=7$ cm, iar $D$ este simetricul punctului $A$ față de mijlocul segmentului $BC$. Aria triunghiului $DCA$ este egală cu:',
      choices: ['$168\\text{ cm}^2$', '$84\\text{ cm}^2$', '$42\\text{ cm}^2$', '$62\\text{ cm}^2$'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un hexagon regulat $ABCDEF$ cu centrul în $O$ și latura $AB=2$ m. Punctul $M$ este mijlocul laturii $AB$. Aria suprafeței hașurate este aproximativ:',
      choices: ['$1\\text{ m}^2$', '$2\\text{ m}^2$', '$3\\text{ m}^2$', '$4\\text{ m}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată este desenat triunghiul $ABC$ cu $AB=10$ cm, $BC=12{,}5$ cm, $CA=7{,}5$ cm și cercul său circumscris. Lungimea cercului este egală cu:',
      choices: ['$10\\pi$ cm', '$12\\pi$ cm', '$12{,}5\\pi$ cm', '$14\\pi$ cm'], ans: 2, fig: fig11,
    },
    {
      text: 'Secțiunea axială a unui cilindru circular drept este un pătrat $ABCD$ având perimetrul egal cu $16$ cm. Aria totală a cilindrului este egală cu:',
      choices: ['$48\\pi\\text{ cm}^2$', '$24\\pi\\text{ cm}^2$', '$16\\pi\\text{ cm}^2$', '$32\\pi\\text{ cm}^2$'], ans: 1, fig: fig12,
    },

    {
      text: 'La un concurs de șah, primii trei concurenți au obținut împreună $35$ de puncte. Primul clasat are cu un punct mai mult decât al doilea, iar al treilea are cu jumătate de punct mai puțin decât al doilea.',
      parts: [
        { pts: 2, text: 'Este posibil ca primul clasat să aibă $12$ puncte? Justifică răspunsul dat.', ans: 'Nu: ar fi $12+11+10{,}5=33{,}5\\neq35$ de puncte' },
        { pts: 3, text: 'Determină câte puncte are fiecare dintre cei trei concurenți.', ans: '$(x+1)+x+(x-0{,}5)=35$, $x=11{,}5$: $12{,}5$, $11{,}5$ și $11$ puncte' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x^3-2x^2}{2x^2}-\\dfrac{x^2-4}{4x}\\right):\\dfrac{x-2}{2}+\\dfrac{1}{2}$, unde $x\\in\\mathbb{R}\\setminus\\{0,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=1-\\dfrac{1}{x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{0,\\,2\\}$.', ans: '$\\dfrac{x-2}{2}-\\dfrac{(x-2)(x+2)}{4x}=\\dfrac{(x-2)^2}{4x}$, deci $E(x)=\\dfrac{x-2}{2x}+\\dfrac{1}{2}=\\dfrac{2x-2}{2x}=1-\\dfrac{1}{x}$' },
        { pts: 3, text: 'Calculează $E(3)\\cdot E(4)\\cdot E(5)\\cdot E(6)\\cdot E(7)\\cdot E(8)$.', ans: '$\\dfrac{2}{3}\\cdot\\dfrac{3}{4}\\cdot\\dfrac{4}{5}\\cdot\\dfrac{5}{6}\\cdot\\dfrac{6}{7}\\cdot\\dfrac{7}{8}=\\dfrac{1}{4}$' },
      ],
    },
    {
      text: 'Se consideră funcțiile $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=6-2x$ și $g:\\mathbb{R}\\to\\mathbb{R}$, $g(x)=x+m$, unde $m\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Găsește coordonatele punctelor de intersecție a reprezentării grafice a funcției $f$ cu axele sistemului de axe ortogonale $xOy$.', ans: '$A(3,\\,0)$ și $B(0,\\,6)$' },
        { pts: 3, text: 'Determină constanta $m$, știind că reprezentările grafice ale celor două funcții, în sistemul de axe ortogonale $xOy$, se intersectează într-un punct de abscisă $-1$.', ans: '$f(-1)=8=g(-1)=-1+m$, deci $m=9$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată sunt reprezentate schematic două turnuri $AB$ și $CD$. Din punctul $P$, mijlocul segmentului $AC$, cele două turnuri se văd sub unghiurile $\\sphericalangle APB=30^\\circ$ și $\\sphericalangle CPD=60^\\circ$. Se știe că $AB$ și $CD$ sunt perpendiculare pe $AC$ și $AB=12$ m.',
      parts: [
        { pts: 2, text: 'Arată că lungimea segmentului $AP$ este mai mică de $21$ m.', ans: '$AP=\\dfrac{AB}{\\operatorname{tg}30^\\circ}=12\\sqrt{3}=\\sqrt{432}<\\sqrt{441}=21$ m' },
        { pts: 3, text: 'Calculează înălțimea turnului $CD$.', ans: '$CP=AP=12\\sqrt{3}$ m și $\\operatorname{tg}60^\\circ=\\dfrac{CD}{CP}=\\sqrt{3}$, deci $CD=36$ m' },
      ],
      fig: fig16,
    },
    {
      text: 'Triunghiul isoscel $ABC$ din figura alăturată are $\\sphericalangle BAC=120^\\circ$ și $AB=10$ cm. Punctul $D$ aparține laturii $BC$, astfel încât $DA=DC$.',
      parts: [
        { pts: 2, text: 'Determină măsura unghiului $BAD$.', ans: '$\\sphericalangle ACB=30^\\circ=\\sphericalangle CAD$, deci $\\sphericalangle BAD=120^\\circ-30^\\circ=90^\\circ$' },
        { pts: 3, text: 'Calculează valoarea produsului $CD\\cdot CB$ (considerând lungimile segmentelor exprimate în centimetri).', ans: '$\\triangle CDA\\sim\\triangle CAB$, deci $\\dfrac{CD}{CA}=\\dfrac{CA}{CB}$ și $CD\\cdot CB=CA^2=100$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este desenat un con circular drept cu perimetrul secțiunii axiale $VAB$ egal cu $16$ cm și înălțimea $VO$ $(O\\in AB)$. Cosinusul unghiului format de generatoarea $VA$ cu planul bazei conului este de $\\dfrac{3}{5}$.',
      parts: [
        { pts: 2, text: 'Arată că $OA=3$ cm și $VO=4$ cm.', ans: '$2G+2R=16$ și $\\dfrac{R}{G}=\\dfrac{3}{5}$, deci $R=OA=3$ cm, $G=5$ cm și $VO=\\sqrt{25-9}=4$ cm' },
        { pts: 3, text: 'Se secționează conul cu un plan paralel cu baza, astfel încât volumul trunchiului de con format să fie de $7$ ori mai mare decât volumul conului mic. Află distanța de la vârful conului la planul de secțiune.', ans: 'Volumul conului mare este de $8$ ori volumul conului mic, deci raportul de asemănare este $2$ și distanța este $\\dfrac{VO}{2}=2$ cm' },
      ],
      fig: fig18,
    },
  ],
}
