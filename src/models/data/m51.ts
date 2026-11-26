// Testul 20 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 112–113; every answer here is computed and checked with the book's answers, p. 277).
import type { EnModel } from '../types'
import { mid3, plane, solid, type P3 } from '../figure'
import { graph, pol, PRISM3, prism3 } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [2, 0], N: [5, 0], B: [8, 0] }, 170, { s: 'A-B', dot: 'A M N B', l: { A: 'n', M: 'n', N: 'n', B: 'n' } })
const fig8 = plane({ O: [0, 0], A: [-8, 0], B: [8, 0], C: pol(20, 8), E: pol(10, 8), F: pol(100, 8) }, 130, { s: 'A-B O-C O-E O-F', ra: ['EOF'], l: { O: 's' } })
const fig9 = plane({ B: [0, 0], C: [20, 0], A: [7.2, 9.6], M: [10, 0], N: [10, 7.5] }, 120, { s: 'A-B-C-A M-N', ra: ['BAC', 'NMC'] })
const c20 = Math.cos((20 * Math.PI) / 180) * 10, s20 = Math.sin((20 * Math.PI) / 180) * 10
const fig10 = plane({ A: [0, 0], C: [2 * c20, 0], D: [c20, s20], B: [c20, -s20] }, 140, { s: 'A-B-C-D-A A-C B-D', ang: ['CAB'] })
const fig11 = plane({ O: [0, 0], A: pol(210, 4), B: pol(330, 4) }, 100, { s: 'A-B', c: [{ at: 'O', r: 4 }], dot: 'O', l: { O: 'n' } })
// drawn taller than it is, with C moved to the left so that VC and VB do not overlap
const fig12 = solid({ A: [0, 0, 0], B: [4, 0, 0], C: [0.8, 2 * s3, 0], V: [4.8 / 3, (2 * s3) / 3, 3.5] }, 'A-B-C A-B-V B-C-V C-A-V', 120)

const fig15 = graph({ A: [-1, 3], B: [0, 1], C: [2, -3] }, 110, [-2, 3], [-4, 4], { dot: 'A B C', l: { A: 'w', B: 'e', C: 'e' } })
const fig16 = plane({ B: [0, 0], C: [12, 0], A: [0.804, 3.0], D: [0.804, 0], M: [6, 0] }, 150, { s: 'A-B-C-A A-D A-M', ra: ['BAC', 'ADC'] })
const fig17 = plane({ A: [0, 0], B: [4, 0], C: [2, 4 * s2], D: [0, 4 * s2], M: [0, 2 * s2] }, 100, { s: 'A-B-C-D-A M-B M-C', ra: ['BAD', 'ADC'], l: { M: 'w' } })
const p18: Record<string, P3> = prism3(4 * s3, 6 * s3)
const fig18 = solid({ ...p18, M: mid3(p18.A, p18.B) }, PRISM3, 120, { seg: "M-C M-C'", dot: 'M', l: { M: 'sw', A: 'w' } })

