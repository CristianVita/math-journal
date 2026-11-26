// Testul 44 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 163–165; every answer here is computed and checked with the book's answers, p. 285).
import type { EnModel } from '../types'
import type { P3, Pt } from '../figure'
import { mid, plane, solid } from '../figure'
import { graph, pol, TETRA } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const lab2 = (deg: number, s: string, p?: string) => [{ at: pol(deg, 3), s, anchor: 'middle' as const, size: 10 }, ...(p ? [{ at: [pol(deg, 3)[0], pol(deg, 3)[1] - 1.1] as Pt, s: p, anchor: 'middle' as const, size: 10 }] : [])]
const fig2 = plane({ O: [0, 0], X: pol(90, 5), Y: pol(-18, 5), Z: pol(-115.2, 5), W: pol(180, 5) }, 110, {
  s: 'O-X O-Y O-Z O-W', c: [{ at: 'O', r: 5 }], l: { O: '', X: '', Y: '', Z: '', W: '' },
  t: [...lab2(36, 'A', '30%'), ...lab2(-66.6, 'B', '27%'), ...lab2(-147.6, 'C', '18%'), ...lab2(135, 'D')],
})
const fig7 = plane({ A: [0, 0], B: [7, 0], C: [10, 0], D: [17, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ D: [0, 0], A: pol(40, 5), B: [5 * Math.cos((40 * Math.PI) / 180) + 1, 5 * Math.sin((40 * Math.PI) / 180) - 2 * Math.sin(Math.PI / 3)], C: [3.975, 0] }, 120, {
  s: 'A-B-C-D-A', ang: ['DAB', 'ADC'],
})
const fig9 = plane({ B: [0, 0], C: [4, 0], A: [2, 2 * s3], D: [8, 0] }, 140, { s: 'A-B-D-A A-C' })
const fig10 = plane({ M: [0, 0], N: [21, 0], P: [21, 15], D: [0, 15], A: [0, 3], B: [18, 3], C: [18, 15] }, 140, { s: 'D-M-N-P-D A-B-C', l: { A: 'w', B: 'se', C: 'n' } })
const fig11 = plane({ O: [0, 0], A: pol(190), B: pol(250), C: pol(30), D: pol(100) }, 110, { s: 'A-B-C-A A-D-C', c: [{ at: 'O', r: 1 }], ang: ['ADC', 'ACB'], l: { O: '' } })
const f12 = plane({ V: [0, 6], A: [-6, 0], B: [6, 0], O: [0, 0], T: [0, -1.5] }, 100, { s: 'A-V-B', d: 'V-O A-B', dot: 'O', l: { T: '', O: 's' } })
const r12 = f12.p.B[0] - f12.p.O[0]
const fig12 = { ...f12, e: [{ at: f12.p.O, rx: r12, ry: r12 / 4, back: true }] }

const fig15 = graph({ A: [-s2, 2], B: [0, s2], L1: [-2.3, 2.3 * (s2 - 1) + s2], L2: [3.6, 3.6 * (1 - s2) + s2] }, 150, [-2.8, 4.2], [-0.8, 3], {
  s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'n', B: 'ne' },
})
const f16 = plane({ A: [-10, 0], B: [10, 0], O: [0, 0], M: [-5 * s3, 0], N: [5 * s3, 0], P: [5 * s3, 5], Q: [-5 * s3, 5], T: [0, 10] }, 150, { s: 'A-B M-Q-P-N', dot: 'O', l: { O: 's', T: '' } })
const r16 = f16.p.B[0] - f16.p.O[0]
const fig16 = { ...f16, path: [{ d: `M${f16.p.A[0]} ${f16.p.A[1]} A${r16} ${r16} 0 0 1 ${f16.p.B[0]} ${f16.p.B[1]}` }] }
const A17 = pol(50, 5), D17: Pt = [A17[0] + 10, A17[1]]
const fig17 = plane({ B: [0, 0], C: [10, 0], A: A17, D: D17, M: mid(A17, D17) }, 150, { s: 'A-B-C-D-A B-M-C' })
const p18: Record<string, P3> = { A: [0, 0, 0], B: [6, 0, 0], C: [3, 3 * s3, 0], V: [3, s3, 3] }
const fig18 = solid({ ...p18, O: [3, s3, 0], M: [4.5, 1.5 * s3, 0] }, TETRA('A', 'B', 'C', 'V'), 130, { seg: 'V-O V-M A-M', dot: 'O' })

