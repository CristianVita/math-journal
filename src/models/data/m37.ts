// Testul 14 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 100–101; every answer here is computed and checked with the book's answers, pp. 274–275).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { graph, pol, tetra, TETRA } from './shapes'

const fig7 = plane({ A: [0, 0], B: [4, 0], C: [12, 0], X: [13, 0] }, 170, { s: 'A-X', dot: 'A B C', l: { A: 'n', B: 'n', C: 'n', X: '' } })
const fig8 = plane({ O: [0, 0], A: [10, 0], B: pol(22.5, 9), C: [0, 9] }, 110, { s: 'O-A O-B O-C', l: { O: 'sw' } })
const fig9 = plane({ A: [0, 0], B: [5, 0], C: [5, 3], D: [0, 3] }, 120, { s: 'A-B-C-D-A' })
const fig10 = plane({ A: [0, 0], B: [10, 0], C: [6, 4], D: [4, 4] }, 130, { s: 'A-B-C-D-A', ang: ['DAB'] })
const yA11 = 4.8
const fig11 = plane({ O: [0, 0], A: [-1.4, yA11], B: [-5, 0], C: [5, 0] }, 120, { s: 'A-B-C-A', c: [{ at: 'O', r: 5 }], ra: ['BAC'], l: { O: '' } })
const fig12 = solid(tetra(100, ['B', 'C', 'D', 'A']), TETRA('B', 'C', 'D', 'A'), 120)

const fig15 = graph({ A: [3, 2], B: [3, -2], C: [-3, -2], L1: [-4.5, -2], L2: [4.5, -2] }, 140, [-4.5, 4.5], [-3, 3.5], { s: 'L1-L2', dot: 'A B C', l: { L1: '', L2: '', A: 'n', B: 's', C: 's', O: 'nw' } })
const f16 = plane({ A: [0, 20], B: [-15, 0], C: [15, 0], D: [0, 0], E1: [-12, 0], E2: [12, 0] }, 150, { s: 'A-B-C-A A-D', dot: 'D', l: { E1: '', E2: '', D: 's' } })
const r16 = f16.p.E2[0] - f16.p.D[0]
const fig16 = { ...f16, path: [{ d: `M${f16.p.E1[0]} ${f16.p.E1[1]} A${r16} ${r16} 0 0 1 ${f16.p.E2[0]} ${f16.p.E2[1]}` }] }
const s10 = Math.sin((10 * Math.PI) / 180), c10 = Math.cos((10 * Math.PI) / 180)
const A17: [number, number] = [10 * s10, 10 * c10]
const fig17 = plane({ B: [0, 0], C: [20 * s10, 0], A: A17, D: [A17[0] + 10, A17[1]], L1: [-1.5, A17[1]], L2: [A17[0] + 11.5, A17[1]] }, 130, {
  s: 'L1-L2 A-B-C-A B-D D-C', ang: ['BAC'], l: { L1: '', L2: '', A: 'n', D: 'n' },
  t: [{ at: [-1.2, A17[1] + 0.5], s: 'd', italic: true }],
})
const fig18 = plane({ A: [0, 0], B: [8, 0], C: [8, 8], D: [0, 8], F: [-2.5, -3.5], E: [5.5, -3.5] }, 110, { s: 'A-B-C-D-A A-F-E-B' })

