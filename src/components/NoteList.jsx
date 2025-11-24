import React from 'react';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function NoteList({ notes, onEdit, onDelete }) {
  if (!notes.length) {
    return <div className="card"><p>No hay notas aún.</p></div>;
  }

  return (
    <div className="note-list">
      {notes.map(n => (
        <article className="card note-item" key={n.id}>
          <div className="note-head">
            <h3>{n.title}</h3>
            <small>{formatDate(n.date)}</small>
          </div>
          <p className="note-content">{n.content}</p>
          <div className="note-actions">
            <button onClick={() => onEdit(n)}>Editar</button>
            <button className="danger" onClick={() => onDelete(n.id)}>Borrar</button>
          </div>
        </article>
      ))}
    </div>
  );
}