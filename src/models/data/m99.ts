// Testul 68 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 215–217; every answer here is computed and checked with the book's answers, p. 293).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { meet, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s2 = Math.SQRT2, s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], P: [3, 0], Q: [5, 0], B: [6, 0], C: [10, 0] }, 170, { s: 'A-C', dot: 'A P Q B C', l: { A: 'n', P: 'n', Q: 'n', B: 'n', C: 'n' } })
const fig8 = plane({ A: [-4, 0], O: [0, 0], B: [4, 0], M: pol(70, 4), N: pol(250, 4, [4, 0]) }, 120, { s: 'A-B O-M B-N', dot: 'O', l: { O: 's' } })
const fig9 = plane({ N: [0, 0], P: [8, 0], M: [2, 2 * s3], R: [4, 0] }, 130, { s: 'M-N-P-M M-R', ra: ['NMP'] })
const fig10 = plane({ A: [0, 0], B: [12, 0], C: [18, 6], D: [6, 6] }, 130, { s: 'A-B-C-D-A B-D', ra: ['DBC'] })
const fig11 = plane({ O: [0, 0], A: [-6.5, 0] }, 100, { c: [{ at: 'O', r: 6.5 }], dot: 'A', l: { O: '', A: 'w' } })
// the cube cut into eight small cubes: the cuts on the three faces that show
const p12: Record<string, P3> = {
  ...box(2, 2, 2), F1: [1, 0, 0], F2: [1, 0, 2], F3: [0, 0, 1], F4: [2, 0, 1], T1: [1, 2, 2], T3: [0, 1, 2], T4: [2, 1, 2], R1: [2, 2, 1], R2: [2, 1, 0],
}
const fig12 = solid(p12, BOX, 110, {
  seg: 'F1-F2 F3-F4 F2-T1 T3-T4 F4-R1 R2-T4', l: Object.fromEntries(Object.keys(p12).map((k) => [k, ''])),
})

const fig15 = graph({}, 120, [-2, 5], [-1, 6])
const fig16 = plane({ A: [0, 0], B: [10, 0], C: [10, 10], D: [0, 10], O: [5, 5], M: [5 - 5 / s2, 5 - 5 / s2], N: [5 + 5 / s2, 5 + 5 / s2] }, 110, {
  s: 'A-B-C-D-A A-C', c: [{ at: 'O', r: 5 }], dot: 'O M N', l: { M: 'e', N: 'w', O: 'nw' },
})
const B17: Pt = [0, 0], A17: Pt = [3, 3 * s3], C17: Pt = [12, 0]
const fig17 = plane({ A: A17, B: B17, C: C17, M: [6, 0], D: meet(B17, pol(30), A17, C17) }, 140, { s: 'A-B-C-A A-M B-D' })
const fig18 = solid({ ...box(10, 10, 10), M: [10, 5, 0], "N'": [0, 5, 10] }, BOX, 120, { seg: "A-M C'-N'", dot: "M N'" })

