// Testul 42 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 158–161; every answer here is computed and checked with the book's answers, p. 285).
import type { EnModel } from '../types'
import type { P3, Pt } from '../figure'
import { foot, meet, mid3, plane, solid } from '../figure'
import { graph, pol, PRISM3 } from './shapes'

const s3 = Math.sqrt(3)
const c72 = Math.cos((72 * Math.PI) / 180), sn72 = Math.sin((72 * Math.PI) / 180)

const fig7 = plane({ A: [0, 0], M: [4, 0], N: [8, 0], B: [12, 0] }, 160, { s: 'A-B', dot: 'A M N B', l: { A: 's', M: 's', N: 's', B: 's' } })
const fig8 = plane({ A: [0, 0], B: [1 + 2 * c72, 0], C: [1 + c72, sn72], D: [c72, sn72] }, 120, { s: 'A-B-C-D-A A-C' })
const fig9 = plane({ B: [0, 0], C: [12, 0], A: [6, 2 * s3], D: [4, 0], E: [8, 0] }, 140, { s: 'A-B-C-A', dot: 'D E', l: { D: 's', E: 's' } })
const fig10 = plane({
  A: [0, 0], B: [5, 1.5], P0: [0, 1], P1: [1, 1], P2: [1, 2], P3: [5, 2], Q6: [6, 0], Q7: [6, 1],
  X1: [1, 0], X2: [2, 0], X3: [3, 0], X4: [4, 0], X5: [5, 0], Y2: [2, 2], Y3: [3, 2], Y4: [4, 2], Z5: [5, 1],
}, 150, {
  s: 'A-Q6-Q7-P0-A P1-P2-P3-Z5 X1-P1 X2-Y2 X3-Y3 X4-Y4 X5-P3 A-B',
  hatch: ['A-B-P3-P2-P1-P0'],
  l: { A: 's', B: 'e', P0: '', P1: '', P2: '', P3: '', Q6: '', Q7: '', X1: '', X2: '', X3: '', X4: '', X5: '', Y2: '', Y3: '', Y4: '', Z5: '' },
})
const A11: Pt = [0, 1 / Math.tan((25 * Math.PI) / 180)], B11: Pt = [-1, 0], C11: Pt = [1, 0]
const D11 = foot(C11, A11, B11), E11 = foot(B11, A11, C11)
const fig11 = plane({ A: A11, B: B11, C: C11, D: D11, E: E11, P: meet(B11, E11, C11, D11), O: [0, 0] }, 110, {
  s: 'A-B-C-A B-E C-D', c: [{ at: 'O', r: 1 }], l: { O: '', D: 'w', E: 'e', P: 's' },
})

const fig15 = graph({ A: [3, 2], B: [1, 0], C: [5, 0], F1: [-0.5, -1.5], F2: [6, 5], G1: [-0.5, 5.5], G2: [6, -1] }, 160, [-1.5, 6.5], [-1.5, 6], {
  s: 'F1-F2 G1-G2', dot: 'A B C', l: { F1: '', F2: '', G1: '', G2: '', A: 'n', B: 'nw', C: 'ne' },
  t: [{ at: [5.6, 3.9], s: 'f', italic: true }, { at: [1.3, 4.4], s: 'g', italic: true }],
})
const fig16 = plane({ A: [-8, 0], C: [8, 0], B: [0, 6], D: [0, -15] }, 110, { s: 'A-B-C-D-A A-C B-D' })
const B17: Pt = [12 * s3, 0], D17 = pol(30, 12), C17: Pt = [B17[0] + D17[0], D17[1]]
const fig17 = plane({ A: [0, 0], B: B17, C: C17, D: D17, E: foot(D17, [0, 0], B17), F: foot(D17, B17, C17) }, 170, {
  s: 'A-B-C-D-A D-E D-F B-F', ra: ['DEB', 'DFC'], ang: ['DAB'], l: { F: 's' },
})
const h18 = 6 * s3
const p18: Record<string, P3> = { A: [0, 0, 0], B: [12, 0, 0], C: [6, h18, 0], "A'": [0, 0, 8], "B'": [12, 0, 8], "C'": [6, h18, 8] }
const fig18 = solid({ ...p18, M: mid3(p18.A, p18.B), N: mid3(p18.A, p18.C) }, PRISM3, 120, { seg: "M-N M-B' N-C'", l: { N: 'w' } })

