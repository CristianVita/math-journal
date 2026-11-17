// Perianu și alții, Testul 15 (Matematică pentru Evaluarea Națională, Art Klett, pages 290–296; the answers are
// computed)
import type { EnModel } from '../types'
import { along, plane, solid, type Pt } from '../figure'
import { BOX, box, pol } from './shapes'
import { anglesFig } from './m43'

const fig7 = plane({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], O: [2, 2] }, 130, { s: 'A-B-C-D-A A-C B-D', l: { O: 'e' } })

// II.3: the right triangle with the hypotenuse BC, M its midpoint, AM = AB
const fig9 = plane({ B: [0, 0], C: [2, 0], A: [0.5, Math.sqrt(3) / 2], M: [1, 0] }, 170, { s: 'A-B-C-A A-M', ra: ['BAC'] })

// II.4: the isosceles trapezoid, BD ⊥ BC, BD = 4, BC = 3
const fig10 = plane({ D: [0, 0], C: [5, 0], B: [3.2, 2.4], A: [1.8, 2.4] }, 150, { s: 'A-B-C-D-A' })

// II.5: the tangents from A, r = 8, the angle BAC of 60°
const fig11 = plane({ O: [0, 0], A: [16, 0], C: pol(60, 8), B: pol(-60, 8) }, 180, { s: 'C-A-B', dot: 'O', c: [{ at: 'O', r: 8 }], l: { O: 'n' } })

// III.4: MP ∥ BC, PQ ∥ AB
const A16: Pt = [3, 8], B16: Pt = [0, 0], C16: Pt = [10, 0]
const P16 = along(A16, C16, 0.4)
const fig16 = plane({ A: A16, B: B16, C: C16, M: along(A16, B16, 0.4), P: P16, Q: [P16[0] + 0.6 * (B16[0] - A16[0]), 0] }, 150, { s: 'A-B-C-A M-P-Q' })

// III.5: the alley, the rectangle ABCD (AB = 12, AD = 16) and the semicircle on DC; E is not given in the text
const base17 = plane({ A: [0, 12], B: [0, 0], C: [16, 0], D: [16, 12], E: [4.1, 7.5], R: [22, 6] }, 200, { s: 'A-B-C-D-A A-E-D E-B', l: { R: '' } })
const r17 = (base17.p.D[1] - base17.p.C[1]) / 2
const fig17 = { ...base17, path: [{ d: `M${base17.p.D[0].toFixed(1)} ${base17.p.D[1].toFixed(1)} A${r17.toFixed(1)} ${r17.toFixed(1)} 0 0 1 ${base17.p.C[0].toFixed(1)} ${base17.p.C[1].toFixed(1)}` }] }

const fig18 = solid(box(4, 3, 5), BOX, 120)

