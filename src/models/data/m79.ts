// Testul 48 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 171–173; every answer here is computed and checked with the book's answers, p. 287).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { along, foot, meet, plane } from '../figure'
import { graph, pol } from './shapes'

const len = (x: number, s: string) => ({ at: [x, 0.7] as Pt, s, anchor: 'middle' as const, size: 9 })
const fig7 = plane({ A: [0, 0], B: [2, 0], C: [3, 0], D: [4, 0], E: [6, 0], F: [7, 0], G: [10, 0], T: [0, 1.2] }, 260, {
  s: 'A-G', dot: 'A B C D E F G', l: { A: 's', B: 's', C: 's', D: 's', E: 's', F: 's', G: 's', T: '' },
  t: [len(1, '2 cm'), len(2.5, '1 cm'), len(3.5, '1 cm'), len(5, '2 cm'), len(6.5, '1 cm'), len(8.5, '3 cm')],
})
const fig8 = plane({ A1: [-0.5, 2], A2: [4, 2], B1: [-0.5, 0], B2: [4, 0], C1: [0.6, -0.8], C2: [2.4, 2.8] }, 130, {
  s: 'A1-A2 B1-B2 C1-C2', l: { A1: '', A2: '', B1: '', B2: '', C1: '', C2: '' },
  t: [
    { at: [2.4, 2.3], s: 'x + 60°', anchor: 'start', size: 10 }, { at: [0.85, 0.25], s: '4x − 30°', anchor: 'end', size: 10 },
    { at: [3.85, 2.15], s: 'a', italic: true }, { at: [3.85, 0.15], s: 'b', italic: true }, { at: [2.5, 2.9], s: 'c', italic: true },
  ],
})
const A9 = pol(60, (6 * Math.sin((50 * Math.PI) / 180)) / Math.sin((70 * Math.PI) / 180)), B9: Pt = [0, 0], C9: Pt = [6, 0]
const D9 = foot(A9, B9, C9), E9 = foot(B9, A9, C9)
const fig9 = plane({ A: A9, B: B9, C: C9, D: D9, H: meet(A9, D9, B9, E9) }, 130, { s: 'A-B-C-A A-D B-H', ra: ['ADC'], l: { H: 'ne' } })
const fig10 = plane({ A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1] }, 90, { s: 'A-B-C-D-A A-C' })
const fig11 = plane({ P1: [0, 0], P2: [80, 0], P3: [80, 60], P4: [0, 60], O: [35, 30] }, 140, {
  s: 'P1-P2-P3-P4-P1', c: [{ at: 'O', r: 30 }], l: { P1: '', P2: '', P3: '', P4: '', O: '' },
})

const fig15 = graph({ A: [3, 0], B: [0, 6], M: [-12, 0], L1: [-0.5, 7], L2: [3.6, -1.2] }, 180, [-13, 4.5], [-1.5, 7.5], {
  s: 'L1-L2', d: 'M-B', dot: 'A B M', l: { L1: '', L2: '', A: 'ne', B: 'e', M: 'n' },
})
const A16: Pt = [0, 20], C16: Pt = [15, 0]
const fig16 = plane({ A: A16, B: [0, 0], C: C16, D: [0, 10], E: along(A16, C16, 8 / 25) }, 110, { s: 'A-B-C-A D-E', ra: ['ABC', 'AED'] })
const fig17 = plane({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], M: [6, 2], N: [3, 6] }, 120, { s: 'A-B-C-D-A A-M-N-A' })
// drawn shorter than the real height 42, as in the book
const f18 = plane({ O: [0, 0], A: [-8, 0], B: [8, 0], "O'": [0, 22], "A'": [-10, 22], "B'": [10, 22], T: [0, 32] }, 110, {
  s: "A-A' B-B'", d: "O-O' A'-B'", dot: "O O'", l: { T: '', O: 's', "O'": 'n' },
})
const r18 = f18.p.B[0] - f18.p.O[0], q18 = f18.p["B'"][0] - f18.p["O'"][0]
const fig18 = {
  ...f18,
  e: [{ at: f18.p.O, rx: r18, ry: r18 / 4, back: true }, { at: f18.p["O'"], rx: q18, ry: q18 / 4 }],
  path: [{ d: `M${f18.p["A'"][0]} ${f18.p["A'"][1]} A${q18} ${q18} 0 0 1 ${f18.p["B'"][0]} ${f18.p["B'"][1]}` }],
}

