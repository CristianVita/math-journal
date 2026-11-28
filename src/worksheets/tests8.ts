// The tests of the grade VIII workbook "cu puișorul" (photographed on 25 November 2026) as worksheets: each test keeps
// the order and the kinds of its exercises in the book, with new numbers every time.
import * as A from './grade8puisor1'
import * as B from './grade8puisor2'
import * as C from './grade8puisor3'
import * as G from './geometry8e'
import * as H from './geometry8f'
import type { Form } from './alg8'
import { FORM8, GENERATORS, type Level } from './generators'

export interface TestItem { gen: string; level: Level; form?: number }
export interface Test8 { id: string; title: string; group: string; items: TestItem[] }

/** A form of this workbook, or a kind at a level, or a kind, level and the number of an older form. */
type Ref = Form | [string, Level] | [string, Level, number]
const of = (x: Ref): TestItem => {
  if (Array.isArray(x)) return { gen: x[0], level: x[1], form: x[2] }
  const f = FORM8.get(x)
  if (!f) throw new Error(`Tiparul ${x.name} nu este înregistrat`)
  return f
}
const group = (id: string, name: string, tests: Ref[][]): Test8[] =>
  tests.map((t, i) => ({ id: `${id}-${i + 1}`, group: name, title: `${name}, testul ${i + 1}`, items: t.map(of) }))

