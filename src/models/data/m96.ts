// Testul 65 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 209–211; every answer here is computed and checked with the book's answers, p. 292).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, plane, solid } from '../figure'
import { graph, pol, TETRA } from './shapes'

const s3 = Math.sqrt(3)

// the votes: Alexandru 25%, Andrei 35%, Adrian 40%
const fig6 = plane({ O: [0, 0], X: pol(90, 5), Y: pol(0, 5), Z: pol(-126, 5) }, 120, {
  s: 'O-X O-Y O-Z', c: [{ at: 'O', r: 5 }], l: { O: '', X: '', Y: '', Z: '' },
  t: [
    { at: pol(45, 2.6), s: 'Alexandru', anchor: 'middle', size: 8 }, { at: [pol(45, 2.6)[0], pol(45, 2.6)[1] - 1], s: '25%', anchor: 'middle', size: 9 },
    { at: pol(-63, 2.6), s: 'Andrei', anchor: 'middle', size: 8 }, { at: [pol(-63, 2.6)[0], pol(-63, 2.6)[1] - 1], s: '35%', anchor: 'middle', size: 9 },
    { at: pol(162, 2.6), s: 'Adrian', anchor: 'middle', size: 8 }, { at: [pol(162, 2.6)[0], pol(162, 2.6)[1] - 1], s: '40%', anchor: 'middle', size: 9 },
  ],
})

const fig7 = plane({ A: [0, 0], B: [4, 0], C: [6, 0], D: [15, 0] }, 180, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const P8: Pt[] = [pol(140, 6), pol(-40, 6), pol(60, 5), pol(-120, 5)]
const fig8 = plane({ O: [0, 0], K1: P8[0], K2: P8[1], L1: P8[2], L2: P8[3] }, 130, {
  s: 'K1-K2 L1-L2', l: { O: 'n', K1: '', K2: '', L1: '', L2: '' },
  t: [{ at: [P8[2][0] + 0.3, P8[2][1]], s: 'd₁', anchor: 'start', italic: true, size: 11 }, { at: [P8[1][0], P8[1][1] + 0.6], s: 'd₂', anchor: 'start', italic: true, size: 11 },
    { at: [-1.6, -0.2], s: '6x − 7°', anchor: 'end', size: 10 }, { at: [1.6, 0.2], s: '5x + 5°', anchor: 'start', size: 10 }],
})
const fig9 = plane({ A: [5, 5 * s3], B: [0, 0], D: [10, 0], C: [0, -7.5] }, 110, { s: 'A-B-C-D-A B-D', ra: ['CBD'] })
const fig10 = plane({ A: [3, 3], B: [0, 0], C: [6, 0] }, 120, { s: 'A-B-C-A' })
const fig11 = plane({ O: [0, 0], A: [-5, 0], B: [0, -5], C: [5, 0], D: [0, 5] }, 110, { s: 'A-B-C-D-A', c: [{ at: 'O', r: 5 / Math.SQRT2 }], l: { O: '' } })
// the net of the cube: a row of four squares, one above the third, one below the second; E is the thick edge
const f12 = plane({
  a0: [0, 0], a1: [1, 0], a2: [2, 0], a3: [3, 0], a4: [4, 0], b0: [0, 1], b1: [1, 1], b2: [2, 1], b3: [3, 1], b4: [4, 1],
  t2: [2, 2], t3: [3, 2], u1: [1, -1], u2: [2, -1],
}, 150, {
  s: 'a0-a4-b4-b0-a0 a1-b1 a2-b2 a3-b3 b2-t2-t3-b3 a1-u1-u2-a2',
  l: Object.fromEntries(['a0', 'a1', 'a2', 'a3', 'a4', 'b0', 'b1', 'b2', 'b3', 'b4', 't2', 't3', 'u1', 'u2'].map((k) => [k, ''])),
  t: [{ at: [2.5, 2.15], s: 'A', anchor: 'middle', italic: true, size: 12 }, { at: [3.5, -0.4], s: 'B', anchor: 'middle', italic: true, size: 12 },
    { at: [4.15, 0.4], s: 'C', anchor: 'start', italic: true, size: 12 }, { at: [-0.15, 0.4], s: 'D', anchor: 'end', italic: true, size: 12 },
    { at: [1.5, -1.45], s: 'E', anchor: 'middle', italic: true, size: 12 }],
})
const fig12 = { ...f12, path: [{ d: `M${f12.p.u1[0]} ${f12.p.u1[1] - 1.5} H${f12.p.u2[0]} V${f12.p.u2[1] + 1.5} H${f12.p.u1[0]} Z`, fill: '#000' }] }

const fig15 = graph({ A: [3, 2], L1: [-1.5, -1], L2: [5.5, 11 / 3] }, 120, [-1.5, 5.5], [-1.5, 4], { s: 'L1-L2', dot: 'A', l: { L1: '', L2: '', A: 'n' } })
const fig16 = plane({ A: [0, 0], B: [3, 0], E: [6, 0], D: [1, 2], F: [2, 4], C: [4, 2] }, 110, { s: 'A-E A-F D-C-B' })
const A17: Pt = [0, 0], B17: Pt = [15, 0], C17: Pt = [15, 20], D17: Pt = [0, 20], F17: Pt = [15, 11.25]
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, F: F17, E: meet(B17, D17, A17, F17) }, 110, { s: 'A-B-C-D-A B-D A-F', ra: ['AEB'] })
const p18: Record<string, P3> = { A: [0, 6 * s3, 0], B: [6, 0, 0], C: [12, 6 * s3, 0], V: [6, 4 * s3, 12], O: [6, 4 * s3, 0] }
const fig18 = solid(p18, TETRA('A', 'B', 'C', 'V'), 120, { seg: 'V-O', dot: 'O' })

