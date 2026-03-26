# ML Academy — Was wurde gemacht und wie geht's online?

## Was haben wir eigentlich gebaut?

Die ML Academy ist eine **interaktive Lern-App**, die im Browser läuft. Sie erklärt dir Machine Learning Schritt für Schritt — mit Texten, Animationen, Quizzes und einem KI-Tutor. Alles in einer einzigen Datei, geschrieben in einer Sprache namens **React**.


## Die wichtigsten Begriffe — einfach erklärt

### React
React ist ein Werkzeug von Meta (Facebook), mit dem man Benutzeroberflächen baut. Statt normales HTML zu schreiben, beschreibt man in React, *wie* die Seite aussehen soll, und React kümmert sich darum, sie im Browser darzustellen. Man schreibt die Dateien in **.jsx** — das ist eine Mischung aus JavaScript und HTML.

**Analogie:** Stell dir vor, du beschreibst jemandem dein Traumhaus ("Ich hätte gerne ein Fenster hier, eine Tür dort"), und React baut es für dich. Wenn du sagst "Ich möchte das Fenster doch lieber links", baut React nur das Fenster um — nicht das ganze Haus.

### Vite
Vite (französisch für "schnell") ist ein **Build-Tool**. Es nimmt deinen React-Code und verwandelt ihn in normales HTML, CSS und JavaScript, das jeder Browser versteht.

**Analogie:** Dein React-Code ist wie ein Rezept in Profi-Kochsprache. Vite übersetzt es in eine Anleitung, die jeder nachkochen kann.

### npm (Node Package Manager)
npm ist ein **Paket-Manager**. Damit lädst du Werkzeuge und Bibliotheken herunter, die dein Projekt braucht (z.B. React, Vite). Der Befehl `npm install` liest die Datei `package.json` und installiert alles Nötige.

**Analogie:** npm ist wie ein App Store für Entwickler-Werkzeuge. In `package.json` steht deine Einkaufsliste, und `npm install` kauft alles ein.

### Build / Bauen
Wenn du `npm run build` ausführst, erstellt Vite einen Ordner namens **dist/** mit den fertigen Dateien. Diese Dateien sind optimiert (kleiner, schneller) und bereit für's Internet.

**Analogie:** Du hast ein Manuskript geschrieben (dein Code). Der Build-Prozess ist der Verlag, der daraus ein druckfertiges Buch macht.

### Deployen (Bereitstellen)
Deployen bedeutet: Deine fertige App auf einen Server im Internet hochladen, damit andere Menschen sie über eine URL (z.B. `ml-academy.vercel.app`) aufrufen können.

**Analogie:** Dein Buch ist gedruckt — jetzt stellst du es in den Buchladen, damit Leute es kaufen (bzw. anschauen) können.

### GitHub
GitHub ist eine Plattform, auf der Entwickler ihren Code speichern und gemeinsam daran arbeiten. Es nutzt **Git**, ein System zur Versionskontrolle — das bedeutet, jede Änderung wird gespeichert, und du kannst jederzeit zu einer früheren Version zurückkehren.

**Analogie:** GitHub ist wie Google Docs für Code. Jeder im Team sieht die Änderungen, und nichts geht verloren.

### Vercel / Netlify
Das sind **Hosting-Dienste**, die deinen Code automatisch bauen und ins Internet stellen. Du verbindest dein GitHub-Projekt, und jedes Mal wenn du etwas änderst, wird die Website automatisch aktualisiert.

**Analogie:** Du gibst dein Manuskript einem Verlag (Vercel/Netlify), und jedes Mal wenn du eine neue Seite schreibst, druckt der Verlag sofort eine neue Ausgabe.


## Die Projekt-Struktur

```
ml-academy-app/
├── index.html          ← Die Startseite (lädt die App)
├── package.json        ← Die "Einkaufsliste" für npm
├── vite.config.js      ← Einstellungen für Vite
├── .gitignore          ← Sagt Git, welche Dateien es ignorieren soll
├── ANLEITUNG.md        ← Diese Datei hier :)
└── src/
    ├── main.jsx        ← Startpunkt: Lädt die App-Komponente
    └── App.jsx         ← Die gesamte ML Academy (1005 Zeilen React)
```


## Schritt-für-Schritt: App deployen mit Vercel

### Voraussetzung: Node.js installieren
1. Gehe auf **nodejs.org**
2. Lade die **LTS-Version** herunter (grüner Button)
3. Installiere es (einfach "Weiter" klicken)
4. Teste im Terminal: `node --version` — es sollte eine Versionsnummer kommen

### Schritt 1: GitHub-Account erstellen
1. Gehe auf **github.com** und erstelle einen kostenlosen Account
2. Installiere **GitHub Desktop** (desktop.github.com) — das macht alles einfacher

### Schritt 2: Repository erstellen
1. Öffne GitHub Desktop
2. "File" → "Add Local Repository" → Wähle den Ordner `ml-academy-app`
3. Falls es kein Git-Repo ist: "Create a Repository" → Name: `ml-academy`
4. Klicke "Publish Repository" → Das lädt den Code auf GitHub hoch

### Schritt 3: Vercel verbinden
1. Gehe auf **vercel.com** und klicke "Sign Up" → "Continue with GitHub"
2. Klicke "Add New Project"
3. Wähle dein `ml-academy` Repository aus
4. Framework Preset: **Vite** (wird oft automatisch erkannt)
5. Klicke "Deploy"
6. Nach ca. 30 Sekunden bekommst du eine URL wie `ml-academy-xyz.vercel.app`

### Fertig!
Jede Änderung, die du auf GitHub hochlädst, wird automatisch auf Vercel aktualisiert.


## Lokal testen (auf deinem Computer)

Falls du die App erst mal nur auf deinem eigenen Computer anschauen willst:

```bash
cd ml-academy-app
npm install
npm run dev
```

Dann öffne im Browser: **http://localhost:5173**


## Was ich gemacht habe — Zusammenfassung

1. **Vite-Projekt erstellt** — Die Ordnerstruktur mit `package.json`, `vite.config.js`, `index.html` und `src/`-Ordner angelegt
2. **React-App eingebettet** — Die ML-Lernapp als `App.jsx` in die Vite-Struktur kopiert
3. **Einstiegspunkt gebaut** — `main.jsx` erstellt, das die App startet
4. **Build getestet** — `npm run build` lief erfolgreich durch (229 KB komprimiert)
5. **Sidebar fixiert** — Die Seitenleiste bleibt jetzt am Bildschirmrand stehen (`position: sticky`), während nur der Inhaltsbereich scrollt
