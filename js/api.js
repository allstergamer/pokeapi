const notesList = document.getElementById('notes-list');
const noteForm = document.getElementById('note-form');
const noteIdInput = document.getElementById('note-id');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-edit-button');

// 🔹 Notizen laden
function fetchNotes() {
    notesList.innerHTML = '';

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (notes.length === 0) {
        notesList.innerHTML = '<p class="loading-message">Noch keine Notizen vorhanden.</p>';
        return;
    }

    // Neueste oben
    notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    notes.forEach(note => displayNote(note));
}

// 🔹 Notiz anzeigen
function displayNote(note) {
    const noteItem = document.createElement('div');
    noteItem.classList.add('note-item');
    noteItem.setAttribute('data-id', note.id);

    const createdAt = new Date(note.created_at).toLocaleString('de-DE');
    const updatedAt = new Date(note.updated_at).toLocaleString('de-DE');

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

    noteItem.querySelector('.edit-button')
        .addEventListener('click', () => editNote(note));

    noteItem.querySelector('.delete-button')
        .addEventListener('click', () => deleteNote(note.id));

    notesList.prepend(noteItem);
}

// 🔹 Notiz bearbeiten
function editNote(note) {
    noteIdInput.value = note.id;
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;

    submitButton.textContent = 'Notiz aktualisieren';
    cancelButton.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 🔹 Notiz löschen
function deleteNote(id) {
    if (!confirm('Bist du sicher, dass du diese Notiz löschen möchtest?')) {
        return;
    }

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(n => n.id != id);

    localStorage.setItem('notes', JSON.stringify(notes));

    fetchNotes();
}

// 🔹 Formular absenden (Neu + Update)
noteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = noteIdInput.value;
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title || !content) {
        alert('Titel und Inhalt dürfen nicht leer sein.');
        return;
    }

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (id) {
        // Update
        notes = notes.map(n =>
            n.id == id
                ? { ...n, title, content, updated_at: new Date() }
                : n
        );
    } else {
        // Neu
        notes.push({
            id: Date.now(),
            title,
            content,
            created_at: new Date(),
            updated_at: new Date()
        });
    }

    localStorage.setItem('notes', JSON.stringify(notes));

    resetForm();
    fetchNotes();
});

// 🔹 Formular zurücksetzen
function resetForm() {
    noteIdInput.value = '';
    noteTitleInput.value = '';
    noteContentInput.value = '';

    submitButton.textContent = 'Notiz speichern';
    cancelButton.classList.add('hidden');
}

// 🔹 Abbrechen Button
cancelButton.addEventListener('click', () => {
    resetForm();
});

// 🔹 Initial laden
fetchNotes();

/*
function notizenExportieren() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pokemon_notizen.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
document.getElementById('export-button').addEventListener('click', notizenExportieren);
*/