export const M51: EnModel = {
  id: 'en-51',
  title: 'Paralela 45, Testul 20',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 112–113',
  items: [
    { text: 'Numărul $238$ este un multiplu al numărului:', choices: ['$12$', '$13$', '$14$', '$19$'], ans: 2 },
    { text: 'Valoarea lui $x$ care verifică egalitatea $\\dfrac{x}{15}=\\dfrac{12}{20}$ este egală cu:', choices: ['$25$', '$16$', '$\\dfrac{27}{20}$', '$9$'], ans: 3 },
    {
      text: 'Rezultatele obținute de elevii unei clase la teza la matematică sunt prezentate în tabelul următor.\n\n| Nota | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ |\n|---|---|---|---|---|---|---|---|---|\n| Numărul de elevi | $2$ | $1$ | $2$ | $2$ | $8$ | $3$ | $7$ | $5$ |\n\nMedia generală a clasei este egală cu:',
      choices: ['$7{,}5$', '$7{,}6$', '$7$', '$8$'], ans: 0,
    },
    { text: 'Dintre numerele $\\dfrac{2}{3}$, $\\dfrac{3}{4}$, $\\dfrac{4}{5}$, $\\dfrac{5}{6}$, mai mare este numărul:', choices: ['$\\dfrac{2}{3}$', '$\\dfrac{3}{4}$', '$\\dfrac{4}{5}$', '$\\dfrac{5}{6}$'], ans: 3 },
    { text: 'Media aritmetică a numerelor $4+\\sqrt{12}$ și $4-2\\sqrt{3}$ este egală cu:', choices: ['$2$', '$8$', '$\\sqrt{3}$', '$4$'], ans: 3 },
    { text: 'Ana afirmă: „O optime din numărul $2^{10}$ înseamnă $256$”. Afirmația Anei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $M$, $N$ și $B$ sunt coliniare, $AM=2$ cm, $AB=8$ cm, iar $N$ este mijlocul segmentului $MB$. Lungimea segmentului $AN$ este:',
      choices: ['$4$ cm', '$6$ cm', '$5$ cm', '$3$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, punctele $A$, $O$, $B$ sunt coliniare, semidreapta $OE$ este bisectoarea unghiului $BOC$, iar dreptele $OF$ și $OE$ sunt perpendiculare. Dacă unghiul $BOC$ are măsura de $20^\\circ$, măsura unghiului $AOF$ este:',
      choices: ['$70^\\circ$', '$80^\\circ$', '$90^\\circ$', '$100^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este dreptunghic în $A$, $AB=12$ cm, $AC=16$ cm, iar $MN$ este mediatoarea laturii $BC$. Lungimea segmentului $MN$ este:',
      choices: ['$8$ cm', '$10$ cm', '$7{,}5$ cm', '$6$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În rombul $ABCD$ din figura alăturată, măsura unghiului $BAC$ este de $20^\\circ$. Măsura unghiului $BDC$ este:',
      choices: ['$50^\\circ$', '$60^\\circ$', '$70^\\circ$', '$80^\\circ$'], ans: 2, fig: fig10,
    },
    {
      text: 'Pe cercul $\\mathcal{C}(O,\\,R)$, din figura alăturată, cu raza $R=4$ cm, se consideră punctele $A$ și $B$, astfel încât măsura arcului mic $AB$ este $120^\\circ$. Distanța de la $O$ la dreapta $AB$ este egală cu:',
      choices: ['$2$ cm', '$2\\sqrt{3}$ cm', '$\\sqrt{3}$ cm', '$3$ cm'], ans: 0, fig: fig11,
    },
    {
      text: 'În figura alăturată, piramida triunghiulară regulată $VABC$, cu vârful $V$, are aria laterală egală cu $6\\sqrt{3}\\text{ cm}^2$ și aria totală egală cu $10\\sqrt{3}\\text{ cm}^2$. Latura bazei, $AB$, este egală cu:',
      choices: ['$2$ cm', '$3$ cm', '$4$ cm', '$6$ cm'], ans: 2, fig: fig12,
    },

    {
      text: 'Numerele $145$, $207$ și $329$, împărțite la un număr natural nenul $n$, dau resturile $1$, $3$, respectiv $5$.',
      parts: [
        { pts: 2, text: 'Stabilește dacă $n$ poate fi egal cu $16$.', ans: 'Nu: $207$ împărțit la $16$ dă restul $15$, nu $3$' },
        { pts: 3, text: 'Determină valorile numărului $n$.', ans: '$n$ divide $144$, $204$ și $324$ și $n\\ge6$; $(144,\\,204,\\,324)=12$, deci $n\\in\\{6,\\,12\\}$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=1-\\dfrac{1}{2-x}$, unde $x\\in\\mathbb{R}\\setminus\\{2\\}$.',
      parts: [
        { pts: 2, text: 'Calculează media geometrică a numerelor $a=E(-1)$ și $b=E(4)$.', ans: '$a=\\dfrac{2}{3}$, $b=\\dfrac{3}{2}$, $m_g=\\sqrt{ab}=1$' },
        { pts: 3, text: 'Arată că $E(x)\\cdot\\left(1-\\dfrac{4x-5}{x^2-1}\\right)-\\dfrac{3x^2}{x^2+x}=-2$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1,\\,2\\}$.', ans: '$E(x)=\\dfrac{x-1}{x-2}$, $1-\\dfrac{4x-5}{x^2-1}=\\dfrac{(x-2)^2}{(x-1)(x+1)}$, produsul este $\\dfrac{x-2}{x+1}$, iar $\\dfrac{x-2}{x+1}-\\dfrac{3x}{x+1}=\\dfrac{-2x-2}{x+1}=-2$' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=1-2x$ și punctele $A(-1,\\,3)$, $B(0,\\,1)$, $C(2,\\,-3)$, în sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Arată că $f(-1)-f(2)=6$.', ans: '$f(-1)-f(2)=3-(-3)=6$' },
        { pts: 3, text: 'Demonstrează că punctele $A$, $B$ și $C$ sunt coliniare.', ans: '$f(-1)=3$, $f(0)=1$, $f(2)=-3$, deci $A$, $B$, $C$ sunt pe graficul funcției $f$, o dreaptă' },
      ],
      fig: fig15,
    },
    {
      text: 'Triunghiul $ABC$, din figura alăturată, este dreptunghic în $A$, $\\sphericalangle ACB=15^\\circ$ și $BC=12$ cm. Punctul $M$ este mijlocul segmentului $BC$, iar $D$ este proiecția punctului $A$ pe $BC$.',
      parts: [
        { pts: 2, text: 'Arată că $\\sphericalangle AMB=30^\\circ$.', ans: '$AM=\\dfrac{BC}{2}=6$ cm $=MC$, deci $\\sphericalangle MAC=15^\\circ$, $\\sphericalangle AMC=150^\\circ$ și $\\sphericalangle AMB=30^\\circ$' },
        { pts: 3, text: 'Demonstrează că $DM<5{,}2$ cm.', ans: 'În $\\triangle ADM$: $AM=6$ cm, $\\sphericalangle AMD=30^\\circ$, deci $DM=3\\sqrt{3}=\\sqrt{27}$ cm $<5{,}2$ cm, fiindcă $5{,}2^2=27{,}04$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez dreptunghic cu $\\sphericalangle A=\\sphericalangle D=90^\\circ$, $AB=4$ cm, $CD=2$ cm și $AD=4\\sqrt{2}$ cm. Punctul $M$ este mijlocul segmentului $AD$.',
      parts: [
        { pts: 2, text: 'Arată că $BC=6$ cm.', ans: 'Cu $CE\\perp AB$: $CE=4\\sqrt{2}$ cm, $EB=2$ cm, deci $BC=\\sqrt{32+4}=6$ cm' },
        { pts: 3, text: 'Arată că $\\sphericalangle BMC=90^\\circ$.', ans: 'Cu $N$ mijlocul lui $BC$: $MN$ e linie mijlocie, $MN=\\dfrac{4+2}{2}=3$ cm $=\\dfrac{BC}{2}$; mediana $MN$ e jumătate din $BC$, deci $\\sphericalangle BMC=90^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "Fie $ABCA'B'C'$ o prismă triunghiulară regulată cu muchia bazei $AB=4\\sqrt{3}$ cm și înălțimea $AA'=6\\sqrt{3}$ cm. Notăm cu $M$ mijlocul muchiei $AB$.",
      parts: [
        { pts: 2, text: 'Arată că volumul prismei este egal cu $216\\text{ cm}^3$.', ans: '$\\mathcal{A}_b=\\dfrac{48\\sqrt{3}}{4}=12\\sqrt{3}\\text{ cm}^2$, $V=12\\sqrt{3}\\cdot6\\sqrt{3}=216\\text{ cm}^3$' },
        { pts: 3, text: "Determină măsura unghiului dintre planele $(MCC')$ și $(B'BC)$.", ans: "$(MCC')\\cap(B'BC)=CC'$, $BC\\perp CC'$, $MC\\perp CC'$, deci unghiul este $\\sphericalangle BCM=30^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
