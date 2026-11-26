// Testul 18 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 108–109; every answer here is computed and checked with the book's answers, p. 276).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { pol, PRISM3, tetra, TETRA } from './shapes'

const s3 = Math.sqrt(3)

// not to scale, as in the book, so that the names fit
const fig7 = plane({ A: [0, 0], A1: [3, 0], A2: [6, 0], A3: [9, 0], A8: [15, 0], A9: [18, 0], B: [22, 0] }, 190, {
  s: 'A-A3 A8-B', d: 'A3-A8', dot: 'A A1 A2 A3 A8 A9 B', l: { A: 's', A1: 's', A2: 's', A3: 's', A8: 's', A9: 's', B: 's' },
})
const fig8 = plane({ O: [0, 0], A: pol(60, 9), C: pol(240, 7), B: [-8, 0], D: [8, 0] }, 120, { s: 'A-C B-D', l: { O: 'n' } })
const fig9 = plane({ A: [4 * s3, 0], C: [4 * s3, -12], B: [-4 * s3, 0], M: [0, 0] }, 120, { s: 'A-B-C-A C-M', ra: ['BAC'] })
const fig10 = plane({ D: [0, 0], C: [10, 0], A: [4, 5], B: [14, 5], F: [17, 5], E: [5.3, 0] }, 140, { s: 'A-F B-C-D-A B-E' })
const fig11 = plane({ O: [0, 0], C: [0, -6], A: [-3 * s3, -3], B: [3 * s3, -3] }, 90, { s: 'A-B O-C', c: [{ at: 'O', r: 6 }], dot: 'O', l: { O: 'n' } })
const fig12 = solid(tetra(100, ['B', 'C', 'D', 'A']), TETRA('B', 'C', 'D', 'A'), 120)

const fig16 = plane({ A: [0, 0], B: [16, 0], C: [20, 4 * s3], D: [4, 4 * s3], M: [8, 0], N: [2, 2 * s3] }, 140, { s: 'A-B-C-D-A C-M M-N', ra: ['MNA'] })
const fig17 = plane({ A: [0, 0], B: pol(-15, 10), C: pol(-45, 10), D: pol(-105, 10) }, 110, { s: 'A-B-C-D-A A-C', l: { A: 'n' } })
const fig18 = solid({ A: [0, 70, 0], B: [40, 0, 0], C: [80, 70, 0], "A'": [0, 70, 90], "B'": [40, 0, 90], "C'": [80, 70, 90], M: [60, 35, 0], "M'": [60, 35, 90] }, PRISM3, 130, {
  seg: "M-M'", dot: "M M'",
})

