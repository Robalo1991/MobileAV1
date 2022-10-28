"use strict";

import Ctrl from "../Ctrl.js";
import Status from "./Status.js";
import Filme from "../Model/Filme.js";
import FilmeDTO from "../Model/FilmeDTO.js";
import DaoFilme from "../Model/DaoFilme.js";
import DaoSala from "../Model/DaoSala.js";
import ViewerFilme from "./ViewerFilme.js";

export default class CtrlManterFilmes extends Ctrl {

    //-----------------------------------------------------------------------------------------//

    //
    // Atributos do Controlador
    //
    #dao;      // Referência para o Data Access Object para o Store de Filmes
    #daoSala; // Referência para o Data Access Object para o Store de Salas
    #viewer;   // Referência para o gerenciador do viewer 
    #posAtual; // Indica a posição do objeto Filme que estiver sendo apresentado
    #status;   // Indica o que o controlador está fazendo 

    //-----------------------------------------------------------------------------------------//

    constructor() {
        super();
        this.#dao = new DaoFilme();
        this.#daoSala = new DaoSala();
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

        // Informa quais são as opções de sala
        this.#viewer.preencherSalas(await this.#daoSala.obterSalas());

        // Solicita ao DAO que dê a lista de todos os filmes presentes na base
        let conjFilmes = await this.#dao.obterFilmes();

        // Se a lista de filmes estiver vazia
        if (conjFilmes.length == 0) {
            // Posição Atual igual a zero indica que não há objetos na base
            this.#posAtual = 0;

            // Informo ao viewer que não deve apresentar nada
            this.#viewer.apresentar(0, 0, null);
        }
        else {
            // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
            if (this.#posAtual == 0 || this.#posAtual > conjFilmes.length)
                this.#posAtual = 1;
            // Peço ao viewer que apresente o objeto da posição atual
            this.#viewer.apresentar(this.#posAtual, conjFilmes.length, new FilmeDTO(conjFilmes[this.#posAtual - 1]));
        }
    }

    //-----------------------------------------------------------------------------------------//

    async apresentarPrimeiro() {
        let conjFilmes = await this.#dao.obterFilmes();
        if (conjFilmes.length > 0)
            this.#posAtual = 1;
        this.#atualizarContextoNavegacao();
    }

    //-----------------------------------------------------------------------------------------//

    async apresentarProximo() {
        let conjFilmes = await this.#dao.obterFilmes();
        if (this.#posAtual < conjFilmes.length)
            this.#posAtual++;
        this.#atualizarContextoNavegacao();
    }

    //-----------------------------------------------------------------------------------------//

    async apresentarAnterior() {
        let conjFilmes = await this.#dao.obterFilmes();
        if (this.#posAtual > 1)
            this.#posAtual--;
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

    async incluir(reg, codFilme, titulo, diretor, duracao) {
        if (this.#status == Status.INCLUINDO) {
            try {
                let filme = new Filme(reg, codFilme, titulo, diretor, duracao);
                await this.#dao.incluir(filme);
                this.#status = Status.NAVEGANDO;
                this.#atualizarContextoNavegacao();
            }
            catch (e) {
                alert(e);
            }
        }
    }

    //-----------------------------------------------------------------------------------------//

    async alterar(reg, codFilme, titulo, diretor, duracao) {
        if (this.#status == Status.ALTERANDO) {
            try {
                let filme = await this.#dao.obterFilmePelaReg(reg);
                if (filme == null) {
                    alert("Filme com a regícula " + reg + " não encontrado.");
                } else {
                    filme.setCodFilmes(codFilme);
                    filme.setTitulo(titulo);
                    filme.setDiretor(diretor);
                    filme.setDuracao(duracao);
                    await this.#dao.alterar(filme);
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

    async excluir(reg) {
        if (this.#status == Status.EXCLUINDO) {
            try {
                let filme = await this.#dao.obterFilmePelaReg(reg);
                if (filme == null) {
                    alert("Filme com o registro" + reg + " não encontrado.");
                } else {
                    await this.#dao.excluir(filme);
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
