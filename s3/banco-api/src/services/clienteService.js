import { clienteModel } from '../models/clienteModel.js';
import { contaModel } from '../models/contaModel.js';
import { erro } from '../utils/erro.js';

export const clienteService = {
  listar() {
    return clienteModel.listar();
  },

  buscarPorId(id) {
    const cliente = clienteModel.buscarPorId(id);
    if (!cliente) throw erro(404, 'Cliente não encontrado');
    return cliente;
  },

  criar({ nome, cpf, email } = {}) {
    if (!nome || !cpf) throw erro(400, 'Campos "nome" e "cpf" são obrigatórios');
    if (clienteModel.existeCpf(cpf)) throw erro(409, 'Já existe um cliente com este CPF');
    return clienteModel.inserir({ nome, cpf, email });
  },

  atualizar(id, dados = {}) {
    if (dados.cpf) {
      const existente = clienteModel.buscarPorCpf(dados.cpf);
      if (existente && existente.id !== Number(id)) {
        throw erro(409, 'Já existe um cliente com este CPF');
      }
    }
    const atualizado = clienteModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Cliente não encontrado');
    return atualizado;
  },

  remover(id) {
    if (contaModel.listarPorCliente(Number(id)).length > 0) {
      throw erro(409, 'Cliente possui contas. Remova as contas primeiro.');
    }
    const removido = clienteModel.remover(id);
    if (!removido) throw erro(404, 'Cliente não encontrado');
  },
};
