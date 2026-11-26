// Testul 79 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 239–241; every answer here is computed and checked with the book's answers, p. 297; I.4: the book gives c),
// the absolute value asked for is d).
import type { Fig, Pt } from '../figure'
import type { EnModel } from '../types'
import { mid, plane } from '../figure'
import { graph, pol } from './shapes'

const s3 = Math.sqrt(3)

// the pie chart: 12 boys, 18 girls
const P2 = { O: [0, 0] as Pt, U: pol(90, 3), W: pol(-54, 3) }
const fig2 = plane(P2, 90, {
  s: 'O-U O-W', c: [{ at: 'O', r: 3 }], l: { O: '', U: '', W: '' },
  t: [{ at: [-1.4, 0.6], s: '12', anchor: 'middle', size: 9 }, { at: [-1.4, -0.2], s: 'băieți', anchor: 'middle', size: 9 }, { at: [1.3, 0.6], s: '18', anchor: 'middle', size: 9 }, { at: [1.3, -0.2], s: 'fete', anchor: 'middle', size: 9 }],
})

const fig7 = plane({ A: [0, 0], B: [12, 0], M: [14, 0], C: [16, 0] }, 170, { s: 'A-C', dot: 'A B M C', l: { A: 'n', B: 'n', M: 'n', C: 'n' } })
// ∡AOC = 40°, OC ⊥ OB, OA ⊥ OD
const fig8 = plane({ O: [0, 0], A: pol(180, 4), C: pol(140, 4), B: pol(50, 4), D: pol(90, 4) }, 120, {
  s: 'O-A O-B O-C O-D', ra: ['COB', 'AOD'], ang: ['AOC', 'BOD'], l: { O: 's' },
  t: [{ at: [-2.2, 0.35], s: '40°', size: 9 }, { at: [0.35, 1.3], s: 'x°', size: 9 }],
})
const fig9 = plane({ A: [0, 0], B: [120, 0], C: [80, 30], D: [0, 30], M: [0, 90] }, 100, { s: 'A-B-M-A D-C', ra: ['BAD'] })
const fig10 = plane({ B: [10, 6], C: [-10, 8], A: [8, -6], M: [-1, 1] }, 140, { s: 'A-B-C-A', dot: 'M', l: { M: 's' } })
const fig11 = plane({ O: [0, 0], A: pol(210, 4), B: pol(-30, 4), D: [0, -4], E: [0, -2] }, 110, {
  s: 'A-B O-D', c: [{ at: 'O', r: 4 }], dot: 'O', ra: ['OEB'], l: { E: '', O: 'n' },
})

const fig15 = graph({ A: [1, 0], B: [0, -4], L1: [-0.2, -4.8], L2: [1.6, 2.4] }, 120, [-2, 4], [-5, 3], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'ne', B: 'w' } })
const fig16 = plane({ A: [0, 0], B: [12, 0], C: [12, 12], D: [0, 12], O: [6, 6], E: [18, 18] }, 120, { s: 'A-B-C-D-A A-E B-D', l: { O: 'e' } })
const A17: Pt = [0, 0], B17: Pt = [12, 0], C17: Pt = [9, 9 * s3], D17: Pt = [3, 9 * s3], O17: Pt = [6, 6 * s3]
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, O: O17, R: mid(A17, O17), M: mid(B17, C17) }, 120, { s: 'A-B-C-D-A A-C B-D B-R-M', l: { O: 'e', R: 'w' } })
// the cone, drawn by hand
const fig18: Fig = {
  w: 140, h: 150,
  p: { V: [70, 10], A: [10, 125], B: [130, 125], O: [70, 125] },
  l: { V: 'n', A: 'w', B: 'e', O: '' },
  s: 'V-A V-B', d: 'A-B',
  e: [{ at: 'O', rx: 60, ry: 13, back: true }],
}

