// Testul 25 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 122–124; every answer here is computed and checked with the book's answers, p. 279).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [4, 0], C: [5, 0], D: [7, 0], E: [10, 0], R: [11, 0] }, 170, { s: 'A-R', dot: 'A B C D E', l: { R: '', A: 'n', B: 'n', C: 'n', D: 'n', E: 'n' } })
const fig8 = plane({ O: [0, 0], A: [0, 8], B: pol(50, 8), C: [8, 0], D: pol(-40, 8) }, 100, { s: 'O-A O-B O-C O-D', ra: ['COA', 'DOB'], l: { O: 'w' } })
const fig9 = plane({ A: [0, 0], B: [-12, 0], C: [0, -4 * s3], D: [-4, 0] }, 130, { s: 'A-B-C-A C-D', ra: ['BAC'] })
const hx = (deg: number) => pol(deg, 4)
const fig10 = plane({ A: hx(120), B: hx(60), C: hx(0), D: hx(-60), E: hx(-120), F: hx(180) }, 100, { s: 'A-B-C-D-E-F-A' })
const fig11 = plane({ O: [0, 0], A: pol(150, 5), C: pol(30, 5), B: pol(350, 5), D: pol(250, 5), P: [2.304, 0.086] }, 110, {
  s: 'A-B C-D', c: [{ at: 'O', r: 5 }], l: { O: '', P: 'n' },
})

const fig15 = graph({ A: [s3, 0], B: [0, -3], L1: [-0.3, -3 - 0.3 * s3], L2: [2.6, 2.6 * s3 - 3] }, 110, [-2, 3.5], [-4, 2], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'nw', B: 'w', O: 'nw' } })
const h16 = Math.sqrt(36 - 6.25)
const fig16 = plane({ A: [0, 0], B: [10, 0], C: [7.5, h16], D: [2.5, h16], O: [5, (2 * h16) / 3], M: [10 - 2.5 * (2 / 3), (2 * h16) / 3] }, 140, { s: 'A-B-C-D-A A-C B-D O-M', l: { O: 'n' } })
const fig17 = plane({ O: [0, 0], A: [-24, 0], C: [6, 0], B: [0, -8], D: [0, 10] }, 140, { s: 'A-C B-D A-D B-C', ra: ['COD'], l: { O: 'sw' } })
const fig18 = solid({ ...box(30, 30, 30), O: [15, 15, 15] }, BOX, 120, { seg: "B-D' C-A' B-C", dot: 'O' })