export const M37: EnModel = {
  id: 'en-37',
  title: 'Paralela 45, Testul 14',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 100–101',
  items: [
    { text: 'Rezultatul calculului $28-2\\cdot8$ este:', choices: ['$28$', '$208$', '$0$', '$12$'], ans: 3 },
    { text: 'Dacă $\\dfrac{1}{5}$ dintr-o oră înseamnă $n$ minute, valoarea numărului $n$ este:', choices: ['$20$', '$15$', '$12$', '$10$'], ans: 2 },
    {
      text: 'Patru elevi, Andrei, Barbu, Carmen și Daniela, au calculat media geometrică a numerelor $x=0{,}875$ și $y=1\\dfrac{1}{7}$. Rezultatele pe care le-au obținut sunt cele din tabelul următor.\n\n| Andrei | Barbu | Carmen | Daniela |\n|---|---|---|---|\n| $0{,}9$ | $1$ | $1{,}1$ | $1{,}7$ |\n\nRezultatul corect este cel obținut de:',
      choices: ['Andrei', 'Barbu', 'Carmen', 'Daniela'], ans: 1,
    },
    { text: 'Dintre următoarele secvențe de numere, cea care conține numai divizori ai lui $48$ este:', choices: ['$0,\\ 1,\\ 2,\\ 12,\\ 24$', '$3,\\ 4,\\ 6,\\ 12,\\ 36$', '$2,\\ 3,\\ 6,\\ 8,\\ 24$', '$1,\\ 2,\\ 3,\\ 4,\\ 5$'], ans: 2 },
    { text: 'Dintre numerele de mai jos, cel care aparține intervalului $[-1,\\,0]$ este:', choices: ['$2-\\sqrt{3}$', '$3-\\sqrt{10}$', '$5-\\sqrt{20}$', '$7-\\sqrt{70}$'], ans: 1 },
    { text: 'Trei robinete cu același debit umplu un bazin în patru ore. Barbu spune că șase robinete de același fel vor umple bazinul în două ore. Afirmația lui Barbu este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$ și $C$, astfel încât $AB=4$ cm și $AC=12$ cm. Lungimea segmentului $BC$ este egală cu:',
      choices: ['$16$ cm', '$10$ cm', '$8$ cm', '$6$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate unghiurile adiacente complementare $AOB$ și $BOC$, cel de-al doilea având măsura de trei ori mai mare decât primul. Diferența dintre măsurile unghiurilor $BOC$ și $AOB$ este:',
      choices: ['$45^\\circ$', '$60^\\circ$', '$30^\\circ$', "$67^\\circ30'$"], ans: 0, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat schematic un teren agricol, având forma dreptunghiului $ABCD$, cu $AB=500$ m și $AD=300$ m. De pe fiecare hectar se recoltează câte $3$ tone de cereale. Cantitatea totală de cereale care se recoltează de pe acest teren este:',
      choices: ['$45$ t', '$15$ t', '$4{,}5$ t', '$450$ t'], ans: 0, fig: fig9,
    },
    {
      text: 'În figura alăturată este desenat un trapez isoscel $ABCD$ cu bazele $AB=10$ cm și $CD=2$ cm, iar $\\sphericalangle BAD=45^\\circ$. Lungimea segmentului $AD$ este:',
      choices: ['$4$ cm', '$4\\sqrt{2}$ cm', '$6$ cm', '$6\\sqrt{2}$ cm'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată este desenat un triunghi $ABC$ înscris într-un cerc. Se știe că $AB=6$ cm, $AC=8$ cm și $\\sphericalangle A=90^\\circ$. Lungimea razei cercului este egală cu:',
      choices: ['$5$ cm', '$6$ cm', '$10$ cm', '$8$ cm'], ans: 0, fig: fig11,
    },
    {
      text: 'În figura alăturată este reprezentat un tetraedru regulat $ABCD$. Suma lungimilor muchiilor acestuia este $36$ cm. Suma ariilor fețelor tetraedrului este:',
      choices: ['$144\\sqrt{3}\\text{ cm}^2$', '$144\\text{ cm}^2$', '$36\\text{ cm}^2$', '$36\\sqrt{3}\\text{ cm}^2$'], ans: 3, fig: fig12,
    },

    {
      text: 'Într-o livadă se plantează meri și nuci, în total $160$ de pomi. În prima zi se plantează $60\\%$ din numărul merilor și $40\\%$ din numărul nucilor, iar în a doua zi restul de $76$ de pomi.',
      parts: [
        { pts: 2, text: 'Ce procent din numărul total al pomilor reprezintă pomii plantați în prima zi?', ans: 'În prima zi: $160-76=84$ de pomi, iar $\\dfrac{84}{160}=\\dfrac{52{,}5}{100}$, deci $52{,}5\\%$' },
        { pts: 3, text: 'Câți meri și câți nuci s-au plantat în livadă?', ans: '$m+n=160$ și $\\dfrac{3m}{5}+\\dfrac{2n}{5}=84$, deci $m=100$ de meri și $n=60$ de nuci' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{1}{2}\\cdot\\left(\\dfrac{x-1}{x+1}-\\dfrac{x-2}{x}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-1,\\,0\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)-\\dfrac{1}{x}+\\dfrac{1}{x+1}=0$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-1,\\,0\\}$.', ans: '$E(x)=\\dfrac{1}{2}\\cdot\\dfrac{x^2-x-(x^2-x-2)}{x(x+1)}=\\dfrac{1}{x(x+1)}$, iar $\\dfrac{1}{x}-\\dfrac{1}{x+1}=\\dfrac{1}{x(x+1)}$' },
        { pts: 3, text: 'Arată că $E(1)+E(2)+\\ldots+E(9)<1$.', ans: '$E(x)=\\dfrac{1}{x}-\\dfrac{1}{x+1}$, deci suma este $1-\\dfrac{1}{2}+\\dfrac{1}{2}-\\dfrac{1}{3}+\\ldots+\\dfrac{1}{9}-\\dfrac{1}{10}=1-\\dfrac{1}{10}=\\dfrac{9}{10}<1$' },
      ],
    },
    {
      text: 'Într-un sistem de axe ortogonale $xOy$ se consideră punctele: $A(3,\\,2)$, $B$ este simetricul lui $A$ față de $Ox$, iar $C$ este simetricul lui $A$ față de originea $O$.',
      parts: [
        { pts: 2, text: 'Arată că punctul $C$ are coordonatele $(-3,\\,-2)$.', ans: '$O$ este mijlocul lui $AC$: $x_O=\\dfrac{x_A+x_C}{2}$, $y_O=\\dfrac{y_A+y_C}{2}$, deci $x_C=-3$, $y_C=-2$' },
        { pts: 3, text: 'Determină legea de corespondență a funcției $f:\\mathbb{R}\\to\\mathbb{R}$, a cărei reprezentare grafică este dreapta $BC$.', ans: '$B(3,\\,-2)$ și $C(-3,\\,-2)$ au aceeași ordonată, deci $f(x)=-2$, pentru orice $x\\in\\mathbb{R}$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată, semicercul de centru $D$ este tangent laturilor congruente $AB$ și $AC$ ale triunghiului isoscel $ABC$, iar $D$ aparține segmentului $BC$.',
      parts: [
        { pts: 2, text: 'Demonstrează că punctul $D$ este mijlocul segmentului $BC$.', ans: 'Cu $S$, $T$ punctele de tangență pe $AB$, $AC$: $DS=DT$, $DS\\perp AB$, $DT\\perp AC$, $\\sphericalangle B\\equiv\\sphericalangle C$, deci $\\triangle SBD\\equiv\\triangle TCD$ și $BD=DC$' },
        { pts: 3, text: 'Știind că $BC=30$ cm și $AD=20$ cm, află lungimea razei semicercului.', ans: '$AD\\perp BC$, $BD=15$ cm, $AB=25$ cm; raza este înălțimea $DS$ a triunghiului dreptunghic $ADB$: $DS=\\dfrac{20\\cdot15}{25}=12$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'Un topograf se află în punctul $A$ al unei șosele $d$, paralelă cu podul $BC$, ca în figura alăturată. Punctul $A$ este situat la egală distanță de capetele $B$ și $C$ ale podului, iar topograful vede podul sub unghiul $BAC$ de $20^\\circ$. Apoi topograful se deplasează pe șosea în punctul $D$, astfel încât $BD$ este bisectoarea unghiului $ABC$.',
      parts: [
        { pts: 2, text: 'Arată că segmentele $AB$ și $AD$ au lungimi egale.', ans: '$\\sphericalangle ADB\\equiv\\sphericalangle DBC$ (alterne interne) și $\\sphericalangle DBC\\equiv\\sphericalangle ABD$, deci $\\triangle ABD$ e isoscel și $AB=AD$' },
        { pts: 3, text: 'Determină măsura unghiului $BDC$ sub care topograful vede podul din noua poziție.', ans: '$AD=AB=AC$; $\\sphericalangle DAC=\\sphericalangle ACB=80^\\circ$, deci $\\sphericalangle ADC=50^\\circ$; $\\sphericalangle ADB=40^\\circ$, deci $\\sphericalangle BDC=10^\\circ$' },
      ],
      fig: fig17,
    },
    {
      text: 'Pătratele $ABCD$ și $ABEF$ sunt situate în plane perpendiculare, ca în figura alăturată.',
      parts: [
        { pts: 2, text: 'Știind că $AB=8$ cm, află lungimea segmentului $BD$.', ans: '$BD=AB\\sqrt{2}=8\\sqrt{2}$ cm' },
        { pts: 3, text: 'Determină măsura unghiului format de dreptele $BD$ și $AE$.', ans: 'Completăm cubul $ABCDFEGH$ ($H$ deasupra lui $E$): $AE\\parallel DH$, iar $\\triangle BDH$ e echilateral (diagonale ale fețelor), deci unghiul este $\\sphericalangle BDH=60^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
