// "Exerciții și probleme recapitulative pentru evaluarea finală", grade VIII (Matematică. Clasa a VIII-a, pages
// 169–175, answers on pages 239–241), as in the book. Where the answers did not hold, they are corrected here, with a
// note (the user is asked about each).
import { along3, foot3, mid3, solid, type P3 } from '../figure'
import type { Recap, RecapItem } from '../recap'
import { BOX, PRISM3, PYR4, TETRA, box, prism3, tetra } from './shapes'

// ---------- the figures ----------
const gA1 = solid(box(2 * Math.sqrt(11), 10, 9), BOX, 170, { seg: "A-C' B-C'" })

const cube8 = box(8, 8, 8)
const gA2 = solid({ ...cube8, O: mid3(cube8.A, cube8.C) }, BOX, 160, { seg: "A-C B-D A-D' D'-C A-B' B'-C O-B' O-D'", l: { O: 's' } })

const t3 = tetra(12, ['A', 'B', 'C', 'D'])
const gA3 = solid({ ...t3, M: mid3(t3.D, t3.C), N: mid3(t3.A, t3.B), P: mid3(t3.A, t3.C) }, TETRA('A', 'B', 'C', 'D'), 180, { seg: 'M-N M-P N-P C-N', l: { N: 's', P: 'w', M: 'e' } })

const p4: Record<string, P3> = { A: [0, 0, 0], B: [8, 0, 0], C: [8, 8, 0], D: [0, 8, 0], V: [4, 4, 3] }
const gA4 = solid({ ...p4, O: [4, 4, 0], M: mid3(p4.B, p4.C), N: mid3(p4.A, p4.D) }, PYR4, 190, { seg: 'V-O O-M V-M O-N V-N', l: { O: 's' } })

const s3 = Math.sqrt(3)
// B in front, A and C at the back (else C hides behind B′)
const f5: Record<string, P3> = {
  A: [0, 12 * s3, 0], B: [12, 0, 0], C: [24, 12 * s3, 0], "A'": [6, 10 * s3, 6], "B'": [12, 4 * s3, 6], "C'": [18, 10 * s3, 6], O: [12, 8 * s3, 0], "O'": [12, 8 * s3, 6],
}
const gA5 = solid(f5, PRISM3, 200, { seg: "O-O' A'-B A'-C", l: { O: 's', "O'": 'n', "B'": 'e' } })

const b6 = box(6, 6 * Math.sqrt(7), 6 * Math.sqrt(2))
const gA6 = solid({ ...b6, E: foot3(b6.A, b6.B, b6.D) }, BOX, 170, { seg: "B-C' A-D' B-D A-E D'-E", l: { E: 'n' } })

const p7 = prism3(8, 6)
const gA7 = solid({ ...p7, O: mid3(p7.A, p7["B'"]), "O'": mid3(p7.B, p7["C'"]) }, PRISM3, 180, { seg: "A-B' B-A' B-C' C-B' O-O'", l: { O: 'n', "O'": 'e' } })

const t8 = tetra(6, ['B', 'C', 'D', 'A'])
const O8: P3 = [3, 6 / Math.sqrt(3), 0] // the centre of BCD
const gA8 = solid({ ...t8, M: mid3(t8.A, t8.C), O: O8, N: mid3(O8, t8.C), P: mid3(t8.B, t8.D) }, TETRA('B', 'C', 'D', 'A'), 180, { seg: 'A-O O-C M-N M-P', l: { O: 'w', N: 's', P: 'n' } })

const c9 = box(12, 12, 12)
const gA9 = solid({ ...c9, M: mid3(c9.D, c9["D'"]), O: mid3(c9.A, c9.C) }, BOX, 170, { seg: "A-C B-D O-B' O-M M-B' A-M", l: { O: 's', M: 'w' } })

const p10 = prism3(18, 9)
const P10: P3 = [36, 9 * s3, 0] // CP = AC
const gA10 = solid({ ...p10, M: along3(p10.A, p10["A'"], 2 / 3), N: along3(p10.C, p10["C'"], 1 / 3), P: P10 }, PRISM3, 220, { seg: 'M-B M-N B-N', s: 'N-P C-P B-P', l: { M: 'w', N: 'e', "B'": 'w' } })

const b1 = box(15, 20, 12)
const gB1 = solid({ ...b1, E: foot3(b1.D, b1.A, b1.C) }, BOX, 180, { seg: "A-C D-E D'-E D'-A D'-C A-C' B-C'", l: { E: 'n' } })

const p3b = prism3(24, 12)
const gB3 = solid({ ...p3b, M: mid3(p3b.C, p3b["C'"]), P: [48, 12 * s3, 0] }, PRISM3, 220, { seg: "M-B M-A' A'-B", s: 'B-P C-P M-P', l: { M: 'e', "B'": 'w' } })

const l4 = 6 * s3
const t4: Record<string, P3> = { A: [0, 9, 0], B: [l4 / 2, 0, 0], C: [l4, 9, 0], S: [l4 / 2, 6, 4] }
const gB4 = solid({ ...t4, O: [l4 / 2, 6, 0], D: mid3(t4.B, t4.C) }, 'A-B-C A-B-S B-C-S C-A-S', 190, { seg: 'S-O A-D S-D', l: { O: 's', D: 'e' } })

const p5: Record<string, P3> = { A: [0, 0, 0], B: [12, 0, 0], C: [12, 12, 0], D: [0, 12, 0], V: [6, 6, 6 * Math.sqrt(2)] }
const gB5 = solid({ ...p5, O: [6, 6, 0] }, PYR4, 180, { seg: 'A-C B-D V-O', l: { O: 's' } })

const c6 = box(12, 12, 12)
const M6 = mid3(c6.C, c6["C'"])
const gB6 = solid({ ...c6, M: M6, N: foot3(c6.D, c6["D'"], M6) }, BOX, 170, { seg: "A-M D'-M A-D' A-N D-N", l: { M: 'e', N: 'n' } })

const b8 = box(20, 12, 15)
const E8 = foot3(b8.D, b8.C, b8["D'"])
const gB8 = solid({ ...b8, E: E8, Q: foot3(b8.D, b8.A, E8) }, BOX, 190, { seg: "A-D' D'-C A-C D-E A-E D-Q", l: { E: 'e', Q: 'w' } })

const t9 = tetra(12, ['A', 'B', 'C', 'D'])
const gB9 = solid({ ...t9, M: mid3(t9.B, t9.C) }, TETRA('A', 'B', 'C', 'D'), 170, { seg: 'M-A M-D', l: { M: 'e' } })

