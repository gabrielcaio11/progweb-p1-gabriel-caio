let livros = [];
let proximoId = 1;

export const livroModel = {
  listar() {
    return livros;
  },

  buscarPorId(id) {
    return livros.find((livro) => livro.id === id) ?? null;
  },

  existeIsbn(isbn) {
    return livros.some((livro) => livro.isbn === isbn);
  },

  inserir({ titulo, autor, isbn }) {
    const novo = {
      id: proximoId++,
      titulo,
      autor,
      isbn,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };
    livros.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = livros.findIndex((livro) => livro.id === id);
    if (i === -1) return null;
    livros[i] = {
      ...livros[i],
      ...dados,
      id,
      dataAtualizacao: new Date().toISOString(),
    };
    return livros[i];
  },

  remover(id) {
    const antes = livros.length;
    livros = livros.filter((livro) => livro.id !== id);
    return livros.length < antes;
  },
};
