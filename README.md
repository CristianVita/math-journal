# Jurnal Meditații

Jurnal pentru meditații de matematică: elevi, ședințe, notițe cu formule LaTeX, construcții geometrice, unelte de trigonometrie și o paletă completă de simboluri matematice.

Rulează în browser (web) și e gândit să fie împachetat ca aplicație desktop pentru Windows și Linux cu [Tauri](https://tauri.app).

## Ce face

**Jurnal**
- Elevi cu clasă, obiectiv (Evaluare Națională, Bac M1/M2, olimpiadă…), contact și observații
- Ședințe datate: durată, subiecte, evaluare 1–5, notițe, temă (bifată când e făcută), desene atașate
- Notițe în Markdown cu formule: `$...$` în rând, `$$...$$` separat (randate cu KaTeX), cu previzualizare live
- Statistici per elev: număr de ședințe, ore, procent teme făcute, evaluare medie; filtrare după subiect
- Salvare automată locală (IndexedDB); backup / restaurare în fișier JSON

**Tablă (geometrie)**
- Punct, segment (cu lungime), dreaptă, semidreaptă, cerc, poligon, poligon regulat cu n laturi
- Unghi cu măsura afișată (grade sau radiani), marcaj automat de unghi drept
- **Construiește un unghi de x°** pornind de la un vârf și o latură
- Mijlocul unui segment, perpendiculară, paralelă, bisectoare, intersecția a două drepte
- Construcțiile sunt dependente: muți un punct și tot ce e construit pe el se actualizează
- Text și formule LaTeX pe tablă, desen liber (mouse / stylus), graficul oricărei funcții f(x)
- Grilă, axe, aliniere la grilă, zoom (rotița), mutarea tablei, anulare/refacere, export PNG/SVG
- Figurile pot fi salvate direct într-o ședință din jurnal

**Trigonometrie**
- Cercul trigonometric interactiv: sin, cos, tg, ctg cu valori exacte la unghiurile remarcabile
- Grafice `A·f(Bx + C) + D` pentru sin, cos, tg, ctg, cu perioadă, defazaj și imagine
- Rezolvarea oricărui triunghi (LLL, LUL, ULU, LUU, LLU cu cazul ambiguu): arie, perimetru, R, r, înălțimi; se poate deschide pe tablă
- Convertor grade ↔ radiani, tabel de valori, formule (reducere, sume, unghi dublu, transformări, ecuații, triunghi)

**Simboluri**
- Alfabetul grecesc complet (mici și mari), integrale de toate felurile (simple, duble, triple, curbilinii, de suprafață, închise, definite, improprii, prin părți), analiză, trigonometrie, operații, relații, mulțimi și logică, geometrie și vectori, săgeți, matrici și sisteme
- Căutare după nume; click inserează simbolul în câmpul de notițe activ

## Rulare

```bash
npm install
npm run dev
```

Apoi deschide http://localhost:5173.

> Pe Windows, dacă PowerShell refuză `npm` („running scripts is disabled”), folosește `npm.cmd` în loc de `npm`.

Build pentru web (fișierele statice ajung în `dist/`):

```bash
npm run build
```

## Aplicația desktop (Windows / Linux)

Aplicația desktop folosește [Tauri 2](https://tauri.app): același cod, într-o fereastră nativă. Datele se păstrează local, în profilul aplicației. Backup-ul și exporturile PNG/SVG deschid fereastra „Salvează ca” a sistemului.

Cerințe: [Rust](https://rustup.rs) și, pe Linux, `libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf`.

```bash
npm run tauri dev                      # fereastra desktop cu reîncărcare live
npm run tauri build                    # installer pentru sistemul curent
npm run tauri build -- --bundles nsis  # doar installer-ul .exe pentru Windows
```

Installer-ul ajunge în `src-tauri/target/release/bundle/`.

## Publicare automată (GitHub Actions)

- **Web:** `.github/workflows/pages.yml` publică site-ul pe GitHub Pages la fiecare push pe `main`. Trebuie activat o singură dată, din *Settings → Pages → Source: GitHub Actions*.
- **Desktop:** `.github/workflows/release.yml` construiește installerele pentru Windows (`.exe`) și Linux (`.AppImage`, `.deb`, `.rpm`) la fiecare tag `v*`:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Installerele apar într-un release *draft* pe GitHub. Îl verifici și apoi îl publici.

## Structură

```
src/
  App.tsx              navigare: Jurnal, Tablă, Trigonometrie, Simboluri
  db.ts                baza de date locală (Dexie / IndexedDB), backup
  journal/             elevi, listă de ședințe, editorul de ședință
  geometry/            modelul scenei, motorul de construcții, tabla interactivă
  trig/                cercul trigonometric, grafice, rezolvarea triunghiului, formule
  symbols/             lista de simboluri, paleta, inserarea în text
  components/          randare Markdown + LaTeX, dialoguri
  platform.ts          diferențele web / desktop (salvarea fișierelor)
src-tauri/             aplicația desktop (Tauri): configurare, iconițe, permisiuni
```
