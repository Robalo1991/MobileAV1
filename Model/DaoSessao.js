"use strict";

import Dao from "./Dao.js";
import ModelError from "./ModelError.js";

export default class DaoSessao extends Dao {
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    super();
  }
  
  //-----------------------------------------------------------------------------------------//

  async pop() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["SessaoST"], "readwrite");
        store = transacao.objectStore("SessaoST");
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let ultimo = null;
      store.openCursor(null,'prev').onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          ultimo = cursor.value;
          const request = cursor.delete();
          request.onsuccess = function() { 
              resolve(ultimo); 
          };
        } else {
          resolve(null);
        }
      };
    });
    return promessa;
  }

  //-----------------------------------------------------------------------------------------//

  async push(obj) {
    let connection = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {
      // Abrindo uma transação READ-WRITE
      let transacao = connection.transaction(["SessaoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar a sessão: " + event.target.error));
      };
      let store = transacao.objectStore("SessaoST");
      let requisicao = store.add(obj);
      requisicao.onsuccess = function(event) {
        resolve(true);              
      };
    });
    //--------- FIM PROMISE --------------//
    return resultado;
  }

  //-----------------------------------------------------------------------------------------//
}
