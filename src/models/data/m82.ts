// Testul 51 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 177–179; every answer here is computed and checked with the book's answers, p. 288).
import type { EnModel } from '../types'
import type { P3, Pt } from '../figure'
import { along, meet, mid3, plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], L: [-4, 0], R: [4, 0] }, 150, { s: 'L-R', dot: 'A', l: { A: 'n', L: '', R: '' }, t: [{ at: [3.8, 0.3], s: 'a', italic: true }] })
const fig8 = plane({ O: [0, 0], A: pol(160, 4), B: pol(-20, 4), C: pol(208, 4), D: pol(28, 4), E: pol(274, 4), F: pol(94, 4) }, 110, {
  s: 'A-B C-D E-F', l: { O: 'e' },
})
const fig9 = plane({ B: [0, 0], A: [15, 0], C: [15, 20] }, 90, { s: 'A-B-C-A', ra: ['BAC'] })
const fig10 = plane({ A: [0, 0], B: [4, 0], D: [2, 2 * s3], C: [4 + 2 * s3, 2] }, 120, { s: 'A-B-C-D-A B-D' })
const fig11 = plane({ O: [0, 0], M: [-1, 0], N: [1, 0], Q: pol(56), P: pol(236) }, 110, { s: 'M-N P-Q', c: [{ at: 'O', r: 1 }], dot: 'O', l: { O: 's' } })
const f12 = plane({ V: [0, 4.5], A: [-4, 0], B: [4, 0], O: [0, 0], T: [0, -1] }, 90, { s: 'A-V-B', d: 'V-O A-B', dot: 'O', l: { T: '', O: 's' } })
const r12 = f12.p.B[0] - f12.p.O[0]
// drawn taller than the real height 3, as in the book
const fig12 = { ...f12, e: [{ at: f12.p.O, rx: r12, ry: r12 / 4, back: true }] }

const fig15 = graph({ A: [1.25, 0], B: [0, -5], L1: [-0.2, -5.8], L2: [1.85, 2.4] }, 110, [-1.5, 3], [-6.3, 2.8], { s: 'L1-L2', dot: 'A B', l: { L1: '', L2: '', A: 'se', B: 'e' } })
const fig16 = plane({ A: [0, 0], B: [100, 0], C: [100, 300], D: [0, 300], E: [0, 200], F: [100, 100] }, 80, { s: 'A-B-C-D-A B-E D-F' })
const A17: Pt = [0, 0], B17: Pt = [14, 0], C17: Pt = [7, 5], D17: Pt = [3, 5]
const M17 = along(A17, D17, 0.4), N17 = along(B17, C17, 0.4), P17: Pt = [4, 0]
const fig17 = plane({ A: A17, B: B17, C: C17, D: D17, M: M17, N: N17, P: P17, Q: meet(M17, N17, C17, P17) }, 150, { s: 'A-B-C-D-A M-N C-P', l: { P: 's', Q: 'ne' } })
const b18 = box(8, 5, 7)
const N18: P3 = [8, 0, 4], P18: P3 = [0, 5, 5]
const fig18 = solid({ ...b18, M: [0, 0, 2], N: N18, P: P18, O: [4, 2.5, 0], Q: mid3(N18, P18) }, BOX, 150, { seg: 'N-P O-Q A-C B-D', dot: 'M N P O Q', l: { M: 'w', N: 'e', Q: 'n' } })

