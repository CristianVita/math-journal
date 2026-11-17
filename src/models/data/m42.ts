// Perianu și alții, Testul 10 (Matematică pentru Evaluarea Națională, Art Klett, pages 257–263; the answers are
// computed)
import type { EnModel } from '../types'
import { mid, plane, solid, mid3 } from '../figure'
import { PYR4, pyr4 } from './shapes'

// II.1: the rhombus, M, N, P, Q the midpoints of its sides
const A7: [number, number] = [-4, 0], B7: [number, number] = [0, -1.5], C7: [number, number] = [4, 0], D7: [number, number] = [0, 1.5]
const fig7 = plane(
  { A: A7, B: B7, C: C7, D: D7, O: [0, 0], M: mid(A7, B7), N: mid(B7, C7), P: mid(C7, D7), Q: mid(D7, A7) },
  190,
  { s: 'A-B-C-D-A A-C', dot: 'O M N P Q', l: { O: 's', M: 's', N: 's', P: 'n', Q: 'n' } },
)

// II.2: AB ∥ DE, AB = DE, A, C, E on a line, BC = CD (drawn with AB ⊥ AE, as in the book)
const c8 = 4 * Math.tan((25 * Math.PI) / 180)
const fig8 = plane({ A: [0, 0], B: [0, 4], C: [c8, 0], D: [2 * c8, 4], E: [2 * c8, 0] }, 110, { s: 'A-B-C-D-E', dot: 'A E', l: { C: 's' } })

// II.3: the right isosceles triangle, M the midpoint of BC
const fig9 = plane({ A: [0, 0], B: [0, 4], C: [4, 0], M: [2, 2] }, 120, { s: 'A-B-C-A', dot: 'M', ra: ['BAC'], l: { M: 'ne' } })

// II.4: the plan of the flat; the room is hatched
const fig10 = plane(
  { A: [0, 0], E: [1, 0], B: [8, 0], C: [8, 5], M: [6, 5], S: [2, 5], D: [0, 5], G: [0, 3], F: [1, 3], R: [2, 3], N: [6, 3], P: [8, 3] },
  220,
  { s: 'A-B-C-D-A G-R-S E-F M-N-P', hatch: ['E-B-P-N-M-S-R-F'], l: { F: 'n', R: 'e', N: 'w', S: 'n', M: 'n', E: 's' } },
)

// II.5: the chord CD perpendicular to the diameter AB
const fig11 = plane({ A: [-1, 0], B: [1, 0], O: [0, 0], C: [-0.5, Math.sqrt(3) / 2], D: [-0.5, -Math.sqrt(3) / 2] }, 140, {
  s: 'A-B C-D', dot: 'O', c: [{ at: 'O', r: 1 }], l: { O: 's' },
})

// III.4: the square MNPQ inscribed in the equilateral triangle of side 8
const l16 = 8 * (2 * Math.sqrt(3) - 3)
const fig16 = plane(
  { A: [4, 4 * Math.sqrt(3)], B: [0, 0], C: [8, 0], M: [4 - l16 / 2, 0], N: [4 + l16 / 2, 0], P: [4 + l16 / 2, l16], Q: [4 - l16 / 2, l16] },
  150,
  { s: 'A-B-C-A M-Q-P-N' },
)

// III.5: three squares of side 2 in a row, three equilateral triangles inside them
const h = Math.sqrt(3)
const fig17 = plane(
  { A: [0, 0], B: [2, 0], F: [4, 0], G: [6, 0], D: [0, 2], C: [2, 2], E: [4, 2], H: [6, 2], M: [1, h], N: [3, 2 - h], P: [5, h] },
  260,
  { s: 'A-G-H-D-A B-C F-E A-M-B C-N-E F-P-G', l: { M: 'n', N: 's', P: 'n', A: 'sw', B: 's', F: 's', G: 'se', D: 'nw', C: 'n', E: 'n', H: 'ne' } },
)

// III.6: the roof, VABCD with the base side 6 m and the height 4 m, M and N the midpoints of VB and VC
const p18 = pyr4(6, 4)
const fig18 = solid({ ...p18, M: mid3(p18.V, p18.B), N: mid3(p18.V, p18.C) }, PYR4, 170, { seg: 'A-C B-D', dot: 'M N O', l: { O: 's', M: 'w', N: 'e' } })

