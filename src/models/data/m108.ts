// Testul 77 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 235–237; every answer here is computed and checked with the book's answers, p. 296).
import type { Pt } from '../figure'
import type { EnModel } from '../types'
import { foot, meet, mid, plane, solid } from '../figure'
import { graph, pol, PYR4, pyr4 } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [6.5, 0], C: [9.5, 0], D: [16, 0] }, 170, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ A: [0, 0], B: [1, 0], D: [2, 0], C: [0.5, -s3 / 2] }, 130, {
  s: 'A-D A-C-B C-D', ang: ['BDC'], l: { B: 'n' }, t: [{ at: [1.55, -0.12], s: 'x°', size: 9 }],
})
const B9: Pt = [10, 0], D9: Pt = [0, 10], M9: Pt = [10, 5]
const F9 = foot(M9, B9, D9)
const fig9 = plane({ A: [0, 0], B: B9, C: [10, 10], D: D9, M: M9, F: F9 }, 110, { s: 'A-B-C-D-A B-D M-F', ra: ['MFB'], l: { F: '' } })
const A10: Pt = [0, 0], B10: Pt = [5, 7], C10: Pt = [-5, 7]
const fig10 = plane({ A: A10, B: B10, C: C10, M: mid(A10, B10), N: mid(A10, C10) }, 140, { s: 'A-B-C-A M-N' })
// ∡B = 80°, ∡C = 30°; the altitude from B meets the circle again in M
const A11 = pol(90, 4), B11 = pol(150, 4), C11 = pol(-70, 4)
const H11 = foot(B11, A11, C11)
const M11 = (() => { const d = [H11[0] - B11[0], H11[1] - B11[1]], t = -2 * (B11[0] * d[0] + B11[1] * d[1]) / (d[0] * d[0] + d[1] * d[1]); return [B11[0] + t * d[0], B11[1] + t * d[1]] as Pt })()
const fig11 = plane({ O: [0, 0], A: A11, B: B11, C: C11, M: M11 }, 120, { s: 'A-B-C-A B-M A-O-M', c: [{ at: 'O', r: 4 }], dot: 'O' })

const fig15 = graph({ L1: [-3.2, 3.4], L2: [0.2, -3.4] }, 130, [-3.5, 2.5], [-3.5, 3.5], { s: 'L1-L2', l: { L1: '', L2: '' } })
const H = { A: [-3, -3 * s3], B: [3, -3 * s3], C: [6, 0], D: [3, 3 * s3], E: [-3, 3 * s3], F: [-6, 0] } as Record<string, Pt>
const O16 = meet(H.E, H.C, H.F, H.D)
const fig16 = plane({ ...H, O: O16, P: meet(O16, [O16[0] + 1, O16[1]], H.D, H.C) }, 130, { s: 'A-B-C-D-E-F-A E-C F-D O-P', l: { O: 's', P: 'e' } })
const u17: Pt = [0.42, -0.91], A17: Pt = [0, 0], D17: Pt = [6 * u17[0], 6 * u17[1]]
const fig17 = plane({ A: A17, C: [14 * u17[0], 14 * u17[1]], D: D17, B: [D17[0] + 6 * u17[1], D17[1] - 6 * u17[0]] }, 110, { s: 'A-B-C-A B-D', ra: ['BDC'] })
const p18 = pyr4(4, 3)
const fig18 = solid({ ...p18, M: [2, 0, 0] }, PYR4, 130, { seg: 'V-O O-M V-M', l: { M: 's' } })