// round solids, drawn flat: the bases as ellipses, the back half dashed
const gB2 = {
  w: 170, h: 175,
  p: { V: [85, 8], "O'": [85, 105], O: [85, 155], A: [4, 155], B: [166, 155], "A'": [31, 105], "B'": [139, 105] } as Record<string, [number, number]>,
  l: { O: 'e' as const, "O'": 'e' as const },
  e: [{ at: 'O', rx: 81, ry: 18, back: true }, { at: "O'", rx: 54, ry: 12 }],
  s: "A-A' B-B' A'-B'", d: "A-B A'-V-B' O-V", dot: "O O'",
}
const gB7 = {
  w: 170, h: 225,
  p: { V: [85, 8], "O'": [85, 140], O: [85, 202], A: [9, 202], B: [161, 202], "A'": [34, 140], "B'": [136, 140], C: [85, 219], M: [123, 210.5] } as Record<string, [number, number]>,
  l: { O: 'ne' as const, "O'": 'ne' as const, C: 's' as const, M: 'se' as const },
  e: [{ at: 'O', rx: 76, ry: 17, back: true }, { at: "O'", rx: 51, ry: 11 }],
  s: "A-A' B-B' A'-B'", d: "A-B O-C B-C O-M V-M V-O V-A' V-B' O-A' O'-A", dot: "O O'",
}
const gB10 = {
  w: 170, h: 150,
  p: { V: [85, 8], "O'": [85, 88], O: [85, 130], A: [3, 130], B: [167, 130], "A'": [34, 88], "B'": [136, 88] } as Record<string, [number, number]>,
  l: { O: 'e' as const, "O'": 'e' as const },
  e: [{ at: 'O', rx: 82, ry: 18, back: true }, { at: "O'", rx: 51, ry: 11 }],
  s: "A-A' B-B' A'-B'", d: "A-B A'-V-B' O-V", dot: "O O'",
}

// ---------- algebra ----------
const sys = (a: string, b: string) => `$\\begin{cases}${a}\\\\${b}\\end{cases}$`

