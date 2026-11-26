// Testul 23 (Popa, Zanoschi, Iurea, Luchian, Evaluarea Națională 2026, Matematică, clasa a VIII-a, Paralela 45,
// pages 118–120; every answer here is computed and checked with the book's answers, p. 278).
import type { EnModel } from '../types'
import { plane, solid } from '../figure'
import { box, BOX, graph, pol } from './shapes'

const s3 = Math.sqrt(3)

const fig7 = plane({ A: [0, 0], B: [1, 0], C: [2, 0], D: [3, 0] }, 160, { s: 'A-D', dot: 'A B C D', l: { A: 'n', B: 'n', C: 'n', D: 'n' } })
const fig8 = plane({ A: [3, 4], B: [0, 0], C: [5, 0], X: [2.2, 5.6], Y: [-0.9, -1.2], Z: [6.6, 0] }, 120, { s: 'C-X A-Y B-Z', ang: ['XAB', 'YBC', 'ZCA'] })
const fig9 = plane({ A: [0, 35 * s3], B: [-35, 0], C: [0, -35 * s3], D: [35, 0], O: [0, 0] }, 80, { s: 'A-B-C-D-A', dot: 'O', l: { O: '' } })
const fig10 = plane({ A: [0, 0], B: [16, 0], C: [16, 12], D: [0, 12], E: [8, 0], F: [13, 12], G: [0, 6] }, 140, { s: 'A-B-C-D-A E-F G-E' })
const fig11 = plane({ O: [0, 0], A: pol(90, 5), B: pol(190, 5), C: pol(-10, 5), M: pol(40, 5), P: pol(270, 5) }, 110, {
  s: 'A-B-C-A M-P B-P', c: [{ at: 'O', r: 5 }], l: { O: '' },
})

const fig15 = graph({ A: [-4, 0], L1: [-1, 5], L2: [5, -1] }, 120, [-5, 5.5], [-1.5, 5.5], { s: 'L1-L2', dot: 'A', l: { L1: '', L2: '', A: 'n', O: 'sw' } })
const fig16 = plane({ A: [0, 0], B: [4 * s3, 0], C: [4 * s3, 4], D: [0, 4], M: [4, 4], O: [2.536, 2.536] }, 140, { s: 'A-B-C-D-A A-M B-D', l: { O: 'e' } })
const fig17 = plane({ A: [-4, 0], B: [0, 0], D: [8, 0], C: [0, 4], E: [0, 8] }, 120, { s: 'A-D-E-B A-C', ra: ['ABC'] })
const fig18 = solid({ ...box(6, 6, 6), O1: [6, 3, 3] }, BOX, 120, { seg: "B-C' B'-C", dot: 'O1' })

