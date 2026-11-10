// Geometry of grade VIII beyond the areas and volumes of solids, asked for by the user on 10 November 2026: the
// perpendicular on a plane, the theorem of the three perpendiculars, the angle of a line with a plane, the dihedral
// angle, distances from a point to a plane; then frustums of pyramids and cones, the sphere and sections parallel to
// the base. The statements use the usual notation (ABCDA'B'C'D', VABCD), so they read without a figure.
import type { Made } from './generators'
import { frac, gcd, int, pick, rightTriangle, root, rootParts, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]
/** A Pythagorean triple, scaled, with its two legs in either order: [leg, leg, hypotenuse]. */
function triple(rng: Rng, scale = 3, small = false): [number, number, number] {
  // small: only 3-4-5 and 5-12-13, for lengths that should stay of an everyday size (a glass, a frustum)
  const [a, b, c] = pick(rng, small ? TRIPLES.slice(0, 2) : TRIPLES)
  const k = int(rng, 1, scale)
  return rng() < 0.5 ? [a * k, b * k, c * k] : [b * k, a * k, c * k]
}
/** p/q · π in LaTeX: \pi, 4\pi, \frac{32}{3}\pi. */
const pi = (p: number, q = 1) => {
  const v = frac(p, q)
  return v === '1' ? '\\pi' : `${v}\\pi`
}

// ================= distances and angles in space =================

/** MA ⊥ α, B ∈ α: MA ⊥ AB, so MB comes from Pythagoras. */
export function perpendicularPlane(rng: Rng): Made {
  const [a, c, m] = rightTriangle(rng, 100)
  return {
    text: `Dreapta $MA$ este perpendiculară pe planul $\\alpha$, cu $A \\in \\alpha$. Punctul $B$ se află în planul $\\alpha$, iar $MA = ${a}$ cm și $AB = ${c}$ cm. Calculați lungimea segmentului $MB$.`,
    solution: lines(
      'O dreaptă perpendiculară pe un plan este perpendiculară pe orice dreaptă din acel plan. Cum $AB \\subset \\alpha$, avem $MA \\perp AB$, deci triunghiul $MAB$ este dreptunghic în $A$:',
      show(`MB^2 = MA^2 + AB^2 = ${a * a} + ${c * c} = ${m * m} \\Rightarrow MB = ${m}\\text{ cm}`),
    ),
    verify: () => a * a + c * c === m * m,
  }
}

/** In a cube, d(A', (ABC)) = AA' and d(A', BC) = A'B, because BC ⊥ (ABB'). */
export function cubeDistances(rng: Rng): Made {
  const a = int(rng, 2, 40)
  return {
    text: `Cubul $ABCDA'B'C'D'$ are muchia de ${a} cm. Calculați distanța de la punctul $A'$ la planul $(ABC)$ și distanța de la punctul $A'$ la dreapta $BC$.`,
    solution: lines(
      `Muchia $AA'$ este perpendiculară pe planul bazei, deci $d(A', (ABC)) = AA' = ${a}$ cm.`,
      "Dreapta $BC$ este perpendiculară pe $AB$ și pe $BB'$, două drepte concurente din planul $(ABB')$, deci $BC \\perp (ABB')$ și $BC \\perp A'B$. Așadar $d(A', BC) = A'B$, diagonala unei fețe:",
      show(`A'B = \\ell\\sqrt{2} = ${root(2 * a * a)}\\text{ cm}`),
    ),
    verify: () => close(Math.sqrt(2 * a * a), a * Math.SQRT2),
  }
}

