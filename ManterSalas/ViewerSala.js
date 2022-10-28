import Status from "./Status.js";
import SalaDTO from "../Model/SalaDTO.js";
import Viewer from "../Viewer.js";
import ViewerError from "../ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerSala extends Viewer {

    constructor(ctrl) {
        super(ctrl);
        this.divNavegar = this.obterElemento('divNavegar');
        this.divComandos = this.obterElemento('divComandos');
        this.divAviso = this.obterElemento('divAviso');
        this.divDialogo = this.obterElemento('divDialogo');

        this.btPrimeiro = this.obterElemento('btPrimeiro');
        this.btAnterior = this.obterElemento('btAnterior');
        this.btProximo = this.obterElemento('btProximo');
        this.btUltimo = this.obterElemento('btUltimo');

        this.btIncluir = this.obterElemento('btIncluir');
        this.btExcluir = this.obterElemento('btExcluir');
        this.btAlterar = this.obterElemento('btAlterar');
        this.btSair = this.obterElemento('btSair');

        this.btOk = this.obterElemento('btOk');
        this.btCancelar = this.obterElemento('btCancelar');

        this.tfCodigo = this.obterElemento('tfCodigo');
        this.tfNumSala = this.obterElemento('tfNumSala');
        this.tfLugares = this.obterElemento('tfLugares');

        this.btPrimeiro.onclick = fnBtPrimeiro;
        this.btProximo.onclick = fnBtProximo;
        this.btAnterior.onclick = fnBtAnterior;
        this.btUltimo.onclick = fnBtUltimo;

        this.btIncluir.onclick = fnBtIncluir;
        this.btAlterar.onclick = fnBtAlterar;
        this.btExcluir.onclick = fnBtExcluir;
        this.btSair.onclick = fnBtSair;

        this.btOk.onclick = fnBtOk;
        this.btCancelar.onclick = fnBtCancelar;
    }

    //------------------------------------------------------------------------//

    obterElemento(idElemento) {
        let elemento = document.getElementById(idElemento);
        if (elemento == null)
            throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
        // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
        // que o elemento guarde a referência para o objeto Viewer que o contém.
        elemento.viewer = this;
        return elemento;
    }

    //------------------------------------------------------------------------//

    apresentar(pos, qtde, sala) {

        this.configurarNavegacao(pos <= 1, pos == qtde);

        if (sala == null) {
            this.tfCodigo.value = "";
            this.tfNumSala.value = "";
            this.tfLugares.value = "";
            this.divAviso.innerHTML = " Número de Salas: 0";
        } else {
            this.tfCodigo.value = sala.getCodigo();
            this.tfNumSala.value = sala.getNumSala();
            this.tfLugares.value = sala.getLugares();
            this.divAviso.innerHTML = "Posição: " + pos + " | Número de Salas: " + qtde;
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
        this.divNavegar.hidden = true;
        this.divComandos.hidden = true;
        this.divDialogo.hidden = false;

        if (operacao != Status.EXCLUINDO) {
            this.tfNumSala.disabled = false;
            this.tfLugares.disabled = false;
            this.divAviso.innerHTML = "";
        } else {
            this.divAviso.innerHTML = "Deseja excluir este registro?";
        }
        if (operacao == Status.INCLUINDO) {
            this.tfCodigo.disabled = false;
            this.tfCodigo.value = "";
            this.tfNumSala.value = "";
            this.tfLugares.value = "";
        }
    }

    //------------------------------------------------------------------------//

    statusApresentacao() {
        this.tfCodigo.disabled = true;
        this.divNavegar.hidden = false;
        this.divComandos.hidden = false;
        this.divDialogo.hidden = true;
        this.tfNumSala.disabled = true;
        this.tfLugares.disabled = true;
    }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
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
    const horario = this.viewer.tfNumSala.value;
    const disciplina = this.viewer.tfLugares.value;

    // Como defini que o método "efetivar" é um dos métodos incluir, excluir ou alterar
    // não estou precisando colocar os ninhos de IF abaixo.
    this.viewer.getCtrl().efetivar(codigo, horario, disciplina);
}

//------------------------------------------------------------------------//

function fnBtCancelar() {
    this.viewer.getCtrl().cancelar();
}

//------------------------------------------------------------------------//

function fnBtSair() {
    this.viewer.getCtrl().terminar();
}

//------------------------------------------------------------------------//
