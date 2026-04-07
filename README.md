# 📘 Entwicklerdokumentation – PokéAPI Webanwendung & Notes API

## 📑 Inhaltsverzeichnis

- [Projektübersicht](#-projektübersicht)
- [Ziel der Dokumentation](#ziel-der-dokumentation)
- [Teil 1: PokéAPI Webanwendung](#-teil-1-pokéapi-webanwendung)
  - [Datenquelle](#-datenquelle)
  - [Funktionsweise](#-funktionsweise)
    - [Ablauf](#-ablauf)
  - [Datenstrukturen](#-datenstrukturen)
  - [Hauptfunktionen](#-hauptfunktionen)
    - [`loadPokemons()`](#loadpokemons)
    - [`hideLoader()`](#hideloader)
  - [Suche](#-suche)
  - [Rendering](#-rendering)
- [Teil 2: Notes API (JavaScript)](#-teil-2-notes-api-javascript)
  - [Übersicht](#-übersicht)
  - [Architektur](#-architektur)
  - [Funktionen](#-funktionen)
    - [`createNote(title, content)`](#createnotetitle-content)
    - [`getNotes()`](#getnotes)
    - [`updateNote(id, newData)`](#updatenoteid-newdata)
    - [`deleteNote(id)`](#deletenoteid)
  - [Speicherung](#-speicherung)
  - [Datenfluss](#-datenfluss)
  - [Zusammenspiel beider Teile](#-zusammenspiel-beider-teile)
- [Projektstruktur](#-projektstruktur)
- [Zusammenfassung](#-zusammenfassung)


## 📌 Übersicht

Dieses Projekt besteht aus zwei Hauptkomponenten:

1. **PokéAPI Webanwendung (Frontend)**
2. **Notes API (JavaScript Backend / Logik)**

Die Anwendung ermöglicht:
- Laden und Anzeigen von Pokémon-Daten
- Mehrsprachige Namenssuche (Deutsch/Englisch)
- Verwaltung von Notizen über eine eigene API

---

# 🧩 Teil 1: PokéAPI Webanwendung

## 🌐 Datenquelle

Verwendete API:
```
https://pokeapi.co/api/v2/
```

working Website:
```
https://Zerberstian.github.io/html
```

---

## 🧠 Funktionsweise

Die Anwendung lädt Daten clientseitig und verarbeitet diese im Browser.

### 🔄 Ablauf

1. Pokémon-Liste laden (`/pokemon`)
2. Detaildaten laden (`/pokemon/{id}`)
3. Speziesdaten laden (`/pokemon-species/{id}`)
4. Daten zusammenführen
5. Speicherung in lokalen Strukturen
6. Rendering im UI

---

## 📦 Datenstrukturen

### `allPokemon`

Speichert alle Pokémon-Objekte mit kombinierten Daten.

### `germanToEnglish`

Mapping:
```
"Bisasam" → "bulbasaur"
```

### `englishToGerman`

Mapping:
```
"bulbasaur" → "Bisasam"
```

---

## ⚙️ Hauptfunktionen

### `loadPokemons()`

- lädt Pokémon-Liste
- lädt Detaildaten
- lädt Speziesdaten
- extrahiert deutsche Namen
- erstellt Mapping
- speichert Daten

---

### `hideLoader()`

- blendet Ladebildschirm aus
- nutzt CSS-Animation

---

## 🔍 Suche

Die Suche erfolgt über:
- englische Namen
- deutsche Namen

Vergleich basiert auf `allPokemon`.

---

## 🖥️ Rendering

- dynamisches Erstellen von HTML
- Darstellung von:
  - Namen
  - Bildern
  - Typen

---

# 🧩 Teil 2: Notes API (JavaScript)

## 📌 Übersicht

Die Notes API ist eine einfache JavaScript-basierte API zur Verwaltung von Notizen.

Sie ermöglicht:

- Erstellen von Notizen
- Anzeigen von Notizen
- Bearbeiten von Notizen
- Löschen von Notizen
- Exportieren sowie importieren der Notizen

---

## 🧠 Architektur

Die Notes API läuft clientseitig oder lokal und verwaltet Daten in JavaScript.

Typische Struktur:

```
notes = [
  {
    id: number,
    title: string,
    content: string
  }
]
```

---

## ⚙️ Funktionen

### `createNote(title, content)`

Erstellt eine neue Notiz.

---

### `getNotes()`

Gibt alle Notizen zurück.

---

### `updateNote(id, newData)`

Aktualisiert eine bestehende Notiz.

---

### `deleteNote(id)`

Löscht eine Notiz anhand der ID.

---

## 💾 Speicherung

Je nach Implementierung:

- im Speicher (Array)
- oder optional:
  - `localStorage`

---

## 🔄 Datenfluss

```
UI → Notes API → Daten ändern → UI aktualisieren
```

---

## 🧩 Zusammenspiel beider Teile

| Komponente | Aufgabe |
|----------|--------|
| PokéAPI | externe Datenquelle |
| Frontend | Anzeige & Logik |
| Notes API | Notizverwaltung |

---

## 📂 Projektstruktur

```
│   README.md
│
├───assets
│       fav.ico
│
├───css
│       api.css
│       styles.css
│
├───html
│       api.html
│       index.html
│
└───js
        api.js
        scripts.js
```

---

## 📌 Zusammenfassung

Das Projekt kombiniert:

- externe API-Daten (PokéAPI)
- clientseitige Datenverarbeitung
- eigene API (Notes API)

Beide Systeme arbeiten unabhängig, werden jedoch im Frontend zusammengeführt.
