"use strict";

import Ctrl from "../Ctrl.js";
import Status from "./Status.js";
import Sala from "../Model/Sala.js";
import SalaDTO from "../Model/SalaDTO.js";
import DaoSala from "../Model/DaoSala.js";
import ViewerSala from "./ViewerSala.js";

export default class CtrlManterSalas extends Ctrl {

    //-----------------------------------------------------------------------------------------//

    //
    // Atributos do Controlador
    //
    #dao;      // Referência para o Data Access Object para o Store de Salas
    #viewer;   // Referência para o gerenciador do viewer 
    #posAtual; // Indica a posição do objeto Sala que estiver sendo apresentado
    #status;   // Indica o que o controlador está fazendo 

    //-----------------------------------------------------------------------------------------//

    constructor() {
        super();
        this.#dao = new DaoSala();
        this.#viewer = new ViewerSala(this);
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
        let conjSalas = await this.#dao.obterSalas();

        // Se a lista de filmes estiver vazia
        if (conjSalas.length == 0) {
            // Posição Atual igual a zero indica que não há objetos na base
            this.#posAtual = 0;

            // Informo ao viewer que não deve apresentar nada
            this.#viewer.apresentar(0, 0, null);
        }
        else {
            // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
            if (this.#posAtual == 0 || this.#posAtual > conjSalas.length)
                this.#posAtual = 1;
            // Peço ao viewer que apresente o objeto da posição atual
            this.#viewer.apresentar(this.#posAtual, conjSalas.length, new SalaDTO(conjSalas[this.#posAtual - 1]));
        }
    }

    //-----------------------------------------------------------------------------------------//

    async apresentarPrimeiro() {
        let conjSalas = await this.#dao.obterSalas();
        if (conjSalas.length > 0)
            this.#posAtual = 1;
        this.#atualizarContextoNavegacao();
    }

    //-----------------------------------------------------------------------------------------//

    async apresentarProximo() {
        let conjSalas = await this.#dao.obterSalas();
        if (this.#posAtual < conjSalas.length)
            this.#posAtual++;
        this.#atualizarContextoNavegacao();
    }

    //-----------------------------------------------------------------------------------------//

    async apresentarAnterior() {
        let conjSalas = await this.#dao.obterSalas();
        if (this.#posAtual > 1)
            this.#posAtual--;
        this.#atualizarContextoNavegacao();
    }

    //-----------------------------------------------------------------------------------------//

    async apresentarUltimo() {
        let conjSalas = await this.#dao.obterSalas();
        this.#posAtual = conjSalas.length;
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

    async incluir(cod, numSala, lugares) {
        if (this.#status == Status.INCLUINDO) {
            try {
                let sala = new Sala(cod, numSala, lugares);
                await this.#dao.incluir(sala);
                this.#status = Status.NAVEGANDO;
                this.#atualizarContextoNavegacao();
            }
            catch (e) {
                alert(e);
            }
        }
    }

    //-----------------------------------------------------------------------------------------//

    async alterar(cod, numSala, lugares) {
        if (this.#status == Status.ALTERANDO) {
            try {
                let sala = await this.#dao.obterSalaPeloCodigo(cod);
                if (sala == null) {
                    alert("Sala com código " + cod + " não encontrado.");
                } else {
                    sala.setnumSala(numSala);
                    sala.setLugares(lugares);
                    await this.#dao.alterar(sala);
                }
                this.#status = Status.NAVEGANDO;
                this.#atualizarContextoNavegacao();
            }
            catch (e) {
                alert(e);
            }
        }
    }

    //-----------------------------------------------------------------------------------------//

    async excluir(cod) {
        if (this.#status == Status.EXCLUINDO) {
            try {
                let sala = await this.#dao.obterSalaPeloCodigo(cod);
                if (sala == null) {
                    alert("Sala com código " + cod + " não encontrado.");
                } else {
                    await this.#dao.excluir(sala);
                }
                this.#status = Status.NAVEGANDO;
                this.#atualizarContextoNavegacao();
            }
            catch (e) {
                alert(e);
            }
        }
    }

    //-----------------------------------------------------------------------------------------//

    cancelar() {
        this.#atualizarContextoNavegacao();
    }

    //-----------------------------------------------------------------------------------------//

    terminar() {
        window.location = "../index.html";
    }

    //-----------------------------------------------------------------------------------------//

    getStatus() {
        return this.#status;
    }

    //-----------------------------------------------------------------------------------------//

}

//------------------------------------------------------------------------//