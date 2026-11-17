// Perianu și alții, Testul 14 (Matematică pentru Evaluarea Națională, Art Klett, pages 283–289; the answers are
// computed)
import type { EnModel } from '../types'
import { along, meet, mid3, plane, solid, type Pt } from '../figure'
import { PYR4, pol, pyr4 } from './shapes'

const fig7 = plane({ A: [0, 0], O: [2, 0], B: [4, 0], C: [8, 0] }, 200, { s: 'A-C', dot: 'A O B C', l: { A: 'n', O: 'n', B: 'n', C: 'n' } })

// II.2: a ∥ b, the angles 5x − 30° and 3x + 30° (alternate exterior)
const Xa: Pt = [6, 4], Xb: Pt = [4.3, 0], d8: Pt = [1.7, 4]
const fig8 = plane(
  { a1: [0, 4], a2: [10, 4], b1: [0, 0], b2: [10, 0], s1: [Xa[0] + 0.3 * d8[0], Xa[1] + 0.3 * d8[1]], s2: [Xb[0] - 0.25 * d8[0], Xb[1] - 0.25 * d8[1]] },
  190,
  {
    s: 'a1-a2 b1-b2 s1-s2',
    l: { a1: '', a2: '', b1: '', b2: '', s1: '', s2: '' },
    t: [
      { at: [4.2, 4.35], s: '5x − 30°', italic: true }, { at: [6.4, -0.75], s: '3x + 30°', italic: true },
      { at: [0.3, 4.3], s: 'a', italic: true, size: 14 }, { at: [0.3, 0.3], s: 'b', italic: true, size: 14 },
    ],
  },
)

// II.3: the equilateral triangle of side 12, FD ⊥ AC, AD = 5, DC = 7
const A9: Pt = [6, 6 * Math.sqrt(3)], B9: Pt = [0, 0], C9: Pt = [12, 0]
const D9 = along(A9, C9, 5 / 12), F9: Pt = [-2, 0]
const fig9 = plane(
  { A: A9, B: B9, C: C9, D: D9, F: F9, E: meet(F9, D9, A9, B9) },
  170,
  { s: 'A-B-C-A F-B F-E-D', ra: ['FDC'], l: { E: 'nw', F: 's', B: 's' }, t: [{ at: [8.1, 8.6], s: '5' }, { at: [11.1, 3.3], s: '7' }] },
)

const fig10 = plane({ D: [0, 0], C: [10, 0], B: [7, 3 * Math.sqrt(3)], A: [3, 3 * Math.sqrt(3)] }, 160, { s: 'A-B-C-D-A' })

// II.5: the tangents from A, OA = 5, r = 3
const t11 = (Math.acos(3 / 5) * 180) / Math.PI
const fig11 = plane({ O: [0, 0], A: [5, 0], C: pol(t11, 3), B: pol(-t11, 3) }, 160, { s: 'C-A-B', dot: 'O', c: [{ at: 'O', r: 3 }], l: { O: 'n' } })

// III.4: the equilateral triangle, G its centroid, PT ∥ BC through G
const h16 = 3 * Math.sqrt(3)
const fig16 = plane({ A: [3, h16], B: [0, 0], C: [6, 0], G: [3, h16 / 3], P: [1, h16 / 3], T: [5, h16 / 3] }, 130, { s: 'A-B-C-A P-T', dot: 'G', l: { G: 'n' } })

// III.5: the square ABCD and the rectangle MPQB, P on AC, PM = 2, PQ = 6
const fig17 = plane({ A: [0, 8], B: [8, 8], C: [8, 0], D: [0, 0], M: [2, 8], P: [2, 6], Q: [8, 6] }, 130, { s: 'A-B-C-D-A A-C M-P-Q', l: { P: 'sw', M: 'n' } })

const p18 = pyr4(10, 5 * Math.SQRT2)
const fig18 = solid({ ...p18, M: mid3(p18.B, p18.C) }, PYR4, 170, { seg: 'A-C B-D V-O V-M O-M', l: { O: 's', M: 'se' } })

