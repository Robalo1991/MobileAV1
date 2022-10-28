import ViewerError from "/ViewerError.js";
import Viewer from "/Viewer.js";

//------------------------------------------------------------------------//

export default class ViewerInicial extends Viewer {
  
  constructor(ctrl) {
    super(ctrl);
    this.divComandos = this.obterElemento('divComandos'); 
    this.divAviso    = this.obterElemento('divAviso'); 

    this.btManterFilmes   = this.obterElemento('btManterFilmes');
    this.btManterSalas   = this.obterElemento('btManterSalas');
    this.btSair           = this.obterElemento('btSair');

      
    this.btManterFilmes.onclick = fnBtManterFilmes; 
    this.btManterSalas.onclick = fnBtManterSalas; 
    this.btSair.onclick = fnBtSair; 
  }

//------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

//------------------------------------------------------------------------//
  
}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtManterFilmes() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarManterFilmes();
  
}

//------------------------------------------------------------------------//

function fnBtManterSalas() {
  this.viewer.getCtrl().iniciarManterSalas();
  
}

//------------------------------------------------------------------------//

function fnBtSair() {
  this.viewer.getCtrl().terminar();
  
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





