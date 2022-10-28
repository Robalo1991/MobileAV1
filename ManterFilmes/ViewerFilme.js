import Status from "./Status.js";
import FilmeDTO from "../Model/FilmeDTO.js";
import Viewer from "../Viewer.js";
import ViewerError from "../ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerFilme extends Viewer {

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

        this.tfReg = this.obterElemento('tfReg');
        this.tfCodFilme = this.obterElemento('tfCodFilme');
        this.tfTitulo = this.obterElemento('tfTitulo');
        this.tfDiretor = this.obterElemento('tfDiretor');
        this.tfDuracao = this.obterElemento('tfDuracao');
        this.cbSala = this.obterElemento('cbSala');

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

    preencherSalas(conjSalasDTO) {
        // Removendo as opções de sala
        while (this.cbSala.options.length > 0) {
            this.cbSala.remove(0);
        }
        // Preenchendo o select
        conjSalasDTO.forEach((t) => {
            var option = document.createElement("option");
            option.text = t.getNumSala();
            option.value = t.getCodigo();
            this.cbSala.add(option, this.cbSala[0]);
        });
    }

    //------------------------------------------------------------------------//

    apresentar(pos, qtde, filme) {

        this.configurarNavegacao(pos <= 1, pos == qtde);

        if (filme == null) {
            this.tfReg.value = "";
            this.tfCodFilme.value = "";
            this.tfTitulo.value = "";
            this.tfDiretor.value = "";
            this.tfDuracao.value = "";
            this.divAviso.innerHTML = " Número de Filmes: 0";
        } else {
            this.tfReg.value = filme.getReg();
            this.tfCodFilme.value = filme.getCodFilme();
            this.tfTitulo.value = filme.getTitulo();
            this.tfDiretor.value = filme.getDiretor();
            this.tfDuracao.value = filme.getDuracao();
            if (filme.getRegEmSala() != null)
                this.cbSala.value = filme.getRegEmSala().getCodigo();

            this.divAviso.innerHTML = "Posição: " + pos + " | Número de Filmes: " + qtde;
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
            this.tfCodFilme.disabled = false;
            this.tfTitulo.disabled = false;
            this.tfDiretor.disabled = false;
            this.tfDuracao.disabled = false;
            this.cbSala.disabled = false;
            this.divAviso.innerHTML = "";
        } else {
            this.divAviso.innerHTML = "Deseja excluir este registro?";
        }
        if (operacao == Status.INCLUINDO) {
            this.tfReg.disabled = false;
            this.cbSala.disabled = false;
            this.tfReg.value = "";
            this.tfCodFilme.value = "";
            this.tfTitulo.value = "";
            this.tfDiretor.value = "";
            this.tfDuracao.value = "";
        }
    }

    //------------------------------------------------------------------------//

    statusApresentacao() {
        this.tfCodFilme.disabled = true;
        this.divNavegar.hidden = false;
        this.divComandos.hidden = false;
        this.divDialogo.hidden = true;
        this.tfReg.disabled = true;
        this.tfCodFilme.disabled = true;
        this.tfTitulo.disabled = true;
        this.tfDiretor.disabled = true;
        this.tfDuracao.disabled = true;
        this.cbSala.disabled = true;
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
    const reg = this.viewer.tfReg.value;
    const codFilme = this.viewer.tfCodFilme.value;
    const titulo = this.viewer.tfTitulo.value;
    const diretor = this.viewer.tfDiretor.value;
    const duracao = this.viewer.tfDuracao.value;

    // Como defini que o método "efetivar" é um dos métodos incluir, excluir ou alterar
    // não estou precisando colocar os ninhos de IF abaixo.
    this.viewer.getCtrl().efetivar(reg, codFilme, titulo, diretor, duracao);

    // if(this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
    //  this.viewer.getCtrl().fnEfetivar(reg, codFilme, titulo, diretor, duracao); 
    //} else if(this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
    //  this.viewer.getCtrl().alterar(reg, codFilme, titulo, diretor, duracao); 
    //} else if(this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
    //  this.viewer.getCtrl().excluir(reg, codFilme, titulo, diretor, duracao); 
    //}
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







