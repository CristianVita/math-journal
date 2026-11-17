// Testul 5 (Perianu și alții, Matematică pentru Evaluarea Națională, Art Klett, pages 225–231; the book's answers are
// not in the photos, so every answer here is computed)
import type { EnModel } from '../types'
import { meet, mid, plane, type Fig, type Pt } from '../figure'

// II.1: O the midpoint of AB and of CD, AO ≠ OC
const fig7 = plane({ A: [-5, -1.9], B: [5, 1.9], C: [-1.9, 1.6], D: [1.9, -1.6], O: [0, 0] }, 160, { s: 'A-B C-D', l: { O: 'n' } })

// II.2: A, N, P, B on a line, M above it; ∡ANM ≈ 124°, ∡NMP ≈ 96°, ∡MNP ≈ 56°, ∡MPN ≈ 28°
const fig8 = plane({ A: [-0.85, 0], N: [0, 0], P: [5.4, 0], B: [5.95, 0], M: [1.4, 2.1] }, 170, { s: 'A-B N-M-P', dot: 'A B', l: { A: 'n', B: 'n', M: 'n' } })

// II.3: the flap, an equilateral triangle with the apex A down, AD = 6
const s3 = Math.sqrt(3)
const fig9 = plane({ A: [0, 0], B: [-2 * s3, 6], C: [2 * s3, 6], D: [0, 6] }, 110, { s: 'A-B-C-A A-D', l: { D: 'n' } })

// II.4: the sheet 30 × 21, MNPQ coloured
const fig10 = plane(
  { A: [0, 0], B: [30, 0], C: [30, 21], D: [0, 21], M: [15, 0], N: [30, 10.5], P: [15, 21], Q: [0, 10.5] },
  170,
  { s: 'A-B-C-D-A M-N-P-Q-M', hatch: ['M-N-P-Q'], dot: 'M N P Q' },
)

// II.6: the cylinder (R = 15 cm, AA′ = 40 cm) with the cone cut out, OV = OO′/4, water up to 2/3 of the cone
const fig12: Fig = {
  w: 140, h: 190,
  p: { "A'": [10, 18], "B'": [130, 18], "O'": [70, 18], A: [10, 178], B: [130, 178], O: [70, 178], V: [70, 138] },
  l: { "A'": 'w', "B'": 'e', "O'": 'n', A: 'w', B: 'e', O: 's', V: 'e' },
  s: "A-A' B-B' A'-V-B' A'-B'",
  d: "O'-O",
  dot: "O' O V",
  e: [{ at: "O'", rx: 60, ry: 14 }, { at: 'O', rx: 60, ry: 14, back: true }, { at: [70, 58], rx: 40, ry: 9.3 }],
  path: [{ d: 'M30 58 A40 9.3 0 0 0 110 58 L70 138 Z', fill: '#bbb' }],
}

// III.4: the parallelogram, M the midpoint of AB, N of BC, Q of DC, P = DM ∩ AC
const A16: Pt = [0, 0], B16: Pt = [9, 0], C16: Pt = [10.5, 3.5], D16: Pt = [1.5, 3.5]
const M16 = mid(A16, B16)
const fig16 = plane(
  { A: A16, B: B16, C: C16, D: D16, M: M16, N: mid(B16, C16), Q: mid(D16, C16), P: meet(D16, M16, A16, C16) },
  180,
  { s: 'A-B-C-D-A A-C D-M', dot: 'N Q', l: { P: 'n', N: 'e', Q: 'n', M: 's' } },
)

