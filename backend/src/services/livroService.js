import { livroModel } from '../models/livroModel.js';
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
    const atualizado = livroModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Livro não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = livroModel.remover(id);
    if (!removido) throw erro(404, 'Livro não encontrado');
  },
};
