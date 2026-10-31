// Turns SymPy's integration rule tree into steps a student can follow, in Romanian.
import type { IntegralStep } from './sympyClient'
import { roTex } from './expr'

export interface ExplainedStep {
  title: string
  formula?: string // the general rule, LaTeX
  lines: string[] // LaTeX lines specific to this step (u = …, dv = …)
  integral: string // ∫ f dx = F
  children: { label?: string; step: ExplainedStep }[]
  note?: string
}

const s = (x: unknown) => roTex(String(x ?? ''))

/** Field names SymPy uses for sub-steps → a short label shown above the nested step. */
const FIELD_LABEL: Record<string, string> = {
  v_step: 'Calculăm v = ∫ dv',
  second_step: 'Rămâne integrala ∫ v du',
  alternatives: '',
}

const SPECIAL_FN: Record<string, string> = {
  ErfRule: 'erf (funcția erorilor)',
  FresnelSRule: 'S (integrala Fresnel)',
  FresnelCRule: 'C (integrala Fresnel)',
  SiRule: 'Si (sinus integral)',
  CiRule: 'Ci (cosinus integral)',
  ShiRule: 'Shi', ChiRule: 'Chi',
  EiRule: 'Ei (exponențiala integrală)',
  LiRule: 'li (logaritmul integral)',
  UpperGammaRule: 'Γ (funcția gamma incompletă)',
  PolylogRule: 'Li (polilogaritm)',
  EllipticFRule: 'F (integrală eliptică)',
  EllipticERule: 'E (integrală eliptică)',
}

