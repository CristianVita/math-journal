// Testul 85 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 251–253; every answer here is computed and checked with the book's answers, p. 300).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [4, 0], M: [5, 0], C: [6, 0], N: [8, 0], D: [10, 0], E: [12, 0] }, 180, {
  s: 'A-E', dot: 'A B M C N D E', l: { A: 'n', B: 'n', C: 'n', D: 'n', E: 'n', M: 's', N: 's' },
})
// a ∥ b, the secant c: 3x° at a∩c (acute), 2x° + 120° at b∩c (obtuse)
const S1 = pol(216, 2.6), S2 = pol(36, 4.8), L1: Pt = [-3.6, 2], R1: Pt = [4.6, 2], L2: Pt = [-3.6, 0], R2: Pt = [4.4, 0]
const fig8 = plane({ S1, S2, L1, R1, L2, R2, X1: meet(S1, S2, L1, R1), X2: meet(S1, S2, L2, R2) }, 170, {
  s: 'S1-S2 L1-R1 L2-R2', ang: ['R1X1S2', 'S2X2L2'],
  l: { S1: '', S2: '', L1: '', R1: '', L2: '', R2: '', X1: '', X2: '' },
  t: [
    { at: [3.75, 2.1], s: '3x°', anchor: 'start', size: 9 }, { at: [-2.4, 0.25], s: '2x° + 120°', size: 9 },
    { at: [-3.3, 2.2], s: 'a', italic: true }, { at: [4.1, 0.2], s: 'b', italic: true }, { at: [-2.4, -1.3], s: 'c', italic: true },
  ],
})
const A9: Pt = [1.2, 5], B9: Pt = [0, 0], C9: Pt = [8, 0]
const fig9 = plane({ A: A9, B: B9, C: C9, G: [(A9[0] + B9[0] + C9[0]) / 3, (A9[1] + B9[1] + C9[1]) / 3] }, 120, { s: 'A-B-C-A A-G', ra: ['BAC'], dot: 'G', l: { G: 's' } })
const fig10 = plane({ A: [0, 0], B: [9, 0], C: [4, 12], D: [0, 12] }, 80, { s: 'A-B-C-D-A', ra: ['DAB', 'ADC'] })
const fig11 = plane({ O: [0, 0], A: pol(90, s3), B: pol(210, s3), C: pol(-30, s3) }, 100, { s: 'A-B-C-A', c: [{ at: 'O', r: s3 }], l: { O: '' } })
const fig12 = solid({
  A: [0, 0, 0], B: [2, 0, 0], C: [1, s3, 0], "A'": [0, 0, 2], "B'": [2, 0, 2], "C'": [1, s3, 2],
}, "A-B-C A'-B'-C' A-B-B'-A' B-C-C'-B' C-A-A'-C'", 110)

const fig15 = graph({ A: [1, 2], B: [-1, 0], C: [1 + 2 * s3, 0], F1: [-2, -1], F2: [3, 4], G1: [-1.5, 2 + 1 / s3 + 1.5 / s3], G2: [5.5, 2 + 1 / s3 - 5.5 / s3] }, 140, [-2.5, 6], [-1.5, 4.5], {
  s: 'F1-F2 G1-G2', dot: 'A B C', l: { F1: '', F2: '', G1: '', G2: '', A: 'n', B: 'nw', C: 'n' },
})
const fig16 = plane({ A: [0, 0], B: [50, 0], M: [0, 30], N: [50, 90], P: [30, 0], "N'": [50, -90] }, 120, {
  s: 'A-B M-A M-P-N-B', d: "B-N'", ra: ['MAB', 'NBA'], l: { P: 's' },
})
const fig17 = plane({ A: [3.6, 4.8], B: [0, 0], C: [10, 0], I: [4, 2], M: [2.4, 3.2], N: [5.2, 3.6] }, 150, {
  s: 'A-B-C-A I-M I-N', c: [{ at: 'I', r: 2 }], ra: ['BAC'], dot: 'I', l: { I: 's' },
})
const fig18 = solid({ ...box(12, 12, 12), M: [12, 0, 3], N: [12, -4, 0] }, BOX, 130, { seg: 'B-N', dot: 'M N', l: { M: 'w', N: 's' } })