/** AM ⊥ (ABC), AD ⊥ BC ⇒ MD ⊥ BC (theorem of the three perpendiculars): d(M, BC) = √(AM² + AD²). */
export function threePerpendiculars(rng: Rng): Made {
  // a right triangle 15-20-25 (scaled) has the height AD = 12k; AM, AD, MD then form a Pythagorean triple
  const k0 = int(rng, 1, 4)
  const [p, q, r] = rng() < 0.5 ? [15 * k0, 20 * k0, 25 * k0] : [20 * k0, 15 * k0, 25 * k0]
  const [hh, , dd] = pick(rng, [[5, 12, 13], [9, 12, 15], [16, 12, 20], [35, 12, 37]] as const)
  const h = hh * k0
  const AD = frac(p * q, r)
  const N = h * h * r * r + p * p * q * q
  const [k, m] = rootParts(N)
  const MD = surd(k, r, m)
  if (MD !== String(dd * k0)) throw new Error('threePerpendiculars: MD should be whole')
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${p}$ cm și $AC = ${q}$ cm. În punctul $A$ se ridică perpendiculara $AM$ pe planul triunghiului, cu $AM = ${h}$ cm. Calculați distanța de la punctul $M$ la dreapta $BC$.`,
    solution: lines(
      `Ipotenuza: $BC^2 = ${p * p} + ${q * q} = ${r * r}$, deci $BC = ${r}$ cm. Fie $AD \\perp BC$, cu $D \\in BC$; înălțimea din unghiul drept este`,
      show(`AD = \\frac{AB \\cdot AC}{BC} = \\frac{${p} \\cdot ${q}}{${r}} = ${AD}\\text{ cm}`),
      'Cum $MA \\perp (ABC)$, $AD \\perp BC$ și $AD, BC \\subset (ABC)$, din teorema celor trei perpendiculare rezultă $MD \\perp BC$, deci $d(M, BC) = MD$. Triunghiul $MAD$ este dreptunghic în $A$:',
      show(`MD^2 = MA^2 + AD^2 = ${h * h} + \\left(${AD}\\right)^2 = ${frac(N, r * r)} \\Rightarrow MD = ${MD}\\text{ cm}`),
    ),
    verify: () => close(Math.sqrt(h * h + (p * q / r) ** 2), (k * Math.sqrt(m)) / r),
  }
}

/** The angle of the lateral edge VA with the base of a regular pyramid is ∠VAO, O the centre of the base. */
export function lateralEdgeAngle(rng: Rng): Made {
  const [OA, h, m] = rightTriangle(rng, 100)
  const side = surd(OA, 1, 2)
  return {
    text: `Piramida patrulateră regulată $VABCD$ are latura bazei de $${side}$ cm și muchia laterală de ${m} cm. Calculați înălțimea piramidei și sinusul unghiului dintre muchia $VA$ și planul bazei.`,
    solution: lines(
      `Fie $O$ centrul bazei. $OA$ este jumătate din diagonala pătratului: $OA = \\frac{\\ell\\sqrt{2}}{2} = \\frac{${side} \\cdot \\sqrt{2}}{2} = ${OA}$ cm.`,
      show(`VO^2 = VA^2 - OA^2 = ${m * m} - ${OA * OA} = ${h * h} \\Rightarrow VO = ${h}\\text{ cm}`),
      'Cum $VO \\perp (ABC)$, proiecția lui $VA$ pe planul bazei este $OA$, deci unghiul cerut este $\\angle VAO$, în triunghiul $VOA$ dreptunghic în $O$:',
      show(`\\sin \\angle VAO = \\frac{VO}{VA} = \\frac{${h}}{${m}}${frac(h, m) === `\\frac{${h}}{${m}}` ? '' : ` = ${frac(h, m)}`}`),
    ),
    verify: () => OA * OA + h * h === m * m,
  }
}

/** The dihedral angle of a lateral face with the base of a regular pyramid: ∠VMO, with tg = VO/OM. */
export function dihedralPyramid(rng: Rng): Made {
  const m = int(rng, 2, 20)
  const ang = pick(rng, [30, 45, 60])
  const hTex = ang === 45 ? String(m) : ang === 60 ? surd(m, 1, 3) : surd(m, 3, 3)
  const hVal = m * Math.tan((ang * Math.PI) / 180)
  const tg = ang === 45 ? '1' : ang === 60 ? '\\sqrt{3}' : '\\frac{\\sqrt{3}}{3}'
  return {
    text: `Piramida patrulateră regulată $VABCD$ are latura bazei de ${2 * m} cm și înălțimea de $${hTex}$ cm. Determinați măsura unghiului format de planele $(VBC)$ și $(ABC)$.`,
    solution: lines(
      'Fie $O$ centrul bazei și $M$ mijlocul lui $BC$. Atunci $OM \\perp BC$ (fiind paralelă cu $AB$) și $VM \\perp BC$ (triunghiul $VBC$ este isoscel), deci unghiul planelor este $\\angle VMO$.',
      `$OM$ este jumătate din latura bazei: $OM = ${m}$ cm. În triunghiul $VOM$, dreptunghic în $O$:`,
      show(`\\operatorname{tg} \\angle VMO = \\frac{VO}{OM} = \\frac{${hTex}}{${m}} = ${tg} \\Rightarrow m(\\angle VMO) = ${ang}^\\circ`),
    ),
    verify: () => close((Math.atan(hVal / m) * 180) / Math.PI, ang),
  }
}

/** The distance from the centre of the base to a lateral face: the height from O in triangle VOM. */
export function distanceToFace(rng: Rng): Made {
  const [OM, VO, VM] = rightTriangle(rng, 60)
  const d = frac(VO * OM, VM)
  return {
    text: `Piramida patrulateră regulată $VABCD$ are latura bazei de ${2 * OM} cm și înălțimea $VO = ${VO}$ cm, unde $O$ este centrul bazei. Calculați apotema piramidei și distanța de la punctul $O$ la planul $(VBC)$.`,
    solution: lines(
      `Fie $M$ mijlocul lui $BC$; $OM = ${OM}$ cm, jumătate din latura bazei. Apotema este $VM$:`,
      show(`VM^2 = VO^2 + OM^2 = ${VO * VO} + ${OM * OM} = ${VM * VM} \\Rightarrow VM = ${VM}\\text{ cm}`),
      'Cum $BC \\perp OM$ și $BC \\perp VO$, rezultă $BC \\perp (VOM)$. Fie $OP \\perp VM$, cu $P \\in VM$; $OP$ este în planul $(VOM)$, deci $OP \\perp BC$. Așadar $OP$ este perpendiculară pe două drepte concurente din $(VBC)$, adică $OP \\perp (VBC)$ și distanța cerută este $OP$, înălțimea triunghiului dreptunghic $VOM$:',
      show(`OP = \\frac{VO \\cdot OM}{VM} = \\frac{${VO} \\cdot ${OM}}{${VM}} = ${d}\\text{ cm}`),
    ),
    verify: () => close((VO * OM) / VM, (VO * OM) / VM) && VO * VO + OM * OM === VM * VM,
  }
}

/** d(A, (A'BD)) in a cube of edge a: the volume of the tetrahedron A'ABD, two ways. */
export function cubeToPlane(rng: Rng): Made {
  const a = int(rng, 2, 40)
  return {
    text: `Cubul $ABCDA'B'C'D'$ are muchia de ${a} cm. Calculați distanța de la punctul $A$ la planul $(A'BD)$.`,
    solution: lines(
      "Calculăm volumul tetraedrului $A'ABD$ în două feluri. Cu baza $ABD$ (jumătate din fața cubului) și înălțimea $AA'$:",
      show(`V = \\frac{1}{3} \\cdot \\frac{${a}^2}{2} \\cdot ${a} = ${frac(a ** 3, 6)}\\text{ cm}^3`),
      `Cu baza $A'BD$: laturile ei sunt diagonale ale fețelor, $${root(2 * a * a)}$ cm, deci triunghiul este echilateral, cu aria`,
      show(`\\mathcal{A}_{A'BD} = \\frac{\\left(${root(2 * a * a)}\\right)^2\\sqrt{3}}{4} = ${surd(a * a, 2, 3)}\\text{ cm}^2`),
      show(`d(A, (A'BD)) = \\frac{3V}{\\mathcal{A}_{A'BD}} = \\frac{${frac(a ** 3, 2)}}{${surd(a * a, 2, 3)}} = \\frac{${a}}{\\sqrt{3}} = ${surd(a, 3, 3)}\\text{ cm}`),
    ),
    verify: () => close((3 * (a ** 3 / 6)) / ((a * a * Math.sqrt(3)) / 2), a / Math.sqrt(3)),
  }
}

