// Testul 73 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 226–228; every answer here is computed and checked with the book's answers, p. 295).
import type { P3 } from '../figure'
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { graph, pol, tetra, TETRA } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A1: [0, 0], A2: [4, 0], A3: [6, 0], A4: [10, 0], A5: [12, 0], M: [2, 0], N: [11, 0] }, 180, {
  s: 'A1-A5', dot: 'A1 A2 A3 A4 A5 M N', l: { A1: 'n', A2: 'n', A3: 'n', A4: 'n', A5: 'n', M: 's', N: 's' },
})
const k8 = Math.tan((20 * Math.PI) / 180)
const fig8 = plane({ A: [-1, 0], C: [1, 0], B: [0, k8], D: [0, -k8], O: [0, 0] }, 150, {
  s: 'A-B-C-D-A A-C B-D', ang: ['CAD', 'DBC'], l: { O: '' },
  t: [{ at: [-0.72, -0.1], s: 'x°', anchor: 'start', size: 8 }, { at: [0.06, 0.12], s: '70°', anchor: 'start', size: 8 }],
})
const fig9 = plane({ A: [0, 0], M: [6, 0], B: [12, 0], Q: [0, -6], P: [12, -6 * s3] }, 110, { s: 'A-B-P-M-Q-A', ra: ['QAB', 'ABP'] })
const fig10 = plane({ A: [0, 0], B: [320, 0], C: [320, 80], D: [0, 80] }, 130, { s: 'A-B-C-D-A' })
const fig11 = plane({ O: [0, 0], A: pol(234, 4), B: pol(306, 4) }, 110, { s: 'A-O-B', c: [{ at: 'O', r: 4 }], l: { O: 'n' } })

const fig15 = graph({}, 130, [-3, 3], [-2.5, 3.5])
const fig16 = plane({ A: [0, 6], B: [6, 6], C: [6, 0], D: [0, 0], E: [9, 3], F: [6, 2] }, 140, { s: 'A-B-C-D-A B-E-C D-F-E', ra: ['BEC'], l: { F: 'nw' } })
const fig17 = plane({ D: [0, 9], C: [9, 9], A: [0, 0], B: [9, 0], M: [3, 9], N: [9, 7] }, 120, { s: 'A-B-C-D-A A-M-N A-N', ra: ['AMN'] })
const t18 = tetra(12, ['A', 'B', 'C', 'V'])
const fig18 = solid({ ...t18, O: [0, 1, 2].map((k) => (t18.A[k] + t18.B[k] + t18.C[k]) / 3) as P3 }, TETRA('A', 'B', 'C', 'V'), 120, { seg: 'V-O', l: { O: 'e' } })

