// Testul 2 (Modele de teste pentru Evaluarea Națională, Matematică. Clasa a VIII-a, pages 178–180; answers on 242–243).
// Two statements corrected, as the book's own solutions read them: II.2 (∢PDB, the book prints ∢PDC, which is no
// angle) and III.6 (E ∈ VC, the book prints E ∈ CD).
import type { EnModel } from '../types'
import { along3, meet, mid, plane, solid, type Pt } from '../figure'
import { PYR4, pol, pyr4 } from './shapes'

// II.2: a ∥ b, ∢PDB = 45°, ∢PBD = 30°
const D8: Pt = [0, 0], B8: Pt = [5, 0], C8: Pt = [4, 4], A8: Pt = [5 - 8 * Math.cos(Math.PI / 6), 4]
const fig8 = plane(
  { A: A8, C: C8, D: D8, B: B8, P: meet(A8, B8, C8, D8), a1: [-3.2, 4], a2: [5.5, 4], b1: [-3.2, 0], b2: [5.5, 0] },
  180,
  { l: { a1: '', a2: '', b1: '', b2: '', P: 'e', A: 'n', C: 'n', D: 's', B: 's' }, s: 'a1-a2 b1-b2 A-B C-D', t: [{ at: [-3.1, 4.3], s: 'a', italic: true, size: 14 }, { at: [-3.1, 0.3], s: 'b', italic: true, size: 14 }] },
)

// II.3: the medians, GB = 54, GC = 72, BC = 90
const B9: Pt = [0, 0], C9: Pt = [90, 0], G9: Pt = [32.4, 43.2], A9: Pt = [7.2, 129.6]
const fig9 = plane({ A: A9, B: B9, C: C9, D: mid(B9, C9), E: mid(A9, B9), F: mid(A9, C9), G: G9 }, 120, { s: 'A-B-C-A B-F C-E G-D', l: { G: 'n' } })

const A10: Pt = [0, 0], D10: Pt = [6, 14]
const fig10 = plane({ A: A10, B: [30, 0], C: [24, 14], D: D10, M: mid(A10, D10) }, 180, { s: 'A-B-C-D-A', dot: 'M', l: { M: 'w' } })

const fig11 = plane({ A: pol(120), B: pol(-10), C: pol(-75), D: pol(-135), O: [0, 0] }, 130, { dot: 'O A B C D', c: [{ at: 'O', r: 1 }], l: { O: 's' } })

// III.4: the right trapezoid, AB = 28, CD = 21, ∢DAC = 60°
const h16 = 7 * Math.sqrt(3)
const A16: Pt = [0, 0], B16: Pt = [28, 0], C16: Pt = [21, h16], D16: Pt = [0, h16]
const E16 = mid(A16, D16), F16 = mid(B16, C16)
const fig16 = plane({ A: A16, B: B16, C: C16, D: D16, E: E16, F: F16, M: meet(E16, F16, A16, C16), N: meet(E16, F16, B16, D16) }, 200, { s: 'A-B-C-D-A E-F A-C B-D', ra: ['DAB', 'ADC'], l: { M: 's', N: 's' } })

const A17: Pt = [0, 0], D17: Pt = [0, 30], E17: Pt = [15, 0], F17: Pt = [30, 15]
const fig17 = plane({ A: A17, B: [30, 0], C: [30, 30], D: D17, E: E17, F: F17, G: meet(A17, F17, D17, E17) }, 140, { s: 'A-B-C-D-A A-F D-E', l: { G: 'n' } })

const p18 = pyr4(12, 6 * Math.sqrt(7))
const fig18 = solid({ ...p18, E: along3(p18.V, p18.C, 10 / 18) }, PYR4, 170, { seg: 'A-C B-D V-O B-E D-E', l: { O: 's', E: 'e' } })