export const M42: EnModel = {
  id: 'en-42',
  title: 'Perianu, Testul 10',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 257–263',
  items: [
    { text: 'În descompunerea în puteri de factori primi a lui $1000$, numărul $5$ apare de:', choices: ['$2$ ori', '$3$ ori', '$4$ ori', '$10$ ori'], ans: 1 },
    {
      text: 'Alin rezolvă într-o zi $7$ probleme. În fiecare din următoarele zile, el rezolvă cu o problemă mai mult decât în ziua de dinainte. Media aritmetică a problemelor rezolvate în trei zile este:',
      choices: ['$8$ probleme', '$7$ probleme', '$9$ probleme', '$21$ de probleme'], ans: 0,
    },
    {
      text: 'Pe axa numerelor întregi, se consideră punctele $A(-5)$ și $B(11)$. Distanța dintre ele este de:',
      choices: ['$11$ unități', '$5$ unități', '$6$ unități', '$16$ unități'], ans: 3,
    },
    { text: 'Numărul $7\\sqrt{5}$ se află între:', choices: ['$7$ și $8$', '$14$ și $15$', '$15$ și $16$', '$5$ și $6$'], ans: 2 },
    {
      text: 'Doi copii încep un joc în două reprize a câte $20$ de minute și cu o pauză între ele de $15$ minute. Dacă jocul începe la $11{:}00$, el se va termina la:',
      choices: ['$11{:}40$', '$11{:}35$', '$11{:}55$', '$12{:}00$'], ans: 2,
    },
    {
      text: 'Dacă $2$ kg de cartofi costă $3$ lei, atunci $10$ kg de cartofi din aceeași categorie costă $12$ lei. Această afirmație este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În rombul $ABCD$ se notează cu $M$, $N$, $P$ și $Q$ mijloacele segmentelor $AB$, $BC$, $CD$, respectiv $DA$. Simetricul lui $M$ față de $O$ este punctul:',
      choices: ['$N$', '$P$', '$Q$', '$D$'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, segmentele $AB$ și $DE$ sunt paralele și congruente. Se știe că $A$, $C$ și $E$ sunt coliniare și că $BC=CD$. Dacă unghiul $ABC$ are $25^\\circ$, atunci unghiul $DCB$ are:',
      choices: ['$25^\\circ$', '$50^\\circ$', '$65^\\circ$', '$75^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată sunt reprezentate trei puncte $A$, $B$ și $C$, care formează triunghiul dreptunghic isoscel $ABC$. Andrei pleacă din punctul $C$, iar Radu pleacă din punctul $B$ și se deplasează, în linie dreaptă, până în $M$, fiecare dintre ei parcurgând $2\\sqrt{2}$ dam. Apoi, pornesc amândoi, perpendicular pe $AC$, parcurgând distanța $MN$ care are lungimea de:',
      choices: ['$2\\sqrt{2}$ dam', '$\\sqrt{2}$ dam', '$4$ dam', '$2$ dam'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat planul unei garsoniere, astfel: baia este pătratul $MNPC$, cu latura de $2$ m, bucătăria este pătratul $DGRS$, cu latura de $2$ m, iar balconul este dreptunghiul $AEFG$, cu dimensiunile de $1$ m și, respectiv, $3$ m. Dacă segmentul $SM$ are $4$ m, atunci, aria camerei (aria hașurată) este egală cu:',
      choices: ['$20\\text{ m}^2$', '$29\\text{ m}^2$', '$32\\text{ m}^2$', '$40\\text{ m}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'Pe diametrul $AB$ al cercului de centru $O$ și de rază $OA$ se construiește coarda perpendiculară $CD$. Măsura unghiului $ACB$ este de:',
      choices: ['$45^\\circ$', '$60^\\circ$', '$90^\\circ$', '$100^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'Într-un bazin de forma unui cub cu muchia de $5$ m se așază două piese din metal, fiecare fiind de forma unui cub cu muchia de $0{,}5$ m (se consideră că piesele sunt pline). Apoi, bazinul se umple cu apă, astfel încât în el vor intra:',
      choices: ['$124\\,000\\ \\ell$', '$124\\,750\\ \\ell$', '$124\\,875\\ \\ell$', '$125\\,000\\ \\ell$'], ans: 1,
    },

    {
      text: 'Într-o curte sunt găini și iepuri, în total $76$ de picioare și $23$ de capete.',
      parts: [
        { pts: 2, text: 'Pot să fie $19$ iepuri în curte? Justifică răspunsul dat.', ans: 'Nu: $19$ iepuri au singuri $76$ de picioare, iar cele $4$ găini ar mai avea $8$' },
        { pts: 3, text: 'Câți iepuri și câte găini sunt în curte?', ans: '$15$ iepuri și $8$ găini' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x}{x-3}-\\dfrac{3}{x-1}-\\dfrac{7}{x^2-4x+3}\\right):\\dfrac{x^2-4x+2}{x-3}$, $x$ fiind orice număr real, cu excepția acelora pentru care se anulează numitorii.',
      parts: [
        { pts: 2, text: 'Arată că ecuația $x^2-4x+2=0$ are soluții reale.', ans: '$\\Delta=16-8=8>0$; soluțiile sunt $2\\pm\\sqrt2$' },
        { pts: 3, text: 'Determină valorile naturale ale lui $n$ pentru care $E(n)$ este număr întreg.', ans: '$E(x)=\\dfrac{1}{x-1}$, deci $n\\in\\{0,\\,2\\}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x-1$.',
      parts: [
        { pts: 2, text: 'Calculează $f\\left(\\dfrac{1}{2}\\right)+5$.', ans: '$0+5=5$' },
        { pts: 3, text: 'Determină lungimea segmentului de pe graficul funcției $f$ cuprins între axele de coordonate.', ans: 'între $\\left(\\dfrac12,\\,0\\right)$ și $(0,\\,-1)$: $\\dfrac{\\sqrt5}{2}$' },
      ],
    },
    {
      text: 'În triunghiul echilateral $ABC$, de latură $8$ cm, este înscris pătratul $MNPQ$, ca în figura alăturată.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $ABC$.', ans: '$16\\sqrt3\\text{ cm}^2$' },
        { pts: 3, text: 'Arată că lungimea laturii pătratului este de $8\\left(2\\sqrt{3}-3\\right)$ cm.', ans: '$\\triangle AQP\\sim\\triangle ABC$: $\\dfrac{l}{8}=\\dfrac{4\\sqrt3-l}{4\\sqrt3}$, deci $l=\\dfrac{8\\sqrt3}{2+\\sqrt3}=8(2\\sqrt3-3)$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'Se consideră pătratele congruente $ABCD$, $BCEF$ și $EFGH$, cu latura de $2$ cm, ca în figura de mai jos, și, în interiorul fiecărui pătrat, punctele $M$, $N$ și respectiv $P$, astfel încât triunghiurile $ABM$, $ECN$ și $FPG$ să fie echilaterale.',
      parts: [
        { pts: 2, text: 'Calculează aria triunghiului $FPG$.', ans: '$\\sqrt3\\text{ cm}^2$' },
        { pts: 3, text: 'Determină perimetrul triunghiului $MNP$.', ans: '$MP=4$ cm, $MN=NP=\\sqrt{20-8\\sqrt3}=2\\sqrt{5-2\\sqrt3}$ cm, perimetrul este $4+4\\sqrt{5-2\\sqrt3}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'Piramida patrulateră regulată $VABCD$, cu înălțimea de $4$ m și latura bazei de $6$ m, reprezintă un acoperiș (ca în figura alăturată). Se știe că $M$ și $N$ sunt mijloacele muchiilor $VB$, respectiv $VC$.',
      parts: [
        { pts: 2, text: 'Podul se pavează cu scânduri dreptunghiulare, cu lungimea de $2$ m și lățimea de $20$ cm. De câte scânduri este nevoie?', ans: '$90$ de scânduri ($36\\text{ m}^2:0{,}4\\text{ m}^2$)' },
        { pts: 3, text: 'Determină cosinusul unghiului dintre planele $(MON)$ și $(ABC)$.', ans: '$\\dfrac35$ ($MN\\parallel BC$; în planul prin $V$, $O$ perpendicular pe $BC$: $\\cos=\\dfrac{1{,}5}{2{,}5}$)' },
      ],
      fig: fig18,
    },
  ],
}