export const M21: EnModel = {
  id: 'en-21',
  title: 'Perianu, Testul 5',
  source: 'Matematică pentru Evaluarea Națională (Perianu și alții, Art Klett), pag. 225–231',
  items: [
    { text: 'Suma numerelor prime formate dintr-o singură cifră este:', choices: ['$17$', '$18$', '$26$', '$27$'], ans: 0 },
    {
      text: 'Mihaela rezolvă într-o zi $32$ de probleme, iar în fiecare din următoarele zile, jumătate din cât a rezolvat cu o zi înainte. În a patra zi a rezolvat:',
      choices: ['$16$ probleme', '$8$ probleme', '$2$ probleme', '$4$ probleme'], ans: 3,
    },
    { text: 'Rezultatul calculului $-5+4-3+2-1$ este:', choices: ['$-15$', '$-7$', '$-3$', '$-1$'], ans: 2 },
    { text: 'Numărul $8\\sqrt{12}$ este sfertul lui:', choices: ['$32\\sqrt{48}$', '$2\\sqrt{12}$', '$64\\sqrt{3}$', '$2\\sqrt{3}$'], ans: 2 },
    { text: 'Din secvența de numere $5$, $1$, $-4$ și $-13$, cel mai mic este:', choices: ['$-4$', '$-13$', '$0$', '$1$'], ans: 1 },
    { text: 'Dintr-o clasă de $28$ de elevi, $25\\%$ sunt fete. Atunci, numărul băieților este:', choices: ['$3$', '$7$', '$21$', '$25$'], ans: 2 },

    {
      text: 'În figura alăturată, $AO\\neq OC$, $B$ este simetricul lui $A$ față de $O$, $D$ este simetricul lui $C$ față de $O$. Patrulaterul $ABCD$ este:',
      choices: ['romb', 'pătrat', 'trapez', 'paralelogram'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată, dintre următoarele seturi de măsuri de unghiuri, cel scris în ordine descrescătoare este:',
      choices: [
        '$\\sphericalangle ANM,\\ \\sphericalangle MNP,\\ \\sphericalangle NMP,\\ \\sphericalangle MPN$', '$\\sphericalangle ANM,\\ \\sphericalangle NMP,\\ \\sphericalangle MNP,\\ \\sphericalangle MPN$',
        '$\\sphericalangle NMP,\\ \\sphericalangle ANM,\\ \\sphericalangle MPN,\\ \\sphericalangle MNP$', '$\\sphericalangle ANM,\\ \\sphericalangle MPN,\\ \\sphericalangle MNP,\\ \\sphericalangle NMP$',
      ],
      ans: 1, fig: fig8,
    },
    {
      text: 'Capacul unui plic are forma din figura alăturată, cu $\\hat{B}=60^\\circ$. Înălțimea $AD$ determină pe $BC$ segmente congruente. Dacă $AD=6$ cm, atunci distanța de la $D$ la $AB$ este egală cu:',
      choices: ['$3$ cm', '$6$ cm', '$2$ cm', '$4$ cm'], ans: 0, fig: fig9,
    },
    {
      text: 'Pe o foaie de hârtie este colorată o suprafață ca în figura alăturată. Foaia de hârtie are forma unui dreptunghi cu dimensiunile de $30$ cm și $21$ cm. Punctele $M$, $N$, $P$, $Q$ sunt mijloacele laturilor dreptunghiului. Suprafața care nu este colorată reprezintă un procent de $x\\%$ din suprafața foii, unde:',
      choices: ['$x=50\\%$', '$x=60\\%$', '$x=40\\%$', '$x=55\\%$'], ans: 0, fig: fig10,
    },
    {
      text: 'Un biscuit are forma unui cerc (disc) cu raza de $\\sqrt{3}$ cm, iar altul are forma unui pătrat cu latura de $3$ cm. Afirmația: „Suprafața biscuitului în formă de pătrat este mai mare decât suprafața biscuitului în formă de cerc.” este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },
    {
      text: "În figura alăturată este prezentată o vază din lemn, care are forma unui cilindru circular drept din care s-a cioplit și s-a îndepărtat o porțiune sub forma unui con circular drept. În vază se toarnă apă până la $\\dfrac{2}{3}$ din înălțimea conului. Se cunosc: $AA'=4$ dm, $R=OB=15$ cm, iar $OV$ este un sfert din $OO'$. Cantitatea de apă (în litri) care mai trebuie adăugată pentru a umple conul este:",
      choices: ['$\\dfrac{4{,}75\\pi}{3}\\ \\ell$', '$4\\ \\ell$', '$\\dfrac{4\\pi}{3}\\ \\ell$', '$1{,}6\\pi\\ \\ell$'], ans: 0, fig: fig12,
    },

    {
      text: 'Într-un coș se află mere și nuci, iar raportul dintre numărul merelor și numărul nucilor este de $\\dfrac{8}{5}$. Numărul merelor este cu $60$ mai mare decât numărul nucilor.',
      parts: [
        { pts: 2, text: 'Arată că numărul nucilor este divizibil cu $5$.', ans: '$5m=8n$ și $(8,\\,5)=1$, deci $5\\mid n$' },
        { pts: 3, text: 'Determină numărul nucilor și numărul merelor din coș.', ans: '$3k=60$, $k=20$: $100$ de nuci și $160$ de mere' },
      ],
    },
    {
      text: 'Se consideră numărul $a=\\left(4-\\sqrt{7}\\right)\\left(4+\\sqrt{7}\\right)+\\left(2\\sqrt{3}-\\sqrt{2}\\right)^2+\\left(\\sqrt{6}+2\\right)^2$.',
      parts: [
        { pts: 2, text: 'Arată că $a\\in\\mathbb{N}$.', ans: '$a=9+\\left(14-4\\sqrt{6}\\right)+\\left(10+4\\sqrt{6}\\right)=33$' },
        { pts: 3, text: 'Se consideră expresia $E(x)=\\left(\\dfrac{1}{2x-3}+\\dfrac{2}{2x+3}\\right):\\dfrac{4x^2-4x+1}{4x^2-9}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{\\dfrac{3}{2},\\,-\\dfrac{3}{2},\\,\\dfrac{1}{2}\\right\\}$. Arată că $E(x)=\\dfrac{3}{2x-1}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{\\dfrac{3}{2},\\,-\\dfrac{3}{2},\\,\\dfrac{1}{2}\\right\\}$.', ans: 'paranteza este $\\dfrac{6x-3}{4x^2-9}$, iar $\\dfrac{3(2x-1)}{4x^2-9}\\cdot\\dfrac{4x^2-9}{(2x-1)^2}=\\dfrac{3}{2x-1}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\dfrac{\\sqrt{5}}{5}x-2$.',
      parts: [
        { pts: 2, text: 'Calculează $f(-1)+f(0)+f(1)$.', ans: '$-6$' },
        { pts: 3, text: 'Determină sinusul unghiului format de reprezentarea geometrică a graficului funcției $f$ cu axa absciselor.', ans: '$A(2\\sqrt{5},\\,0)$, $B(0,\\,-2)$, $AB=2\\sqrt{6}$, deci $\\sin=\\dfrac{2}{2\\sqrt{6}}=\\dfrac{\\sqrt{6}}{6}$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat paralelogramul $ABCD$, unde $M$ este mijlocul lui $(AB)$, $N$ este mijlocul lui $(BC)$, iar $DM\\cap AC=\\{P\\}$. Se știe că $AP=16$ cm.',
      parts: [
        { pts: 2, text: 'Dacă $Q$ este mijlocul lui $(DC)$, atunci stabilește natura patrulaterului $DMBQ$.', ans: 'paralelogram ($DQ\\parallel MB$ și $DQ=MB$)' },
        { pts: 3, text: 'Calculează lungimea segmentului $MN$.', ans: '$\\triangle APM\\sim\\triangle CPD$, $AP=\\dfrac{AC}{3}$, deci $AC=48$ cm și $MN=\\dfrac{AC}{2}=24$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În triunghiul $ABC$ se cunosc: $AB=12$ cm, $AC=12\\sqrt{3}$ cm și $\\hat{B}=60^\\circ$.',
      parts: [
        { pts: 2, text: 'Stabilește natura triunghiului $ABC$.', ans: 'dreptunghic în $A$ ($\\hat{C}=30^\\circ$, $\\hat{A}=90^\\circ$)' },
        { pts: 3, text: 'Demonstrează că triunghiul $ABC$ are perimetrul mai mare decât $56{,}75$ cm.', ans: '$BC=24$ cm, $\\mathcal{P}=36+12\\sqrt{3}>56{,}75\\Leftrightarrow 12\\sqrt{3}>20{,}75\\Leftrightarrow 432>430{,}5625$' },
      ],
    },
    {
      text: "O piesă de metal are forma unui trunchi de piramidă triunghiulară regulată $ABCA'B'C'$, în care $M$ este mijlocul lui $(AB)$, iar $O$ este centrul de greutate al triunghiului $ABC$. $OO'$ este înălțimea trunchiului. Se știe că $AB=12$ dm, $A'B'=6$ dm și $OO'=3$ dm.",
      parts: [
        { pts: 2, text: 'Volumul piesei este mai mare decât $109\\text{ dm}^3$? Justificați!', ans: 'Da: $V=\\dfrac{3}{3}\\left(36\\sqrt{3}+9\\sqrt{3}+18\\sqrt{3}\\right)=63\\sqrt{3}\\text{ dm}^3$ și $63\\sqrt{3}>109\\Leftrightarrow 11907>11881$' },
        { pts: 3, text: "Punctul $P$ are proprietatea că este egal depărtat de vârfurile $C$ și $C'$ și este situat pe dreapta $OO'$. Calculează lungimea segmentului $PO$.", ans: "$OC=4\\sqrt{3}$ dm, $O'C'=2\\sqrt{3}$ dm; $PO^2+48=(PO+3)^2+12$, deci $PO=4{,}5$ dm ($P$ sub planul $ABC$)" },
      ],
    },
  ],
}
