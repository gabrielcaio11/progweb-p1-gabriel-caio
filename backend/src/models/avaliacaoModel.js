let avaliacoes = [];
let proximoId = 1;

export const avaliacaoModel = {
  listar() {
    return avaliacoes;
  },

  listarPorLivro(livroId) {
    return avaliacoes.filter((avaliacao) => avaliacao.livroId === livroId);
  },

  buscarPorId(id) {
    return avaliacoes.find((avaliacao) => avaliacao.id === id) ?? null;
  },

  buscarPorUsuarioELivro(usuarioId, livroId) {
    return (
      avaliacoes.find(
        (avaliacao) => avaliacao.usuarioId === usuarioId && avaliacao.livroId === livroId,
      ) ?? null
    );
  },

  inserir({ titulo, nota, texto, livroId, usuarioId }) {
    const nova = {
      id: proximoId++,
      titulo,
      nota: Number(nota),
      texto: texto ?? null,
      livroId: Number(livroId),
      usuarioId: Number(usuarioId),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };
    avaliacoes.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = avaliacoes.findIndex((avaliacao) => avaliacao.id === id);
    if (i === -1) return null;
    avaliacoes[i] = {
      ...avaliacoes[i],
      ...dados,
      id,
      dataAtualizacao: new Date().toISOString(),
    };
    return avaliacoes[i];
  },

  remover(id) {
    const antes = avaliacoes.length;
    avaliacoes = avaliacoes.filter((avaliacao) => avaliacao.id !== id);
    return avaliacoes.length < antes;
  },
};
