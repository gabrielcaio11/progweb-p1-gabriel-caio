const el = {
  form: document.querySelector('#form-livro'),
  salvar: document.querySelector('#livro-salvar'),
  cancelar: document.querySelector('#livro-cancelar'),
  carregando: document.querySelector('#livros-carregando'),
  erro: document.querySelector('#livros-erro'),
  erroMsg: document.querySelector('#livros-erro-msg'),
  recarregar: document.querySelector('#livros-recarregar'),
  vazio: document.querySelector('#livros-vazio'),
  sucesso: document.querySelector('#livros-sucesso'),
  linhas: document.querySelector('#livros-linhas'),
};

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto ?? '';
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = texto;
  button.className = `btn btn-sm ${classe}`;
  button.dataset.acao = acao;
  button.dataset.id = id;
  return button;
}

function linha(livro, editandoId) {
  const tr = document.createElement('tr');
  if (livro.id === editandoId) tr.className = 'editando';
  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', livro.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', livro.id, 'btn-outline-danger'),
  );
  tr.append(
    celula(livro.id),
    celula(livro.titulo),
    celula(livro.autor),
    celula(livro.isbn, 'text-nowrap'),
    acoes,
  );
  return tr;
}

export function criarLivroView({ onSubmit, onEditar, onRemover, onRecarregar, onCancelar }) {
  el.form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSubmit(new FormData(el.form));
  });
  el.cancelar.addEventListener('click', onCancelar);
  el.recarregar.addEventListener('click', onRecarregar);

  return {
    render({ livros, status, mensagemErro, editandoId, salvando }) {
      el.carregando.classList.toggle('d-none', status !== 'carregando');
      el.erro.classList.toggle('d-none', status !== 'erro');
      el.vazio.classList.toggle('d-none', status !== 'vazio');
      el.sucesso.classList.toggle('d-none', status !== 'sucesso');
      el.erroMsg.textContent = mensagemErro ?? '';
      el.linhas.replaceChildren();
      livros.forEach((livro) => el.linhas.append(linha(livro, editandoId)));
      el.salvar.disabled = salvando;
      el.salvar.textContent = salvando
        ? 'Salvando…'
        : editandoId ? 'Salvar alterações' : 'Cadastrar livro';
      el.cancelar.classList.toggle('d-none', !editandoId);
    },
    preencherForm(livro) {
      el.form.elements.titulo.value = livro.titulo;
      el.form.elements.autor.value = livro.autor;
      el.form.elements.isbn.value = livro.isbn;
      el.cancelar.classList.remove('d-none');
      el.salvar.textContent = 'Salvar alteração';
    },
    limparForm() { el.form.reset(); },
    aoClicarNaLista({ editar, remover }) {
      el.linhas.addEventListener('click', (event) => {
        const alvo = event.target.closest('button[data-acao]');
        if (!alvo) return;
        const id = Number(alvo.dataset.id);
        if (alvo.dataset.acao === 'editar') editar(id);
        if (alvo.dataset.acao === 'remover') remover(id);
      });
    },
  };
}