export const M104: EnModel = {
  id: 'en-104',
  title: 'Paralela 45, Testul 73',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 226–228',
  items: [
    { text: 'Suma divizorilor naturali proprii ai numărului $15$ este:', choices: ['$8$', '$16$', '$24$', '$20$'], ans: 0 },
    {
      text: 'Bunica a făcut aceeași cantitate de dulceață de caise și dulceață de cireșe. Dacă pentru dulceața de caise i-au trebuit $8$ recipiente de $600$ ml fiecare, atunci numărul recipientelor de $800$ ml, pentru dulceața de cireșe, a fost:',
      choices: ['$10$', '$5$', '$6$', '$4$'], ans: 2,
    },
    { text: 'Dacă $x_1<0<x_2$ sunt soluțiile ecuației $x^2=4$, atunci $x_2-x_1$ este:', choices: ['$4$', '$-4$', '$0$', '$-2$'], ans: 0 },
    { text: 'Fie $y=-1{,}5$. Numărul real $x$ care verifică relația $x+y=x\\cdot y$ este:', choices: ['$-\\dfrac{3}{5}$', '$-\\dfrac{5}{3}$', '$0{,}6$', '$0$'], ans: 2 },
    {
      text: 'Patru elevi, Daria, Eduard, Măriuca și Vlad, au de calculat suma numerelor naturale $n$, pentru care $3\\sqrt{n}\\in\\left(2\\sqrt{5},\\,4\\sqrt{3}\\right)$. Rezultatele sunt înregistrate în tabelul următor.\n\n| Eduard | Măriuca | Daria | Vlad |\n|---|---|---|---|\n| $3$ | $12$ | $7$ | $14$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Măriuca', 'Daria', 'Vlad', 'Eduard'], ans: 0,
    },
    {
      text: 'Marius susține că suma primelor opt zecimale ale numărului $n=0{,}(123)$ este $15$. Afirmația lui Marius este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $A_1$, $A_2$, $A_3$, $A_4$ și $A_5$ sunt coliniare, în această ordine, și $A_1A_3=A_2A_4=A_3A_5$. Dacă punctul $M$ este mijlocul segmentului $A_1A_2$, punctul $N$ este mijlocul segmentului $A_4A_5$ și $MN=9$ cm, atunci lungimea segmentului $A_2A_4$ este egală cu:',
      choices: ['$12$ cm', '$6$ cm', '$15$ cm', '$13$ cm'], ans: 1, fig: fig7,
    },
    {
      text: 'În figura alăturată, $ABCD$ este un romb. Măsurile unghiurilor $DAC$ și $DBC$ sunt $x^\\circ$, respectiv $70^\\circ$. Valoarea lui $x$ este egală cu:',
      choices: ['$70$', '$140$', '$10$', '$20$'], ans: 3, fig: fig8,
    },
    {
      text: 'De aceeași parte a segmentului $AB$ se construiesc perpendicularele $AQ$ și $BP$ pe acesta, ca în figura alăturată. Dacă $AB=12$ cm, $AQ=6$ cm, $BP=6\\sqrt{3}$ cm și punctul $M$ este mijlocul $AB$, atunci măsura unghiului $PMQ$ este egală cu:',
      choices: ['$60^\\circ$', '$105^\\circ$', '$75^\\circ$', '$45^\\circ$'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$ cu $AB=320$ cm și $AD=80$ cm. Dacă un pătrat are aceeași arie ca dreptunghiul, atunci lungimea laturii pătratului este egală cu:',
      choices: ['$80$ cm', '$60$ cm', '$160$ cm', '$120$ cm'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc în care $AOB$ este unghi la centru cu măsura egală cu $72^\\circ$. Dacă aria sectorului circular $\\overset{\\frown}{AOB}$ este egală cu $16\\pi\\text{ cm}^2$, atunci lungimea cercului este egală cu:',
      choices: ['$10\\pi$ cm', '$20\\sqrt{5}\\pi$ cm', '$80\\pi$ cm', '$8\\sqrt{5}\\pi$ cm'], ans: 3, fig: fig11,
    },
    {
      text: 'Un tetraedru regulat are aria totală egală cu $6\\sqrt{3}\\text{ cm}^2$. Volumul tetraedrului este egal cu:',
      choices: ['$\\sqrt{6}\\text{ cm}^3$', '$\\dfrac{9\\sqrt{3}}{4}\\text{ cm}^3$', '$2\\sqrt{3}\\text{ cm}^3$', '$\\sqrt{3}\\text{ cm}^3$'], ans: 3,
    },

    {
      text: 'Cu un an în urmă, vârsta mamei era de patru ori mai mare decât vârsta fiicei sale. Peste trei ani, vârsta mamei va fi de trei ori mai mare decât vârsta fiicei sale.',
      parts: [
        { pts: 2, text: 'Este posibil ca vârsta fiicei să fie $11$ ani? Justifică răspunsul.', ans: 'Nu: din $m-1=4\\cdot10$ ar rezulta $m=41$, iar din $m+3=3\\cdot14$ ar rezulta $m=39$, contradicție' },
        { pts: 3, text: 'Determină vârsta mamei.', ans: '$m-1=4(f-1)$ și $m+3=3(f+3)$, deci $4f-3=3f+6$, $f=9$ și $m=33$ de ani' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=x-\\left(1+\\dfrac{\\sqrt{18}}{x-2\\sqrt{2}}\\right):\\dfrac{x^2+3x\\sqrt{2}+4}{x^2-8}$, unde $x\\in\\mathbb{R}\\setminus\\{-2\\sqrt{2},\\,-\\sqrt{2},\\,2\\sqrt{2}\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $x^2+3x\\sqrt{2}+4=(x+\\sqrt{2})(x+2\\sqrt{2})$, pentru orice număr real $x$.', ans: '$(x+\\sqrt{2})(x+2\\sqrt{2})=x^2+2\\sqrt{2}x+\\sqrt{2}x+4=x^2+3x\\sqrt{2}+4$' },
        { pts: 3, text: 'Demonstrează că $E(x)=x-1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2\\sqrt{2},\\,-\\sqrt{2},\\,2\\sqrt{2}\\}$.', ans: 'Paranteza este $\\dfrac{x+\\sqrt{2}}{x-2\\sqrt{2}}$, iar câtul $\\dfrac{x+\\sqrt{2}}{x-2\\sqrt{2}}\\cdot\\dfrac{(x-2\\sqrt{2})(x+2\\sqrt{2})}{(x+\\sqrt{2})(x+2\\sqrt{2})}=1$, deci $E(x)=x-1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+1$.',
      parts: [
        { pts: 2, text: 'Arată că numărul $\\sqrt{1+f(9)\\cdot f(10)}$ este număr natural.', ans: '$\\sqrt{1+19\\cdot21}=\\sqrt{400}=20\\in\\mathbb{N}$' },
        { pts: 3, text: 'Reprezintă graficul funcției în sistemul de axe ortogonale $xOy$ alăturat.', ans: 'Dreapta care trece prin $A(0,\\,1)$ și $B(-1,\\,-1)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat pătratul $ABCD$, în exteriorul căruia este construit triunghiul dreptunghic isoscel $BCE$ cu unghiul drept în $E$. Latura pătratului este egală cu $6$ cm, iar punctul $F$ este intersecția segmentelor $DE$ și $BC$.',
      parts: [
        { pts: 2, text: 'Arată că $DE=3\\sqrt{10}$ cm.', ans: 'Dacă $G$ este mijlocul lui $AD$, atunci $GE=9$ cm, $DG=3$ cm și $DE=\\sqrt{DG^2+GE^2}=\\sqrt{90}=3\\sqrt{10}$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $EF$.', ans: '$CE\\parallel DB$, deci $\\triangle EFC\\sim\\triangle DFB$ cu raportul $\\dfrac{CE}{DB}=\\dfrac{1}{2}$, de unde $EF=\\dfrac{DE}{3}=\\sqrt{10}$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$ cu $AB=9$ cm, iar $M$ este un punct pe latura $DC$, astfel încât $3DM=DC$. Perpendiculara în $M$ pe dreapta $AM$ intersectează latura $BC$ în punctul $N$.',
      parts: [
        { pts: 2, text: 'Arată că triunghiurile $DAM$ și $CMN$ sunt asemenea.', ans: '$\\sphericalangle DAM+\\sphericalangle DMA=90^\\circ$ și $\\sphericalangle DMA+\\sphericalangle CMN=90^\\circ$, deci $\\sphericalangle DAM\\equiv\\sphericalangle CMN$; triunghiurile dreptunghice $DAM$ și $CMN$ sunt asemenea (UU)' },
        { pts: 3, text: 'Determină lungimea segmentului $BN$.', ans: '$\\dfrac{DA}{CM}=\\dfrac{DM}{CN}$, adică $\\dfrac{9}{6}=\\dfrac{3}{CN}$, deci $CN=2$ cm și $BN=7$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'Un sortiment de suc este ambalat în cutii, având forma tetraedrului regulat $VABC$ din figura alăturată, cu suma lungimilor muchiilor egală cu $72$ cm.',
      parts: [
        { pts: 2, text: 'Află aria totală a unei cutii.', ans: 'Muchia are $12$ cm, deci $\\mathcal{A}_t=12^2\\sqrt{3}=144\\sqrt{3}\\text{ cm}^2$' },
        { pts: 3, text: 'Arată că în cutie încap mai mult de $200$ ml suc.', ans: '$\\mathcal{V}=\\dfrac{12^3\\sqrt{2}}{12}=144\\sqrt{2}\\text{ cm}^3$, iar $144\\sqrt{2}>200\\iff 144^2\\cdot2=41472>40000$' },
      ],
      fig: fig18,
    },
  ],
}
