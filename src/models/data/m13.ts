// Testul 4 (Modele de teste pentru Evaluarea Națională, Matematică. Clasa a VIII-a, pages 183–185; answers on 243–244)
import type { EnModel } from '../types'
import { along3, foot, mid, mid3, plane, solid, type Pt } from '../figure'
import { BOX, box } from './shapes'

const s2 = Math.sqrt(2), s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 2], B: [6, 2], C: [1, 0], D: [7, 0], O: [3.5, 1] }, 160, { s: 'A-B C-D A-D B-C', l: { O: 'n' } })

// II.2: x = 37, so A = 45°, B = 88°, C = 47°
const A8: Pt = [0.0361, 1.0336], B8: Pt = [0, 0], C8: Pt = [1, 0]
const fig8 = plane(
  { A: A8, B: B8, C: C8, E: [-0.35, 0], D: [1.289, -0.31], F: [0.047, 1.344] },
  170,
  { s: 'E-C A-B-F A-D', t: [{ at: [0.16, 1.02], s: '3x°+24°', anchor: 'start', size: 11 }, { at: [-0.06, 0.1], s: '2x°+18°', anchor: 'end', size: 11 }, { at: [1.13, -0.16], s: '4x°−15°', anchor: 'start', size: 11 }] },
)

const A9: Pt = [9, 9 * s3], B9: Pt = [0, 0], C9: Pt = [36, 0], M9 = mid(B9, C9)
const fig9 = plane({ A: A9, B: B9, C: C9, M: M9, D: foot(M9, A9, C9) }, 170, { s: 'A-B-C-A A-M M-D', ra: ['BAC', 'MDC'], t: [{ at: [15.5, 1.5], s: '60°', size: 11 }] })

const fig10 = plane({ A: [0, 0], B: [25, 0], C: [34, 12], D: [9, 12] }, 170, { s: 'A-B-C-D-A B-D', ra: ['ADB'] })

const fig11 = plane({ A: [0, 0], B: [50, 0], C: [50, 24], D: [0, 24], E: [32, 24] }, 170, { s: 'A-B-C-D-A A-E-B', ra: ['AEB'] })

const fig16 = plane({ A: [0, 24], B: [18, 24], C: [32, 0], D: [0, 0], E: [-18, 0] }, 180, { s: 'A-B-C-E A-D A-C B-D A-E', ra: ['ADC'] })

const fig17 = plane({ A: [3 * s3, 9], B: [9 * s3, 9], C: [12 * s3, 0], D: [0, 0] }, 170, { s: 'A-B-C-D-A A-C', t: [{ at: [9 * s3 - 2.6, 8.2], s: '120°', size: 11 }] })

const p18 = box(8 * s2, 8 * s2, 8 * s3)
const fig18 = solid({ ...p18, O: mid3(p18.A, p18.C), M: along3(p18.A, p18["A'"], 1 / s3) }, BOX, 150, { seg: "A-C B-D O-C' C'-B M-O M-B M-D", l: { O: 's', M: 'w' } })

