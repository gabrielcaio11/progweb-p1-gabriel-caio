// s1/Conta.js — v2: encapsulamento

import { Extrato } from './Extrato.js'; // importa a classe Extrato

// usa export para poder importar em outro arquivo
export class Conta {
  #extrato;
  // para torna o campo privado, basta colocar # antes do nome do atributo. A partir de agora, só o código DENTRO desta classe enxerga este campo
  #saldo = 0; // campo privado: só o código DENTRO desta classe enxerga
  #titular;

  // não é necessário declarar os atributos antes de usar no construtor, mas é uma boa prática
  constructor(numero, titular) {
   if (new.target === Conta) {
      throw new Error('Conta é abstrata: crie ContaCorrente ou ContaPoupanca');
    }
    this.numero = numero;
    this.titular = titular; // passa pelo setter, que valida o tipo de dado
    this.#extrato = new Extrato(); // composição: a Conta TEM UM Extrato
  }
  
  // getter: leitura liberada. Não há setter: escrever, só por depositar/sacar
  get saldo() {
    return this.#saldo;
  }

  get titular() {
    return this.#titular;
  }

  get extrato() {
    return this.#extrato.listar(); // devolve uma cópia do extrato, para ninguém alterar o original por fora
  }

  // setter: escrita liberada, mas com regra
  set titular(nome) {
    if (typeof nome !== 'string' || nome.trim().length < 3) {
      throw new Error('Titular inválido');
    }
    this.#titular = nome.trim();
  }

  depositar(valor) {
    // Por que !(valor > 0) e não valor <= 0? Porque undefined, NaN e 'banana' 
    // também precisam ser barrados, e NaN <= 0 é false.
    if (!(valor > 0)) throw new Error('Depósito deve ser positivo');
    this.#saldo += valor;
    this.#extrato.registrar('depósito', valor); // registra o depósito no extrato
  }

  sacar(valor) {
    if (!(valor > 0)) throw new Error('Saque deve ser positivo');
    if (valor > this.saldoDisponivel()) throw new Error('Saldo insuficiente');
    this.#extrato.registrar('saque', valor); // registra o saque no extrato
    this.#saldo -= valor;
  }

  // (novo) quanto dá para sacar agora? As subclasses podem redefinir.
  saldoDisponivel() {
    return this.#saldo;
  }

  // "método abstrato": cada tipo de conta TEM de dizer quanto cobra
  tarifaMensal() {
    throw new Error('tarifaMensal() precisa ser implementado na subclasse');
  }

  // sobrescrevendo um método que veio de Object.prototype
  toString() {
    return `${this.constructor.name} ${this.numero} · ${this.titular} · R$ ${this.saldo.toFixed(2)}`;
  }

}