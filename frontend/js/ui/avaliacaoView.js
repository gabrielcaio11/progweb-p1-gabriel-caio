const el = {
  form: document.querySelector('#form-avaliacao'),
  salvar: document.querySelector('#avaliacao-salvar'),
  cancelar: document.querySelector('#avaliacao-cancelar'),
  livroSelect: document.querySelector('#avaliacao-livro'),
  carregando: document.querySelector('#avaliacoes-carregando'),
  erro: document.querySelector('#avaliacoes-erro'),
  erroMsg: document.querySelector('#avaliacoes-erro-msg'),
  recarregar: document.querySelector('#avaliacoes-recarregar'),
  vazio: document.querySelector('#avaliacoes-vazio'),
  sucesso: document.querySelector('#avaliacoes-sucesso'),
  linhas: document.querySelector('#avaliacoes-linhas'),
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

function linha(avaliacao, livros, editandoId) {
  const tr = document.createElement('tr');
  if (avaliacao.id === editandoId) tr.className = 'editando';
  const livro = livros.find((item) => item.id === avaliacao.livroId);
  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', avaliacao.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', avaliacao.id, 'btn-outline-danger'),
  );
  tr.append(celula(avaliacao.id), celula(avaliacao.titulo), celula(avaliacao.nota, 'numero'), celula(livro?.titulo ?? `#${avaliacao.livroId}`), celula(avaliacao.usuarioId), acoes);
  return tr;
}

export function criarAvaliacaoView({ onSubmit, onEditar, onRemover, onRecarregar, onCancelar }) {
  el.form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSubmit(new FormData(el.form));
  });
  el.cancelar.addEventListener('click', onCancelar);
  el.recarregar.addEventListener('click', onRecarregar);

  return {
    render({ avaliacoes, livros, status, mensagemErro, editandoId, salvando }) {
      el.carregando.classList.toggle('d-none', status !== 'carregando');
      el.erro.classList.toggle('d-none', status !== 'erro');
      el.vazio.classList.toggle('d-none', status !== 'vazio');
      el.sucesso.classList.toggle('d-none', status !== 'sucesso');
      el.erroMsg.textContent = mensagemErro ?? '';
      el.linhas.replaceChildren();
      avaliacoes.forEach((avaliacao) => el.linhas.append(linha(avaliacao, livros, editandoId)));
      el.salvar.disabled = salvando;
      el.salvar.textContent = salvando
        ? 'Salvando…'
        : editandoId ? 'Salvar alterações' : 'Cadastrar avaliação';
      el.cancelar.classList.toggle('d-none', !editandoId);
    },
    preencherLivros(livros) {
      const valorAtual = el.livroSelect.value;
      el.livroSelect.replaceChildren();
      const opcaoInicial = document.createElement('option');
      opcaoInicial.value = '';
      opcaoInicial.textContent = 'Selecione um livro';
      el.livroSelect.append(opcaoInicial);
      livros.forEach((livro) => {
        const opcao = document.createElement('option');
        opcao.value = String(livro.id);
        opcao.textContent = livro.titulo;
        el.livroSelect.append(opcao);
      });
      if ([...el.livroSelect.options].some((opcao) => opcao.value === valorAtual)) {
        el.livroSelect.value = valorAtual;
      }
    },
    preencherForm(avaliacao) {
      el.form.elements.titulo.value = avaliacao.titulo;
      el.form.elements.nota.value = avaliacao.nota;
      el.form.elements.texto.value = avaliacao.texto ?? '';
      el.form.elements.livroId.value = String(avaliacao.livroId);
      el.form.elements.usuarioId.value = avaliacao.usuarioId;
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
