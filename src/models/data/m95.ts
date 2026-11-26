// Testul 64 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 206–208; every answer here is computed and checked with the book's answers, p. 292).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, plane, solid } from '../figure'
import { graph, pol, PYR4, pyr4 } from './shapes'

const s6 = Math.sqrt(6)

const fig7 = plane({ P: [0, 0], A: [3, 0], Q: [6, 0], R: [10, 0], B: [15, 0], S: [20, 0] }, 180, {
  s: 'P-S', dot: 'P A Q R B S', l: { P: 'n', Q: 'n', R: 'n', S: 'n', A: 's', B: 's' },
})
const fig8 = plane({ O: [0, 0], A: pol(0, 6), B: pol(20, 6), C: pol(40, 6), D: pol(60, 6), E: pol(80, 6) }, 120, {
  s: 'O-A O-B O-C O-D O-E', l: { O: 'w' },
  t: [10, 30, 50, 70].map((a) => ({ at: pol(a, 2.2), s: '20°', anchor: 'middle' as const, size: 8 })),
})
const fig9 = plane({ O: [0, 0], A: pol(90, 4), B: pol(18, 4), C: pol(-54, 4), D: pol(-126, 4), E: pol(162, 4) }, 110, {
  c: [{ at: 'O', r: 4 }], dot: 'A B C D E', l: { O: '' }, t: [{ at: [1.2, 4.3], s: '→', anchor: 'start', size: 14 }],
})
const fig10 = plane({ B: [0, 0], C: [26, 0], A: [200 / 26, Math.sqrt(100 - (200 / 26) ** 2)] }, 140, {
  s: 'A-B-C-A',
  t: [{ at: [1.5, 5], s: '10', anchor: 'end', size: 10 }, { at: [18, 6], s: '24', anchor: 'start', size: 10 }, { at: [13, -2.5], s: '26', anchor: 'middle', size: 10 }],
})
const fig11 = plane({ A: [0, 4], B: [0, 0], C: [4, 0], D: [4, 4], M: [0, 2], N: [-2, 2], P: [-2, 0] }, 110, { s: 'A-B-C-D-A B-P-N-M' })
const fig12 = solid(pyr4(12, 6 * Math.SQRT2), PYR4, 110, { seg: 'A-C B-D', l: { O: '' } })

const fig15 = graph({ A: [1, 2], B: [4, 5], L1: [-1.5, -0.5], L2: [4.8, 5.8] }, 120, [-1.5, 5.5], [-1, 6.5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'nw', B: 'se' } })
const C16: Pt = [5, 0], D16: Pt = [0, -3]
const fig16 = plane({ A: [0, 3], B: [-4, 0], C: C16, D: D16, H: [1.8, 0], F: foot([0, 3], C16, D16) }, 120, {
  s: 'A-B-D-C-A B-C A-D A-F', ra: ['AFC'], l: { F: '' },
})
const fig17 = plane({ A: [0, 0], B: pol(240, 6), C: pol(330, 8), D: pol(330, 3), E: pol(240, 16) }, 120, { s: 'A-E-C-A B-C B-D', ra: ['BAC'] })
const fig18 = solid(pyr4(2, s6), PYR4, 120, { seg: 'A-C B-D V-O' })