export const M49: EnModel = {
  id: 'en-49',
  title: 'Paralela 45, Testul 18',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 108–109',
  items: [
    { text: 'Suma primelor trei zecimale ale numărului în care se transformă fracția $\\dfrac{7}{6}$ este egală cu:', choices: ['$6$', '$166$', '$18$', '$13$'], ans: 3 },
    {
      text: 'În tabelul alăturat sunt trecute cantitățile de legume cu care a venit un agricultor la piață. Legumele care reprezintă $40\\%$ din cantitatea totală de marfă cu care a venit agricultorul sunt:\n\n| ardei | cartofi | castraveți | vinete |\n|---|---|---|---|\n| $40$ kg | $60$ kg | $20$ kg | $30$ kg |',
      choices: ['ardeii', 'vinetele', 'cartofii', 'castraveții'], ans: 2,
    },
    { text: 'Suma dintre cel mai mare număr întreg negativ de două cifre și cel mai mic număr natural de două cifre este:', choices: ['$-1$', '$0$', '$1$', '$3$'], ans: 1 },
    { text: 'Dintre numerele $\\dfrac{10}{9}$, $\\dfrac{11}{10}$, $\\dfrac{12}{11}$ și $\\dfrac{13}{12}$, cel mai mare este numărul:', choices: ['$\\dfrac{13}{12}$', '$\\dfrac{10}{9}$', '$\\dfrac{12}{11}$', '$\\dfrac{11}{10}$'], ans: 1 },
    {
      text: 'Patru elevi, Claudia, Crina, Costel și Cristi, au avut de efectuat calculul: $\\dfrac{8}{\\sqrt{2}}-\\sqrt{18}+|\\sqrt{2}-2|$. Rezultatele obținute sunt trecute în tabelul alăturat.\n\n| Claudia | Crina | Costel | Cristi |\n|---|---|---|---|\n| $2\\sqrt{2}$ | $-2$ | $2$ | $0$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Cristi', 'Crina', 'Costel', 'Claudia'], ans: 2,
    },
    { text: 'Ioana are $14$ ani, iar fratele ei are cu $10$ ani mai puțin. Ioana afirmă: „Peste un an, vârsta mea va fi de trei ori mai mare decât vârsta fratelui meu”. Afirmația Ioanei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată este reprezentat segmentul $AB$, $AB=23$ cm, iar punctele $A_1,\\,A_2,\\,\\ldots,\\,A_9$ sunt situate pe segmentul $AB$ astfel încât $AA_1=3$ cm, $A_9B=4$ cm și $A_1A_2=A_2A_3=\\ldots=A_8A_9$. Valoarea raportului $\\dfrac{AA_4}{A_2B}$ este egală cu:',
      choices: ['$\\dfrac{1}{2}$', '$\\dfrac{9}{16}$', '$\\dfrac{3}{4}$', '$\\dfrac{1}{3}$'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $AC$ și $BD$ sunt concurente în punctul $O$. Măsura unghiului format de bisectoarele unghiurilor $AOD$ și $BOC$ este egală cu:',
      choices: ['$150^\\circ$', '$0^\\circ$', '$180^\\circ$', '$90^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic în care unghiul $B$ are măsura de $30^\\circ$, iar lungimea bisectoarei $CM$, $M\\in AB$, este egală cu $8$ cm. Lungimea ipotenuzei $BC$ este egală cu:',
      choices: ['$16$ cm', '$2\\sqrt{3}$ cm', '$12$ cm', '$8\\sqrt{3}$ cm'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un paralelogram. $BE$ este bisectoarea unghiului $ABC$, $E\\in DC$, iar $A$, $B$, $F$ sunt puncte coliniare, cu $B\\in(AF)$. Dacă măsura unghiului $EBF$ este egală cu $160^\\circ$, măsura unghiului $BAD$ este egală cu:',
      choices: ['$140^\\circ$', '$40^\\circ$', '$160^\\circ$', '$20^\\circ$'], ans: 0, fig: fig10,
    },
    {
      text: 'În cercul cu raza de $6$ cm din figura alăturată, coarda $AB$ este mediatoarea razei $OC$. Lungimea arcului mic $AC$ este egală cu:',
      choices: ['$60^\\circ$', '$2\\pi$', '$3\\pi$', '$120^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un tetraedru regulat care are suma lungimilor muchiilor egală cu $6\\sqrt{6}$ cm. Distanța de la punctul $A$ la planul $BCD$ este egală cu:',
      choices: ['$1$ cm', '$2$ cm', '$2\\sqrt{6}$ cm', '$\\dfrac{\\sqrt{2}}{3}$ cm'], ans: 1, fig: fig12,
    },

    {
      text: 'Două kilograme de cireșe și un kilogram de roșii costă $21$ de lei. Un kilogram de cireșe și două kilograme de roșii costă $18$ lei.',
      parts: [
        { pts: 2, text: 'Este posibil ca un kilogram de roșii și un kilogram de cireșe să coste $14$ lei? Justifică răspunsul.', ans: 'Nu: adunând, $3$ kg de cireșe și $3$ kg de roșii costă $39$ de lei, deci $1$ kg din fiecare costă $13$ lei' },
        { pts: 3, text: 'Determină prețul unui kilogram de cireșe.', ans: '$c+r=13$ și $2c+r=21$, deci $c=8$ lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{3x}{3x^2-2x}-\\dfrac{2x-2}{3x+2}:(x-1)+\\dfrac{8}{4-9x^2}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{2}{3},\\,0,\\,\\dfrac{2}{3},\\,1\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{1}{3x-2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{2}{3},\\,0,\\,\\dfrac{2}{3},\\,1\\right\\}$.', ans: '$E(x)=\\dfrac{3}{3x-2}-\\dfrac{2}{3x+2}-\\dfrac{8}{(3x-2)(3x+2)}=\\dfrac{9x+6-6x+4-8}{(3x-2)(3x+2)}=\\dfrac{1}{3x-2}$' },
        { pts: 3, text: 'Dacă $a,\\,b\\in\\mathbb{R}\\setminus\\left\\{-\\dfrac{2}{3},\\,0,\\,\\dfrac{2}{3},\\,1\\right\\}$, astfel încât $3ab=a+b$, atunci arată că $E(a)+E(b)+1=0$.', ans: '$\\dfrac{1}{3a-2}+\\dfrac{1}{3b-2}+1=\\dfrac{9ab-3a-3b}{(3a-2)(3b-2)}=\\dfrac{3(3ab-a-b)}{(3a-2)(3b-2)}=0$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-m$, unde $m$ este un număr real, și un sistem de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Determină valoarea lui $m$, știind că punctul $P(-3,\\,-10)$ aparține reprezentării grafice a funcției $f$.', ans: '$f(-3)=-6-m=-10$, deci $m=4$' },
        { pts: 3, text: 'Dacă $m=4$, determină coordonatele punctelor care aparțin reprezentării grafice a funcției $f$ și care au modulul abscisei egal cu modulul ordonatei.', ans: '$|a|=|2a-4|$, deci $2a-4=\\pm a$: $A_1(4,\\,4)$ și $A_2\\left(\\dfrac{4}{3},\\,-\\dfrac{4}{3}\\right)$' },
      ],
    },
    {
      text: 'În figura alăturată, $ABCD$ este un paralelogram cu $BC=8$ cm și $\\sphericalangle A=60^\\circ$. Mediatoarea segmentului $AD$ este $MN$, unde $N\\in AD$ și $M\\in AB$, iar semidreapta $CM$ este bisectoarea unghiului $BCD$.',
      parts: [
        { pts: 2, text: 'Demonstrează că perimetrul paralelogramului $ABCD$ este egal cu $48$ cm.', ans: '$MA=MD$ și $\\sphericalangle A=60^\\circ$, deci $\\triangle ADM$ e echilateral și $AM=8$ cm; $\\sphericalangle BCM=30^\\circ$, $\\sphericalangle MBC=120^\\circ$, deci $MB=BC=8$ cm; $\\mathcal{P}_{ABCD}=2\\cdot16+2\\cdot8=48$ cm' },
        { pts: 3, text: 'Determină distanța de la punctul $M$ la dreapta $BC$.', ans: 'Cu $MT\\perp BC$, $T\\in BC$: $MC=8\\sqrt{3}$ cm și $\\sphericalangle MCB=30^\\circ$, deci $MT=\\dfrac{MC}{2}=4\\sqrt{3}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'Fie $ABCD$ un patrulater convex cu $AB=AC=AD$, $DC=6$ cm, $\\sphericalangle ABC=75^\\circ$ și $\\sphericalangle BAD=90^\\circ$. Notăm cu $G_1$ și $G_2$ centrele de greutate ale triunghiurilor $ADC$, respectiv $ABC$.',
      parts: [
        { pts: 2, text: 'Demonstrează că $\\mathcal{A}_{ADC}=9\\sqrt{3}\\text{ cm}^2$.', ans: '$\\sphericalangle BAC=30^\\circ$, deci $\\sphericalangle DAC=60^\\circ$ și $\\triangle ADC$ e echilateral, cu latura $6$ cm: $\\mathcal{A}_{ADC}=\\dfrac{36\\sqrt{3}}{4}=9\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Arată că $G_1G_2=2\\sqrt{2}$ cm.', ans: 'Cu $M$ mijlocul lui $AC$: $\\dfrac{MG_1}{MD}=\\dfrac{MG_2}{MB}=\\dfrac{1}{3}$, deci $G_1G_2\\parallel DB$ și $G_1G_2=\\dfrac{BD}{3}=\\dfrac{6\\sqrt{2}}{3}=2\\sqrt{2}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o prismă triunghiulară regulată $ABCA'B'C'$, având $AA'=6\\sqrt{3}$ cm și aria laterală egală cu $216\\sqrt{3}\\text{ cm}^2$. Punctele $M$ și $M'$ sunt mijloacele muchiilor $BC$, respectiv $B'C'$.",
      parts: [
        { pts: 2, text: "Demonstrează că $AM'\\perp A'M$.", ans: "$3\\cdot AB\\cdot6\\sqrt{3}=216\\sqrt{3}$, deci $AB=12$ cm și $AM=6\\sqrt{3}$ cm $=AA'$; $AMM'A'$ e pătrat, iar diagonalele lui sunt perpendiculare" },
        { pts: 3, text: "Determină măsura unghiului format de dreapta $BM'$ cu planul $(MAA')$.", ans: "$BM\\perp AM$, $BM\\perp MM'$, deci proiecția lui $BM'$ pe $(MAA')$ este $MM'$ și unghiul este $\\sphericalangle BM'M$; $\\text{tg}\\sphericalangle BM'M=\\dfrac{6}{6\\sqrt{3}}$, deci $30^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
