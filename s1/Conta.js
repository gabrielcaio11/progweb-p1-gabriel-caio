// s1/Conta.js — v1: abstração
// usa export para poder importar em outro arquivo
export class Conta {

  // não é necessário declarar os atributos antes de usar no construtor, mas é uma boa prática
  constructor(numero, titular) {
    this.numero = numero;
    this.titular = titular;
    this.saldo = 0; // ainda público: o próximo pilar resolve isso
  }

  depositar(valor) {
    this.saldo += valor;
  }

  sacar(valor) {
    this.saldo -= valor;
  }
}