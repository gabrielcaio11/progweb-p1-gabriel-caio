import { criarStore } from './state/store.js';
import { livroService } from './services/livroService.js';
import { avaliacaoService } from './services/avaliacaoService.js';
import { criarLivroView } from './ui/livroView.js';
import { criarAvaliacaoView } from './ui/avaliacaoView.js';
import { aviso } from './ui/aviso.js';

const livrosStore = criarStore({
  livros: [],
  status: 'carregando',
  mensagemErro: '',
  editandoId: null,
  salvando: false,
});
const avaliacoesStore = criarStore({
  avaliacoes: [],
  livros: [],
  status: 'carregando',
  mensagemErro: '',
  editandoId: null,
  salvando: false,
});

let livroEditandoId = null;
let avaliacaoEditandoId = null;

async function carregarLivros() {
  livrosStore.set({ status: 'carregando', mensagemErro: '' });
  try {
    const livros = await livroService.listar();
    livrosStore.set({ livros, status: livros.length ? 'sucesso' : 'vazio', mensagemErro: '' });
    avaliacoesStore.set({ livros });
  } catch (erro) {
    livrosStore.set({ livros: [], status: 'erro', mensagemErro: erro.message });
  }
}

async function carregarAvaliacoes() {
  avaliacoesStore.set({ status: 'carregando', mensagemErro: '' });
  try {
    const avaliacoes = await avaliacaoService.listar();
    avaliacoesStore.set({
      avaliacoes,
      status: avaliacoes.length ? 'sucesso' : 'vazio',
      mensagemErro: '',
    });
  } catch (erro) {
    avaliacoesStore.set({ avaliacoes: [], status: 'erro', mensagemErro: erro.message });
  }
}

const livroView = criarLivroView({
  onRecarregar: carregarLivros,
  onCancelar() {
    livroView.limparForm();
    livrosStore.set({ editandoId: null });
  },
  onEditar(livro) {
    livroEditandoId = livro.id;
    livroView.preencherForm(livro);
    livrosStore.set({ editandoId: livro.id });
  },
  async onRemover(livro) {
    if (!window.confirm(`Remover o livro "${livro.titulo}"?`)) return;
    aviso.limpar();
    try {
      await livroService.remover(livro.id);
      aviso.sucesso('Livro removido.');
      if (livroEditandoId === livro.id) {
        livroView.limparForm();
        livrosStore.set({ editandoId: null });
      }
      await carregarLivros();
      await carregarAvaliacoes();
    } catch (erro) {
      aviso.erro(erro.message);
    }
  },
  async onSubmit(formData) {
    const dados = Object.fromEntries(formData);
    aviso.limpar();
    livrosStore.set({ salvando: true });
    try {
      if (livroEditandoId) {
        await livroService.atualizar(livroEditandoId, dados);
        aviso.sucesso('Livro atualizado.');
      } else {
        await livroService.criar(dados);
        aviso.sucesso('Livro cadastrado.');
      }
      livroEditandoId = null;
      livroView.limparForm();
      livrosStore.set({ editandoId: null });
      await carregarLivros();
    } catch (erro) {
      aviso.erro(erro.message);
    } finally {
      livrosStore.set({ salvando: false });
    }
  },
});

const avaliacaoView = criarAvaliacaoView({
  onRecarregar: carregarAvaliacoes,
  onCancelar() {
    avaliacaoView.limparForm();
    avaliacoesStore.set({ editandoId: null });
  },
  onEditar(avaliacao) {
    avaliacaoEditandoId = avaliacao.id;
    avaliacaoView.preencherForm(avaliacao);
    avaliacoesStore.set({ editandoId: avaliacao.id });
  },
  async onRemover(avaliacao) {
    if (!window.confirm(`Remover a avaliação "${avaliacao.titulo}"?`)) return;
    aviso.limpar();
    try {
      await avaliacaoService.remover(avaliacao.id);
      aviso.sucesso('Avaliação removida.');
      if (avaliacaoEditandoId === avaliacao.id) {
        avaliacaoView.limparForm();
        avaliacoesStore.set({ editandoId: null });
      }
      await carregarAvaliacoes();
    } catch (erro) {
      aviso.erro(erro.message);
    }
  },
  async onSubmit(formData) {
    const dados = Object.fromEntries(formData);
    aviso.limpar();
    avaliacoesStore.set({ salvando: true });
    try {
      if (avaliacaoEditandoId) {
        await avaliacaoService.atualizar(avaliacaoEditandoId, dados);
        aviso.sucesso('Avaliação atualizada.');
      } else {
        await avaliacaoService.criar(dados);
        aviso.sucesso('Avaliação cadastrada.');
      }
      avaliacaoEditandoId = null;
      avaliacaoView.limparForm();
      avaliacoesStore.set({ editandoId: null });
      await carregarAvaliacoes();
    } catch (erro) {
      aviso.erro(erro.message);
    } finally {
      avaliacoesStore.set({ salvando: false });
    }
  },
});

livroView.aoClicarNaLista({
  editar(id) {
    const livro = livrosStore.get().livros.find((item) => item.id === id);
    if (!livro) return;
    livroEditandoId = id;
    livroView.preencherForm(livro);
    livrosStore.set({ editandoId: id });
  },
  async remover(id) {
    const livro = livrosStore.get().livros.find((item) => item.id === id);
    if (!livro || !window.confirm(`Remover o livro "${livro.titulo}"?`)) return;
    aviso.limpar();
    try {
      await livroService.remover(id);
      aviso.sucesso('Livro removido.');
      if (livroEditandoId === id) {
        livroView.limparForm();
        livrosStore.set({ editandoId: null });
        livroEditandoId = null;
      }
      await carregarLivros();
      await carregarAvaliacoes();
    } catch (erro) {
      aviso.erro(erro.message);
    }
  },
});

avaliacaoView.aoClicarNaLista({
  editar(id) {
    const avaliacao = avaliacoesStore.get().avaliacoes.find((item) => item.id === id);
    if (!avaliacao) return;
    avaliacaoEditandoId = id;
    avaliacaoView.preencherForm(avaliacao);
    avaliacoesStore.set({ editandoId: id });
  },
  async remover(id) {
    const avaliacao = avaliacoesStore.get().avaliacoes.find((item) => item.id === id);
    if (!avaliacao || !window.confirm(`Remover a avaliação "${avaliacao.titulo}"?`)) return;
    aviso.limpar();
    try {
      await avaliacaoService.remover(id);
      aviso.sucesso('Avaliação removida.');
      if (avaliacaoEditandoId === id) {
        avaliacaoView.limparForm();
        avaliacoesStore.set({ editandoId: null });
        avaliacaoEditandoId = null;
      }
      await carregarAvaliacoes();
    } catch (erro) {
      aviso.erro(erro.message);
    }
  },
});

livrosStore.assinar((estado) => livroView.render(estado));
avaliacoesStore.assinar((estado) => avaliacaoView.render(estado));
livrosStore.assinar((estado) => avaliacaoView.preencherLivros(estado.livros));

await carregarLivros();
await carregarAvaliacoes();
