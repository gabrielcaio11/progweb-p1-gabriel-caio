import { criarStore } from './state/store.js';
import { clienteService } from './services/clienteService.js';
import { contaService } from './services/contaService.js';
import { clienteView } from './ui/clienteView.js';
import { contaView } from './ui/contaView.js';
import { aviso } from './ui/aviso.js';

const clientes = criarStore({
  status: 'carregando',
  clientes: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

const contas = criarStore({
  status: 'carregando',
  contas: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

clientes.assinar(clienteView.render);
contas.assinar(contaView.render);

clientes.assinar((estado) => {
  contaView.preencherClientes(estado.clientes);
  contaView.render(contas.get());
});

async function carregarClientes() {
  clientes.set({ status: 'carregando', erro: null });
  try {
    const lista = await clienteService.listar();
    clientes.set({ status: lista.length ? 'sucesso' : 'vazio', clientes: lista });
  } catch (erro) {
    clientes.set({ status: 'erro', erro: erro.message, clientes: [] });
  }
}

async function carregarContas() {
  contas.set({ status: 'carregando', erro: null });
  try {
    const lista = await contaService.listar();
    contas.set({ status: lista.length ? 'sucesso' : 'vazio', contas: lista });
  } catch (erro) {
    contas.set({ status: 'erro', erro: erro.message, contas: [] });
  }
}

async function salvarCliente(dados) {
  const { editandoId } = clientes.get();
  aviso.limpar();
  clientes.set({ salvando: true });
  try {
    if (editandoId) {
      await clienteService.atualizar(editandoId, dados);
      aviso.sucesso('Cliente atualizado.');
    } else {
      await clienteService.criar(dados);
      aviso.sucesso('Cliente cadastrado.');
    }
    clienteView.limparForm();
    clientes.set({ editandoId: null });
    await carregarClientes();
  } catch (erro) {
    aviso.erro(erro.message);
  } finally {
    clientes.set({ salvando: false });
  }
}

function editarCliente(id) {
  const cliente = clientes.get().clientes.find((item) => item.id === id);
  if (!cliente) return;
  clienteView.preencherForm(cliente);
  clientes.set({ editandoId: id });
}

function cancelarEdicaoCliente() {
  clienteView.limparForm();
  clientes.set({ editandoId: null });
}

async function removerCliente(id) {
  if (!confirm(`Remover o cliente #${id}?`)) return;
  aviso.limpar();
  try {
    await clienteService.remover(id);
    aviso.sucesso('Cliente removido.');
    if (clientes.get().editandoId === id) cancelarEdicaoCliente();
    await carregarClientes();
    await carregarContas();
  } catch (erro) {
    aviso.erro(erro.message);
  }
}

clienteView.aoEnviar(salvarCliente);
clienteView.aoCancelar(cancelarEdicaoCliente);
clienteView.aoRecarregar(carregarClientes);
clienteView.aoClicarNaLista({ editar: editarCliente, remover: removerCliente });

async function salvarConta(dados) {
  const { editandoId } = contas.get();
  aviso.limpar();
  contas.set({ salvando: true });
  try {
    if (editandoId) {
      await contaService.atualizar(editandoId, dados);
      aviso.sucesso('Conta atualizada.');
    } else {
      await contaService.criar(dados);
      aviso.sucesso('Conta aberta.');
    }
    contaView.limparForm();
    contas.set({ editandoId: null });
    await carregarContas();
  } catch (erro) {
    aviso.erro(erro.message);
  } finally {
    contas.set({ salvando: false });
  }
}

function editarConta(id) {
  const conta = contas.get().contas.find((item) => item.id === id);
  if (!conta) return;
  contaView.preencherForm(conta);
  contas.set({ editandoId: id });
}

function cancelarEdicaoConta() {
  contaView.limparForm();
  contas.set({ editandoId: null });
}

async function removerConta(id) {
  if (!confirm(`Remover a conta #${id}?`)) return;
  aviso.limpar();
  try {
    await contaService.remover(id);
    aviso.sucesso('Conta removida.');
    if (contas.get().editandoId === id) cancelarEdicaoConta();
    await carregarContas();
  } catch (erro) {
    aviso.erro(erro.message);
  }
}

contaView.aoEnviar(salvarConta);
contaView.aoCancelar(cancelarEdicaoConta);
contaView.aoRecarregar(carregarContas);
contaView.aoClicarNaLista({ editar: editarConta, remover: removerConta });

await carregarClientes();
await carregarContas();