const algebraA: RecapItem[] = [
  {
    text: 'Efectuați calculele:',
    parts: [
      { text: '$\\left(-\\dfrac{1}{125}\\right):0{,}008+0{,}(7)+0{,}(3)^2$;', ans: '$-\\dfrac{1}{9}$' },
      { text: '$[0{,}2(3)-1{,}2]:0{,}3(2)$.', ans: '$-3$' },
    ],
  },
  { text: 'Calculați media aritmetică a numerelor: $5\\sqrt{3}-2\\sqrt{5}$, $\\sqrt{8-2\\sqrt{15}}$, $\\dfrac{2}{\\sqrt{5}+\\sqrt{3}}$.', ans: '$m_a=\\sqrt{3}$' },
  {
    text: 'Calculați media geometrică a numerelor $x=\\dfrac{\\sqrt{18}-\\sqrt{2}}{\\sqrt{12}-\\sqrt{3}}$ și $y=\\dfrac{\\sqrt{48}-\\sqrt{3}}{\\sqrt{18}-\\sqrt{8}}$.',
    ans: '$x=\\dfrac{2\\sqrt{6}}{3}$, $y=\\dfrac{3\\sqrt{6}}{2}$, $m_g=\\sqrt{6}$',
  },
  {
    text: 'Descompuneți în produs de factori:',
    parts: [
      { text: '$x^3-2x^2-4x+8$;', ans: '$(x-2)^2(x+2)$' },
      { text: '$(2x+1)^3-8x-4$;', ans: '$(2x+1)(2x-1)(2x+3)$' },
      { text: '$2(x^2-1)-(x+1)^2$;', ans: '$(x+1)(x-3)$' },
      { text: '$x^2+5x+6-2(x^2-4)$.', ans: '$(x+2)(7-x)$' },
    ],
  },
  {
    text: 'Determinați numerele reale $x$ și $y$, știind că:',
    parts: [
      { text: '$x^2+y^2+4x-8y+20=0$;', ans: '$x=-2$, $y=4$' },
      { text: '$(x-2\\sqrt{3})^2+(\\sqrt{2}\\,y-6)^2=0$;', ans: '$x=2\\sqrt{3}$, $y=3\\sqrt{2}$' },
      { text: '$(2x+y+4)^2+(x+2y-1)^2=0$;', ans: '$x=-3$, $y=2$' },
      { text: '$\\sqrt{x^2-2x+5}+\\sqrt{y^2+4y+13}=5$.', ans: '$x=1$, $y=-2$' },
    ],
  },
  {
    text: 'Arătați că expresia $E(x)=(x^2+2x+2)(x^2+2x+6)+7$ este strict pozitivă pentru orice $x\\in\\mathbb{R}$. Determinați valoarea minimă a expresiei.',
    ans: '$E(x)=(x^2+2x+4)^2+3>0$, $(\\forall)\\,x\\in\\mathbb{R}$; valoarea minimă este $12$, pentru $x=-1$',
    note: 'cartea nu dă valoarea minimă; e calculată aici, din $x^2+2x+4=(x+1)^2+3\\ge 3$.',
  },
  {
    text: 'Rezolvați în mulțimea numerelor reale ecuațiile:',
    parts: [
      { text: '$\\dfrac{x-2}{5}+\\dfrac{x-1}{2}=\\dfrac{3x-1}{10}$;', ans: '$S=\\{2\\}$' },
      { text: '$\\left|\\dfrac{2x-1}{3}\\right|=1$;', ans: '$S=\\{-1,\\,2\\}$' },
      { text: '$4(x+3)-2|x+3|=2(x+5)+2x$;', ans: '$S=\\{-4,\\,-2\\}$' },
      { text: '$(x-3)^2+(x-4)(x+4)=(x+2)^2+x(x-4)+1$;', ans: '$S=\\{-2\\}$' },
      { text: '$(2x+1)^2-4(x+3)(x-5)=5(x+3)+4$;', ans: '$S=\\{-6\\}$' },
      { text: '$\\sqrt{(2x-1)^2}=7$;', ans: '$S=\\{-3,\\,4\\}$' },
      { text: '$(x+3)^2-4x=x(x+1)$;', ans: '$S=\\{-9\\}$' },
      { text: '$\\sqrt{(x-\\sqrt{2})^2}=2\\sqrt{50}$;', ans: '$S=\\{-9\\sqrt{2},\\,11\\sqrt{2}\\}$' },
      { text: '$2x^2+x-10=0$.', ans: '$S=\\left\\{-\\dfrac{5}{2},\\,2\\right\\}$' },
    ],
  },
  {
    text: 'Rezolvați în mulțimea numerelor reale inecuațiile:',
    parts: [
      { text: '$-5(x+2)<25$;', ans: '$x\\in(-7;\\,+\\infty)$' },
      { text: '$(x+5)^2-7x<x(x+2)+21$;', ans: '$x\\in(-\\infty;\\,-4)$' },
      { text: '$\\sqrt{x^2-6x+9}\\le 1$;', ans: '$x\\in[2;\\,4]$' },
      { text: '$3(x+5)+2\\sqrt{(x+2)^2}\\le 3x+25$;', ans: '$x\\in[-7;\\,3]$' },
      { text: '$(x+5)(x-5)+(x+2)^2<x(x+5)+(x-3)^2$;', ans: '$x\\in(-\\infty;\\,6)$' },
      { text: '$(x^2+x+1)[2(x+1)-3(x-2)]\\le 0$;', ans: '$x\\in[8;\\,+\\infty)$' },
      { text: '$|x+2|\\cdot[4(x+2)-2(x+5)]\\ge 0$;', ans: '$x\\in\\{-2\\}\\cup[1;\\,+\\infty)$' },
      { text: '$\\dfrac{-6}{3(x+5)-2(x+6)}<0$;', ans: '$x\\in(-3;\\,+\\infty)$' },
      { text: '$|x+2|\\cdot(|x+3|-4)<0$.', ans: '$x\\in(-7;\\,1)\\setminus\\{-2\\}$' },
    ],
    note: 'g) în carte $x\\in[1;+\\infty)$; lipsește $x=-2$, pentru care produsul este $0$.',
  },
  {
    text: 'Determinați punctul de intersecție a graficelor funcțiilor $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-4x+9$ și $g:\\mathbb{R}\\to\\mathbb{R}$, $g(x)=3x-5$. Reprezentați grafic cele două funcții în același sistem de axe de coordonate.',
    ans: '$G_f\\cap G_g=\\{M(2;\\,1)\\}$',
  },
  {
    text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3x-2$.',
    parts: [
      { text: 'Reprezentați grafic funcția într-un sistem de axe de coordonate.', ans: 'dreapta care trece prin $A(0;\\,-2)$ și $B(1;\\,1)$' },
      { text: 'Rezolvați ecuația $f(x+1)+f(x-2)=f(x)+4$.', ans: '$x=3$' },
    ],
  },
  {
    text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=\\sqrt{3}\\,x+1$.',
    parts: [
      { text: 'Calculați numărul $a=f(\\sqrt{3})\\cdot f(-\\sqrt{3})$.', ans: '$a=-8$' },
      { text: 'Rezolvați inecuația $f(x)\\le\\sqrt{27}+1$.', ans: '$x\\in(-\\infty;\\,3]$' },
    ],
  },
  {
    text: 'Rezolvați sistemele:',
    parts: [
      { text: sys('2(x+1)+3y=2', 'x+2(y+3)=5'), ans: '$S=\\{(3,\\,-2)\\}$' },
      { text: sys('2(x+4)-2y=2', '3(x+1)+4y=1'), ans: '$S=\\{(-2,\\,1)\\}$' },
      { text: sys('2(x-3)+y=1', '3(x+1)-4y=-3'), ans: '$S=\\{(2,\\,3)\\}$' },
      { text: sys('5(2x+y+3)=3(x+3y)', '\\dfrac{x-2y+7}{2}=\\dfrac{2x+2y+1}{3}'), ans: '$S=\\{(-1,\\,2)\\}$' },
    ],
  },
  {
    text: 'Fie ecuația $x^2+(a-2)x+6=0$.',
    parts: [
      { text: 'Determinați valoarea reală a lui $a$, știind că $x=-2$ este soluție a ecuației.', ans: '$a=7$' },
      { text: 'Pentru $a=7$, determinați cealaltă soluție a ecuației.', ans: '$x_2=-3$' },
    ],
  },
  {
    text: 'Rezolvați ecuațiile:',
    parts: [
      { text: '$2x^2-7x-15=0$;', ans: '$S=\\left\\{-\\dfrac{3}{2},\\,5\\right\\}$' },
      { text: '$2x^2-7x+5=0$;', ans: '$S=\\left\\{1,\\,\\dfrac{5}{2}\\right\\}$' },
      { text: '$6x^2-x-2=0$;', ans: '$S=\\left\\{-\\dfrac{1}{2},\\,\\dfrac{2}{3}\\right\\}$' },
      { text: '$6x^2-5x-4=0$.', ans: '$S=\\left\\{-\\dfrac{1}{2},\\,\\dfrac{4}{3}\\right\\}$' },
    ],
  },
  {
    text: 'Efectuați calculele:',
    parts: [
      { text: '$\\dfrac{x^2+3x+2}{3x-3}:\\dfrac{x^2-4}{x^2-2x+1}$;', ans: '$\\dfrac{(x+1)(x-1)}{3(x-2)}$, $x\\in\\mathbb{R}\\setminus\\{-2,\\,1,\\,2\\}$' },
      { text: '$\\dfrac{2x-8}{3x-3}:\\dfrac{x^2-16}{9x^2-9}$;', ans: '$\\dfrac{6(x+1)}{x+4}$, $x\\in\\mathbb{R}\\setminus\\{-4,\\,-1,\\,1,\\,4\\}$' },
      { text: '$\\left(\\dfrac{x}{x-2}-\\dfrac{x+2}{x}\\right):\\left(\\dfrac{x}{x+2}-\\dfrac{x-2}{x}\\right)$;', ans: '$\\dfrac{x+2}{x-2}$, $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$' },
      { text: '$\\left(\\dfrac{1}{x+1}-\\dfrac{1}{x-1}\\right):\\left(\\dfrac{1}{x+1}+\\dfrac{1}{x-1}\\right)$.', ans: '$-\\dfrac{1}{x}$, $x\\in\\mathbb{R}\\setminus\\{-1,\\,0,\\,1\\}$' },
    ],
  },
  { text: 'Suma a două numere naturale este $42$. Diferența dintre triplul primului număr și dublul celuilalt număr este $6$. Calculați numerele.', ans: '$a=18$, $b=24$' },
  {
    text: 'Un grup de copii au hotărât să strângă o sumă de bani. Ei au constatat că, dacă ar fi dat fiecare câte $10$ lei, ar mai fi trebuit $40$ lei, iar dacă ar fi dat fiecare câte $15$ lei, ar fi fost $20$ lei în plus. Care era suma ce trebuia strânsă și câți copii erau?',
    ans: '$12$ copii; $160$ de lei',
  },
  {
    text: 'Într-o clasă sunt $32$ de elevi, băieți și fete. Dacă ar pleca șase fete și ar veni doi băieți, numărul fetelor ar fi egal cu numărul băieților. Câte fete și câți băieți sunt în acea clasă?',
    ans: '$20$ de fete și $12$ băieți',
  },
  {
    text: 'Dacă elevii unei clase s-ar așeza câte doi într-o bancă, atunci un elev ar sta singur în bancă și două bănci ar rămâne libere. Dacă elevii clasei s-ar așeza câte trei în bancă, rămân șase bănci libere. Câți elevi și câte bănci sunt în acea clasă?',
    ans: '$21$ de elevi și $13$ bănci',
  },
]

