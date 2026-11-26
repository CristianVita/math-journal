// Testul 36 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 145–147; every answer here is computed and checked with the book's answers, p. 282).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { along, mid, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [2, 0], C: [5, 0], D: [11, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 's', B: 's', C: 'n', D: 's' } })
const fig8 = plane({ B: [0, 0], C: [4, 0], A: [2, 2 / Math.tan((12.5 * Math.PI) / 180)] }, 80, { s: 'A-B-C-A', ang: ['BAC'] })
const A9: Pt = [4.5, 9], C9: Pt = [0, 0], D9: Pt = [9, 0]
const fig9 = plane({ A: A9, C: C9, D: D9, B: along(A9, C9, 2 / 3), E: along(A9, D9, 2 / 3) }, 110, { s: 'A-C-D-A B-E', l: { B: 'w', E: 'e' } })
const fig10 = plane({ A: [0, 12], B: [-5, 0], C: [0, -12], D: [5, 0] }, 70, { s: 'A-B-C-D-A' })
const fig11 = plane({ O: [0, 0], Q: [5, 0], C: [1, 0], A: [-0.6, 0.8], B: [2.6, 3.2] }, 190, {
  s: 'A-B', c: [{ at: 'O', r: 1 }, { at: 'Q', r: 4 }], dot: 'O Q C', l: { O: 'w', Q: 'e', C: 'e' },
})
const fig12 = solid({ A: [-3, 0, 0], C: [3, 0, 0], B: [0, -3 * s3, 0], V: [0, -s3, Math.sqrt(13)] }, 'A-B-C A-B-V B-C-V C-A-V', 110)

const fig15 = graph({ A: [-2, -3], B: [3, 2], L1: [-3, -4], L2: [4.5, 3.5] }, 110, [-3.5, 5], [-4.5, 4], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'w', B: 'e' } })
const B16 = pol(-104, 170), D16 = pol(-76, 170)
const fig16 = plane({ A: [0, 0], B: B16, D: D16, C: [B16[0] + D16[0], B16[1] + D16[1]], E: pol(-76, 150) }, 70, { s: 'A-B-C-D-A B-E', ra: ['BEA'], l: { E: 'e' } })
const D17: Pt = [6, 6 * s3], E17: Pt = [15, 3 * s3]
const fig17 = plane({ A: [0, 0], B: [12, 0], C: [18, 0], D: D17, E: E17, M: mid([0, 0], E17), N: mid([18, 0], D17) }, 150, {
  s: 'A-C A-D-B B-E-C A-E C-D M-B B-N M-N', l: { M: 'nw', N: 'n' },
})
// drawn taller than the real height 5, as in the book
const fig18 = solid(box(20, 15, 8), BOX, 150, { seg: "A'-B A'-D B-D" })

