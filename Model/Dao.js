"use strict";

import ModelError from "/Model/ModelError.js";

export default class Dao {

    //-----------------------------------------------------------------------------------------//

    static promessaConexao = null;

    //-----------------------------------------------------------------------------------------//

    constructor() {
        if (this.constructor == Dao)
            throw new Error("Classes abstratas não podem ser instanciadas!");
        this.obterConexao();
    }

    //-----------------------------------------------------------------------------------------//

    async obterConexao() {
        if (Dao.promessaConexao == null) {
            Dao.promessaConexao = new Promise(function (resolve, reject) {
                let requestDB = window.indexedDB.open("AppDB", 1);

                //------------------------------------------------------------------------------------//

                requestDB.onupgradeneeded = function criarBanco(evento) {
                    let db = evento.target.result;
                    let store = db.createObjectStore("SessaoST", { autoIncrement: true });
                    store = db.createObjectStore("FilmeST", { autoIncrement: true });
                    store.createIndex("idxReg", "reg", { unique: true });
                    store = db.createObjectStore("SalaST", { autoIncrement: true });
                    store.createIndex("idxCodigo", "codigo", { unique: true });
                    // Store para implementação do relacionamento entre Filme e Sala
                    store = db.createObjectStore("RegEmST", { autoIncrement: true });
                    store.createIndex("idxReg", "reg", { unique: false });
                    store.createIndex("idxCodigo", "codigo", { unique: false });
                };

                //------------------------------------------------------------------------------------//

                requestDB.onerror = function erro(evento) {
                    reject(new ModelError("Erro: " + evento.target.errorCode));
                };

                //------------------------------------------------------------------------------------//

                requestDB.onsuccess = function bancoAberto(evento) {
                    if (evento.target.result)
                        resolve(evento.target.result);
                    else
                        reject(new ModelError("Erro: " + evento.target.errorCode));
                };
            });
        }
        return Dao.promessaConexao;
    }

    //-----------------------------------------------------------------------------------------//
}

