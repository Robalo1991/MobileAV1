"use strict";

// A cláusula 'import' é utilizada sempre que uma classe precisar conhecer a estrutura
// de outra classe. No arquivo referenciado após o 'from' é necessário informar o que
// para a ser visível para a classe que utiliza o import. Para isso, lá colocamos a 
// indicação 'export'

// Importamos a definição da classe Sala
import Dao from "./Dao.js";
// Importamos a definição da classe Sala
import Sala from "./Sala.js";
// Importamos a definição da classe ModelError
import ModelError from "./ModelError.js";

/*
 * DAO --> Data Access Object
 * A responsabilidade de um DAO é fazer uma ponte entre o programa e o 
 * recurso de persistência dos dados (ex. SGDB)
 */

export default class DaoSala extends Dao {

    //-----------------------------------------------------------------------------------------//

    constructor() {
        super();
    }

    //-----------------------------------------------------------------------------------------//
    // Esse método devolve um objeto Sala a partir do atributo 'cod', pois esse é usado 
    // como chave na indexação. Esse é um exemplo de método de consulta pela chave. 
    async obterSalaPeloCodigo(cod) {
        let connection = await this.obterConexao();
        // Crio abaixo um objeto Promise, pois não sabemos quando o banco será capaz de devolver 
        // o objeto sala. Assim, lá no final deste método, temos o await vinculado com essa Promise
        // e é isto que nos garante que teremos um sala ao final da execução desse métodos

        //---- PROMISE ------------------------------------//
        let promessa = new Promise(function (resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                // Abre uma transação readonly no banco associado ao store 'SalaST'
                transacao = connection.transaction(["SalaST"], "readonly");
                // Recupero uma referência para o store 'SalaST'
                store = transacao.objectStore("SalaST");
                // Recupero uma referência para o índice 'idxCodigo' que mantém os objetos Sala ordenados pela
                // codícula
                indice = store.index('idxCodigo');
            }
            catch (e) {
                // Se ocorrer algum erro, a Promise executará o 'reject'
                reject(new ModelError("Erro: " + e));
            }

            // Solicito a recuperação do objeto sala usando o método 'get' associado ao índice.
            let consulta = indice.get(cod);
            // Defino a Callback vinculada com o retorno da consulta com sucesso
            consulta.onsuccess = function (evento) {
                if (consulta.result != null) {
                    // O IndexedDB devolve em 'consulta.result' um objeto Object com os atributos de Sala, mas não é um 
                    // objeto Sala
                    let sala = consulta.result;
                    // Para devolver um objeto Sala, pegamos os atributo do objeto Object e instanciamos um Sala e 
                    // devolvemos através do 'resolve'
                    resolve(new Sala(sala.codigo, sala.numSala, sala.lugares));
                }
                else
                    // Retorno null se não houver Sala com a codícula passada.
                    resolve(null);
            };
            // Defino a Callback vinculada com o retorno da consulta com erro
            consulta.onerror = function (evento) { reject(null); };
        });
        //---- FIM PROMISE ------------------------------------//