// ================= frustums, the sphere, parallel sections =================

/** The area and the volume of a sphere from its radius. */
export function sphereFromRadius(rng: Rng): Made {
  const r = int(rng, 2, 12)
  return {
    text: `O sferă are raza de ${r} cm. Calculați aria și volumul sferei.`,
    solution: lines(
      show(`\\mathcal{A} = 4\\pi R^2 = 4\\pi \\cdot ${r * r} = ${pi(4 * r * r)}\\text{ cm}^2`),
      show(`V = \\frac{4\\pi R^3}{3} = \\frac{4\\pi \\cdot ${r ** 3}}{3} = ${pi(4 * r ** 3, 3)}\\text{ cm}^3`),
    ),
    verify: () => close(4 * Math.PI * r * r, 4 * r * r * Math.PI),
  }
}

/** The radius and the volume of a sphere from its area. */
export function sphereFromArea(rng: Rng): Made {
  const r = int(rng, 2, 12)
  return {
    text: `Aria unei sfere este de $${pi(4 * r * r)}$ cm². Calculați raza și volumul sferei.`,
    solution: lines(
      show(`4\\pi R^2 = ${pi(4 * r * r)} \\Rightarrow R^2 = ${r * r} \\Rightarrow R = ${r}\\text{ cm}`),
      show(`V = \\frac{4\\pi R^3}{3} = \\frac{4\\pi \\cdot ${r ** 3}}{3} = ${pi(4 * r ** 3, 3)}\\text{ cm}^3`),
    ),
    verify: () => r * r * 4 === 4 * r * r,
  }
}

