// Testul 47 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 169–171; every answer here is computed and checked with the book's answers, p. 286).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { meet, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [2, 0], C: [3, 0], D: [6, 0] }, 160, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const A9 = pol(50, 5 * Math.cos((50 * Math.PI) / 180)), a9 = 5, b9 = Math.hypot(A9[0] - 5, A9[1]), c9 = Math.hypot(A9[0], A9[1])
const I9: Pt = [(a9 * A9[0] + c9 * 5) / (a9 + b9 + c9), (a9 * A9[1]) / (a9 + b9 + c9)]
const fig9 = plane({ A: A9, B: [0, 0], C: [5, 0], I: I9 }, 140, { s: 'A-B-C-A B-I-C', ra: ['BAC'], l: { I: 'n' } })
const A10: Pt = [0, 0], C10: Pt = [8, 3], D10: Pt = [2, 3], M10: Pt = [3, 0]
const fig10 = plane({ A: A10, B: [6, 0], C: C10, D: D10, M: M10, N: meet(A10, C10, D10, M10) }, 140, { s: 'A-B-C-D-A A-C D-M', l: { N: 'n' } })
const fig11 = plane({ B: [0, 0], D: [9, 0], C: [25, 0], A: [9, 12] }, 140, { s: 'A-B-C-A A-D', ra: ['ADC', 'BAC'] })
const f12 = plane({ V: [0, 4.5], A: [-4, 0], B: [4, 0], O: [0, 0], T: [0, -1] }, 90, { s: 'A-V-B', d: 'V-O A-B', dot: 'O', l: { T: '', O: 's' } })
const r12 = f12.p.B[0] - f12.p.O[0]
// drawn taller than the real height 3, as in the book
const fig12 = { ...f12, e: [{ at: f12.p.O, rx: r12, ry: r12 / 4, back: true }] }

const fig15 = graph({ M: [3, 2], L1: [-0.25, -4.5], L2: [3.8, 3.6] }, 110, [-1.5, 4.5], [-5, 4], { s: 'L1-L2', dot: 'M', l: { L1: '', L2: '', M: 'e' } })
const fig16 = plane({ A: [0, 0], B: [2 * s3, 0], C: [2 * s3, 3], D: [0, 3], O: [s3, 3], M: [2 * s3, 2] }, 120, { s: 'A-B-C-D-A A-O-M', l: { O: 'n', M: 'e' } })
const t17 = 6 * (2 - s3)
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], M: [0, t17], N: [6 - t17, 6] }, 120, { s: 'A-B-C-D-A M-N B-M B-N', d: 'A-C' })
// the box is drawn shorter than its real height 6√6, as in the book
const fig18 = solid({ ...box(6, 6, 9), O: [3, 3, 3 * s2] }, BOX, 130, { seg: "O-A O-B O-C O-D A-C'", l: { O: 'n' } })