const algebraB: RecapItem[] = [
  {
    text: 'Se consideră mulțimile $A=\\left\\{x\\in\\mathbb{R}\\;\\middle|\\;-4<\\dfrac{3x+1}{2}<2\\right\\}$ și $B=\\{x\\in\\mathbb{R}\\mid |2x+1|\\le 3\\}$. Calculați $(A\\cap B)\\cap\\mathbb{Z}^*$.',
    ans: '$A=(-3;\\,1)$, $B=[-2;\\,1]$, $(A\\cap B)\\cap\\mathbb{Z}^*=\\{-2,\\,-1\\}$',
  },
  {
    text: 'Se consideră expresia $E(x)=(2x+1)^2+(2x-3)^2-2(2x+1)(2x-3)$. Arătați că expresia este pătratul unui număr natural, oricare ar fi $x\\in\\mathbb{R}$.',
    ans: '$E(x)=[(2x+1)-(2x-3)]^2=4^2$, $(\\forall)\\,x\\in\\mathbb{R}$',
  },
  { text: 'Determinați numerele reale $x$ și $y$, știind că $(2x+y-1)^2+(3x-2y+1)^2=0$.', ans: '$x=\\dfrac{1}{7}$, $y=\\dfrac{5}{7}$' },
  {
    text: 'Fie numerele $a=-\\dfrac{646}{323}$, $b=0{,}(2)\\cdot 4\\dfrac{1}{2}$ și $c=\\dfrac{1}{1+\\sqrt{2}}+\\dfrac{1}{\\sqrt{2}+\\sqrt{3}}+\\dfrac{1}{\\sqrt{3}+\\sqrt{4}}$.',
    parts: [
      { text: 'Arătați că $a+b\\in\\mathbb{Z}$.', ans: '$a=-2$, $b=1$, $a+b=-1\\in\\mathbb{Z}$' },
      { text: 'Arătați că $a+b+c=0$.', ans: '$c=\\sqrt{4}-1=1$, deci $a+b+c=-2+2=0$' },
    ],
  },
  {
    text: 'Numerele naturale $a$, $b$ și $c$ sunt proporționale cu $3$, $4$ și, respectiv, $6$.',
    parts: [
      { text: 'Cât la sută din numărul $c$ reprezintă numărul $a$?', ans: '$\\dfrac{a}{c}=\\dfrac{1}{2}$, deci $50\\%$' },
      { text: 'Determinați numerele, știind că $(a-b)^2+(b-c)^2+(c-a)^2=126$.', ans: '$a=9$, $b=12$, $c=18$' },
    ],
  },
  {
    text: 'Se dau numerele $a=\\sqrt{6-\\sqrt{11}}$ și $b=\\sqrt{6+\\sqrt{11}}$.',
    parts: [
      { text: 'Calculați produsul $a\\cdot b$.', ans: '$a\\cdot b=5$' },
      { text: 'Calculați valoarea numărului $(a-b)^2$.', ans: '$(a-b)^2=2$' },
      { text: 'Arătați că numărul $\\dfrac{a-b}{\\sqrt{2}}$ este număr întreg negativ.', ans: '$|a-b|=\\sqrt{2}$ și $a<b$, deci $\\dfrac{a-b}{\\sqrt{2}}=-1\\in\\mathbb{Z}$' },
    ],
  },
  {
    text: 'Diferența pătratelor a două numere naturale este egală cu $1008$, iar cel mai mare divizor comun al lor este $12$. Aflați cele două numere.',
    ans: '$48$ și $36$ ($a=12x$, $b=12y$, $(x;\\,y)=1$, $(x-y)(x+y)=7$, deci $x=4$, $y=3$)',
  },
  {
    text: 'Dacă bomboanele dintr-o cutie s-ar împărți în mod egal la $7$ copii, ar rămâne $4$ bomboane, iar dacă s-ar împărți în mod egal la $8$ copii, ar rămâne $5$ bomboane. Care este cel mai mic număr de bomboane care ar putea fi în cutie, astfel încât să se îndeplinească condițiile problemei?',
    ans: '$53$ de bomboane ($n+3$ se împarte la $7$ și la $8$)',
  },
  {
    text: 'Se consideră fracția $F(x)=\\dfrac{20x-40}{4x^2-16}$, $x\\in\\mathbb{R}\\setminus\\{\\pm 2\\}$.',
    parts: [
      { text: 'Simplificați fracția.', ans: '$F(x)=\\dfrac{5}{x+2}$' },
      { text: 'Determinați $a\\in\\mathbb{Z}\\setminus\\{\\pm 2\\}$ pentru care $F(a)\\in\\mathbb{Z}$.', ans: '$a\\in\\{-7,\\,-3,\\,-1,\\,3\\}$' },
    ],
  },
  {
    text: 'Se consideră fracția $F(x)=\\dfrac{x^3+x^2-4x-4}{x^3-4x}$, unde $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.',
    parts: [
      { text: 'Arătați că $F(x)=1+\\dfrac{1}{x}$, pentru orice $x\\in\\mathbb{R}\\setminus\\{-2,\\,0,\\,2\\}$.', ans: '$F(x)=\\dfrac{(x+1)(x^2-4)}{x(x^2-4)}=\\dfrac{x+1}{x}=1+\\dfrac{1}{x}$' },
      { text: 'Determinați numerele reale $a$ pentru care $F(a)=a+1$.', ans: '$a\\in\\{\\pm 1\\}$' },
    ],
    note: 'a) în carte enunțul cere $F(x)=x+\\dfrac{1}{x}$, dar fracția se simplifică la $1+\\dfrac{1}{x}$ (cum dă și răspunsul cărții).',
  },
  {
    text: 'Rezolvați sistemele:',
    parts: [
      { text: sys('x+2y=21', 'x-y=9'), ans: '$S=\\{(13,\\,4)\\}$' },
      { text: sys('2x+y=19', 'x-2y=-3'), ans: '$S=\\{(7,\\,5)\\}$' },
      { text: sys('3x-y=9', '-x+3y=21'), ans: '$S=\\{(6,\\,9)\\}$' },
    ],
  },
  {
    text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=(2a+3)x-(5a-1)$.',
    parts: [
      { text: 'Determinați valoarea reală a lui $a$ pentru care punctul $A(2;\\,6)\\in G_f$.', ans: '$a=1$' },
      { text: 'Rezolvați ecuația $f(x+1)+f(x-1)=12$.', ans: '$x=2$ (pentru $a=1$, $f(x)=5x-4$)' },
    ],
  },
  {
    text: 'Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3x+6$.',
    parts: [
      { text: 'Reprezentați grafic funcția într-un sistem de axe de coordonate.', ans: 'dreapta care trece prin $A(-2;\\,0)$ și $B(0;\\,6)$' },
      { text: 'Rezolvați în mulțimea numerelor reale ecuația $2f(x)-f(2)=f(4)$.', ans: '$x=3$' },
      { text: 'Calculați valoarea sumei $S=f(1)+f(2)+\\ldots+f(25)$.', ans: '$S=1125$' },
    ],
  },
  {
    text: 'Fie funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=ax+b$, $a,b\\in\\mathbb{R}$.',
    parts: [
      { text: 'Determinați $a,b\\in\\mathbb{R}$, știind că punctele $A(3;\\,2b)$ și $B(-1;\\,4)$ aparțin graficului funcției.', ans: '$a=2$, $b=6$' },
      { text: 'Pentru $a=2$ și $b=6$, reprezentați grafic funcția într-un sistem de axe de coordonate.', ans: '$f(x)=2x+6$: dreapta care trece prin $(-3;\\,0)$ și $(0;\\,6)$' },
      { text: 'Calculați suma $S=f(1)+f(2)+\\ldots+f(60)$.', ans: '$S=4020$' },
    ],
  },
  {
    text: 'Rezolvați ecuațiile:',
    parts: [
      { text: '$x^2+11x+30=0$;', ans: '$S=\\{-6,\\,-5\\}$' },
      { text: '$4x^2-4x-24=0$;', ans: '$S=\\{-2,\\,3\\}$' },
      { text: '$2x(x-2)=-x-1$;', ans: '$S=\\left\\{\\dfrac{1}{2},\\,1\\right\\}$' },
      { text: '$\\dfrac{3x+2}{x}=\\dfrac{2x}{x-1}$.', ans: '$S=\\{-1,\\,2\\}$' },
    ],
  },
  {
    text: 'Se consideră expresia $E(x)=\\left(\\dfrac{3}{x+1}-\\dfrac{5}{x-1}\\right):\\dfrac{x^2+8x+16}{x^2+5x+4}$.',
    parts: [
      { text: 'Determinați valorile lui $x$ pentru care expresia este definită.', ans: '$x\\in\\mathbb{R}\\setminus\\{-4,\\,-1,\\,1\\}$' },
      { text: 'Aduceți expresia la forma cea mai simplă.', ans: '$E(x)=-\\dfrac{2}{x-1}$' },
      { text: 'Determinați $a\\in\\mathbb{Z}\\setminus\\{-4,\\,-1,\\,1\\}$ pentru care $E(a)\\in\\mathbb{Z}$.', ans: '$a\\in\\{0,\\,2,\\,3\\}$' },
    ],
  },
  {
    text: 'Fie expresia $E(x)=\\left(1-\\dfrac{x^2}{x^2-4}\\right):\\left(1-\\dfrac{x}{x-2}\\right)$.',
    parts: [
      { text: 'Determinați valorile lui $x$ pentru care expresia este definită.', ans: '$x\\in\\mathbb{R}\\setminus\\{-2,\\,2\\}$' },
      { text: 'Aduceți expresia la forma cea mai simplă.', ans: '$E(x)=\\dfrac{2}{x+2}$' },
      { text: 'Determinați $a\\in\\mathbb{Z}\\setminus\\{\\pm 2\\}$ pentru care $E(a)\\in\\mathbb{Z}$.', ans: '$a\\in\\{-4,\\,-3,\\,-1,\\,0\\}$' },
    ],
  },
  {
    text: 'Rezolvați inecuațiile:',
    parts: [
      { text: '$x+2-\\dfrac{x+3}{2}<-1$;', ans: '$x\\in(-\\infty;\\,-3)$' },
      { text: '$x(x+5)-2<(x+1)^2$;', ans: '$x\\in(-\\infty;\\,1)$' },
      { text: '$\\dfrac{4(x-2)-3(x-4)}{-6}\\le -1$;', ans: '$x\\in[2;\\,+\\infty)$' },
      { text: '$(x^2+9)[5(x+3)-3(x+1)]\\le 0$.', ans: '$x\\in(-\\infty;\\,-6]$' },
    ],
  },
  {
    text: 'Ioana și Alina doresc să cumpere un obiect. Ioana observă că îi lipsesc două treimi din prețul obiectului, iar Alina observă că îi lipsește jumătate din prețul obiectului. Știind că cele două fete au împreună $1080$ lei, aflați prețul obiectului.',
    ans: '$1296$ de lei',
  },
  {
    text: 'În două cutii sunt $46$ de creioane. Dacă din a doua cutie s-ar muta $5$ creioane în prima cutie, atunci în a doua cutie ar fi cu $6$ creioane mai puține decât în prima. Câte creioane sunt în fiecare cutie?',
    ans: '$21$ de creioane în prima cutie și $25$ de creioane în a doua cutie',
  },
]

