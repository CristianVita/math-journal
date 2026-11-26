// Testul 38 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 150–152; every answer here is computed and checked with the book's answers, p. 283).
import type { EnModel } from '../types'
import type { Pt } from '../figure'
import { meet, plane, solid } from '../figure'
import { graph, pol, prism3, tetra, TETRA } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [4, 0], B: [8, 0], N: [11, 0], C: [14, 0] }, 170, { s: 'A-C', dot: 'A M B N C', l: { A: 's', M: 's', B: 's', N: 's', C: 's' } })
const fig8 = plane({ O: [0, 0], B: [5, 0], C: [0.4, 2], Q: [4.6, -2], A: [0, -2] }, 120, {
  s: 'O-B O-C Q-A Q-B', ang: ['COB', 'AQB'], t: [{ at: [0.75, 0.7], s: 'x', italic: true }, { at: [4.05, -1.45], s: 'y', italic: true }], l: { Q: 'e' },
})
// ∡B = 75°, ∡C = 85°, so that ∡A = 20°
const A9 = pol(75, (10 * Math.sin((85 * Math.PI) / 180)) / Math.sin((20 * Math.PI) / 180))
const a9 = 10, b9 = Math.hypot(A9[0] - 10, A9[1]), c9 = Math.hypot(A9[0], A9[1])
const I9: Pt = [(a9 * A9[0] + b9 * 0 + c9 * 10) / (a9 + b9 + c9), (a9 * A9[1]) / (a9 + b9 + c9)]
const fig9 = plane({ A: A9, B: [0, 0], C: [10, 0], I: I9 }, 70, { s: 'A-B-C-A B-I-C', ang: ['BIC'], l: { I: 'n' } })
const fig10 = plane({ A: [-16, 0], O: [0, 0], B: [9, 0], V: [0, 12] }, 140, { s: 'A-B-V-A V-O', ra: ['VOB', 'AVB'] })
const A11 = pol(60)
const fig11 = plane({ O: [0, 0], C: [1, 0], D: [-1, 0], A: A11, B: [A11[0] - A11[1] / Math.tan((20 * Math.PI) / 180), 0] }, 150, {
  s: 'B-C B-A-C A-D', c: [{ at: 'O', r: 1 }], dot: 'O', ang: ['ABC', 'BAD'], l: { O: '', D: 'sw' },
})
const v12 = { ...prism3(2, 10), V: [1, (2 * s3) / 3, 13] as [number, number, number] }
const fig12 = solid(v12, "A-B-C A-B-B'-A' B-C-C'-B' C-A-A'-C' A'-B'-V B'-C'-V C'-A'-V", 60, {
  l: { A: '', B: '', C: '', "A'": '', "B'": '', "C'": '', V: '' },
})

const fig15 = graph({ A: [5, 0], B: [0, 5], L1: [-0.5, 5.5], L2: [5.5, -0.5] }, 110, [-1, 6.5], [-1, 6.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'n', B: 'e' } })
const A16: Pt = [0, 0], B16: Pt = [21, 0], C16: Pt = [15, 8], D16: Pt = [6, 8]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, O: meet(A16, C16, B16, D16) }, 140, { s: 'A-B-C-D-A A-C B-D', l: { O: 'n' } })
const fig17 = plane({ A: [0, 0], B: [60, 0], C: [60, 45], D: [0, 45], E: [40, 0], F: [40, 30], G: [0, 30] }, 140, {
  s: 'A-B-C-D-A G-F-E', hatch: ['G-F-E-B-C-D'], l: { F: 'nw' },
})
const fig18 = solid(tetra(100, ['B', 'C', 'D', 'A']), TETRA('B', 'C', 'D', 'A'), 120)

