# Jurnal Meditații — Math Tutoring Journal

*English · [Română](README.ro.md)*

AI written with Claude-Code

A journal for math tutors: keep track of students and sessions, write notes with LaTeX formulas, build geometric constructions, explore trigonometry, and insert any math symbol in one click.

It runs in the browser and as a desktop app for Windows and Linux (built with [Tauri](https://tauri.app)). All data stays on your device.

> The interface is in **Romanian** (it was built for tutoring Romanian high-school math: Evaluare Națională, Bacalaureat). The math itself is universal.

## Download

Get the installer for your system from the [latest release](https://github.com/CristianVita/math-journal/releases/latest):

| System | File |
|---|---|
| Windows | `…_x64-setup.exe` (or the `.msi`) |
| Windows, no install | `…_x64-portable.exe` — just run it (needs WebView2, built into Windows 11 and updated Windows 10) |
| Linux, any distro | `….AppImage` (make it executable, then run it) |
| Ubuntu / Debian / Mint | `….deb` |
| Fedora / openSUSE | `….rpm` |

The Windows installer is not code-signed yet. If SmartScreen shows "Windows protected your PC", click **More info → Run anyway**.

## Features

**Journal**
- Students with grade, goal (national exams, olympiad…), contact and notes
- Dated sessions: duration, topics, a 1–5 rating, notes, homework (tick it off when done), attached drawings
- Markdown notes with formulas: `$...$` inline and `$$...$$` on their own line, rendered with KaTeX, with a live preview
- Per-student stats: number of sessions, hours, homework completion rate, average rating; filter sessions by topic
- Local autosave (IndexedDB) plus JSON backup and restore

**Geometry board**
- Point, segment (with length), line, ray, circle, polygon, regular polygon with n sides
- **Triangles** by type and size: right (two legs), acute and obtuse (three sides, checked against the type), equilateral, isosceles
- **Angle between two lines**, with its measure (degrees or radians) and an automatic right-angle mark; measures at the same vertex keep clear of one another
- **Construct an angle** from three points (the second is the vertex), with the exact measure and the exact lengths of its sides typed in a dialog
- Circular **arcs and sectors**, with the degrees shown in steps of 1°; tick **Show measure** to keep them written on the board
- Dialogs keep what you typed when a value is wrong, and say what to fix
- Midpoint, intersection (also of polygon sides and solid edges), **perpendicular from a point to its foot** (with the distance, and a dashed extension when the foot falls beyond a segment), **perpendicular bisector**, parallel and perpendicular lines of a chosen length, **angle bisector** to the opposite side or of a chosen length
- Perpendicular and parallel lines show a **preview** before the click, and a click on a free spot creates the point
- New points **snap onto lines, circles and intersections**, with a preview before the click; snapped points stay on their line and slide along it
- **Select a whole figure** and move it, scale it or rotate it (around its centre or any vertex), by dragging handles or with exact values
- Constructions are dependent: move a point and everything built on it follows
- Text and LaTeX labels, freehand drawing (mouse or stylus), plot any function f(x)
- Grid, axes, snap to grid, zoom (mouse wheel), pan (hand tool, right-drag or Space-drag), undo/redo, PNG/SVG export
- Save a figure straight into a journal session
- **Drawing instruments:** ruler, set square, protractor and compass, which dock onto each other to draw parallel lines; a straight line drawn along them becomes a real segment that the tools can build on
- Deleting a polygon also deletes the segments made from its sides; a vertex shared by several angles keeps its letter outside all of them

**3D solids** (on the board and in the notebook)
- Cube, cuboid, triangular, square and hexagonal prisms, cylinder, cone, sphere, regular tetrahedron, triangular, square and hexagonal pyramids, with their hidden edges dashed
- Real 3D models: on the board, **turn a solid in space** with the 3D handle or the sliders, and the hidden edges are worked out again
- **Lettered corners** (ABCDA′B′C′D′, V, O, O′) to draw diagonals, radii and heights; new points snap onto edges and circles, and stay there when the solid moves or turns
- Midpoint, perpendicular, perpendicular bisector, parallel, angle bisector and angle between two lines work directly on edges, and are **computed on the body, not on the screen**: a right angle of a cube reads 90° from any direction, and lengths are the real ones
- **Skew lines are visible:** where two lines of a solid only seem to cross, the one behind is broken; lines that really meet stay whole
- **Segments dash themselves:** a diagonal, height or radius drawn on a solid is dashed while it runs through the inside or lies on a face turned away, and changes when the solid turns
- Hide the corners and letters of a solid or a figure drawn only as an illustration
- Deleting a solid also deletes what is drawn inside it (Ctrl+Z brings it back)

**Notebook**
- Free writing with a pen, highlighter or eraser, using a mouse, a stylus or a finger; typed text; pages and several kinds of paper
- The **eraser rubs out only what it passes over**, like a real one
- A row of figures (segment, triangles, quadrilaterals, kite, circle, ellipse) with lettered corners that tools can build on
- A row of constructions: all the tools of the board, separately on each page
- The drawing instruments, which lie over the constructions, and the 3D solids, which **turn in space** as on the board
- **Smooth zoom** from 50% to 300%: mouse wheel or touchpad, Ctrl with + or -, Ctrl+0 to reset, or the buttons
- Export to PDF, Word or PNG

**Worksheets** (grades V–VIII, up to the national exam)
- Exercises made by the app, by grade, type and level (easy, medium, hard), each with its worked solution in Romanian: order of operations, powers, fractions, decimals, percentages, proportions, integers, radicals, linear equations and inequalities, systems, factoring, quadratic equations by factoring; angles, rectangles, Pythagoras, areas of quadrilaterals, Thales and similarity, trigonometric ratios in a right triangle, areas and volumes of solids, distances and angles in space (the theorem of the three perpendiculars, dihedral angles), frustums, the sphere and sections parallel to the base
- Several patterns at every level; the hard level of grades VII–VIII follows the national exam (multi-step problems, after real recap tests and mock exams)
- A **contest** level for every grade, after local and county olympiad problems: Gauss sums, remainders, divisibility, telescoping sums, irreducible fractions, double radicals, equations in whole numbers, minimums by squares, inequalities, the linear function
- Up to 100 exercises at once, with **none repeated on a sheet**; a pattern comes back only after all the others of the grade and level have been used
- A bank of your own exercises, with formulas, to reuse with any student
- Swap an exercise for another of the same kind, reorder, keep it in the bank
- Printed as PDF or Word on A4 pages: title, the student's name (or a blank line) and the date, room to work under each exercise, and the solutions on separate pages

**Trigonometry**
- Interactive unit circle: sin, cos, tan, cot with exact values at the special angles
- Plots of `A·f(Bx + C) + D` for sin, cos, tan, cot, **inverse trigonometric** (arcsin, arccos, arctan, arccot) and **hyperbolic** functions (sinh, cosh, tanh, coth), with period / domain and range and their asymptotes
- Solve any triangle (SSS, SAS, ASA, AAS, and SSA including the ambiguous case): area, perimeter, circumradius, inradius, heights, **angle bisectors and medians**; open the result on the board
- Degrees ↔ radians converter, table of special values, identities (reduction, sum and difference, double angle, sum-to-product, equations, triangle formulas)

**Calculus calculator**
- **Visual formula editor** ([MathLive](https://mathlive.io)): typing `/` draws a real fraction bar, `^` moves into the exponent, and touch screens get a math keyboard; a plain-text mode is one click away
- **Derivatives, step by step:** every rule applied (sum, product, quotient, chain rule, powers, exponentials, logs, trig and inverse trig), each shown with the general formula, the raw result and the simplified one; higher-order derivatives; works offline
- **Integrals, step by step**, powered by [SymPy](https://www.sympy.org) running in the browser via [Pyodide](https://pyodide.org): substitution, integration by parts (including the cyclic case), partial fractions, trig substitution, table integrals — explained in Romanian, with `ln|u|` as taught in school
- Definite and improper integrals, with divergence detection (e.g. `∫₋₁² dx/x²` diverges because of x = 0) and an independent numeric check (Simpson's rule)
- Recognises non-elementary antiderivatives (e.g. `e^(x²)` → erfi) and proves non-elementarity with the Risch algorithm when possible
- **Check a student's answer:** type the derivative or antiderivative the student found; it is compared with the correct one (for integrals: its derivative must give back f, so the constant does not matter)
- Add the result and the steps to a session's notes in one click

The SymPy engine (~15–20 MB) is downloaded the first time the integral tab is opened, then cached.

**Symbols**
- Full Greek alphabet (lower and upper case), every kind of integral (single, double, triple, line, surface, closed, definite, improper, by parts), calculus, trigonometry, operators, relations, sets and logic, geometry and vectors, arrows, matrices and systems
- Search by name; one click inserts the symbol at the cursor in the active note

## Run from source

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

> On Windows, if PowerShell refuses to run `npm` ("running scripts is disabled"), use `npm.cmd` instead.

Automated tests (the 3D solids: corners, hidden edges, real lengths and angles, skew lines):

```bash
npm test
```

Static web build (output in `dist/`):

```bash
npm run build
```

## Desktop app (Windows / Linux)

The desktop app is the same code in a native window, via [Tauri 2](https://tauri.app). Data is stored locally in the app's profile, and backups and PNG/SVG exports open the system "Save as" dialog.

Requirements: [Rust](https://rustup.rs), and on Linux `libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf`.

```bash
npm run tauri dev                      # desktop window with live reload
npm run tauri build                    # installer for the current OS
npm run tauri build -- --bundles nsis  # Windows .exe installer only
```

Installers are written to `src-tauri/target/release/bundle/`.

> On Windows, keep the project outside folders guarded by Defender's *Controlled folder access* (Documents, Desktop…), e.g. in `C:\dev`. Otherwise the Rust build gets blocked.

## Automated publishing (GitHub Actions)

- **Web:** `.github/workflows/pages.yml` deploys the site to GitHub Pages on every push to `main`. Enable it once under *Settings → Pages → Source: GitHub Actions*.
- **Desktop:** `.github/workflows/release.yml` builds the Windows and Linux installers for every `v*` tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The installers are attached to a *draft* release on GitHub. Review it, then publish it.

## Project structure

```
src/
  App.tsx              navigation: Journal, Board, Notebook, Trigonometry, Calculator, Symbols
  db.ts                local database (Dexie / IndexedDB), backup
  journal/             students, session list, session editor
  geometry/            scene model, construction engine, interactive board
  notebook/            notebook page, drawing instruments, figures, 3D solids
  export/              PDF, Word and image export
  trig/                unit circle, plots, triangle solver, formulas
  calculus/            derivative engine, SymPy worker (integrals), step explanations, calculator page
  symbols/             symbol list, palette, insert-at-cursor
  components/          Markdown + LaTeX rendering, dialogs
  platform.ts          web vs. desktop differences (saving files)
src-tauri/             desktop app (Tauri): config, icons, permissions
```
