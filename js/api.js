// Referenzen auf wichtige HTML-Elemente holen
const notesList = document.getElementById('notes-list'); // Liste, in der alle Notizen angezeigt werden
const noteForm = document.getElementById('note-form'); // Formular zum Erstellen/Bearbeiten
const noteIdInput = document.getElementById('note-id'); // Verstecktes Feld für die ID
const noteTitleInput = document.getElementById('note-title'); // Eingabefeld für Titel
const noteContentInput = document.getElementById('note-content'); // Eingabefeld für Inhalt
const submitButton = document.getElementById('submit-button'); // Button zum Speichern
const cancelButton = document.getElementById('cancel-edit-button'); // Button zum Abbrechen

// Notizen aus localStorage laden und anzeigen
function fetchNotes() {
    notesList.innerHTML = ''; // Liste leeren, bevor neu geladen wird

    // Notizen aus dem Browser-Speicher holen (oder leeres Array, wenn nichts vorhanden)
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Wenn keine Notizen existieren -> Hinweis anzeigen
    if (notes.length === 0) {
        notesList.innerHTML = '<p class="loading-message">Noch keine Notizen vorhanden.</p>';
        return;
    }

    // Notizen nach Datum sortieren (neueste zuerst)
    notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Jede Notiz einzeln anzeigen
    notes.forEach(note => displayNote(note));
}