export const M95: EnModel = {
  id: 'en-95',
  title: 'Paralela 45, Testul 64',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 206–208',
  items: [
    { text: 'Mulțimea divizorilor întregi ai numărului $6$ are cardinalul:', choices: ['$6$', '$4$', '$10$', '$8$'], ans: 3 },
    {
      text: 'În tabelul alăturat este reprezentată distribuția elevilor clasei a VIII-a C, în funcție de durata deplasării de acasă până la școală. Numărul de elevi din clasa a VIII-a C este:\n\n| Durata deplasării (minute) | $[1,\\,5]$ | $(5,\\,15]$ | $(15,\\,30]$ | $(30,\\,60]$ |\n|---|---|---|---|---|\n| Numărul de elevi | $10$ | $9$ | $7$ | $4$ |',
      choices: ['$28$', '$29$', '$30$', '$31$'], ans: 2,
    },
    { text: 'Produsul numerelor întregi $-3$ și $-8$ este egal cu:', choices: ['$24$', '$11$', '$-11$', '$-24$'], ans: 0 },
    {
      text: 'Dintre numerele $-\\dfrac{7}{5}$; $-\\sqrt{5}$; $\\sqrt{2}-\\sqrt{3}$ și $1-\\sqrt{5}$, numărul irațional care aparține intervalului $(-2,\\,-1)$ este:',
      choices: ['$-\\dfrac{7}{5}$', '$1-\\sqrt{5}$', '$-\\sqrt{5}$', '$\\sqrt{2}-\\sqrt{3}$'], ans: 1,
    },
    {
      text: 'Rezultatul calculului $\\left(\\sqrt{\\dfrac{9}{7}}-\\sqrt{7}-\\dfrac{2}{\\sqrt{7}}\\right):\\sqrt{\\dfrac{1}{7}}$ este:',
      choices: ['$6$', '$2\\sqrt{7}$', '$2-\\sqrt{7}$', '$-6$'], ans: 3,
    },
    {
      text: 'Mașina tatei merge cu viteza constantă de $75$ km/h. Până în orașul bunicii, sunt de parcurs $175$ km. Paula îi spune tatei că drumul de acasă până la bunica va dura $2$ ore și $20$ de minute. Afirmația Paulei este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $P$, $Q$, $R$ și $S$ sunt coliniare, în această ordine. Punctul $A$ este mijlocul segmentului $PQ$, punctul $B$ este mijlocul segmentului $RS$, $AB=12$ cm și $PS=20$ cm. Lungimea segmentului $QR$ este egală cu:',
      choices: ['$8$ cm', '$16$ cm', '$4$ cm', '$2$ cm'], ans: 2, fig: fig7,
    },
    { text: 'Numărul unghiurilor cu măsura de $40^\\circ$, care pot fi identificate în figura alăturată, este:', choices: ['$0$', '$1$', '$2$', '$3$'], ans: 3, fig: fig8 },
    {
      text: 'Alexandra se află în punctul $A$ al pistei circulare din figura alăturată și dorește să parcurgă un tur complet. Punctele $A$, $B$, $C$, $D$, $E$ împart cercul în cinci arce egale. După ce parcurge $60\\%$ din tur, Alexandra se află în punctul:',
      choices: ['$E$', '$D$', '$C$', '$B$'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată sunt date lungimile laturilor triunghiului $ABC$, în centimetri. Aria triunghiului este:',
      choices: ['$120\\text{ cm}^2$', '$34\\text{ cm}^2$', '$240\\text{ cm}^2$', '$260\\text{ cm}^2$'], ans: 0, fig: fig10,
    },
    {
      text: 'În figura alăturată, $ABCD$ și $BMNP$ sunt pătrate cu interioarele disjuncte, iar punctul $M$ este mijlocul laturii $AB$. Lungimea segmentului $ND$ este egală cu $2\\sqrt{10}$ cm. Perimetrul pătratului $ABCD$ este egal cu:',
      choices: ['$16$ cm', '$8$ cm', '$20$ cm', '$12$ cm'], ans: 0, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentată piramida patrulateră regulată $VABCD$, având vârful $V$, în care triunghiul $VAC$ este dreptunghic cu aria egală cu $72\\text{ cm}^2$. Volumul piramidei este:',
      choices: ['$288\\sqrt{3}\\text{ cm}^3$', '$144\\sqrt{3}\\text{ cm}^3$', '$288\\sqrt{2}\\text{ cm}^3$', '$144\\text{ cm}^3$'], ans: 2, fig: fig12,
    },

    {
      text: 'Într-un bloc de locuințe sunt $19$ apartamente cu două și trei camere, care au, în total, $46$ de camere.',
      parts: [
        { pts: 2, text: 'Numărul apartamentelor cu trei camere ar putea fi $15$? Justifică răspunsul.', ans: 'Nu: ar fi $15\\cdot3+4\\cdot2=53\\neq46$ camere' },
        { pts: 3, text: 'Află care este numărul apartamentelor cu două camere.', ans: '$3x+2(19-x)=46$, deci $x=8$ apartamente cu trei camere și $11$ apartamente cu două camere' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{1+x+x^2+x^3}{(2x+2)^2+(2x-2)^2}:\\left(\\dfrac{1}{x-1}-\\dfrac{1}{x}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $1+x+x^2+x^3=(1+x)(1+x^2)$, pentru orice număr real $x$.', ans: '$1+x+x^2+x^3=(1+x)+x^2(1+x)=(1+x)(1+x^2)$' },
        { pts: 3, text: 'Arată că, dacă $n$ este număr natural impar, mai mare decât $1$, atunci $E(n)$ este număr natural divizibil cu $3$.', ans: '$E(x)=\\dfrac{(1+x)(1+x^2)}{8(x^2+1)}\\cdot x(x-1)=\\dfrac{(x-1)x(x+1)}{8}$; pentru $n=2m+1$, $m\\in\\mathbb{N}^*$: $E(n)=\\dfrac{m(m+1)(2m+1)}{2}\\in\\mathbb{N}$, iar $3\\mid(n-1)n(n+1)$ (trei numere consecutive), deci $3\\mid E(n)$' },
      ],
    },
    {
      text: 'Se dă funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+1$; graficul său, într-un reper ortogonal $xOy$, este reprezentat în figura alăturată. Punctele $A$ și $B$ au abscisele $1$, respectiv $4$ și sunt situate pe reprezentarea grafică a funcției $f$.',
      parts: [
        { pts: 2, text: 'Determină coordonatele punctelor $A$ și $B$.', ans: '$A(1,\\,2)$, $B(4,\\,5)$' },
        { pts: 3, text: 'Notăm cu $M$ și $N$ proiecțiile pe axa $Ox$ ale punctelor $A$, respectiv $B$. Calculează aria patrulaterului $ABNM$.', ans: '$ABNM$ este trapez dreptunghic: $\\dfrac{(2+5)\\cdot3}{2}=10{,}5$ u$^2$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, iar punctul $D$ este simetricul punctului $A$ față de dreapta $BC$.',
      parts: [
        { pts: 2, text: 'Arată că $AB=BD$.', ans: 'Fie $\\{O\\}=AD\\cap BC$; în $\\triangle BAD$, $BO$ este înălțime și mediană, deci triunghiul este isoscel cu baza $AD$: $AB=BD$' },
        { pts: 3, text: 'Pe dreapta $BC$ se consideră punctul $H$ astfel încât $AH\\perp CD$. Demonstrează că dreptele $DH$ și $AC$ sunt perpendiculare.', ans: 'În $H$ se întâlnesc înălțimile din $A$ și $C$ ale triunghiului $ACD$ ($CO\\perp AD$), deci $H$ este ortocentrul lui și $DH\\perp AC$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic în $A$, cu $AB=6$ cm și $BC=10$ cm. Fie $BD$ bisectoarea unghiului $ABC$, unde $D\\in AC$, iar dreapta $CE$ este paralelă cu $BD$, cu $E\\in AB$.',
      parts: [
        { pts: 2, text: 'Arată că $\\sphericalangle BEC\\equiv\\sphericalangle BCE$.', ans: 'Din $BD\\parallel CE$: $\\sphericalangle ABD\\equiv\\sphericalangle BEC$ (corespondente) și $\\sphericalangle CBD\\equiv\\sphericalangle BCE$ (alterne interne), iar $\\sphericalangle ABD\\equiv\\sphericalangle CBD$' },
        { pts: 3, text: 'Determină perimetrul triunghiului $ABD$.', ans: '$BE=BC=10$ cm; $\\triangle ABD\\sim\\triangle AEC$: $\\dfrac{AB}{AE}=\\dfrac{AD}{AC}$, deci $AD=\\dfrac{6\\cdot8}{16}=3$ cm, $BD=\\sqrt{6^2+3^2}=3\\sqrt{5}$ cm și $\\mathcal{P}_{ABD}=3(3+\\sqrt{5})$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată, $VABCD$ este o piramidă patrulateră regulată cu muchia bazei $AB=2$ cm și înălțimea $VO=\\sqrt{6}$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrează că triunghiul $VAC$ este echilateral.', ans: '$AC=2\\sqrt{2}$ cm, $OA=\\sqrt{2}$ cm, $VA=VC=\\sqrt{2+6}=2\\sqrt{2}$ cm $=AC$' },
        { pts: 3, text: 'Arată că unghiul format de planele $(VAC)$ și $(VBC)$ are cosinusul egal cu $\\dfrac{\\sqrt{21}}{7}$.', ans: 'Fie $OM\\perp VC$, $M\\in VC$; $BO\\perp(VAC)$, deci $BM\\perp VC$ (T3⊥) și unghiul este $\\sphericalangle BMO$. $OM=\\dfrac{\\sqrt{6}}{2}$ cm, $BM=\\dfrac{\\sqrt{14}}{2}$ cm, deci $\\cos\\sphericalangle BMO=\\dfrac{OM}{BM}=\\dfrac{\\sqrt{21}}{7}$' },
      ],
      fig: fig18,
    },
  ],
}