export const M56: EnModel = {
  id: 'en-56',
  title: 'Paralela 45, Testul 25',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 122–124',
  items: [
    { text: 'Rezultatul calculului $2^5:2^3\\cdot2-1$ este:', choices: ['$1$', '$4$', '$7$', '$0$'], ans: 2 },
    {
      text: 'Activitatea unei unități de triaj în patru zile consecutive este sintetizată în tabelul alăturat. Zilele în care raportul dintre numărul pacienților consultați și al celor internați este același sunt:\n\n| | Luni | Marți | Miercuri | Joi |\n|---|---|---|---|---|\n| Nr. pacienți consultați | $30$ | $12$ | $15$ | $16$ |\n| Nr. pacienți internați | $6$ | $1$ | $3$ | $2$ |',
      choices: ['luni și marți', 'miercuri și joi', 'luni și miercuri', 'marți și joi'], ans: 2,
    },
    { text: 'Produsul a trei numere întregi consecutive, cel mai mic dintre cele trei numere fiind $-3$, este egal cu:', choices: ['$-60$', '$-24$', '$-6$', '$0$'], ans: 2 },
    { text: 'Se dau numerele: $x=-\\dfrac{1}{3}$, $y=-\\dfrac{1}{4}$, $z=-\\dfrac{1}{2}$ și $t=-\\dfrac{1}{5}$. Ordinea crescătoare a numerelor este:', choices: ['$x,\\ y,\\ z,\\ t$', '$z,\\ x,\\ y,\\ t$', '$z,\\ y,\\ t,\\ x$', '$y,\\ x,\\ t,\\ z$'], ans: 1 },
    {
      text: 'Calculând $\\left(\\dfrac{2}{a}+\\dfrac{3}{b}\\right)(b-a)$, pentru $a=\\sqrt{3}$ și $b=\\sqrt{27}$, patru elevi, Toma, Vlad, Ingrid și Andrei, au obținut rezultatele din tabelul alăturat.\n\n| Toma | Vlad | Ingrid | Andrei |\n|---|---|---|---|\n| $12$ | $6$ | $-\\dfrac{5}{2}$ | $4\\sqrt{3}$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Andrei', 'Ingrid', 'Toma', 'Vlad'], ans: 3,
    },
    { text: 'Cătălin a prins trei pești, cel mai mare având $3{,}5$ kg. Valoarea de adevăr a propoziției: „Cătălin are cel puțin $12$ kg de pește.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$, $E$ sunt coliniare, în această ordine, $AB=4$ cm, $AC=5$ cm, $AD=7$ cm și $AE=10$ cm. Dintre propozițiile:\n\n$P_1$: punctul $B$ este mijlocul segmentului $AD$;\n$P_2$: punctul $C$ este mijlocul segmentului $BD$;\n$P_3$: punctul $B$ este mijlocul segmentului $AE$;\n$P_4$: punctul $D$ este mijlocul segmentului $BE$;\n\nadevărată este propoziția:',
      choices: ['$P_1$', '$P_2$', '$P_3$', '$P_4$'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt desenate unghiurile drepte $AOC$ și $BOD$, semidreapta $OB$ fiind în interiorul unghiului $AOC$. Suma măsurilor unghiurilor $BOC$ și $AOD$ este egală cu:',
      choices: ['$90^\\circ$', '$120^\\circ$', '$180^\\circ$', '$360^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$, având măsura unghiului $BAC$ egală cu $90^\\circ$, măsura unghiului $ABC$ egală cu $30^\\circ$, $AB=12$ cm și $CD$ este bisectoarea unghiului $ACB$, cu $D\\in AB$. Lungimea segmentului $AD$ este:',
      choices: ['$4$ cm', '$8$ cm', '$4\\sqrt{3}$ cm', '$8\\sqrt{3}$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat hexagonul regulat $ABCDEF$, având perimetrul egal cu $24$ cm. Aria hexagonului este egală cu:',
      choices: ['$24\\text{ cm}^2$', '$36\\sqrt{3}\\text{ cm}^2$', '$24\\sqrt{3}\\text{ cm}^2$', '$18\\sqrt{3}\\text{ cm}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AB$ și $CD$ sunt două coarde concurente în punctul $P$. Dacă arcele $AC$ și $BD$ au măsurile $120^\\circ$, respectiv $100^\\circ$, atunci măsura unghiului $APD$ este:',
      choices: ['$70^\\circ$', '$110^\\circ$', '$20^\\circ$', '$10^\\circ$'], ans: 0, fig: fig11,
    },
    { text: 'Un corp metalic, având forma unei piramide patrulatere regulate cu latura bazei de $8$ m și înălțimea de $6$ m se transformă, prin topire, în piese cubice cu latura de $2$ dm, fără pierderi de material. Numărul de piese cubice obținute este:', choices: ['$24000$', '$160$', '$1600$', '$16000$'], ans: 3 },

    {
      text: 'Două kilograme de roșii și trei kilograme de cartofi costă, împreună, $16$ lei. Patru kilograme de roșii și două kilograme de cartofi, de același fel, costă $24$ de lei.',
      parts: [
        { pts: 2, text: 'Este posibil ca un kilogram de roșii să coste $6$ lei? Justifică răspunsul.', ans: 'Nu: din $2r+3c=16$ și $4r+2c=24$ rezultă $r=5$ lei' },
        { pts: 3, text: 'Determină prețul unui kilogram de cartofi.', ans: '$2r+3c=16$ și $4r+2c=24$ dau $c=2$ lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2x^2+3x+11}{x^2+2x-3}-\\dfrac{x-2}{x+3}\\right):\\dfrac{1}{x^2-1}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2+2x-3=(x+3)(x-1)$, pentru orice număr real $x$.', ans: '$(x+3)(x-1)=x^2-x+3x-3=x^2+2x-3$' },
        { pts: 3, text: 'Demonstrează că numărul $1+E(n)$ este pătrat perfect, pentru orice număr natural $n$, diferit de $1$.', ans: 'Paranteza este $\\dfrac{2x^2+3x+11-(x-2)(x-1)}{(x+3)(x-1)}=\\dfrac{(x+3)^2}{(x+3)(x-1)}$, deci $E(x)=(x+3)(x+1)=x^2+4x+3$ și $1+E(n)=n^2+4n+4=(n+2)^2$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x\\sqrt{3}-3$.',
      parts: [
        { pts: 2, text: 'Calculează $f(\\sqrt{3})-f(0)$.', ans: '$f(\\sqrt{3})=0$, $f(0)=-3$, deci diferența este $3$' },
        { pts: 3, text: 'Știind că $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, determină distanța de la punctul $O$ la dreapta $AB$.', ans: '$A(\\sqrt{3},\\,0)$, $B(0,\\,-3)$, $AB=2\\sqrt{3}$, deci $d(O,AB)=\\dfrac{OA\\cdot OB}{AB}=\\dfrac{3}{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul isoscel $ABCD$ cu $AB\\parallel CD$, $AB=10$ cm, $CD=5$ cm și perimetrul de $27$ cm. Diagonalele trapezului se intersectează în punctul $O$, iar $M$ este un punct pe latura $BC$, astfel încât $BM=4$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $BC=6$ cm.', ans: '$2BC+15=27$, deci $BC=6$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $OM$.', ans: '$\\triangle COD\\sim\\triangle AOB$: $\\dfrac{OC}{OA}=\\dfrac{1}{2}=\\dfrac{CM}{MB}$, deci $OM\\parallel AB$ și $\\dfrac{OM}{AB}=\\dfrac{CM}{CB}=\\dfrac{1}{3}$: $OM=\\dfrac{10}{3}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'Patru localități $A$, $B$, $C$ și $D$ sunt unite prin șoselele $AC$, $AD$, $BC$ și $BD$, ca în figura alăturată. Drumurile $AC$ și $BD$ sunt perpendiculare și se întâlnesc în $O$. Se știe că $OA=24$ km, $OB=8$ km, $OC=6$ km și $OD=10$ km.',
      parts: [
        { pts: 2, text: 'Demonstrează că $BC=OD$.', ans: '$BC=\\sqrt{OB^2+OC^2}=\\sqrt{64+36}=10$ km $=OD$' },
        { pts: 3, text: 'Plecând din $B$ pe bicicletă, poștașul Vasile dorește să ajungă la șoseaua $AD$, mergând peste câmpuri, pe drumul cel mai scurt. Viteza sa este $18$ km/h. Arată că el va parcurge drumul dorit în mai puțin de o oră.', ans: '$AD=26$ km, $\\mathcal{A}_{ABD}=\\dfrac{AO\\cdot BD}{2}=216$, deci $d(B,AD)=\\dfrac{432}{26}=\\dfrac{216}{13}$ km și $t=\\dfrac{216}{13}\\cdot\\dfrac{1}{18}=\\dfrac{12}{13}$ ore, mai puțin de o oră' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată, $ABCDA'B'C'D'$ este un cub cu latura de $30$ cm.",
      parts: [
        { pts: 2, text: 'Putem împacheta cubul, acoperindu-l în întregime, cu o coală de hârtie având suprafața $0{,}5\\text{ m}^2$?', ans: '$\\mathcal{A}_t=6\\cdot900=5400\\text{ cm}^2=0{,}54\\text{ m}^2>0{,}5\\text{ m}^2$, deci nu' },
        { pts: 3, text: "Diagonalele $BD'$ și $CA'$ ale cubului se intersectează în punctul $O$. Calculează sinusul unghiului $BOC$.", ans: '$OB=OC=15\\sqrt{3}$ cm, $BC=30$ cm, iar distanța de la $O$ la $BC$ este $15\\sqrt{2}$ cm; $\\mathcal{A}_{BOC}=\\dfrac{30\\cdot15\\sqrt{2}}{2}=\\dfrac{OB\\cdot OC\\cdot\\sin(\\sphericalangle BOC)}{2}$, deci $\\sin(\\sphericalangle BOC)=\\dfrac{2\\sqrt{2}}{3}$' },
      ],
      fig: fig18,
    },
  ],
}