export const M54: EnModel = {
  id: 'en-54',
  title: 'Paralela 45, Testul 23',
  source: 'Evaluarea Națională 2026, Matematică, clasa a VIII-a (Popa, Zanoschi, Iurea, Luchian, Paralela 45), pag. 118–120',
  items: [
    { text: 'Numărul divizorilor naturali ai numărului $24$ este:', choices: ['$2$', '$4$', '$6$', '$8$'], ans: 3 },
    { text: 'Andrei și Bianca au vârstele (exprimate în ani) invers proporționale cu $3$, respectiv $4$, iar suma acestor vârste este egală cu $49$ ani. Bianca are:', choices: ['$28$ ani', '$27$ ani', '$24$ ani', '$21$ ani'], ans: 3 },
    {
      text: 'În tabelul alăturat sunt prezentate datele celor trei războaie punice purtate între Roma și Cartagina. În câți ani din perioada $264-146$ î.Hr., Roma și Cartagina nu s-au luptat?\n\n| Primul război punic | Al doilea război punic | Al treilea război punic |\n|---|---|---|\n| $264-241$ î.Hr. | $218-201$ î.Hr. | $149-146$ î.Hr. |',
      choices: ['$71$', '$72$', '$73$', '$74$'], ans: 2,
    },
    { text: 'Rezultatul calculului $\\left(\\dfrac{2}{3}+\\dfrac{1}{6}\\right)\\cdot2{,}4$ este:', choices: ['$0{,}4$', '$1{,}2$', '$2$', '$4$'], ans: 2 },
    {
      text: 'În tabelul alăturat sunt trecute aproximările găsite pentru numărul irațional $2\\sqrt{3}$ de patru elevi, Alexandra, Ilinca, Maria și Victor. Dintre cei patru elevi, cea mai bună aproximare a găsit-o:\n\n| Alexandra | Ilinca | Maria | Victor |\n|---|---|---|---|\n| $2$ | $3$ | $5$ | $6$ |',
      choices: ['Alexandra', 'Ilinca', 'Maria', 'Victor'], ans: 1,
    },
    { text: 'Bunica lui Radu are de urmat un tratament de $10$ zile în care trebuie să ia câte o pastilă galbenă la $6$ ore și câte două pastile verzi la $8$ ore. Radu a cumpărat de la farmacie, pentru tratamentul bunicii, $40$ de pastile galbene și $60$ de pastile verzi. Radu a procedat bine?', choices: ['da', 'nu'], ans: 0 },

    {
      text: 'În figura alăturată sunt reprezentate punctele coliniare $A$, $B$, $C$ și $D$, în această ordine, astfel încât $AB=BC=CD$, iar lungimea segmentului $AC$ este egală cu $36$ cm. Lungimea segmentului $AD$ este egală cu:',
      choices: ['$18$ cm', '$42$ cm', '$54$ cm', '$108$ cm'], ans: 2, fig: fig7,
    },
    {
      text: 'În figura alăturată, $a$, $b$, $c$ sunt măsurile unghiurilor exterioare $XAB$, $YBC$, respectiv $ZCA$ ale triunghiului $ABC$. Suma $a+b+c$ este egală cu:',
      choices: ['$90^\\circ$', '$180^\\circ$', '$360^\\circ$', '$540^\\circ$'], ans: 2, fig: fig8,
    },
    {
      text: 'O ramă are forma unui romb $ABCD$, cu $\\sphericalangle B=120^\\circ$ și $BD=70$ cm, ca în figura alăturată. Lungimea minimă a unei ghirlande care se aplică pe ramă este:',
      choices: ['$1{,}4$ m', '$2$ m', '$2{,}8$ m', '$3$ m'], ans: 2, fig: fig9,
    },
    {
      text: 'În figura alăturată este reprezentat un dreptunghi $ABCD$ cu $AB=16$ m și $BC=12$ m. Punctele $E$, $F$, $G$ sunt situate pe laturile $AB$, $CD$, respectiv $AD$, astfel încât $AE=EB$, $EG=10$ m și $CF=3$ m. Aria patrulaterului $EFDG$ este egală cu:',
      choices: ['$90\\text{ m}^2$', '$102\\text{ m}^2$', '$160\\text{ m}^2$', '$192\\text{ m}^2$'], ans: 1, fig: fig10,
    },
    {
      text: 'În figura alăturată este reprezentat un cerc în care este înscris triunghiul isoscel $ABC$, cu $AB=AC$ și $\\sphericalangle BAC=80^\\circ$. Punctul $M$ este mijlocul arcului mic $AC$, iar $P$ este un punct oarecare pe arcul mic $BC$. Măsura unghiului $MPB$ este egală cu:',
      choices: ['$50^\\circ$', '$75^\\circ$', '$100^\\circ$', '$150^\\circ$'], ans: 1, fig: fig11,
    },
    { text: 'Corina are două cutii de suc. Prima cutie are forma unei prisme triunghiulare regulate cu latura bazei de $6$ cm și muchia laterală de $8$ cm. A doua cutie are forma unui cub cu latura de $5$ cm. Dintre cele două cutii, cea cu volumul mai mare este:', choices: ['prima cutie', 'a doua cutie', 'au același volum', 'nu se poate preciza'], ans: 1 },

    {
      text: 'O fermă a vândut, în trei zile, $1000$ kg de struguri. În primele două zile a vândut $640$ kg de struguri, iar cantitatea vândută în a doua zi este cu $40$ kg mai mare decât dublul cantității vândute în prima zi.',
      parts: [
        { pts: 2, text: 'Află ce cantitate de struguri a vândut ferma în a treia zi.', ans: '$1000-640=360$ kg' },
        { pts: 3, text: 'Determină cantitatea de struguri vândută în prima zi.', ans: '$x+2x+40=640$, deci $x=200$ kg' },
      ],
    },
    {
      text: 'Se consideră expresia $E(x)=\\dfrac{3x-7}{9x^2-1}+\\dfrac{3}{3x^2+2x-1}\\cdot\\left(1+\\dfrac{3x+x^2}{x+3}\\right)$, unde $x\\in\\mathbb{R}\\setminus\\left\\{-3,\\,-1,\\,-\\dfrac{1}{3},\\,\\dfrac{1}{3}\\right\\}$.',
      parts: [
        { pts: 2, text: 'Arată că $3x^2+2x-1=(x+1)(3x-1)$, pentru orice număr real $x$.', ans: '$(x+1)(3x-1)=3x^2-x+3x-1=3x^2+2x-1$' },
        { pts: 3, text: 'Rezolvă, în mulțimea numerelor reale, inecuația $E(x)>0$.', ans: '$1+\\dfrac{3x+x^2}{x+3}=\\dfrac{(x+1)(x+3)}{x+3}=x+1$, deci $E(x)=\\dfrac{3x-7}{9x^2-1}+\\dfrac{3}{3x-1}=\\dfrac{12x-4}{9x^2-1}=\\dfrac{4}{3x+1}$; $E(x)>0\\Leftrightarrow3x+1>0$, deci $x\\in\\left(-\\dfrac{1}{3},\\,\\infty\\right)\\setminus\\left\\{\\dfrac{1}{3}\\right\\}$' },
      ],
    },
    {
      text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=4-x$.',
      parts: [
        { pts: 2, text: 'Determină $m\\in\\mathbb{R}$, pentru care punctul $P(m,\\,3m)$ aparține graficului funcției $f$.', ans: '$4-m=3m$, deci $m=1$' },
        { pts: 3, text: 'Calculează distanța de la punctul $A(-4,\\,0)$ la reprezentarea grafică a funcției $f$.', ans: 'Graficul taie axele în $B(4,\\,0)$ și $C(0,\\,4)$, cu $\\sphericalangle OBC=45^\\circ$; $AB=8$, deci distanța este $AB\\cdot\\sin45^\\circ=4\\sqrt{2}$' },
      ],
      fig: fig15,
    },
    {
      text: 'Dreptunghiul $ABCD$ din figura alăturată are dimensiunile $AB=4\\sqrt{3}$ cm și $AD=4$ cm. Se știe că $AM$ este bisectoarea unghiului $BAD$ și $\\{O\\}=AM\\cap BD$.',
      parts: [
        { pts: 2, text: 'Arată că măsura unghiului $BOM$ este $75^\\circ$.', ans: '$DA=\\dfrac{DB}{2}$, deci $\\sphericalangle ABD=30^\\circ$, iar $\\sphericalangle BOM=\\sphericalangle OAB+\\sphericalangle OBA=45^\\circ+30^\\circ=75^\\circ$' },
        { pts: 3, text: 'Calculează lungimea segmentului $DO$.', ans: '$AD=DM=4$ cm, $BD=8$ cm; $\\triangle DOM\\sim\\triangle BOA$: $\\dfrac{DO}{8-DO}=\\dfrac{DM}{AB}=\\dfrac{1}{\\sqrt{3}}$, deci $DO=4(\\sqrt{3}-1)$ cm' },
      ],
      fig: fig16,
    },
    {
      text: 'În figura alăturată sunt desenate două triunghiuri dreptunghice isoscele $ABC$ și $BDE$ cu ipotenuzele $AC=4\\sqrt{2}$ cm, respectiv $DE=8\\sqrt{2}$ cm.',
      parts: [
        { pts: 2, text: 'Află lungimea segmentului $AE$.', ans: '$AB=4$ cm, $BE=8$ cm, deci $AE=\\sqrt{16+64}=4\\sqrt{5}$ cm' },
        { pts: 3, text: 'Demonstrează că dreptele $AE$ și $CD$ sunt perpendiculare.', ans: '$\\sphericalangle CAB=\\sphericalangle EDB=45^\\circ$, deci $AC\\perp DE$; în $\\triangle ADE$, $EB$ și $AC$ sunt înălțimi, deci $C$ e ortocentrul și $DC\\perp AE$' },
      ],
      fig: fig17,
    },
    {
      text: "În figura alăturată este reprezentată o cutie în formă de cub $ABCDA'B'C'D'$. Punctul $O_1$ este centrul feței $BCC'B'$ și $AO_1=3\\sqrt{6}$ dm.",
      parts: [
        { pts: 2, text: 'Arată că $240\\text{ dm}^2$ de carton ajung pentru a confecționa cutia, știind că în procesul de fabricație se pierde $10\\%$ din cartonul folosit.', ans: "$AO_1^2=a^2+\\dfrac{a^2}{2}=54$, deci $a=6$ dm și aria cutiei este $216\\text{ dm}^2$; $240-10\\%\\cdot240=216$, deci ajung" },
        { pts: 3, text: "Arată că dreapta $A'C$ este perpendiculară pe planul $C'BD$.", ans: "$CB=CD=CC'=6$ dm și $A'B=A'D=A'C'=6\\sqrt{2}$ dm, deci $C$ și $A'$ sunt la egală distanță de $B$, $D$, $C'$ și $A'C\\perp(C'BD)$" },
      ],
      fig: fig18,
    },
  ],
}
