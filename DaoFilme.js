"use strict";

import ModelError from "/ModelError.js";
import Filme from "/Filme.js";

export default class DaoFilme {
  
  //-----------------------------------------------------------------------------------------//

  static conexao = null;

  constructor() {
    this.arrayFilmes = [];
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o BD
   */ 
  async obterConexao() {
    if(DaoFilme.conexao == null) {
      DaoFilme.conexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("FilmeDB", 1); 

        requestDB.onupgradeneeded = (event) => {
          let db = event.target.result;
          let store = db.createObjectStore("FilmeST", {
            autoIncrement: true
          });
          store.createIndex("idxCodigo", "codigo", { unique: true });
        };

        requestDB.onerror = event => {
          reject(new ModelError("Erro: " + event.target.errorCode));
        };

        requestDB.onsuccess = event => {
          if (event.target.result) {
            // event.target.result apontará para IDBDatabase aberto
            resolve(event.target.result);
          }
          else 
            reject(new ModelError("Erro: " + event.target.errorCode));
        };
      });
    }
    return await DaoFilme.conexao;
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterFilmes() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["FilmeST"], "readonly");
        store = transacao.objectStore("FilmeST");
        indice = store.index('idxCodigo');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Filme.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayFilmes = await promessa;
    return this.arrayFilmes;
  }

  //-----------------------------------------------------------------------------------------//

  async obterFilmePeloCodigo(cod) {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["FilmeST"], "readonly");
        store = transacao.objectStore("FilmeST");
        indice = store.index('idxCodigo');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(cod);
      consulta.onsuccess = function(event) { 
        if(consulta.result != null)
          resolve(Filme.assign(consulta.result)); 
        else
          resolve(null);
      };
      consulta.onerror = function(event) { reject(null); };
    });
    let filme = await promessa;
    return filme;
  }

  //-----------------------------------------------------------------------------------------//

  async obterFilmesPeloAutoIncrement() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["FilmeST"], "readonly");
        store = transacao.objectStore("FilmeST");
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Filme.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayFilmes = await promessa;
    return this.arrayFilmes;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(filme) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["FilmeST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o filme", event.target.error));
      };
      let store = transacao.objectStore("FilmeST");
      let requisicao = store.add(Filme.deassign(filme));
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(filme) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["FilmeST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o filme", event.target.error));
      };
      let store = transacao.objectStore("FilmeST");     
      let indice = store.index('idxCodigo');
      var keyValue = IDBKeyRange.only(filme.getCodigo());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.codigo == filme.getCodigo()) {
            const request = cursor.update(Filme.deassign(filme));
            request.onsuccess = () => {
              console.log("[DaoFilme.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Filme com a código " + filme.getCodigo() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(filme) {
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["FilmeST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o filme", event.target.error));
      };
      let store = transacao.objectStore("FilmeST");
      let indice = store.index('idxCodigo');
      var keyValue = IDBKeyRange.only(filme.getCodigo());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.codigo == filme.getCodigo()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Filme com a código " + filme.getCodigo() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