export const M13: EnModel = {
  id: 'en-13',
  title: 'Testul 4',
  source: 'Modele de teste pentru Evaluarea Națională (Matematică. Clasa a VIII-a), pag. 183–185',
  items: [
    { text: 'Rezultatul calculului $[-12+(-24):(-6)]:(-2)$ este egal cu:', choices: ['$-6$', '$-4$', '$2$', '$4$'], ans: 3 },
    {
      text: 'În tabelul de mai jos este prezentată situația mediilor generale ale elevilor unei clase a VIII-a, la sfârșitul semestrului I.\n\n| Media | 6–6,99 | 7–7,99 | 8–8,99 | 9–9,99 | 10 |\n|---|---|---|---|---|---|\n| Numărul de elevi | 4 | 6 | 8 | 9 | 3 |\n\nNumărul elevilor care au obținut medii mai mari sau egale cu $8$ este egal cu:',
      choices: ['$18$', '$19$', '$20$', '$21$'], ans: 2,
    },
    { text: 'Ștefan vrea să-și cumpere un telefon performant. El are $80\\%$ din suma necesară, adică $3200$ lei. Prețul telefonului este:', choices: ['$3600$ lei', '$3800$ lei', '$4000$ lei', '$4200$ lei'], ans: 2 },
    { text: 'Dintre următoarele șiruri de numere, cel care nu conține numărul $42$ este:', choices: ['$2,\\ 4,\\ 6,\\ 8,\\ 10,\\ \\ldots$', '$4,\\ 8,\\ 12,\\ 16,\\ 20,\\ \\ldots$', '$3,\\ 6,\\ 9,\\ 12,\\ 15,\\ \\ldots$', '$6,\\ 12,\\ 18,\\ 24,\\ 30,\\ \\ldots$'], ans: 1 },
    {
      text: 'Patru elevi au calculat media aritmetică a numerelor $a=\\sqrt{18}-\\sqrt{50}+\\sqrt{128}-\\sqrt{8}$ și $b=\\sqrt{32}-\\sqrt{72}+\\sqrt{98}-\\sqrt{18}$. Rezultatele obținute sunt trecute în tabelul alăturat.\n\n| Corina | Pavel | Alina | Vlad |\n|---|---|---|---|\n| $\\sqrt{2}$ | $2\\sqrt{2}$ | $3\\sqrt{2}$ | $4\\sqrt{2}$ |\n\nDintre cei patru elevi, cel care a obținut rezultatul corect este:',
      choices: ['Corina', 'Pavel', 'Alina', 'Vlad'], ans: 2,
    },
    { text: 'În luna februarie a unui an, temperatura minimă înregistrată a fost de $-15^\\circ$C, iar temperatura maximă înregistrată a fost de $+10^\\circ$C. Cosmin afirmă că diferența dintre temperatura maximă și cea minimă înregistrate a fost de $25^\\circ$C. Afirmația lui Cosmin este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele $A$, $B$, $C$, $D$, astfel încât $AB\\parallel CD$, $AB=CD$ și $AD\\cap BC=\\{O\\}$. Simetricul punctului $A$ față de punctul $O$ este:',
      choices: ['$B$', '$C$', '$D$', '$A$'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul $ABC$, în care $\\sphericalangle ABE=2x^\\circ+18^\\circ$, $\\sphericalangle BCD=4x^\\circ-15^\\circ$, iar $\\sphericalangle CAF=3x^\\circ+24^\\circ$. Valoarea lui $x$ este egală cu:',
      choices: ['$35$', '$36$', '$37$', '$38$'], ans: 2, fig: fig8,
    },
    {
      text: 'Figura alăturată reprezintă schița unui traseu turistic, în care punctele $A$, $B$ și $C$ marchează pozițiile a trei puncte de observație din zonă. Triunghiul $ABC$ este dreptunghic cu măsura unghiului $A$ de $90^\\circ$. Această zonă este străbătută de o șosea reprezentată de dreapta $AM$, unde $M$ este mijlocul laturii $BC$. Dacă măsura unghiului $AMB$ este $60^\\circ$ și $BC=36$ km, atunci distanța de la punctul $M$ la dreapta de acces $AC$ ($MD\\perp AC$) este egală cu:',
      choices: ['$8$ km', '$9$ km', '$10$ km', '$12$ km'], ans: 1, fig: fig9,
    },
    {
      text: 'Figura alăturată reprezintă un paralelogram $ABCD$, cu $AB\\parallel CD$, $AD\\parallel BC$, $BD\\perp AD$, $AB=25$ cm și $BD=20$ cm. Perimetrul paralelogramului $ABCD$ este egal cu:',
      choices: ['$60$ cm', '$70$ cm', '$80$ cm', '$84$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$, în care $BC=24$ cm, $9DE=16EC$, $E\\in CD$, iar $\\sphericalangle AEB=90^\\circ$. Aria triunghiului $ABE$ este egală cu:',
      choices: ['$540\\text{ cm}^2$', '$560\\text{ cm}^2$', '$580\\text{ cm}^2$', '$600\\text{ cm}^2$'], ans: 3, fig: fig11,
    },
    {
      text: 'O firmă are un depozit de marfă în formă de paralelipiped dreptunghic, având dimensiunile $L=24$ m, $l=19{,}2$ m și înălțimea $h=3{,}84$ m. Numărul maxim de cutii în formă de cub cu latura de $48$ cm ce pot fi depozitate în acest depozit este egal cu:',
      choices: ['$14400$', '$15600$', '$16000$', '$16800$'], ans: 2,
    },

    {
      text: 'Un elev care participă la un test-grilă primește $30$ de întrebări. Pentru un răspuns corect, elevul primește $8$ puncte, iar pentru un răspuns greșit i se scad $5$ puncte. Elevul a obținut $162$ de puncte, răspunzând la toate întrebările.',
      parts: [
        { pts: 2, text: 'Este posibil ca elevul să fi dat $26$ de răspunsuri corecte? Justificați răspunsul.', ans: 'Nu: $c+g=30$ și $8c-5g=162$ dau $c=24$' },
        { pts: 3, text: 'Determinați numărul răspunsurilor greșite.', ans: '$g=6$' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{2x^2-x+2}{4x^2-1}-\\dfrac{x+1}{1-2x}-\\dfrac{x-1}{2x+1}\\right)\\cdot\\dfrac{2x^2-5x+2}{x^2-2x-8}$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-2,\\,-\\dfrac{1}{2},\\,\\dfrac{1}{2},\\,4\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arătați că $2x^2-5x+2=(x-2)(2x-1)$, pentru orice număr real $x$.', ans: '$2x^2-4x-x+2=2x(x-2)-(x-2)=(x-2)(2x-1)$' },
        { pts: 3, text: 'Determinați valorile întregi ale lui $n$, pentru care $E(n)\\in\\mathbb{Z}$.', ans: '$E(x)=\\dfrac{x-2}{x-4}$, deci $n-4\\mid 2$ și $n\\in\\{2,\\,3,\\,5,\\,6\\}$' },
      ],
    },
    {
      text: 'În reperul cartezian $xOy$ se consideră punctele $A(2,\\,1)$, $B(-1,\\,-8)$ și $C(-3,\\,-14)$.',
      parts: [
        { pts: 2, text: 'Determinați funcția liniară $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$, unde $a,b\\in\\mathbb{R}$, știind că punctele $A$ și $C$ sunt situate pe graficul funcției.', ans: '$f(x)=3x-5$' },
        { pts: 3, text: 'Demonstrați că punctele $A$, $B$ și $C$ sunt coliniare.', ans: '$f(-1)=-8$, deci $B\\in G_f$ și $A$, $B$, $C$ sunt coliniare' },
      ],
    },
    {
      text: 'În figura alăturată este reprezentat trapezul dreptunghic $ABCD$, cu $AB\\parallel CD$, $AB<CD$, având $\\sphericalangle A=\\sphericalangle D=90^\\circ$, diagonalele perpendiculare ($AC\\perp BD$), $AE\\parallel BD$, $E\\in CD$ și $AB=18$ cm, $CD=32$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrați că triunghiul $AEC$ este dreptunghic.', ans: '$AE\\parallel BD$ și $AC\\perp BD$, deci $AC\\perp AE$ și $\\sphericalangle EAC=90^\\circ$' },
        { pts: 3, text: 'Calculați aria trapezului $ABCD$.', ans: '$ED=AB$, $AD^2=DE\\cdot DC$, deci $AD=24$ cm și aria este $600\\text{ cm}^2$' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul isoscel $ABCD$, $AB\\parallel CD$, $AB<CD$, $AD=AB=BC=6\\sqrt{3}$ cm și $\\sphericalangle ABC=120^\\circ$.',
      parts: [
        { pts: 2, text: 'Demonstrați că $AC\\perp AD$.', ans: '$\\sphericalangle BCA=\\sphericalangle ACD=30^\\circ$ și $\\sphericalangle ADC=60^\\circ$, deci $\\sphericalangle DAC=90^\\circ$' },
        { pts: 3, text: 'Demonstrați că triunghiul $ACD$ are perimetrul mai mic decât $54$ cm.', ans: '$DC=12\\sqrt{3}$ cm, $AC=18$ cm, $\\mathcal{P}=18\\sqrt{3}+18<54\\Leftrightarrow\\sqrt{3}<2$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o prismă patrulateră regulată $ABCDA'B'C'D'$ cu $AB=8\\sqrt{2}$ cm și $AA'=8\\sqrt{3}$ cm. Pe muchia $AA'$ se ia punctul $M$, astfel încât $AM=8$ cm, iar $AC\\cap BD=\\{O\\}$.",
      parts: [
        { pts: 2, text: "Calculați sinusul unghiului format de dreapta $OC'$ cu planul $(B'BC)$.", ans: "$OC'=16$ cm, $d(O,(B'BC))=4\\sqrt{2}$ cm, deci $\\sin=\\dfrac{\\sqrt{2}}{4}$" },
        { pts: 3, text: "Calculați măsura unghiului format de planele $(MBD)$ și $(C'BD)$.", ans: "$\\sphericalangle MOC'=180^\\circ-(45^\\circ+60^\\circ)=75^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
