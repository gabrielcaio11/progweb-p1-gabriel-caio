// ============================================================
// S2_library-bad.js — Mãos à Obra da Semana 2 (Parte A)
// Este código FUNCIONA (rode: node S2_library-bad.js). E é ruim de propósito.
// Sua tarefa, em dupla: NÃO refatore. Apenas leia e marque os cheiros.
//   Use // SMELL: <nome>        para cada code smell (nomes do slide 16)
//   Use // VIOLA: <S|O|L|I|D>   para cada princípio SOLID violado (slide 4)
// ============================================================

class Library {
  constructor() {
    this.bks = []; // SMELL: Primitive Obsession, Nome obscuro
    this.us = []; // SMELL: Primitive Obsession, Nome obscuro
    this.lns = []; // SMELL: Primitive Obsession, Nome obscuro
  }

  // SMELL: Nome obscuro da função; 
  // SMELL: Long Method  
  // VIOLA: S, O
  doStuff(book, userId, action) { 

    // SMELL: Switch sobre tipo
    if (action === 'add') {
      this.bks.push(book);
      console.log('Added: ' + book.t);
    } else if (action === 'lend') {
    
      // SMELL: Nome obscuro  
      var u = null;

      for (var i = 0; i < this.us.length; i++) {
        if (this.us[i].id === userId) { u = this.us[i]; }
      }

      // SMELL: Nome obscuro
      var b = null;

      for (var j = 0; j < this.bks.length; j++) {
        if (this.bks[j].t === book.t) { b = this.bks[j]; }
      }


      if (u != null && b != null && b.cp > 0) {

        // SMELL: Nome obscuro
        b.cp = b.cp - 1;
        // SMELL: Nome obscuro
        this.lns.push({ uid: userId, bt: book.t, d: new Date(), st: 1 });
        
        // Comentário-desodorante
        // 1 = active, 2 = returned, 3 = overdue
        fetch('http://email.api/send', { // VIOLA: D (dependência de API externa)
          method: 'POST',
          body: JSON.stringify({ to: u.em, msg: 'Você pegou ' + book.t }) // SMELL: Nome obscuro
        }).then(r => { /* nada */ }).catch(e => {}); // SMELL: Erro engolido
      }
    } else if (action === 'return') {
    
      // SMELL: Nome obscuro
      for (var k = 0; k < this.lns.length; k++) {
        if (this.lns[k].uid === userId && this.lns[k].bt === book.t && this.lns[k].st === 1) {
          this.lns[k].st = 2;

          // SMELL: Nome obscuro
          for (var m = 0; m < this.bks.length; m++) {
            if (this.bks[m].t === book.t) { this.bks[m].cp = this.bks[m].cp + 1; }
          }
        }
      }
    } else if (action === 'overdue') {
      for (var n = 0; n < this.lns.length; n++) {

        // SMELL: Magic Number
        var diff = (new Date() - this.lns[n].d) / (1000 * 60 * 60 * 24); // SMELL: Magic Number
        if (this.lns[n].st === 1 && diff > 7) {
          this.lns[n].st = 3;
          // SMELL: Nome obscuro
          var usr = null;
          for (var p = 0; p < this.us.length; p++) {
            if (this.us[p].id === this.lns[n].uid) { usr = this.us[p]; }
          }
          if (usr) {
            // VIOLA: D (dependência de API externa)
            fetch('http://email.api/send', {
              method: 'POST',
              body: JSON.stringify({ to: usr.em, msg: 'Atrasado: ' + this.lns[n].bt }) // SMELL: Nome obscuro
            });
          }
        }
      }
    }
  }

  // SMELL: Data Clumps
  registerUser(n, e, ph, addr, cty, st, zp, isAdm) {
    this.us.push({ id: this.us.length + 1, n: n, em: e, ph: ph, addr: addr, cty: cty, st: st, zp: zp, isAdm: isAdm });
  }

  report(type) {
    // SMELL: Switch sobre tipo; Primitive Obsession
    // VIOLA: S, O
    if (type === 1) {
      console.log('Total de livros: ' + this.bks.length);
    } else if (type === 2) {
      console.log('Total de usuários: ' + this.us.length);
    } else if (type === 3) {
      console.log('Total de empréstimos: ' + this.lns.length);
    }
  }
}

// Uso:
const lib = new Library();
lib.registerUser('Ana', 'ana@uepb.edu.br', '83999990000', 'Rua X, 10', 'Patos', 'PB', '58700-000', false);
lib.doStuff({ t: 'Clean Code', cp: 3 }, null, 'add');
lib.doStuff({ t: 'Clean Code' }, 1, 'lend');
lib.report(1);