export const M75: EnModel = {
  id: 'en-75',
  title: 'Paralela 45, Testul 44',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 163–165',
  items: [
    { text: 'Cel mai mic număr natural, cu cifre distincte, mai mare decât $444$ este:', choices: ['$456$', '$345$', '$445$', '$450$'], ans: 3 },
    {
      text: 'În diagrama alăturată este dată repartizarea culturilor pe un teren de $120$ ha ($A$ – porumb; $B$ – grâu; $C$ – secară; $D$ – floarea soarelui). Suprafața cultivată cu floarea soarelui este egală cu:',
      choices: ['$20$ ha', '$30$ ha', '$60$ ha', '$40$ ha'], ans: 1, fig: fig2,
    },
    { text: 'Cel mai mic număr întreg care are pătratul cel mult egal cu $24$ este:', choices: ['$-5$', '$0$', '$-3$', '$-4$'], ans: 3 },
    { text: 'Rezolvând inecuația $(x-1)^2>x^2-1$, obținem:', choices: ['$x>-1$', '$x>0$', '$x<-1$', '$x<1$'], ans: 3 },
    { text: 'Un televizor costă $1380$ de lei. După o mărire a prețului cu $10\\%$, televizorul costă:', choices: ['$1242$ de lei', '$138$ de lei', '$1518$ lei', '$1418$ lei'], ans: 2 },
    { text: 'Fie $a=-\\left(\\sqrt{2}-\\sqrt{3}\\right)^2+\\left(\\sqrt{2}-1\\right)\\left(\\sqrt{2}+1\\right)-\\sqrt{24}$. Afirmația: „Numărul $a$ este irațional.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'Pe o dreaptă considerăm punctele $A$, $B$, $C$ și $D$, ca în figura de mai jos. Dacă $AD=17$ cm, $BC=3$ cm și $AC=BD$, lungimea segmentului $AB$ este:',
      choices: ['$6$ cm', '$5$ cm', '$7$ cm', '$8$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În patrulaterul convex $ABCD$ din figura alăturată, măsura unghiului $A$ este de $80^\\circ$, iar măsura unghiului $D$ este de $40^\\circ$. Suma măsurilor unghiurilor $B$ și $C$ este:',
      choices: ['$80^\\circ$', '$120^\\circ$', '$180^\\circ$', '$240^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este echilateral, iar punctul $D$ este simetricul punctului $B$ față de punctul $C$. Măsura unghiului $ADB$ este:',
      choices: ['$30^\\circ$', '$40^\\circ$', '$45^\\circ$', '$60^\\circ$'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un teren dreptunghiular $ABCD$. Dacă am mări lungimea și lățimea acestuia cu câte $3$ m, aria noului teren $DMNP$ ar fi cu $99\\text{ m}^2$ mai mare decât aria terenului inițial. Lungimea gardului care împrejmuiește terenul $ABCD$ este:',
      choices: ['$40$ m', '$50$ m', '$60$ m', '$70$ m'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată $A$, $B$, $C$, $D$ sunt puncte pe cercul $\\mathcal{C}(O,\\,R)$, astfel încât măsura unghiului $ADC$ este $100^\\circ$, iar cea a unghiului $ACB$ este $30^\\circ$. Măsura unghiului $BAC$ este:',
      choices: ['$60^\\circ$', '$70^\\circ$', '$80^\\circ$', '$50^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentat un con circular drept cu secțiunea axială triunghiul dreptunghic isoscel $VAB$ și generatoarea $VA=6\\sqrt{2}$ dm. Volumul conului este egal cu:',
      choices: ['$36\\pi\\text{ dm}^3$', '$72\\pi\\text{ dm}^3$', '$144\\pi\\text{ dm}^3$', '$216\\pi\\text{ dm}^3$'], ans: 1, fig: fig12,
    },

    {
      text: 'Se marchează o scrisoare cu $35$ de lei, folosind numai timbre de $4$ lei și de $9$ lei.',
      parts: [
        { pts: 2, text: 'Se pot folosi numai timbre de $4$ lei?', ans: 'Nu, $35$ nu se divide cu $4$' },
        { pts: 3, text: 'Câte timbre de $4$ lei se folosesc?', ans: '$4x+9y=35$, cu $y$ impar: $y=1$ dă $4x=26$ (imposibil), $y=3$ dă $x=2$; deci $2$ timbre de $4$ lei (și $3$ de $9$ lei)' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=(x-3)\\left(\\dfrac{2}{x-3}+\\dfrac{x-3}{x^2-6x+9}+\\dfrac{x+3}{x+4}:\\dfrac{x^2-9}{x^2-16}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-4,\\,-3,\\,3,\\,4\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=x-1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-4,\\,-3,\\,3,\\,4\\}$.', ans: '$E(x)=(x-3)\\left(\\dfrac{2}{x-3}+\\dfrac{1}{x-3}+\\dfrac{x-4}{x-3}\\right)=2+1+x-4=x-1$' },
        { pts: 3, text: 'Determină $n\\in\\mathbb{N}$, știind că $E(n^2-8)$ este număr prim.', ans: '$E(n^2-8)=n^2-9=(n-3)(n+3)$ este prim numai dacă $n-3=1$, adică $n=4$ ($E(8)=7$)' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\left(1-\\sqrt{2}\\right)x+\\sqrt{2}$.',
      parts: [
        { pts: 2, text: 'Află media aritmetică a numerelor $f(0)$ și $f(2)$.', ans: '$f(0)=\\sqrt{2}$, $f(2)=2-\\sqrt{2}$, deci media este $1$' },
        { pts: 3, text: 'Determină numerele raționale $a$ și $b$, dacă $A\\left(a\\sqrt{2},\\,b\\right)$ este situat pe reprezentarea grafică a funcției în sistemul de axe ortogonale $xOy$.', ans: '$b=a\\sqrt{2}-2a+\\sqrt{2}$, deci $(a+1)\\sqrt{2}=b+2a$; cum $a,\\,b\\in\\mathbb{Q}$, $a=-1$ și $b=2$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este desenat un semicerc cu centrul în $O$ și diametrul $AB=20$ cm. Dreptunghiul $MNPQ$ cu $MQ=5$ cm are vârfurile $M$ și $N$ pe $AB$, iar vârfurile $P$ și $Q$ pe semicerc.',
      parts: [
        { pts: 2, text: 'Arată că $MN=10\\sqrt{3}$ cm.', ans: 'În $\\triangle OMQ$: $OM=\\sqrt{10^2-5^2}=5\\sqrt{3}$ cm; la fel $ON=5\\sqrt{3}$ cm, deci $MN=10\\sqrt{3}$ cm' },
        { pts: 3, text: 'Calculează măsura unghiului $ABQ$.', ans: '$\\sin(\\sphericalangle QOM)=\\dfrac{5}{10}$, deci $\\sphericalangle AOQ=30^\\circ$ și $\\sphericalangle ABQ=\\dfrac{1}{2}\\sphericalangle AOQ=15^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este paralelogram, iar $BM$ și $CM$ sunt bisectoarele unghiurilor $B$ și $C$.',
      parts: [
        { pts: 2, text: 'Arată că măsura unghiului $BMC$ este de $90^\\circ$.', ans: '$\\sphericalangle BMC=180^\\circ-\\dfrac{\\sphericalangle B+\\sphericalangle C}{2}=180^\\circ-90^\\circ=90^\\circ$' },
        { pts: 3, text: 'Dacă punctele $A$, $M$, $D$ sunt coliniare, demonstrează că $AD=2AB$.', ans: 'Triunghiurile $ABM$ și $DCM$ sunt isoscele (unghiuri alterne), cu $AM=AB$ și $DM=DC=AB$, deci $AD=2AB$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată, $VABC$ este o piramidă triunghiulară regulată cu înălțimea $VO=3$ cm și apotema $VM=2\\sqrt{3}$ cm, $M\\in BC$.',
      parts: [
        { pts: 2, text: 'Arată că $AB=6$ cm.', ans: '$OM=\\sqrt{12-9}=\\sqrt{3}$ cm, $AM=3OM=3\\sqrt{3}$ cm și $AM=\\dfrac{AB\\sqrt{3}}{2}$, deci $AB=6$ cm' },
        { pts: 3, text: 'Calculează tangenta unghiului format de dreapta $VB$ cu planul $(VAM)$.', ans: '$BC\\perp AM$, $BC\\perp VM$, deci $BM\\perp(VAM)$ și unghiul este $\\sphericalangle BVM$: $\\operatorname{tg}=\\dfrac{BM}{VM}=\\dfrac{3}{2\\sqrt{3}}=\\dfrac{\\sqrt{3}}{2}$' },
      ],
      fig: fig18,
    },
  ],
}