export const M99: EnModel = {
  id: 'en-99',
  title: 'Paralela 45, Testul 68',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 215–217',
  items: [
    { text: 'Dublul jumătății numărului $a=305$ este:', choices: ['$305$', '$610$', '$152{,}5$', '$1220$'], ans: 0 },
    {
      text: 'Fiecare elev din clasa a VIII-a B participă numai la unul dintre următoarele cercuri: matematică (M), literatură (L), sport (S), istorie (I). Tabelul următor arată numărul participanților la fiecare cerc.\n\n| Cercul | M | L | S | I |\n|---|---|---|---|---|\n| Numărul de elevi | $8$ | $5$ | $8$ | $4$ |\n\nNumărul elevilor care participă la cercul de matematică sau la cel de literatură este:',
      choices: ['$8$', '$5$', '$13$', '$12$'], ans: 2,
    },
    { text: 'Fracția $2{,}(7)$ se poate scrie sub formă de fracție ordinară astfel:', choices: ['$\\dfrac{25}{10}$', '$\\dfrac{25}{9}$', '$\\dfrac{27}{10}$', '$3$'], ans: 1 },
    { text: 'Mulțimea soluțiilor inecuației $3-2x\\leq1$, $x\\in\\mathbb{R}$, este:', choices: ['$(-\\infty,\\,-1]$', '$(-\\infty,\\,1]$', '$[-1,\\,\\infty)$', '$[1,\\,\\infty)$'], ans: 3 },
    { text: 'Numărul $\\sqrt{2n}$, unde $n\\in\\{1,\\,2,\\,\\ldots,\\,50\\}$, este rațional. Numărul de valori convenabile ale lui $n$ este:', choices: ['$2$', '$4$', '$5$', '$10$'], ans: 2 },
    { text: 'Cosette clipește o dată pe secundă. Ea spune că, dacă va sta trează $24$ de ore, va clipi de cel puțin $90000$ de ori. Afirmația Cosettei este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, iar $AB>BC$. Dacă punctul $P$ este mijlocul segmentului $AB$, punctul $Q$ este mijlocul segmentului $AC$, $PQ=2$ cm și $QB=1$ cm, atunci lungimea segmentului $AC$ este egală cu:',
      choices: ['$4$ cm', '$6$ cm', '$5$ cm', '$10$ cm'], ans: 3, fig: fig7,
    },
    {
      text: 'În figura alăturată, punctele $A$, $O$ și $B$ sunt coliniare, iar semidreptele $OM$ și $BN$ sunt paralele. Dacă măsura unghiului $AOM$ este egală cu $110^\\circ$, atunci măsura unghiului $ABN$ este egală cu:',
      choices: ['$90^\\circ$', '$40^\\circ$', '$110^\\circ$', '$70^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $MNP$ în care punctul $R$ este mijlocul ipotenuzei $NP$. Dacă segmentele $MN$ și $MR$ sunt congruente, iar $MP=4\\sqrt{3}$ cm, atunci lungimea ipotenuzei este:',
      choices: ['$2$ cm', '$4$ cm', '$8$ cm', '$8\\sqrt{3}$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat paralelogramul $ABCD$, cu $AD=BD=6\\sqrt{2}$ cm și $\\sphericalangle DBC=90^\\circ$. Lungimea laturii $CD$ este egală cu:',
      choices: ['$6$ cm', '$6\\sqrt{2}$ cm', '$12$ cm', '$12\\sqrt{2}$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentată o pistă circulară cu raza de $65$ m. Un vehicul pleacă din $A$. Distanța maximă dintre punctul în care se află vehiculul și punctul de plecare este:',
      choices: ['$100$ m', '$65\\pi$ m', '$130\\pi$ m', '$130$ m'], ans: 3, fig: fig11,
    },
    {
      text: 'Un cub din lemn are suma ariilor tuturor fețelor egală cu $24\\text{ cm}^2$. Tăiem cubul în $8$ cubulețe identice, având latura egală cu jumătate din latura cubului inițial. Suma ariilor tuturor fețelor cubulețelor obținute este:',
      choices: ['$24\\text{ cm}^2$', '$48\\text{ cm}^2$', '$64\\text{ cm}^2$', '$72\\text{ cm}^2$'], ans: 1, fig: fig12,
    },

    {
      text: 'Doi muncitori, la fel de harnici, culeg strugurii dintr-o vie. Primul lucrează $5$ zile, iar al doilea $3$ zile și primesc, împreună, $960$ de lei pentru munca lor.',
      parts: [
        { pts: 2, text: 'Ce procent din suprafața viei culege primul muncitor?', ans: '$\\dfrac{5}{8}=62{,}5\\%$' },
        { pts: 3, text: 'Ce sumă i se cuvine primului muncitor?', ans: '$\\dfrac{5}{8}\\cdot960=600$ de lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{(x-2)^3-x+2}{x(x-4)+3}$, unde $x\\in\\mathbb{R}\\setminus\\{1,\\,3\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $(x-2)^3-x+2=(x-1)(x-2)(x-3)$, pentru orice $x\\in\\mathbb{R}$.', ans: '$(x-2)^3-(x-2)=(x-2)\\big((x-2)^2-1\\big)=(x-2)(x-3)(x-1)$' },
        { pts: 3, text: 'Demonstrează că $E(n)$ este număr întreg, oricare ar fi numărul întreg $n$, cu $n\\neq1$ și $n\\neq3$.', ans: '$x(x-4)+3=(x-1)(x-3)$, deci $E(n)=n-2\\in\\mathbb{Z}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-x+3$.',
      parts: [
        { pts: 2, text: 'Reprezintă grafic funcția $f$ în sistemul de axe ortogonale $xOy$ alăturat.', ans: 'Dreapta prin $(0,\\,3)$ și $(3,\\,0)$' },
        { pts: 3, text: 'Determină numărul real $a$, știind că punctul $A(a^2,\\,2a)$ este situat pe reprezentarea grafică a funcției $f$.', ans: '$-a^2+3=2a$, adică $(a+3)(a-1)=0$, deci $a\\in\\{-3,\\,1\\}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un pătrat din carton cu diagonala $AC=10\\sqrt{2}$ cm. Din acest pătrat se decupează un disc de arie maximă, mărginit de cercul $\\mathscr{C}$. Fie $M$ și $N$ intersecțiile dintre $AC$ și cercul $\\mathscr{C}$, cu $M$ între $A$ și $O$.',
      parts: [
        { pts: 2, text: 'Află lungimea conturului discului.', ans: 'Latura pătratului este $10$ cm, deci raza discului este $5$ cm și lungimea cercului este $10\\pi$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $AM$.', ans: '$AM=AO-OM=5\\sqrt{2}-5=5(\\sqrt{2}-1)$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, $ABC$ este un triunghi dreptunghic în $A$, în care mediana $AM$ și bisectoarea $BD$ sunt perpendiculare. Segmentul $DM$ are lungimea $2\\sqrt{3}$ cm.',
      parts: [
        { pts: 2, text: 'Demonstrează că triunghiul $ABM$ este echilateral.', ans: '$AM$ este mediana ipotenuzei, deci $AM=BM$; în $\\triangle BAM$, $BD$ este bisectoare și înălțime, deci $AB=BM$: triunghiul are toate laturile egale' },
        { pts: 3, text: 'Calculează aria triunghiului $ABC$.', ans: '$\\triangle ABD\\equiv\\triangle MBD$ (LUL), deci $\\sphericalangle BMD=90^\\circ$; $BM=\\dfrac{DM}{\\operatorname{tg}30^\\circ}=6$ cm, $AB=6$, $BC=12$, $AC=6\\sqrt{3}$ cm, deci $\\mathcal{A}_{ABC}=18\\sqrt{3}\\text{ cm}^2$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată, $ABCDA'B'C'D'$ este un cub cu muchia de $10$ cm, iar $M$ și $N'$ sunt mijloacele muchiilor $BC$, respectiv $A'D'$.",
      parts: [
        { pts: 2, text: "Demonstrează că planele $(A'AM)$ și $(CC'N')$ sunt paralele.", ans: "$AM\\parallel C'N'$ și $AA'\\parallel CC'$, deci $(A'AM)\\parallel(CC'N')$" },
        { pts: 3, text: "Arată că distanța dintre planele $(A'AM)$ și $(CC'N')$ este $2\\sqrt{5}$ cm.", ans: "Fie $N$ mijlocul lui $AD$, $N\\in(CC'N')$, și $NP\\perp AM$, $P\\in AM$; atunci $NP\\perp(A'AM)$ și distanța este $NP=\\dfrac{AN\\cdot MN}{AM}=\\dfrac{5\\cdot10}{5\\sqrt{5}}=2\\sqrt{5}$ cm" },
      ],
      fig: fig18,
    },
  ],
}
