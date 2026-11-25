import { DatabaseSync } from 'node:sqlite';

const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS livros (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo           TEXT NOT NULL,
    autor            TEXT NOT NULL,
    isbn             TEXT NOT NULL UNIQUE,
    data_criacao     TEXT NOT NULL,
    data_atualizacao TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS avaliacoes (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo           TEXT NOT NULL,
    nota             INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    texto            TEXT,
    livro_id         INTEGER NOT NULL REFERENCES livros(id),
    usuario_id       INTEGER NOT NULL,
    data_criacao     TEXT NOT NULL,
    data_atualizacao TEXT NOT NULL,
    UNIQUE (usuario_id, livro_id)
  );
`);