/** A section parallel to the base at distance d from the vertex: its area is the base area times (d/H)². */
export function sectionArea(rng: Rng): Made {
  const H = pick(rng, [6, 8, 9, 10, 12, 15])
  const d = int(rng, 1, H - 1)
  const g = gcd(d, H)
  const [p, q] = [d / g, H / g]
  const B = q * q * int(rng, 2, 10)
  const s = (B * p * p) / (q * q)
  return {
    text: `O piramidă are aria bazei de ${B} cm² și înălțimea de ${H} cm. Se secționează piramida cu un plan paralel cu baza, la distanța de ${d} cm de vârf. Calculați aria secțiunii.`,
    solution: lines(
      `Secțiunea este asemenea cu baza, cu raportul de asemănare egal cu raportul distanțelor de la vârf: $k = \\frac{${d}}{${H}}${frac(d, H) === `\\frac{${d}}{${H}}` ? '' : ` = ${frac(d, H)}`}$. Raportul ariilor este $k^2$:`,
      show(`\\mathcal{A}_s = ${B} \\cdot \\left(${frac(d, H)}\\right)^2 = ${B} \\cdot ${frac(p * p, q * q)} = ${s}\\text{ cm}^2`),
    ),
    verify: () => close(B * (d / H) ** 2, s),
  }
}