export const M73: EnModel = {
  id: 'en-73',
  title: 'Paralela 45, Testul 42',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 158–161',
  items: [
    { text: 'Suma divizorilor naturali improprii ai numărului $15$ este:', choices: ['$15$', '$16$', '$19$', '$24$'], ans: 1 },
    {
      text: 'În tabelul de mai jos se pot vedea vârstele a patru surori, Alina, Corina, Sanda și Tudora.\n\n| Numele | Alina | Corina | Sanda | Tudora |\n|---|---|---|---|---|\n| Vârsta | $4$ ani | $5$ ani | $6$ ani | $10$ ani |\n\nEle primesc $43$ de caise pe care le împart în mod invers proporțional cu vârstele lor. Numărul de caise care îi revin Alinei este:',
      choices: ['$6$', '$10$', '$12$', '$15$'], ans: 3,
    },
    {
      text: 'Fie $a$ și $b$ două numere întregi, astfel încât $a\\cdot b=-1$. Patru colege, Ioana, Mia, Alexia și Mara, au scris pe o tablă câte o relație, așa cum se vede în următorul tabel.\n\n| Ioana | Mia | Alexia | Mara |\n|---|---|---|---|\n| $a+b=0$ | $a^2+b^2=1$ | $a+b=2$ | $a+b=-2$ |\n\nEleva care a scris relația corectă este:',
      choices: ['Ioana', 'Mia', 'Alexia', 'Mara'], ans: 0,
    },
    { text: 'Rezultatul împărțirii $0{,}16:0{,}004$ este:', choices: ['$0{,}4$', '$4$', '$40$', '$400$'], ans: 2 },
    { text: 'Media geometrică a numerelor $x=\\sqrt{3}\\cdot2\\sqrt{3}+3\\sqrt{2}\\cdot\\sqrt{2}$ și $y=\\sqrt{18}:\\sqrt{2}$ este:', choices: ['$\\sqrt{6}$', '$6$', '$12$', '$36$'], ans: 1 },
    { text: 'Un magazin on-line vinde un calculator la fiecare $8$ ore, dar în fiecare zi unul dintre calculatoarele vândute este returnat. Directorul magazinului se gândește că vinde (definitiv) într-un an $750$ de calculatoare. Socoteala directorului este:', choices: ['corectă', 'incorectă'], ans: 1 },

    {
      text: 'În figura alăturată, $AB=12$ cm, iar $M$ și $N$ sunt două puncte pe segmentul $AB$ astfel încât $\\dfrac{MA}{MB}=\\dfrac{1}{2}$ și $\\dfrac{NA}{NB}=2$. Lungimea segmentului $MN$ este egală cu:',
      choices: ['$2$ cm', '$3$ cm', '$4$ cm', '$5$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'Trapezul $ABCD$ din figura alăturată are baza mare $AB$, $AD=DC=CB$ și $AB=AC$. Măsura unghiului $ABC$ este:',
      choices: ['$30^\\circ$', '$36^\\circ$', '$60^\\circ$', '$72^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul isoscel $ABC$, având baza $BC=12$ cm și $\\sphericalangle BAC=120^\\circ$. Punctele $D$ și $E$ aparțin segmentului $BC$, cu $BD=DE=EC$. Perimetrul triunghiului $ADE$ este egal cu:',
      choices: ['$8$ cm', '$12$ cm', '$6$ cm', '$10$ cm'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este desenată o rețea de pătrate $1\\text{ cm}\\times1\\text{ cm}$. Daniela a unit, printr-o linie, punctele $A$ și $B$ ($B$ este mijlocul laturii pătratului din dreapta-sus) și a hașurat partea de deasupra. Aria suprafeței hașurate este:',
      choices: ['$4{,}5\\text{ cm}^2$', '$5\\text{ cm}^2$', '$5{,}25\\text{ cm}^2$', '$6\\text{ cm}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată, cercul cu diametrul $BC$ intersectează laturile $AB$ și $AC$ ale triunghiului $ABC$ în punctele $D$, respectiv $E$. Dacă $P$ este punctul comun al dreptelor $BE$ și $CD$, iar măsura unghiului $A$ este $50^\\circ$, atunci măsura unghiului $BPC$ este:',
      choices: ['$50^\\circ$', '$90^\\circ$', '$100^\\circ$', '$130^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'Un cornet de înghețată are forma unui con circular drept cu înălțimea de $9$ cm și diametrul bazei de $4$ cm. Mișu, vânzătorul de înghețată, umple cornetul și adaugă deasupra încă $150\\%$ din câtă înghețată a intrat în cornet. O înghețată de la Mișu are aproximativ:',
      choices: ['$81\\text{ cm}^3$', '$94\\text{ cm}^3$', '$124\\text{ cm}^3$', '$150\\text{ cm}^3$'], ans: 1,
    },

    {
      text: 'Un telefon se ieftinește cu $20\\%$, iar după un timp telefonul se scumpește cu $20\\%$ din noul preț. După aceste modificări, prețul telefonului devine $288$ de lei.',
      parts: [
        { pts: 2, text: 'Află prețul telefonului după ieftinire.', ans: '$p+\\dfrac{20}{100}p=288$, deci $p=240$ de lei' },
        { pts: 3, text: 'Determină prețul inițial al telefonului.', ans: '$x-\\dfrac{20}{100}x=240$, deci $x=300$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{3}{x+2}-\\dfrac{2}{x+1}\\right):\\dfrac{x^2-x}{x+2}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{1}{x(x+1)}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,-1,\\,0,\\,1\\}$.', ans: '$E(x)=\\dfrac{x-1}{(x+1)(x+2)}\\cdot\\dfrac{x+2}{x(x-1)}=\\dfrac{1}{x(x+1)}$' },
        { pts: 3, text: 'Demonstrează că suma $E(2)+E(3)+\\ldots+E(9)$ este un număr rațional din intervalul $\\left(0,\\,\\dfrac{1}{2}\\right)$.', ans: '$\\left(\\dfrac{1}{2}-\\dfrac{1}{3}\\right)+\\left(\\dfrac{1}{3}-\\dfrac{1}{4}\\right)+\\ldots+\\left(\\dfrac{1}{9}-\\dfrac{1}{10}\\right)=\\dfrac{1}{2}-\\dfrac{1}{10}=0{,}4\\in\\left(0,\\,\\dfrac{1}{2}\\right)\\cap\\mathbb{Q}$' },
      ],
    },
    {
      text: 'Se consideră funcțiile $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x-1$ și $g:\\mathbb{R}\\to\\mathbb{R}$, $g(x)=5-x$.',
      parts: [
        { pts: 2, text: 'Arată că $A(3,\\,2)$ este punctul comun al reprezentărilor grafice ale celor două funcții, în sistemul de axe ortogonale $xOy$.', ans: '$f(x)=g(x)\\Leftrightarrow x-1=5-x\\Leftrightarrow x=3$ și $f(3)=2$, deci $A(3,\\,2)$ este singurul punct comun' },
        { pts: 3, text: 'Fie $B$ punctul de intersecție a reprezentării grafice a funcției $f$ cu axa $Ox$ și $C$ punctul de intersecție a reprezentării grafice a funcției $g$ tot cu axa $Ox$ a sistemului de axe ortogonale $xOy$. Demonstrează că triunghiul $ABC$ este dreptunghic isoscel.', ans: '$B(1,\\,0)$, $C(5,\\,0)$, $AB=AC=2\\sqrt{2}$, $BC=4$ și $BC^2=16=AB^2+AC^2$, deci $\\triangle ABC$ este dreptunghic isoscel' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat schematic un zmeu de hârtie $ABCD$ cu $AC=16$ dm, $AD=CD=17$ dm și $AB=CB=10$ dm.',
      parts: [
        { pts: 2, text: 'Arată că dreptele $AC$ și $BD$ sunt perpendiculare.', ans: '$AD=CD$ și $AB=CB$, deci $BD$ este mediatoarea segmentului $AC$, adică $AC\\perp BD$' },
        { pts: 3, text: 'Determină lungimea diagonalei $BD$.', ans: 'Fie $\\{O\\}=AC\\cap BD$: $AO=8$ dm, $BO=\\sqrt{100-64}=6$ dm, $DO=\\sqrt{289-64}=15$ dm, deci $BD=21$ dm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un paralelogram $ABCD$ cu $AB=12\\sqrt{3}$ cm, $BC=12$ cm și $\\sphericalangle A=30^\\circ$. Punctele $E$ și $F$ sunt proiecțiile punctului $D$ pe dreptele $AB$, respectiv $BC$.',
      parts: [
        { pts: 2, text: 'Determină măsura unghiului $EDF$.', ans: '$\\sphericalangle EDF=\\sphericalangle ADC-(\\sphericalangle ADE+\\sphericalangle CDF)=150^\\circ-(60^\\circ+60^\\circ)=30^\\circ$' },
        { pts: 3, text: 'Calculează lungimea segmentului $EF$.', ans: '$DE=\\dfrac{AD}{2}=6$ cm, $DF=\\dfrac{DC}{2}=6\\sqrt{3}$ cm; cu $EP\\perp DF$: $DP=DE\\cdot\\cos30^\\circ=3\\sqrt{3}$ cm, deci $P$ este mijlocul lui $DF$ și $EF=DE=6$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o prismă triunghiulară regulată $ABCA'B'C'$ cu latura bazei $AB=12$ cm și muchia laterală $AA'=8$ cm. Punctele $M$ și $N$ sunt mijloacele laturilor $AB$, respectiv $AC$.",
      parts: [
        { pts: 2, text: "Arată că punctele $M$, $N$, $C'$, $B'$ sunt coplanare.", ans: "$MN\\parallel BC$ (linie mijlocie) și $BC\\parallel B'C'$, deci $MN\\parallel B'C'$ și punctele sunt coplanare" },
        { pts: 3, text: "Calculează perimetrul patrulaterului $B'MNC'$.", ans: "$MB'=NC'=\\sqrt{36+64}=10$ cm, $MN=6$ cm, $B'C'=12$ cm, deci perimetrul este $38$ cm" },
      ],
      fig: fig18,
    },
  ],
}