// Einzelne Notiz im DOM darstellen
function displayNote(note) {
    const noteItem = document.createElement('div'); // Neues div für die Notiz
    noteItem.classList.add('note-item'); // CSS-Klasse hinzufügen
    noteItem.setAttribute('data-id', note.id); // ID als Attribut speichern

    // Datum in deutsches Format umwandeln
    const createdAt = new Date(note.created_at).toLocaleString('de-DE');
    const updatedAt = new Date(note.updated_at).toLocaleString('de-DE');

    // HTML-Struktur der Notiz
    noteItem.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="note-meta">
            Erstellt: ${createdAt} | Zuletzt aktualisiert: ${updatedAt}
        </div>
        <div class="note-actions">
            <button class="edit-button">Bearbeiten</button>
            <button class="delete-button">Löschen</button>
        </div>
    `;

    // Event: Bearbeiten-Button → lädt Daten ins Formular
    noteItem.querySelector('.edit-button')
        .addEventListener('click', () => editNote(note));

    // Event: Löschen-Button → löscht diese Notiz
    noteItem.querySelector('.delete-button')
        .addEventListener('click', () => deleteNote(note.id));

    // Notiz oben in die Liste einfügen (neueste zuerst sichtbar)
    notesList.prepend(noteItem);
}

// Notiz bearbeiten -> Formular wird mit bestehenden Daten gefüllt
function editNote(note) {
    noteIdInput.value = note.id; // ID setzen (um zu wissen, dass es ein Update ist)
    noteTitleInput.value = note.title; // Titel einsetzen 
    noteContentInput.value = note.content; // Inhalt einsetzen

    submitButton.textContent = 'Notiz aktualisieren'; // Button-Text ändern
    cancelButton.classList.remove('hidden'); // Abbrechen-Button anzeigen

    // Seite nach oben scrollen (zum Editieren der Notiz)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Notiz löschen
function deleteNote(id) {
    // Sicherheitsabfrage
    if (!confirm('Bist du sicher, dass du diese Notiz löschen möchtest?')) {
        return;
    }

    // Notizen laden
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Alle Notizen außer der gelöschten behalten
    notes = notes.filter(n => n.id != id);

    // Aktualisierte Liste speichern
    localStorage.setItem('notes', JSON.stringify(notes));

    // Anzeige neu laden
    fetchNotes();
}

// Formular absenden (neue Notiz oder Update)
noteForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindert Seiten-Neuladen

    const id = noteIdInput.value; // ID prüfen (existiert nur beim Bearbeiten)
    const title = noteTitleInput.value.trim(); // Titel (Leerzeichen entfernen)
    const content = noteContentInput.value.trim(); // Inhalt

    // error catch: nichts darf leer sein
    if (!title || !content) {
        alert('Titel und Inhalt dürfen nicht leer sein.');
        return;
    }

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (id) {
        // Bestehende Notiz aktualisieren
        notes = notes.map(n =>
            n.id == id
                ? { ...n, title, content, updated_at: new Date() } // Daten überschreiben
                : n
        );
    } else {
        // Neue Notiz erstellen
        notes.push({
            id: Date.now(), // einfache eindeutige ID (Timestamp)
            title,
            content,
            created_at: new Date(), //erstellungsdatum
            updated_at: new Date() // aktualisierungsdatum (gleich wie erstellungsdatum bei neuer Notiz)
        });
    }

    // Speichern im localStorage
    localStorage.setItem('notes', JSON.stringify(notes));

    // Formular zurücksetzen + Anzeige neu laden
    resetForm();
    fetchNotes();
});

// Formular zurücksetzen (nach Speichern oder Abbrechen)
function resetForm() {
    noteIdInput.value = ''; // ID löschen
    noteTitleInput.value = ''; // Titel leeren
    noteContentInput.value = ''; // Inhalt leeren

    submitButton.textContent = 'Notiz speichern'; // Button zurücksetzen
    cancelButton.classList.add('hidden'); // Abbrechen-Button verstecken
}

// Klick auf "Abbrechen"
cancelButton.addEventListener('click', () => {
    resetForm();
});

// Beim Laden der Seite → Notizen anzeigen
fetchNotes();

// Suchfunktion (nach Titel)
function searchNotes() {
    const searchTitle = document.getElementById("searchInput").value.toLowerCase().trim();

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Nur Notizen filtern, deren Titel den Suchtext enthält
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTitle)
    );

    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    // Wenn nichts gefunden -> Hinweis anzeigen
    if (filteredNotes.length === 0) {
        notesList.innerHTML = '<p class="loading-message">Keine passenden Notizen gefunden.</p>';
        return;
    }

    // Nach Datum sortieren (neueste zuerst)
    filteredNotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Gefilterte Notizen anzeigen
    filteredNotes.forEach(note => displayNote(note));

}

// Exportieren als JSON-Datei
document.getElementById('export-button').addEventListener('click', () => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (notes.length === 0) {
        alert('Keine Notizen zum Exportieren vorhanden.');
        return;
    }

    // JSON in downloadbaren String umwandeln
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));

    // Temporären Download-Link erstellen
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pokemon_notizen.json");

    // Download startet
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

// Import starten (öffnet Dateiauswahl)
document.getElementById('import-button').addEventListener('click', () => {
    document.getElementById('import-file').click();
});

// Datei wird ausgewählt -> einlesen
document.getElementById('import-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedNotes = JSON.parse(e.target.result);

            // Sicherstellen das es ein Array ist
            if (!Array.isArray(importedNotes)) throw new Error('Ungültiges Format.');

            let notes = JSON.parse(localStorage.getItem('notes')) || [];

            // Keine doppelten IDs hinzufügen
            importedNotes.forEach(importedNote => {
                if (!notes.some(n => n.id === importedNote.id)) {
                    notes.push(importedNote);
                }
            });

            // Speichern und neu anzeigen
            localStorage.setItem('notes', JSON.stringify(notes));
            fetchNotes();
            alert('Notizen erfolgreich importiert!');
        } catch (err) {
            alert('Fehler beim Importieren der Datei.');
            console.error(err);
        }
    };

    reader.readAsText(file);

    // Input zurücksetzen (damit gleiche Datei erneut gewählt werden kann)
    event.target.value = '';
});

// Alle Notizen löschen
document.getElementById('clear-button').addEventListener('click', () => {
    // abfrage ob wirklich allles gelöscht werden soll
    if (!confirm('Bist du sicher, dass du alle Notizen löschen möchtest?')) {
    return;
    }
    localStorage.clear(); // kompletter Speicher wird gelöscht
    notesList.innerHTML = '<p class="loading-message">Noch keine Notizen vorhanden.</p>';
});

// Enter-Taste im Suchfeld startet Suche
const notessearch = document.getElementById("searchInput");

notessearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchNotes();
    }
});