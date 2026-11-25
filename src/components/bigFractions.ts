// The fractions of a formula in the text written large, as in the books (\dfrac), asked for by the user (25 November
// 2026): the generated exercises wrote \frac, which KaTeX makes small inside a line. A fraction stays small in an
// exponent or index, and inside another fraction.

/** `\frac` → `\dfrac`, except in `^…`, `_…` and the numerator or denominator of another fraction. */
export function bigFractions(tex: string): string {
  if (!tex.includes('\\frac')) return tex
  // one frame per group in braces: whether it is small, and how many arguments of a fraction are still to come in it
  const stack = [{ small: false, args: 0 }]
  let out = ''
  let script = false
  let i = 0
  while (i < tex.length) {
    const top = stack[stack.length - 1]
    const cmd = /^\\(?:[a-zA-Z]+|.)/.exec(tex.slice(i))?.[0]
    const tok = cmd ?? tex[i]
    i += tok.length
    if (tok === '{') {
      stack.push({ small: top.small || script || top.args > 0, args: 0 })
      if (top.args > 0) top.args--
      script = false
      out += tok
      continue
    }
    if (tok === '}') {
      if (stack.length > 1) stack.pop()
      out += tok
      continue
    }
    if (/^\s+$/.test(tok)) { out += tok; continue }
    if (tok === '\\frac' || tok === '\\dfrac' || tok === '\\tfrac') {
      const small = top.small || script || top.args > 0
      if (top.args > 0) top.args--
      script = false
      out += tok === '\\frac' && !small ? '\\dfrac' : tok
      // a fraction in a script or an argument: its own arguments come in the same group
      top.args += 2
      continue
    }
    // a single token as the argument of a fraction or of a script (\frac12, x^2)
    if (top.args > 0) top.args--
    script = tok === '^' || tok === '_'
    out += tok
  }
  return out
}
