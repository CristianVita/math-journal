// Testul 81 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 243–245; every answer here is computed and checked with the book's answers, p. 298).
import type { Fig, P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, plane, solid } from '../figure'
import { BOX, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [5, 0], C: [10, 0], D: [20, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(90, 3.2), B: pol(210, 3.2), C: pol(-30, 3.2), D: pol(-90, 1.6) }, 120, { s: 'A-D O-B O-C', dot: 'O', l: { O: 'e' } })
const fig9 = plane({ A: [0, 0], B: [10, 0], C: [7, 4], D: [3, 4] }, 130, { s: 'A-B-C-D-A' })
// DOE equilateral: E is O turned by 60° around D, just above the side DC (the book draws it on DC)
const fig10 = plane({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], O: [3, 3], E: [3 / 2 + 3 * s3 / 2, 6 + 3 * s3 / 2 - 3 / 2] }, 110, {
  s: 'A-B-C-D-A A-C B-D D-E-O E-B', l: { O: 'w' },
})
// arc ADC = 240°, B the middle of the small arc AC
const fig11 = plane({ O: [0, 0], A: pol(210, 3), B: pol(270, 3), C: pol(-30, 3), D: pol(100, 3) }, 110, { s: 'A-B-C-D-A A-C', c: [{ at: 'O', r: 3 }], l: { O: '' } })
const fig12: Fig = {
  w: 120, h: 160,
  p: { V: [60, 8], A: [10, 140], B: [110, 140], O: [60, 140] },
  l: { V: 'n', A: 'w', B: 'e', O: 's' },
  s: 'V-A V-B', d: 'V-O A-B', dot: 'O',
  e: [{ at: 'O', rx: 50, ry: 12, back: true }],
}

const fig16 = plane({ A: [0, 0], B: [16, 0], C: [16, 12], D: [0, 12], E: [12.5, 0], F: [3.5, 12] }, 140, { s: 'A-B-C-D-A A-E-C-F-A E-F' })
const t = 1 / s3, A17: Pt = [0, 0], B17: Pt = [6, 0], C17: Pt = [6, 6], D17: Pt = [0, 6], E17: Pt = [6, 6 + 6 * t], F17: Pt = [0, 6 * t]
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, E: E17, F: F17, G: meet(E17, F17, D17, C17) }, 110, { s: 'A-B-E D-E A-D-C F-B F-E', l: { G: 'n' } })
// the frustum, drawn lower than its real height 4√22, as in the book
const h18 = 8
const p18: Record<string, P3> = {
  A: [0, 0, 0], B: [16, 0, 0], C: [16, 16, 0], D: [0, 16, 0], "A'": [4, 4, h18], "B'": [12, 4, h18], "C'": [12, 12, h18], "D'": [4, 12, h18], O: [8, 8, 0], "O'": [8, 8, h18],
}
const fig18 = solid(p18, BOX, 150, { seg: "O-O' A-C", l: { O: 's', "O'": 'n' } })

