import { db } from '../db.js';

const COLUNAS = `id, titulo, autor, isbn,
  data_criacao AS dataCriacao,
  data_atualizacao AS dataAtualizacao`;

export const livroModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM livros ORDER BY id`).all();
  },

  buscarPorId(id) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM livros WHERE id = ?`)
      .get(id) ?? null;
  },

  buscarPorIsbn(isbn) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM livros WHERE isbn = ?`)
      .get(isbn) ?? null;
  },

  existeIsbn(isbn) {
    return db.prepare('SELECT 1 FROM livros WHERE isbn = ?').get(isbn) !== undefined;
  },

  inserir({ titulo, autor, isbn }) {
    const agora = new Date().toISOString();
    const r = db
      .prepare(`INSERT INTO livros
        (titulo, autor, isbn, data_criacao, data_atualizacao)
        VALUES (?, ?, ?, ?, ?)`)
      .run(titulo, autor, isbn, agora, agora);
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db
      .prepare(`UPDATE livros
        SET titulo = ?, autor = ?, isbn = ?, data_atualizacao = ?
        WHERE id = ?`)
      .run(novo.titulo, novo.autor, novo.isbn, new Date().toISOString(), id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM livros WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
