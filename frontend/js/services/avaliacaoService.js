import { api } from '../api.js';

function preparar({ titulo, nota, texto, livroId, usuarioId }) {
  const dados = {
    titulo: (titulo ?? '').trim(),
    nota: Number(nota),
    texto: (texto ?? '').trim() || null,
    livroId: Number(livroId),
    usuarioId: Number(usuarioId),
  };
  if (!dados.titulo) throw new Error('Informe o título da avaliação.');
  if (!Number.isInteger(dados.nota) || dados.nota < 1 || dados.nota > 5) {
    throw new Error('A nota deve estar entre 1 e 5.');
  }
  if (!dados.livroId) throw new Error('Selecione um livro.');
  if (!dados.usuarioId) throw new Error('Informe o ID do usuário.');
  return dados;
}

export const avaliacaoService = {
  listar: (livroId) => api.get(livroId ? `/avaliacoes?livroId=${livroId}` : '/avaliacoes'),
  async criar(dados) { return api.post('/avaliacoes', preparar(dados)); },
  async atualizar(id, dados) { return api.put(`/avaliacoes/${id}`, preparar(dados)); },
  remover: (id) => api.delete(`/avaliacoes/${id}`),
};
