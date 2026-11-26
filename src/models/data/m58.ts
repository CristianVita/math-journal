// Testul 27 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 126–128; every answer here is computed and checked with the book's answers, pp. 279–280).
import type { EnModel } from '../types'
import { mid3, plane, solid } from '../figure'
import { box, BOX, graph, pol, PRISM3, prism3 } from './shapes'

const CUBE: Record<string, ''> = { A: '', B: '', C: '', D: '', "A'": '', "B'": '', "C'": '', "D'": '' }

const fig7 = plane({ A: [0, 0], B: [4, 0], N: [10, 0], M: [12, 0], C: [20, 0] }, 170, { s: 'A-C', dot: 'A B N M C', l: { A: 'n', B: 'n', N: 'n', M: 'n', C: 'n' } })
const fig8 = plane({ O: [0, 0], A: pol(-27, 9), B: pol(27, 9), C: pol(153, 9), D: pol(207, 9), M: [9, 0] }, 120, { s: 'A-C B-D O-M', l: { O: 'n' } })
const fig9 = plane({ B: [0, 0], C: [30, 0], A: [3.51, 9.64], M: [15, 0] }, 130, { s: 'A-B-C-A A-M', dot: 'M', ra: ['BAC'] })
const fig10 = plane({ A: [0, 0], B: [25, 0], C: [25, 2.5], D: [0, 2.5], X: [30, 0] }, 170, {
  s: 'A-B-C-D-A', l: { A: '', B: '', C: '', D: '', X: '' }, t: [{ at: [12.5, 3.4], s: '100 m', size: 11 }, { at: [26, 0.9], s: '2 m', size: 11, anchor: 'start' }],
})
const fig11 = plane({ O: [0, 0], A: pol(200, 5), B: pol(60, 5), C: pol(0, 5) }, 100, { s: 'A-B-C-A O-B O-C', c: [{ at: 'O', r: 5 }], ang: ['BAC'], l: { O: 'w' } })
const fig12 = solid(box(10, 10, 10), BOX, 100, { l: CUBE })

const fig15 = graph({ A: [-1, -2], B: [5, 7] }, 110, [-2, 6], [-3, 8], { s: 'A-B', dot: 'A B', l: { A: 'w', B: 'w', O: 'nw' } })
const fig16 = plane({ A: [0, 0], B: [20, 0], C: [25, 5], D: [5, 5] }, 140, { s: 'A-B-C-D-A', ang: ['BAD'] })
const fig17 = plane({ O: [0, 0], A: pol(100, 5), D: pol(280, 5), B: pol(220, 5), C: pol(340, 5) }, 110, { s: 'A-B-C-A A-D B-D', c: [{ at: 'O', r: 5 }], dot: 'O', l: { O: 'e' } })
const p18 = prism3(6, 3)
const fig18 = solid({ ...p18, M: mid3(p18.B, p18.C) }, PRISM3, 120, { seg: "A-M M-B' M-C'", dot: 'M' }, 0.4)