/** A frustum of a cone: g² = h² + (R − r)², A_l = πg(R + r), V = πh(R² + Rr + r²)/3. */
export function frustumCone(rng: Rng): Made {
  const [x, h, g] = triple(rng, 2, true)
  const r = int(rng, 1, 8)
  const R = r + x
  const sum = R * R + R * r + r * r
  return {
    text: `Un trunchi de con circular drept are razele bazelor de ${R} cm și ${r} cm și înălțimea de ${h} cm. Calculați generatoarea, aria laterală și volumul trunchiului.`,
    solution: lines(
      'În secțiunea axială (un trapez isoscel), generatoarea, înălțimea și diferența razelor formează un triunghi dreptunghic:',
      show(`G^2 = h^2 + (R - r)^2 = ${h * h} + ${x * x} = ${g * g} \\Rightarrow G = ${g}\\text{ cm}`),
      show(`\\mathcal{A}_l = \\pi G(R + r) = \\pi \\cdot ${g} \\cdot ${R + r} = ${pi(g * (R + r))}\\text{ cm}^2`),
      show(`V = \\frac{\\pi h}{3}(R^2 + Rr + r^2) = \\frac{${h}\\pi}{3}(${R * R} + ${R * r} + ${r * r}) = ${pi(h * sum, 3)}\\text{ cm}^3`),
    ),
    verify: () => x * x + h * h === g * g,
  }
}

/** A frustum of a regular quadrilateral pyramid: apothem from (L − l)/2 and h, A_l = 2(L + l)a, V = h(B + b + √(Bb))/3. */
export function frustumPyramid(rng: Rng): Made {
  const [x, h, ap] = triple(rng, 2, true)
  const l = int(rng, 2, 10)
  const L = l + 2 * x
  const sum = L * L + l * l + L * l
  return {
    text: `Un trunchi de piramidă patrulateră regulată are laturile bazelor de ${L} cm și ${l} cm și înălțimea de ${h} cm. Calculați apotema, aria laterală și volumul trunchiului.`,
    solution: lines(
      'În secțiunea prin mijloacele a două laturi opuse (un trapez isoscel), apotema, înălțimea și semidiferența laturilor formează un triunghi dreptunghic:',
      show(`a_p^2 = h^2 + \\left(\\frac{L - \\ell}{2}\\right)^2 = ${h * h} + ${x * x} = ${ap * ap} \\Rightarrow a_p = ${ap}\\text{ cm}`),
      show(`\\mathcal{A}_l = 4 \\cdot \\frac{(L + \\ell) \\cdot a_p}{2} = 2 \\cdot ${L + l} \\cdot ${ap} = ${2 * (L + l) * ap}\\text{ cm}^2`),
      show(`V = \\frac{h}{3}\\left(L^2 + \\ell^2 + L\\ell\\right) = \\frac{${h}}{3}(${L * L} + ${l * l} + ${L * l}) = ${frac(h * sum, 3)}\\text{ cm}^3`),
    ),
    verify: () => x * x + h * h === ap * ap && L - l === 2 * x,
  }
}

const FILL: [number, number, string][] = [[1, 2, 'jumătate din înălțime'], [1, 3, 'o treime din înălțime'], [2, 3, 'două treimi din înălțime'], [3, 4, 'trei sferturi din înălțime'], [1, 4, 'un sfert din înălțime']]

/** A cone with the vertex down, filled to a part p/q of its height: the water is a similar cone, (p/q)³ of the volume. */
export function coneLiquid(rng: Rng): Made {
  const [r, h] = rightTriangle(rng, 40)
  const [p, q, words] = pick(rng, FILL)
  const V = r * r * h
  return {
    text: `Un vas are forma unui con circular drept cu vârful în jos, cu raza bazei de ${r} cm și înălțimea de ${h} cm. Vasul este umplut cu apă până la ${words}. Ce fracțiune din volumul vasului ocupă apa? Calculați volumul apei.`,
    solution: lines(
      `Apa are forma unui con asemenea cu vasul, cu raportul de asemănare $k = ${frac(p, q)}$ (raportul înălțimilor). Raportul volumelor este $k^3 = ${frac(p ** 3, q ** 3)}$, deci apa ocupă ${frac(p ** 3, q ** 3) === '1' ? 'tot vasul' : `$${frac(p ** 3, q ** 3)}$`} din volum.`,
      show(`V_{vas} = \\frac{\\pi R^2 h}{3} = \\frac{\\pi \\cdot ${r * r} \\cdot ${h}}{3} = ${pi(V, 3)}\\text{ cm}^3, \\qquad V_{apa} = ${frac(p ** 3, q ** 3)} \\cdot ${pi(V, 3)} = ${pi(V * p ** 3, 3 * q ** 3)}\\text{ cm}^3`),
    ),
    verify: () => close((Math.PI * (r * p / q) ** 2 * (h * p / q)) / 3, (Math.PI * V * p ** 3) / (3 * q ** 3)),
  }
}

