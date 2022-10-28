"use strict";

import Ctrl from "./Ctrl.js";
import ViewerInicial from "./ViewerInicial.js";
import DaoSessao from "./Model/DaoSessao.js";

export default class CtrlSessao extends Ctrl{
  
  #ctrlAtual;
  #daoSessao;
  
  //-----------------------------------------------------------------------------------------//
  
  constructor() {
    super();
    this.#daoSessao = new DaoSessao();
    this.restaurarSessao();
  }
  
  //-----------------------------------------------------------------------------------------//

  // Ao carregarmos uma página, verificamos qual é o contexto de execução. 
  // Isso é necessário, pois os objetos que instanciamos são perdidos quando
  // mudamos de página. 
  async restaurarSessao() {
    // Verificamos qual é o caso de uso que se deseja executar
    let ctrl = await this.#daoSessao.pop();
    if(ctrl == null) {
      this.#ctrlAtual = this;
      new ViewerInicial(this);    
    }
    else {
      // Realizamos a injeção de dependência 
      let modulo = await import(ctrl.path);
      new modulo.default();
    } 
  }
  
  //-----------------------------------------------------------------------------------------//

  iniciarManterFilmes() {
    this.#daoSessao.push({"path" : "./ManterFilmes/CtrlManterFilmes.js"})
    window.location = "./ManterFilmes/index.html";
  }

  //-----------------------------------------------------------------------------------------//

  iniciarManterSalas() {
    // Vamos incluir na pilha da sessão que desejamos iniciar o caso de uso 
    // Manter Salas. Essa operação é necessária, pois, como vamos alterar a página, 
    // os objetos que instanciarmos serão perdidos. Depois que a página for carregada
    //
    this.#daoSessao.push({"path" : "./ManterSalas/CtrlManterSalas.js"})
    window.location = "./ManterSalas/index.html";
  }
  
  //-----------------------------------------------------------------------------------------//
}

var sessao = new CtrlSessao();

//------------------------------------------------------------------------//

//
// O código abaixo está relacionado com o deploy do Service Worker. Isso permite que nossa 
// aplicação se torne um App para Dispositivos Mobile
//
/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}*/


//------------------------------------------------------------------------//