// ---------- geometry ----------
const cm2 = '\\text{ cm}^2'
const cm3 = '\\text{ cm}^3'

const geometryA: RecapItem[] = [
  {
    text: 'Un paralelipiped dreptunghic are dimensiunile $a=2\\sqrt{11}$ cm, $b=10$ cm și $c=9$ cm. Calculați:',
    parts: [
      { text: 'diagonala paralelipipedului;', ans: '$d=15$ cm' },
      { text: 'aria totală și volumul paralelipipedului;', ans: `$\\mathcal{A}_t=4(19\\sqrt{11}+45)${cm2}$, $\\mathcal{V}=180\\sqrt{11}${cm3}$` },
      { text: "valoarea sinusului unghiului format de diagonala $AC'$ cu planul $(BCC')$.", ans: "$\\sin\\sphericalangle AC'B=\\dfrac{2\\sqrt{11}}{15}$ (cu $AB=2\\sqrt{11}$ cm)" },
    ],
    fig: gA1,
  },
  {
    text: `Un cub $ABCDA'B'C'D'$ are volumul egal cu $512${cm3}$. Calculați:`,
    parts: [
      { text: 'latura cubului și diagonala acestuia;', ans: '$l=8$ cm, $d=8\\sqrt{3}$ cm' },
      { text: "valoarea sinusului unghiului plan corespunzător diedrului format de planele $(D'AC)$ și $(B'AC)$;", ans: "$\\sin\\sphericalangle B'OD'=\\dfrac{2\\sqrt{2}}{3}$, unde $O$ este centrul bazei $ABCD$" },
      { text: "măsura unghiului format de diagonala $D'C$ cu planul $(BDD')$.", ans: '$30^\\circ$' },
    ],
    fig: gA2,
  },
  {
    text: `Un tetraedru regulat $ABCD$ are aria totală egală cu $144\\sqrt{3}${cm2}$.`,
    parts: [
      { text: 'Calculați volumul tetraedrului.', ans: `$l=12$ cm, $h=4\\sqrt{6}$ cm, $\\mathcal{V}=144\\sqrt{2}${cm3}$` },
      { text: 'Dacă $M$ este mijlocul muchiei $DC$ și $N$ este mijlocul muchiei $AB$, calculați măsura unghiului format de dreapta $MN$ cu muchia $AD$.', ans: '$45^\\circ$ (cu $P$ mijlocul lui $AC$: $MP\\parallel AD$, iar $\\triangle MNP$ este dreptunghic isoscel)' },
      { text: 'Aflați valoarea sinusului unghiului diedru format de planele $(AMB)$ și $(ABC)$.', ans: '$\\sin\\sphericalangle MNC=\\dfrac{\\sqrt{3}}{3}$' },
    ],
    fig: gA3,
  },
  {
    text: 'O piramidă patrulateră regulată $VABCD$ are latura bazei egală cu $8$ cm și apotema egală cu $5$ cm. Calculați:',
    parts: [
      { text: 'volumul piramidei;', ans: `$\\mathcal{V}=64${cm3}$` },
      { text: 'distanța de la centrul bazei la o față laterală;', ans: '$d(O,(VBC))=\\dfrac{12}{5}$ cm' },
      { text: 'valoarea sinusului unghiului diedru format de fețele $(VBC)$ și $(VAD)$.', ans: '$\\dfrac{24}{25}$' },
    ],
    fig: gA4,
  },
  {
    text: "Fie $ABCA'B'C'$ un trunchi de piramidă triunghiulară regulată care are $AB=24$ cm, $A'B'=12$ cm și apotema egală cu $4\\sqrt{3}$ cm. Calculați:",
    parts: [
      { text: 'volumul trunchiului de piramidă;', ans: `$OO'=6$ cm, $\\mathcal{V}=504\\sqrt{3}${cm3}$` },
      { text: 'aria totală și volumul piramidei din care provine trunchiul;', ans: `$\\mathcal{A}_t=432\\sqrt{3}${cm2}$, $\\mathcal{V}=576\\sqrt{3}${cm3}$` },
      { text: "tangenta unghiului plan corespunzător diedrului format de planele $(A'BC)$ și $(ABC)$.", ans: '$\\dfrac{\\sqrt{3}}{4}$' },
    ],
    fig: gA5,
  },
  {
    text: `Un paralelipiped dreptunghic $ABCDA'B'C'D'$ are $AA'=6\\sqrt{2}$ cm, $BC=6\\sqrt{7}$ cm și aria patrulaterului $ABC'D'$ egală cu $108${cm2}$. Calculați:`,
    parts: [
      { text: 'lungimea laturii $AB$;', ans: '$AB=6$ cm' },
      { text: 'aria totală și volumul paralelipipedului;', ans: `$\\mathcal{A}_t=72(\\sqrt{2}+\\sqrt{7}+\\sqrt{14})${cm2}$, $\\mathcal{V}=216\\sqrt{14}${cm3}$` },
      { text: "valoarea sinusului unghiului format de diagonala $AD'$ cu planul $(BDD')$.", ans: "$\\sin\\sphericalangle AD'E=\\dfrac{\\sqrt{14}}{12}$, unde $AE\\perp BD$" },
    ],
    fig: gA6,
  },
  {
    text: "O prismă dreaptă $ABCA'B'C'$ are la bază un triunghi echilateral cu latura $AB=8$ cm și înălțimea $AA'=6$ cm. Se notează $AB'\\cap BA'=\\{O\\}$ și $BC'\\cap CB'=\\{O'\\}$. Aflați:",
    parts: [
      { text: 'aria laterală și volumul prismei;', ans: `$\\mathcal{A}_l=144${cm2}$, $\\mathcal{V}=96\\sqrt{3}${cm3}$` },
      { text: "distanța de la punctul $B'$ la dreapta $OO'$;", ans: "$\\sqrt{21}$ cm ($\\triangle B'OO'$ este isoscel, cu $B'O=B'O'=5$ cm)" },
      { text: "poziția dreptei $OO'$ față de planul $(ABC)$;", ans: "$OO'\\parallel(ABC)$ ($OO'$ este linie mijlocie în $\\triangle B'AC$)" },
      { text: "sinusul unghiului plan corespunzător diedrului format de planele $(B'AC)$ și $(A'BC')$.", ans: '$\\dfrac{4\\sqrt{3}}{7}$' },
    ],
    fig: gA7,
  },
  {
    text: 'Fie $ABCD$ un tetraedru regulat cu latura $AB=6$ cm și $M$ mijlocul laturii $AC$. Aflați:',
    parts: [
      { text: 'aria totală și volumul tetraedrului;', ans: `$\\mathcal{A}_t=36\\sqrt{3}${cm2}$, $\\mathcal{V}=18\\sqrt{2}${cm3}$` },
      { text: 'distanța de la $M$ la planul $(DBC)$;', ans: '$MN=\\dfrac{AO}{2}=\\sqrt{6}$ cm' },
      { text: 'distanța de la $M$ la muchia $BD$.', ans: '$3\\sqrt{2}$ cm' },
    ],
    fig: gA8,
  },
  {
    text: "În cubul $ABCDA'B'C'D'$, cu latura $AB=12$ cm, se notează cu $M$ mijlocul muchiei $DD'$ și $AC\\cap BD=\\{O\\}$.",
    parts: [
      { text: "Calculați aria triunghiului $B'OM$.", ans: `$54\\sqrt{2}${cm2}$` },
      { text: "Arătați că $(AMO)\\perp(B'OM)$.", ans: "$AO\\perp BD$ și $AO\\perp BB'$, deci $AO\\perp(BDD')$ și $(AMO)\\perp(B'OM)$" },
      { text: "Calculați măsura unghiului format de dreptele $AO$ și $BD'$.", ans: '$90^\\circ$' },
    ],
    fig: gA9,
  },
  {
    text: "Fie $ABCA'B'C'$ o prismă triunghiulară regulată dreaptă în care $AA'=9$ cm și raza cercului circumscris triunghiului $ABC$ este $6\\sqrt{3}$ cm. Știind că $M\\in(AA')$ și $N\\in(CC')$ astfel încât $\\dfrac{AM}{AA'}=\\dfrac{2}{3}$ și $\\dfrac{CN}{CC'}=\\dfrac{1}{3}$, calculați:",
    parts: [
      { text: "distanța de la punctul $C$ la planul $(ABC')$;", ans: '$\\dfrac{9\\sqrt{3}}{2}$ cm' },
      { text: 'aria triunghiului $BMN$;', ans: `$BN=MN=3\\sqrt{37}$ cm, $BM=6\\sqrt{10}$ cm, aria este $27\\sqrt{30}${cm2}$` },
      { text: 'distanța de la punctul $M$ la dreapta de intersecție a planului $(MBN)$ cu $(ABC)$.', ans: '$6\\sqrt{10}$ cm ($MN\\cap AC=\\{P\\}$, $\\sphericalangle ABP=90^\\circ$, $d(M,BP)=MB$)' },
    ],
    fig: gA10,
  },
]