export const TESTS8: Test8[] = [
  // pp. 6–8
  ...group('t8-initial', 'Evaluare inițială', [
    [['vi-integers', 2], ['vii-real-numbers', 1], ['vi-percent', 2], ['vii-linear', 1], ['vii-quadrilaterals', 1], ['vii-trig', 1], ['vii-thales', 1], ['viii-inequality', 2], ['viii-problems', 2], ['vii-metric', 2]],
    [['vi-fractions', 2], ['vii-circle', 1], ['vii-radicals', 1], A.ineqModZ, ['vii-areas', 1], ['vii-pythagoras', 1], ['vii-linear', 2], ['viii-system', 2], ['vi-percent', 2], ['vii-areas', 3]],
    [['vi-fractions', 3], ['vii-real-numbers', 2], ['vii-circle', 1], ['vi-percent', 1], ['vii-areas', 1], ['vii-pythagoras', 1], ['vii-thales', 2], ['vii-trig', 2], ['vii-linear', 3], ['vii-radicals', 3]],
    [['vi-fractions', 3], A.setModulus, ['vii-radicals', 2], ['vii-trig', 1], ['vi-percent', 2], ['vii-areas', 2], ['vii-thales', 1], ['vii-radicals', 3], ['viii-problems', 3], ['vii-metric', 3]],
  ]),
  // pp. 16–17
  ...group('t8-intervals', 'Intervale și inecuații', [
    [A.ivWrite, A.setModulus, A.ivIntegers, A.ivUnionInter, A.ineqWhich, A.ineqSquaresCancel, A.ineqModZ, A.setDivisors],
    [A.ivWrite, A.ivIntegers, A.setBetween, A.ineqFractions, A.ivDouble, A.ineqOverModulus, A.ivSetsOps, A.ivCard],
    [A.ivWrite, A.ivUnionInter, A.ineqFractions, A.ineqRadical, A.ivFindAB, A.ineqTwoSets, A.ineqOverModulus],
  ]),
  // pp. 33–35
  ...group('t8-factoring', 'Calcul algebric și descompuneri', [
    [A.likeTerms, A.fDiff, A.monoPower, A.fMixed, A.fNested, B.facDifference, B.facCommonThen, B.facSquareMinus, B.facSubstitution, A.fReciprocal],
    [A.distribute, A.fSquare, A.productsMinus, B.facBracket, B.facPerfectSquare, B.facDiffBrackets, B.facCubicGroup, B.facSubstitution, A.fMeans, A.fInequality],
    [A.fMixed, A.likeTerms, B.facCommonThen, B.facDifference, B.facSquareMinus, B.conjSum, B.facBiquadratic, B.facSubstitution, A.fSquaresZero, A.fExtreme],
  ]),
  // pp. 40–41
  ...group('t8-fractions', 'Fracții algebrice', [
    [B.afSimplifyEasy, B.afSimplify, B.afSumEasy, B.afSum, B.afProduct, B.afExpression],
    [B.afSimplifyEasy, B.afSimplify, B.afSum, B.afProduct, B.afBracket, B.afExpression],
    [B.afSimplify, B.afCubic, B.afSum, B.afProduct, B.afBracket, B.afExpression],
  ]),
  // pp. 43–44
  ...group('t8-quadratic', 'Ecuații de gradul al doilea', [
    [B.qdFormula, B.qdSquareForm, B.qdGivenRoot, B.qdFractionSquare, A.fSquaresZero, B.qdFractions, B.quizPoints],
    [B.qdFormula, B.qdProduct, B.qdToForm, B.qdGivenRoot, B.qdNumbers, B.qdFractions, B.qdSumSquares],
    [B.qdFormula, B.qdToForm, B.qdFractions, B.ineqAlwaysPositive, B.ineqSquares, B.qdTriangle, B.qdEqualRoots],
  ]),
  // pp. 54–55
  ...group('t8-functions', 'Funcții', [
    [C.lfDraw, C.fnValues, C.fnOnGraph, ['viii-function', 2], C.lfEquation, C.lfAxes, C.lfSpecialPoint, C.lfIntersection, C.lfInequality],
    [C.lfDraw, C.fnParameter, C.lfParamPoints, C.fnImage, C.lfEquation, C.lfCollinear, C.lfTangent, C.lfSymmetric],
    [C.lfDraw, C.lfParamPoints, C.fnOnGraph, ['viii-function', 2], C.lfAreaGiven, C.lfEquation],
    [C.lfDraw, C.fnOnGraph, C.fnImage, C.lfIntersection, C.lfTwoLinesArea, C.lfSymmetric],
  ]),
  // geometry, chapter 5 (photographed on 27 November 2026); older forms by their number in the kind, so that a test
  // keeps the exercise of the book: 1.4, 1.5 and 2.5 of pp. 61–62 are plane geometry (grade VII forms)
  // pp. 61–62
  ...group('t8-solids', 'Corpuri geometrice', [
    [['viii-elements', 3, 0], ['viii-solids', 1, 3], ['viii-solids', 1, 1], ['vii-pythagoras', 1, 1], ['vii-circle', 1, 1], ['viii-solids', 1, 4], ['viii-solids', 2, 10], G.triPyramidFaces, G.quadPyramidEqualEdges],
    [['viii-elements', 1, 0], ['viii-elements', 3, 0], ['vii-areas', 1, 1], ['viii-solids', 1, 0], ['viii-solids', 1, 1], ['viii-prisms', 1, 1], G.triPyramidFaces, G.cylinderAxialDiagonals, G.sectorToCone],
  ]),
  // pp. 71–72
  ...group('t8-parallel', 'Paralelism și perpendicularitate', [
    [['viii-dihedral', 1, 5], G.trapezoidTriangleSpace, G.trapezoidProjections],
    [G.cubeExamples, G.cubeFromEdgeSum, G.cubeFaceCenter, G.tetraBasics],
  ]),
  // pp. 81–82
  ...group('t8-angles', 'Unghiuri și distanțe în spațiu', [
    [G.squarePerpFull, G.parallelSquare],
    [G.cubeFromEdgeSum, ['viii-dihedral', 1, 7], ['viii-dihedral', 2, 5]],
    [G.cubeExamples, G.rightTrapezoidPerp],
    [G.truthValues, ['viii-dihedral', 3, 1]],
  ]),
  // chapter 6, areas and volumes (photographed on 27 November 2026); the quick questions with answers a)–d) of the book
  // are asked plainly
  // pp. 90–91
  ...group('t8-prisms', 'Prisme: arii și volume', [
    [H.cubeQuick, H.prismBlanks, H.triPrismAbV],
    [H.cuboidQuick, ['viii-solids', 1, 0], H.prismBlanks, H.squarePrismSine],
    [H.cubeOne, ['viii-dihedral', 1, 2], H.cuboidFromDistance, H.hexPrismPath],
    [H.hexPrismQuick, ['viii-solids', 3, 2], H.squarePrismRhombus, ['viii-cuboid', 3, 3]],
  ]),
  // pp. 101–102
  ...group('t8-pyramids', 'Piramide și trunchiuri de piramidă', [
    [['viii-solids', 2, 1], ['viii-frustums', 1, 5], H.hexPyrDistances, H.triPyrCutMin],
    [['viii-pyramids', 1, 1], ['viii-solids', 3, 0], H.frustumLateral, H.hexFrustumAll],
    [['viii-pyramids', 2, 0], H.triFrustumOrigin, H.hexPyrCutFaces],
    [['viii-solids', 3, 5], ['viii-frustums', 2, 4], H.hexPyrAdjacentFaces],
  ]),
  // pp. 109–110
  ...group('t8-round', 'Cilindrul, conul, trunchiul de con, sfera', [
    [['viii-round', 1, 2], ['viii-round', 2, 6], ['viii-frustums', 1, 7], H.sectorConeCut],
    [['viii-round', 2, 3], ['viii-frustums', 2, 2], H.coneLateralRatio, H.coneFrustumFromV],
    [['viii-round', 1, 1], ['viii-frustums', 2, 2], H.coneCentroidCut, H.coneFrustumPerpDiag],
    [['viii-round', 1, 0], ['viii-frustums', 1, 7], H.semicircleConeCut, H.frustumProportional],
  ]),
]

/** Every kind a test names exists, at that level. */
export const testsOk = () => TESTS8.every((t) => t.items.every((i) => (GENERATORS.find((g) => g.id === i.gen)?.forms(i.level) ?? 0) > (i.form ?? 0)))