export const M112: EnModel = {
  id: 'en-112',
  title: 'Paralela 45, Testul 81',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 243–245',
  items: [
    { text: 'Rezultatul calculului $\\left[(-1)^2+2^{-1}\\right]\\cdot2$ este egal cu:', choices: ['$0{,}5$', '$1$', '$2$', '$3$'], ans: 3 },
    { text: 'O carte costă $60$ de lei. După o scumpire cu $5\\%$, noul preț al cărții este egal cu:', choices: ['$57$ de lei', '$63$ de lei', '$65$ de lei', '$66$ de lei'], ans: 1 },
    {
      text: 'Cel mai mic dintre numerele $A=-5+(-4)$, $B=-5+4$, $C=-(-5)+4$, $D=+5-4$ este:',
      choices: ['$A$', '$B$', '$C$', '$D$'], ans: 0,
    },
    {
      text: 'O ceașcă are volumul de $200$ ml, iar o cană are volumul de $450$ ml. Volumul a șase cești și patru căni, toate pline, este egal cu:',
      choices: ['$2$ litri', '$3$ litri', '$4$ litri', '$5$ litri'], ans: 1,
    },
    {
      text: 'Patru elevi, Andrei, Bianca, Călin și Dana, efectuează calculul $\\left(\\sqrt{2}+\\sqrt{3}\\right)^2-\\sqrt{24}$ și obțin rezultatele:\n\n| Andrei | Bianca | Călin | Dana |\n|---|---|---|---|\n| $5-2\\sqrt{6}$ | $5$ | $5-\\sqrt{6}$ | $\\sqrt{2}+\\sqrt{3}$ |\n\nDintre cei patru elevi, cel care a efectuat corect calculul este:',
      choices: ['Andrei', 'Bianca', 'Călin', 'Dana'], ans: 1,
    },
    {
      text: 'Într-o clasă sunt $26$ de elevi. Sandu, unul dintre elevi, afirmă: „Am de trei ori mai multe colege decât colegi.” Afirmația lui Sandu este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$ și $D$, astfel încât $B$ este mijlocul segmentului $AC$, iar $C$ este mijlocul segmentului $AD$. Dacă $AD=20$ cm, atunci lungimea segmentului $BC$ este egală cu:',
      choices: ['$2$ cm', '$4$ cm', '$5$ cm', '$10$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată $AOB$, $BOC$ și $COA$ sunt unghiuri congruente formate în jurul punctului $O$, iar punctele $A$, $O$, $D$ sunt coliniare, în această ordine. Măsura unghiului $BOD$ este egală cu:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este desenat trapezul $ABCD$, cu bazele $AB=10$ cm, $DC=4$ cm și $AD=BC=5$ cm. Aria trapezului $ABCD$ este egală cu:',
      choices: ['$28\\text{ cm}^2$', '$35\\text{ cm}^2$', '$56\\text{ cm}^2$', '$70\\text{ cm}^2$'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat pătratul $ABCD$, cu $\\{O\\}=AC\\cap BD$. Dacă triunghiul $DOE$ este echilateral, atunci măsura unghiului $DBE$ este egală cu:',
      choices: ['$15^\\circ$', '$20^\\circ$', '$30^\\circ$', '$45^\\circ$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată sunt desenate un cerc și un patrulater $ABCD$ cu vârfurile pe cerc. Dacă măsura arcului $ADC$ este egală cu $240^\\circ$, iar punctul $B$ este mijlocul arcului mic $AC$, atunci măsura unghiului $BAC$ este egală cu:',
      choices: ['$15^\\circ$', '$30^\\circ$', '$45^\\circ$', '$60^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentat un con circular drept cu înălțimea $VO=15$ cm și raza bazei $OA=8$ cm. Aria laterală a conului este egală cu:',
      choices: ['$64\\pi\\text{ cm}^2$', '$120\\pi\\text{ cm}^2$', '$136\\pi\\text{ cm}^2$', '$272\\pi\\text{ cm}^2$'], ans: 2, fig: fig12,
    },

    {
      text: 'Un turist parcurge un drum în patru zile, după cum urmează: în prima zi parcurge jumătate din drum, a doua zi, jumătate din rest, a treia zi, jumătate din noul rest, iar a patra zi, ultimul rest, care este de $200$ km.',
      parts: [
        { pts: 2, text: 'Află ce procent din întregul drum parcurge turistul în a doua zi.', ans: '$\\dfrac{1}{2}\\cdot\\dfrac{1}{2}=\\dfrac{1}{4}$, adică $25\\%$' },
        { pts: 3, text: 'Determină lungimea totală a drumului parcurs de turist în cele patru zile.', ans: 'A treia și a patra zi parcurge câte $\\dfrac{1}{8}$ din drum, deci drumul are $8\\cdot200=1600$ km' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{1}{9x}-\\dfrac{1}{x^3}\\right):\\dfrac{x^3+6x^2+9x}{9x^4}$, unde $x\\in\\mathbb{R}\\setminus\\{-3;\\,0\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x-3}{x+3}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3;\\,0\\}$.', ans: '$\\dfrac{x^2-9}{9x^3}:\\dfrac{x(x+3)^2}{9x^4}=\\dfrac{(x-3)(x+3)}{9x^3}\\cdot\\dfrac{9x^3}{(x+3)^2}=\\dfrac{x-3}{x+3}$' },
        { pts: 3, text: 'Determină $x\\in\\mathbb{Z}$ pentru care $E(x)+\\dfrac{1}{2x}=0$.', ans: '$2x(x-3)+x+3=0\\iff2x^2-5x+3=0\\iff(x-1)(2x-3)=0$; cum $x\\in\\mathbb{Z}$, $x=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+3$ și sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Rezolvă, în mulțimea numerelor reale, inecuația $f(3x)\\le12$.', ans: '$3x+3\\le12$, deci $x\\in(-\\infty,\\,3]$' },
        { pts: 3, text: 'Fie punctele $A(0,\\,f(0))$ și $B(2,\\,f(2))$. Determină coordonatele punctului $C$, situat pe axa $Ox$, astfel încât $AC=BC$.', ans: '$A(0,\\,3)$, $B(2,\\,5)$, $C(c,\\,0)$: $c^2+9=(c-2)^2+25$, deci $c=5$ și $C(5,\\,0)$' },
      ],
    },
    {
      text: 'În figura alăturată sunt reprezentate dreptunghiul $ABCD$, cu laturile $AB=16$ cm și $BC=12$ cm, și rombul $AECF$, ale cărui vârfuri $E$ și $F$ se află pe segmentele $AB$, respectiv $CD$.',
      parts: [
        { pts: 2, text: 'Demonstrează că patrulaterul $BEDF$ este paralelogram.', ans: '$BE=AB-AE=CD-CF=FD$ și $BE\\parallel FD$ (căci $AB\\parallel CD$), deci $BEDF$ este paralelogram' },
        { pts: 3, text: 'Află lungimea segmentului $EF$.', ans: 'Fie $AC\\cap EF=\\{O\\}$: $AC=20$ cm, $CO=10$ cm; $\\triangle COF\\sim\\triangle CDA$, deci $FO=\\dfrac{AD\\cdot CO}{CD}=\\dfrac{12\\cdot10}{16}=\\dfrac{15}{2}$ cm și $EF=2FO=15$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este desenat pătratul $ABCD$. Punctul $E$ se află pe prelungirea laturii $BC$, astfel încât măsura unghiului $CDE$ este $30^\\circ$, iar punctul $F$ aparține laturii $AD$, astfel încât măsura unghiului $FBE$ este $60^\\circ$.',
      parts: [
        { pts: 2, text: 'Demonstrează că $AF=CE$.', ans: '$\\triangle FAB\\equiv\\triangle ECD$ ($AB=CD$, $\\sphericalangle A=\\sphericalangle C=90^\\circ$, $\\sphericalangle ABF=\\sphericalangle CDE=30^\\circ$), deci $AF=CE$' },
        { pts: 3, text: 'Arată că $DG=(\\sqrt{3}-1)GC$, unde $G$ este punctul de intersecție a dreptelor $CD$ și $EF$.', ans: 'Fie $CE=x$: $DC=x\\sqrt{3}$, $DF=x\\sqrt{3}-x$; $\\triangle DGF\\sim\\triangle CGE$, deci $\\dfrac{DG}{GC}=\\dfrac{DF}{CE}=\\sqrt{3}-1$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat trunchiul de piramidă patrulateră regulată $ABCDA'B'C'D'$, cu baza mare $ABCD$, $AB=16$ cm și baza mică $A'B'C'D'$, $A'B'=8$ cm. Înălțimea trunchiului este $OO'=4\\sqrt{22}$ cm.",
      parts: [
        { pts: 2, text: "Arată că muchia laterală a trunchiului, $AA'$, este egală cu $8\\sqrt{6}$ cm.", ans: "$AO=8\\sqrt{2}$ cm, $A'O'=4\\sqrt{2}$ cm, deci $AA'^2=(AO-A'O')^2+OO'^2=32+352=384$ și $AA'=8\\sqrt{6}$ cm" },
        { pts: 3, text: "Află măsura unghiului determinat de dreptele $AA'$ și $BC'$.", ans: "$AO\\parallel A'C'$ și $AO=A'C'=8\\sqrt{2}$ cm, deci $AOC'A'$ este paralelogram și $OC'\\parallel AA'$; $\\sphericalangle(AA',BC')=\\sphericalangle OC'B$, cu $\\sphericalangle BOC'=90^\\circ$ și $\\operatorname{tg}\\sphericalangle OC'B=\\dfrac{OB}{OC'}=\\dfrac{1}{\\sqrt{3}}$, deci $30^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