        return promessa;
    }

    //-----------------------------------------------------------------------------------------//
    // Esse método devolve todos os objeto Sala ordenados pela 'cod', 
    // pois será utilizado o índice. 

    async obterSalas() {
        let connection = await this.obterConexao();

        //---- PROMISE ------------------------------------//
        let promessa = new Promise(function (resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["SalaST"], "readonly");
                store = transacao.objectStore("SalaST");
                indice = store.index('idxCodigo');
            }
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }
            // Para recuperarmos todos os objetos Sala, precisamos abrir um 'Cursor' que pega
            // cada um dos objetos e os coloca na variável 'array' declarada abaixo.
            let array = [];
            indice.openCursor().onsuccess = function (event) {
                // recupero o cursor 
                var cursor = event.target.result;
                // Se o cursor for diferente null, então ele recuperou um objeto Sala 
                if (cursor) {
                    // O IndexedDB devolve em 'cursor.value' um objeto Object com os atributos de Sala, mas não é um 
                    // objeto Sala       
                    const obj = cursor.value;
                    // Gero um objeto Sala a partir de obj e incluo o Sala no array
                    array.push(new Sala(obj.codigo, obj.numSala, obj.lugares));
                    // peço ao cursor para recuperar o próximo Sala 
                    cursor.continue();
                } else {
                    // O cursor chegou ao final, logo a Promise irá executar o 'resolve' retornando 
                    // os objetos Sala recuperados.
                    resolve(array);
                }
            };
        });
        //---- FIM PROMISE ------------------------------------//

        return await promessa;
    }

    //-----------------------------------------------------------------------------------------//
    // Esse método devolve todos os objeto Sala SEM utilizar o índice. Logo a ordem será 
    // estabelecida por quando o objeto Sala foi inserido 

    async obterSalasPeloAutoIncrement() {
        let connection = await this.obterConexao();
        let promessa = new Promise(function (resolve, reject) {
            let transacao;
            let store;
            try {
                transacao = connection.transaction(["SalaST"], "readonly");
                store = transacao.objectStore("SalaST");
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
                    array.push(new Sala(obj.codigo, obj.numSala, obj.lugares));
                    cursor.continue();
                } else {
                    resolve(array);
                }
            };
        });
        return promessa;
    }

    //-----------------------------------------------------------------------------------------//

    async incluir(sala) {
        let connection = await this.obterConexao();
        //--------- PROMISE --------------//
        let resultado = new Promise((resolve, reject) => {
            // Abrindo uma transação READ-WRITE
            let transacao = connection.transaction(["SalaST"], "readwrite");
            transacao.onerror = event => {
                reject(new ModelError("Não foi possível incluir a sala: " + event.target.error));
            };
            let store = transacao.objectStore("SalaST");
            // Como sala tem os seus atributos privados, vamos gerar um objeto Object a partir dele
            // e inserí-lo no IndexedDB
            let strObj = sala.toJSON();
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

    async alterar(sala) {
        let connection = await this.obterConexao();
        //--------- PROMISE --------------//
        let resultado = new Promise(function (resolve, reject) {
            let transacao = connection.transaction(["SalaST"], "readwrite");
            transacao.onerror = event => {
                reject(new ModelError("Não foi possível alterar a sala " + event.target.error));
            };
            let store = transacao.objectStore("SalaST");
            let indice = store.index('idxCodigo');
            // Monto uma chave de procura para o cursor
            let keyValue = IDBKeyRange.only(sala.getCodigo());
            indice.openCursor(keyValue).onsuccess = function (evento) {
                const cursor = evento.target.result;
                if (cursor) {
                    // Se estiver de fato com o objeto Sala armazenado com a codícula passada
                    if (cursor.value.codigo == sala.getCodigo()) {
                        // Como sala tem os seus atributos privados, vamos gerar um objeto Object a partir dele
                        // e inserí-lo no IndexedDB
                        let strObj = sala.toJSON();
                        let obj = JSON.parse(strObj);
                        // Atualizo o objeto Sala no banco fazendo a solicitação ao Cursor.
                        const request = cursor.update(obj);
                        request.onsuccess = function () {
                            resolve(true);
                        };
                    }
                } else {
                    reject(new ModelError("Sala com o código " + sala.getCodigo() + " não encontrado!", ""));
                }
            };
        });
        //--------- FIM PROMISE --------------//
        return resultado;
    }

    //-----------------------------------------------------------------------------------------//

    async excluir(sala) {
        let connection = await this.obterConexao();
        //--------- PROMISE --------------//
        let resultado = new Promise(function (resolve, reject) {
            let transacao = connection.transaction(["SalaST"], "readwrite");
            transacao.onerror = event => {
                reject(new ModelError("Não foi possível excluir a sala", event.target.error));
            };
            let store = transacao.objectStore("SalaST");
            let indice = store.index('idxCodigo');
            var keyValue = IDBKeyRange.only(sala.getCodigo());
            indice.openCursor(keyValue).onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.codigo == sala.getCodigo()) {
                        // Solicito ao cursor para remover o objeto Sala
                        const request = cursor.delete();
                        request.onsuccess = function () {
                            resolve(true);
                        };
                        return;
                    }
                } else {
                    reject(new ModelError("Sala com o código " + sala.getCodigo() + " não encontrado!", ""));
                }
            };
        });
        //--------- FIM PROMISE --------------//
        return await resultado;
    }

    //-----------------------------------------------------------------------------------------//
}