// Testul 3 (Modele de teste pentru Evaluarea Națională, Matematică. Clasa a VIII-a, pages 181–183; answers on 243)
import type { EnModel } from '../types'
import { along3, meet, mid, mid3, plane, solid, type P3, type Pt } from '../figure'
import { pol } from './shapes'

const s3 = Math.sqrt(3)

// II.1: ∢ABD = 129°, so B = 51°, C = 86°
const A7 = pol(51, Math.sin((86 * Math.PI) / 180) / Math.sin((43 * Math.PI) / 180))
const fig7 = plane({ A: A7, B: [0, 0], C: [1, 0], D: [-0.7, 0] }, 150, { s: 'D-C-A-B' })

const A8: Pt = [4, 6], B8: Pt = [0, 0], C8: Pt = [10, 0]
const M8 = mid(B8, C8), N8 = mid(A8, C8)
const fig8 = plane({ A: A8, B: B8, C: C8, M: M8, N: N8, G: meet(A8, M8, B8, N8) }, 150, { s: 'A-B-C-A A-M B-N', l: { G: 'w' } })

const fig9 = plane({ A: [0, 6], B: [3 * s3, 6], C: [3 * s3, 0], D: [0, 0], E: [3 * s3, 3] }, 100, { s: 'A-B-C-D-A A-E-D' })

const fig10 = plane({ A: [0, 6 * s3], D: [6, 6 * s3], B: [0, 0], C: [12, 0] }, 130, { s: 'A-B-C-D-A B-D', ra: ['DAB', 'ABC'] })

// II.5: A = 56°, B = 60°, C = 64°
const A11 = pol(95), C11 = pol(-25)
const fig11 = plane({ A: A11, B: pol(223), C: C11, O: [0, 0], E: [A11[0] + (A11[0] - C11[0]) * 0.3, A11[1] + (A11[1] - C11[1]) * 0.3] }, 150, { s: 'A-B-C-A E-A O-A O-C', dot: 'O', c: [{ at: 'O', r: 1 }], l: { O: 's' } })

const fig12 = plane({ A: [0, 0], B: [72, 0], C: [72, 72], D: [0, 72], M: [0, 56], N: [18, 56], P: [18, 72] }, 130, { s: 'A-B-C-D-A M-N-P', hatch: ['M-N-P-D'], l: { M: 'w', N: 'se', P: 'n' } })

// III.4: the square, E the midpoint of AD, ∢BEF = 90°
const fig16 = plane({ A: [0, 0], B: [0, 8], C: [8, 8], D: [8, 0], E: [4, 0], F: [8, 2], G: [20, 8] }, 200, { s: 'A-B-C-D-A B-E E-G C-G B-F', ra: ['BEF'], l: { F: 'e' } })

const A17: Pt = [0, 0], B17: Pt = [36, 0], C17: Pt = [9, 18], D17: Pt = [0, 18]
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, O: meet(A17, C17, B17, D17) }, 170, { s: 'A-B-C-D-A A-C B-D', ra: ['DOC'], l: { O: 'sw' } })

// III.6: VABC regular, AB = 12, VA = 4√6; BM ⊥ VA, AM = 3√6
const t18: Record<string, P3> = { A: [0, 6 * s3, 0], B: [6, 0, 0], C: [12, 6 * s3, 0], V: [6, 4 * s3, 4 * s3] }
const fig18 = solid({ ...t18, O: [6, 4 * s3, 0], D: mid3(t18.B, t18.C), M: along3(t18.A, t18.V, 3 / 4) }, 'A-B-C A-B-V B-C-V C-A-V', 170, { seg: 'M-B M-C V-O A-D M-D', l: { O: 's', M: 'w', D: 'e' } })

