// Export of the notebook pages and the board as PDF or Word: each page is drawn to a picture (PNG) first,
// then placed on an A4 page. The libraries are loaded only when the user exports.
import { saveFile } from '../platform'

export interface PageImage {
  title: string
  /** size on screen, in CSS pixels; the picture itself is drawn at twice that for print */
  width: number
  height: number
  png: Uint8Array
  blob: Blob
  dataUrl: string
}

const SCALE = 2

const blobToDataUrl = (b: Blob) =>
  new Promise<string>((ok, fail) => {
    const r = new FileReader()
    r.onload = () => ok(r.result as string)
    r.onerror = fail
    r.readAsDataURL(b)
  })

/**
 * All of the app's CSS. An SVG drawn as a picture can't use the page's stylesheets, and the board styles its
 * lines and labels with classes.
 */
function appCss() {
  const parts: string[] = []
  for (const sheet of [...document.styleSheets]) {
    try {
      for (const rule of [...sheet.cssRules]) parts.push(rule.cssText)
    } catch {
      /* a stylesheet from another origin: not readable, and not needed */
    }
  }
  return parts.join('\n')
}

/**
 * Draw SVG markup onto a white canvas and return it as PNG. `overlay` can paint more on top, in CSS pixels
 * (the board's formulas). transparent: no white under it, to go on top of another picture.
 */
export async function rasterize(
  markup: string, width: number, height: number, title: string,
  overlay?: (ctx: CanvasRenderingContext2D) => Promise<void>,
  transparent = false,
): Promise<PageImage> {
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = url })
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * SCALE)
    canvas.height = Math.round(height * SCALE)
    const ctx = canvas.getContext('2d')!
    ctx.scale(SCALE, SCALE)
    if (!transparent) {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, width, height)
    }
    ctx.drawImage(img, 0, 0, width, height)
    await overlay?.(ctx)
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
    if (!blob) throw new Error('Imaginea nu a putut fi generată.')
    return { title, width, height, blob, png: new Uint8Array(await blob.arrayBuffer()), dataUrl: await blobToDataUrl(blob) }
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * A live SVG from the page (the board) as a picture. The parts that are only for editing (selection halos,
 * previews, snap hints) are left out. HTML inside the SVG (the KaTeX formulas, in foreignObject) would make the
 * browser refuse to export the canvas, so the SVG is drawn without it and each formula is painted on top
 * separately with html2canvas, from a copy placed off-screen.
 */
export async function svgElementPicture(svg: SVGSVGElement, remove: string, title: string, transparent = false) {
  const box = svg.getBoundingClientRect()
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.querySelectorAll(remove + ', foreignObject').forEach((el) => el.remove())
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(box.width))
  clone.setAttribute('height', String(box.height))
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  // the app's page color is set on :root, which here is the picture itself
  style.textContent = appCss() + (transparent ? '\n:root { background: none; }' : '')
  clone.insertBefore(style, clone.firstChild)

  const html = [...svg.querySelectorAll('foreignObject')]
    .filter((fo) => !fo.closest(remove))
    .map((fo) => fo.firstElementChild as HTMLElement | null)
    .filter((el): el is HTMLElement => !!el)

  return rasterize(new XMLSerializer().serializeToString(clone), box.width, box.height, title, async (ctx) => {
    if (!html.length) return
    const { default: html2canvas } = await import('html2canvas')
    for (const el of html) {
      const r = el.getBoundingClientRect()
      const copy = el.cloneNode(true) as HTMLElement
      const cs = getComputedStyle(el)
      Object.assign(copy.style, {
        position: 'fixed', left: '-10000px', top: '0', width: r.width + 'px',
        color: cs.color, fontSize: cs.fontSize, fontFamily: cs.fontFamily, lineHeight: cs.lineHeight, background: 'transparent',
      })
      document.body.appendChild(copy)
      try {
        const pic = await html2canvas(copy, { backgroundColor: null, scale: SCALE, logging: false })
        ctx.drawImage(pic, r.left - box.left, r.top - box.top, r.width, (pic.height / pic.width) * r.width)
      } finally {
        copy.remove()
      }
    }
  }, transparent)
}

/** One page per picture, A4, turned sideways for wide pictures. */
export async function savePdf(pages: PageImage[], fileName: string) {
  const { jsPDF } = await import('jspdf')
  let doc: InstanceType<typeof jsPDF> | null = null
  const margin = 10
  for (const p of pages) {
    const orientation = p.width > p.height ? 'landscape' : 'portrait'
    if (!doc) doc = new jsPDF({ orientation, unit: 'mm', format: 'a4', compress: true })
    else doc.addPage('a4', orientation)
    const pw = doc.internal.pageSize.getWidth()
    const ph = doc.internal.pageSize.getHeight()
    const k = Math.min((pw - 2 * margin) / p.width, (ph - 2 * margin) / p.height)
    doc.addImage(p.dataUrl, 'PNG', (pw - p.width * k) / 2, margin, p.width * k, p.height * k, undefined, 'FAST')
  }
  if (doc) return saveFile(fileName, doc.output('blob'))
  return false
}

/**
 * A Word document: a title, then each page as a picture (with its own heading when there are several).
 * `pagesOnly`: the pictures are whole pages with their own title already (a worksheet): one per page, nothing else.
 */
export async function saveDocx(pages: PageImage[], fileName: string, heading: string, pagesOnly = false) {
  const { Document, HeadingLevel, ImageRun, Packer, Paragraph } = await import('docx')
  // the text area of an A4 page with Word's default margins, in pixels at 96 dpi
  const maxW = 600, maxH = 840
  const children = pagesOnly ? [] : [new Paragraph({ text: heading, heading: HeadingLevel.HEADING_1 })]
  pages.forEach((p, i) => {
    if (pages.length > 1 && !pagesOnly) children.push(new Paragraph({ text: p.title, heading: HeadingLevel.HEADING_2, pageBreakBefore: i > 0 }))
    const k = Math.min(maxW / p.width, maxH / p.height, 1)
    children.push(new Paragraph({
      pageBreakBefore: pagesOnly && i > 0,
      children: [new ImageRun({ type: 'png', data: p.png, transformation: { width: Math.round(p.width * k), height: Math.round(p.height * k) } })],
    }))
  })
  const doc = new Document({ creator: 'Jurnal Meditații', title: heading, sections: [{ children }] })
  return saveFile(fileName, await Packer.toBlob(doc))
}

/** "2026-11-01", for file names */
export const today = () => new Date().toISOString().slice(0, 10)