export const M47: EnModel = {
  id: 'en-47',
  title: 'Perianu, Testul 15',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 290–296',
  items: [
    { text: 'Câte numere se găsesc în secvența $15,\\,20,\\,25,\\,\\ldots,\\,125$?', choices: ['$15$', '$20$', '$23$', '$22$'], ans: 2 },
    {
      text: 'Dacă aș mai avea $5$ lei, aș avea cu $10\\%$ mai mulți bani decât am. Ce sumă de bani am?',
      choices: ['$90$ lei', '$50$ lei', '$15$ lei', '$110$ lei'], ans: 1,
    },
    { text: 'Opusul numărului $-3$ este egal cu:', choices: ['$+3$', '$-3$', '$-\\dfrac13$', '$\\dfrac13$'], ans: 0 },
    {
      text: 'Modalitatea corectă de efectuare a calculului $\\dfrac{7}{3}-\\dfrac{5}{2}$ este:',
      choices: [
        '$\\dfrac73-\\dfrac52=\\dfrac{7-5}{3-2}$', '$\\dfrac73-\\dfrac52=\\dfrac{7-5}{6}$',
        '$\\dfrac73-\\dfrac52=\\dfrac{7\\cdot2-5\\cdot3}{3\\cdot2}$', '$\\dfrac73-\\dfrac52=\\dfrac{7\\cdot3-5\\cdot2}{3\\cdot2}$',
      ],
      ans: 2,
    },
    {
      text: 'Rezultatul calculului $\\left(2\\sqrt{3}+4\\right)\\left(4-2\\sqrt{3}\\right)$ este:',
      choices: [
        '$\\left(2\\sqrt3\\right)^2-4^2=6-16=-10$', '$\\left(2\\sqrt3\\right)^2-4^2=12-16=-4$',
        '$4^2-\\left(2\\sqrt3\\right)^2=16-6=10$', '$4^2-\\left(2\\sqrt3\\right)^2=16-12=4$',
      ],
      ans: 3,
    },
    { text: '„Numărul $\\sqrt{3}$ este un număr irațional din intervalul $(2,\\,3)$.” este un enunț:', choices: ['adevărat', 'fals'], ans: 1 },

    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$. Dacă $AC\\cap BD=\\{O\\}$, atunci afirmația falsă dintre propozițiile de mai jos este:',
      choices: ['$O$ este mijlocul segmentului $AC$.', 'Unghiurile $ABC$ și $BCD$ nu sunt congruente.', 'Unghiurile $ABD$ și $CBD$ sunt congruente.', '$AO=OD$.'],
      ans: 1, fig: fig7,
    },
    {
      text: 'O pereche de unghiuri alterne interne din figura alăturată este:',
      choices: ['$(1,\\,8)$', '$(4,\\,8)$', '$(1,\\,7)$', '$(3,\\,5)$'], ans: 3, fig: anglesFig(),
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi dreptunghic $ABC$, cu ipotenuza $BC$. Punctul $M$ este mijlocul segmentului $BC$. Dacă $AM=AB$, atunci măsura unghiului $MAC$ este egală cu:',
      choices: ['$60^\\circ$', '$45^\\circ$', '$30^\\circ$', '$15^\\circ$'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez isoscel $ABCD$, $AD=BC$. Dacă $BD=4$ cm, $BC=3$ cm și dreptele $BD$ și $BC$ sunt perpendiculare, atunci lungimea laturii $AB$ este egală cu:',
      choices: ['$\\dfrac75$ cm', '$5$ cm', '$\\dfrac{16}{5}$ cm', '$3$ cm'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AC$ și $AB$ sunt tangente la cercul de centru $O$ și rază $8$ cm. Dacă măsura unghiului $BAC$ este egală cu $60^\\circ$, atunci lungimea segmentului $OA$ este egală cu:',
      choices: ['$16$ cm', '$8$ cm', '$4$ cm', '$24$ cm'], ans: 0, fig: fig11,
    },
    { text: 'Volumul unui cub este egal cu $8$ litri. Latura cubului este egală cu:', choices: ['$4$ cm', '$8$ cm', '$10$ cm', '$20$ cm'], ans: 3 },

    {
      text: 'Numerele naturale $a$ și $b$ sunt direct proporționale cu numerele $11$ și $4$. Dacă împărțim numărul $a$ la numărul $b$, obținem câtul $2$ și restul $30$.',
      parts: [
        { pts: 2, text: 'Arată că $3a-6b=90$.', ans: '$a=2b+30$, deci $3a-6b=3(a-2b)=90$' },
        { pts: 3, text: 'Determină numerele naturale $a$ și $b$.', ans: '$a=11k$, $b=4k$, $3k=30$: $a=110$, $b=40$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{7}{x-5}+\\dfrac{5x}{25-x^2}-\\dfrac{2}{x+5}\\right):\\left(\\dfrac{x^2+25}{x^2-25}-1\\right)$, unde $x$ este număr real, $x\\neq-5$ și $x\\neq5$.',
      parts: [
        { pts: 2, text: 'Arată că $25-x^2=-(x-5)(x+5)$, pentru orice număr real $x$.', ans: '$25-x^2=(5-x)(5+x)=-(x-5)(x+5)$' },
        { pts: 3, text: 'Arată că $E(x)=0{,}9$, pentru orice număr real $x$, $x\\neq-5$ și $x\\neq5$.', ans: 'prima paranteză este $\\dfrac{45}{(x-5)(x+5)}$, a doua $\\dfrac{50}{(x-5)(x+5)}$, deci $E(x)=\\dfrac{45}{50}=0{,}9$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=4-x$.',
      parts: [
        { pts: 2, text: 'Calculează $f(18):f(-3)$.', ans: '$(-14):7=-2$' },
        { pts: 3, text: 'Determină aria triunghiului determinat de graficul funcției $f$ cu axele de coordonate $Ox$ și $Oy$.', ans: '$8$ (vârfurile $O$, $(4,\\,0)$ și $(0,\\,4)$)' },
      ],
    },
    {
      text: 'În triunghiul $ABC$ din figura alăturată, $MP\\parallel BC$, $PQ\\parallel AB$, $AM=4$ cm și $QC=7$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $\\triangle AMP\\sim\\triangle PQC$.', ans: '$\\sphericalangle AMP=\\sphericalangle ABC=\\sphericalangle PQC$ și $\\sphericalangle MAP=\\sphericalangle QPC$ (unghiuri corespondente)' },
        { pts: 3, text: 'Determină valoarea produsului $PQ\\cdot MP$.', ans: '$\\dfrac{AM}{PQ}=\\dfrac{MP}{QC}$, deci $PQ\\cdot MP=AM\\cdot QC=28\\text{ cm}^2$' },
      ],
      fig: fig16,
    },
    {
      text: 'Figura alăturată reprezintă schița unei alei, formată din dreptunghiul $ABCD$ și semicercul cu diametrul $DC$. Dacă $AB=12$ m, $AD=16$ m,',
      parts: [
        { pts: 2, text: 'arată că $BD=20$ m;', ans: '$BD=\\sqrt{12^2+16^2}=20$ m' },
        { pts: 3, text: 'determină aria aleii.', ans: '$192+18\\pi\\text{ m}^2$ (dreptunghiul și semicercul de rază $6$ m)' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat un paralelipiped dreptunghic $ABCDA'B'C'D'$. Știind că $AB=4$ cm, $BC=3$ cm și $AA'=5$ cm, atunci:",
      parts: [
        { pts: 2, text: "determină măsura unghiului $ACA'$;", ans: "$AC=5$ cm $=AA'$, deci $\\sphericalangle ACA'=45^\\circ$" },
        { pts: 3, text: "calculează distanța de la punctul $A$ la planul $(BDD')$.", ans: '$\\dfrac{AB\\cdot AD}{BD}=\\dfrac{12}{5}=2{,}4$ cm' },
      ],
      fig: fig18,
    },
  ],
}
