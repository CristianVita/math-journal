// Testul 1 (Modele de teste pentru Evaluarea Națională, Matematică. Clasa a VIII-a, pages 176–178; answers on 242)
import type { EnModel } from '../types'
import { foot, meet, mid, mid3, plane, solid, type Pt } from '../figure'
import { BOX, box, pol } from './shapes'

// II.2: the parallel lines a, b and the secant c, the angles numbered as in the book
const P2: Pt = [5.68, 4], Q2: Pt = [4.32, 1.5]
const fig8 = plane(
  { a1: [0, 4], a2: [8, 4], b1: [0, 1.5], b2: [8, 1.5], S1: [3.5, 0], S2: [6.5, 5.5] },
  170,
  {
    l: { a1: '', a2: '', b1: '', b2: '', S1: '', S2: '' },
    s: 'a1-a2 b1-b2 S1-S2',
    t: [
      { at: [0.2, 4.25], s: 'a', italic: true, size: 14 }, { at: [0.2, 1.75], s: 'b', italic: true, size: 14 }, { at: [6.75, 5.2], s: 'c', italic: true, size: 14 },
      { at: [P2[0] + 0.55, P2[1] + 0.25], s: '1' }, { at: [P2[0] - 0.45, P2[1] + 0.25], s: '2' }, { at: [P2[0] - 0.65, P2[1] - 0.5], s: '3' }, { at: [P2[0] + 0.35, P2[1] - 0.5], s: '4' },
      { at: [Q2[0] + 0.55, Q2[1] + 0.25], s: '5' }, { at: [Q2[0] - 0.45, Q2[1] + 0.25], s: '6' }, { at: [Q2[0] - 0.65, Q2[1] - 0.5], s: '7' }, { at: [Q2[0] + 0.35, Q2[1] - 0.5], s: '8' },
    ],
  },
)

// II.3: AB = 60, AC = 80, D the midpoint of BC, CE ⊥ AD
const B9: Pt = [0, 0], C9: Pt = [10, 0], A9: Pt = [3.6, 4.8], D9 = mid(B9, C9)
const fig9 = plane({ A: A9, B: B9, C: C9, D: D9, E: foot(C9, A9, D9) }, 190, { s: 'A-B-C-A A-D', d: 'D-E-C', ra: ['AEC', 'BAC'] })

const fig10 = plane({ A: [0, 0], B: [12, 0], C: [12, 18], D: [0, 18], E: [0, 16], F: [4, 16], G: [4, 18] }, 115, { s: 'A-B-C-D-A E-F-G B-F', hatch: ['A-B-F-E'], l: { F: 'se' } })

const A11 = pol(100), B11 = pol(-6), C11 = pol(220)
const fig11 = plane({ A: A11, B: B11, C: C11, O: [0, 0] }, 140, { s: 'A-B-C-A O-A O-B', dot: 'O', c: [{ at: 'O', r: 1 }], l: { O: 's' } })

// III.4: the trapezoid, DF ∥ BC
const A16: Pt = [0, 0], C16: Pt = [19.2, 9.6], D16: Pt = [7.2, 9.6], F16: Pt = [20, 0]
const fig16 = plane({ A: A16, B: [32, 0], C: C16, D: D16, F: F16, E: meet(A16, C16, D16, F16) }, 200, { s: 'A-B-C-D-A D-F A-C', l: { E: 'e' } })

// III.5: the rectangle, AE ⊥ BD, BE = 25, DE = 16
const r41 = Math.sqrt(41)
const B17: Pt = [5 * r41, 0], D17: Pt = [0, 4 * r41]
const fig17 = plane({ A: [0, 0], B: B17, C: [5 * r41, 4 * r41], D: D17, E: foot([0, 0], B17, D17) }, 180, { s: 'A-B-C-D-A B-D A-E', ra: ['AEB'] })

const c18 = box(12, 12, 12)
const fig18 = solid({ ...c18, O: mid3(c18.A, c18.C) }, BOX, 160, { seg: "A'-O A-C B-D B'-C", l: { O: 's' } })

