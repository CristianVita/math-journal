// Exercises from a photo of a workbook (12 November 2026), without paying for anything: the user gives the photo to
// a free chat (claude.ai) with the instructions below, copies its answer, and pastes it here. The app splits it into
// exercises, which the user checks, corrects and puts on the sheet, so the student gets a clear PDF, not a photo.

/** What to paste into the chat with the photo: the exercises back as Markdown with $…$, one per block, in one code block. */
export const PHOTO_PROMPT = `Transcrie exercițiile din poză, exact cum sunt scrise, pentru o fișă de matematică în limba română.

Reguli:
- Scrie tot răspunsul într-un singur bloc de cod (între \`\`\` și \`\`\`), ca să se poată copia exact.
- Separă exercițiile printr-un rând care conține doar ---
- Nu scrie numărul exercițiului la început (fișa le numerotează singură). Păstrează subpunctele a), b), c), fiecare pe rândul lui.
- Formulele le scrii în LaTeX: $...$ în text și $$...$$ pentru o formulă pe rândul ei.
- Folosește notațiile din manualele românești: \\operatorname{tg}, \\operatorname{ctg}, \\ln, \\lg, $C_n^k$, $A_n^k$, virgula zecimală scrisă {,} (de exemplu $2{,}5$).
- Cuvintele, cu diacritice, rămân în afara formulelor; nu folosi \\text{} cu diacritice.
- Nu rezolva exercițiile și nu adăuga comentarii, titluri sau explicații.
- Dacă o parte din poză nu se citește, scrie [ilizibil] în locul ei.`

/** A pasted answer turned into exercises: code fences dropped, \( \) and \[ \] made $…$, split, numbers taken off. */
export function splitExercises(raw: string): string[] {
  let text = raw.replace(/\r\n?/g, '\n')
  // only what is inside the code block, if there is one
  const fenced = [...text.matchAll(/```[a-zA-Z]*\n([\s\S]*?)```/g)].map((m) => m[1])
  if (fenced.length) text = fenced.join('\n---\n')
  text = text
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, f) => `$$${f.trim()}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, f) => `$${f.trim()}$`)
  // a separator may also open or close the text
  let parts = ('\n' + text + '\n').split(/\n\s*(?:-{3,}|\*{3,}|_{3,})[ \t]*(?=\n)/)
  // no separators: split where a line starts with an exercise number (1. or 1) at the start of a line)
  if (parts.filter((p) => p.trim()).length === 1) {
    const numbered = text.split(/\n(?=\s*\d{1,3}[.)]\s)/)
    if (numbered.length > 1) parts = numbered
  }
  return parts
    .map((p) => p.trim().replace(/^(?:\*\*)?\d{1,3}[.)](?:\*\*)?\s+/, '').trim())
    .filter((p) => p.length > 0)
}

/**
 * Each line of an exercise a paragraph of its own (a blank line after it), so that the subpoints a), b), c) have room
 * between them on the screen, as on the printed sheet. Lines inside a $$…$$ formula are left as they are.
 */
export function spacedLines(text: string): string {
  const blocks: string[] = []
  const kept = text.replace(/\$\$[\s\S]*?\$\$/g, (m) => `\u0000${blocks.push(m) - 1}\u0000`)
  return kept.replace(/([^\n])\n(?=[^\n])/g, '$1\n\n').replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[Number(i)])
}

/** The formulas of a piece of text that KaTeX could not draw, for a warning beside the exercise. */
export function brokenFormulas(text: string, render: (tex: string, display: boolean) => void): string[] {
  const bad: string[] = []
  const display = [...text.matchAll(/\$\$([\s\S]+?)\$\$/g)].map((m) => m[1])
  const inline = [...text.replace(/\$\$[\s\S]+?\$\$/g, '').matchAll(/\$([^$\n]+?)\$/g)].map((m) => m[1])
  for (const [list, d] of [[display, true], [inline, false]] as const) {
    for (const f of list) {
      try {
        render(f, d)
      } catch {
        bad.push(f)
      }
    }
  }
  // a $ left open is a formula that will not show
  if ((text.replace(/\$\$[\s\S]+?\$\$/g, '').match(/\$/g) ?? []).length % 2) bad.push('$ fără pereche')
  return bad
}
