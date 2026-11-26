// Testul 24 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 120–122; every answer here is computed and checked with the book's answers, pp. 278–279).
import type { EnModel } from '../types'
import { along3, mid3, plane, solid } from '../figure'
import { graph, pol, PYR4, pyr4 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [21, 0], L: [-3, 0], R: [24, 0] }, 150, { s: 'L-R', dot: 'A B', l: { L: '', R: '', A: 'n', B: 'n' } })
// the zigzag between the parallels: 45° at A, x = 30° at B, 75° at P
const fig8 = plane({ A: [0, 0], B: [10, 0], P: [8.53, 5.12], U: [2, 8], L: [-0.5, -2], V: [12, 8], R: [9.5, -2] }, 130, {
  s: 'L-U R-V A-P-B', ang: ['PAU', 'APB', 'VBP'], l: { A: '', B: '', P: '', U: '', L: '', V: '', R: '' },
  t: [{ at: [1.5, 2.1], s: '45°', size: 11 }, { at: [8.35, 2.6], s: '75°', size: 11 }, { at: [9.95, 3.1], s: 'x°', size: 11, italic: true }, { at: [-1, -1.8], s: 'd₁', italic: true }, { at: [8.9, -1.8], s: 'd₂', italic: true }],
})
const fig9 = plane({ B: [0, 0], C: [2 * 0.6 * Math.cos(Math.PI / 12), 0], A: [0.6 * Math.cos(Math.PI / 12), 0.6 * Math.sin(Math.PI / 12)] }, 140, { s: 'A-B-C-A' })
const fig10 = plane({ A: [0, 0], B: [14, 0], C: [14, 14], D: [0, 14], O: [7, 7] }, 90, { s: 'A-B-C-D-A', c: [{ at: 'O', r: 7 }], dot: 'O', l: { O: '' } })
const fig11 = plane({ O: [0, 0], A: [-5, 0], B: [5, 0], C: pol(240, 5) }, 100, { s: 'A-B O-C B-C', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 'n' } })
const fig12 = { w: 90, h: 120, p: {}, e: [{ at: [45, 20] as [number, number], rx: 35, ry: 9 }, { at: [45, 100] as [number, number], rx: 35, ry: 9, back: true }], path: [{ d: 'M10 20 L10 100 M80 20 L80 100' }] }

const fig15 = graph({ A: [-2, 0], B: [0, 1], L1: [-4, -1], L2: [3, 2.5] }, 120, [-4.5, 3.5], [-1.5, 3], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'n', B: 'nw', O: 'se' } })
const fig16 = plane({ A: [0, 0], B: [24, 0], C: [18, 6 * s3], D: [6, 6 * s3], M: [12, 0] }, 140, { s: 'A-B-C-D-A C-M', l: { M: 's' } })
const fig17 = plane({ A: [6, 3 * s3], B: [3, 0], C: [9, 0], D: [-6, 0] }, 140, { s: 'A-B-C-A D-C A-D', ra: ['DAC'] })
const p18 = pyr4(18, 12)
const fig18 = solid({ ...p18, M: mid3(p18.B, p18.C), P: along3(p18.V, p18.O, 0.25) }, PYR4, 130, { seg: 'V-O O-M P-M', dot: 'P', l: { O: 's', P: 'w' } })

