import { api } from '../api.js';

function preparar({ titulo, autor, isbn }) {
  const dados = {
    titulo: (titulo ?? '').trim(),
    autor: (autor ?? '').trim(),
    isbn: (isbn ?? '').trim(),
  };
  if (!dados.titulo) throw new Error('Informe o título.');
  if (!dados.autor) throw new Error('Informe o autor.');
  if (!dados.isbn) throw new Error('Informe o ISBN.');
  return dados;
}

export const livroService = {
  listar: () => api.get('/livros'),
  async criar(dados) { return api.post('/livros', preparar(dados)); },
  async atualizar(id, dados) { return api.put(`/livros/${id}`, preparar(dados)); },
  remover: (id) => api.delete(`/livros/${id}`),
};