export const M12: EnModel = {
  id: 'en-12',
  title: 'Testul 3',
  source: 'Modele de teste pentru Evaluarea Națională (Matematică. Clasa a VIII-a), pag. 181–183',
  items: [
    { text: 'Inversul numărului $12$ este egal cu:', choices: ['$0{,}8$', '$0{,}8(3)$', '$0{,}08(3)$', '$0{,}(83)$'], ans: 2 },
    {
      text: 'Un elev are la limba germană următoarele note, trecute în tabelul de mai jos.\n\n| Nota | 6 | 7 | 8 | 9 | 10 |\n|---|---|---|---|---|---|\n| Numărul de note | 1 | 1 | 1 | 1 | 1 |\n\nMedia elevului la limba germană este egală cu:',
      choices: ['$7{,}80$', '$7{,}90$', '$8$', '$8{,}10$'], ans: 2,
    },
    { text: 'Într-o zi de vară, la malul mării, temperatura apei a fost de $24^\\circ$C, iar temperatura în aer de $33^\\circ$C. Temperatura în aer a fost mai mare decât temperatura apei cu:', choices: ['$7^\\circ$C', '$8^\\circ$C', '$9^\\circ$C', '$12^\\circ$C'], ans: 2 },
    { text: 'Dintre numerele următoare, natural este numărul:', choices: ['$-6$', '$0{,}6$', '$\\sqrt{6}$', '$6$'], ans: 3 },
    {
      text: 'Patru elevi au calculat valoarea raportului $\\dfrac{a}{b}$, unde $a=\\sqrt{8}+\\sqrt{32}-\\sqrt{50}$ și $b=\\sqrt{18}+\\sqrt{50}-\\sqrt{72}$. Rezultatele obținute sunt trecute în tabelul de mai jos.\n\n| Ștefan | Ioana | Matei | Ana |\n|---|---|---|---|\n| 0,4 | 0,5 | 1 | 2 |\n\nDintre cei patru elevi, cel care a calculat corect este:',
      choices: ['Ștefan', 'Ioana', 'Matei', 'Ana'], ans: 1,
    },
    { text: 'Ștefan cumpără un obiect pe care îl achită folosind două bancnote de $10$ lei și una de $5$ lei și primește rest $3{,}40$ lei. Ștefan afirmă că obiectul costă $21{,}60$ lei. Afirmația lui Ștefan este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, cu $\\sphericalangle ABD=129^\\circ$ și $\\sphericalangle A=\\dfrac{\\sphericalangle C}{2}$. Măsura unghiului $C$ este egală cu:',
      choices: ['$78^\\circ$', '$80^\\circ$', '$82^\\circ$', '$86^\\circ$'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, în care $BN$ și $AM$ sunt două dintre medianele sale, iar $BN\\cap AM=\\{G\\}$. Știind că $\\mathcal{A}_{\\triangle ABG}=24\\text{ cm}^2$, atunci aria triunghiului $ABC$ este egală cu:',
      choices: ['$48\\text{ cm}^2$', '$60\\text{ cm}^2$', '$72\\text{ cm}^2$', '$75\\text{ cm}^2$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentată schița unui teren $ABCD$ în formă de dreptunghi, în care este înscris triunghiul echilateral $ADE$, având latura $AD=6$ m. Aria dreptunghiului $ABCD$ este egală cu:',
      choices: ['$18\\text{ m}^2$', '$12\\sqrt{3}\\text{ m}^2$', '$18\\sqrt{2}\\text{ m}^2$', '$18\\sqrt{3}\\text{ m}^2$'], ans: 3, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentată schița unui teren în formă de trapez dreptunghic $ABCD$, cu $AD\\parallel BC$, $BC>AD$, $\\sphericalangle A=\\sphericalangle B=90^\\circ$, $AD=6$ m și triunghiul $BCD$ echilateral. Perimetrul terenului $ABCD$ este egal cu:',
      choices: ['$36$ m', '$36\\sqrt{3}$ m', '$30+6\\sqrt{2}$ m', '$30+6\\sqrt{3}$ m'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat cercul de centru $O$ și triunghiul $ABC$ înscris în cerc, astfel încât $\\sphericalangle BAE=124^\\circ$, unde punctul $E$ aparține dreptei $AC$, și $\\overset{\\frown}{ACB}=232^\\circ$. Măsura unghiului la centru $AOC$ este egală cu:',
      choices: ['$118^\\circ$', '$120^\\circ$', '$122^\\circ$', '$124^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentată schița unei parcări în formă de pătrat $ABCD$, cu latura $AB=72$ m. Proprietarul vrea să paveze această parcare cu dale în forma dreptunghiului $MNPD$, având dimensiunile $MN=1{,}2$ m și $MD=0{,}96$ m. Numărul pavelelor necesare pentru a pava întreaga parcare este egal cu:',
      choices: ['$4500$', '$4600$', '$4700$', '$4800$'], ans: 0, fig: fig12,
    },

    {
      text: 'Diferența dintre dublul unui număr și triplul altui număr este egală cu $325$. O cincime din numărul mai mare este cu $30$ mai mare decât o treime din numărul mai mic.',
      parts: [
        { pts: 2, text: 'Este posibil ca numărul mai mic să fie egal cu $80$? Justificați răspunsul.', ans: 'Nu: din $2a-3b=325$ și $\\dfrac{a}{5}=\\dfrac{b}{3}+30$, adică $3a-5b=450$, rezultă $b=75$' },
        { pts: 3, text: 'Determinați cel mai mare număr.', ans: '$a=275$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=(x^2-2x+3)^2-(x^2-2x)^2-2x(3x-7)-5$, unde $x\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Arătați că $E(x)=2x+4$, pentru orice $x\\in\\mathbb{R}$.', ans: '$E(x)=6(x^2-2x)+9-6x^2+14x-5=2x+4$' },
        { pts: 3, text: 'Determinați valorile naturale nenule ale lui $n$, pentru care $E(n)<12$.', ans: '$n\\in\\{1,\\,2,\\,3\\}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-3x+6$.',
      parts: [
        { pts: 2, text: 'Reprezentați grafic funcția $f$ într-un sistem de axe ortogonale $xOy$.', ans: '$G_f\\cap Oy=\\{A(0,\\,6)\\}$, $G_f\\cap Ox=\\{B(2,\\,0)\\}$' },
        { pts: 3, text: 'Determinați distanța de la punctul $P(0,\\,-2)$ la graficul funcției.', ans: '$d(P,AB)=\\dfrac{4\\sqrt{10}}{5}$ ($AP\\cdot BO=AB\\cdot d(P,AB)$)' },
      ],
    },
    {
      text: 'Pătratul $ABCD$ din figura alăturată are $AB=8$ cm, punctul $E$ este mijlocul laturii $AD$, $\\sphericalangle BEF=90^\\circ$, iar $EF\\cap BC=\\{G\\}$.',
      parts: [
        { pts: 2, text: 'Arătați că $BF=10$ cm.', ans: '$\\triangle EDF\\sim\\triangle BAE$, deci $FD=2$ cm, $CF=6$ cm și $BF=10$ cm' },
        { pts: 3, text: 'Determinați lungimea segmentului $FG$.', ans: '$EF=2\\sqrt{5}$ cm, $\\triangle EFD\\sim\\triangle GFC$, deci $FG=6\\sqrt{5}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul dreptunghic $ABCD$, cu $AB\\parallel CD$, $AB>CD$, $\\sphericalangle A=\\sphericalangle D=90^\\circ$, $\\dfrac{CD}{AB}=\\dfrac{1}{4}$ și $AC\\perp BD$, cu $AC\\cap BD=\\{O\\}$, iar $AD=18$ cm.',
      parts: [
        { pts: 2, text: 'Determinați lungimile bazelor $CD$ și $AB$.', ans: '$AD^2=CD\\cdot AB$, deci $CD=9$ cm și $AB=36$ cm' },
        { pts: 3, text: 'Calculați aria trapezului $ABCD$.', ans: '$405\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă triunghiulară regulată $VABC$ cu baza $ABC$, un triunghi echilateral cu latura $AB=12$ cm și muchia laterală $VA=4\\sqrt{6}$ cm. Fie $M$ un punct situat pe muchia $VA$, astfel încât lungimea segmentului $BM$ să fie minimă.',
      parts: [
        { pts: 2, text: 'Demonstrați că muchia $VA$ este perpendiculară pe planul $(MBC)$.', ans: '$BM\\perp VA$ și $CM\\perp VA$ ($\\triangle MAB\\equiv\\triangle MAC$), deci $VA\\perp(MBC)$' },
        { pts: 3, text: 'Calculați aria triunghiului $MBC$.', ans: '$a_p=2\\sqrt{15}$ cm, $BM=3\\sqrt{10}$ cm, $MD=3\\sqrt{6}$ cm, aria este $18\\sqrt{6}\\text{ cm}^2$' },
      ],
      fig: fig18,
    },
  ],
}