export const M110: EnModel = {
  id: 'en-110',
  title: 'Paralela 45, Testul 79',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 239–241',
  items: [
    { text: 'Dacă $189<\\overline{xyz}<200$, atunci valoarea sumei $x+y$ este:', choices: ['$3$', '$5$', '$10$', '$7$'], ans: 2 },
    {
      text: 'Distribuția după gen a elevilor unei clase este cea din diagrama alăturată. Procentul reprezentat de băieți din numărul elevilor clasei este:',
      choices: ['$12\\%$', '$60\\%$', '$40\\%$', '$20\\%$'], ans: 2, fig: fig2,
    },
    {
      text: 'Probabilitatea ca, la aruncarea unui zar, să obținem pe fața superioară un număr prim este:',
      choices: ['$\\dfrac{2}{5}$', '$\\dfrac{1}{2}$', '$\\dfrac{1}{3}$', '$\\dfrac{4}{6}$'], ans: 1,
    },
    {
      text: 'Valoarea absolută a numărului $x=\\left(2\\dfrac{1}{5}-0{,}7\\right):\\left(-0{,}(3)\\right)$ este:',
      choices: ['$-\\dfrac{1}{2}$', '$-2$', '$-\\dfrac{9}{2}$', '$\\dfrac{9}{2}$'], ans: 3,
    },
    { text: 'Numărul întreg $n$ pentru care $n-1<2\\sqrt{5}<n$ este:', choices: ['$4$', '$3$', '$5$', '$6$'], ans: 2 },
    {
      text: 'Mihaela face o călătorie cu mocănița pe Valea Vaserului. O cursă dus-întors durează șase ore. Plecările sunt din două în două ore, cu începere la ora $9{:}00$, trei curse pe zi. Mihaela ia a doua cursă. Ea afirmă că se va întoarce la ora $17{:}00$. Afirmația Mihaelei este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, iar $AB=3BC$. Punctul $M$ este mijlocul segmentului $BC$ și $AM=14$ cm. Lungimea segmentului $BC$ este egală cu:',
      choices: ['$7$ cm', '$2$ cm', '$4$ cm', '$10$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, unghiul $AOB$ este obtuz, iar perechile de semidrepte $OC$ și $OB$, respectiv $OA$ și $OD$, sunt perpendiculare. Măsura unghiului $BOD$ este $x^\\circ$. Valoarea lui $x$ este:',
      choices: ['$90$', '$50$', '$40$', '$140$'], ans: 2, fig: fig8,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul dreptunghic $ABCD$, având $AB\\parallel CD$, $\\sphericalangle A=90^\\circ$, $AB=120$ m, $DC=80$ m și $AD=30$ m. Dacă punctul $M$ reprezintă intersecția dreptelor $AD$ și $BC$, atunci distanța de la $M$ la $DC$ este:',
      choices: ['$50$ m', '$60$ m', '$120$ m', '$80$ m'], ans: 1, fig: fig9,
    },
    {
      text: 'Figura alăturată reprezintă schița unui teren triunghiular $ABC$ cu aria de $6$ ha și lungimea laturii $BC$ de $400$ m. Dacă $M$ este mijlocul laturii $AC$, atunci distanța de la punctul $M$ la dreapta $BC$ este egală cu:',
      choices: ['$300$ m', '$150$ m', '$75$ m', '$600$ m'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată, simetricul punctului $O$ față de coarda $AB$ a cercului de centru $O$ este punctul $D$, aparținând cercului. Măsura arcului mic $BD$ este egală cu:',
      choices: ['$160^\\circ$', '$80^\\circ$', '$20^\\circ$', '$60^\\circ$'], ans: 3, fig: fig11,
    },
    {
      text: 'Un obiect ornamental are forma unei piramide hexagonale regulate cu înălțimea de $9$ m și latura bazei de $12$ m. Pe toate muchiile piramidei se fixează bandă autoadezivă. Lungimea minimă a benzii autoadezive necesare este egală cu:',
      choices: ['$72$ m', '$90$ m', '$162$ m', '$126$ m'], ans: 2,
    },

    {
      text: 'Ana își propune să rezolve un set de probleme la matematică într-un anumit număr de zile. Dacă ar rezolva câte patru probleme pe zi, i-ar mai rămâne șase probleme. Dacă ar rezolva câte cinci probleme pe zi, ar termina cu o zi mai devreme decât și-a propus.',
      parts: [
        { pts: 2, text: 'Este posibil ca numărul problemelor de rezolvat să fie impar? Justifică răspunsul.', ans: 'Nu: cu $z$ zile, numărul problemelor este $4z+6$, care este par' },
        { pts: 3, text: 'Determină numărul de probleme pe care le are de rezolvat Ana.', ans: '$p=4z+6$ și $p=5(z-1)$, deci $z=11$ și $p=50$ de probleme' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x}{x-1}+\\dfrac{x-1}{x}-1\\right)\\cdot\\dfrac{x^3+x^2}{x^3-x^2+x}$, unde $x\\in\\mathbb{R}\\setminus\\{0,\\,1\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)=\\dfrac{x+1}{x-1}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{0,\\,1\\}$.', ans: 'Paranteza este $\\dfrac{x^2-x+1}{x(x-1)}$, fracția $\\dfrac{x(x+1)}{x^2-x+1}$, deci $E(x)=\\dfrac{x+1}{x-1}$' },
        { pts: 3, text: 'Rezolvă, în mulțimea numerelor reale, inecuația $E(x)\\ge1$.', ans: '$\\dfrac{x+1}{x-1}-1=\\dfrac{2}{x-1}\\ge0$, deci $x>1$: $S=(1,\\,+\\infty)$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x^2-(2-x)^2$.',
      parts: [
        { pts: 2, text: 'Arată că $f(x)=4x-4$, pentru orice număr real $x$.', ans: '$x^2-(4-4x+x^2)=4x-4$' },
        { pts: 3, text: 'Știind că $A$ și $B$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, află aria triunghiului $OAB$.', ans: '$A(1,\\,0)$, $B(0,\\,-4)$, deci $\\mathcal{A}_{AOB}=\\dfrac{OA\\cdot OB}{2}=2$ u²' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$ cu $AB=12$ cm, iar $O$ este punctul de intersecție a diagonalelor sale. Notăm cu $E$ simetricul punctului $O$ față de punctul $C$.',
      parts: [
        { pts: 2, text: 'Arată că $AE=18\\sqrt{2}$ cm.', ans: '$OA=OC=CE=6\\sqrt{2}$ cm, deci $AE=18\\sqrt{2}$ cm' },
        { pts: 3, text: 'Determină distanța de la punctul $E$ la dreapta $AD$.', ans: 'Fie $EF\\perp AD$, $F\\in AD$; triunghiul $AFE$ este dreptunghic isoscel, deci $EF=\\dfrac{AE}{\\sqrt{2}}=18$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat trapezul isoscel $ABCD$ cu $AB\\parallel CD$, $AB=12$ cm, $CD=6$ cm și $BD=18$ cm. Diagonalele trapezului se intersectează în punctul $O$, $R$ este mijlocul segmentului $AO$, iar $M$ este mijlocul segmentului $BC$.',
      parts: [
        { pts: 2, text: 'Arată că $OB=12$ cm.', ans: '$\\triangle DOC\\sim\\triangle BOA$ cu raportul $\\dfrac{1}{2}$, deci $OD=6$ cm și $OB=12$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $RM$.', ans: '$OA=OB=AB=12$ cm, deci $\\triangle AOB$ este echilateral și $BR\\perp OA$; $RM$ este mediană în $\\triangle RBC$ dreptunghic, iar $BC^2=6^2+12^2+6\\cdot12=252$, deci $RM=\\dfrac{BC}{2}=3\\sqrt{7}$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'Un sector de disc, având aria egală cu $75\\pi\\text{ cm}^2$ și măsura unghiului la centru $\\alpha=120^\\circ$, se înfășoară, formând un con, ca în figura alăturată.',
      parts: [
        { pts: 2, text: 'Arată că înălțimea conului, exprimată în centimetri, este un număr din intervalul $(14,\\,15)$.', ans: '$\\dfrac{\\pi G^2}{3}=75\\pi$, deci $G=15$ cm; $120^\\circ=360^\\circ\\cdot\\dfrac{R}{G}$ dă $R=5$ cm și $H=\\sqrt{225-25}=10\\sqrt{2}$ cm, iar $196<200<225$' },
        { pts: 3, text: 'Determină sinusul unghiului $AVB$.', ans: '$AB\\cdot VO=AV\\cdot VB\\cdot\\sin\\sphericalangle AVB$, adică $10\\cdot10\\sqrt{2}=225\\sin\\sphericalangle AVB$, deci $\\sin\\sphericalangle AVB=\\dfrac{4\\sqrt{2}}{9}$' },
      ],
      fig: fig18,
    },
  ],
}