export const M96: EnModel = {
  id: 'en-96',
  title: 'Paralela 45, Testul 65',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 209–211',
  items: [
    { text: 'Cel mai mare divizor prim al numărului $18$ este:', choices: ['$2$', '$3$', '$9$', '$18$'], ans: 1 },
    {
      text: 'Notele pe care le are Sebastian la limba engleză sunt cele din tabelul alăturat. Media care i se încheie lui Sebastian este:\n\n| Nota | $5$ | $7$ | $8$ |\n|---|---|---|---|\n| Nr. note | $1$ | $3$ | $2$ |',
      choices: ['$5$', '$6$', '$7$', '$8$'], ans: 2,
    },
    { text: 'Numărul perechilor $(a,\\,b)$ de numere întregi, cu proprietatea că $a\\cdot b=4$, este:', choices: ['$2$', '$3$', '$4$', '$6$'], ans: 3 },
    { text: 'Dacă numerele reale nenule $a$ și $b$ au proprietatea că $\\dfrac{a}{3}=\\dfrac{2}{b}$, atunci numărul $2ab-7$ este egal cu:', choices: ['$1$', '$6$', '$-1$', '$5$'], ans: 3 },
    { text: 'Rezultatul calculului $(2+\\sqrt{3})^2+|4\\sqrt{3}-7|$ este:', choices: ['$8\\sqrt{3}$', '$14$', '$0$', '$12$'], ans: 1 },
    {
      text: 'La alegerea șefului clasei a VIII-a E s-au înregistrat rezultatele din diagrama alăturată. Miruna spune că Andrei a câștigat aceste alegeri. Afirmația Mirunei este:',
      choices: ['adevărată', 'falsă'], ans: 1, fig: fig6,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine. Dacă $3AB=2AC$, $3AC=2CD$ și $BD=11$ cm, atunci lungimea segmentului $AB$ este egală cu:',
      choices: ['$2{,}5$ cm', '$9$ cm', '$4$ cm', '$7{,}5$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt date două dintre măsurile unghiurilor care se formează în jurul punctului $O$ de intersecție a dreptelor $d_1$ și $d_2$. Valoarea lui $x$ este:',
      choices: ['$12^\\circ$', '$10^\\circ$', '$20^\\circ$', '$15^\\circ$'], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABD$ este un triunghi echilateral cu latura de $10$ cm, iar $BCD$ este un triunghi dreptunghic, $\\sphericalangle B=90^\\circ$, având același perimetru cu triunghiul $ABD$. Perimetrul patrulaterului $ABCD$ este:',
      choices: ['$40$ cm', '$5(5+\\sqrt{3})$ cm', '$50$ cm', '$60$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'Triunghiul isoscel $ABC$, din figura alăturată, are $AB=AC=6$ cm și perimetrul egal cu $12+6\\sqrt{2}$ cm. Măsura unghiului $ACB$ este:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$75^\\circ$', '$60^\\circ$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată, laturile rombului $ABCD$ sunt tangente unui cerc cu raza $2{,}5$ cm. Distanța dintre dreptele $AB$ și $CD$ este:',
      choices: ['$2{,}5$ cm', '$3{,}75$ cm', '$4{,}8$ cm', '$5$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'În figura alăturată este desenată o desfășurare a unui cub. Atunci când refacem cubul, segmentul îngroșat (marcat $E$) se va lipi peste segmentul marcat:',
      choices: ['$A$', '$B$', '$C$', '$D$'], ans: 1, fig: fig12,
    },

    {
      text: 'Într-o cutie sunt $30$ de bile albe, roșii și galbene. $19$ bile nu sunt galbene, iar numărul bilelor roșii este cu $1$ mai mic decât numărul bilelor albe.',
      parts: [
        { pts: 2, text: 'Află numărul bilelor galbene.', ans: '$30-19=11$ bile galbene' },
        { pts: 3, text: 'Găsește numărul bilelor roșii.', ans: '$r+(r+1)=19$, deci $9$ bile roșii' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x^2-4}{x^2-4x+4}:\\left[\\dfrac{1}{x-1}\\cdot\\left(x-\\dfrac{1}{2-x}\\right)-1\\right]-3$, unde $x\\in\\mathbb{R}\\setminus\\{1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=x-1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{1,\\,2\\}$.', ans: '$x-\\dfrac{1}{2-x}=\\dfrac{(x-1)^2}{x-2}$, deci paranteza este $\\dfrac{x-1}{x-2}-1=\\dfrac{1}{x-2}$ și $E(x)=\\dfrac{(x-2)(x+2)}{(x-2)^2}\\cdot(x-2)-3=x+2-3=x-1$' },
        { pts: 3, text: 'Demonstrează că, pentru orice număr natural $n$, $n\\geq4$, numărul $a=\\dfrac{(E(n))^3-E(n^2)}{n-3}$ este număr natural par.', ans: '$(n-1)^3-(n^2-1)=(n-1)\\big((n-1)^2-n-1\\big)=(n-1)n(n-3)$, deci $a=(n-1)n$, produs de două numere consecutive: natural și par' },
      ],
    },
    {
      text: 'În figura alăturată, dreapta $OA$, unde $A(3,\\,2)$, este reprezentarea grafică a unei funcții $f:\\mathbb{R}\\to\\mathbb{R}$, într-un sistem de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Arată că lungimea segmentului $OA$ este $\\sqrt{13}$.', ans: '$OA=\\sqrt{3^2+2^2}=\\sqrt{13}$' },
        { pts: 3, text: 'Determină legea de corespondență a funcției $f$.', ans: '$f(x)=ax+b$, cu $f(0)=0$ și $f(3)=2$: $b=0$, $a=\\dfrac{2}{3}$, deci $f(x)=\\dfrac{2}{3}x$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este paralelogram. Punctele $E$ și $F$ sunt simetricele punctului $A$ față de $B$, respectiv $D$.',
      parts: [
        { pts: 2, text: 'Arată că patrulaterul $BCFD$ este un paralelogram.', ans: '$BC\\parallel DF$ și $BC=AD=DF$, deci $BCFD$ este paralelogram' },
        { pts: 3, text: 'Demonstrează că punctele $C$, $E$ și $F$ sunt coliniare.', ans: 'Din a), $CF\\parallel BD$; la fel, $BECD$ este paralelogram ($BE=AB=DC$, $BE\\parallel DC$), deci $CE\\parallel BD$; prin $C$ trece o singură paralelă la $BD$, deci $C$, $E$, $F$ sunt coliniare' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat dreptunghiul $ABCD$. Dreptele $BD$ și $AF$ se intersectează în punctul $E$ și $BD\\perp AF$, $BE=90$ m, $DE=160$ m.',
      parts: [
        { pts: 2, text: 'Arată că perimetrul dreptunghiului $ABCD$ este egal cu $700$ m.', ans: 'Teorema catetei: $AB=\\sqrt{BE\\cdot BD}=\\sqrt{90\\cdot250}=150$ m și $AD=\\sqrt{DE\\cdot BD}=\\sqrt{160\\cdot250}=200$ m, deci $\\mathcal{P}_{ABCD}=700$ m' },
        { pts: 3, text: 'Calculează lungimea segmentului $CF$.', ans: '$\\triangle EAD\\sim\\triangle EFB$: $\\dfrac{AD}{BF}=\\dfrac{DE}{EB}$, deci $BF=\\dfrac{200\\cdot90}{160}=112{,}5$ m și $CF=87{,}5$ m' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida triunghiulară regulată $VABC$ cu latura bazei $AB=12$ cm și înălțimea $VO=12$ cm.',
      parts: [
        { pts: 2, text: 'Calculează volumul piramidei.', ans: '$V=\\dfrac{1}{3}\\cdot\\dfrac{12^2\\sqrt{3}}{4}\\cdot12=144\\sqrt{3}\\text{ cm}^3$' },
        { pts: 3, text: 'Arată că sinusul unghiului format de dreapta $AB$ cu planul $(VBC)$ este egal cu $\\dfrac{3}{\\sqrt{13}}$.', ans: 'Fie $M$ mijlocul lui $BC$ și $P$ proiecția lui $A$ pe $VM$; $AP\\perp(VBC)$ (reciproca a doua a T3⊥). $AM=6\\sqrt{3}$, $VM=\\sqrt{144+12}=2\\sqrt{39}$, deci $AP=\\dfrac{VO\\cdot AM}{VM}=\\dfrac{36}{\\sqrt{13}}$ cm și $\\sin\\sphericalangle ABP=\\dfrac{AP}{AB}=\\dfrac{3}{\\sqrt{13}}$' },
      ],
      fig: fig18,
    },
  ],
}
