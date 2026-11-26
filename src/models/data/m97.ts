// Testul 66 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 211–213; every answer here is computed and checked with the book's answers, pp. 292–293).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, meet, plane, solid } from '../figure'
import { graph, pol, PRISM3, prism3 } from './shapes'

// the brothers and sisters: 1 frate 50%, 2 frați 30%, 3 sau mai mulți 10%, niciun frate 10%
const fig2 = plane({ O: [0, 0], X: pol(90, 5), Y: pol(126, 5), Z: pol(162, 5), W: pol(270, 5), K: [-12.5, 6.5] }, 150, {
  s: 'O-X O-Y O-Z O-W', c: [{ at: 'O', r: 5 }], l: { O: '', X: '', Y: '', Z: '', W: '', K: '' },
  t: [
    { at: pol(0, 2.6), s: '1 frate', anchor: 'middle', size: 9 }, { at: [pol(0, 2.6)[0], -1], s: '50%', anchor: 'middle', size: 9 },
    { at: pol(216, 2.8), s: '2 frați', anchor: 'middle', size: 9 }, { at: [pol(216, 2.8)[0], pol(216, 2.8)[1] - 1], s: '30%', anchor: 'middle', size: 9 },
    { at: pol(108, 6.3), s: 'niciun frate 10%', anchor: 'middle', size: 8 },
    { at: pol(144, 6), s: '3 sau mai mulți frați 10%', anchor: 'end', size: 8 },
  ],
})

const fig7 = plane({ A: [0, 0], M: [2, 0], B: [4, 0], N: [5.5, 0], C: [7, 0] }, 170, { s: 'A-C', dot: 'A M B N C', l: { A: 'w', M: 'n', B: 's', N: 'n', C: 'e' } })
const D8 = pol(31, 5), B8 = pol(-31, 5)
const fig8 = plane({ A: [0, 0], D: D8, B: B8, C: [D8[0] + B8[0], 0] }, 130, {
  s: 'A-B-C-D-A B-D', ang: ['BAD'], t: [{ at: [1.4, -0.3], s: '62°', anchor: 'start', size: 10 }],
})
const fig9 = plane({ A: [0, 0], B: [8, 0], C: [0, 6], M: [4, 0], N: [0, 3] }, 120, { s: 'A-B-C-A M-N', ra: ['BAC'] })
const fig10 = plane({ A: [0, 0], B: [20, 0], C: [20, 8], D: [0, 8] }, 120, { s: 'A-B-C-D-A' })
const fig11 = plane({ O: [0, 0], A: [-12, 5], B: [12, 5] }, 100, { s: 'A-B', c: [{ at: 'O', r: 13 }], dot: 'O', l: { O: 's' } })
const p12: Record<string, P3> = { P: [0, 0, 0], O: [4, 0, 0], L: [4, 4, 0], I: [0, 4, 0], E: [0, 0, 4], D: [4, 0, 4], R: [4, 4, 4], U: [0, 4, 4] }
const fig12 = solid(p12, 'P-O-L-I E-D-R-U P-O-D-E O-L-R-D L-I-U-R I-P-E-U', 110)

const fig15 = graph({}, 120, [-3, 4], [-3, 4])
// the hexagon in the disc: the six circular segments between them are hatched
const H16: Record<string, Pt> = Object.fromEntries([0, 1, 2, 3, 4, 5].map((k) => [`h${k}`, pol(60 * k, 6)]))
const f16 = plane({ O: [0, 0], ...H16 }, 110, {
  s: 'h0-h1-h2-h3-h4-h5-h0', c: [{ at: 'O', r: 6 }], l: Object.fromEntries(['O', ...Object.keys(H16)].map((k) => [k, ''])),
})
const r16 = f16.p.h0[0] - f16.p.O[0]
const fig16 = {
  ...f16,
  path: [0, 1, 2, 3, 4, 5].map((k) => {
    const a = f16.p[`h${k}`], b = f16.p[`h${(k + 1) % 6}`]
    return { d: `M${a[0]} ${a[1]} A${r16} ${r16} 0 0 0 ${b[0]} ${b[1]} Z`, hatch: true }
  }),
}
const A17: Pt = [0, 8], B17: Pt = [-6, 0], C17: Pt = [6, 0], D17: Pt = [0, 0], E17 = foot(B17, A17, C17)
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, E: E17, H: meet(A17, D17, B17, E17) }, 120, { s: 'A-B-C-A A-D B-E', ra: ['ADC', 'BEC'] })
// drawn lower than the real 63 cm, as in the book; M at 18/63 of BB′
const p18 = prism3(24, 24)
const fig18 = solid({ ...p18, M: [12, 0, 24 * 18 / 63] }, PRISM3, 120, { seg: "A-M M-C'", dot: 'M' })

