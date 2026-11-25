// The tests of the grade VIII workbook "cu puișorul" (photographed on 25 November 2026) as worksheets: each test keeps
// the order and the kinds of its exercises in the book, with new numbers every time.
import * as A from './grade8puisor1'
import * as B from './grade8puisor2'
import * as C from './grade8puisor3'
import type { Form } from './alg8'
import { FORM8, GENERATORS, type Level } from './generators'

export interface TestItem { gen: string; level: Level; form?: number }
export interface Test8 { id: string; title: string; group: string; items: TestItem[] }

const of = (x: Form | [string, Level]): TestItem => {
  if (Array.isArray(x)) return { gen: x[0], level: x[1] }
  const f = FORM8.get(x)
  if (!f) throw new Error(`Tiparul ${x.name} nu este înregistrat`)
  return f
}
const group = (id: string, name: string, tests: (Form | [string, Level])[][]): Test8[] =>
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
]

/** Every kind a test names exists, at that level. */
export const testsOk = () => TESTS8.every((t) => t.items.every((i) => (GENERATORS.find((g) => g.id === i.gen)?.forms(i.level) ?? 0) > (i.form ?? 0)))