export const M108: EnModel = {
  id: 'en-108',
  title: 'Paralela 45, Testul 77',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 235–237',
  items: [
    { text: 'Valoarea numărului natural nenul $n$ pentru care $3^{2n-1}$ este divizor al numărului $171$ este:', choices: ['$1$', '$2$', '$3$', '$4$'], ans: 0 },
    {
      text: 'Dacă numerele $2x+1$ și $x-2$ sunt invers proporționale cu numerele $3$ și $5$, atunci valoarea lui $x$ este:',
      choices: ['$-7$', '$-13$', '$2$', '$-10$'], ans: 1,
    },
    {
      text: 'Fie $n=\\square\\,1\\,\\square\\,2\\,\\square\\,3\\,\\square\\,4$. Completând căsuțele cu unul din semnele „$+$” sau „$-$”, dar fără a avea același semn în toate căsuțele, cea mai mică valoare posibilă a numărului $n$ este:',
      choices: ['$-8$', '$-10$', '$-6$', '$-4$'], ans: 0,
    },
    {
      text: 'Patru elevi, Ana, Cătălin, Irina și Sebastian, au ordonat descrescător numerele $x=\\dfrac{3}{4}$, $y=\\dfrac{11}{12}$, $z=\\dfrac{7}{8}$ și $t=\\dfrac{5}{6}$. Rezultatele obținute sunt înregistrate în tabelul următor.\n\n| Ana | Cătălin | Irina | Sebastian |\n|---|---|---|---|\n| $y>z>x>t$ | $y>x>t>z$ | $y>x>z>t$ | $y>z>t>x$ |\n\nNumele elevului care a scris ordinea corectă este:',
      choices: ['Cătălin', 'Sebastian', 'Ana', 'Irina'], ans: 1,
    },
    {
      text: 'Rezultatul calculului $\\dfrac{\\sqrt{2}-1}{\\sqrt{2}}+\\dfrac{\\sqrt{3}-\\sqrt{2}}{\\sqrt{6}}+\\dfrac{\\sqrt{4}-\\sqrt{3}}{\\sqrt{12}}$ este numărul:',
      choices: ['$2\\sqrt{3}$', '$\\dfrac{2}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{1}{\\sqrt{12}}$'], ans: 2,
    },
    {
      text: 'Victor merge la înot o dată la două zile, iar Matei o dată la trei zile. Luni, când au ieșit de la piscină, Matei i-a spus că se vor întâlni din nou marțea viitoare. Afirmația lui Matei este:',
      choices: ['adevărată', 'falsă'], ans: 1,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$ și $D$ sunt coliniare, în această ordine, astfel încât segmentele $AD$ și $BC$ au același mijloc. Dacă $AD=16$ cm și $BC=3$ cm, atunci lungimea segmentului $AC$ este egală cu:',
      choices: ['$13$ cm', '$10$ cm', '$9{,}5$ cm', '$6{,}5$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, punctul $D$ este simetricul punctului $A$ față de punctul $B$, iar triunghiul $ABC$ este echilateral. Măsura unghiului $ADC$ este $x^\\circ$. Valoarea lui $x$ este:',
      choices: ['$15$', '$60$', '$30$', '$40$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$, având perimetrul egal cu $40$ m. Dacă punctul $M$ este mijlocul laturii $BC$, atunci distanța de la punctul $M$ la dreapta $BD$ este egală cu:',
      choices: ['$5$ m', '$\\dfrac{5}{\\sqrt{2}}$ m', '$5\\sqrt{2}$ m', '$1$ m'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$, în care $AB=180$ m și dreapta $MN$ este paralelă cu $BC$, $M\\in AB$, $N\\in AC$. Dacă aria triunghiului $AMN$ reprezintă $25\\%$ din aria triunghiului $ABC$, atunci distanța dintre punctele $A$ și $M$ este egală cu:',
      choices: ['$45$ m', '$60$ m', '$90$ m', '$30$ m'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată, triunghiul $ABC$ este înscris în cercul de centru $O$. Măsurile unghiurilor $B$ și $C$ sunt egale cu $80^\\circ$, respectiv $30^\\circ$, iar înălțimea din $B$ intersectează cercul în punctul $M$. Măsura unghiului $AOM$ este egală cu:',
      choices: ['$80^\\circ$', '$40^\\circ$', '$60^\\circ$', '$70^\\circ$'], ans: 1, fig: fig11,
    },
    {
      text: 'Un zar de formă cubică are volumul egal cu $8\\text{ cm}^3$. Aria totală a paralelipipedului obținut prin lipirea a cinci zaruri este egală cu:',
      choices: ['$88\\text{ cm}^2$', '$120\\text{ cm}^2$', '$80\\text{ cm}^2$', '$100\\text{ cm}^2$'], ans: 0,
    },

    {
      text: 'În clasa a VIII-a A învață $27$ de elevi. $25\\%$ din numărul fetelor și $20\\%$ din numărul băieților participă la etapa locală a Olimpiadei de matematică.',
      parts: [
        { pts: 2, text: 'Este posibil ca în clasă să învețe $10$ fete? Justifică răspunsul.', ans: 'Nu: $25\\%$ din $10$ este $2{,}5$, care nu este număr întreg' },
        { pts: 3, text: 'Câți băieți și câte fete sunt în clasa a VIII-a A?', ans: 'Numărul fetelor se divide cu $4$, al băieților cu $5$, iar suma este $27$: $12$ fete și $15$ băieți' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=2-\\left(\\dfrac{x}{x+3}+\\dfrac{2}{3-x}\\right):\\left(1-\\dfrac{2}{x+3}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\{-3,\\,-1,\\,3\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x}{x-3}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-3,\\,-1,\\,3\\}$.', ans: 'Prima paranteză este $\\dfrac{(x-6)(x+1)}{(x+3)(x-3)}$, a doua $\\dfrac{x+1}{x+3}$, câtul $\\dfrac{x-6}{x-3}$, deci $E(x)=2-\\dfrac{x-6}{x-3}=\\dfrac{x}{x-3}$' },
        { pts: 3, text: 'Arată că numărul $n=E(3+\\sqrt{3})+E(3-\\sqrt{3})$ este număr natural.', ans: '$E(3+\\sqrt{3})=\\dfrac{3+\\sqrt{3}}{\\sqrt{3}}=\\sqrt{3}+1$, $E(3-\\sqrt{3})=\\dfrac{3-\\sqrt{3}}{-\\sqrt{3}}=1-\\sqrt{3}$, deci $n=2\\in\\mathbb{N}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-2x-3$.',
      parts: [
        { pts: 2, text: 'Demonstrează că numărul $f(-2)+f(-3)+\\ldots+f(-10)$ este pătrat perfect.', ans: '$(1+3+5+\\ldots+17)=81=9^2$' },
        { pts: 3, text: 'Determină punctele, având coordonate egale, care sunt situate pe reprezentarea grafică a funcției $f$.', ans: '$f(a)=a$, adică $-2a-3=a$, deci $a=-1$: punctul $P(-1,\\,-1)$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un hexagon regulat $ABCDEF$, având perimetrul egal cu $36$ cm. Fie $O$ punctul de intersecție a dreptelor $EC$ și $FD$, iar dreapta $OP$ este paralelă cu $ED$, $P\\in DC$.',
      parts: [
        { pts: 2, text: 'Arată că $EC=6\\sqrt{3}$ cm.', ans: 'Latura este $6$ cm; în triunghiul dreptunghic $CEF$, $\\sphericalangle E=90^\\circ$, deci $EC=\\sqrt{FC^2-FE^2}=\\sqrt{144-36}=6\\sqrt{3}$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $OP$.', ans: '$\\triangle COP\\sim\\triangle CED$, deci $\\dfrac{OP}{ED}=\\dfrac{CO}{CE}$; din $\\triangle EOD\\sim\\triangle COF$, $\\dfrac{CO}{CE}=\\dfrac{2}{3}$, deci $OP=4$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un triunghi $ABC$, având $BC=10$ cm, $AC=14$ cm și măsura unghiului $BAC$ de $45^\\circ$. Înălțimea $BD$ a triunghiului are lungimea de $x$ cm.',
      parts: [
        { pts: 2, text: 'Arată că $x^2-14x+48=0$.', ans: '$AD=BD=x$, $DC=14-x$; în $\\triangle BDC$, $BC^2=BD^2+DC^2$, adică $100=x^2+(14-x)^2$, deci $x^2-14x+48=0$' },
        { pts: 3, text: 'Perimetrul triunghiului $ABC$ are cea mai mică valoare posibilă. Determină lungimea laturii $AB$.', ans: '$x\\in\\{6,\\,8\\}$: pentru $x=6$, $AB=6\\sqrt{2}$ cm și $\\mathcal{P}=6(4+\\sqrt{2})$ cm; pentru $x=8$, $AB=8\\sqrt{2}$ cm și $\\mathcal{P}=8(3+\\sqrt{2})$ cm; deci $AB=6\\sqrt{2}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentat un cort din pânză, având forma piramidei patrulatere regulate $VABCD$, cu muchia bazei $AB=4$ m și înălțimea $VO=1{,}5$ m.',
      parts: [
        { pts: 2, text: 'Fețele laterale ale cortului sunt fabricate din pânză. Care este suprafața de pânză necesară (aria laterală a piramidei $VABCD$)?', ans: 'Cu $M$ mijlocul lui $AB$, apotema este $VM=\\sqrt{1{,}5^2+2^2}=2{,}5$ m, deci $\\mathcal{A}_l=\\dfrac{4\\cdot4\\cdot2{,}5}{2}=20\\text{ m}^2$' },
        { pts: 3, text: 'Află cosinusul unghiului format de planul unei fețe laterale cu planul bazei.', ans: '$\\sphericalangle((VAB),(ABC))=\\sphericalangle VMO$, cu $M$ mijlocul lui $AB$, iar $\\cos\\sphericalangle VMO=\\dfrac{OM}{VM}=\\dfrac{2}{2{,}5}=\\dfrac{4}{5}$' },
      ],
      fig: fig18,
    },
  ],
}
