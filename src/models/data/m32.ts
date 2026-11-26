// Testul 9 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 90–91; every answer here is computed and checked with the book's answers, p. 272).
import type { EnModel } from '../types'
import { plane, solid, type Pt } from '../figure'
import { graph, pol } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [6, 0], B: [15, 0] }, 160, { s: 'A-B', dot: 'A M B', l: { A: 'n', M: 'n', B: 'n' } })
const fig8 = plane({ O: [0, 0], A: [5, 0], "A'": [-5, 0], C: pol(14, 5), B: pol(32, 5) }, 150, { s: "A'-A O-C O-B", l: { O: 's', A: 's', "A'": 'n' } })
const fig9 = plane({ B: [0, 0], C: [25, 0], A: [9, 12] }, 130, { s: 'A-B-C-A', ra: ['BAC'] })
const fig10 = plane({ A: [0, 0], B: [2 + s2, 0], C: [2 + s2, 2 - s2], D: [0, 2 - s2] }, 130, { s: 'A-B-C-D-A' })
const fig11 = plane({ 'O₁': [0, 0], 'O₂': [18, 0] }, 150, { dot: 'O₁ O₂', c: [{ at: [0, 0], r: 7 }, { at: [18, 0], r: 11 }], l: { 'O₁': 's', 'O₂': 's' } })

const fig15 = graph({ A: [0, 3], B: [4, 0], M: [-1, 0], L1: [-1.5, 4.125], L2: [5.5, -1.125] }, 130, [-2, 6], [-1.5, 5.5], { s: 'L1-L2', dot: 'A B M', l: { L1: '', L2: '', A: 'e', B: 'n', M: 'n', O: 'sw' } })
const A16 = pol(60, 1), C16: Pt = [2, 0]
const E16: Pt = [A16[0] + (C16[0] - A16[0]) / s3, A16[1] + (C16[1] - A16[1]) / s3]
const fig16 = plane({ A: A16, B: [0, 0], C: C16, D: [1, -1], E: E16 }, 130, { s: 'A-B-C-A B-D-C B-E-D', ra: ['BAC', 'BDC'], l: { E: 'ne' } })
const fig17 = plane({ O: [0, 0], A: [4, 0], M: [2, 0], B: [2, 2 * s3], C: [8, 0] }, 150, { s: 'O-C O-B B-M B-A B-C', c: [{ at: 'O', r: 4 }], dot: 'O M', ra: ['OMB'], l: { B: 'n', O: 'w', M: 's', A: 's', C: 's' } })
const fig18 = solid({ A: [0, 9, 0], B: [3 * s3, 0, 0], C: [6 * s3, 9, 0], V: [3 * s3, 6, 3 * s3], O: [3 * s3, 6, 0], M: [4.5 * s3, 4.5, 0], P: [3 * s3, 6, s3] },
  'A-B-C A-B-V B-C-V C-A-V', 140, { seg: 'V-O V-M O-M P-M', l: { O: 'n', M: 'se', P: 'w' } })

