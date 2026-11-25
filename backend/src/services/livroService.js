import { livroModel } from '../models/livroModel.js';
import { avaliacaoModel } from '../models/avaliacaoModel.js';
import { erro } from '../utils/erro.js';

export const livroService = {
  listar() {
    return livroModel.listar();
  },

  buscarPorId(id) {
    const livro = livroModel.buscarPorId(id);
    if (!livro) throw erro(404, 'Livro não encontrado');
    return livro;
  },

  criar({ titulo, autor, isbn } = {}) {
    if (!titulo || !autor || !isbn) {
      throw erro(400, 'Campos "titulo", "autor" e "isbn" são obrigatórios');
    }

    if (livroModel.existeIsbn(isbn)) {
      throw erro(409, 'Já existe um livro com este ISBN');
    }

    return livroModel.inserir({ titulo, autor, isbn });
  },

  atualizar(id, dados = {}) {
    if (dados.isbn) {
      const existente = livroModel.buscarPorIsbn(dados.isbn);
      if (existente && existente.id !== Number(id)) {
        throw erro(409, 'Já existe um livro com este ISBN');
      }
    }
    const atualizado = livroModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Livro não encontrado');
    return atualizado;
  },

  remover(id) {
    if (avaliacaoModel.listarPorLivro(Number(id)).length > 0) {
      throw erro(409, 'Livro possui avaliações. Remova as avaliações primeiro.');
    }
    const removido = livroModel.remover(id);
    if (!removido) throw erro(404, 'Livro não encontrado');
  },
};
