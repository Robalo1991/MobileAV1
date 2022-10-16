"use strict";

import Status from "/Status.js";
import Filme from "/Filme.js";
import DaoFilme from "/DaoFilme.js";
import ViewerFilme from "/ViewerFilme.js";

export default class CtrlManterFilmes {
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao; // Referência para o Data Access Object para o Store de Filmes
  #viewer; // Referência para o gerenciador do viewer
  #posAtual; // Indica a posição do objeto Filme que estiver sendo apresentado
  #status; // Indica o que o controlador está fazendo

  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoFilme();
    this.#viewer = new ViewerFilme(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados
    this.#viewer.statusApresentacao();

    // Solicita ao DAO que dê a lista de todos os filmes presentes na base
    let conjFilmes = await this.#dao.obterFilmes();

    // Se a lista de filmes estiver vazia
    if (conjFilmes.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;

      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    } else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if (this.#posAtual == 0 || this.#posAtual > conjFilmes.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(
        this.#posAtual,
        conjFilmes.length,
        conjFilmes[this.#posAtual - 1]
      );
    }
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjFilmes = await this.#dao.obterFilmes();
    if (conjFilmes.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjFilmes = await this.#dao.obterFilmes();
    if (this.#posAtual < conjFilmes.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjFilmes = await this.#dao.obterFilmes();
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjFilmes = await this.#dao.obterFilmes();
    this.#posAtual = conjFilmes.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir.
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de
    // "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//

  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir.
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//

  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir.
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(cod, titulo, genero, ano, cartaz) {
    if (this.#status == Status.INCLUINDO) {
      try {
        let filme = new Filme(cod, titulo, genero, ano, cartaz);
        await this.#dao.incluir(filme);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(cod, titulo, genero, ano, cartaz) {
    if (this.#status == Status.ALTERANDO) {
      try {
        let filme = await this.#dao.obterFilmePeloCodigo(cod);
        if (filme == null) {
          alert("Filme com o código " + cod + " não encontrado.");
        } else {
          filme.setTitulo(titulo);
          filme.setGenero(genero);
          filme.setAno(ano);
          filme.setCartaz(cartaz);
          await this.#dao.alterar(filme);
          
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  async excluir(cod) {
    if (this.#status == Status.EXCLUINDO) {
      try {
        let filme = await this.#dao.obterFilmePeloCodigo(cod);
        if (filme == null) {
          alert("Filme com o código " + cod + " não encontrado.");
        } else {
          await this.#dao.excluir(filme);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//