export const M97: EnModel = {
  id: 'en-97',
  title: 'Paralela 45, Testul 66',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 211–213',
  items: [
    { text: 'Cel mai mare divizor propriu al numărului $18$ este:', choices: ['$2$', '$3$', '$9$', '$18$'], ans: 2 },
    {
      text: 'În diagrama alăturată sunt prezentate datele obținute de către diriginte în urma chestionării celor $30$ de elevi ai clasei a V-a A, cu privire la numărul fraților. Numărul elevilor care sunt singuri la părinți este:',
      choices: ['$3$', '$6$', '$15$', '$9$'], ans: 0, fig: fig2,
    },
    { text: 'Numărul numerelor întregi din intervalul $[-3,\\,3]$ este:', choices: ['$3$', '$4$', '$6$', '$7$'], ans: 3 },
    {
      text: 'Se consideră mulțimea $A=\\{15;\\,6\\sqrt{6};\\,10\\sqrt{2};\\,4\\sqrt{13};\\,\\sqrt{242}\\}$. Suma dintre cel mai mic și cel mai mare dintre elementele mulțimii $A$ este:',
      choices: ['$5(3+2\\sqrt{2})$', '$21\\sqrt{2}$', '$15+4\\sqrt{13}$', '$2(3\\sqrt{6}+2\\sqrt{13})$'], ans: 1,
    },
    { text: 'Fie $x_1$ și $x_2$ soluțiile reale ale ecuației $x^2+2x-1=0$. Valoarea numărului $|x_1-x_2|$ este:', choices: ['$2\\sqrt{2}$', '$2$', '$2+2\\sqrt{2}$', '$2\\sqrt{2}-2$'], ans: 0 },
    { text: 'Referitor la numerele $x=2-\\sqrt{3}$ și $y=2\\sqrt{3}-3$, Alin afirmă că $x$ este mai mare decât $y$. Afirmația lui Alin este:', choices: ['adevărată', 'falsă'], ans: 1 },

    {
      text: 'În figura alăturată, punctul $B$ aparține segmentului $AC$, iar $M$ și $N$ sunt mijloacele segmentelor $AB$, respectiv $BC$. Se știe că $AB=4$ cm și $NC=3$ cm. Lungimea segmentului $MN$ este:',
      choices: ['$7$ cm', '$6$ cm', '$5$ cm', '$4$ cm'], ans: 2, fig: fig7,
    },
    { text: 'Rombul $ABCD$ din figura alăturată are $\\sphericalangle A=62^\\circ$. Măsura unghiului $DBC$ este:', choices: ['$59^\\circ$', '$61^\\circ$', '$62^\\circ$', '$118^\\circ$'], ans: 0, fig: fig8 },
    {
      text: 'Punctele $M$ și $N$ sunt mijloacele catetelor $AB$ și $AC$ ale triunghiului dreptunghic $ABC$. Se știe că $MN=5$ cm, iar perimetrul triunghiului $AMN$ este $12$ cm. Perimetrul patrulaterului $BCNM$ este:',
      choices: ['$17$ cm', '$22$ cm', '$27$ cm', '$30$ cm'], ans: 1, fig: fig9,
    },
    {
      text: 'Un teren agricol are forma dreptunghiului $ABCD$, cu $AB=200$ m, $AD=80$ m și este cultivat cu legume. Într-un an, cheltuielile cu irigarea unui hectar de culturi se ridică la $50000$ de lei. Costurile irigării acestui teren într-un an sunt:',
      choices: ['$800$ de lei', '$8000$ de lei', '$80000$ de lei', '$20000$ de lei'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc de centru $O$ în care o coardă $AB$, având lungimea de $24$ cm, este situată la $5$ cm de centrul cercului. Aria cercului este:',
      choices: ['$144\\pi\\text{ cm}^2$', '$169\\pi\\text{ cm}^2$', '$12\\pi\\text{ cm}^2$', '$25\\pi\\text{ cm}^2$'], ans: 1, fig: fig11,
    },
    { text: 'În figura alăturată este reprezentat cubul $POLIEDRU$. Măsura unghiului dintre dreptele $ER$ și $DL$ este:', choices: ['$30^\\circ$', '$45^\\circ$', '$90^\\circ$', '$60^\\circ$'], ans: 3, fig: fig12 },

    {
      text: 'Trei copii se joacă în parc. Media vârstelor celor trei este $12$ ani. La un moment dat, vine și frățiorul unuia dintre ei și, acum, media vârstelor celor patru este $10$ ani.',
      parts: [
        { pts: 2, text: 'Calculează suma vârstelor primilor trei copii.', ans: '$3\\cdot12=36$ de ani' },
        { pts: 3, text: 'Arată că vârsta frățiorului venit este $4$ ani.', ans: 'Suma vârstelor celor patru este $40$ de ani, deci frățiorul are $40-36=4$ ani' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{(x^2+2x+3)^2-5(x^2+2x+3)+6}{x^3-x}:(x+1)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $a^2-5a+6=(a-2)(a-3)$, pentru orice număr real $a$.', ans: '$(a-2)(a-3)=a^2-3a-2a+6=a^2-5a+6$' },
        { pts: 3, text: 'Arată că $E(x)=\\dfrac{x+2}{x-1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$.', ans: 'Numărătorul este $(x^2+2x+1)(x^2+2x)=(x+1)^2x(x+2)$, deci $E(x)=\\dfrac{(x+1)^2x(x+2)}{x(x-1)(x+1)}:(x+1)=\\dfrac{x+2}{x-1}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+1$.',
      parts: [
        { pts: 2, text: 'Reprezintă grafic funcția $f$ în sistemul de axe ortogonale $xOy$ alăturat.', ans: 'Dreapta prin $A(0,\\,1)$ și $B(1,\\,3)$' },
        { pts: 3, text: 'Determină numărul real $a$, știind că punctul $A(a-1,\\,a+1)$ este situat pe reprezentarea grafică a funcției $f$.', ans: '$2(a-1)+1=a+1$, deci $a=2$' },
      ],
      fig: fig15,
    },
    {
      text: 'Dintr-un disc de carton cu diametrul de $12$ cm se decupează un hexagon regulat, cu pierdere minimă de material, ca în figura alăturată (prin urmare, vârfurile hexagonului se vor afla pe frontiera discului).',
      parts: [
        { pts: 2, text: 'Arată că latura hexagonului are lungimea de $6$ cm.', ans: 'Hexagonul este înscris în cercul cu raza $6$ cm, iar latura hexagonului regulat este egală cu raza: $6$ cm' },
        { pts: 3, text: 'Află aria suprafeței de carton care se elimină în urma decupării.', ans: '$36\\pi-6\\cdot\\dfrac{36\\sqrt{3}}{4}=36\\pi-54\\sqrt{3}=18(2\\pi-3\\sqrt{3})\\text{ cm}^2$' },
      ],
      fig: fig16,
    },
    {
      text: 'Se consideră triunghiul $ABC$ cu $AB=AC=10$ cm și $BC=12$ cm, în care construim înălțimile $AD$ și $BE$, ca în figura alăturată. Notăm $\\{H\\}=AD\\cap BE$.',
      parts: [
        { pts: 2, text: 'Demonstrează că unghiurile $DAC$ și $EBC$ sunt congruente.', ans: 'Ambele unghiuri au măsura egală cu $90^\\circ-\\sphericalangle C$' },
        { pts: 3, text: 'Arată că segmentul $HE$ are lungimea $2{,}1$ cm.', ans: '$AD=8$ cm, $BE=\\dfrac{BC\\cdot AD}{AC}=9{,}6$ cm, $AE=\\sqrt{AB^2-BE^2}=2{,}8$ cm; $\\triangle AEH\\sim\\triangle ADC$: $\\dfrac{AE}{AD}=\\dfrac{EH}{DC}$, deci $HE=\\dfrac{2{,}8\\cdot6}{8}=2{,}1$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "Un vas are formă de prismă triunghiulară regulată $ABCA'B'C'$, cu latura bazei $AB=24$ cm și muchia laterală $AA'=63$ cm, ca în figura alăturată.",
      parts: [
        { pts: 2, text: 'Stabilește dacă în vas încap $20\\ \\ell$ de apă.', ans: "$V=\\dfrac{24^2\\sqrt{3}}{4}\\cdot63=9072\\sqrt{3}\\text{ cm}^3=9{,}072\\sqrt{3}\\ \\ell$, iar $9{,}072\\sqrt{3}<10\\cdot2=20$: nu încap" },
        { pts: 3, text: "O furnică merge pe suprafața laterală a vasului, pe traseul $A$-$M$-$C'$, unde $M$ este punct al muchiei $BB'$, astfel încât $BM=18$ cm. Determină lungimea drumului parcurs de furnică.", ans: "$AM=\\sqrt{24^2+18^2}=30$ cm, $MC'=\\sqrt{24^2+45^2}=51$ cm, deci furnica merge $81$ cm" },
      ],
      fig: fig18,
    },
  ],
}
