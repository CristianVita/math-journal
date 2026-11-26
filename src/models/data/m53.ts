// Testul 22 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 116–118; every answer here is computed and checked with the book's answers, pp. 277–278).
import type { EnModel } from '../types'
import { along3, mid3, plane, solid } from '../figure'
import { box, BOX, graph, pol, PYR4, pyr4 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], M: [3, 0], B: [6, 0], N: [8, 0], C: [16, 0] }, 170, { s: 'A-C', dot: 'A M B N C', l: { A: 'n', M: 'n', B: 'n', N: 'n', C: 'n' } })
const fig8 = plane({ A: [0, 4], X: [5, 4], B: [-1, 0], Y: [5, 0], C: [1.562, 2], L1: [-2, 4], L2: [-2.5, 0] }, 140, {
  s: 'L1-X L2-Y A-B A-C-B', dot: 'A B', ra: ['ACB'], l: { L1: '', L2: '', A: 'n', X: 'n', B: 's', Y: 's' },
})
const fig9 = plane({ A: [0, 0], B: [5, 0], C: [1, 3], D: [0, 3] }, 110, { s: 'A-B-C-D-A', ra: ['DAB', 'ADC'] })
const fig10 = plane({ P1: [0, 0], P2: [3, 0], P3: [3, 3], P4: [0, 3], E: [1.5, 0], F: [3, 1.5], G: [1.5, 3], H: [0, 1.5] }, 90, {
  s: 'P1-P2-P3-P4-P1 E-F-G-H-E', hatch: ['E-F-G-H'], l: { P1: '', P2: '', P3: '', P4: '', E: '', F: '', G: '', H: '' },
})
const fig11 = plane({ O: [0, 0], A: [-8, -6], B: [8, -6], C: [0, -6] }, 110, { s: 'A-B', c: [{ at: 'O', r: 10 }, { at: 'O', r: 6 }], dot: 'O C', l: { O: 'n' } })
const p12 = box(8, 8, 8)
const fig12 = solid({ ...p12, M: mid3(p12.B, p12["B'"]), N: mid3(p12.D, p12["D'"]) }, BOX, 120, { seg: "A-M M-C' C'-N N-A" })

const fig15 = graph({ A: [-2, 0], B: [4 / 3, 0], C: [3, 5], F1: [-3, -1], F2: [4.2, 6.2], G1: [1, -1], G2: [3.4, 6.2] }, 120, [-3.5, 5], [-1.5, 6.5], {
  s: 'F1-F2 G1-G2', dot: 'A B C', l: { F1: '', F2: '', G1: '', G2: '', A: 'nw', B: 'se', C: 'e', O: 'sw' },
})
const f16 = plane({ M: [-6, 0], N: [6, 0], Q: pol(120, 6), P: pol(60, 6) }, 130, { s: 'M-N Q-P' })
const r16 = (f16.p.N[0] - f16.p.M[0]) / 2
const arc = (a: string, b: string) => `M${f16.p[a][0]} ${f16.p[a][1]} A${r16} ${r16} 0 0 1 ${f16.p[b][0]} ${f16.p[b][1]}`
const fig16 = { ...f16, path: [{ d: arc('M', 'Q') }, { d: arc('P', 'N') }] }
const fig17 = plane({ A: [0, 0], B: [12 * s3, 0], C: [0, 12], D: [3 * s3, 9] }, 140, { s: 'A-B-C-A A-D', ra: ['BAC', 'ADB'], ang: ['ABC'] })
// as in the book: a wide, shallow base and only AM, BN (through G) and VO inside
const p18 = pyr4(8, 7.5)
const fig18 = solid({ ...p18, G: along3(p18.V, p18.O, 2 / 3), M: mid3(p18.C, p18.V), N: mid3(p18.D, p18.V) }, PYR4, 150, {
  seg: 'V-O A-M B-N', dot: 'G O', l: { O: 's', G: 'e' },
}, 0.4)

