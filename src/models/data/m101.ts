// Testul 70 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 219–221; every answer here is computed and checked with the book's answers, p. 294).
import type { P3, Pt } from '../figure'
import type { EnModel } from '../types'
import { along, meet, plane, solid } from '../figure'
import { graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [2.5, 0], C: [5, 0], D: [7.5, 0], E: [10, 0] }, 190, { s: 'A-E', dot: 'A B C D E', l: { A: 'n', B: 'n', C: 'n', D: 'n', E: 'n' } })
// a and b slightly slanted, d1 and d2 horizontal; the 70° arc up-right at a∩d1, the x − 10° arc down-right at b∩d2
const U1: Pt = [2.3, 4.2], U2: Pt = [1.9, -0.6], V1: Pt = [5.8, 4.2], V2: Pt = [5.4, -0.6]
const L1: Pt = [0, 3], R1: Pt = [7, 3], L2: Pt = [0, 1], R2: Pt = [7, 1]
const fig8 = plane({ U1, U2, V1, V2, L1, R1, L2, R2, X1: meet(U1, U2, L1, R1), X2: meet(V1, V2, L2, R2) }, 170, {
  s: 'U1-U2 V1-V2 L1-R1 L2-R2', ang: ['U1X1R1', 'V2X2R2'],
  l: { U1: '', U2: '', V1: '', V2: '', L1: '', R1: '', L2: '', R2: '', X1: '', X2: '' },
  t: [
    { at: [2.0, 4.3], s: 'a', italic: true }, { at: [5.5, 4.3], s: 'b', italic: true },
    { at: [0.3, 3.3], s: 'd₁', italic: true }, { at: [0.3, 1.3], s: 'd₂', italic: true },
    { at: [2.9, 3.4], s: '70°', size: 10 }, { at: [5.65, 0.15], s: 'x − 10°', anchor: 'start', size: 10 },
  ],
})
const fig9 = plane({ A: [60 * s3, 60], B: [0, 0], C: [60 * s3 + 60, 0], D: [60 * s3, 0] }, 170, { s: 'B-C-A-B A-D', ra: ['ADC'] })
const q = 2 * s3
const fig10 = plane({ A: [0, 0], B: [q, 0], C: [q, q], D: [0, q], M: [q - 2, 0], N: [q + 2, 0] }, 120, { s: 'A-B-C-D-A B-N-C-M' })
const N11 = pol(-140, 1, [-1, 0])
const fig11 = plane({ A: [-2, 0], B: [0, 0], C: [2, 0], N: N11, M: [-N11[0], -N11[1]] }, 170, {
  s: 'A-C N-M', c: [{ at: [-1, 0], r: 1 }, { at: [1, 0], r: 1 }], l: { B: 'n' },
})

const fig15 = graph({ A: [3, 0], B: [0, 3], L1: [-1.5, 4.5], L2: [4.5, -1.5] }, 130, [-2.5, 5], [-2, 5], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'ne', B: 'ne' } })
const A16: Pt = [6.4, 4.8], B16: Pt = [0, 0], C16: Pt = [10, 0], N16 = along(A16, B16, 3 / 8), M16 = along(A16, C16, 4 / 6)
const fig16 = plane({ A: A16, B: B16, C: C16, N: N16, M: M16 }, 170, { s: 'A-B-C-A N-M', ra: ['BAC'], ang: ['ANM', 'BCA'] })
const A17: Pt = [0, 12], B17: Pt = [12, 12], C17: Pt = [12, 0], D17: Pt = [0, 0], N17: Pt = [12 - 6 * s3, 6], M17: Pt = [6 * s3, 6]
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, N: N17, M: M17, P: meet(A17, M17, B17, N17), Q: meet(D17, M17, C17, N17) }, 120, {
  s: 'A-B-C-D-A B-N-C A-M-D', l: { P: 'n', Q: 's' },
})
// a regular triangular pyramid, drawn taller than its real height 1, as in the book
const p18: Record<string, P3> = { A: [0, 3 * s3, 0], B: [3, 0, 0], C: [6, 3 * s3, 0], O: [3, s3, 0], V: [3, s3, 7], M: [4.5, 1.5 * s3, 0] }
const fig18 = solid(p18, 'A-B-C A-B-V B-C-V C-A-V', 120, { seg: 'V-O O-M V-M', l: { O: 'nw', M: 'se' } })

