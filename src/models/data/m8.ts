// Model E.N. 8 (the book's pages 122–123)
import type { EnModel } from '../types'
import { along, meet, onCircle, type Pt } from '../figure'

const H9: Pt = [60, 52]
const hex9 = (deg: number) => onCircle(H9, 42, deg)

const O10: Pt = [62, 62]

const A11: Pt = [12, 102], B11: Pt = [102, 102], C11: Pt = [102, 12], D11: Pt = [12, 12]
const E11 = along(A11, B11, 2 / 3)

export const M8: EnModel = {
  id: 'en-8',
  title: 'Model E.N. 8',
  source: 'Modele de teste pentru Evaluarea Națională, pag. 122–123',
  items: [
    { text: 'Rezultatul calculului $416:2^2-10^2$ este egal cu:', choices: ['$-86$', '$-6$', '$-84$', '$4$'], ans: 3 },
    { text: 'Media aritmetică a numerelor $7-3\\sqrt{6}$ și $7+3\\sqrt{6}$ este:', choices: ['$5$', '$7$', '$14$', '$-5$'], ans: 1 },
    { text: 'Scrierea sub formă zecimală a numărului $\\dfrac{15}{4}$ este:', choices: ['$3{,}75$', '$3{,}25$', '$3{,}(7)$', '$3{,}3$'], ans: 0 },
    {
      text: 'În graficul alăturat sunt reprezentate rezultatele (în procente) obținute la o lucrare de cei $20$ de elevi ai unei clase. Numărul de elevi cu note sub $6$ este egal cu:',
      choices: ['$3$', '$2$', '$4$', '$5$'], ans: 1,
      fig: {
        w: 190, h: 112,
        p: { K: [30, 25], L: [60, 25], N: [30, 60], P: [110, 60] },
        l: { K: '', L: '', N: '', P: '' },
        axes: { o: [30, 95], x: [30, 185], y: [95, 6] },
        d: 'K-L N-P',
        path: [{ d: 'M60 95 V25 H95 V95', hatch: true }, { d: 'M110 95 V60 H150 V95', hatch: true }],
        t: [
          { at: [24, 12], s: '%', anchor: 'end' }, { at: [25, 29], s: '60%', anchor: 'end', size: 11 }, { at: [25, 64], s: '30%', anchor: 'end', size: 11 },
          { at: [78, 20], s: '6 sau 7' }, { at: [130, 55], s: '8, 9 sau 10' }, { at: [185, 108], s: 'nota', anchor: 'end' },
        ],
      },
    },
    { text: 'Soluția ecuației $x-0{,}5-0{,}(3)x=\\dfrac{x+3}{6}$ este:', choices: ['$1{,}4$', '$2$', '$1$', '$-2$'], ans: 1 },
    {
      text: 'Pentru funcția cu tabelul de valori alăturat, numărul elementelor imaginii funcției este:\n\n| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ |\n|---|---|---|---|---|---|\n| $f(x)$ | $2$ | $1$ | $-1$ | $1$ | $0$ |',
      choices: ['$5$', '$4$', '$3$', '$2$'], ans: 1,
    },

    {
      text: 'În desenul alăturat $A$ este simetricul lui $C$ față de $B$, $B$ este simetricul lui $C$ față de $D$ și $CD=3$ cm. Lungimea lui $AC$ este:',
      choices: ['$6$ cm', '$9$ cm', '$12$ cm', '$15$ cm'], ans: 2,
      fig: { w: 150, h: 34, p: { A: [15, 24], B: [75, 24], D: [105, 24], C: [135, 24] }, l: { A: 'n', B: 'n', D: 'n', C: 'n' }, s: 'A-C', dot: 'A B D C' },
    },
    { text: 'În $\\triangle ABC$ cu $\\sphericalangle A=90^\\circ$ și $BC=24$ cm, distanța între centrul de greutate și centrul cercului circumscris este:', choices: ['$8$ cm', '$6$ cm', '$9$ cm', '$4$ cm'], ans: 3 },
    {
      text: 'În hexagonul regulat $ABCDEF$ cu $AB=5$ cm, lungimea lui $AC$ este:',
      choices: ['$5$ cm', '$5\\sqrt{2}$ cm', '$5\\sqrt{3}$ cm', '$10$ cm'], ans: 2,
      fig: { w: 125, h: 105, p: { A: hex9(240), B: hex9(300), C: hex9(0), D: hex9(60), E: hex9(120), F: hex9(180) }, s: 'A-B-C-D-E-F-A A-C' },
    },
    {
      text: 'În cercul de arie $36\\pi\\text{ cm}^2$ se poate înscrie triunghiul echilateral care are aria de:',
      choices: ['$27\\sqrt{3}\\text{ cm}^2$', '$54\\sqrt{3}\\text{ cm}^2$', '$36\\sqrt{3}\\text{ cm}^2$', '$27\\text{ cm}^2$'], ans: 0,
      fig: { w: 125, h: 125, p: { A: onCircle(O10, 50, 90), B: onCircle(O10, 50, 210), C: onCircle(O10, 50, 330) }, s: 'A-B-C-A', c: [{ at: O10, r: 50 }] },
    },
    {
      text: 'În pătratul $ABCD$ de latură $15$ cm, punctul $E\\in AB$ astfel încât $AE=2\\cdot EB$. Dacă $AC\\cap DE=\\{O\\}$, atunci $d(O;AB)$ este:',
      choices: ['$5$ cm', '$6$ cm', '$7$ cm', '$4$ cm'], ans: 1,
      fig: { w: 115, h: 118, p: { A: A11, B: B11, C: C11, D: D11, E: E11, O: meet(A11, C11, D11, E11) }, l: { E: 's', O: 'e' }, s: 'A-B-C-D-A A-C D-E' },
    },
    { text: 'O piramidă patrulateră are toate muchiile egale. Dacă suma lungimilor tuturor muchiilor este egală cu $72$ cm, atunci volumul este egal cu:', choices: ['$121{,}5\\sqrt{2}\\text{ cm}^3$', '$121{,}5\\sqrt{3}\\text{ cm}^3$', '$729\\sqrt{2}\\text{ cm}^3$', '$243\\sqrt{2}\\text{ cm}^3$'], ans: 0 },

    {
      text: 'La o librărie s-au vândut într-o zi $100$ de caiete și cărți în valoare totală de $324$ de lei. Un caiet costă $2{,}40$ lei, iar o carte $8$ lei.',
      parts: [
        { pts: 2, text: 'Aflați câte caiete s-au vândut.', ans: '$85$ de caiete' },
        { pts: 3, text: 'Aflați câte cărți s-au vândut.', ans: '$15$ cărți' },
      ],
    },
    {
      text: '',
      parts: [
        { pts: 2, text: 'Să se simplifice raportul $\\dfrac{x^2-5x+4}{2x-8}$, unde $x\\in\\mathbb{R}\\setminus\\{4\\}$.', ans: '$\\dfrac{x-1}{2}$' },
        { pts: 3, text: 'Arătați că pentru orice $x\\in(-3;1)$ expresia $E(x)=|x+3|+\\sqrt{(x-1)^2}$ este constantă.', ans: '$x-1<0\\Rightarrow |x-1|=1-x$, $x+3>0\\Rightarrow |x+3|=x+3$, deci $E(x)=4$' },
      ],
    },
    {
      text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=(1-m)x+n-2$.',
      parts: [
        { pts: 2, text: 'Aflați $m$ și $n$ dacă punctele $A(0;4)$ și $B(1;2)$ aparțin graficului funcției.', ans: '$m=3$ și $n=6$' },
        { pts: 3, text: 'Determinați tangenta unghiului format de graficul funcției cu axa ordonatelor.', ans: '$\\dfrac{1}{2}$' },
      ],
    },
    {
      text: 'Figura alăturată reprezintă schița unei grădini, în formă de pătrat, care a fost împărțită în trei parcele: I, II și III. Aria grădinii este $100\\text{ m}^2$.',
      parts: [
        { pts: 2, text: 'Aflați aria parcelei în formă de dreptunghi (I).', ans: '$40\\text{ m}^2$' },
        { pts: 3, text: 'Dacă fiecare parcelă este înconjurată de un gard, arătați că lungimea gardului parcelei III este mai mare decât cea a parcelei I ($\\sqrt{2}=1{,}41$).', ans: '$P_I=28$ m, $P_{III}=20+6\\sqrt{2}=28{,}46$ m $\\Rightarrow P_{III}>P_I$' },
      ],
      fig: {
        w: 140, h: 125,
        p: { K: [12, 18], L: [112, 18], N: [112, 118], P: [12, 118], Q: [12, 58], R: [112, 58], S: [52, 58] },
        l: { K: '', L: '', N: '', P: '', Q: '', R: '', S: '' },
        s: 'K-L-N-P-K Q-R S-N',
        t: [{ at: [62, 42], s: 'I' }, { at: [96, 76], s: 'II' }, { at: [50, 96], s: 'III' }, { at: [32, 72], s: '4 m', size: 11 }, { at: [116, 42], s: '4 m', anchor: 'start', size: 11 }],
      },
    },
    {
      text: 'Figura alăturată reprezintă schița unei mese formată dintr-un dreptunghi $ABCD$ a cărui lungime este de $5$ m și două semicercuri. Lungimea unui semicerc este de $2\\pi$ m.',
      parts: [
        { pts: 2, text: 'Să se afle aria suprafeței mesei.', ans: '$20+4\\pi\\text{ m}^2$' },
        { pts: 3, text: 'Considerând că în punctele $A$ și $C$ stă câte o persoană, să se afle distanța dintre ele.', ans: '$\\sqrt{41}$ m' },
      ],
      fig: {
        w: 168, h: 86,
        p: { A: [45, 72], B: [120, 72], C: [120, 12], D: [45, 12] },
        l: { A: 'se', B: 'sw', C: 'nw', D: 'ne' },
        s: 'A-B-C-D-A', path: [{ d: 'M45 12 A30 30 0 0 0 45 72' }, { d: 'M120 12 A30 30 0 0 1 120 72' }],
      },
    },
    {
      text: 'Un cornet de înghețată are forma unui con circular drept cu $r=4$ cm și aria totală de $96\\pi\\text{ cm}^2$. În vârful cornetului se află un volum de $\\dfrac{2\\pi\\sqrt{6}}{3}\\text{ cm}^3$ de ciocolată în formă de con, restul fiind plin cu înghețată.',
      parts: [
        { pts: 2, text: 'Calculați înălțimea până la care se ridică ciocolata în cornet.', ans: '$h=8\\sqrt{6}$ cm, ciocolata urcă la $2\\sqrt{6}$ cm' },
        { pts: 3, text: 'Arătați că în cornet sunt cel puțin $323$ ml de înghețată.', ans: '$42\\pi\\sqrt{6}>323$' },
      ],
      fig: {
        w: 122, h: 145, p: { K: [10, 18], L: [110, 18], V: [60, 138] }, l: { K: '', L: '', V: '' },
        s: 'K-V-L', e: [{ at: [60, 18], rx: 50, ry: 10 }, { at: [60, 108], rx: 12.5, ry: 2.5, dashed: true }],
      },
    },
  ],
}