export const M55: EnModel = {
  id: 'en-55',
  title: 'Paralela 45, Testul 24',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 120–122',
  items: [
    { text: 'Dintre numerele $20$, $111$, $13$ și $91$, este prim numărul:', choices: ['$20$', '$13$', '$111$', '$91$'], ans: 1 },
    {
      text: 'În tabelul alăturat sunt informații cu privire la numărul elevilor de gimnaziu, pe clase, dintr-o școală. Clasele pentru care raportul dintre numărul fetelor și numărul băieților este subunitar sunt:\n\n| Clasa | a V-a | a VI-a | a VII-a | a VIII-a |\n|---|---|---|---|---|\n| Număr fete | $24$ | $28$ | $25$ | $23$ |\n| Număr băieți | $26$ | $22$ | $25$ | $28$ |',
      choices: ['a V-a și a VIII-a', 'a VI-a și a VII-a', 'a V-a și a VII-a', 'a VI-a și a VIII-a'], ans: 0,
    },
    { text: 'Într-o piscină exterioară, valoarea maximă pe care a atins-o apa pe timpul zilei a fost de $24^\\circ$C. Pe timpul nopții, temperatura apei a scăzut cu $2{,}5^\\circ$C. Cea mai mică valoare a temperaturii apei în acele $24$ de ore a fost:', choices: ['$28^\\circ$C', '$22{,}5^\\circ$C', '$23^\\circ$C', '$21{,}5^\\circ$C'], ans: 3 },
    { text: 'Se dau numerele $x=2{,}(375)$, $y=2{,}37(5)$, $z=2{,}3(75)$ și $t=2{,}(37)$. Ordinea descrescătoare a numerelor este:', choices: ['$z,\\ y,\\ x,\\ t$', '$t,\\ x,\\ y,\\ z$', '$x,\\ z,\\ y,\\ t$', '$z,\\ y,\\ t,\\ x$'], ans: 0 },
    {
      text: 'Patru elevi, Alin, Bianca, Codrin și Daniela, calculează suma $a^{-1}+b^{-1}+c^{-1}$, pentru $a=\\sqrt{2}$, $b=\\sqrt{8}$, $c=\\sqrt{18}$ și obțin rezultatele înregistrate în tabelul alăturat.\n\n| Alin | Bianca | Codrin | Daniela |\n|---|---|---|---|\n| $\\dfrac{\\sqrt{2}}{2}$ | $-\\sqrt{2}$ | $-6\\sqrt{2}$ | $\\dfrac{11}{6\\sqrt{2}}$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Alin', 'Bianca', 'Daniela', 'Codrin'], ans: 2,
    },
    { text: 'Gigel desfășoară activități școlare, folosind aplicația Zoom, fiecare activitate având durata de $40$ de minute. La $12{:}10$ a început ultima activitate a zilei. Gigel afirmă: „La ora $12{:}45$ am terminat ultima activitate școlară”. Afirmația lui Gigel este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, segmentul $AB$ are lungimea egală cu $21$ cm. Numărul punctelor $M$, situate pe dreapta $AB$, care verifică relația $\\dfrac{MA}{MB}=\\dfrac{3}{5}$ este egal cu:',
      choices: ['$1$', '$2$', '$3$', '$4$'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $d_1$ și $d_2$ sunt paralele, iar măsurile a trei dintre unghiurile care se formează sunt $45^\\circ$, $75^\\circ$ și $x^\\circ$. Valoarea lui $x$ este egală cu:',
      choices: ['$25$', '$45$', '$120$', '$30$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi isoscel $ABC$ cu $AB=AC=0{,}6$ km și $\\sphericalangle B=15^\\circ$. Distanța de la punctul $B$ la dreapta $AC$ este:',
      choices: ['$300$ m', '$150$ m', '$1200$ m', '$600$ m'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată sunt reprezentate un pătrat $ABCD$ și cercul său înscris cu aria de $49\\pi\\text{ m}^2$. Aria pătratului $ABCD$ este egală cu:',
      choices: ['$98\\text{ m}^2$', '$56\\text{ m}^2$', '$49\\text{ m}^2$', '$196\\text{ m}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'Pe cercul de centru $O$, având diametrul $AB$, se consideră punctul $C$, ca în figura alăturată. Dacă $\\sphericalangle BCO=30^\\circ$, atunci arcul mic $AC$ are măsura de:',
      choices: ['$60^\\circ$', '$120^\\circ$', '$15^\\circ$', '$45^\\circ$'], ans: 0, fig: fig11,
    },
    {
      text: 'Volumul unui cilindru circular drept, cu raza bazei $R=4$ dm și generatoarea $G=5$ dm, este egal cu:',
      choices: ['$20\\pi\\text{ dm}^3$', '$40\\pi\\text{ dm}^3$', '$80\\pi\\text{ dm}^3$', '$100\\pi\\text{ dm}^3$'], ans: 2, fig: fig12,
    },

    {
      text: 'În curtea bunicii sunt oi și rațe, care au în total $16$ capete și $50$ de picioare.',
      parts: [
        { pts: 2, text: 'Stabilește dacă este posibil să fie $13$ oi. Justifică răspunsul.', ans: 'Nu: $13$ oi ar avea împreună $52$ de picioare, mai mult decât $50$' },
        { pts: 3, text: 'Determină numărul rațelor din curte.', ans: '$o+r=16$ și $4o+2r=50$, deci $r=7$ rațe' },
      ],
    },
    {
      text: 'Fie $E(x)=\\left(\\dfrac{2x}{x^2-4}+\\dfrac{1}{x-2}-\\dfrac{1}{x+2}\\right):\\dfrac{x+3}{x^2-4}$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{2x+4}{x+3}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,-2,\\,2\\}$.', ans: 'Paranteza este $\\dfrac{2x+(x+2)-(x-2)}{x^2-4}=\\dfrac{2x+4}{x^2-4}$, iar împărțită la $\\dfrac{x+3}{x^2-4}$ dă $\\dfrac{2x+4}{x+3}$' },
        { pts: 3, text: 'Rezolvă, în mulțimea numerelor reale, ecuația $|E(x)|=1$.', ans: '$\\dfrac{2x+4}{x+3}=-1$ sau $\\dfrac{2x+4}{x+3}=1$, deci $x\\in\\left\\{-\\dfrac{7}{3},\\,-1\\right\\}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\dfrac{x}{2}+1$.',
      parts: [
        { pts: 2, text: 'Calculează $f(-1)\\cdot f(2)$.', ans: '$f(-1)=\\dfrac{1}{2}$, $f(2)=2$, deci produsul este $1$' },
        { pts: 3, text: 'Știind că $A$ și $B$ sunt punctele de intersecție dintre reprezentarea grafică a funcției $f$ și axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, determină aria triunghiului $OAB$.', ans: '$A(-2,\\,0)$, $B(0,\\,1)$, deci $\\mathcal{A}_{AOB}=\\dfrac{OA\\cdot OB}{2}=1$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul isoscel $ABCD$ cu $AB\\parallel CD$, $AD=BC=CD=12$ cm și măsura unghiului $ABC$ de $60^\\circ$. Punctul $M$ este mijlocul bazei $AB$.',
      parts: [
        { pts: 2, text: 'Arată că $AM=12$ cm.', ans: 'Cu $CC_1\\perp AB$, $DD_1\\perp AB$: $BC_1=AD_1=6$ cm, $D_1C_1=DC=12$ cm, deci $AB=24$ cm și $AM=12$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $AC$.', ans: '$AMCD$ e romb, deci $CM=DA=12$ cm $=\\dfrac{AB}{2}$; mediana $CM$ e jumătate din $AB$, deci $\\sphericalangle ACB=90^\\circ$ și $AC=12\\sqrt{3}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'Fie $ABC$ un triunghi echilateral cu latura de $6$ cm. Perpendiculara în $A$ pe $AC$ intersectează dreapta $BC$ în punctul $D$, ca în figura alăturată.',
      parts: [
        { pts: 2, text: 'Arată că $DC=12$ cm.', ans: '$\\sphericalangle ACB=60^\\circ$ și $\\sphericalangle DAC=90^\\circ$, deci $\\sphericalangle ADC=30^\\circ$ și $DC=2AC=12$ cm' },
        { pts: 3, text: 'Demonstrează că perimetrul triunghiului $ADC$ este mai mare de $28$ cm.', ans: '$AD=\\sqrt{144-36}=6\\sqrt{3}$ cm, iar $\\mathcal{P}_{ADC}=18+6\\sqrt{3}>28\\Leftrightarrow6\\sqrt{3}>10\\Leftrightarrow108>100$, adevărat' },
      ],
      fig: fig17,
    },
    {
      text: 'Acoperișul unui turn are forma piramidei patrulatere regulate $VABCD$, ca în figura alăturată. Punctul $O$ este centrul bazei, $M$ este mijlocul laturii $BC$, iar $P$ este un punct pe înălțimea $VO$ astfel încât $OP=3VP$. Se știe că $VO=12$ m și $VM=15$ m.',
      parts: [
        { pts: 2, text: 'Arată că $200$ kg de vopsea sunt suficiente pentru a vopsi pereții laterali ai acoperișului, știind că pentru a vopsi $13{,}5\\text{ m}^2$ de suprafață se folosesc $5$ kg de vopsea.', ans: '$OM=\\sqrt{225-144}=9$ m, $BC=18$ m, $\\mathcal{A}_l=\\dfrac{4\\cdot18\\cdot15}{2}=540\\text{ m}^2$; trebuie $\\dfrac{540}{13{,}5}\\cdot5=200$ kg, deci ajung' },
        { pts: 3, text: 'Determină măsura unghiului planelor $(PBC)$ și $(ADC)$.', ans: '$PM\\perp BC$, $OM\\perp BC$, deci unghiul este $\\sphericalangle PMO$; $OP=9$ m $=OM$, deci $\\sphericalangle PMO=45^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