export const M58: EnModel = {
  id: 'en-58',
  title: 'Paralela 45, Testul 27',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 126–128',
  items: [
    { text: 'Cel mai mare număr natural de forma $\\overline{3ab}$ divizibil cu $5$ și cu $9$ este:', choices: ['$315$', '$330$', '$945$', '$360$'], ans: 3 },
    {
      text: 'Mai jos este prezentat tabelul unei dependențe funcționale.\n\n| $x$ | $0$ | $1$ | $2$ | $\\ldots$ | $50$ |\n|---|---|---|---|---|---|\n| $y=\\dfrac{x}{14}$ | $0$ | $\\dfrac{1}{14}$ | $\\dfrac{2}{14}$ | $\\ldots$ | $\\dfrac{50}{14}$ |\n\nNumărul valorilor lui $x$ pentru care $y$ aparține mulțimii $\\mathbb{N}$ este:',
      choices: ['$1$', '$2$', '$3$', '$4$'], ans: 3,
    },
    { text: 'Fie $A=[-7,\\,7)$. Suma numerelor întregi din intervalul $A$ este:', choices: ['$-7$', '$-6$', '$0$', '$21$'], ans: 0 },
    { text: 'Dacă $12$ caiete de același fel costă $66$ de lei, atunci $16$ caiete ca acestea costă:', choices: ['$77$ de lei', '$88$ de lei', '$90$ de lei', '$99$ de lei'], ans: 1 },
    { text: 'Numărul $a=\\dfrac{1}{1-\\sqrt{2}}-\\dfrac{7}{3-\\sqrt{2}}+\\sqrt{8}$ este egal cu:', choices: ['$-\\sqrt{2}$', '$-6$', '$-4$', '$-2$'], ans: 2 },
    { text: 'Dana s-a născut miercuri, $22.07.2020$. Mama Danei afirmă că aceasta va împlini vârsta de $493$ de zile într-o zi de sâmbătă. Afirmația mamei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$, în această ordine. Se știe că $M$ este mijlocul lui $BC$ și $N$ este mijlocul lui $AC$. Dacă $AM=12$ cm și $AN=10$ cm, atunci lungimea segmentului $AB$ este egală cu:',
      choices: ['$1$ cm', '$4$ cm', '$10$ cm', '$8$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiurile $AOB$ și $COD$ sunt opuse la vârf, iar $OM$ este bisectoarea unghiului $AOB$. Dacă $\\sphericalangle AOM=27^\\circ$, măsura unghiului $DOM$ este egală cu:',
      choices: ['$63^\\circ$', '$157^\\circ$', '$153^\\circ$', '$127^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată sunt reprezentate trei obiective turistice $A$, $B$ și $C$. Unghiul $BAC$ are măsura de $90^\\circ$, iar distanța dintre $B$ și $C$ este de $30$ km. Lungimea traseului $A$-$M$-$C$, $M$ fiind mijlocul lui $BC$, este:',
      choices: ['$30$ km', '$45$ km', '$50$ km', '$15$ km'], ans: 0, fig: fig9,
    },
    {
      text: 'O alee în formă de dreptunghi, lungă de $100$ m și lată de $2$ m, ca în figura alăturată, se pavează cu dale pătratice cu latura de $25$ cm. Numărul de dale folosite pentru pavarea aleii este:',
      choices: ['$400$', '$500$', '$600$', '$3200$'], ans: 3, fig: fig10,
    },
    {
      text: 'În figura alăturată, cercul $\\mathcal{C}(O,\\,R)$ este circumscris triunghiului $ABC$. Măsura unghiului $A$ este de $30^\\circ$, iar $BC=5$ cm. Perimetrul triunghiului $OBC$ este:',
      choices: ['$15$ cm', '$12\\sqrt{3}$ cm', '$20\\sqrt{2}$ cm', '$5\\sqrt{3}$ cm'], ans: 0, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentat un vas în formă de cub cu latura de $0{,}75$ m. În vas se toarnă $225$ litri de apă. Înălțimea la care se ridică apa este:',
      choices: ['$0{,}2$ m', '$0{,}8$ m', '$0{,}4$ m', '$0{,}75$ m'], ans: 2, fig: fig12,
    },

    {
      text: 'Numărul $\\overline{ab}$, cu $a$, $b$ cifre nenule, are proprietatea că $\\overline{ba}+8(a+b)=90$.',
      parts: [
        { pts: 2, text: 'Numărul $24$ verifică ipoteza problemei?', ans: 'Da: $42+8\\cdot6=90$' },
        { pts: 3, text: 'Câte numere $\\overline{ab}$ au proprietatea din enunțul problemei?', ans: '$10b+a+8a+8b=90$, deci $a+2b=10$: $\\overline{ab}\\in\\{24,\\,43,\\,62,\\,81\\}$, adică $4$ numere' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x^2-4x+4}{x^2-3x+2}+\\dfrac{1}{x-1}$, unde $x\\in\\mathbb{R}\\setminus\\{1,\\,2\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2-3x+2=(x-1)(x-2)$, pentru orice număr real $x$.', ans: '$(x-1)(x-2)=x^2-2x-x+2=x^2-3x+2$' },
        { pts: 3, text: 'Arată că $E(a)$ este număr natural, pentru orice număr $a\\in\\mathbb{R}\\setminus\\{1,\\,2\\}$.', ans: '$E(a)=\\dfrac{(a-2)^2}{(a-1)(a-2)}+\\dfrac{1}{a-1}=\\dfrac{a-2}{a-1}+\\dfrac{1}{a-1}=1\\in\\mathbb{N}$' },
      ],
    },
    {
      text: 'Se dă funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\dfrac{3}{2}x-0{,}5$ și sistemul de axe ortogonale $xOy$.',
      parts: [
        { pts: 2, text: 'Verifică dacă punctele $A(-1,\\,-2)$ și $B(5,\\,7)$ sunt situate pe reprezentarea grafică funcției $f$.', ans: '$f(-1)=-2$ și $f(5)=7$, deci $A$ și $B$ aparțin graficului' },
        { pts: 3, text: 'Determină punctele de coordonate întregi situate pe segmentul $AB$ (fără punctele $A$ și $B$), unde $A$ și $B$ sunt punctele de mai sus.', ans: '$x\\in\\{0,\\,1,\\,2,\\,3,\\,4\\}$ și $y=\\dfrac{3x-1}{2}$ întreg doar pentru $x$ impar: $(1,\\,1)$ și $(3,\\,4)$' },
      ],
      fig: fig15,
    },
    {
      text: 'Un teren agricol are forma paralelogramului $ABCD$ din figura alăturată și are dimensiunile $AB=200$ m, $AD=50\\sqrt{2}$ m și $\\sphericalangle BAD=45^\\circ$.',
      parts: [
        { pts: 2, text: 'Calculează lungimea gardului ce împrejmuiește terenul.', ans: '$\\mathcal{P}=2(200+50\\sqrt{2})=(400+100\\sqrt{2})$ m' },
        { pts: 3, text: 'Arată că aria terenului este egală cu un hectar.', ans: 'Înălțimea din $D$ este $50\\sqrt{2}\\cdot\\dfrac{\\sqrt{2}}{2}=50$ m, deci $\\mathcal{A}_{ABCD}=200\\cdot50=10000\\text{ m}^2=1$ ha' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este înscris în cercul $\\mathcal{C}(O,\\,R)$, $AB=12$ cm, $\\sphericalangle ACB=60^\\circ$, iar $D$ este punctul diametral opus lui $A$ în cercul dat.',
      parts: [
        { pts: 2, text: 'Arată că $\\sphericalangle BAD=30^\\circ$.', ans: '$\\sphericalangle ADB=\\sphericalangle ACB=60^\\circ$ (subîntind arcul $AB$) și $\\sphericalangle ABD=90^\\circ$, deci $\\sphericalangle BAD=30^\\circ$' },
        { pts: 3, text: 'Determină lungimea razei cercului $\\mathcal{C}(O,\\,R)$.', ans: 'În $\\triangle ABD$: $AD=\\dfrac{AB}{\\cos30^\\circ}=8\\sqrt{3}$ cm, deci $R=\\dfrac{AD}{2}=4\\sqrt{3}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o prismă triunghiulară regulată $ABCA'B'C'$, cu $AB=6$ cm și $AA'=3$ cm. Punctul $M$ este mijlocul laturii $BC$.",
      parts: [
        { pts: 2, text: 'Calculează volumul prismei.', ans: '$V=\\dfrac{36\\sqrt{3}}{4}\\cdot3=27\\sqrt{3}\\text{ cm}^3$' },
        { pts: 3, text: "Demonstrează că planele $(AB'M)$ și $(AC'M)$ sunt perpendiculare.", ans: "$AM\\perp BC$ și $AM\\perp BB'$, deci $AM\\perp(BCC')$ și unghiul planelor este $\\sphericalangle B'MC'$; $B'M=C'M=3\\sqrt{2}$ cm, $B'C'=6$ cm, iar $18+18=36$, deci $\\sphericalangle B'MC'=90^\\circ$" },
      ],
      fig: fig18,
    },
  ],
}
