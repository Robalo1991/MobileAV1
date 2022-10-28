"use strict";

// A cláusula 'import' é utilizada sempre que uma classe precisar conhecer a estrutura
// de outra classe. No arquivo referenciado após o 'from' é necessário informar o que
// para a ser visível para a classe que utiliza o import. Para isso, lá colocamos a 
// indicação 'export'

// Importamos a definição da classe Filme
import Dao from "./Dao.js";
// Importamos a definição da classe Filme
import Filme from "./Filme.js";
// Importamos a definição da classe ModelError
import ModelError from "./ModelError.js";

/*
 * DAO --> Data Access Object
 * A responsabilidade de um DAO é fazer uma ponte entre o programa e o 
 * recurso de persistência dos dados (ex. SGDB)
 */

export default class DaoFilme extends Dao {

    //-----------------------------------------------------------------------------------------//

    constructor() {
        super();
    }

    //-----------------------------------------------------------------------------------------//
    // Esse método devolve um objeto Filme a partir do atributo 'reg', pois esse é usado 
    // como chave na indexação. Esse é um exemplo de método de consulta pela chave. 
    async obterFilmePelaReg(reg) {
        let connection = await this.obterConexao();
        // Crio abaixo um objeto Promise, pois não sabemos quando o banco será capaz de devolver 
        // o objeto filme. Assim, lá no final deste método, temos o await vinculado com essa Promise
        // e é isto que nos garante que teremos um filme ao final da execução desse métodos

        //---- PROMISE ------------------------------------//
        let promessa = new Promise(function (resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                // Abre uma transação readonly no banco associado ao store 'FilmeST'
                transacao = connection.transaction(["FilmeST"], "readonly");
                // Recupero uma referência para o store 'FilmeST'
                store = transacao.objectStore("FilmeST");
                // Recupero uma referência para o índice 'idxReg' que mantém os objetos Filme ordenados pela
                // regícula
                indice = store.index('idxReg');
            }
            catch (e) {
                // Se ocorrer algum erro, a Promise executará o 'reject'
                reject(new ModelError("Erro: " + e));
            }

            // Solicito a recuperação do objeto filme usando o método 'get' associado ao índice.
            let consulta = indice.get(reg);
            // Defino a Callback vinculada com o retorno da consulta com sucesso
            consulta.onsuccess = function (evento) {
                if (consulta.result != null) {
                    // O IndexedDB devolve em 'consulta.result' um objeto Object com os atributos de Filme, mas não é um 
                    // objeto Filme
                    let filme = consulta.result;
                    // Para devolver um objeto Filme, pegamos os atributo do objeto Object e instanciamos um Filme e 
                    // devolvemos através do 'resolve'
                    resolve(new Filme(filme.reg, filme.codFilme, filme.titulo, filme.diretor, filme.duracao));
                }
                else
                    // Retorno null se não houver Filme com a regícula passada.
                    resolve(null);
            };
            // Defino a Callback vinculada com o retorno da consulta com erro
            consulta.onerror = function (evento) { reject(null); };
        });
        //---- FIM PROMISE ------------------------------------//