export const M78: EnModel = {
  id: 'en-78',
  title: 'Paralela 45, Testul 47',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 169–171',
  items: [
    { text: 'Cel mai mare divizor, număr prim, al numărului $408$ este:', choices: ['$2$', '$17$', '$51$', '$3$'], ans: 1 },
    {
      text: 'Patru elevi, Andrei, Maria, Ionel și Viorica, trebuie să efectueze următorul calcul: $6-(-2)^2+(-2)^3:(-2)^2$. Cei patru elevi obțin răspunsurile din tabelul următor.\n\n| Elevul | Andrei | Maria | Ionel | Viorica |\n|---|---|---|---|---|\n| Rezultatul | $4$ | $0$ | $8$ | $-4$ |\n\nRăspunsul corect este dat de:',
      choices: ['Andrei', 'Maria', 'Ionel', 'Viorica'], ans: 1,
    },
    { text: 'Doi centimetri dintr-o fotografie reprezintă $45$ m în realitate. Dacă înălțimea unui copac în această fotografie este $0{,}24$ cm, înălțimea reală a copacului este:', choices: ['$5$ m', '$5{,}4$ m', '$5{,}1$ m', '$5{,}04$ m'], ans: 1 },
    { text: 'Dintre numerele $x=\\dfrac{2}{3}$, $y=0{,}8$, $z=\\left(1\\dfrac{1}{5}\\right)^{-1}$, $t=0{,}75$, mai mare este:', choices: ['$x$', '$y$', '$z$', '$t$'], ans: 2 },
    { text: 'Considerăm numerele $a=\\sqrt{5}-\\sqrt{3}$, $b=\\sqrt{5}+\\sqrt{3}$. Valoarea numărului $\\left(2\\sqrt{3}+a-b-1\\right)^{2021}$ este:', choices: ['$1$', '$0$', '$-1$', '$\\left(4\\sqrt{3}-1\\right)^{2021}$'], ans: 2 },
    { text: 'Vlad afirmă că: „Suma oricăror două numere iraționale este un număr irațional”. Afirmația lui Vlad este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura următoare considerăm punctele coliniare $A$, $B$, $C$, $D$, în această ordine. Dacă lungimea segmentului $AB$ este de două ori mai mare decât lungimea segmentului $BC$, iar lungimea segmentului $BD$ este $\\dfrac{2}{3}$ din lungimea segmentului $AD$, atunci valoarea raportului $\\dfrac{AB}{CD}$ este egală cu:',
      choices: ['$\\dfrac{1}{2}$', '$\\dfrac{3}{4}$', '$2$', '$\\dfrac{2}{3}$'], ans: 3, fig: fig7,
    },
    { text: "Un unghi are măsura de $76^\\circ30'$. Măsura suplementului unghiului este:", choices: ["$103^\\circ30'$", "$93^\\circ30'$", "$13^\\circ30'$", "$104^\\circ30'$"], ans: 0 },
    {
      text: 'În figura alăturată este desenat triunghiul $ABC$ dreptunghic în $A$. Bisectoarele unghiurilor $B$ și $C$ se intersectează în $I$. Măsura unghiului $BIC$ este:',
      choices: ['$120^\\circ$', '$130^\\circ$', '$135^\\circ$', '$140^\\circ$'], ans: 2, fig: fig9,
    },
    {
      text: 'Paralelogramul $ABCD$ din figura alăturată are diagonala $AC=30$ cm. Punctul $M$ este mijlocul laturii $AB$, iar punctul $N$ este intersecția dreptelor $AC$ și $DM$. Lungimea segmentului $AN$ este:',
      choices: ['$5$ cm', '$10$ cm', '$12$ cm', '$6$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AD=12$ m este un stâlp vertical, iar $AB=15$ m și $AC$ sunt cabluri de susținere. Dacă punctele $B$, $D$, $C$ sunt coliniare, iar unghiul $BAC$ are $90^\\circ$, lungimea cablului $AC$ este:',
      choices: ['$15$ m', '$16$ m', '$18$ m', '$20$ m'], ans: 3, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentat un cort din pânză în formă de con circular drept cu înălțimea de $3$ m și raza bazei de $4$ m. Dacă folosim în calcule valoarea aproximativă $\\pi=3{,}14$, aria suprafeței din pânză din care este confecționat cortul (fără bază) este egală cu:',
      choices: ['$31{,}4\\text{ m}^2$', '$62{,}8\\text{ m}^2$', '$94{,}2\\text{ m}^2$', '$157\\text{ m}^2$'], ans: 1, fig: fig12,
    },

    {
      text: 'Un fermier a plecat la piață să vândă $80$ kg de cireșe cu $2$ lei kilogramul. Din cauza căldurii, $20\\%$ din cantitatea de cireșe s-a stricat în timpul drumului.',
      parts: [
        { pts: 2, text: 'Ce sumă de bani preconiza fermierul să obțină?', ans: '$80\\cdot2=160$ de lei' },
        { pts: 3, text: 'Cu ce preț trebuie să vândă cireșele rămase pentru a obține suma preconizată?', ans: 'Au rămas $80-16=64$ kg, deci prețul este $160:64=2{,}5$ lei pe kilogram' },
      ],
    },
    {
      text: 'Fie $E(x)=\\dfrac{x-1}{2}-\\dfrac{x-1}{x+1}\\cdot\\left[x-1:\\left(1-\\dfrac{x-1}{x+1}\\right)\\right]$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x-1}{x+1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: '$1:\\dfrac{2}{x+1}=\\dfrac{x+1}{2}$, paranteza este $\\dfrac{x-1}{2}$, deci $E(x)=\\dfrac{x-1}{2}\\left(1-\\dfrac{x-1}{x+1}\\right)=\\dfrac{x-1}{2}\\cdot\\dfrac{2}{x+1}=\\dfrac{x-1}{x+1}$' },
        { pts: 3, text: 'Demonstrează că $E\\left(\\sqrt{3}\\right)+\\sqrt{3}$ este număr natural.', ans: '$E\\left(\\sqrt{3}\\right)=\\dfrac{\\sqrt{3}-1}{\\sqrt{3}+1}=\\dfrac{\\left(\\sqrt{3}-1\\right)^2}{2}=2-\\sqrt{3}$, deci suma este $2\\in\\mathbb{N}$' },
      ],
    },
    {
      text: 'Considerăm funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-4$.',
      parts: [
        { pts: 2, text: 'Calculează media geometrică a numerelor $a=f\\left(\\sqrt{5}\\right)$ și $b=f\\left(4+\\sqrt{5}\\right)$.', ans: '$a=2\\sqrt{5}-4$, $b=2\\sqrt{5}+4$, $ab=20-16=4$, deci media geometrică este $2$' },
        { pts: 3, text: 'Determină coordonatele punctului $M$ de pe reprezentarea grafică a funcției în sistemul de axe ortogonale $xOy$, știind că are ordonata egală cu două treimi din abscisă.', ans: '$2x-4=\\dfrac{2x}{3}$, deci $x=3$: $M(3,\\,2)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, dreptunghiul $ABCD$ are $AB=2\\sqrt{3}$ dm și $BC=3$ dm. Punctul $O$ este mijlocul laturii $CD$, iar $M$ este un punct pe latura $BC$, astfel încât $CM=1$ dm.',
      parts: [
        { pts: 2, text: 'Arată că măsura unghiului $AOM$ este $90^\\circ$.', ans: '$AO=\\sqrt{3+9}=\\sqrt{12}$ dm, $OM=\\sqrt{3+1}=2$ dm, $AM=\\sqrt{12+4}=4$ dm; $AM^2=AO^2+OM^2$, deci $\\sphericalangle AOM=90^\\circ$' },
        { pts: 3, text: 'Demonstrează că lungimea drumului $AO+OM$ este mai mică de $55$ cm.', ans: '$AO+OM=\\left(2\\sqrt{3}+2\\right)$ dm și $2\\sqrt{3}+2<5{,}5\\Leftrightarrow2\\sqrt{3}<3{,}5\\Leftrightarrow12<12{,}25$, adevărat' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat cu latura de $6$ cm. Punctele $M$ și $N$ se află pe laturile $AD$, respectiv $CD$, astfel încât $\\sphericalangle ABM=15^\\circ$ și $MN\\parallel AC$.',
      parts: [
        { pts: 2, text: 'Arată că $AM=CN$.', ans: '$MN\\parallel AC$, deci $\\triangle DMN$ este dreptunghic isoscel, $DM=DN$, de unde $AM=CN$' },
        { pts: 3, text: 'Demonstrează că triunghiul $BMN$ este echilateral.', ans: '$\\triangle MAB\\equiv\\triangle NCB$ (LUL), deci $NB=MB$ și $\\sphericalangle NBC=\\sphericalangle MBA=15^\\circ$; $\\sphericalangle MBN=90^\\circ-30^\\circ=60^\\circ$, deci $\\triangle MBN$ este echilateral' },
      ],
      fig: fig17,
    },
    {
      text: 'O jucărie are formă de piramidă patrulateră regulată $OABCD$ cu baza $ABCD$ și toate muchiile cu lungimea de $6$ cm. Punem jucăria într-o cutie în formă de prismă patrulateră regulată cu latura bazei de $6$ cm și înălțimea de $6\\sqrt{6}$ cm, astfel încât piramida și prisma să aibă aceeași bază (vezi figura alăturată).',
      parts: [
        { pts: 2, text: 'Calculează distanța de la $O$ la planul $(ABC)$.', ans: 'Fie $Q$ centrul bazei: $AQ=3\\sqrt{2}$ cm, deci $OQ=\\sqrt{36-18}=3\\sqrt{2}$ cm' },
        { pts: 3, text: "Determină măsura unghiului dintre dreptele $AO$ și $AC'$.", ans: "$AO$ și $AC'$ sunt în planul $(ACC')$; $\\sphericalangle OAC=45^\\circ$ și $\\operatorname{tg}(\\sphericalangle C'AC)=\\dfrac{6\\sqrt{6}}{6\\sqrt{2}}=\\sqrt{3}$, deci $\\sphericalangle C'AC=60^\\circ$ și unghiul este $15^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