export const M32: EnModel = {
  id: 'en-32',
  title: 'Paralela 45, Testul 9',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 90–91',
  items: [
    { text: 'Cel mai mare număr natural de patru cifre distincte, cu cifra zecilor egală cu $9$, este:', choices: ['$9897$', '$8796$', '$7896$', '$8697$'], ans: 1 },
    {
      text: 'Un biciclist a parcurs un drum în trei zile conform datelor din tabelul următor:\n\n| Ziua | $1$ | $2$ | $3$ |\n|---|---|---|---|\n| Distanța parcursă (km) | $45$ | $72$ | $80$ |\n| Viteza medie de deplasare (km/h) | $30$ | $24$ | $32$ |\n\nTimpul necesar parcurgerii drumului a fost egal cu:',
      choices: ['$5$ ore', '$6$ ore', '$7$ ore', '$8$ ore'], ans: 2,
    },
    { text: 'Media aritmetică a trei numere este $7$. Unul dintre numere este egal cu $7$. Media aritmetică a celorlalte două numere este egală cu:', choices: ['$14$', '$7$', '$21$', '$28$'], ans: 1 },
    { text: 'Fie $A=(-3,\\,5)$ și $B=[-2,\\,7]$. Suma numerelor întregi din mulțimea $A\\cap B$ este egală cu:', choices: ['$7$', '$12$', '$9$', '$10$'], ans: 0 },
    { text: 'Dacă $a$, $b$ sunt numere reale astfel încât $\\dfrac{3}{4}=\\dfrac{a}{12}=\\dfrac{15}{b}$, atunci suma $a+b$ este egală cu:', choices: ['$9$', '$20$', '$25$', '$29$'], ans: 3 },
    { text: 'Propoziția „Cel mai mic număr natural mai mare decât $\\sqrt{3}+\\sqrt{5}$ este egal cu $4$.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $M$, $B$, în această ordine, astfel încât $AB=15$ cm, iar $\\dfrac{MA}{MB}=\\dfrac{2}{3}$. Lungimea segmentului $MA$ este egală cu:',
      choices: ['$3$ cm', '$4$ cm', '$5$ cm', '$6$ cm'], ans: 3, fig: fig7,
    },
    {
      text: "În figura alăturată, $\\sphericalangle AOB=32^\\circ$, $\\sphericalangle BOC=18^\\circ$, iar $OA'$ este semidreapta opusă semidreptei $OA$. Măsura unghiului $A'OC$ este egală cu:",
      choices: ['$162^\\circ$', '$176^\\circ$', '$76^\\circ$', '$166^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este dreptunghic în $A$, $BC=25$ cm și $\\sin\\sphericalangle C=0{,}6$. Lungimea catetei $AC$ este egală cu:',
      choices: ['$15$ cm', '$16$ cm', '$18$ cm', '$20$ cm'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un dreptunghi care are perimetrul egal cu $8$ cm și lungimea diagonalei egală cu $2\\sqrt{3}$ cm. Aria dreptunghiului este egală cu:',
      choices: ['$1\\text{ cm}^2$', '$2\\text{ cm}^2$', '$3\\text{ cm}^2$', '$4\\text{ cm}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată, cercurile $\\mathcal{C}_1(O_1,\\,r_1)$ și $\\mathcal{C}_2(O_2,\\,r_2)$ sunt tangente exterior și $O_1O_2=18$ cm. Dacă $r_1=3x-2$ și $r_2=2x+5$, valoarea numărului real $x$ este egală cu:',
      choices: ['$1$ cm', '$2$ cm', '$3$ cm', '$4$ cm'], ans: 2, fig: fig11,
    },
    {
      text: 'O piscină are formă de paralelipiped dreptunghic cu lățimea de $2{,}5$ m, lungimea de $4$ m și înălțimea de $1{,}5$ m. În piscină se pun $8000$ ℓ de apă. Înălțimea până la care se ridică apa din piscină este egală cu:',
      choices: ['$0{,}75$ m', '$0{,}80$ m', '$0{,}85$ m', '$1$ m'], ans: 1,
    },

    {
      text: 'Un bunic are doi nepoți. Vârsta bunicului se exprimă printr-un număr de două cifre, fiecare cifră exprimând vârsta unui nepot. Suma vârstelor celor trei este egală cu $93$ de ani.',
      parts: [
        { pts: 2, text: 'Stabilește dacă nepoții pot avea $6$ ani, respectiv $7$ ani.', ans: 'Nu: $67+6+7=80\\ne93$ și $76+7+6=89\\ne93$' },
        { pts: 3, text: 'Determină vârsta bunicului.', ans: '$\\overline{ab}+a+b=93$, deci $11a+2b=93$: $a=7$, $b=8$, bunicul are $78$ de ani' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{(x^2+x)^2-(x^2-x)^2}{x^3+x^2}\\cdot\\left(\\dfrac{x}{2}-\\dfrac{1}{2x}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=2x-2$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0\\}$.', ans: '$\\dfrac{4x^3}{x^2(x+1)}\\cdot\\dfrac{(x-1)(x+1)}{2x}=2(x-1)$' },
        { pts: 3, text: 'Arată că $n=E(2+\\sqrt{2})\\cdot E(\\sqrt{2})$ este număr natural, pătrat perfect.', ans: '$n=(2+2\\sqrt{2})(2\\sqrt{2}-2)=4(\\sqrt{2}+1)(\\sqrt{2}-1)=4=2^2$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3-\\dfrac{3}{4}x$ și punctul $M(-1,\\,0)$.',
      parts: [
        { pts: 2, text: 'Arată că punctul $M$ **nu** este situat pe reprezentarea grafică a funcției $f$.', ans: '$f(-1)=3+\\dfrac{3}{4}=\\dfrac{15}{4}\\ne0$' },
        { pts: 3, text: 'Calculează distanța de la punctul $M$ la reprezentarea grafică a funcției $f$ în sistemul de axe ortogonale $xOy$.', ans: 'Graficul taie axele în $A(0,\\,3)$ și $B(4,\\,0)$; $AB=5$, $MB=5$, $d=\\dfrac{MB\\cdot OA}{AB}=\\dfrac{5\\cdot3}{5}=3$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este dreptunghic în $A$ și $BC=2AB$, triunghiul $BDC$ este dreptunghic isoscel în $D$, iar punctul $E$ este situat pe latura $AC$, astfel încât $AE=AB$.',
      parts: [
        { pts: 2, text: 'Arată că $\\sphericalangle EBC=15^\\circ$.', ans: '$\\sphericalangle ABC=60^\\circ$ (cateta opusă unghiului de $30^\\circ$), $\\sphericalangle ABE=45^\\circ$, deci $\\sphericalangle EBC=15^\\circ$' },
        { pts: 3, text: 'Demonstrează că triunghiul $BDE$ este echilateral.', ans: '$BE=AB\\sqrt{2}$, $BD=\\dfrac{BC}{\\sqrt{2}}=AB\\sqrt{2}$ și $\\sphericalangle EBD=15^\\circ+45^\\circ=60^\\circ$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat cercul $\\mathcal{C}$ de centru $O$, unde punctul $A$ este situat pe cerc, punctul $M$ este mijlocul segmentului $OA$, iar punctul $B$ este situat la intersecția perpendicularei în $M$ pe $OA$ cu cercul $\\mathcal{C}$. Tangenta în $B$ la cerc intersectează dreapta $OA$ în punctul $C$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $OAB$ este echilateral.', ans: '$BM$ este mediatoarea lui $OA$, deci $BA=BO=OA$' },
        { pts: 3, text: 'Demonstrează că $C$ este simetricul punctului $O$ față de $A$.', ans: '$OB\\perp BC$ și $\\sphericalangle BOC=60^\\circ$, deci $OC=2\\cdot OB=2\\cdot OA$ și $A$ este mijlocul lui $OC$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată, $VABC$ este o piramidă triunghiulară regulată de înălțime $VO$, în care apotema piramidei este egală cu $6$ cm, iar unghiul dintre planele $(VBC)$ și $(ABC)$ are măsura de $60^\\circ$.',
      parts: [
        { pts: 2, text: 'Arată că volumul piramidei este egal cu $81\\text{ cm}^3$.', ans: 'Cu $M$ mijlocul lui $BC$: $OM=3$ cm, $VO=3\\sqrt{3}$ cm, $AB=6\\sqrt{3}$ cm, $\\mathcal{A}_b=27\\sqrt{3}$, $V=\\dfrac{27\\sqrt{3}\\cdot3\\sqrt{3}}{3}=81\\text{ cm}^3$' },
        { pts: 3, text: 'Fie $P$ un punct pe înălțimea $VO$, egal depărtat de planele $(ABC)$ și $(VBC)$. Calculează lungimea segmentului $PO$.', ans: '$P$ este pe bisectoarea unghiului $VMO$, deci $\\sphericalangle PMO=30^\\circ$ și $PO=OM\\cdot\\text{tg}\\,30^\\circ=\\sqrt{3}$ cm' },
      ],
      fig: fig18,
    },
  ],
}
