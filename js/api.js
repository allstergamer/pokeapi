const API_BASE_URL = 'http://localhost:5500/html/notes';

// DOM-Elemente abrufen
const notesList = document.getElementById('notes-list');
const noteForm = document.getElementById('note-form');
const noteIdInput = document.getElementById('note-id');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-edit-button');
const loadingMessage = document.querySelector('.loading-message');

// Nachrichten anzeigen
function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.className = isError ? 'error-message' : 'loading-message';
    element.classList.remove('hidden');
}

function hideMessage(element) {
    element.classList.add('hidden');
}

// Alle Notizen laden
async function fetchNotes() {
    notesList.innerHTML = '';
    showMessage(loadingMessage, 'Notizen werden geladen...');

    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const notes = await response.json();
        hideMessage(loadingMessage);

        if (notes.length === 0) {
            notesList.innerHTML = '<p class="loading-message">Noch keine Notizen vorhanden. Füge eine neue hinzu!</p>';
            return;
        }

        notes.forEach(note => displayNote(note));

    } catch (error) {
        console.error('Fehler beim Abrufen der Notizen:', error);
        showMessage(loadingMessage, `Fehler beim Laden der Notizen: ${error.message}`, true);
    }
}

// Einzelne Notiz anzeigen
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

// Notiz bearbeiten
function editNote(note) {
    noteIdInput.value = note.id;
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;

    submitButton.textContent = 'Notiz aktualisieren';
    cancelButton.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Notiz löschen
async function deleteNote(id) {
    if (!confirm('Bist du sicher, dass du diese Notiz löschen möchtest?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const noteItemToRemove = document.querySelector(`.note-item[data-id="${id}"]`);
        if (noteItemToRemove) {
            noteItemToRemove.remove();
        }

        if (notesList.children.length === 0) {
            notesList.innerHTML = '<p class="loading-message">Noch keine Notizen vorhanden. Füge eine neue hinzu!</p>';
        }

        console.log(`Notiz mit ID ${id} erfolgreich gelöscht.`);

    } catch (error) {
        console.error('Fehler beim Löschen der Notiz:', error);
        alert(`Fehler beim Löschen der Notiz: ${error.message}`);
    }
}

// Formular absenden
noteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = noteIdInput.value;
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title || !content) {
        alert('Titel und Inhalt dürfen nicht leer sein.');
        return;
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP-Fehler! Status: ${response.status} - ${errorData.error || 'Unbekannter Fehler'}`);
        }

        resetForm();
        fetchNotes();

    } catch (error) {
        console.error('Fehler beim Speichern der Notiz:', error);
        alert(`Fehler beim Speichern der Notiz: ${error.message}`);
    }
});

// Formular zurücksetzen
function resetForm() {
    noteIdInput.value = '';
    noteTitleInput.value = '';
    noteContentInput.value = '';

    submitButton.textContent = 'Notiz hinzufügen';
    cancelButton.classList.add('hidden');
}

// Abbrechen-Button
cancelButton.addEventListener('click', () => {
    resetForm();
});

// Initial laden
fetchNotes();