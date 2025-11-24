import { openDB } from 'idb';

const DB_NAME = 'mi-notas-db';
const STORE_NAME = 'notas';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-date', 'date');
        store.createIndex('by-title', 'title');
      }
    }
  });
}

export async function getAllNotes() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function addNote(note) {
  const db = await initDB();
  const id = await db.add(STORE_NAME, note);
  return { ...note, id };
}

export async function updateNote(note) {
  const db = await initDB();
  await db.put(STORE_NAME, note);
  return note;
}

export async function deleteNote(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}

export async function getNoteById(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}