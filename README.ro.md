# Jurnal Meditații

*[English](README.md) · Română*

AI written with Claude-Code

Jurnal pentru meditații de matematică: elevi, ședințe, notițe cu formule LaTeX, construcții geometrice, unelte de trigonometrie și o paletă completă de simboluri matematice.

Rulează în browser și ca aplicație desktop pentru Windows și Linux ([Tauri](https://tauri.app)).

## Descărcare

Installerele sunt pe pagina [Releases](https://github.com/CristianVita/math-journal/releases/latest):

- **Windows:** `…_x64-setup.exe` (sau `.msi`)
- **Windows, fără instalare:** `…_x64-portable.exe` — îl pornești direct (are nevoie de WebView2, inclus în Windows 11 și în Windows 10 actualizat)
- **Linux:** `.AppImage` (orice distribuție), `.deb` (Ubuntu/Debian), `.rpm` (Fedora)

Installerul de Windows nu e semnat digital. Dacă apare SmartScreen, apasă „Mai multe informații” → „Rulează oricum”.

## Ce face

**Jurnal**
- Elevi cu clasă, obiectiv (Evaluare Națională, Bac M1/M2, olimpiadă…), contact și observații
- Ședințe datate: durată, subiecte, evaluare 1–5, notițe, temă (bifată când e făcută), desene atașate
- Notițe în Markdown cu formule: `$...$` în rând, `$$...$$` separat (randate cu KaTeX), cu previzualizare live
- Statistici per elev: număr de ședințe, ore, procent teme făcute, evaluare medie; filtrare după subiect
- Salvare automată locală (IndexedDB); backup / restaurare în fișier JSON

**Tablă (geometrie)**
- Punct, segment (cu lungime), dreaptă, semidreaptă, cerc, poligon, poligon regulat cu n laturi
- **Triunghiuri** după tip și dimensiuni: dreptunghic (catete), ascuțitunghic și obtuzunghic (trei laturi, verificate față de tip), echilateral, isoscel
- **Unghiul dintre două linii**, cu măsura afișată (grade sau radiani) și marcaj automat de unghi drept; măsurile de la același vârf nu se suprapun
- **Construiește un unghi** din trei puncte (al doilea este vârful), cu măsura exactă scrisă într-un dialog
- **Arce și sectoare de cerc**, cu gradele afișate din 1° în 1°
- Mijloc, intersecție, **perpendiculara dintr-un punct până la picior** (cu distanța și cu prelungire punctată, dacă piciorul iese din segment), **mediatoare**, paralele și perpendiculare de lungime aleasă, **bisectoare** până la latura opusă sau de lungime aleasă
- Perpendiculara și paralela au **previzualizare** înainte de clic, iar un clic pe un loc liber creează punctul
- Punctele noi **se lipesc de linii, cercuri și intersecții**, cu previzualizare înainte de click; punctele lipite rămân pe linie și se plimbă de-a lungul ei
- **Selectezi o figură întreagă** și o muți, o scalezi sau o rotești (în jurul centrului sau al oricărui vârf), cu mânere sau cu valori exacte
- Construcțiile sunt dependente: muți un punct și tot ce e construit pe el se actualizează
- Text și formule LaTeX pe tablă, desen liber (mouse / stylus), graficul oricărei funcții f(x)
- Grilă, axe, aliniere la grilă, zoom (rotița), mutarea tablei (unealta mână, click dreapta sau Space + trage), anulare/refacere, export PNG/SVG
- Figurile pot fi salvate direct într-o ședință din jurnal
- **Instrumente de desen:** riglă, echer, raportor și compas, care se lipesc între ele pentru a trasa drepte paralele

**Corpuri 3D** (pe Tablă și în Caiet)
- Cub, paralelipiped, prisme triunghiulară, patrulateră și hexagonală, cilindru, con, sferă, tetraedru regulat, piramide triunghiulară, patrulateră și hexagonală, cu muchiile ascunse punctate
- Modele 3D reale: pe Tablă **rotești corpul în spațiu** cu mânerul 3D sau cu glisoarele, iar muchiile ascunse se recalculează
- **Vârfuri cu litere** (ABCDA′B′C′D′, V, O, O′), pentru diagonale, raze și înălțimi; punctele noi se prind de muchii și de cercuri și rămân pe ele când corpul se mută sau se rotește
- Mijlocul, perpendiculara, mediatoarea, paralela, bisectoarea și unghiul dintre două linii merg direct pe muchii și sunt **calculate pe corp, nu pe ecran**: unghiul drept al unui cub arată 90° din orice direcție, iar lungimile sunt cele reale
- **Dreptele necoplanare se văd:** unde două linii ale corpului doar par să se taie, cea din spate e întreruptă; cele care se taie cu adevărat rămân continue

**Caiet**
- Scris liber cu pixul, evidențiatorul sau radiera, cu mouse-ul, creionul sau degetul; text scris de la tastatură; pagini și mai multe tipuri de foaie
- Rândul Figuri (segment, triunghiuri, patrulatere, zmeu, cerc, elipsă), cu vârfuri cu litere pe care se poate construi
- Rândul Construcții: toate uneltele Tablei, separat pe fiecare pagină
- Instrumentele de desen și corpurile 3D
- **Zoom** între 50% și 300%: rotița mouse-ului, Ctrl cu + sau -, Ctrl+0 pentru revenire, sau butoanele
- Export în PDF, Word sau PNG

**Trigonometrie**
- Cercul trigonometric interactiv: sin, cos, tg, ctg cu valori exacte la unghiurile remarcabile
- Grafice `A·f(Bx + C) + D` pentru sin, cos, tg, ctg, funcțiile **trigonometrice inverse** (arcsin, arccos, arctg, arcctg) și **hiperbolice** (sh, ch, th, cth), cu perioadă / domeniu și imagine și asimptotele lor
- Rezolvarea oricărui triunghi (LLL, LUL, ULU, LUU, LLU cu cazul ambiguu): arie, perimetru, R, r, înălțimi, **bisectoare și mediane**; se poate deschide pe tablă
- Convertor grade ↔ radiani, tabel de valori, formule (reducere, sume, unghi dublu, transformări, ecuații, triunghi)

**Calculator de derivate și integrale**
- **Editor vizual de formule** ([MathLive](https://mathlive.io)): tastând `/` apare linie de fracție adevărată, `^` urcă în exponent, iar pe ecrane tactile apare o tastatură matematică; modul text e la un click distanță
- **Derivate pas cu pas:** fiecare regulă aplicată (sumă, produs, cât, funcție compusă, puteri, exponențiale, logaritmi, funcții trigonometrice și inverse), cu formula generală, rezultatul „brut” și cel simplificat; derivate de ordin superior; merge offline
- **Integrale pas cu pas**, cu [SymPy](https://www.sympy.org) rulat în browser prin [Pyodide](https://pyodide.org): substituție, integrare prin părți (inclusiv cazul ciclic), fracții simple, substituții trigonometrice, integrale tabelare — explicate în română, cu `ln|u|` ca la școală
- Integrale definite și improprii, cu detectarea divergenței (ex. `∫₋₁² dx/x²` e divergentă din cauza lui x = 0) și verificare numerică independentă (metoda Simpson)
- Recunoaște primitivele neelementare (ex. `e^(x²)` → erfi) și, unde se poate, demonstrează asta cu algoritmul Risch
- **Verifică răspunsul elevului:** scrii derivata sau primitiva găsită de elev și e comparată cu cea corectă (la integrale: derivata ei trebuie să dea f, deci constanta nu contează)
- Rezultatul și pașii se adaugă cu un click în notițele unei ședințe

Motorul SymPy (~15–20 MB) se descarcă la prima deschidere a tab-ului de integrale, apoi rămâne în cache.

**Simboluri**
- Alfabetul grecesc complet (mici și mari), integrale de toate felurile (simple, duble, triple, curbilinii, de suprafață, închise, definite, improprii, prin părți), analiză, trigonometrie, operații, relații, mulțimi și logică, geometrie și vectori, săgeți, matrici și sisteme
- Căutare după nume; click inserează simbolul în câmpul de notițe activ

## Rulare din cod sursă

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

> Pe Windows, ține proiectul în afara folderelor protejate de „Acces controlat la foldere” (Documents, Desktop…), de exemplu în `C:\dev`. Altfel Defender blochează compilarea Rust.

## Publicare automată (GitHub Actions)

- **Web:** `.github/workflows/pages.yml` publică site-ul pe GitHub Pages la fiecare push pe `main`. Trebuie activat o singură dată, din *Settings → Pages → Source: GitHub Actions*.
- **Desktop:** `.github/workflows/release.yml` construiește installerele pentru Windows și Linux la fiecare tag `v*`:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Installerele apar într-un release *draft* pe GitHub. Îl verifici și apoi îl publici.

## Structură

```
src/
  App.tsx              navigare: Jurnal, Tablă, Caiet, Trigonometrie, Calculator, Simboluri
  db.ts                baza de date locală (Dexie / IndexedDB), backup
  journal/             elevi, listă de ședințe, editorul de ședință
  geometry/            modelul scenei, motorul de construcții, tabla interactivă
  notebook/            pagina Caietului, instrumentele de desen, figurile, corpurile 3D
  export/              export PDF, Word și imagine
  trig/                cercul trigonometric, grafice, rezolvarea triunghiului, formule
  calculus/            motorul de derivate, worker-ul SymPy (integrale), explicarea pașilor, pagina calculatorului
  symbols/             lista de simboluri, paleta, inserarea în text
  components/          randare Markdown + LaTeX, dialoguri
  platform.ts          diferențele web / desktop (salvarea fișierelor)
src-tauri/             aplicația desktop (Tauri): configurare, iconițe, permisiuni
```
