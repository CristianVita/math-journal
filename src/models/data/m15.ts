// Testul 6 (Modele de teste pentru Evaluarea Națională, Matematică. Clasa a VIII-a, pages 188–190; answers on 245)
import type { EnModel } from '../types'
import { mid, mid3, plane, solid, type Pt } from '../figure'
import { BOX, PYR4, box, pol, pyr4 } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

// II.1: A = 65°, B = 61°, C = 54°
const A7 = pol(61, 0.8926), C7: Pt = [1, 0]
const fig7 = plane({ A: A7, B: [0, 0], C: C7, D: [1.28, 0], E: [A7[0] + (A7[0] - C7[0]) * 0.3, A7[1] + (A7[1] - C7[1]) * 0.3] }, 160, { s: 'B-D A-B E-C', l: { C: 's', D: 's' } })

const D8 = pol(64)
const fig8 = plane({ A: [0, 0], B: [1 + 2 * D8[0], 0], C: [1 + D8[0], D8[1]], D: D8 }, 170, { s: 'A-B-C-D-A', t: [{ at: [D8[0] + 0.05, D8[1] - 0.17], s: '116°', anchor: 'start', size: 11 }] })

const A9: Pt = [6, 6 * s3], C9: Pt = [18, 0]
const fig9 = plane({ A: A9, B: [0, 0], C: C9, D: [6, 0], E: mid(A9, C9) }, 160, { s: 'A-B-C-A A-D D-E', ra: ['ADC'] })

const fig10 = plane({ A: [0, 0], B: [12, 0], C: [12, 12], D: [0, 12], M: [6, 0], E: [4, 4], F: [4, 12] }, 140, { s: 'A-B-C-D-A A-C D-M E-F', ra: ['EFC'], l: { E: 'e' } })

const fig11 = plane({ A: [-4, 0], B: [4, 0], C: [2, 0], O: [0, 0], D: [2, 2 * s3] }, 150, { s: 'A-B A-D-B D-C', ra: ['DCB'], dot: 'O', c: [{ at: 'O', r: 4 }], l: { O: 's', C: 's' } })

const p12 = pyr4(12, 6 * s2)
const fig12 = solid({ ...p12, M: mid3(p12.B, p12.C) }, PYR4, 160, { seg: 'V-M', l: { O: '', M: 'e' } })

const M16: Pt = [10, 24], A16: Pt = [0, 0], B16: Pt = [28, 0]
const fig16 = plane({ M: M16, A: A16, B: B16, D: mid(M16, A16), C: mid(M16, B16) }, 170, { s: 'A-B-M-A D-C' })

// III.5: DE ∥ BC at the height where BE ⊥ CD (DE = 30/7)
const y17 = 120 / 7, x17 = (15 * y17) / 20
const fig17 = plane({ A: [15, 20], B: [0, 0], C: [30, 0], D: [x17, y17], E: [30 - x17, y17] }, 150, { s: 'A-B-C-A D-E B-E C-D', l: { D: 'w', E: 'e' } })

const b18 = box(6, 6, 6 * s3)
const fig18 = solid({ ...b18, O: mid3(b18.B, b18["C'"]) }, BOX, 130, { seg: "B'-C B-C' A-O O-D' A-D' A-C B-O", l: { O: 'e' } })

