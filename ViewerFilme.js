import Status from "/Status.js";
import Filme from "/Filme.js";
import ViewerError from "/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerFilme {
  #ctrl;

  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.divNavegar = this.obterElemento("divNavegar");
    this.divComandos = this.obterElemento("divComandos");
    this.divAviso = this.obterElemento("divAviso");
    this.divDialogo = this.obterElemento("divDialogo");

    this.btPrimeiro = this.obterElemento("btPrimeiro");
    this.btAnterior = this.obterElemento("btAnterior");
    this.btProximo = this.obterElemento("btProximo");
    this.btUltimo = this.obterElemento("btUltimo");

    this.btIncluir = this.obterElemento("btIncluir");
    this.btExcluir = this.obterElemento("btExcluir");
    this.btAlterar = this.obterElemento("btAlterar");
    this.btSair = this.obterElemento("btSair");

    this.btOk = this.obterElemento("btOk");
    this.btCancelar = this.obterElemento("btCancelar");

    this.tfCodigo = this.obterElemento("tfCodigo");
    this.tfTitulo = this.obterElemento("tfTitulo");
    this.tfGenero = this.obterElemento("tfGenero");
    this.tfAno = this.obterElemento("tfAno");
    this.divCartaz = this.obterElemento("divCartaz");
    this.imgCartaz = this.obterElemento("imgCartaz");
    this.tfCartaz = this.obterElemento("tfCartaz");
    
    this.txtOperacao = this.obterElemento("txtOperacao");

    this.btPrimeiro.onclick = fnBtPrimeiro;
    this.btProximo.onclick = fnBtProximo;
    this.btAnterior.onclick = fnBtAnterior;
    this.btUltimo.onclick = fnBtUltimo;

    this.btIncluir.onclick = fnBtIncluir;
    this.btAlterar.onclick = fnBtAlterar;
    this.btExcluir.onclick = fnBtExcluir;

    this.btOk.onclick = fnBtOk;
    this.btCancelar.onclick = fnBtCancelar;
  }

  //------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento == null)
      throw new ViewerError(
        "Elemento não encontgrado. ID: '" + idElemento + "'"
      );
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

  //------------------------------------------------------------------------//

  getCtrl() {
    return this.#ctrl;
  }

  //------------------------------------------------------------------------//

  apresentar(pos, qtde, filme) {
    this.configurarNavegacao(pos <= 1, pos == qtde);

    if (filme == null) {
      this.tfCodigo.value = "";
      this.tfTitulo.value = "";
      this.tfGenero.value = "";
      this.tfAno.value = "";
      this.divCartaz.hidden = true;
      this.imgCartaz.src =
        "data:image/jpeg;base64,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";
      this.divAviso.innerHTML = " Número de Filmes: 0";
    } else {
      this.tfCodigo.value = filme.getCodigo();
      this.tfTitulo.value = filme.getTitulo();
      this.tfGenero.value = filme.getGenero();
      this.tfAno.value = filme.getAno();
      this.imgCartaz.src = filme.getCartaz();
      this.tfCartaz.value = filme.getCartaz();
      this.divCartaz.hidden = true;
      this.divAviso.innerHTML =
        "Posição: " + pos + " | Número de Filmes: " + qtde;
    }
  }

  //------------------------------------------------------------------------//

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled = flagFim;
    this.btProximo.disabled = flagFim;
    this.btAnterior.disabled = flagInicio;
  }

  //------------------------------------------------------------------------//

  statusEdicao(operacao) {
    this.txtOperacao.innerHTML = operacao;
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false;

    if (operacao != Status.EXCLUINDO) {
      this.tfTitulo.disabled = false;
      this.tfGenero.disabled = false;
      this.tfAno.disabled = false;
      this.divCartaz.hidden = false;
      this.tfCartaz.disabled = false;
      this.divAviso.innerHTML = "";
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";
    }
    if (operacao == Status.INCLUINDO) {
      this.tfCodigo.disabled = false;
      this.imgCartaz.hidden = true;
      this.divCartaz.hidden = false;
      this.tfCodigo.value = "";
      this.tfTitulo.value = "";
      this.tfCartaz.value = "";
      this.tfGenero.value = "";
      this.tfAno.value = "";
      
    }
  }

  //------------------------------------------------------------------------//

  statusApresentacao() {
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true;
    this.imgCartaz.hidden = false;
    this.tfCodigo.disabled = true;
    this.tfTitulo.disabled = true;
    this.divCartaz.hidden = true;
    this.tfGenero.disabled = true;
    this.tfAno.disabled = true;
    
  }
}

//------------------------------------------------------------------------//
// Botões
//------------------------------------------------------------------------//

function fnBtPrimeiro() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarPrimeiro();
}

//------------------------------------------------------------------------//

function fnBtProximo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarProximo();
}

//------------------------------------------------------------------------//

function fnBtAnterior() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarAnterior();
}

//------------------------------------------------------------------------//

function fnBtUltimo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarUltimo();
}
//------------------------------------------------------------------------//

function fnBtIncluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarIncluir();
}

//------------------------------------------------------------------------//

function fnBtAlterar() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarAlterar();
}

//------------------------------------------------------------------------//

function fnBtExcluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const codigo = this.viewer.tfCodigo.value;
  const titulo = this.viewer.tfTitulo.value;
  const genero = this.viewer.tfGenero.value;
  const ano = this.viewer.tfAno.value;
  const cartaz = this.viewer.tfCartaz.value;

  this.viewer.getCtrl().efetivar(codigo, titulo, genero, ano, cartaz);

}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}

//------------------------------------------------------------------------//
