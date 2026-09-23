// s1/Conta.js — v2: encapsulamento
// usa export para poder importar em outro arquivo
export class Conta {

  // para torna o campo privado, basta colocar # antes do nome do atributo. A partir de agora, só o código DENTRO desta classe enxerga este campo
  #saldo = 0; // campo privado: só o código DENTRO desta classe enxerga
  #titular;

  // não é necessário declarar os atributos antes de usar no construtor, mas é uma boa prática
  constructor(numero, titular) {
    this.numero = numero;
    this.titular = titular; // passa pelo setter, que valida o tipo de dado
  }
  
  // getter: leitura liberada. Não há setter: escrever, só por depositar/sacar
  get saldo() {
    return this.#saldo;
  }

  get titular() {
    return this.#titular;
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
  }

  sacar(valor) {
    if (!(valor > 0)) throw new Error('Saque deve ser positivo');
    if (valor > this.#saldo) throw new Error('Saldo insuficiente');
    this.#saldo -= valor;
  }
}