function describe(st: IntegralStep): Pick<ExplainedStep, 'title' | 'formula' | 'lines' | 'note'> {
  const x = s(st.variable)
  const lines: string[] = []
  switch (st.rule) {
    case 'ConstantRule':
      return { title: 'Integrala unei constante', formula: `\\int c\\,d${x} = c\\,${x} + C`, lines }
    case 'ConstantTimesRule':
      return {
        title: 'Scoatem constanta în fața integralei',
        formula: `\\int c \\cdot f(${x})\\,d${x} = c \\int f(${x})\\,d${x}`,
        lines: [`c = ${s(st.constant)}`],
      }
    case 'PowerRule':
    case 'NestedPowRule':
      return { title: 'Formula puterii', formula: `\\int ${x}^n\\,d${x} = \\dfrac{${x}^{n+1}}{n+1} + C \\quad (n \\neq -1)`, lines: st.exp ? [`n = ${s(st.exp)}`] : [] }
    case 'AddRule':
      return { title: 'Integrala sumei este suma integralelor', formula: `\\int (f + g)\\,d${x} = \\int f\\,d${x} + \\int g\\,d${x}`, lines }
    case 'URule': {
      const u = s(st.u_var) || 'u'
      return {
        title: 'Schimbare de variabilă (substituție)',
        lines: [`${u} = ${s(st.u_func)}`, `d${u} = \\left(${s(st.u_func)}\\right)'\\,d${x}`],
        note: `Rescriem integrala în funcție de ${u}, o calculăm, apoi revenim la ${x}.`,
      }
    }
    case 'PartsRule':
      return {
        title: 'Integrare prin părți',
        formula: `\\int u\\,dv = u\\,v - \\int v\\,du`,
        lines: [`u = ${s(st.u)}`, `dv = ${s(st.dv)}\\,d${x}`],
      }
    case 'CyclicPartsRule':
      return {
        title: 'Integrare prin părți repetată (integrala revine)',
        note: 'După două integrări prin părți reapare integrala de la început; o notăm cu I și o aflăm rezolvând ecuația în I.',
        lines,
      }
    case 'SinRule':
      return { title: 'Integrala lui sinus', formula: `\\int \\sin ${x}\\,d${x} = -\\cos ${x} + C`, lines }
    case 'CosRule':
      return { title: 'Integrala lui cosinus', formula: `\\int \\cos ${x}\\,d${x} = \\sin ${x} + C`, lines }
    case 'Sec2Rule':
      return { title: 'Integrală tabelară', formula: `\\int \\dfrac{1}{\\cos^2 ${x}}\\,d${x} = \\operatorname{tg} ${x} + C`, lines }
    case 'Csc2Rule':
      return { title: 'Integrală tabelară', formula: `\\int \\dfrac{1}{\\sin^2 ${x}}\\,d${x} = -\\operatorname{ctg} ${x} + C`, lines }
    case 'SecTanRule':
      return { title: 'Integrală tabelară', formula: `\\int \\dfrac{\\sin ${x}}{\\cos^2 ${x}}\\,d${x} = \\dfrac{1}{\\cos ${x}} + C`, lines }
    case 'CscCotRule':
      return { title: 'Integrală tabelară', formula: `\\int \\dfrac{\\cos ${x}}{\\sin^2 ${x}}\\,d${x} = -\\dfrac{1}{\\sin ${x}} + C`, lines }
    case 'SinhRule':
      return { title: 'Integrala sinusului hiperbolic', formula: `\\int \\sinh ${x}\\,d${x} = \\cosh ${x} + C`, lines }
    case 'CoshRule':
      return { title: 'Integrala cosinusului hiperbolic', formula: `\\int \\cosh ${x}\\,d${x} = \\sinh ${x} + C`, lines }
    case 'ExpRule':
      return st.base === 'e'
        ? { title: 'Integrala exponențialei', formula: `\\int e^{${x}}\\,d${x} = e^{${x}} + C`, lines }
        : { title: 'Integrala funcției exponențiale', formula: `\\int a^{${x}}\\,d${x} = \\dfrac{a^{${x}}}{\\ln a} + C`, lines: [`a = ${s(st.base)}`] }
    case 'ReciprocalRule':
      return { title: 'Integrală tabelară', formula: `\\int \\dfrac{1}{${x}}\\,d${x} = \\ln|${x}| + C`, lines }
    case 'ArctanRule':
      return { title: 'Integrală tabelară (arctangentă)', formula: `\\int \\dfrac{d${x}}{${x}^2 + a^2} = \\dfrac{1}{a}\\operatorname{arctg}\\dfrac{${x}}{a} + C`, lines }
    case 'ArcsinRule':
      return { title: 'Integrală tabelară (arcsinus)', formula: `\\int \\dfrac{d${x}}{\\sqrt{1 - ${x}^2}} = \\arcsin ${x} + C`, lines }
    case 'ArcsinhRule':
      return { title: 'Integrală tabelară', formula: `\\int \\dfrac{d${x}}{\\sqrt{${x}^2 + 1}} = \\ln\\left(${x} + \\sqrt{${x}^2 + 1}\\right) + C`, lines }
    case 'ReciprocalSqrtQuadraticRule':
      return { title: 'Integrală cu radical din trinom la numitor', note: 'Se aduce trinomul la forma canonică (pătrat perfect) și se folosește o integrală tabelară.', lines }
    case 'SqrtQuadraticRule':
      return { title: 'Integrală cu radical din trinom', note: 'Formulă cunoscută, obținută prin integrare prin părți sau substituție trigonometrică.', lines }
    case 'SqrtQuadraticDenomRule':
      return { title: 'Fracție cu radical din trinom la numitor', note: 'Scriem numărătorul ca multiplu al derivatei trinomului plus o constantă și separăm integrala.', lines }
    case 'CompleteSquareRule':
      return { title: 'Formăm pătrat perfect', lines: [`${s(st.integrand)} = ${s(st.rewritten)}`] }
    case 'RewriteRule':
      if (st.partial)
        return {
          title: 'Descompunem în fracții simple',
          note: 'Fracția rațională se scrie ca sumă de fracții simple (după împărțirea polinoamelor, dacă gradul numărătorului e mai mare).',
          lines: [`${s(st.integrand)} = ${s(st.rewritten)}`],
        }
      return { title: 'Rescriem funcția de integrat', lines: [`${s(st.integrand)} = ${s(st.rewritten)}`] }
    case 'TrigSubstitutionRule':
      return {
        title: 'Substituție trigonometrică',
        lines: [`${x} = ${s(st.func)}`, ...(st.restriction ? [`\\text{condiție: } ${s(st.restriction)}`] : [])],
      }
    case 'AlternativeRule':
      return { title: 'Alegem o metodă', note: 'Integrala se poate rezolva în mai multe feluri; arătăm o variantă.', lines }
    case 'DerivativeRule':
      return { title: 'Integrala unei derivate', formula: `\\int f'(${x})\\,d${x} = f(${x}) + C`, lines }
    case 'PiecewiseRule':
      return { title: 'Funcție pe ramuri', note: 'Integrăm separat pe fiecare ramură.', lines }
    case 'DontKnowRule':
      return { title: 'Fără regulă elementară pentru acest pas', note: 'Metodele de liceu nu se aplică aici.', lines }
  }
  if (SPECIAL_FN[st.rule])
    return {
      title: 'Primitivă neelementară',
      note: `Această integrală nu se poate scrie cu funcții elementare; rezultatul se exprimă prin funcția specială ${SPECIAL_FN[st.rule]}.`,
      lines,
    }
  return { title: st.rule.replace(/Rule$/, ''), lines }
}

export function explain(st: IntegralStep): ExplainedStep {
  const d = describe(st)
  const x = s(st.variable)
  // only the first alternative is shown, so the tree does not branch for no reason
  const subs = st.rule === 'AlternativeRule' ? st.substeps.slice(0, 1) : st.substeps
  const children = subs.map((c) => ({
    label: c.cond ? `Pentru ${s(c.cond)}` : FIELD_LABEL[c.field] || undefined,
    step: explain(c.step),
  }))
  // an AlternativeRule wrapper adds nothing on its own: show the chosen method directly
  if (st.rule === 'AlternativeRule' && children.length === 1) return children[0].step
  return {
    ...d,
    integral: `\\int ${s(st.integrand)}\\,d${x} = ${st.result ? s(st.result) : '?'} + C`,
    children,
  }
}
