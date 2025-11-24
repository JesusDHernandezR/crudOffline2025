import React, { useEffect, useState } from 'react';

export default function NoteForm({ onCreate, onUpdate, editing, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '');
      setContent(editing.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [editing]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      alert('Título requerido');
      return;
    }
    if (editing) {
      onUpdate({ id: editing.id, title: title.trim(), content: content.trim() });
    } else {
      onCreate({ title: title.trim(), content: content.trim() });
    }
    setTitle('');
    setContent('');
  }

  return (
    <div className="note-form card">
      <h2>{editing ? 'Editar nota' : 'Crear nota'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Título
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Contenido
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} />
        </label>
        <div className="actions">
          <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
          {editing ? <button type="button" className="secondary" onClick={onCancel}>Cancelar</button> : null}
        </div>
      </form>
    </div>
  );
}