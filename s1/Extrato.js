// s1/Extrato.js — composição: a Conta TEM UM Extrato
export class Extrato {
  #lancamentos = [];

  registrar(tipo, valor) {
    this.#lancamentos.push({ tipo, valor, data: new Date() });
  }

  listar() {
    return [...this.#lancamentos]; // cópia: ninguém altera o original por fora
  }
}