export const M101: EnModel = {
  id: 'en-101',
  title: 'Paralela 45, Testul 70',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 219–221',
  items: [
    { text: 'Rezultatul calculului $47\\cdot56+45\\cdot47-101\\cdot46$ este:', choices: ['$1$', '$102$', '$101$', '$36$'], ans: 2 },
    {
      text: 'Tabelul alăturat cuprinde informații despre activitățile a patru copii în sala de antrenament. Copilul care a stat cel mai mult pe banda de alergare, raportat la timpul total petrecut în sală, este:\n\n| | Banda de alergare (min) | Alte aparate (min) |\n|---|---|---|\n| Marius | $12$ | $18$ |\n| Corina | $30$ | $30$ |\n| Sorin | $10$ | $20$ |\n| Andrei | $20$ | $30$ |',
      choices: ['Marius', 'Corina', 'Sorin', 'Andrei'], ans: 1,
    },
    {
      text: 'Intersecția mulțimilor $A=(-2,\\,9)$ și $B=\\{x\\in\\mathbb{R}\\mid-5\\le x-1\\le3\\}$ este mulțimea:',
      choices: ['$[-4,\\,9)$', '$(-2,\\,4]$', '$(-2,\\,4)$', '$(4,\\,9)$'], ans: 1,
    },
    { text: 'Fracția ireductibilă echivalentă cu fracția $\\dfrac{24}{18}$ este:', choices: ['$\\dfrac{48}{36}$', '$\\dfrac{8}{6}$', '$\\dfrac{12}{9}$', '$\\dfrac{4}{3}$'], ans: 3 },
    {
      text: 'Patru elevi, Anca, Călin, Elena și George, efectuează individual următorul calcul: $\\sqrt{0{,}(4)}-\\dfrac{2}{\\sqrt{2}}+\\dfrac{3}{\\sqrt{5}-\\sqrt{2}}-\\left|\\sqrt{5}-\\dfrac{1}{3}\\right|$. Ei obțin rezultatele înregistrate în tabelul de mai jos.\n\n| Anca | Călin | Elena | George |\n|---|---|---|---|\n| $2\\sqrt{2}$ | $\\dfrac{1}{3}+\\sqrt{2}$ | $1$ | $-2\\sqrt{5}+\\dfrac{2}{3}$ |\n\nElevul care a obținut rezultatul corect este:',
      choices: ['Anca', 'Elena', 'Călin', 'George'], ans: 1,
    },
    {
      text: 'În parcare erau două biciclete și de trei ori mai multe mașini. Crina afirmă că „Numărul roților tuturor mașinilor este egal cu $24$”. Afirmația Crinei este:',
      choices: ['adevărată', 'falsă'], ans: 0,
    },

    {
      text: 'În figura alăturată, punctele $A$, $B$, $C$, $D$ și $E$ sunt coliniare, în această ordine, și $AB=AC:2=AD:3=AE:4$. Dacă $BD=5$ cm, atunci lungimea segmentului $AD$ este egală cu:',
      choices: ['$7{,}5$ cm', '$10$ cm', '$9$ cm', '$15$ cm'], ans: 0, fig: fig7,
    },
    {
      text: 'În figura alăturată, dreptele $a$ și $b$ sunt paralele; la fel sunt dreptele $d_1$ și $d_2$. În figură sunt marcate măsurile a două dintre unghiurile care se formează. Valoarea lui $x$ este:',
      choices: ['$60^\\circ$', '$80^\\circ$', '$120^\\circ$', '$90^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'În triunghiul $ABC$, din figura alăturată, cunoaștem: $AB=120$ m, dreapta $AD$ este perpendiculară pe $BC$, $D\\in BC$, iar măsurile unghiurilor $ABC$ și $ACB$ sunt egale cu $30^\\circ$, respectiv cu $45^\\circ$. Lungimea segmentului $CD$ este egală cu:',
      choices: ['$120$ m', '$60$ m', '$30$ m', '$90$ m'], ans: 1, fig: fig9,
    },
    {
      text: 'În figura alăturată sunt reprezentate pătratul $ABCD$ și triunghiul echilateral $CMN$, unde $M,\\,N\\in AB$. Dacă $MC=4$ cm, atunci aria pătratului este:',
      choices: ['$20\\text{ cm}^2$', '$4\\sqrt{3}\\text{ cm}^2$', '$16\\text{ cm}^2$', '$12\\text{ cm}^2$'], ans: 3, fig: fig10,
    },
    {
      text: 'Cercurile din figura alăturată sunt tangente exterior, punctul de tangență fiind $B$. Segmentele $AB$ și $BC$ sunt diametre în cele două cercuri, iar $N$, $B$ și $M$ sunt puncte coliniare. Dacă măsura arcului mic $BN$ al cercului de diametru $AB$ este $140^\\circ$, atunci măsura arcului mic $MC$ al cercului de diametru $BC$ va fi egală cu:',
      choices: ['$30^\\circ$', '$170^\\circ$', '$40^\\circ$', '$140^\\circ$'], ans: 2, fig: fig11,
    },
    {
      text: 'Laboratorul unei cofetării topește o bucată cubică de ciocolată cu latura de $15$ cm și o transformă în tablete de ciocolată, având forma unor paralelipipede dreptunghice cu dimensiunile $9$ cm, $6$ cm, respectiv $1{,}5$ cm. Dacă în procesul de fabricație sunt pierderi de $20\\%$, numărul maxim de tablete de ciocolată ce pot fi obținute este:',
      choices: ['$30$', '$33$', '$34$', '$31$'], ans: 1,
    },

    {
      text: 'La Grădina Botanică, trei bilete de adulți și șase bilete de copii costă $93$ de lei, iar patru bilete de adulți și două bilete de copii costă $76$ de lei (toate biletele pentru adulți au același preț și toate biletele pentru copii au același preț).',
      parts: [
        { pts: 2, text: 'Este posibil ca prețul unui bilet pentru adulți să fie $20$ de lei? Justifică răspunsul.', ans: 'Nu: patru bilete de adulți ar costa $4\\cdot20=80>76$ de lei' },
        { pts: 3, text: 'Determină diferența dintre prețul unui bilet pentru adulți și cel al unui bilet pentru copii.', ans: '$3a+6c=93$ și $4a+2c=76$, deci $a=15$ lei, $c=8$ lei și $a-c=7$ lei' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{x^2-6x+5}{x^2-10x+25}:\\left(\\dfrac{2}{x^2-25}-\\dfrac{1}{x^2+5x}\\right)+1$, unde $x\\in\\mathbb{R}\\setminus\\{-5,\\,0,\\,5\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $E(x)\\ge x$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-5,\\,0,\\,5\\}$.', ans: '$\\dfrac{x-1}{x-5}:\\dfrac{1}{x(x-5)}+1=x^2-x+1$, iar $x^2-x+1\\ge x\\iff(x-1)^2\\ge0$, adevărat' },
        { pts: 3, text: 'Dacă $a$, $b$ sunt numere reale distincte pentru care $E(a)=E(b)$, demonstrează că $a+b=1$.', ans: '$a^2-a=b^2-b\\iff(a-b)(a+b-1)=0$; cum $a\\neq b$, $a+b=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=a\\cdot x+b$, unde $a,\\,b\\in\\mathbb{R}$, $a\\neq0$.',
      parts: [
        { pts: 2, text: 'Calculează $f(1)+f(-1)-2f(0)$.', ans: '$(a+b)+(-a+b)-2b=0$' },
        { pts: 3, text: 'Știind că $A(3,\\,0)$ și $B(0,\\,3)$ sunt punctele de intersecție a reprezentării grafice a funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$, determină numerele $a$ și $b$.', ans: '$f(0)=b=3$ și $f(3)=3a+3=0$, deci $a=-1$, $b=3$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat triunghiul dreptunghic $ABC$ cu $AB=8$ cm și $AC=6$ cm. Punctele $M$ și $N$ sunt situate pe catetele $AC$, respectiv $AB$, astfel încât $AN=3$ cm și unghiurile $MNA$ și $BCA$ sunt congruente.',
      parts: [
        { pts: 2, text: 'Arată că $BC=10$ cm.', ans: '$BC=\\sqrt{AB^2+AC^2}=\\sqrt{64+36}=10$ cm' },
        { pts: 3, text: 'Determină lungimea segmentului $MN$.', ans: '$\\triangle ANM\\sim\\triangle ACB$, deci $\\dfrac{AN}{AC}=\\dfrac{MN}{BC}$, adică $\\dfrac{3}{6}=\\dfrac{MN}{10}$ și $MN=5$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată este reprezentat un pătrat $ABCD$, în interiorul căruia se află triunghiurile echilaterale $BCN$ și $ADM$. Latura pătratului este de $12$ cm, dreptele $AM$ și $BN$ se intersectează în punctul $P$, iar dreptele $NC$ și $DM$ se intersectează în punctul $Q$.',
      parts: [
        { pts: 2, text: 'Arată că $BP=4\\sqrt{3}$ cm.', ans: '$\\sphericalangle PAB=\\sphericalangle PBA=90^\\circ-60^\\circ=30^\\circ$ și $AB=12$ cm, deci $BP=\\dfrac{AB}{2\\cos30^\\circ}=4\\sqrt{3}$ cm' },
        { pts: 3, text: 'Demonstrează că perimetrul patrulaterului $MPNQ$ este mai mic decât $20{,}32$ cm. (Se admite cunoscut că $\\sqrt{3}>1{,}73$.)', ans: '$MNPQ$ este romb cu latura $NP=BN-BP=12-4\\sqrt{3}$ cm, deci perimetrul este $48-16\\sqrt{3}<48-16\\cdot1{,}73=20{,}32$ cm' },
      ],
      fig: fig17,
    },
    {
      text: 'În figura alăturată este reprezentată o piramidă triunghiulară regulată $VABC$. Punctul $M$ este mijlocul laturii $BC$, $O$ este centrul bazei $ABC$, $AB=6$ cm și $VM=2$ cm.',
      parts: [
        { pts: 2, text: 'Arată că volumul piramidei este mai mare decât $5\\text{ cm}^3$.', ans: '$OM=\\dfrac{6\\sqrt{3}}{6}=\\sqrt{3}$ cm, $VO=\\sqrt{4-3}=1$ cm, deci $\\mathcal{V}=\\dfrac{9\\sqrt{3}\\cdot1}{3}=3\\sqrt{3}\\text{ cm}^3>5\\text{ cm}^3$, căci $27>25$' },
        { pts: 3, text: 'Determină măsura unghiului format de o față laterală cu planul bazei.', ans: '$\\sphericalangle((VBC),(ABC))=\\sphericalangle VMO$; în $\\triangle VOM$, $VO=1=\\dfrac{VM}{2}$, deci $\\sphericalangle VMO=30^\\circ$' },
      ],
      fig: fig18,
    },
  ],
}
