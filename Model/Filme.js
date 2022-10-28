import ModelError from "./ModelError.js";

export default class Filme {

    #reg;
    #codFilme;
    #titulo;
    #diretor;
    #duracao;

    #regEmSala;

    //-----------------------------------------------------------------------------------------//

    constructor(reg, codFilme, titulo, diretor, duracao, regEmSala) {
        this.setReg(reg);
        this.setCodFilme(codFilme);
        this.setTitulo(titulo);
        this.setDiretor(diretor);
        this.setDuracao(duracao);
        this.setRegEmSala(regEmSala);
    }

    //-----------------------------------------------------------------------------------------//

    getReg() {
        return this.#reg;
    }

    //-----------------------------------------------------------------------------------------//

    setReg(reg) {
        if (!Filme.validarReg(reg))
            throw new ModelError("Registro Inválido: " + reg);
        this.#reg = reg;
    }

    //-----------------------------------------------------------------------------------------//

    getCodFilme() {
        return this.#codFilme;
    }

    //-----------------------------------------------------------------------------------------//

    setCodFilme(codFilme) {
        if (!Filme.validarCodFilme(codFilme))
            throw new ModelError("Cod de Filme Inválido: " + codFilme);
        this.#codFilme = codFilme;
    }

    //-----------------------------------------------------------------------------------------//

    getTitulo() {
        return this.#titulo;
    }

    //-----------------------------------------------------------------------------------------//

    setTitulo(titulo) {
        if (!Filme.validarTitulo(titulo))
            throw new ModelError("Titulo Inválido: " + titulo);
        this.#titulo = titulo;
    }

    //-----------------------------------------------------------------------------------------//

    getDiretor() {
        return this.#diretor;
    }

    //-----------------------------------------------------------------------------------------//

    setDiretor(diretor) {
        if (!Filme.validarDiretor(diretor))
            throw new ModelError("Diretor inválido: " + diretor);
        this.#diretor = diretor;
    }

    //-----------------------------------------------------------------------------------------//

    getDuracao() {
        return this.#duracao;
    }

    //-----------------------------------------------------------------------------------------//

    setDuracao(duracao) {
        if (!Filme.validarDuracao(duracao))
            throw new ModelError("Duracao inválida: " + duracao);
        this.#duracao = duracao;
    }

    //-----------------------------------------------------------------------------------------//

    getRegEmSala() {
        return this.#regEmSala;
    }

    //-----------------------------------------------------------------------------------------//

    setRegEmSala(regEmSala) {
        if (!Filme.validarRegEmSala(regEmSala))
            throw new ModelError("O código do filme é inválida: " + regEmSala);
        this.#regEmSala = regEmSala;
    }

    //-----------------------------------------------------------------------------------------//

    static validarReg(reg) {

        return true;
    }

    //-----------------------------------------------------------------------------------------//

    static validarCodFilme(strCodFilme) {



        return true;
    }

    //-----------------------------------------------------------------------------------------//

    static validarTitulo(titulo) {
        if (titulo == null || titulo == "" || titulo == undefined)
            return false;

            
        return true;
    }

    //-----------------------------------------------------------------------------------------//

    static validarDiretor(diretor) {
        if (diretor == null || diretor == "" || diretor == undefined)
            return false;

        return true;
    }

    //-----------------------------------------------------------------------------------------//

    static validarDuracao(duracao) {
        if (duracao == null || duracao == "" || duracao == undefined)
            return false;


        return true;
    }

    //-----------------------------------------------------------------------------------------//

    static validarRegEmSala(regEmSala) {

        return true;
    }

    //-----------------------------------------------------------------------------------------//

    toJSON() {
        return '{' +
            '"reg" : "' + this.#reg + '",' +
            '"codFilme" : "' + this.#codFilme + '",' +
            '"titulo" : "' + this.#titulo + '",' +
            '"diretor" : "' + this.#diretor + '",' +
            '"duracao" : "' + this.#duracao + '"' +
            '}';

    }

    //-----------------------------------------------------------------------------------------//

    static parseJSON(str) {
        try {
            obj = JSON.parse(str);
            return new Filme(obj.reg, obj.codFilme, obj.titulo, obj.diretor, obj.duracao);
        }
        catch (e) {
            throw new ModelError("Não foi possível gerar um objeto Filme a partir do JSON: " + str);
        }
    }
}