export const M15: EnModel = {
  id: 'en-15',
  title: 'Testul 6',
  source: 'Modele de teste pentru Evaluarea Națională (Matematică. Clasa a VIII-a), pag. 188–190',
  items: [
    { text: 'Suma numerelor naturale pare mai mici decât $100$ este egală cu:', choices: ['$2448$', '$2450$', '$3452$', '$2454$'], ans: 1 },
    { text: 'Media aritmetică a numerelor $a=(-2)^{12}:2^9$, $b=2^8:(-2)^6$ și $c=2+2\\cdot 2$ este egală cu:', choices: ['$6$', '$8$', '$10$', '$12$'], ans: 0 },
    { text: 'Într-o urnă sunt $6$ bile albe, $8$ bile negre și $10$ bile roșii. Probabilitatea ca, extrăgând la întâmplare o bilă din urnă, aceasta să fie albă, este egală cu:', choices: ['$20\\%$', '$25\\%$', '$30\\%$', '$40\\%$'], ans: 1 },
    { text: 'Rezultatul calculului $(\\sqrt{27}-\\sqrt{18})(\\sqrt{12}+\\sqrt{8})$ este egal cu:', choices: ['$3$', '$4$', '$6$', '$8$'], ans: 2 },
    { text: 'Se consideră mulțimea $A=\\{x\\in\\mathbb{Z}\\mid |2x+3|<7\\}$. Suma elementelor mulțimii $A$ este egală cu:', choices: ['$-12$', '$-10$', '$-9$', '$-6$'], ans: 2 },
    { text: 'Propoziția: „Pentru orice număr natural impar $n$, numărul $n^2+4n+3$ este un număr natural par.” este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ în care $\\sphericalangle ACD=126^\\circ$ și $\\sphericalangle BAE=115^\\circ$. Măsura unghiului $ABC$ este egală cu:',
      choices: ['$59^\\circ$', '$61^\\circ$', '$63^\\circ$', '$65^\\circ$'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul isoscel $ABCD$ cu $AB\\parallel CD$, $AB>CD$ și $AD\\equiv DC\\equiv BC$, iar $\\sphericalangle ADC=116^\\circ$. Măsura unghiului $ACB$ este egală cu:',
      choices: ['$78^\\circ$', '$81^\\circ$', '$84^\\circ$', '$86^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$ cu $AB=12$ cm, $BC=18$ cm și $\\sphericalangle ABC=60^\\circ$. Știind că $AD\\perp BC$, $D\\in BC$, iar punctul $E$ este mijlocul laturii $AC$, lungimea segmentului $DE$ este egală cu:',
      choices: ['$6$ cm', '$4\\sqrt{3}$ cm', '$3\\sqrt{6}$ cm', '$3\\sqrt{7}$ cm'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat pătratul $ABCD$ cu $AB=12$ cm, iar punctul $M$ este mijlocul laturii $AB$. Dacă $AC\\cap DM=\\{E\\}$ și $EF\\perp CD$, $F\\in CD$, $EF$ este egală cu:',
      choices: ['$6$ cm', '$8$ cm', '$9$ cm', '$10$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat cercul de centru $O$ și diametru $AB=8$ cm. Punctul $C$ este mijlocul razei $OB$, iar perpendiculara dusă în punctul $C$ pe diametrul $AB$ intersectează cercul în punctul $D$. Perimetrul triunghiului $ADB$ este egal cu:',
      choices: ['$4(3-\\sqrt{3})$ cm', '$4(2+\\sqrt{3})$ cm', '$4(3+\\sqrt{3})$ cm', '$4(4+\\sqrt{3})$ cm'], ans: 2, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentată piramida regulată $VABCD$ cu baza pătratul $ABCD$ și $AB=12$ cm. Dacă punctul $M$ este mijlocul laturii $BC$ și $VM=6\\sqrt{3}$ cm, atunci măsura unghiului $AVC$ este egală cu:',
      choices: ['$45^\\circ$', '$60^\\circ$', '$75^\\circ$', '$90^\\circ$'], ans: 3, fig: fig12,
    },

    {
      text: 'O sumă de bani a fost împărțită celor trei frați, David, Mara și Rareș, invers proporțional cu numerele $0{,}(3)$, $0{,}25$, respectiv $0{,}2$.',
      parts: [
        { pts: 2, text: 'Care dintre cei trei frați a primit cei mai mulți bani?', ans: '$D=3k$, $M=4k$, $R=5k$, deci Rareș' },
        { pts: 3, text: 'Dacă David a primit cu $120$ de lei mai puțin decât Rareș, care este suma primită de Mara?', ans: '$2k=120$, $k=60$, deci Mara a primit $240$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=x+\\left(\\dfrac{1}{x-4}+\\dfrac{8-x^2}{x-2}\\cdot\\dfrac{1}{x-4}\\right):\\dfrac{x+2}{2x-4}+\\dfrac{2}{x-4}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,2,\\,4\\}$.',
      parts: [
        { pts: 2, text: 'Arătați că $E(x)=x-2$, pentru orice număr $x\\in\\mathbb{R}\\setminus\\{-2,\\,2,\\,4\\}$.', ans: '$E(x)=x-\\dfrac{2x-6}{x-4}+\\dfrac{2}{x-4}=x+\\dfrac{-2x+8}{x-4}=x-2$' },
        { pts: 3, text: 'Determinați valorile întregi ale lui $n$, pentru care $E(n)+3\\sqrt{7}=\\dfrac{1}{E(n)-3\\sqrt{7}}$.', ans: '$E^2(n)-63=1$, $|n-2|=8$, deci $n\\in\\{-6,\\,10\\}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=mx+4$, unde $m$ este un număr real nenul.',
      parts: [
        { pts: 2, text: 'Reprezentați grafic funcția $f$ într-un sistem de coordonate $xOy$, știind că punctul $A(2,\\,0)$ aparține graficului funcției date.', ans: '$m=-2$, $f(x)=-2x+4$' },
        { pts: 3, text: 'În sistemul de coordonate $xOy$ se consideră punctele $P$ și $Q$, care reprezintă intersecțiile graficului funcției $f$ cu axele de coordonate $Ox$, respectiv $Oy$. Determinați valorile numărului real $m$, știind că $\\operatorname{tg}(\\sphericalangle OPQ)=9$.', ans: '$\\operatorname{tg}(\\sphericalangle OPQ)=|m|$, deci $m\\in\\{-9,\\,9\\}$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat trapezul $ABCD$ cu $AB\\parallel CD$, $AB>CD$ și $AD\\cap BC=\\{M\\}$, iar $AB=28$ cm, $BC=15$ cm, $CD=14$ cm și $AD=13$ cm.',
      parts: [
        { pts: 2, text: 'Calculați perimetrul triunghiului $MCD$.', ans: '$DC=\\dfrac{AB}{2}$, deci $DC$ este linie mijlocie în $\\triangle MAB$: $\\mathcal{P}_{MCD}=42$ cm' },
        { pts: 3, text: 'Arătați că $\\mathcal{A}_{ABCD}=\\dfrac{3}{4}\\cdot\\mathcal{A}_{MAB}$.', ans: '$\\triangle MDC\\sim\\triangle MAB$ cu raportul $\\dfrac{1}{2}$, deci $\\mathcal{A}_{MDC}=\\dfrac{1}{4}\\mathcal{A}_{MAB}$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul isoscel $ABC$ cu $AB=AC=25$ cm și baza $BC=30$ cm, în care $DE\\parallel BC$, $D\\in AB$ și $E\\in AC$, astfel încât $BE\\perp CD$.',
      parts: [
        { pts: 2, text: 'Calculați lungimea segmentului $DE$.', ans: '$BCED$ este trapez isoscel ortodiagonal, deci înălțimea lui este $\\dfrac{30+DE}{2}$; din asemănare, $DE=\\dfrac{30}{7}$ cm' },
        { pts: 3, text: 'Calculați sinusul unghiului $BAC$.', ans: '$\\dfrac{30\\cdot 20}{2}=\\dfrac{25\\cdot 25\\cdot\\sin\\sphericalangle BAC}{2}$, deci $\\sin\\sphericalangle BAC=\\dfrac{24}{25}$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o prismă patrulateră regulată $ABCDA'B'C'D'$, cu $AB=6$ cm, $AA'=6\\sqrt{3}$ cm, iar $B'C\\cap BC'=\\{O\\}$.",
      parts: [
        { pts: 2, text: "Calculați aria triunghiului $AOD'$.", ans: "$AO=D'O=6\\sqrt{2}$ cm, $AD'=12$ cm, aria este $36\\text{ cm}^2$" },
        { pts: 3, text: 'Calculați sinusul unghiului format de dreptele $AC$ și $BO$.', ans: "$BO\\parallel AD'$, deci unghiul este $\\sphericalangle D'AC$, cu $\\sin=\\dfrac{\\sqrt{14}}{4}$" },
      ],
      fig: fig18,
    },
  ],
}
