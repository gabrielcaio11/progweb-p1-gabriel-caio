import { db } from '../db.js';

const COLUNAS = `id, titulo, nota, texto,
  livro_id AS livroId, usuario_id AS usuarioId,
  data_criacao AS dataCriacao,
  data_atualizacao AS dataAtualizacao`;

export const avaliacaoModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM avaliacoes ORDER BY id`).all();
  },

  listarPorLivro(livroId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM avaliacoes WHERE livro_id = ? ORDER BY id`)
      .all(livroId);
  },

  buscarPorId(id) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM avaliacoes WHERE id = ?`)
      .get(id) ?? null;
  },

  buscarPorUsuarioELivro(usuarioId, livroId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM avaliacoes
        WHERE usuario_id = ? AND livro_id = ?`)
      .get(usuarioId, livroId) ?? null;
  },

  inserir({ titulo, nota, texto, livroId, usuarioId }) {
    const agora = new Date().toISOString();
    const r = db
      .prepare(`INSERT INTO avaliacoes
        (titulo, nota, texto, livro_id, usuario_id, data_criacao, data_atualizacao)
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(
        titulo,
        Number(nota),
        texto ?? null,
        Number(livroId),
        Number(usuarioId),
        agora,
        agora,
      );
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db
      .prepare(`UPDATE avaliacoes
        SET titulo = ?, nota = ?, texto = ?, livro_id = ?, usuario_id = ?,
            data_atualizacao = ?
        WHERE id = ?`)
      .run(
        novo.titulo,
        Number(novo.nota),
        novo.texto ?? null,
        Number(novo.livroId),
        Number(novo.usuarioId),
        new Date().toISOString(),
        id,
      );
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM avaliacoes WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