export const M46: EnModel = {
  id: 'en-46',
  title: 'Perianu, Testul 14',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 283–289',
  items: [
    { text: 'Pătratul numărului natural $N=4\\cdot9$ este:', choices: ['$6$', '$6^4$', '$36$', '$6^2$'], ans: 1 },
    {
      text: 'Corina a economisit $15$ lei, adică $10\\%$ din prețul unui ghiozdan. Prețul ghiozdanului este de:',
      choices: ['$15$ lei', '$100$ lei', '$10$ lei', '$150$ lei'], ans: 3,
    },
    {
      text: 'Punând semnele $+$ sau $-$ în pătrățelele $\\square$, cea mai mică valoare a lui $E=-8\\,\\square\\,(-2)\\,\\square\\,5\\,\\square\\,(-3)$ este:',
      choices: ['$-18$', '$-20$', '$-14$', '$-4$'], ans: 0,
    },
    {
      text: 'Rezultatul calculului $\\dfrac{1}{2}+\\dfrac{1}{3}-\\dfrac{1}{6}$ este:',
      choices: ['$\\dfrac16$', '$-1$', '$\\dfrac23$', '$1$'], ans: 2,
    },
    {
      text: 'Care este modalitatea corectă de efectuare a calculului $\\sqrt{48}-\\sqrt{12}$?',
      choices: [
        '$\\sqrt{48}-\\sqrt{12}=\\sqrt{48-12}=\\sqrt{36}=6$', '$\\sqrt{48}-\\sqrt{12}=4\\sqrt3-2\\sqrt3=2$',
        '$\\sqrt{48}-\\sqrt{12}=\\sqrt{48:12}=\\sqrt4=2$', '$\\sqrt{48}-\\sqrt{12}=4\\sqrt3-2\\sqrt3=2\\sqrt3$',
      ],
      ans: 3,
    },
    {
      text: 'Se consideră intervalele $A=(1,\\,3)$ și $B=\\left(2,\\,\\dfrac{\\sqrt{37}}{2}\\right]$. Reuniunea intervalelor $A$ și $B$ este intervalul $(1,\\,3)$?',
      choices: ['Adevărat', 'Fals'], ans: 1,
    },

    {
      text: 'În figura alăturată, punctul $B$ este simetricul lui $A$ față de punctul $O$, iar $C$ este simetricul lui $A$ față de $B$. Valoarea raportului $\\dfrac{OB}{BC}$ este:',
      choices: ['$1$', '$2$', '$0{,}5$', '$0{,}(3)$'], ans: 2, fig: fig7,
    },
    {
      text: 'Dacă dreptele $a$ și $b$ sunt paralele, atunci valoarea lui $x$ este:',
      choices: ['$60^\\circ$', '$45^\\circ$', '$90^\\circ$', '$30^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este echilateral, $FD\\perp AC$, $D\\in(AC)$, $F\\in BC$ și $FD\\cap AB=\\{E\\}$. Dacă $AD=5$ cm și $DC=7$ cm, atunci lungimea segmentului $FB$ este egală cu:',
      choices: ['$2$ cm', '$3$ cm', '$5$ cm', '$7$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un trapez isoscel $ABCD$, $AD=BC$. Dacă $AB=4$ cm, $CD=10$ cm și $m(\\sphericalangle BCD)=60^\\circ$, atunci aria trapezului $ABCD$ este egală cu:',
      choices: ['$42\\sqrt{3}\\text{ cm}^2$', '$42\\text{ cm}^2$', '$84\\text{ cm}^2$', '$21\\sqrt{3}\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, $AC$ și $AB$ sunt tangente exterioare la cercul de centru $O$ și rază $r$. Dacă $AC+AB=8$ cm și $OA=5$ cm, atunci $r$ este egal cu:',
      choices: ['$3$ cm', '$5$ cm', '$4$ cm', '$6$ cm'], ans: 0, fig: fig11,
    },
    {
      text: "În paralelipipedul dreptunghic $ABCDA'B'C'D'$, $AB=BC=6$ cm și măsura unghiului $AB'C$ este de $60^\\circ$. Aria laterală a paralelipipedului este egală cu:",
      choices: ['$144\\text{ cm}^2$', '$36\\text{ cm}^2$', '$216\\text{ cm}^2$', '$72\\text{ cm}^2$'], ans: 0,
    },

    {
      text: 'Fiul și tatăl au vârsta de $14$ ani, respectiv $38$ de ani.',
      parts: [
        { pts: 2, text: 'Peste câți ani tatăl va fi de două ori mai în vârstă decât fiul?', ans: '$38+x=2(14+x)$, deci peste $10$ ani' },
        { pts: 3, text: 'Cu câți ani în urmă tatăl a fost de $4$ ori mai în vârstă decât fiul?', ans: '$38-y=4(14-y)$, deci acum $6$ ani' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{1+x-4x^2-4x^3}{1+4x+4x^2}\\cdot\\dfrac{1+2x}{1-x^2}$, unde $x$ este număr real, $x\\neq-1$, $x\\neq-\\dfrac{1}{2}$ și $x\\neq1$.',
      parts: [
        { pts: 2, text: 'Arată că $1+x-4x^2-4x^3=(1+x)(1+2x)(1-2x)$, pentru orice număr real $x$.', ans: '$(1+x)-4x^2(1+x)=(1+x)(1-4x^2)=(1+x)(1+2x)(1-2x)$' },
        { pts: 3, text: 'Arată că $E(x)=\\dfrac{2x-1}{x-1}$, pentru orice număr real $x$, $x\\neq-1$, $x\\neq-\\dfrac{1}{2}$ și $x\\neq1$.', ans: '$E(x)=\\dfrac{(1+x)(1+2x)(1-2x)}{(1+2x)^2}\\cdot\\dfrac{1+2x}{(1-x)(1+x)}=\\dfrac{1-2x}{1-x}=\\dfrac{2x-1}{x-1}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x-2$.',
      parts: [
        { pts: 2, text: 'Calculează $\\left[f\\left(\\sqrt{3}\\right)\\right]^2$.', ans: '$\\left(\\sqrt3-2\\right)^2=7-4\\sqrt3$' },
        { pts: 3, text: 'Determină tangenta unghiului format de reprezentarea grafică a funcției $f$ cu axa $Oy$.', ans: '$1$ (graficul taie axele în $(2,\\,0)$ și $(0,\\,-2)$, unghiul este de $45^\\circ$)' },
      ],
    },
    {
      text: 'În triunghiul echilateral $ABC$, din figura alăturată, punctul $G$ este centrul de greutate al triunghiului, $PT\\parallel BC$ și $G\\in PT$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiul $APG$ este dreptunghic.', ans: '$AG$ este înălțime, deci $AG\\perp BC$, iar $PT\\parallel BC$, deci $AG\\perp PG$' },
        { pts: 3, text: 'Determină valoarea raportului $\\dfrac{AP}{AB}$.', ans: '$\\dfrac{AP}{AB}=\\dfrac{AG}{AM}=\\dfrac23$ ($M$ mijlocul lui $BC$)' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABCD$ este pătrat, $MPQB$ este dreptunghi și punctul $P$ se află pe diagonala $AC$. Dacă $PM=2$ cm și $PQ=6$ cm, atunci:',
      parts: [
        { pts: 2, text: 'arată că $AB=8$ cm;', ans: '$\\triangle AMP$ este dreptunghic isoscel, $AM=PM=2$ cm, $MB=PQ=6$ cm, deci $AB=8$ cm' },
        { pts: 3, text: 'calculează distanța de la $P$ la dreapta $DQ$.', ans: '$DQ=10$ cm, $\\mathcal{A}_{DPQ}=\\dfrac{6\\cdot6}{2}=18\\text{ cm}^2$, distanța este $\\dfrac{2\\cdot18}{10}=3{,}6$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă patrulateră regulată $VABCD$, care are muchia $VA=10$ cm. Punctul $M$ este mijlocul muchiei $BC$ și $VM=5\\sqrt{3}$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $AB=10$ cm.', ans: '$BM=\\sqrt{100-75}=5$ cm, $AB=2BM=10$ cm' },
        { pts: 3, text: 'Se consideră punctul $T$ situat pe segmentul $DC$ astfel încât $VT+TM$ să aibă lungimea minimă. Calculează lungimea segmentului $TC$.', ans: '$TC=\\dfrac{5\\left(\\sqrt3-1\\right)}{2}$ cm (fața $VDC$ desfășurată în planul bazei)' },
      ],
      fig: fig18,
    },
  ],
}