export const M116: EnModel = {
  id: 'en-116',
  title: 'Paralela 45, Testul 85',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 251–253',
  items: [
    { text: 'Rezultatul calculului $4-6:(4-6)$ este egal cu:', choices: ['$1$', '$-8$', '$7$', '$16$'], ans: 2 },
    {
      text: 'Ionuț are $120$ de lei. După ce cumpără o carte cu $30\\%$ din suma avută, suma de bani care îi rămâne este egală cu:',
      choices: ['$36$ de lei', '$94$ de lei', '$90$ de lei', '$84$ de lei'], ans: 3,
    },
    {
      text: 'Mulțimea numerelor naturale $n$ pentru care numărul $\\dfrac{18}{2n-3}$ este natural este:',
      choices: ['$\\{1,\\,2,\\,3\\}$', '$\\{0,\\,1,\\,2\\}$', '$\\{2,\\,3,\\,6\\}$', '$\\{1,\\,3,\\,6\\}$'], ans: 2,
    },
    { text: 'Media aritmetică a numerelor $8+2\\sqrt{12}$ și $8-\\sqrt{48}$ este egală cu:', choices: ['$8$', '$16$', '$4$', '$2$'], ans: 0 },
    {
      text: 'În tabelul următor sunt prezentate rezultatele unui grup de $20$ de elevi la un test de matematică.\n\n| Nr. elevi | $3$ | $2$ | $4$ | $2$ | $5$ | $1$ | $3$ |\n|---|---|---|---|---|---|---|---|\n| Nr. puncte obținute | $72$ | $91$ | $87$ | $37$ | $64$ | $93$ | $42$ |\n\nCel mai mic punctaj obținut este mai mic decât cel mai mare punctaj obținut cu:',
      choices: ['$52$ de puncte', '$54$ de puncte', '$56$ de puncte', '$51$ de puncte'], ans: 2,
    },
    {
      text: 'Maria afirmă: „Dintre numerele: $\\dfrac{5}{6}$, $\\dfrac{4}{5}$, $\\dfrac{2}{3}$ și $\\dfrac{3}{4}$, cel mai mare număr este $\\dfrac{5}{6}$”. Afirmația Mariei este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$ și $E$ sunt coliniare, în această ordine, astfel încât $AC=BD=CE$. Punctul $M$ este mijlocul segmentului $BC$, punctul $N$ este mijlocul segmentului $CD$ și $NC=2MC$. Valoarea raportului $\\dfrac{AD}{AE}$ este:',
      choices: ['$\\dfrac{4}{3}$', '$\\dfrac{6}{5}$', '$\\dfrac{5}{6}$', '$2$'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $a$ și $b$ sunt paralele, iar dreapta $c$ este secantă. Folosind datele din figură, valoarea lui $x$ este:',
      choices: ['$11$', '$12$', '$13$', '$14$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este dreptunghic având ipotenuza $BC$, iar $G$ este centrul de greutate. Valoarea raportului $\\dfrac{AG}{BC}$ este:',
      choices: ['$\\dfrac{1}{6}$', '$\\dfrac{1}{2}$', '$\\dfrac{1}{4}$', '$\\dfrac{1}{3}$'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un trapez dreptunghic, $AB=9$ cm, $CD=4$ cm și $BC=13$ cm. Aria trapezului $ABCD$ este egală cu:',
      choices: ['$78\\text{ cm}^2$', '$72\\text{ cm}^2$', '$156\\text{ cm}^2$', '$39\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'Triunghiul echilateral $ABC$ este înscris în cercul de diametru $2\\sqrt{3}$ cm. Perimetrul triunghiului este egal cu:',
      choices: ['$3$ cm', '$\\dfrac{9\\sqrt{3}}{4}$ cm', '$6$ cm', '$9$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'O prismă triunghiulară regulată dreaptă are toate muchiile egale, iar volumul este egal cu $2\\sqrt{3}\\text{ cm}^3$. Suma tuturor muchiilor prismei este egală cu:',
      choices: ['$6$ cm', '$9$ cm', '$12$ cm', '$18$ cm'], ans: 3, fig: fig12,
    },

    {
      text: 'Un autobuz pleacă dintr-un punct $A$, trece prin câteva stații și se întoarce în $A$. La plecare, în punctul $A$, urcă câțiva călători. Aceștia au plătit împreună, pentru bilete, $72$ de lei. Apoi, în fiecare nouă stație, urcă $10$ călători și coboară $7$. Prețul biletului este același pentru fiecare călător. Se știe că, la întoarcere în punctul $A$, în autobuz sunt $44$ de călători, iar costul total al biletelor plătite de toți călătorii este $1152$ de lei.',
      parts: [
        { pts: 2, text: 'Prețul unui bilet poate fi $6$ lei?', ans: 'Nu: cu $a$ călători la plecare și $n$ stații, $a+3n=44$ și $72+10nx=1152$; pentru $x=6$, $a=12$, $n=18$ și $a+3n=66\\neq44$' },
        { pts: 3, text: 'Câte persoane au călătorit cu autobuzul?', ans: '$ax=72$, $nx=108$, iar $x(a+3n)=44x$ dă $72+324=44x$, deci $x=9$, $a=8$, $n=12$: au călătorit $8+10\\cdot12=128$ de persoane' },
      ],
    },
    {
      text: 'Notăm cu $A$ mulțimea numerelor naturale de două cifre care pot fi scrise ca produsul a două numere naturale consecutive.',
      parts: [
        { pts: 2, text: 'Arată că, pentru orice $x>0$, $\\dfrac{1}{(x+1)(x+2)}+\\dfrac{1}{(x+2)(x+3)}+\\ldots+\\dfrac{1}{(x+7)(x+8)}=\\dfrac{1}{x+1}-\\dfrac{1}{x+8}$.', ans: 'Fiecare termen este $\\dfrac{1}{x+k}-\\dfrac{1}{x+k+1}$, iar suma se reduce la $\\dfrac{1}{x+1}-\\dfrac{1}{x+8}$' },
        { pts: 3, text: 'Calculează suma inverselor elementelor mulțimii $A$.', ans: 'Elementele sunt $3\\cdot4,\\,4\\cdot5,\\,\\ldots,\\,9\\cdot10$, iar suma este $\\dfrac{1}{3}-\\dfrac{1}{10}=\\dfrac{7}{30}$' },
      ],
    },
    {
      text: 'Considerăm funcțiile $f,\\,g:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+1$ și $g(x)=2+\\dfrac{1}{\\sqrt{3}}-\\dfrac{\\sqrt{3}}{3}x$ și sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Arată că punctul $A(1,\\,2)$ este punct comun al reprezentărilor grafice ale funcțiilor $f$ și $g$.', ans: '$f(1)=2$ și $g(1)=2+\\dfrac{\\sqrt{3}}{3}-\\dfrac{\\sqrt{3}}{3}=2$' },
        { pts: 3, text: 'Reprezentarea grafică a funcției $f$ intersectează axa $Ox$ în punctul $B$, iar reprezentarea grafică a funcției $g$ intersectează axa $Ox$ în punctul $C$. Află măsurile unghiurilor triunghiului $ABC$.', ans: '$B(-1,\\,0)$, $C(1+2\\sqrt{3},\\,0)$; cu $D(1,\\,0)$: $\\triangle ABD$ este dreptunghic isoscel, $\\sphericalangle B=45^\\circ$; $CD=2\\sqrt{3}$, $AD=2$, deci $\\sphericalangle C=30^\\circ$ și $\\sphericalangle A=105^\\circ$' },
      ],
      fig: fig15,
    },
    {
      text: "În figura alăturată sunt reprezentate triunghiurile $MAP$ și $NBP$, cu $\\sphericalangle A=\\sphericalangle B=90^\\circ$, $P\\in(AB)$, $MA=30$ cm, $NB=90$ cm, $AB=50$ cm. Fie $N'$ simetricul punctului $N$ față de dreapta $AB$.",
      parts: [
        { pts: 2, text: "Arată că $PN=PN'$.", ans: "În triunghiul $PNN'$, $PB$ este mediatoarea segmentului $NN'$, deci $PN=PN'$" },
        { pts: 3, text: 'Calculează lungimea minimă a sumei $MP+PN$, când punctul $P$ se deplasează pe segmentul $AB$.', ans: "$MP+PN=MP+PN'$ este minimă când $M$, $P$, $N'$ sunt coliniare; $\\triangle MAP\\sim\\triangle N'BP$, deci $\\dfrac{AP}{PB}=\\dfrac{30}{90}$, $AP=\\dfrac{25}{2}$ cm, $BP=\\dfrac{75}{2}$ cm, $MP=\\dfrac{65}{2}$ cm, $N'P=\\dfrac{195}{2}$ cm și suma minimă este $130$ cm" },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, cu $\\sphericalangle A=90^\\circ$, $AB=6$ cm și $AC=8$ cm. Cercul de centru $I$ este tangent laturilor $AB$ și $AC$ în punctele $M$, respectiv $N$.',
      parts: [
        { pts: 2, text: 'Arată că patrulaterul $AMIN$ este pătrat.', ans: '$AMIN$ are trei unghiuri drepte, deci este dreptunghi, iar $IM=IN=r$, deci este pătrat' },
        { pts: 3, text: 'Arată că aria cercului de centru $I$ este mai mare decât jumătate din aria triunghiului $ABC$.', ans: '$BC=10$ cm $=BP+CP=(AB-r)+(AC-r)$, deci $r=2$ cm și $\\mathcal{A}_{cerc}=4\\pi>12=\\dfrac{1}{2}\\mathcal{A}_{ABC}$' },
      ],
      fig: fig17,
    },
    {
      text: "Fie $ABCDA'B'C'D'$ un cub cu latura de $12$ cm. $M$ este un punct pe muchia $BB'$, $MB=3$ cm, iar $N$ este un punct pe dreapta $BC$, $B$ între $N$ și $C$, astfel încât $NB=4$ cm.",
      parts: [
        { pts: 2, text: "Arată că punctele $N$, $M$ și $C'$ sunt coliniare.", ans: "Punctele sunt în planul $(BCC'B')$ și $\\dfrac{NB}{NC}=\\dfrac{4}{16}=\\dfrac{MB}{CC'}$, deci $\\triangle NBM\\sim\\triangle NCC'$ și $\\sphericalangle MNB=\\sphericalangle C'NB$" },
        { pts: 3, text: "Determină cosinusul unghiului dintre planele $(C'AM)$ și $(ABC)$.", ans: "Dreapta comună este $AN$; cu $CP\\perp AN$, $C'P\\perp AN$ și unghiul este $\\sphericalangle C'PC$; $CP=\\dfrac{CN\\cdot AB}{AN}=\\dfrac{24\\sqrt{10}}{5}$ cm, $C'P=\\dfrac{6\\sqrt{260}}{5}$ cm, deci $\\cos\\sphericalangle C'PC=\\dfrac{4}{\\sqrt{26}}$" },
      ],
      fig: fig18,
    },
  ],
}
