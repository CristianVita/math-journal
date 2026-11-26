// Testul 1 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 59–63; the book's indications are not in the photos, so every answer here is computed)
import type { EnModel } from '../types'
import { meet, plane, solid, mid3 } from '../figure'
import { BOX, box, graph, pol, PRISM3, prism3 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [3, 0], B: [6, 0], N: [14, 0], C: [18, 0] }, 170, { s: 'A-C', dot: 'A M B N C', l: { A: 'n', M: 'n', B: 'n', N: 'n', C: 'n' } })
const fig8 = plane({ A: [8, 6], B: [0, 0], C: [16, 0], M: [8, 0], N: [12, 3], G: [8, 2] }, 150, { s: 'A-B-C-A A-M B-N', l: { G: 'w' } })
const fig9 = plane({ A: [0, 6], B: [0, 0], C: [6 * s3, 6], D: [2 * s3, 6] }, 140, { s: 'A-B-C-A B-D', ra: ['BAC'] })
const fig10 = plane({ A: [0, 0], B: [6, 0], C: [2, 3], D: [0, 3] }, 120, { s: 'A-B-C-D-A', ra: ['DAB', 'CDA'] })
const fig11 = plane({ O: [0, 0], A: pol(70, 3), B: pol(170, 3), C: pol(320, 3) }, 120, { s: 'A-B-C-A O-B O-C', c: [{ at: 'O', r: 3 }], dot: 'O', l: { O: 'e' } })
const fig12 = solid({ ...box(4, 4, 4), O: [2, 2, 0] }, BOX, 120, { seg: "B-C' D'-O B-D", l: { O: 's' } })

const fig15 = graph({ A: [-3, 0], B: [0, 4], L1: [-3.75, -1], L2: [0.75, 5] }, 130, [-4.5, 2.5], [-1.5, 5.8], { s: 'L1-L2', dot: 'A B', l: { A: 'nw', B: 'e', L1: '', L2: '' } })
const fig16 = plane({ A: [0, 12], B: [0, 0], C: [12, 0], D: [4, 0], E: [0, -4] }, 130, { s: 'A-B-C-A A-D B-E-D E-C', ra: ['ABC'], l: { D: 'n' } })
const A17 = [0, 0] as [number, number], B17 = [16, 0] as [number, number], C17 = [9, 12] as [number, number], D17 = [0, 12] as [number, number]
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, O: meet(A17, C17, B17, D17) }, 150, { s: 'A-B-C-D-A A-C B-D', ra: ['DAB'], l: { O: 'n' } })
const p18 = prism3(12, 8)
const fig18 = solid({ ...p18, M: mid3(p18.A, p18.B) }, PRISM3, 140, { seg: "C-M M-B' C-B'", l: { M: 'sw' } })

