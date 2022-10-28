import ModelError from "./ModelError.js";
import Filme from "./Filme.js";

export default class FilmeDTO {

    //-----------------------------------------------------------------------------------------//

    #reg;
    #codFilme;
    #titulo;
    #diretor;
    #duracao;

    #regEmSala;

    constructor(filme) {
        this.#reg = filme.getReg();
        this.#codFilme = filme.getCodFilme();
        this.#titulo = filme.getTitulo();
        this.#diretor = filme.getDiretor();
        this.#duracao = filme.getDuracao();
        this.#regEmSala = filme.getRegEmSala();
    }

    //-----------------------------------------------------------------------------------------//

    getReg() {
        return this.#reg;
    }

    //-----------------------------------------------------------------------------------------//

    getCodFilme() {
        return this.#codFilme;
    }

    //-----------------------------------------------------------------------------------------//

    getTitulo() {
        return this.#titulo;
    }

    //-----------------------------------------------------------------------------------------//

    getDiretor() {
        return this.#diretor;
    }

    //-----------------------------------------------------------------------------------------//

    getDuracao() {
        return this.#duracao;
    }

    //-----------------------------------------------------------------------------------------//

    getRegEmSala() {
        return this.#regEmSala;
    }

    //-----------------------------------------------------------------------------------------//

    toJSON() {
        return '{ ' +
            '"reg" : "' + this.#reg + '",'
        '"codFilme" : "' + this.#codFilme + '",'
        '"titulo" : "' + this.#titulo + '",'
        '"diretor" : "' + this.#diretor + '",'
        '"duracao" : "' + this.#duracao + '",'
        '"regEmSala: "' + this.#regEmSala.toJSON() +
            '}';
    }
}