const geometryB: RecapItem[] = [
  {
    text: "Paralelipipedul $ABCDA'B'C'D'$ are dimensiunile $AB=15$ cm, $BC=20$ cm și $AA'=12$ cm. Aflați:",
    parts: [
      { text: "distanța de la $D'$ la diagonala $AC$;", ans: '$12\\sqrt{2}$ cm' },
      { text: "măsura unghiului diedru format de planele $(D'AC)$ și $(DAC)$;", ans: '$45^\\circ$' },
      { text: "tangenta unghiului format de planele $(C'AB)$ și $(ABC)$.", ans: "$\\operatorname{tg}\\sphericalangle C'BC=\\dfrac{3}{5}$" },
    ],
    fig: gB1,
  },
  {
    text: `Un trunchi de con circular drept are volumul egal cu $1368\\sqrt{3}\\,\\pi${cm3}$, iar înălțimea de $6\\sqrt{3}$ cm. Se secționează trunchiul cu un plan paralel cu bazele dus pe la jumătatea înălțimii trunchiului, astfel încât aria secțiunii obținute să fie egală cu $225\\pi${cm2}$. Calculați:`,
    parts: [
      { text: 'razele bazelor trunchiului;', ans: '$R=18$ cm, $r=12$ cm' },
      { text: 'aria laterală și volumul conului din care provine trunchiul;', ans: `$\\mathcal{A}_l=648\\pi${cm2}$, $\\mathcal{V}=1944\\sqrt{3}\\,\\pi${cm3}$` },
      { text: 'măsura unghiului sectorului de cerc provenit din desfășurarea laterală a conului din care provine trunchiul.', ans: '$180^\\circ$' },
    ],
    fig: gB2,
  },
  {
    text: "Se consideră prisma triunghiulară regulată dreaptă $ABCA'B'C'$ cu latura bazei $AB=24$ cm și înălțimea $A'A=12$ cm.",
    parts: [
      { text: 'Aflați aria laterală și volumul prismei.', ans: `$\\mathcal{A}_l=864${cm2}$, $\\mathcal{V}=1728\\sqrt{3}${cm3}$` },
      { text: "Dacă $M$ este mijlocul muchiei $CC'$, aflați aria triunghiului $MA'B$.", ans: `$MB=MA'=6\\sqrt{17}$ cm, $A'B=12\\sqrt{5}$ cm, aria este $72\\sqrt{15}${cm2}$` },
      { text: "Calculați distanța de la $A'$ la dreapta de intersecție a planelor $(MBA')$ și $(ABC)$.", ans: "$12\\sqrt{5}$ cm ($A'M\\cap AC=\\{P\\}$, $\\sphericalangle ABP=90^\\circ$, $d(A',BP)=A'B$)" },
    ],
    note: `b) în carte $MB=MA'=12\\sqrt{2}$ cm și aria $36\\sqrt{15}${cm2}$; dar $MB=\\sqrt{24^2+6^2}=6\\sqrt{17}$ cm (mai mare decât $BC=24$ cm).`,
    fig: gB3,
  },
  {
    text: `Fie $SABC$ o piramidă triunghiulară regulată cu înălțimea $SO=4$ cm și volumul egal cu $36\\sqrt{3}${cm3}$. Calculați:`,
    parts: [
      { text: 'latura bazei și aria laterală ale piramidei;', ans: `$AB=6\\sqrt{3}$ cm, apotema $SD=5$ cm, $\\mathcal{A}_l=45\\sqrt{3}${cm2}$` },
      { text: 'tangenta unghiului format de muchia $SB$ cu planul $(SAD)$, unde $D$ este mijlocul muchiei $BC$;', ans: '$\\operatorname{tg}\\sphericalangle BSD=\\dfrac{3\\sqrt{3}}{5}$' },
      { text: 'distanța de la $A$ la planul $(SBC)$ și distanța de la $O$, centrul bazei, la planul $(SBC)$.', ans: '$d(A,(SBC))=\\dfrac{36}{5}$ cm, $d(O,(SBC))=\\dfrac{12}{5}$ cm' },
    ],
    note: `în carte $AB=12\\sqrt{3}$ cm, $SD=2\\sqrt{15}$ cm, $\\mathcal{A}_l=108\\sqrt{5}${cm2}$, $\\operatorname{tg}=\\dfrac{3\\sqrt{5}}{5}$ și distanțele $\\dfrac{12\\sqrt{15}}{5}$ cm, $\\dfrac{4\\sqrt{15}}{5}$ cm. Din enunț, aria bazei este $\\dfrac{3\\mathcal{V}}{SO}=27\\sqrt{3}${cm2}$, deci $AB=6\\sqrt{3}$ cm (cu $AB=12\\sqrt{3}$ cm, volumul ar fi $144\\sqrt{3}${cm3}$).`,
    fig: gB4,
  },
  {
    text: 'Se consideră piramida patrulateră regulată $VABCD$ care are toate muchiile egale cu $12$ cm.',
    parts: [
      { text: 'Calculați aria laterală și volumul piramidei.', ans: `$a_p=6\\sqrt{3}$ cm, $VO=6\\sqrt{2}$ cm, $\\mathcal{A}_l=144\\sqrt{3}${cm2}$, $\\mathcal{V}=288\\sqrt{2}${cm3}$` },
      { text: 'Aflați măsura unghiului format de o muchie laterală cu planul bazei.', ans: '$\\sphericalangle VAO=45^\\circ$' },
      { text: 'Calculați măsura unghiului format de muchia $VB$ cu planul $(VAC)$.', ans: '$\\sphericalangle OVB=45^\\circ$' },
      { text: 'Calculați valoarea sinusului unghiului diedru format de planele $(VBC)$ și $(VAC)$.', ans: '$\\dfrac{\\sqrt{6}}{3}$' },
    ],
    fig: gB5,
  },
  {
    text: "Fie cubul $ABCDA'B'C'D'$ și $M$ mijlocul muchiei $CC'$. Dacă $AM=18$ cm, aflați:",
    parts: [
      { text: 'latura și diagonala cubului;', ans: '$l=12$ cm, $d=12\\sqrt{3}$ cm' },
      { text: "distanța de la punctul $A$ la dreapta $D'M$;", ans: "$AN=\\dfrac{36\\sqrt{5}}{5}$ cm, unde $DN\\perp D'M$ ($D'M=6\\sqrt{5}$ cm, $DN=\\dfrac{24\\sqrt{5}}{5}$ cm)" },
      { text: "sinusul unghiului diedru format de planele $(AD'M)$ și $(DD'C)$.", ans: '$\\sin\\sphericalangle AND=\\dfrac{\\sqrt{5}}{3}$' },
    ],
    fig: gB6,
  },
  {
    text: "Un trunchi de con circular drept are secțiunea axială un trapez isoscel $ABB'A'$ cu mediatoarea bazelor $OO'$ (unde $O\\in AB$ și $O'\\in A'B'$), iar $OA'\\perp O'A$. Se știe că razele bazelor sunt egale cu $6\\sqrt{2}$ cm și, respectiv, $9\\sqrt{2}$ cm.",
    parts: [
      { text: 'Calculați volumul trunchiului de con.', ans: "$OO'=\\sqrt{O'A'\\cdot OA}=6\\sqrt{3}$ cm, $\\mathcal{V}=684\\sqrt{3}\\,\\pi" + cm3 + '$' },
      { text: 'Calculați aria laterală a conului din care provine trunchiul.', ans: "$BB'=3\\sqrt{14}$ cm, $VB=9\\sqrt{14}$ cm, $VO=18\\sqrt{3}$ cm, $\\mathcal{A}_l=162\\sqrt{7}\\,\\pi" + cm2 + '$' },
      { text: 'Dacă $C$ este un punct pe cercul de centru $O$, astfel încât $\\overset{\\frown}{BC}=90^\\circ$, calculați distanța de la $O$ la planul $(VBC)$, unde $V$ este vârful conului din care provine trunchiul.', ans: '$BC=18$ cm, $OM=9$ cm, $VM=9\\sqrt{13}$ cm, $d(O,(VBC))=\\dfrac{18\\sqrt{39}}{13}$ cm' },
    ],
    fig: gB7,
  },
  {
    text: "Se consideră paralelipipedul $ABCDA'B'C'D'$ cu dimensiunile $AB=20$ cm, $BC=12$ cm și $AA'=15$ cm. Calculați:",
    parts: [
      { text: 'aria totală și volumul paralelipipedului;', ans: `$\\mathcal{A}_t=1440${cm2}$, $\\mathcal{V}=3600${cm3}$` },
      { text: "distanța de la $A$ la dreapta $CD'$;", ans: "$AE=12\\sqrt{2}$ cm, unde $DE\\perp CD'$ ($CD'=25$ cm, $DE=12$ cm)" },
      { text: "distanța de la $D$ la planul $(AD'C)$.", ans: '$DQ=6\\sqrt{2}$ cm, unde $DQ\\perp AE$' },
    ],
    fig: gB8,
  },
  {
    text: `Fie tetraedrul regulat $ABCD$ care are volumul egal cu $144\\sqrt{2}${cm3}$. Aflați:`,
    parts: [
      { text: 'latura tetraedrului;', ans: '$l=12$ cm' },
      { text: 'aria totală a tetraedrului;', ans: `$\\mathcal{A}_t=144\\sqrt{3}${cm2}$` },
      { text: 'distanța de la $M$, mijlocul muchiei $BC$, la planul $(ABD)$.', ans: '$2\\sqrt{6}$ cm' },
    ],
    fig: gB9,
  },
  {
    text: `Într-un trunchi de con circular drept cu aria laterală egală cu $585\\pi${cm2}$, raza mare, raza mică și înălțimea sunt invers proporționale cu numerele $0{,}125$, $0{,}2$ și, respectiv, $0{,}25$. Calculați:`,
    parts: [
      { text: 'raza mare, raza mică, înălțimea și generatoarea trunchiului;', ans: '$R=24$ cm, $r=15$ cm, $h=12$ cm, $G=15$ cm' },
      { text: 'volumul trunchiului;', ans: `$\\mathcal{V}=4644\\pi${cm3}$` },
      { text: 'aria laterală și volumul conului din care provine trunchiul.', ans: `$\\mathcal{A}_l=960\\pi${cm2}$, $\\mathcal{V}=6144\\pi${cm3}$` },
    ],
    fig: gB10,
  },
]

export const RECAP8: Recap = {
  id: 'recap8',
  title: 'Recapitulare — clasa a VIII-a',
  source: 'Exerciții și probleme recapitulative pentru evaluarea finală (Matematică. Clasa a VIII-a, paginile 169–175; răspunsurile la paginile 239–241)',
  sections: [
    { id: 'alg-a', title: 'Algebră — A', items: algebraA },
    { id: 'alg-b', title: 'Algebră — B', items: algebraB },
    { id: 'geo-a', title: 'Geometrie — A', items: geometryA },
    { id: 'geo-b', title: 'Geometrie — B', items: geometryB },
  ],
}
