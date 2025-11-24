import React, { useEffect, useState } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import { getAllNotes, addNote, updateNote, deleteNote } from './db/indexedDB';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');

  async function loadNotes() {
    const all = await getAllNotes();
    // ordenar por fecha nueva primero
    all.sort((a,b) => new Date(b.date) - new Date(a.date));
    setNotes(all);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleCreate(data) {
    const note = {
      title: data.title,
      content: data.content,
      date: new Date().toISOString()
    };
    await addNote(note);
    await loadNotes();
  }

  async function handleUpdate(data) {
    // data incluye id
    await updateNote({ ...data, date: new Date().toISOString() });
    setEditing(null);
    await loadNotes();
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar nota?')) return;
    await deleteNote(id);
    await loadNotes();
  }

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app">
      <header>
        <h1>Notas offline (PWA)</h1>
        <div className="search-create">
          <input
            placeholder="Buscar notas..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Buscar notas"
          />
        </div>
      </header>

      <main>
        <section className="left">
          <NoteForm
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            editing={editing}
            onCancel={() => setEditing(null)}
          />
        </section>

        <section className="right">
          <NoteList
            notes={filtered}
            onEdit={(note) => setEditing(note)}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer>
        <small>Funciona offline — guardado en IndexedDB.</small>
      </footer>
    </div>
  );
}