export const M82: EnModel = {
  id: 'en-82',
  title: 'Paralela 45, Testul 51',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 177–179',
  items: [
    { text: 'Sfertul numărului $2^{10}$ este:', choices: ['$2^5$', '$256$', '$2^9$', '$512$'], ans: 1 },
    {
      text: 'Vârstele elevilor din lotul național de matematică sunt reprezentate în tabelul de mai jos.\n\n| Vârsta (ani) | $15$ | $16$ | $17$ | $18$ | $19$ |\n|---|---|---|---|---|---|\n| Număr elevi | $1$ | $3$ | $5$ | $8$ | $4$ |\n\nNumărul elevilor din lot este:',
      choices: ['$21$', '$20$', '$16$', '$17$'], ans: 0,
    },
    { text: 'Considerăm numărul $a=|x-3y+5|-2\\cdot|2x+y+1|$. Valoarea numărului $a$ pentru $x=-3$ și $y=2$ este:', choices: ['$-3$', '$-2$', '$2$', '$3$'], ans: 1 },
    {
      text: 'Considerăm propozițiile:\n\n$p$: $\\dfrac{1}{4}$ din $1$ ha $=250\\text{ m}^2$;\n\n$q$: $0{,}7$ din $1\\text{ m}^3=70$ l;\n\n$r$: $\\dfrac{4}{5}$ din $1$ tonă $=800$ kg;\n\n$s$: $\\dfrac{2}{3}$ din $1$ oră $=40$ min.\n\nDintre aceste propoziții, cele adevărate sunt:',
      choices: ['$p$ și $q$', '$p$ și $r$', '$r$ și $s$', '$q$ și $s$'], ans: 2,
    },
    { text: 'Fie intervalul $A=(-4,\\,2)$ și mulțimea $B=\\left\\{-\\dfrac{3}{2};\\,\\sqrt{3};\\,1{,}7;\\,\\sqrt{5}\\right\\}$. Cel mai mare element din $A\\cap B$ este:', choices: ['$\\sqrt{3}$', '$1{,}7$', '$\\sqrt{5}$', '$1{,}9$'], ans: 0 },
    { text: 'Andrei afirmă: „Există un număr real $x$, astfel încât $(x-2)^2=x^2-4$”. Afirmația lui Andrei este:', choices: ['adevărată', 'falsă'], ans: 0 },

    {
      text: 'Pe o dreaptă $a$ considerăm un punct $A$ (vezi figura alăturată). Numărul punctelor, de pe dreapta $a$, situate la doi cm de $A$ este:',
      choices: ['nici unul', '$1$', '$2$', 'o infinitate'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată sunt reprezentate dreptele $AB$, $CD$ și $EF$ concurente în punctul $O$. Dacă măsura unghiului $AOC$ este egală cu $48^\\circ$, iar semidreapta $OE$ este bisectoarea unghiului $BOC$, atunci măsura unghiului $BOF$ este egală cu:',
      choices: ['$90^\\circ$', '$96^\\circ$', '$100^\\circ$', '$114^\\circ$'], ans: 3, fig: fig8,
    },
    {
      text: 'Triunghiul dreptunghic $ABC$, din figura alăturată, are cateta $AB=15$ cm și $\\sin(\\sphericalangle ABC)=0{,}8$. Lungimea celeilalte catete este:',
      choices: ['$15$ cm', '$30$ cm', '$20$ cm', '$25$ cm'], ans: 2, fig: fig9,
    },
    {
      text: 'În patrulaterul $ABCD$ din figura alăturată, triunghiul $ABD$ este echilateral, $AB=BC=4$ cm, iar $\\sphericalangle ABC=150^\\circ$. Aria patrulaterului, calculată cu o zecimală exactă, este:',
      choices: ['$17{,}4\\text{ cm}^2$', '$14{,}8\\text{ cm}^2$', '$14{,}9\\text{ cm}^2$', '$15\\text{ cm}^2$'], ans: 2, fig: fig10,
    },
    {
      text: 'În figura alăturată, $MN$ este diametru în cercul de centru $O$ și rază $R$, iar $PQ$ este o coardă, astfel încât $\\sphericalangle QON=56^\\circ$. Măsura unghiului $MPQ$ este egală cu:',
      choices: ['$62^\\circ$', '$28^\\circ$', '$124^\\circ$', '$90^\\circ$'], ans: 0, fig: fig11,
    },
    {
      text: 'Un cort are forma unui con circular drept cu raza bazei de $4$ m și înălțimea de $3$ m (vezi figura alăturată). Dacă o persoană are nevoie de $5\\text{ m}^3$ de aer, atunci numărul maxim de persoane care pot dormi în acest cort este:',
      choices: ['$8$', '$10$', '$20$', '$9$'], ans: 1, fig: fig12,
    },

    {
      text: 'Într-un coș sunt mere. Ionuț și Andrei iau mere din coș. Mai întâi Ionuț ia jumătate din numărul merelor din coș și încă un măr, apoi Andrei ia jumătate din numărul merelor rămase și încă un măr.',
      parts: [
        { pts: 2, text: 'Dacă în coș erau zece mere, câte mere au rămas în coș?', ans: 'Ionuț ia $5+1=6$, rămân $4$; Andrei ia $2+1=3$, deci rămâne $1$ măr' },
        { pts: 3, text: 'Dacă în coș rămân două mere, câte mere erau la început în coș?', ans: 'Înainte de Andrei erau $2\\cdot(2+1)=6$ mere, iar la început $2\\cdot(6+1)=14$ mere' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\left(\\dfrac{x+2}{3}-\\dfrac{3}{x+2}\\right):\\dfrac{x^2+6x+5}{3x+6}+\\dfrac{2}{x+1}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,-5,\\,-1\\}$.',
      parts: [
        { pts: 2, text: 'Calculează $E(0)$.', ans: '$E(0)=\\left(\\dfrac{2}{3}-\\dfrac{3}{2}\\right):\\dfrac{5}{6}+2=-1+2=1$' },
        { pts: 3, text: 'Arată că $E(x)=1$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-5,\\,-2,\\,-1\\}$.', ans: '$E(x)=\\dfrac{(x+5)(x-1)}{3(x+2)}\\cdot\\dfrac{3(x+2)}{(x+1)(x+5)}+\\dfrac{2}{x+1}=\\dfrac{x-1+2}{x+1}=1$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=(3b-5a)x+a-2b$, $a,\\,b\\in\\mathbb{R}$.',
      parts: [
        { pts: 2, text: 'Determină $a$ și $b$, știind că punctele $M(-1,\\,-9)$ și $N(2,\\,3)$ sunt situate pe reprezentarea grafică a funcției $f$ în sistemul de axe ortogonale $xOy$.', ans: '$6a-5b=-9$ și $-9a+4b=3$, deci $a=1$, $b=3$' },
        { pts: 3, text: 'Pentru $a=1$ și $b=3$, arată că $f(x)=4x-5$ și calculează $\\operatorname{tg}(\\sphericalangle OAB)$, unde $A$ și $B$ sunt punctele de intersecție a graficului funcției $f$ cu axele $Ox$, respectiv $Oy$ ale sistemului de axe ortogonale $xOy$.', ans: '$f(x)=(9-5)x+1-6=4x-5$; $A\\left(\\dfrac{5}{4},\\,0\\right)$, $B(0,\\,-5)$, deci $\\operatorname{tg}(\\sphericalangle OAB)=\\dfrac{OB}{OA}=4$' },
      ],
      fig: fig15,
    },
    {
      text: 'În figura alăturată este reprezentat schematic un teren în formă de dreptunghi cu $AB=100$ m și $AD=300$ m. Terenul este împărțit în trei părți de arii egale prin drumurile $BE$ și $DF$, $E\\in AD$, $F\\in BC$.',
      parts: [
        { pts: 2, text: 'Arată că $DF\\parallel BE$.', ans: '$\\mathcal{A}_{ABE}=\\mathcal{A}_{DCF}=10000\\text{ m}^2$, deci $AE=CF=200$ m, $DE=BF=100$ m; cum $BF\\parallel DE$, $DEBF$ este paralelogram, deci $DF\\parallel BE$' },
        { pts: 3, text: 'Împrejmuim terenul $DFBE$ cu un gard. Arată că lungimea gardului este mai mică de $650$ m.', ans: '$BE=DF=\\sqrt{100^2+200^2}=100\\sqrt{5}$ m, deci gardul are $200\\left(1+\\sqrt{5}\\right)$ m; $\\sqrt{5}<2{,}25$, deci lungimea $<650$ m' },
      ],
      fig: fig16,
    },
    {
      text: 'Fie $ABCD$ un trapez, $AB\\parallel CD$, $AB=14$ cm, $CD=4$ cm și punctele $M\\in(AD)$, $N\\in(BC)$, $MN\\parallel AB$ și $\\dfrac{AM}{MD}=\\dfrac{2}{3}$. Paralela prin $C$ la $AD$ intersectează dreptele $MN$ și $AB$ în punctele $Q$, respectiv $P$ (vezi figura alăturată).',
      parts: [
        { pts: 2, text: 'Calculează lungimea segmentului $MN$.', ans: '$MQ=AP=DC=4$ cm, $PB=10$ cm; $\\triangle CQN\\sim\\triangle CPB$: $\\dfrac{QN}{PB}=\\dfrac{CN}{CB}=\\dfrac{3}{5}$, deci $QN=6$ cm și $MN=10$ cm' },
        { pts: 3, text: 'Demonstrează că $MP\\parallel BC$.', ans: '$MN\\parallel PB$ și $MN=PB=10$ cm, deci $MPBN$ este paralelogram și $MP\\parallel BN$, adică $MP\\parallel BC$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentat un paralelipiped dreptunghic $ABCDA'B'C'D'$ cu înălțimea $AA'=7$ cm. Pe muchiile $AA'$, $BB'$ și $DD'$ se consideră punctele $M$, $N$, respectiv $P$ astfel încât $AM=2$ cm, $BN=4$ cm și $DP=5$ cm. Punctul $O$ este centrul bazei $ABCD$, iar $Q$ este mijlocul segmentului $NP$.",
      parts: [
        { pts: 2, text: 'Arată că lungimea segmentului $OQ$ este egală cu $4{,}5$ cm.', ans: '$OQ$ este linie mijlocie în trapezul $BDPN$, deci $OQ=\\dfrac{BN+DP}{2}=4{,}5$ cm' },
        { pts: 3, text: "Demonstrează că punctele $M$, $N$, $P$ și $C'$ sunt coplanare.", ans: "$OQ\\parallel BN$, deci $OQ\\perp(ABC)$. Dacă $Q'$ este mijlocul lui $MC'$, atunci $OQ'\\perp(ABC)$ și $OQ'=\\dfrac{AM+CC'}{2}=4{,}5$ cm (linie mijlocie în trapezul $ACC'M$), deci $Q'=Q$: dreptele $MC'$ și $NP$ sunt concurente, iar punctele sunt coplanare" },
      ],
      fig: fig18,
    },
  ],
}