        return promessa;
    }

    //-----------------------------------------------------------------------------------------//
    // Esse método devolve todos os objeto Filme ordenados pela 'reg', 
    // pois será utilizado o índice. 

    async obterFilmes() {
        let connection = await this.obterConexao();

        //---- PROMISE ------------------------------------//
        let promessa = new Promise(function (resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["FilmeST"], "readonly");
                store = transacao.objectStore("FilmeST");
                indice = store.index('idxReg');
            }
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }
            // Para recuperarmos todos os objetos Filme, precisamos abrir um 'Cursor' que pega
            // cada um dos objetos e os coloca na variável 'array' declarada abaixo.
            let array = [];
            indice.openCursor().onsuccess = function (event) {
                // recupero o cursor 
                var cursor = event.target.result;
                // Se o cursor for diferente null, então ele recuperou um objeto Filme 
                if (cursor) {
                    // O IndexedDB devolve em 'cursor.value' um objeto Object com os atributos de Filme, mas não é um 
                    // objeto Filme       
                    const obj = cursor.value;
                    // Gero um objeto Filme a partir de obj e incluo o Filme no array
                    array.push(new Filme(obj.reg, obj.codFilme, obj.titulo, obj.diretor, obj.duracao));
                    // peço ao cursor para recuperar o próximo Filme 
                    cursor.continue();
                } else {
                    // O cursor chegou ao final, logo a Promise irá executar o 'resolve' retornando 
                    // os objetos Filme recuperados.
                    resolve(array);
                }
            };
        });
        //---- FIM PROMISE ------------------------------------//

        return await promessa;
    }

    //-----------------------------------------------------------------------------------------//
    // Esse método devolve todos os objeto Filme SEM utilizar o índice. Logo a ordem será 
    // estabelecida por quando o objeto Filme foi inserido 

    async obterFilmesPeloAutoIncrement() {
        let connection = await this.obterConexao();
        let promessa = new Promise(function (resolve, reject) {
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
            // Observe que, nesse caso, o cursor será aberto sobre o store e não sobre o índice
            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    const obj = cursor.value;
                    array.push(new Filme(obj.reg, obj.codFilme, obj.titulo, obj.diretor, obj.duracao));
                    cursor.continue();
                } else {
                    resolve(array);
                }
            };
        });
        return promessa;
    }

    //-----------------------------------------------------------------------------------------//

    async incluir(filme) {
        let connection = await this.obterConexao();
        //--------- PROMISE --------------//
        let resultado = new Promise((resolve, reject) => {
            // Abrindo uma transação READ-WRITE
            let transacao = connection.transaction(["FilmeST"], "readwrite");
            transacao.onerror = event => {
                reject(new ModelError("Não foi possível incluir o filme: " + event.target.error));
            };
            let store = transacao.objectStore("FilmeST");
            // Como filme tem os seus atributos privados, vamos gerar um objeto Object a partir dele
            // e inserí-lo no IndexedDB
            let strObj = filme.toJSON();
            let obj = JSON.parse(strObj);
            let requisicao = store.add(obj);
            requisicao.onsuccess = function (event) {
                resolve(true);
            };
        });
        //--------- FIM PROMISE --------------//
        return resultado;
    }

    //-----------------------------------------------------------------------------------------//

    async alterar(filme) {
        let connection = await this.obterConexao();
        //--------- PROMISE --------------//
        let resultado = new Promise(function (resolve, reject) {
            let transacao = connection.transaction(["FilmeST"], "readwrite");
            transacao.onerror = event => {
                reject(new ModelError("Não foi possível alterar o filme " + event.target.error));
            };
            let store = transacao.objectStore("FilmeST");
            let indice = store.index('idxReg');
            // Monto uma chave de procura para o cursor
            let keyValue = IDBKeyRange.only(filme.getReg());
            indice.openCursor(keyValue).onsuccess = function (evento) {
                const cursor = evento.target.result;
                if (cursor) {
                    // Se estiver de fato com o objeto Filme armazenado com a regícula passada
                    if (cursor.value.reg == filme.getReg()) {
                        // Como filme tem os seus atributos privados, vamos gerar um objeto Object a partir dele
                        // e inserí-lo no IndexedDB
                        let strObj = filme.toJSON();
                        let obj = JSON.parse(strObj);
                        // Atualizo o objeto Filme no banco fazendo a solicitação ao Cursor.
                        const request = cursor.update(obj);
                        request.onsuccess = function () {
                            resolve(true);
                        };
                    }
                } else {
                    reject(new ModelError("Filme com o codigo " + filme.getReg() + " não encontrado!", ""));
                }
            };
        });
        //--------- FIM PROMISE --------------//
        return resultado;
    }

    //-----------------------------------------------------------------------------------------//

    async excluir(filme) {
        let connection = await this.obterConexao();
        //--------- PROMISE --------------//
        let resultado = new Promise(function (resolve, reject) {
            let transacao = connection.transaction(["FilmeST"], "readwrite");
            transacao.onerror = event => {
                reject(new ModelError("Não foi possível excluir o filme", event.target.error));
            };
            let store = transacao.objectStore("FilmeST");
            let indice = store.index('idxReg');
            var keyValue = IDBKeyRange.only(filme.getReg());
            indice.openCursor(keyValue).onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.reg == filme.getReg()) {
                        // Solicito ao cursor para remover o objeto Filme
                        const request = cursor.delete();
                        request.onsuccess = function () {
                            resolve(true);
                        };
                        return;
                    }
                } else {
                    reject(new ModelError("Filme com o registro " + filme.getReg() + " não encontrado!", ""));
                }
            };
        });
        //--------- FIM PROMISE --------------//
        return await resultado;
    }

    //-----------------------------------------------------------------------------------------//
}