export const M69: EnModel = {
  id: 'en-69',
  title: 'Paralela 45, Testul 38',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 150–152',
  items: [
    { text: 'Suma dintre cel mai mare număr de două cifre divizibil cu $4$ și cel mai mic număr de trei cifre divizibil cu $3$ este:', choices: ['$198$', '$199$', '$200$', '$201$'], ans: 0 },
    { text: 'Dacă numerele $a$ și $6$ sunt invers proporționale cu $9$, respectiv $21$, atunci $a$ este egal cu:', choices: ['$\\dfrac{3}{2}$', '$\\dfrac{18}{7}$', '$14$', '$21$'], ans: 2 },
    { text: 'Cardinalul mulțimii $\\{x\\in\\mathbb{Z}\\mid |x|\\leq10\\}$ este:', choices: ['$21$', '$20$', '$11$', '$10$'], ans: 0 },
    { text: 'Fracția $\\dfrac{7}{2n+1}$, $n\\in\\mathbb{N}$, este supraunitară dacă și numai dacă:', choices: ['$n=0$', '$n=7$', '$n\\in\\{0,\\,1,\\,2\\}$', '$n\\in\\{0,\\,1,\\,2,\\,3\\}$'], ans: 2 },
    {
      text: 'Numărul irațional $-3\\sqrt{5}$ este reprezentat pe axa numerelor. Reprezentarea corectă este cea în care $-3\\sqrt{5}$ se află:',
      choices: ['la stânga lui $-8$', 'între $-7$ și $-6$', 'între $-6$ și $-5$', 'între $-5$ și $-4$'], ans: 1,
    },
    { text: 'Doisprezece prieteni s-au dus la un restaurant și au comandat cina. Când au primit comanda au constatat că porțiile erau așa de mari, încât ar fi ajuns pentru $18$ persoane. Atunci unul dintre ei a spus că, pentru a nu le rămâne mâncare în plus, ar fi fost suficient să comande pentru $8$ persoane. Afirmația lui este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ sunt coliniare, în această ordine, și $AC=14$ cm. Punctul $M$ este mijlocul segmentului $AB$, iar punctul $N$ este mijlocul segmentului $BC$. Lungimea segmentului $MN$ este egală cu:',
      choices: ['$7$ cm', '$5$ cm', '$8$ cm', '$6$ cm'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $QA$ și $OB$ sunt paralele, iar dreptele $QB$ și $OC$ sunt, de asemenea, paralele. Valoarea sumei $x+y$ este:',
      choices: ['$90^\\circ$', '$180^\\circ$', '$120^\\circ$', '$150^\\circ$'], ans: 1, fig: fig8,
    },
    {
      text: 'În figura alăturată, $BI$ și $CI$ sunt bisectoarele unghiurilor $ABC$, respectiv $ACB$ ale triunghiului $ABC$. Dacă măsura unghiului $BIC$ este $100^\\circ$, atunci măsura unghiului $A$ este:',
      choices: ['$20^\\circ$', '$50^\\circ$', '$80^\\circ$', '$90^\\circ$'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat schematic un catarg $OV$ $(OV\\perp AB)$, fixat de două funii $VA$ și $VB$, cu $AO=16$ m, $BO=9$ m, astfel încât $O\\in AB$ și $\\sphericalangle AVB=90^\\circ$. Înălțimea $VO$ a catargului este:',
      choices: ['$9$ m', '$12$ m', '$16$ m', '$25$ m'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ are măsura unghiului $B$ de $20^\\circ$. Cercul care trece prin vârfurile $A$ și $C$ și are centrul pe $BC$, intersectează latura $BC$ în punctul $D$, iar măsura unghiului $BAD$ este $10^\\circ$. Măsura arcului mic $AC$ este:',
      choices: ['$10^\\circ$', '$20^\\circ$', '$30^\\circ$', '$60^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'Un obelisc din piatră este format dintr-o prismă triunghiulară regulată, cu latura bazei de $2$ m și înălțimea de $10$ m, în vârful căreia se află o piramidă triunghiulară regulată, cu latura bazei tot de $2$ m și înălțimea de $3$ m. Volumul de piatră folosită la construcția obeliscului a fost:',
      choices: ['$10\\sqrt{3}\\text{ m}^3$', '$11\\sqrt{3}\\text{ m}^3$', '$12\\sqrt{3}\\text{ m}^3$', '$15\\sqrt{3}\\text{ m}^3$'], ans: 1, fig: fig12,
    },

    {
      text: 'Pentru a confecționa patru bluze și trei rochii este nevoie de $17$ m de material, iar pentru a confecționa trei bluze și două rochii, de același fel, se folosesc $12$ m de material.',
      parts: [
        { pts: 2, text: 'Află câți metri de material se folosesc pentru a confecționa zece bluze și șapte rochii.', ans: '$(4b+3r)+2(3b+2r)=17+2\\cdot12=41$ m' },
        { pts: 3, text: 'Determină câți metri de material se folosesc pentru confecționarea unei bluze.', ans: '$8b+6r=34$, $9b+6r=36$, deci $b=2$ m (și $3$ m pentru o rochie)' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{1}{x+2}-\\dfrac{1}{2x+1}\\right):\\dfrac{1}{2x^2+5x+2}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-2,\\,-\\dfrac{1}{2}\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=x-1$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-2,\\,-\\dfrac{1}{2}\\right\\}$.', ans: '$E(x)=\\dfrac{2x+1-x-2}{(x+2)(2x+1)}\\cdot(2x^2+5x+2)=x-1$' },
        { pts: 3, text: 'Demonstrează că $E(-x)\\cdot E(x)\\leq1$, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-2,\\,-\\dfrac{1}{2}\\right\\}$.', ans: '$E(-x)\\cdot E(x)=(-x-1)(x-1)=1-x^2\\leq1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=5-x$.',
      parts: [
        { pts: 2, text: 'Determină coordonatele $(a,\\,b)$ ale punctului $P$, de pe reprezentarea grafică a funcției $f$ în sistemul de axe ortogonale $xOy$, știind că acestea sunt invers proporționale cu numerele $3$ și $2$.', ans: '$b=5-a$ și $3a=2b$, deci $a=2$, $b=3$: $P(2,\\,3)$' },
        { pts: 3, text: 'Dacă $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, calculează lungimea medianei din $O$ a triunghiului $AOB$.', ans: '$A(5,\\,0)$, $B(0,\\,5)$, $AB=5\\sqrt{2}$, iar mediana din $O$ este $\\dfrac{AB}{2}=\\dfrac{5\\sqrt{2}}{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este desenat un trapez isoscel $ABCD$, cu baza mare $AB=21$ cm, baza mică $CD=9$ cm și $AD=BC=10$ cm. Fie $\\{O\\}=AC\\cap BD$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea diagonalei $AC$.', ans: 'Fie $CF\\perp AB$: $BF=6$ cm, $CF=8$ cm, $AF=15$ cm, deci $AC=\\sqrt{15^2+8^2}=17$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $AO$.', ans: '$\\triangle AOB\\sim\\triangle COD$, $\\dfrac{AO}{OC}=\\dfrac{AB}{CD}=\\dfrac{7}{3}$, deci $AO=\\dfrac{7}{10}\\cdot17=11{,}9$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un teren în formă de dreptunghi $ABCD$, pe care este construită o clădire, având amprenta la sol dreptunghiul $AEFG$. Se știe că $AB=60$ m, $BC=45$ m, $2BE=AE$ și $AD=3DG$.',
      parts: [
        { pts: 2, text: 'Determină numărul maxim de mașini care pot fi parcate pe teren, în zona hașurată, știind că pentru a parca o mașină este nevoie de o suprafață dreptunghiulară de $4\\text{ m}\\times5$ m.', ans: '$AE=40$ m, $AG=30$ m; aria hașurată $=2700-1200=1500\\text{ m}^2$ și $1500:20=75$; zona se poate împărți în $75$ de dreptunghiuri de $4\\text{ m}\\times5$ m, deci $75$ de mașini' },
        { pts: 3, text: 'Arată că punctele $A$, $F$ și $C$ sunt coliniare.', ans: '$\\operatorname{tg}(\\sphericalangle FAE)=\\dfrac{30}{40}=\\dfrac{45}{60}=\\operatorname{tg}(\\sphericalangle CAB)$, deci $\\sphericalangle FAE=\\sphericalangle CAB$ și $A$, $F$, $C$ sunt coliniare (sau $AF+FC=50+25=75=AC$)' },
      ],
      fig: fig17,
    },
    {
      text: 'Fie un tetraedru regulat $ABCD$ (vezi figura alăturată).',
      parts: [
        { pts: 2, text: 'Calculează cosinusul unghiului determinat de planele $ACD$ și $BCD$.', ans: 'Fie $M$ mijlocul lui $CD$: $AM\\perp CD$, $BM\\perp CD$, deci unghiul este $\\sphericalangle AMB$; cu $AO\\perp(BCD)$, $O\\in BM$, $\\cos(\\sphericalangle AMO)=\\dfrac{MO}{AM}=\\dfrac{MO}{BM}=\\dfrac{1}{3}$' },
        { pts: 3, text: 'Demonstrează că dreptele $AB$ și $CD$ sunt perpendiculare.', ans: '$CD\\perp AM$ și $CD\\perp BM$, deci $CD\\perp(ABM)$, de unde $CD\\perp AB$' },
      ],
      fig: fig18,
    },
  ],
}