export const M11: EnModel = {
  id: 'en-11',
  title: 'Testul 2',
  source: 'Modele de teste pentru Evaluarea Națională (Matematică. Clasa a VIII-a), pag. 178–180',
  items: [
    { text: 'Dacă $8^x=512$, numărul natural $x$ este egal cu:', choices: ['$2$', '$3$', '$4$', '$5$'], ans: 1 },
    {
      text: 'În tabelul de mai jos sunt prezentate temperaturile medii zilnice înregistrate într-o localitate, în decursul unei săptămâni.\n\n| Ziua | Luni | Marți | Miercuri | Joi | Vineri | Sâmbătă | Duminică |\n|---|---|---|---|---|---|---|---|\n| Temperatura | −3°C | −2°C | −1°C | +5°C | +6°C | +7°C | +9°C |\n\nTemperatura medie înregistrată în această săptămână a fost egală cu:',
      choices: ['$-1^\\circ$C', '$2^\\circ$C', '$3^\\circ$C', '$4^\\circ$C'], ans: 2,
    },
    { text: 'Într-o clasă sunt $12$ băieți și $18$ fete. Probabilitatea ca o fată să fie scoasă la tablă este egală cu:', choices: ['$0{,}4$', '$0{,}5$', '$0{,}6$', '$0{,}8$'], ans: 2 },
    { text: 'Dintre numerele $2{,}(34)$, $2{,}344$, $2{,}34$ și $2{,}3(4)$, cel mai mic este:', choices: ['$2{,}(34)$', '$2{,}344$', '$2{,}34$', '$2{,}3(4)$'], ans: 2 },
    {
      text: 'Patru elevi au calculat valoarea numărului real $x$, știind că $xy-xz-3x=3-2\\sqrt{2}$ și $y-z=\\sqrt{8}$. Rezultatele obținute de fiecare elev sunt înregistrate în tabelul următor.\n\n| Ioana | Alin | Simona | Adrian |\n|---|---|---|---|\n| $-2$ | $-1$ | $1$ | $\\sqrt{2}+1$ |\n\nRăspunsul corect a fost obținut de:',
      choices: ['Ioana', 'Alin', 'Simona', 'Adrian'], ans: 1,
    },
    {
      text: 'Un autoturism a parcurs un traseu în trei ore. În prima oră a parcurs $65$ km, în a doua oră cu $15$ km mai puțin decât în prima oră, iar în a treia oră cu $10$ km mai mult decât în a doua oră. Șoferul afirmă că autoturismul a parcurs $175$ km. Afirmația șoferului este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$, în care $AD\\perp BC$ și $CD<BD$. Varianta în care segmentele sunt scrise în ordine crescătoare este:',
      choices: ['$AB<AD<AC$', '$AC<AD<AB$', '$AD<AC<AB$', '$AD<AB<AC$'], ans: 2,
      fig: plane({ A: [6.5, 5], B: [0, 0], C: [10, 0], D: [6.5, 0] }, 160, { s: 'A-B-C-A A-D', ra: ['ADC'] }),
    },
    {
      text: 'În figura alăturată, dreptele $a$ și $b$ sunt paralele, iar $\\sphericalangle PDB=45^\\circ$ și $\\sphericalangle PBD=30^\\circ$. Măsura unghiului $APD$ este egală cu:',
      choices: ['$50^\\circ$', '$60^\\circ$', '$75^\\circ$', '$90^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ reprezintă schița unui teren în care $E$ este mijlocul lui $AB$, $F$ este mijlocul lui $AC$, $BF\\cap CE=\\{G\\}$ și punctul $D$ este mijlocul lui $BC$. Dacă $BF=81$ m, $CE=108$ m și $BC=90$ m, atunci lungimea drumului $GD$ este egală cu:',
      choices: ['$36$ m', '$42$ m', '$45$ m', '$48$ m'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentată schița unui teren în formă de trapez $ABCD$, cu $AB\\parallel CD$ și punctul $M$ este mijlocul laturii $AD$. Știind că aria trapezului este egală cu $378\\text{ m}^2$ și $BC=21$ m, atunci distanța de la punctul $M$ la dreapta $BC$ este egală cu:',
      choices: ['$14$ m', '$16$ m', '$18$ m', '$21$ m'], ans: 2, fig: fig10,
    },
    {
      text: 'Pe cercul cu centrul în punctul $O$ din figura alăturată sunt situate punctele $A$, $B$, $C$, $D$, în această ordine, în sensul de mișcare a acelor de ceasornic, astfel încât $\\overset{\\frown}{AB}=130^\\circ$, $\\overset{\\frown}{BC}=65^\\circ$ și $\\overset{\\frown}{AD}=105^\\circ$. Măsura unghiului la centru $COD$ este egală cu:',
      choices: ['$30^\\circ$', '$40^\\circ$', '$45^\\circ$', '$60^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'Matei are o cutie de jucării în formă de paralelipiped dreptunghic, cu dimensiunile bazei egale cu $108$ cm lungimea și, respectiv, $72$ cm lățimea, pe care o umple cu $162$ cutii în formă cubică, având fiecare latura de $12$ cm. Înălțimea paralelipipedului dreptunghic este egală cu:',
      choices: ['$30$ cm', '$32$ cm', '$36$ cm', '$40$ cm'], ans: 2,
    },

    {
      text: 'Două obiecte costă împreună $520$ lei. Dacă prețul unui obiect crește cu $20\\%$, iar prețul celuilalt scade cu $25\\%$, atunci valorile lor devin egale.',
      parts: [
        { pts: 2, text: 'Se poate afirma că prețul obiectului mai ieftin este egal cu $240$ lei? Justificați răspunsul.', ans: 'Nu: $a+b=520$ și $120\\%\\,a=75\\%\\,b$ dau $a=200$ lei, $b=320$ lei' },
        { pts: 3, text: 'Dacă $p\\%$ din prețul obiectului mai scump reprezintă prețul obiectului mai ieftin, determinați valoarea lui $p$.', ans: '$p=62{,}5$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=(2x-3)^2+(2x-1)(x+3)-(3x+2)^2+19x+1$, $x\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Arătați că $E(x)=-3(x^2-1)$, pentru orice $x\\in\\mathbb{R}$.', ans: '$E(x)=4x^2-12x+9+2x^2+5x-3-9x^2-12x-4+19x+1=-3x^2+3$' },
        { pts: 3, text: 'Determinați valorile întregi ale lui $n$ pentru care $E(n)>-9$.', ans: '$n^2<4$, deci $n\\in\\{-1,\\,0,\\,1\\}$' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+8$.',
      parts: [
        { pts: 2, text: 'Determinați numărul real $a$, astfel încât punctul $A(3,\\,-1)$ se află pe graficul funcției $f$.', ans: '$a=-3$' },
        { pts: 3, text: 'Pentru $a=-3$, determinați punctul de pe graficul funcției date care are coordonatele egale.', ans: '$M(2,\\,2)$' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat trapezul dreptunghic $ABCD$, cu $AB\\parallel CD$, $\\sphericalangle A=\\sphericalangle D=90^\\circ$, $E\\in AD$, $F\\in BC$, iar segmentul $EF$ linie mijlocie, determinat de diagonale pe linia mijlocie, $MN=3{,}5$ cm. Știind că $AC\\perp BC$, iar $\\sphericalangle DAC=60^\\circ$, calculați:',
      parts: [
        { pts: 2, text: 'lungimea laturii $BC$;', ans: '$BC=14$ cm ($AB-CD=2MN=7$ cm, iar în $\\triangle BCT$, cu $CT\\perp AB$: $\\sphericalangle BCT=30^\\circ$)' },
        { pts: 3, text: 'lungimea bazei mari $AB$.', ans: '$AB=2BC=28$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$, cu $AB=30$ cm, iar punctele $E$ și $F$ sunt mijloacele laturilor $AB$ și, respectiv, $BC$, cu $AF\\cap DE=\\{G\\}$.',
      parts: [
        { pts: 2, text: 'Demonstrați că $\\sphericalangle DGF=90^\\circ$.', ans: '$\\triangle DAE\\equiv\\triangle ABF$ (C.C.), deci $\\sphericalangle GAE+\\sphericalangle GEA=90^\\circ$ și $\\sphericalangle AGE=90^\\circ$' },
        { pts: 3, text: 'Calculați aria triunghiului $ADG$.', ans: '$DE=15\\sqrt{5}$ cm, $AG=6\\sqrt{5}$ cm, $DG=12\\sqrt{5}$ cm, aria este $180\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: 'În piramida patrulateră regulată $VABCD$ din figura alăturată, $AB=12$ cm, $AC\\cap BD=\\{O\\}$ și $VO\\perp(ABC)$, $VO=6\\sqrt{7}$ cm, iar punctul $E\\in VC$, astfel încât $BE+DE=24$ cm.',
      parts: [
        { pts: 2, text: 'Arătați că lungimea muchiei laterale $VA$ este egală cu $18$ cm.', ans: '$OA=6\\sqrt{2}$ cm, $VA^2=VO^2+OA^2=252+72=324$' },
        { pts: 3, text: 'Determinați lungimea segmentului $VE$.', ans: '$BE=DE=12$ cm, $\\triangle BCE\\sim\\triangle VCB$, deci $EC=8$ cm și $VE=10$ cm' },
      ],
      fig: fig18,
    },
  ],
}
