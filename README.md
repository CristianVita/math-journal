# Jurnal Meditații — Math Tutoring Journal

*English · [Română](README.ro.md)*

A journal for math tutors: keep track of students and sessions, write notes with LaTeX formulas, build geometric constructions, explore trigonometry, and insert any math symbol in one click.

It runs in the browser and as a desktop app for Windows and Linux (built with [Tauri](https://tauri.app)). All data stays on your device.

> The interface is in **Romanian** (it was built for tutoring Romanian high-school math: Evaluare Națională, Bacalaureat). The math itself is universal.

## Download

Get the installer for your system from the [latest release](https://github.com/CristianVita/math-journal/releases/latest):

| System | File |
|---|---|
| Windows | `…_x64-setup.exe` (or the `.msi`) |
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
- Angle with its measure shown (degrees or radians), automatic right-angle mark
- **Construct an angle of x°** from a vertex and one side
- Midpoint, perpendicular, parallel, angle bisector, intersection of two lines
- Constructions are dependent: move a point and everything built on it follows
- Text and LaTeX labels, freehand drawing (mouse or stylus), plot any function f(x)
- Grid, axes, snap to grid, zoom (mouse wheel), pan, undo/redo, PNG/SVG export
- Save a figure straight into a journal session

**Trigonometry**
- Interactive unit circle: sin, cos, tan, cot with exact values at the special angles
- Plots of `A·f(Bx + C) + D` for sin, cos, tan, cot, with period, phase shift and range
- Solve any triangle (SSS, SAS, ASA, AAS, and SSA including the ambiguous case): area, perimeter, circumradius, inradius, heights; open the result on the board
- Degrees ↔ radians converter, table of special values, identities (reduction, sum and difference, double angle, sum-to-product, equations, triangle formulas)

**Calculus calculator**
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
  App.tsx              navigation: Journal, Board, Trigonometry, Symbols
  db.ts                local database (Dexie / IndexedDB), backup
  journal/             students, session list, session editor
  geometry/            scene model, construction engine, interactive board
  trig/                unit circle, plots, triangle solver, formulas
  calculus/            derivative engine, SymPy worker (integrals), step explanations, calculator page
  symbols/             symbol list, palette, insert-at-cursor
  components/          Markdown + LaTeX rendering, dialogs
  platform.ts          web vs. desktop differences (saving files)
src-tauri/             desktop app (Tauri): config, icons, permissions
```