export const M79: EnModel = {
  id: 'en-79',
  title: 'Paralela 45, Testul 48',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 171–173',
  items: [
    { text: 'Numerele $a$, $b$ sunt prime și $a+5b=40$. Numărul $b$ este:', choices: ['$2$', '$3$', '$6$', '$7$'], ans: 3 },
    {
      text: 'În tabelul alăturat este prezentată temperatura aerului măsurată în patru zile.\n\n| Ziua | $1$ | $2$ | $3$ | $4$ |\n|---|---|---|---|---|\n| Temperatura | $3^\\circ$C | $-4^\\circ$C | $-1^\\circ$C | $5^\\circ$C |\n\nCea mai mare diferență dintre cele patru temperaturi măsurate este:',
      choices: ['$9^\\circ$', '$7^\\circ$', '$2^\\circ$', '$6^\\circ$'], ans: 0,
    },
    { text: 'Într-o urnă sunt $6$ bile albe și $12$ bile negre. Se extrage o bilă din urnă, fără a vedea culoarea sa. Probabilitatea ca bila să fie neagră este:', choices: ['$\\dfrac{1}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{2}{3}$', '$\\dfrac{3}{4}$'], ans: 2 },
    { text: 'Numărul valorilor întregi ale lui $x$ pentru care numărul $2x+1$ este divizor întreg al numărului $30$ este:', choices: ['$6$', '$8$', '$10$', '$16$'], ans: 1 },
    {
      text: 'Patru elevi, Mihai, Andrei, Vlad și Ion, calculează media geometrică a numerelor $8\\sqrt{3}$ și $6\\sqrt{3}$. Aceștia obțin rezultatele din tabelul următor:\n\n| Elevul | Mihai | Andrei | Vlad | Ion |\n|---|---|---|---|---|\n| Rezultatul | $144$ | $6\\sqrt{2}$ | $7\\sqrt{3}$ | $12$ |\n\nElevul care a calculat corect este:',
      choices: ['Mihai', 'Andrei', 'Vlad', 'Ion'], ans: 3,
    },
    { text: 'Ion și Vlad sunt doi copii care merg cu bicicleta. Ion merge $2$ ore și $10$ minute cu o viteză medie de $18$ km/h, iar Vlad merge o oră și $40$ minute cu o viteză medie de $21$ km/h. Afirmația „Ion a mers mai mulți kilometri decât Vlad.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, $A$, $B$, $C$, $D$, $E$, $F$ și $G$ sunt puncte coliniare. Numărul segmentelor care au capetele în două dintre aceste puncte și au lungimea egală cu $4$ cm este egal cu:',
      choices: ['$2$', '$3$', '$4$', '$5$'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $a$ și $b$ sunt paralele, iar $c$ este o secantă. Valoarea lui $x$ este:',
      choices: ['$20^\\circ$', '$30^\\circ$', '$40^\\circ$', '$50^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată este desenat triunghiul $ABC$ cu $\\sphericalangle C=50^\\circ$. Fie $AD\\perp BC$, $D\\in BC$ și $H$ ortocentrul triunghiului $ABC$. Măsura unghiului $BHD$ este:',
      choices: ['$30^\\circ$', '$40^\\circ$', '$50^\\circ$', '$60^\\circ$'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$ cu diagonala $AC=\\sqrt{2}$ m. Aria pătratului este:',
      choices: ['$1\\text{ m}^2$', '$2\\text{ m}^2$', '$4\\text{ m}^2$', '$2\\sqrt{2}\\text{ m}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'Dintr-o placă de tablă în formă de dreptunghi cu laturile de $60$ cm și $80$ cm, decupăm un disc de rază maximă (vezi figura alăturată). Lungimea razei discului este:',
      choices: ['$10$ cm', '$20$ cm', '$40$ cm', '$30$ cm'], ans: 3, fig: fig11,
    },
    { text: 'O prismă triunghiulară regulată are latura bazei de $12$ cm și aria laterală egală cu $180\\text{ cm}^2$. Volumul prismei este egal cu:', choices: ['$180\\text{ cm}^3$', '$180\\sqrt{3}\\text{ cm}^3$', '$60\\text{ cm}^3$', '$120\\sqrt{3}\\text{ cm}^3$'], ans: 1 },

    {
      text: 'Suma de bani $S$ este împărțită Mariei și Ioanei, invers proporțional cu numerele $0{,}5$ și $0{,}(3)$.',
      parts: [
        { pts: 2, text: 'Care dintre cele două fete primește mai mulți bani?', ans: '$0{,}5=\\dfrac{1}{2}$, $0{,}(3)=\\dfrac{1}{3}$: Maria primește $2k$ lei, iar Ioana $3k$ lei, deci Ioana primește mai mult' },
        { pts: 3, text: 'Determină valoarea lui $S$, știind că Ioana primește $60$ de lei.', ans: '$3k=60$, $k=20$, deci $S=5k=100$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{4}{x-1}+\\dfrac{5x-13}{x^2-1}-\\dfrac{2}{x+1}\\right):\\dfrac{7x-7}{x^2+2x+1}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x+1}{x-1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: '$E(x)=\\dfrac{7x-7}{x^2-1}\\cdot\\dfrac{(x+1)^2}{7x-7}=\\dfrac{x+1}{x-1}$' },
        { pts: 3, text: 'Calculează produsul $P=E(2)\\cdot E(3)\\cdot\\ldots\\cdot E(10)$.', ans: '$P=\\dfrac{3}{1}\\cdot\\dfrac{4}{2}\\cdot\\dfrac{5}{3}\\cdot\\ldots\\cdot\\dfrac{11}{9}=\\dfrac{10\\cdot11}{1\\cdot2}=55$' },
      ],
    },
    {
      text: 'Considerăm funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-2x+6$.',
      parts: [
        { pts: 2, text: 'Calculează media aritmetică a numerelor $a=f\\left(\\sqrt{2}\\right)$ și $b=f\\left(-\\sqrt{2}\\right)$.', ans: '$a+b=6-2\\sqrt{2}+6+2\\sqrt{2}=12$, deci media aritmetică este $6$' },
        { pts: 3, text: 'Determină coordonatele punctului $M\\in Ox$, astfel încât măsura unghiului $MBA$ să fie $90^\\circ$, unde $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$.', ans: '$A(3,\\,0)$, $B(0,\\,6)$; în $\\triangle MBA$ dreptunghic în $B$: $OB^2=OM\\cdot OA$, $36=3\\cdot OM$, deci $OM=12$ și $M(-12,\\,0)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată sunt reprezentate trei localități $A$, $B$, $C$, legate între ele prin drumurile (în linie dreaptă) $AB$, $BC$ și $CA$, $AB\\perp BC$, $AB=20$ km, $BC=15$ km. Din mijlocul $D$ al drumului $AB$ se construiește o scurtătură până la $AC$ prin drumul $DE$, $DE\\perp AC$, $E\\in AC$.',
      parts: [
        { pts: 2, text: 'Arată că $\\triangle ADE\\sim\\triangle ACB$.', ans: '$\\sphericalangle DAE=\\sphericalangle CAB$ și $\\sphericalangle AED=\\sphericalangle ABC=90^\\circ$, deci $\\triangle ADE\\sim\\triangle ACB$' },
        { pts: 3, text: 'Cu cât este mai scurt drumul de la $D$ la $C$ prin $E$ decât drumul de la $D$ la $C$ prin $B$?', ans: '$AC=25$ km; $\\dfrac{AD}{AC}=\\dfrac{AE}{AB}=\\dfrac{DE}{BC}$ dă $AE=8$ km, $DE=6$ km, $EC=17$ km. Drumul $DEC$ are $23$ km, iar $DBC$ are $25$ km, deci primul e cu $2$ km mai scurt' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat cu latura $AB=6$ cm, iar $M$ și $N$ sunt două puncte pe laturile $BC$ respectiv $CD$, astfel încât $BM=2$ cm și $DN=3$ cm.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $AMN$.', ans: '$\\mathcal{A}_{AMN}=\\mathcal{A}_{ABCD}-\\mathcal{A}_{ABM}-\\mathcal{A}_{CMN}-\\mathcal{A}_{ADN}=36-6-6-9=15\\text{ cm}^2$' },
        { pts: 3, text: 'Arată că măsura unghiului $MAN$ este $45^\\circ$.', ans: '$AM=2\\sqrt{10}$ cm, $AN=3\\sqrt{5}$ cm, $\\mathcal{A}_{AMN}=\\dfrac{AM\\cdot AN\\cdot\\sin(\\sphericalangle MAN)}{2}=15\\sqrt{2}\\sin(\\sphericalangle MAN)=15$, deci $\\sin(\\sphericalangle MAN)=\\dfrac{\\sqrt{2}}{2}$ și $\\sphericalangle MAN=45^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este schița unei găleți în formă de trunchi de con cu raza bazei mici $r=OA=8$ cm, raza bazei mari $R=O'A'=10$ cm și înălțimea $OO'=42$ cm. Toarta este un semicerc de diametru $A'B'$. Considerăm pentru $\\pi$ aproximarea $\\pi\\simeq3$.",
      parts: [
        { pts: 2, text: 'Află lungimea torții.', ans: '$\\pi R=10\\pi\\simeq30$ cm' },
        { pts: 3, text: 'Calculează câți litri de apă încap în găleată.', ans: '$\\mathcal{V}=\\dfrac{\\pi\\cdot42}{3}(100+64+80)=3416\\pi\\text{ cm}^3=3{,}416\\pi\\text{ dm}^3\\simeq10{,}248\\ \\ell$' },
      ],
      fig: fig18,
    },
  ],
}
