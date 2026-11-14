import { avaliacaoModel } from '../models/avaliacaoModel.js';
import { livroModel } from '../models/livroModel.js';
import { erro } from '../utils/erro.js';

export const avaliacaoService = {
  listar(livroId) {
    if (livroId) return avaliacaoModel.listarPorLivro(Number(livroId));
    return avaliacaoModel.listar();
  },

  buscarPorId(id) {
    const avaliacao = avaliacaoModel.buscarPorId(id);
    if (!avaliacao) throw erro(404, 'Avaliação não encontrada');
    return avaliacao;
  },

  criar({ titulo, nota, texto, livroId, usuarioId } = {}) {
    if (!titulo || nota === undefined || !livroId || !usuarioId) {
      throw erro(400, 'Campos "titulo", "nota", "livroId" e "usuarioId" são obrigatórios');
    }

    if (Number(nota) < 1 || Number(nota) > 5) {
      throw erro(400, 'A nota deve estar entre 1 e 5');
    }

    if (!livroModel.buscarPorId(Number(livroId))) {
      throw erro(422, 'Livro informado não existe');
    }

    if (avaliacaoModel.buscarPorUsuarioELivro(Number(usuarioId), Number(livroId))) {
      throw erro(409, 'Este usuário já avaliou este livro');
    }

    return avaliacaoModel.inserir({ titulo, nota, texto, livroId, usuarioId });
  },

  atualizar(id, dados = {}) {
    const atualizada = avaliacaoModel.atualizar(id, dados);
    if (!atualizada) throw erro(404, 'Avaliação não encontrada');
    return atualizada;
  },

  remover(id) {
    const removida = avaliacaoModel.remover(id);
    if (!removida) throw erro(404, 'Avaliação não encontrada');
  },
};
