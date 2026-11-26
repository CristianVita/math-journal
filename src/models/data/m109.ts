// Testul 78 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 237–239; every answer here is computed and checked with the book's answers, pp. 296–297).
import type { Fig, P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, plane, solid } from '../figure'
import { graph, pol } from './shapes'

const s3 = Math.sqrt(3)

// the temperatures at 6, 12, 18 and 24 o'clock: −2, 5, 2, −4 (°C), thick bars from the time axis
const temps = [-2, 5, 2, -4]
const tPts: Record<string, Pt> = { X0: [-0.5, 0], X1: [10, 0], Y0: [0, -5.5], Y1: [0, 6.5] }
temps.forEach((v, i) => { tPts[`b${i}`] = [2 * i + 2, 0]; tPts[`c${i}`] = [2 * i + 2, v]; tPts[`k${i}`] = [0, v] })
const chart = plane(tPts, 160, {
  s: 'X0-X1 Y0-Y1', d: 'k0-c0 k1-c1 k2-c2 k3-c3',
  l: Object.fromEntries(Object.keys(tPts).map((k) => [k, ''])),
  t: [
    ...['6', '12', '18', '24'].map((h, i) => ({ at: [2 * i + 2.1, temps[i] < 0 ? 0.4 : -1] as Pt, s: h, anchor: 'start' as const, size: 9 })),
    ...temps.map((v) => ({ at: [-0.2, v - 0.3] as Pt, s: `${v < 0 ? '−' : ''}${Math.abs(v)}°C`, anchor: 'end' as const, size: 9 })),
    { at: [0.3, 6.2], s: 'Temperatura (°C)', anchor: 'start', size: 9 }, { at: [10, -1], s: 'Ora', anchor: 'end', size: 9 },
  ],
})
const fig3: Fig = {
  ...chart,
  path: temps.map((_, i) => {
    const [x, y0] = chart.p[`b${i}`], y1 = chart.p[`c${i}`][1]
    return { d: `M${x - 2} ${y0} H${x + 2} V${y1} H${x - 2} Z`, fill: '#333' }
  }),
}

const fig7 = plane({ M: [0, 0], N: [15, 0], A: [20, 0], P: [25, 0] }, 170, { s: 'M-P', dot: 'M N A P', l: { M: 'n', N: 'n', A: 'n', P: 'n' } })
const fig8 = plane({ A: [-4, 0], O: [0, 0], C: [4, 0], B: pol(20, 4), M: pol(10, 3.6) }, 160, { s: 'A-C O-B O-M', dot: 'O', l: { O: 's' } })
// as in the book: C at the top, A bottom left, B bottom right
const fig9 = plane({ A: [0, 0], B: [20, 0], C: [7.2, 9.6], D: [3.6, 4.8] }, 140, { s: 'A-C-B-A B-D', ra: ['ACB'] })
const fig10 = plane({ A: [0, 0], B: [10, 0], C: [10, 5], D: [0, 5] }, 120, { s: 'A-B-C-D-A' })
const fig11 = plane({ O: [0, 0], A: pol(90, 3), B: pol(-30, 3), C: pol(210, 3) }, 110, { s: 'A-B O-A O-B', c: [{ at: 'O', r: 3 }], dot: 'O', l: { O: 'w' } })

const fig15 = graph({ A: [-4, 0], B: [0, -4], L1: [-5.5, 1.5], L2: [0.8, -4.8] }, 130, [-6, 2], [-5.5, 2], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'nw', B: 'e' } })
const A16: Pt = [0, 24.49], B16: Pt = [-5, 0], C16: Pt = [5, 0]
const D16: Pt = [C16[0] + (A16[0] - C16[0]) * 4 / 25, C16[1] + (A16[1] - C16[1]) * 4 / 25]
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16 }, 80, { s: 'A-B-C-A B-D' })
const A17: Pt = [0, 0], B17: Pt = [0, 30], C17: Pt = [50, 0], D17: Pt = [50, 20], V17 = meet(A17, D17, B17, C17)
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, V: V17, O: [V17[0], 0] }, 150, { s: 'A-C B-A-D B-C D-C V-O', ra: ['VOC'], l: { V: 'n' } })
// the prism with C in front; the pyramid VBCC₁B₁ cut from it, V the middle of AA₁
const y18 = 3 * s3
const p18: Record<string, P3> = { A: [0, y18, 0], B: [6, y18, 0], C: [3, 0, 0], A1: [0, y18, 6], B1: [6, y18, 6], C1: [3, 0, 6], V: [0, y18, 3] }
const fig18 = solid(p18, 'A-B-C A1-B1-C1 A-B-B1-A1 B-C-C1-B1 C-A-A1-C1', 130, { seg: 'V-B V-C V-B1 V-C1', l: { V: 'w' } })