export const M24: EnModel = {
  id: 'en-24',
  title: 'Paralela 45, Testul 1',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 59–63',
  items: [
    { text: 'Cel mai mare număr natural care împărțit la $7$ dă câtul $10$ este egal cu:', choices: ['$70$', '$71$', '$76$', '$77$'], ans: 2 },
    { text: 'Un telefon, care costă $1000$ de lei, se ieftinește cu $10\\%$, iar noul preț se mărește cu $10\\%$. Diferența dintre prețul inițial și prețul final al telefonului este egală cu:', choices: ['$0$ lei', '$1$ leu', '$10$ lei', '$20$ de lei'], ans: 2 },
    { text: 'Diferența dintre cel mai mic și cel mai mare număr întreg din intervalul $(-3,\\,5]$ este egală cu:', choices: ['$-8$', '$-7$', '$-6$', '$2$'], ans: 1 },
    {
      text: 'Dintre următoarele șiruri de numere, cel scris în ordine crescătoare este:',
      choices: ['$\\dfrac{2}{3};\\ 0{,}5;\\ \\dfrac{5}{6};\\ 0{,}75$', '$\\dfrac{5}{6};\\ 0{,}5;\\ 0{,}75;\\ \\dfrac{2}{3}$', '$0{,}5;\\ 0{,}75;\\ \\dfrac{2}{3};\\ \\dfrac{5}{6}$', '$0{,}5;\\ \\dfrac{2}{3};\\ 0{,}75;\\ \\dfrac{5}{6}$'], ans: 3,
    },
    {
      text: 'Patru elevi, Ana, Bogdan, Cristi și Dana, au calculat rădăcina pătrată a produsului numerelor $\\sqrt{5}$, $\\sqrt{6}$, $\\sqrt{8}$ și $\\sqrt{15}$. Rezultatele obținute de ei sunt trecute în tabelul următor:\n\n| Ana | Bogdan | Cristi | Dana |\n|---|---|---|---|\n| $2\\sqrt{15}$ | $10\\sqrt{6}$ | $60$ | $3600$ |\n\nDintre cei patru elevi, cel care a obținut rezultatul corect este:',
      choices: ['Ana', 'Bogdan', 'Cristi', 'Dana'], ans: 0,
    },
    { text: 'Teodor a parcurs într-o zi $24$ km, adică $\\dfrac{3}{5}$ din drumul pe care trebuia să-l străbată. Sora lui Teodor spune că lungimea totală a drumului pe care îl avea de parcurs Teodor este de $40$ km. Afirmația surorii este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele $A$, $B$, $C$, coliniare, în această ordine. Punctul $M$ este mijlocul segmentului $AB$, iar punctul $N$ se află pe segmentul $BC$, astfel încât $BN=2NC$. Dacă $AB=6$ cm și $BC=12$ cm, atunci lungimea segmentului $MN$ este egală cu:',
      choices: ['$6$ cm', '$9$ cm', '$11$ cm', '$15$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ cu $AB=AC=10$ cm și $BC=16$ cm. Medianele $AM$ și $BN$ se intersectează în punctul $G$. Lungimea segmentului $AG$ este egală cu:',
      choices: ['$10$ cm', '$8$ cm', '$6$ cm', '$4$ cm'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este desenat un triunghi $ABC$ cu $\\sphericalangle A=90^\\circ$, $\\sphericalangle C=30^\\circ$ și $AC=6\\sqrt{3}$ cm. Dacă $BD$ este bisectoarea unghiului $ABC$, atunci lungimea segmentului $AD$ este egală cu:',
      choices: ['$2\\sqrt{3}$ cm', '$3\\sqrt{3}$ cm', '$4\\sqrt{3}$ cm', '$5\\sqrt{3}$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul $ABCD$, cu $\\sphericalangle A=\\sphericalangle D=90^\\circ$, $AB=6$ m, $BC=5$ m și $CD=2$ m. Aria trapezului $ABCD$ este egală cu:',
      choices: ['$40\\text{ m}^2$', '$24\\text{ m}^2$', '$12\\text{ m}^2$', '$6\\text{ m}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este desenat triunghiul $ABC$ înscris în cercul cu centrul în $O$. Dacă $\\sphericalangle BOC=150^\\circ$, atunci măsura unghiului $BAC$ este egală cu:',
      choices: ['$90^\\circ$', '$75^\\circ$', '$60^\\circ$', '$45^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: "În figura alăturată este desenat cubul $ABCDA'B'C'D'$. Punctul $O$ este mijlocul segmentului $BD$. Măsura unghiului determinat de dreptele $BC'$ și $D'O$ este egală cu:",
      choices: ['$15^\\circ$', '$30^\\circ$', '$45^\\circ$', '$60^\\circ$'], ans: 1, fig: fig12,
    },

    {
      text: 'Un biciclist a parcurs un drum în trei zile. În prima zi, el a parcurs cu $5$ km mai puțin decât $\\dfrac{1}{3}$ din lungimea drumului, a doua zi cu $15$ km mai mult decât $\\dfrac{1}{3}$ din rest, iar a treia zi ultimii $55$ km.',
      parts: [
        { pts: 2, text: 'Este posibil ca biciclistul să fi parcurs în prima zi $13$ km? Justifică răspunsul dat.', ans: 'Nu: atunci drumul ar avea $3\\cdot18=54$ km, restul $41$ km, iar a treia zi ar rămâne $41-\\left(\\dfrac{41}{3}+15\\right)\\ne55$ km (în prima zi a parcurs $45$ km)' },
        { pts: 3, text: 'Determină lungimea totală a drumului.', ans: 'Restul $r$: $\\dfrac{2r}{3}-15=55$, deci $r=105$ km; $\\dfrac{2}{3}d+5=105$, deci $d=150$ km' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=(x-1)\\cdot\\left(\\dfrac{x-2}{x-1}-\\dfrac{x}{x+2}\\right)-\\dfrac{2x-4}{4-x^2}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)+\\dfrac{4}{x+2}=1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,1,\\,2\\}$.', ans: '$E(x)=x-2-\\dfrac{x^2-x}{x+2}+\\dfrac{2}{x+2}=\\dfrac{x-2}{x+2}=1-\\dfrac{4}{x+2}$' },
        { pts: 3, text: 'Determină numerele întregi $n$, pentru care $E(n)$ este număr întreg.', ans: '$(n+2)\\mid4$ și $n\\notin\\{-2,1,2\\}$: $n\\in\\{-6,\\,-4,\\,-3,\\,-1,\\,0\\}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\dfrac{4x+12}{3}$. Fie $A$ și $B$ punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$, ale sistemului de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Determină coordonatele punctelor $A$ și $B$.', ans: '$A(-3,\\,0)$, $B(0,\\,4)$' },
        { pts: 3, text: 'Determină coordonatele punctului $P$, situat pe reprezentarea grafică a funcției $f$, astfel încât $AB=BP$, $P\\ne A$.', ans: '$B$ este mijlocul lui $AP$: $P(3,\\,8)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată sunt reprezentate triunghiurile dreptunghice isoscele $ABC$ și $DBE$, cu $\\sphericalangle ABC=\\sphericalangle DBE=90^\\circ$, punctul $D$ fiind situat pe $BC$. Se știe că $BC=3BD=12$ cm.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $ADC$.', ans: '$\\dfrac{DC\\cdot AB}{2}=\\dfrac{8\\cdot12}{2}=48\\text{ cm}^2$' },
        { pts: 3, text: 'Demonstrează că dreptele $AD$ și $EC$ sunt perpendiculare.', ans: '$\\triangle ABD\\equiv\\triangle CBE$ (C.C.: $AB=CB$, $BD=BE$), deci $\\sphericalangle BAD=\\sphericalangle BCE$; dacă $\\{P\\}=AD\\cap EC$, în $\\triangle PDC$: $\\sphericalangle PDC=\\sphericalangle ADB$ (opuse la vârf) și $\\sphericalangle DCP=\\sphericalangle BAD$, cu suma $90^\\circ$, deci $\\sphericalangle DPC=90^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul $ABCD$, cu baza mare $AB=16$ cm, baza mică $CD=9$ cm și înălțimea $AD=12$ cm. Diagonalele trapezului se intersectează în punctul $O$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea segmentului $AO$.', ans: '$AC=15$ cm și $\\dfrac{AO}{OC}=\\dfrac{AB}{CD}=\\dfrac{16}{9}$, deci $AO=\\dfrac{16}{25}\\cdot15=9{,}6$ cm' },
        { pts: 3, text: 'Demonstrează că diagonalele trapezului sunt perpendiculare.', ans: '$BD=20$ cm, $BO=\\dfrac{16}{25}\\cdot20=12{,}8$ cm și $AO^2+BO^2=92{,}16+163{,}84=256=AB^2$, deci $\\sphericalangle AOB=90^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată prisma triunghiulară regulată $ABCA'B'C'$ cu $AB=12$ cm și $BB'=8$ cm. Punctul $M$ este mijlocul laturii $AB$.",
      parts: [
        { pts: 2, text: "Calculează aria triunghiului $CMB'$.", ans: "$CM\\perp(ABB')$, deci $CM\\perp MB'$; $CM=6\\sqrt{3}$, $MB'=10$, aria $=30\\sqrt{3}\\text{ cm}^2$" },
        { pts: 3, text: "Determină distanța de la punctul $A$ la planul $(CMB')$.", ans: "$(CMB')\\perp(ABB')$, deci distanța este $d(A,MB')=\\dfrac{AM\\cdot BB'}{MB'}=\\dfrac{6\\cdot8}{10}=4{,}8$ cm" },
      ],
      fig: fig18,
    },
  ],
}