export const M67: EnModel = {
  id: 'en-67',
  title: 'Paralela 45, Testul 36',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 145–147',
  items: [
    { text: 'Cel mai mic număr natural par de patru cifre distincte este:', choices: ['$1000$', '$1023$', '$1024$', '$1234$'], ans: 2 },
    {
      text: 'În tabelul de mai jos sunt prezentate suprafața cultivată cu grâu în patru ferme, $A$, $B$, $C$, $D$, și producția totală de grâu obținută de fiecare fermă.\n\n| Ferma | $A$ | $B$ | $C$ | $D$ |\n|---|---|---|---|---|\n| Nr. hectare | $10$ | $12$ | $9$ | $5$ |\n| Producția totală | $35$ t | $58$ t | $36$ t | $26$ t |\n\nCea mai mare producție de grâu la hectar a obținut-o ferma:',
      choices: ['$A$', '$B$', '$C$', '$D$'], ans: 3,
    },
    { text: 'Fie numerele întregi $a=(-2)^4:(-2)^3$, $b=3^5:(-3)^4$, $c=(-5)^3:5^2$. Numărul $a+b+c$ este egal cu:', choices: ['$-10$', '$-4$', '$0$', '$6$'], ans: 1 },
    { text: 'Dacă numărul natural $n$ verifică relația $\\dfrac{1}{6}<\\dfrac{n}{12}<\\dfrac{1}{2}$, atunci $n$ aparține mulțimii:', choices: ['$\\{2,\\,6\\}$', '$\\{3,\\,4,\\,5\\}$', '$\\{2,\\,3,\\,4,\\,5\\}$', '$\\{2,\\,3,\\,4,\\,5,\\,6\\}$'], ans: 1 },
    {
      text: 'Efectuând calculul $\\sqrt{3}\\left(\\sqrt{27}-\\sqrt{12}\\right)$, patru colegi, Robert, Sabin, Cornel și Lucian, au obținut rezultatele din tabelul alăturat.\n\n| Robert | Sabin | Cornel | Lucian |\n|---|---|---|---|\n| $3$ | $\\sqrt{3}$ | $\\sqrt{15}$ | $1$ |\n\nDintre cei patru colegi, cel care a obținut rezultatul corect este:',
      choices: ['Robert', 'Sabin', 'Cornel', 'Lucian'], ans: 0,
    },
    { text: 'Ana are $63$ de lei. Bia are cu $2$ lei mai mult decât Călina, iar Călina are $\\dfrac{1}{3}$ din suma pe care o are Ana. Propoziția: „Bia are mai mult de $23$ de lei.” este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$ sunt coliniare, în această ordine, $AC=5$ m, $BD=9$ m, iar suma lungimilor segmentelor $AB$ și $CD$ este egală cu $8$ m. Lungimea segmentului $BC$ este egală cu:',
      choices: ['$2$ m', '$3$ m', '$4$ m', '$5$ m'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul isoscel $ABC$ cu baza $BC$ și $\\sphericalangle BAC=25^\\circ$. Măsura unghiului $ABC$ este egală cu:',
      choices: ["$75^\\circ$", "$77^\\circ$", "$77^\\circ30'$", "$72^\\circ30'$"], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ACD$ și punctele $B$, $E$ pe laturile $AC$, respectiv $AD$ astfel încât $BE\\parallel CD$. Dacă $BC=45$ m, $CD=90$ m și $BE=60$ m, atunci lungimea segmentului $AB$ este:',
      choices: ['$45$ m', '$60$ m', '$80$ m', '$90$ m'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată este desenat un romb $ABCD$ cu diagonala $BD=10$ mm și perimetrul de $52$ mm. Aria rombului este:',
      choices: ['$105\\text{ mm}^2$', '$120\\text{ mm}^2$', '$144\\text{ mm}^2$', '$160\\text{ mm}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată sunt desenate două cercuri tangente în punctul $C$. Cercul cu centrul în $O$ are raza de $1$ cm, iar cercul cu centrul în $Q$ are raza de $4$ cm. Dreapta $AB$ este tangentă în $A$ primului cerc și în $B$ celui de-al doilea cerc. Lungimea segmentului $AB$ este:',
      choices: ['$4$ cm', '$5$ cm', '$6$ cm', '$7$ cm'], ans: 0, fig: fig11,
    },
    {
      text: 'Piramida triunghiulară regulată $VABC$ cu vârful în $V$, din figura alăturată, are $VA=5$ cm și $AB=6$ cm. Aria laterală a piramidei este egală cu:',
      choices: ['$12\\text{ cm}^2$', '$72\\text{ cm}^2$', '$36\\text{ cm}^2$', '$16\\text{ cm}^2$'], ans: 2, fig: fig12,
    },

    {
      text: 'Într-un bloc sunt $18$ apartamente cu două camere sau cu trei camere, în total $42$ de camere.',
      parts: [
        { pts: 2, text: 'Dacă ar fi numai apartamente cu două camere, calculează câte camere ar fi în bloc.', ans: '$18\\cdot2=36$ de camere' },
        { pts: 3, text: 'Află câte apartamente cu două camere sunt, de fapt, în bloc.', ans: 'Cele $42-36=6$ camere în plus sunt câte una în fiecare apartament cu trei camere: $6$ cu trei camere, deci $12$ apartamente cu două camere' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{1+x^2}{1-x^2}-\\dfrac{1-x^2}{1+x^2}\\right):\\left(\\dfrac{1+x}{x-x^2}-\\dfrac{1-x}{x+x^2}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x^2}{1+x^2}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$E(x)=\\dfrac{4x^2}{(1-x^2)(1+x^2)}\\cdot\\dfrac{x(1-x^2)}{4x}=\\dfrac{x^2}{1+x^2}$' },
        { pts: 3, text: 'Demonstrează că $0<E(x)<1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: '$x^2>0$, deci $E(x)>0$; $E(x)<1\\Leftrightarrow x^2<1+x^2$, adevărat' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x-1$.',
      parts: [
        { pts: 2, text: 'Calculează $f\\left(1+\\sqrt{2}\\right)-f\\left(1-\\sqrt{2}\\right)$.', ans: '$\\sqrt{2}-(-\\sqrt{2})=2\\sqrt{2}$' },
        { pts: 3, text: 'Dacă punctele $A(-2,\\,a)$ și $B(3,\\,b)$ aparțin graficului funcției $f$, determină lungimea segmentului $AB$.', ans: '$a=-3$, $b=2$, deci $AB=\\sqrt{5^2+5^2}=5\\sqrt{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un romb $ABCD$ cu perimetrul de $680$ m. Distanța $BE$ dintre laturile $AB$ și $CD$ este de $80$ m.',
      parts: [
        { pts: 2, text: 'Află lungimea laturii $AB$.', ans: '$AB=680:4=170$ m' },
        { pts: 3, text: 'Calculează tangenta unghiului $BAD$, știind că $\\sphericalangle BAD<90^\\circ$.', ans: '$AE=\\sqrt{170^2-80^2}=150$ m, $\\operatorname{tg}(\\sphericalangle BAD)=\\dfrac{BE}{AE}=\\dfrac{8}{15}$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată triunghiurile $ABD$ și $BCE$ sunt echilaterale, $B\\in(AC)$, $AB=12$ cm și $BC=6$ cm. Punctele $M$ și $N$ sunt mijloacele segmentelor $AE$, respectiv $CD$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea segmentului $AE$.', ans: 'Fie $EF\\perp BC$, $F\\in BC$: $EF=3\\sqrt{3}$ cm, $AF=15$ cm, deci $AE=6\\sqrt{7}$ cm' },
        { pts: 3, text: 'Determină măsura unghiului $MBN$.', ans: '$\\triangle ABE\\equiv\\triangle DBC$ (LUL), deci $\\triangle MAB\\equiv\\triangle NDB$ și $\\sphericalangle ABM=\\sphericalangle DBN$; $\\sphericalangle MBN=\\sphericalangle MBD+\\sphericalangle ABM=\\sphericalangle ABD=60^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: "Paralelipipedul dreptunghic $ABCDA'B'C'D'$ din figura alăturată, are $AB=20$ cm, $AD=15$ cm și $AA'=5$ cm.",
      parts: [
        { pts: 2, text: "Calculează aria triunghiului $A'BD$.", ans: "Fie $AP\\perp BD$, $P\\in BD$: $AP=12$ cm; cu teorema celor trei perpendiculare $A'P\\perp BD$, $A'P=13$ cm, deci $\\mathcal{A}_{A'BD}=\\dfrac{13\\cdot25}{2}=162{,}5\\text{ cm}^2$" },
        { pts: 3, text: "Determină distanța de la punctul $A$ la planul $A'BD$.", ans: "Fie $AQ\\perp A'P$: $AQ\\perp(A'BD)$, deci $d=AQ=\\dfrac{AA'\\cdot AP}{A'P}=\\dfrac{60}{13}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