export const M53: EnModel = {
  id: 'en-53',
  title: 'Paralela 45, Testul 22',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 116–118',
  items: [
    { text: 'Rezultatul calculului $12-6:(1+2)$ este:', choices: ['$2$', '$4$', '$6$', '$10$'], ans: 3 },
    { text: 'O bluză costă $240$ de lei. După o ieftinire cu $30\\%$, prețul bluzei va fi egal cu:', choices: ['$72$ de lei', '$80$ de lei', '$168$ de lei', '$210$ lei'], ans: 2 },
    {
      text: 'În tabelul de mai jos sunt prezentate temperaturile medii din primele cinci luni ale anului 2021.\n\n| Ianuarie | Februarie | Martie | Aprilie | Mai |\n|---|---|---|---|---|\n| $-8^\\circ$C | $-3^\\circ$C | $4^\\circ$C | $8^\\circ$C | $15^\\circ$C |\n\nVariația maximă (diferența dintre cea mai mare și cea mai mică temperatură medie) a temperaturii medii în cele cinci luni este:',
      choices: ['$-8^\\circ$C', '$-5^\\circ$C', '$15^\\circ$C', '$23^\\circ$C'], ans: 3,
    },
    { text: 'Cel mai mic dintre numerele raționale $5{,}(3)$; $5{,}3(2)$; $5{,}33$; $5{,}(32)$ este:', choices: ['$5{,}(3)$', '$5{,}3(2)$', '$5{,}33$', '$5{,}(32)$'], ans: 1 },
    {
      text: 'Patru elevi, Andrei, Barbu, Cristina și Dana, calculează produsul numerelor $-2\\sqrt{2}$, $-3\\sqrt{6}$ și $\\sqrt{12}$ și obțin rezultatele înregistrate în tabelul alăturat.\n\n| Andrei | Barbu | Cristina | Dana |\n|---|---|---|---|\n| $-72$ | $-6\\sqrt{6}$ | $6\\sqrt{12}$ | $36\\sqrt{4}$ |\n\nDintre cei patru elevi, cel care a calculat corect produsul celor trei numere este:',
      choices: ['Andrei', 'Barbu', 'Cristina', 'Dana'], ans: 3,
    },
    { text: 'Sonia a plecat spre școală cu $20$ de minute înainte de ora $8$ și s-a întors acasă la ora $14{:}30$. Ea i-a spus mamei sale că a fost plecată de acasă timp de $410$ minute. Afirmația Soniei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$, în această ordine. Punctul $M$ este mijlocul lui $AB$, iar $N$ este mijlocul lui $AC$. Dacă $AB=6$ cm și $MN=5$ cm, atunci lungimea segmentului $BC$ este egală cu:',
      choices: ['$20$ cm', '$12$ cm', '$2$ cm', '$10$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată dreptele $AX$ și $BY$ sunt paralele, iar semidreptele $AC$ și $BC$ sunt bisectoarele unghiurilor $XAB$, respectiv $YBA$. Măsura unghiului $ACB$ este egală cu:',
      choices: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată sunt reprezentate patru mici localități $A$, $B$, $C$, $D$ amplasate în vârfurile trapezului dreptunghic $ABCD$ cu $\\sphericalangle A=\\sphericalangle D=90^\\circ$ și $AB=50$ km, $AD=30$ km și $DC=10$ km. Lungimea celui mai scurt drum de la $A$ la șoseaua care unește $B$ cu $C$ este:',
      choices: ['$10\\sqrt{10}$ km', '$30$ km', '$40$ km', '$50$ km'], ans: 1, fig: fig9,
    },
    {
      text: 'Pardoseala unei băi este acoperită cu $80$ de plăci de gresie în formă de pătrat cu latura de $0{,}3$ m. Fiecare placă de gresie are pătratul cu vârfurile în mijlocul laturilor sale de culoare albastră, iar restul plăcii este de culoare albă, ca în figura alăturată. Suprafața albastră a pardoselei băii are aria egală cu:',
      choices: ['$3\\text{ m}^2$', '$3{,}6\\text{ m}^2$', '$4\\text{ m}^2$', '$7{,}2\\text{ m}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'Cele două cercuri din figura alăturată au același centru $O$, iar coarda $AB$ este tangentă cercului interior în $C$. Dacă raza cercului exterior este de $10$ cm și coarda $AB$ are $16$ cm, atunci raza cercului interior este:',
      choices: ['$6$ cm', '$7$ cm', '$8$ cm', '$9$ cm'], ans: 0, fig: fig11,
    },
    {
      text: "O bucată de brânză are forma cubului $ABCDA'B'C'D'$ cu muchia $AB=8$ cm. Ileana taie cubul cu un cuțit după un plan care trece prin punctele $A$, $M$, $C'$ și $N$, unde $M$ și $N$ sunt mijloacele muchiilor $BB'$, respectiv $DD'$, ca în figura alăturată. Aria secțiunii $AMC'N$ este:",
      choices: ['$16\\sqrt{3}\\text{ cm}^2$', '$24\\sqrt{3}\\text{ cm}^2$', '$32\\sqrt{6}\\text{ cm}^2$', '$48\\sqrt{2}\\text{ cm}^2$'], ans: 2, fig: fig12,
    },

    {
      text: 'Un turist a parcurs un drum în trei zile. În prima zi a mers $18$ km, a doua zi a parcurs $\\dfrac{3}{5}$ din distanța rămasă, iar pentru ultima zi i-a rămas de făcut $25\\%$ din distanța inițială.',
      parts: [
        { pts: 2, text: 'Află ce procent din distanța inițială a parcurs turistul în primele două zile.', ans: '$100\\%-25\\%=75\\%$' },
        { pts: 3, text: 'Determină lungimea totală a drumului.', ans: '$18+\\dfrac{3}{5}(x-18)=\\dfrac{3x}{4}$, deci $x=48$ km' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x+1}{2x-2}-\\dfrac{x-1}{2x+2}-\\dfrac{2}{1-x^2}$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{2}{x-1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$.', ans: '$E(x)=\\dfrac{(x+1)^2-(x-1)^2+4}{2(x-1)(x+1)}=\\dfrac{4x+4}{2(x-1)(x+1)}=\\dfrac{2}{x-1}$' },
        { pts: 3, text: 'Dacă $a,\\,b\\in\\mathbb{R}\\setminus\\{-1,\\,1\\}$, astfel încât $ab=a+b$, atunci arată că $E(a)E(b)$ este număr natural.', ans: '$E(a)\\cdot E(b)=\\dfrac{4}{(a-1)(b-1)}=\\dfrac{4}{ab-a-b+1}=4\\in\\mathbb{N}$' },
      ],
    },
    {
      text: 'Se consideră funcțiile $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+2$ și $g:\\mathbb{R}\\to\\mathbb{R}$, $g(x)=3x-4$.',
      parts: [
        { pts: 2, text: 'Determină numărul real $a$ pentru care $f(a)=g(a)$.', ans: '$a+2=3a-4$, deci $a=3$' },
        { pts: 3, text: 'Fie $A$ și $B$ punctele de intersecție a reprezentărilor grafice ale funcțiilor $f$, respectiv $g$ cu axa $Ox$ a sistemului de axe ortogonale $xOy$ și $C$ punctul lor comun. Calculează aria triunghiului $ABC$.', ans: '$A(-2,\\,0)$, $B\\left(\\dfrac{4}{3},\\,0\\right)$, $C(3,\\,5)$; $\\mathcal{A}_{ABC}=\\dfrac{AB\\cdot d(C,Ox)}{2}=\\dfrac{10}{3}\\cdot5\\cdot\\dfrac{1}{2}=\\dfrac{25}{3}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentată podeaua unui balcon. Arcele $MQ$ și $NP$ aparțin cercului de diametru $MN=12$ m și fiecare dintre ele are măsura de $60^\\circ$.',
      parts: [
        { pts: 2, text: 'Demonstrează că $PQ=6$ m.', ans: 'Cu $O$ mijlocul lui $MN$: $\\sphericalangle POQ=180^\\circ-60^\\circ-60^\\circ=60^\\circ$ și $OP=OQ$, deci $\\triangle OPQ$ e echilateral și $PQ=6$ m' },
        { pts: 3, text: 'Determină lungimea conturului podelei.', ans: 'Fiecare arc are $\\dfrac{2\\pi\\cdot6}{6}=2\\pi$ m, deci $L=12+6+4\\pi=(18+4\\pi)$ m' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este desenat triunghiul dreptunghic $ABC$, cu ipotenuza $BC=24$ cm și $\\sphericalangle B=30^\\circ$.',
      parts: [
        { pts: 2, text: 'Arată că măsura unghiului $CAD$ este de $30^\\circ$.', ans: '$AD\\perp BC$, deci $\\sphericalangle CAD=90^\\circ-\\sphericalangle C=90^\\circ-60^\\circ=30^\\circ$ (ca $\\sphericalangle B$)' },
        { pts: 3, text: 'Determină lungimea segmentului $CD$.', ans: 'Cu teorema unghiului de $30^\\circ$: $AC=\\dfrac{BC}{2}=12$ cm, iar în $\\triangle ADC$: $CD=\\dfrac{AC}{2}=6$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată piramida patrulateră regulată $VABCD$, în care $O$ este centrul bazei $ABCD$, $G\\in(VO)$, $VG=2GO$, $\\{M\\}=AG\\cap CV$ și $\\{N\\}=BG\\cap VD$.',
      parts: [
        { pts: 2, text: 'Demonstrează că $M$ este mijlocul muchiei $CV$.', ans: 'În $\\triangle VAC$, $VO$ e mediană și $VG=2GO$, deci $G$ e centrul de greutate și $AM$ e mediană: $M$ e mijlocul lui $CV$' },
        { pts: 3, text: 'Demonstrează că planele $(MON)$ și $(ABV)$ sunt paralele.', ans: 'La fel, $N$ e mijlocul lui $VD$; $MO\\parallel VA$, $ON\\parallel VB$ (linii mijlocii), deci $MO\\parallel(VAB)$, $ON\\parallel(VAB)$ și $MO\\cap ON=\\{O\\}$: $(MON)\\parallel(ABV)$' },
      ],
      fig: fig18,
    },
  ],
}