export const M10: EnModel = {
  id: 'en-10',
  title: 'Testul 1',
  source: 'Modele de teste pentru Evaluarea Națională (Matematică. Clasa a VIII-a), pag. 176–178',
  items: [
    { text: 'Cel mai mic număr natural de patru cifre distincte, divizibil cu $4$, este:', choices: ['$1004$', '$1024$', '$4876$', '$2632$'], ans: 1 },
    {
      text: 'În tabelul de mai jos este prezentată componența claselor din ciclul gimnazial al unui colegiu.\n\n| Clasa | a V-a | a VI-a | a VII-a | a VIII-a |\n|---|---|---|---|---|\n| Numărul fetelor | 47 | 41 | 32 | 33 |\n| Numărul băieților | 34 | 37 | 40 | 51 |\n\nCei mai mulți băieți sunt în clasa:',
      choices: ['a V-a', 'a VI-a', 'a VII-a', 'a VIII-a'], ans: 3,
    },
    {
      text: 'Numărul natural $n$ verifică relația $\\dfrac{1}{2}<\\dfrac{n+1}{18}<\\dfrac{7}{9}$, dacă și numai dacă:',
      choices: ['$n\\in\\{8,\\,9,\\,10,\\,11\\}$', '$n\\in\\{7,\\,8,\\,9,\\,10\\}$', '$n\\in\\{9,\\,10,\\,11,\\,12\\}$', '$n\\in\\{10,\\,11,\\,12,\\,13\\}$'], ans: 2,
    },
    {
      text: 'Dintre următoarele seturi de numere, cel scris în ordine descrescătoare este:',
      choices: ['$1{,}1(6);\\ 1{,}166;\\ 1{,}(16);\\ 1{,}16$', '$1{,}(16);\\ 1{,}166;\\ 1{,}1(6);\\ 1{,}16$', '$1{,}16;\\ 1{,}1(6);\\ 1{,}(16);\\ 1{,}166$', '$1{,}166;\\ 1{,}(16);\\ 1{,}1(6);\\ 1{,}16$'], ans: 0,
    },
    {
      text: 'Patru elevi au calculat media geometrică a numerelor $\\left(\\dfrac{5}{\\sqrt{10}}+\\dfrac{3}{\\sqrt{6}}\\right)\\cdot\\dfrac{2\\sqrt{8}}{\\sqrt{10}+\\sqrt{6}}$ și $\\sqrt{32}$. Rezultatele obținute sunt înregistrate în tabelul următor.\n\n| Ștefan | Sofia | Matei | Mara |\n|---|---|---|---|\n| 2 | 4 | 5 | 6 |\n\nDintre cei patru elevi, cel care a calculat corect este:',
      choices: ['Ștefan', 'Sofia', 'Matei', 'Mara'], ans: 1,
    },
    {
      text: 'Matei a cumpărat $3$ kg de pere cu $5$ lei kilogramul și $2$ kg de portocale cu $6$ lei kilogramul. Matei spune că a plătit pe toată marfa cumpărată $27$ de lei. Afirmația lui Matei este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată este reprezentat un paralelogram de centru $O$. Simetricul punctului $A$ față de punctul $O$ este punctul:',
      choices: ['$E$', '$B$', '$C$', '$D$'], ans: 2,
      fig: plane({ A: [0, 0], B: [6, 0], C: [8, 3], D: [2, 3], O: [4, 1.5] }, 150, { s: 'A-B-C-D-A', dot: 'O', l: { O: 'n' } }),
    },
    {
      text: 'În figura alăturată, dreptele paralele $a$ și $b$ sunt tăiate de secanta $c$. Dacă $\\sphericalangle 8=132^\\circ$, atunci $\\sphericalangle 1$ are măsura egală cu:',
      choices: ['$132^\\circ$', '$58^\\circ$', '$48^\\circ$', '$42^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un teren în formă de triunghi $ABC$ dreptunghic în $A$, în care $AB=60$ m, $AC=80$ m și punctul $D$ este mijlocul laturii $BC$. Ștefan se află în punctul $C$ și vrea să ajungă la dreapta $AD$, parcurgând drumul cel mai scurt. Distanța parcursă de Ștefan este egală cu:',
      choices: ['$36$ m', '$42$ m', '$48$ m', '$50$ m'], ans: 2, fig: fig9,
    },
    {
      text: 'Figura alăturată reprezintă schița unui salon pentru evenimente, în formă de dreptunghi $ABCD$, cu $AB=12$ m și $AD=18$ m. Dreptunghiul $EFGD$, cu $ED=2$ m și $EF=4$ m reprezintă bucătăria salonului. Proprietarul acoperă suprafața $ABFE$ cu parchet. Aria suprafeței acoperite cu parchet este egală cu:',
      choices: ['$84\\text{ m}^2$', '$96\\text{ m}^2$', '$120\\text{ m}^2$', '$128\\text{ m}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'Pe cercul cu centrul în punctul $O$ din figura alăturată sunt situate punctele $A$, $B$, $C$, astfel încât unghiul $AOB$ are măsura egală cu $106^\\circ$ și măsura arcului $\\overset{\\frown}{AC}$ este egală cu $120^\\circ$. Măsura unghiului $BAC$ este egală cu:',
      choices: ['$63^\\circ$', '$65^\\circ$', '$67^\\circ$', '$68^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'Cătălin are un acvariu în formă de paralelipiped dreptunghic, cu dimensiunile bazei egale cu $135$ cm și $60$ cm, iar înălțimea acvariului este egală cu $60$ cm. Cătălin vrea să introducă pietre în formă de cuburi, având latura egală cu $15$ cm. Numărul de cuburi ce poate fi introdus în acvariu, astfel încât să ocupe jumătate din volumul acestuia, este egal cu:',
      choices: ['$54$', '$60$', '$68$', '$72$'], ans: 3,
    },

    {
      text: 'Trei bluze și două rochii costă împreună $295$ lei. Două bluze și cinci rochii costă împreună $490$ lei.',
      parts: [
        { pts: 2, text: 'Este posibil ca o bluză să coste $60$ lei? Justificați răspunsul.', ans: 'Nu: din $3b+2r=295$ și $2b+5r=490$ rezultă $b=45$ lei' },
        { pts: 3, text: 'Determinați prețul unei rochii.', ans: '$r=80$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2x^2-7x+9}{x^2-7x+10}-\\dfrac{x+3}{x-5}\\right):\\dfrac{1}{x^2-4}$, $x\\in\\mathbb{R}\\setminus\\{-2,\\,2,\\,5\\}$.',
      parts: [
        { pts: 2, text: 'Arătați că $x^2-7x+10=(x-2)(x-5)$, pentru orice $x\\in\\mathbb{R}$.', ans: '$x^2-2x-5x+10=x(x-2)-5(x-2)=(x-2)(x-5)$' },
        { pts: 3, text: 'Demonstrați că $E(x)=(x-3)(x+2)$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,2,\\,5\\}$.', ans: 'paranteza este $\\dfrac{x^2-8x+15}{(x-2)(x-5)}=\\dfrac{x-3}{x-2}$, iar $\\dfrac{x-3}{x-2}\\cdot(x-2)(x+2)=(x-3)(x+2)$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-2x+4$.',
      parts: [
        { pts: 2, text: 'Reprezentați grafic funcția $f$ într-un sistem de axe ortogonale $xOy$.', ans: '$G_f\\cap Ox=\\{A(2,\\,0)\\}$, $G_f\\cap Oy=\\{B(0,\\,4)\\}$' },
        { pts: 3, text: 'Știind că $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, determinați coordonatele punctului $C(a,\\,b)$ situat pe graficul funcției $f$, acesta fiind simetricul lui $B$ față de punctul $A$.', ans: '$a=4$, $b=-4$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat trapezul $ABCD$, cu $AB\\parallel CD$, $CD=12$ cm, $BC=16$ cm și $AD=12$ cm. Paralela prin $D$ la $BC$ intersectează latura $AB$ în $F$, astfel încât $AF=20$ cm, iar diagonala $AC$ în punctul $E$.',
      parts: [
        { pts: 2, text: 'Arătați că $\\sphericalangle ADF=90^\\circ$.', ans: '$DF=BC=16$ cm și $AD^2+DF^2=AF^2$, deci $\\sphericalangle ADF=90^\\circ$ (reciproca teoremei lui Pitagora)' },
        { pts: 3, text: 'Determinați lungimea segmentului $DE$.', ans: '$DE=6$ cm ($\\triangle CED\\sim\\triangle AEF$, raportul $\\dfrac{12}{20}$)' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$, iar $AE$ este distanța de la punctul $A$ la dreapta $BD$, astfel încât $BE=25$ cm și $DE=16$ cm.',
      parts: [
        { pts: 2, text: 'Determinați lungimea segmentului $AE$.', ans: '$AE^2=BE\\cdot DE$, deci $AE=20$ cm' },
        { pts: 3, text: 'Demonstrați că perimetrul dreptunghiului este mai mic decât $117$ cm.', ans: '$AB=5\\sqrt{41}$ cm, $AD=4\\sqrt{41}$ cm, $\\mathcal{P}=18\\sqrt{41}$ cm, iar $18\\sqrt{41}<117\\Leftrightarrow 2\\sqrt{41}<13\\Leftrightarrow 164<169$' },
      ],
      fig: fig17,
    },
    {
      text: "Cubul $ABCDA'B'C'D'$ reprezentat în figura alăturată are $AB=12$ cm și $AC\\cap BD=\\{O\\}$.",
      parts: [
        { pts: 2, text: "Calculați lungimea segmentului $A'O$.", ans: "$A'O=6\\sqrt{6}$ cm" },
        { pts: 3, text: "Determinați măsura unghiului dreptelor $A'O$ și $B'C$.", ans: "$B'C\\parallel A'D$, deci unghiul este $\\sphericalangle DA'O=30^\\circ$ ($\\triangle A'BD$ echilateral)" },
      ],
      fig: fig18,
    },
  ],
}