export const M109: EnModel = {
  id: 'en-109',
  title: 'Paralela 45, Testul 78',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 237–239',
  items: [
    { text: 'Cel mai mic număr natural nenul $n$ pentru care $3^n+3^{n+1}$ este pătrat perfect este:', choices: ['$4$', '$0$', '$2$', '$1$'], ans: 2 },
    {
      text: 'Tabelul alăturat cuprinde informații referitoare la numărul curselor efectuate și suma finală încasată de patru taximetriști, Alex, Dan, Mihai și Robert. Persoanele care au același câștig mediu la o cursă sunt:\n\n| | Număr curse | Suma finală |\n|---|---|---|\n| Dan | $6$ | $120$ de lei |\n| Robert | $4$ | $90$ de lei |\n| Mihai | $2$ | $50$ de lei |\n| Alex | $5$ | $100$ de lei |',
      choices: ['Dan și Robert', 'Mihai și Dan', 'Alex și Mihai', 'Alex și Dan'], ans: 3,
    },
    {
      text: 'La o stație meteo s-au realizat patru măsurători în decursul a $24$ h, obținându-se datele din diagrama alăturată. Diferența dintre cea mai mică și cea mai mare dintre valorile înregistrate este:',
      choices: ['$-3^\\circ$C', '$-9^\\circ$C', '$3^\\circ$C', '$7^\\circ$C'], ans: 1, fig: fig3,
    },
    {
      text: 'Dacă $x=1{,}0(6)$, atunci numărul dat se scrie sub formă de fracție ireductibilă, astfel:',
      choices: ['$\\dfrac{48}{45}$', '$1\\dfrac{6}{10}$', '$\\dfrac{16}{15}$', '$\\dfrac{32}{33}$'], ans: 2,
    },
    {
      text: 'Numerele raționale $a$ și $b$ verifică relația $a+b\\sqrt{2}=\\dfrac{1}{\\sqrt{2}+1}$. Calculând $a^2+b^2$, obținem rezultatul:',
      choices: ['$2$', '$0$', '$3$', '$1$'], ans: 0,
    },
    {
      text: 'Mașina noastră consumă $6$ litri de benzină la $100$ de kilometri. După ce a făcut plinul ($30\\ \\ell$), tata afirmă că este destul combustibil pentru a parcurge cei $450$ km până la mare. Afirmația tatei este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $M$, $N$ și $P$ sunt coliniare, în această ordine și $2MN=3NP$. Dacă punctul $A$ este mijlocul segmentului $NP$ și $AN=5$ cm, atunci lungimea segmentului $MP$ este egală cu:',
      choices: ['$10$ cm', '$15$ cm', '$25$ cm', '$20$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiurile adiacente suplementare $AOB$ și $BOC$, astfel încât $\\sphericalangle AOB=8\\sphericalangle BOC$. Dacă semidreapta $OM$ este bisectoarea unghiului $BOC$, atunci măsura unghiului $AOM$ este egală cu:',
      choices: ['$140^\\circ$', '$150^\\circ$', '$160^\\circ$', '$170^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$, având ipotenuza $BA$. Dacă $AB=20$ m, punctul $D$ este mijlocul laturii $AC$ și aria triunghiului $ABD$ este egală cu $60\\text{ m}^2$, atunci distanța de la punctul $C$ la dreapta $AB$ este egală cu:',
      choices: ['$12$ m', '$24$ m', '$6$ m', '$10$ m'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un teren dreptunghiular cu suprafața de $1$ ha. Dacă mărim lungimea cu $10\\%$ din ea și micșorăm lățimea cu $10\\%$ din ea, obținem un teren cu suprafața egală cu:',
      choices: ['$10000\\text{ m}^2$', '$10100\\text{ m}^2$', '$9900\\text{ m}^2$', '$11000\\text{ m}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ determină pe cercul de centru $O$ trei arce congruente. Măsura unghiului $ABO$ este egală cu:',
      choices: ['$90^\\circ$', '$60^\\circ$', '$120^\\circ$', '$30^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'Cu un vas cubic cu latura de $20$ cm vrem să cărăm apă pentru a umple un acvariu, având formă de paralelipiped dreptunghic cu dimensiunile $40$ cm, $30$ cm și $60$ cm. Numărul minim de drumuri pe care le vom face pentru a umple acvariul este:',
      choices: ['$9$', '$6$', '$4$', '$10$'], ans: 0,
    },

    {
      text: 'Un număr de $25$ de ciocolate și $39$ de napolitane trebuie distribuite unor copii în pachete cu același conținut. După ce s-au făcut pachetele s-a observat că au mai rămas trei napolitane și o ciocolată.',
      parts: [
        { pts: 2, text: 'Este posibil să se facă $4$ pachete? Justifică răspunsul.', ans: 'Da: $25=4\\cdot6+1$ și $39=4\\cdot9+3$' },
        { pts: 3, text: 'Determină numărul maxim de pachete care se pot face.', ans: '$n$ divide $24$ și $36$, iar cel mai mare este $n=(24,\\,36)=12$ pachete' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x^4-x^2}{4x^2-2x}\\right)^{-1}:\\left(\\dfrac{2}{x+1}-\\dfrac{1}{x^2+x}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,0,\\,\\dfrac{1}{2},\\,1\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $\\dfrac{1}{E(x)}+\\dfrac{1}{E(-x)}$ este număr întreg, pentru orice $x\\in\\mathbb{R}\\setminus\\left\\{-1,\\,-\\dfrac{1}{2},\\,0,\\,\\dfrac{1}{2},\\,1\\right\\}$.', ans: '$E(x)=\\dfrac{2(2x-1)}{x(x-1)(x+1)}\\cdot\\dfrac{x(x+1)}{2x-1}=\\dfrac{2}{x-1}$ și $E(-x)=\\dfrac{2}{-x-1}$, deci suma este $\\dfrac{x-1}{2}+\\dfrac{-x-1}{2}=-1\\in\\mathbb{Z}$' },
        { pts: 3, text: 'Află valorile întregi ale lui $n$ pentru care $E(n)$ este număr întreg.', ans: '$n-1\\mid2$, deci $n\\in\\{-1,\\,0,\\,2,\\,3\\}$; fără valorile excluse, $n=2$ sau $n=3$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-x-4$.',
      parts: [
        { pts: 2, text: 'Determină valorile numărului real $m$, pentru care punctul $M(m^2,\\,5m)$ aparține reprezentării grafice a funcției $f$.', ans: '$-m^2-4=5m$, adică $m^2+5m+4=0$, deci $m\\in\\{-1,\\,-4\\}$' },
        { pts: 3, text: 'Știind că $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, iar $P$ este mijlocul segmentului $AB$, află lungimea segmentului $OP$.', ans: '$A(-4,\\,0)$, $B(0,\\,-4)$, $P(-2,\\,-2)$, deci $OP=\\sqrt{2^2+2^2}=2\\sqrt{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi isoscel $ABC$, cu baza $BC$ și lungimile laturilor de $10$ cm, $10$ cm și $25$ cm. Punctul $D$ aparține laturii $AC$, astfel încât $DC=4$ cm.',
      parts: [
        { pts: 2, text: 'Calculează perimetrul triunghiului $ABC$.', ans: '$AB=AC=10$ cm nu convine ($AB+AC<BC$), deci $AB=AC=25$ cm, $BC=10$ cm și $\\mathcal{P}_{ABC}=60$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $BD$.', ans: '$\\dfrac{DC}{BC}=\\dfrac{BC}{AC}=\\dfrac{2}{5}$ și $\\sphericalangle C$ comun, deci $\\triangle DCB\\sim\\triangle BCA$ (LUL); $\\triangle BCD$ este isoscel, cu $BD=BC=10$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat schematic un pin $VO$ crescut între două clădiri $AB$ și $CD$ ($AB$, $CD$ și $VO$ sunt perpendiculare pe linia solului, $AC$). Punctul $V$ aparține atât dreptei $AD$, cât și dreptei $BC$. Înălțimile celor două clădiri sunt $AB=30$ m și $CD=20$ m.',
      parts: [
        { pts: 2, text: 'Arată că $\\dfrac{VO}{AB}+\\dfrac{VO}{CD}=1$.', ans: 'Din $\\triangle COV\\sim\\triangle CAB$, $\\dfrac{VO}{AB}=\\dfrac{CO}{CA}$; din $\\triangle AOV\\sim\\triangle ACD$, $\\dfrac{VO}{CD}=\\dfrac{AO}{AC}$; adunând, suma este $\\dfrac{CO+AO}{AC}=1$' },
        { pts: 3, text: 'Află înălțimea $VO$ a pinului.', ans: '$VO\\left(\\dfrac{1}{30}+\\dfrac{1}{20}\\right)=1$, deci $VO=12$ m' },
      ],
      fig: fig17,
    },
    {
      text: 'Dintr-o prismă triunghiulară regulată $ABCA_1B_1C_1$ din lemn, cu toate muchiile de lungime $6$ cm, se obține prin prelucrare piramida patrulateră $VBCC_1B_1$ din figura alăturată, unde $V$ este mijlocul muchiei $AA_1$.',
      parts: [
        { pts: 2, text: 'Determină volumul de lemn pierdut prin prelucrare.', ans: '$\\mathcal{V}_{prismă}=9\\sqrt{3}\\cdot6=54\\sqrt{3}\\text{ cm}^3$, $\\mathcal{V}_{piramidă}=\\dfrac{36\\cdot3\\sqrt{3}}{3}=36\\sqrt{3}\\text{ cm}^3$, deci s-au pierdut $18\\sqrt{3}\\text{ cm}^3$' },
        { pts: 3, text: 'Află măsura unghiului format de două fețe laterale opuse ale piramidei.', ans: 'Cu $M$ mijlocul lui $BC$ și $M_1$ mijlocul lui $B_1C_1$, $\\sphericalangle((VBC),(VB_1C_1))=\\sphericalangle MVM_1$; $VM=VM_1=MM_1=6$ cm, deci unghiul are $60^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