/** A sphere inscribed in a cylinder: both volumes and both areas are in the ratio 2 : 3. */
export function sphereInCylinder(rng: Rng): Made {
  const r = int(rng, 2, 30)
  return {
    text: `O sferă cu raza de ${r} cm este înscrisă într-un cilindru circular drept (sfera atinge ambele baze și suprafața laterală a cilindrului). Calculați raportul dintre volumul sferei și volumul cilindrului, apoi raportul dintre aria sferei și aria totală a cilindrului.`,
    solution: lines(
      `Cilindrul are raza bazei egală cu raza sferei, ${r} cm, iar înălțimea egală cu diametrul ei, ${2 * r} cm.`,
      show(`V_s = \\frac{4\\pi \\cdot ${r ** 3}}{3} = ${pi(4 * r ** 3, 3)}, \\qquad V_c = \\pi \\cdot ${r * r} \\cdot ${2 * r} = ${pi(2 * r ** 3)}, \\qquad \\frac{V_s}{V_c} = \\frac{2}{3}`),
      show(`\\mathcal{A}_s = 4\\pi \\cdot ${r * r} = ${pi(4 * r * r)}, \\qquad \\mathcal{A}_t = 2\\pi \\cdot ${r} \\cdot ${2 * r} + 2\\pi \\cdot ${r * r} = ${pi(6 * r * r)}, \\qquad \\frac{\\mathcal{A}_s}{\\mathcal{A}_t} = \\frac{2}{3}`),
    ),
    verify: () => close((4 / 3) * r ** 3 / (2 * r ** 3), 2 / 3) && close((4 * r * r) / (6 * r * r), 2 / 3),
  }
}

/** A regular pyramid cut parallel to the base, d from the base: the frustum is the pyramid minus a similar one. */
export function frustumFromCut(rng: Rng): Made {
  const H = pick(rng, [6, 8, 9, 10, 12])
  const d = int(rng, 1, H - 1)
  const top = H - d
  const g = gcd(H, top)
  const L = (H / g) * int(rng, 1, 2) * (H / g < 4 ? 2 : 1)
  const l = (L * top) / H
  const V = (L * L * H) / 3
  const v = (l * l * top) / 3
  return {
    text: `O piramidă patrulateră regulată are latura bazei de ${L} cm și înălțimea de ${H} cm. Se secționează piramida cu un plan paralel cu baza, la ${d} cm de bază. Calculați latura secțiunii și volumul trunchiului de piramidă obținut.`,
    solution: lines(
      `Piramida mică, de deasupra secțiunii, are înălțimea $${H} - ${d} = ${top}$ cm și este asemenea cu cea mare, cu raportul $\\frac{${top}}{${H}}${frac(top, H) === `\\frac{${top}}{${H}}` ? '' : ` = ${frac(top, H)}`}$. Latura secțiunii este $${L} \\cdot ${frac(top, H)} = ${l}$ cm.`,
      show(`V = \\frac{${L}^2 \\cdot ${H}}{3} = ${frac(L * L * H, 3)}\\text{ cm}^3, \\qquad v = \\frac{${l}^2 \\cdot ${top}}{3} = ${frac(l * l * top, 3)}\\text{ cm}^3`),
      show(`V_{trunchi} = V - v = ${frac(L * L * H - l * l * top, 3)}\\text{ cm}^3`),
    ),
    verify: () => Number.isInteger(l) && close(V - v, (d / 3) * (L * L + l * l + L * l)),
  }
}
