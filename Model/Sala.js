import ModelError from "./ModelError.js";

export default class Sala {

    #codigo;
    #numSala;
    #lugares;

    //-----------------------------------------------------------------------------------------//

    constructor(cod, numSala, lugares, diretor, duracao) {
        this.setCodigo(cod);
        this.setNumSala(numSala);
        this.setLugares(lugares);


    }

    //-----------------------------------------------------------------------------------------//

    getCodigo() {
        return this.#codigo;
    }

    //-----------------------------------------------------------------------------------------//

    setCodigo(cod) {
        if (!Sala.validarCodigo(cod))
            throw new ModelError("Código Inválido: " + cod);
        this.#codigo = cod;
    }

    //-----------------------------------------------------------------------------------------//

    getNumSala() {
        return this.#numSala;
    }

    //-----------------------------------------------------------------------------------------//

    setNumSala(numSala) {
        if (!Sala.validarNumSala(numSala))
            throw new ModelError("Número de Sala Inválido: " + numSala);
        this.#numSala = numSala;
    }

    //-----------------------------------------------------------------------------------------//

    getLugares() {
        return this.#lugares;
    }

    //-----------------------------------------------------------------------------------------//

    setLugares(lugares) {
        if (!Sala.validarLugares(lugares))
            throw new ModelError("Lugares Inválido: " + lugares);
        this.#lugares = lugares;
    }

    //-----------------------------------------------------------------------------------------//

    static validarCodigo(cod) {
        if (cod == null || cod == "" || cod == undefined)
            return false;


        return true;
    }

    //-----------------------------------------------------------------------------------------//

    static validarNumSala(cod) {
        if (cod == null || cod == "" || cod == undefined)
            return false;


        return true;
    }

    //-----------------------------------------------------------------------------------------//

    static validarLugares(lugares) {
        if (lugares == null || lugares == "" || lugares == undefined)
            return false;


        return true;
    }

    //-----------------------------------------------------------------------------------------//

    toJSON() {
        return '{' +
            '"codigo" : "' + this.#codigo + '",' +
            '"numSala" : "' + this.#numSala + '",' +
            '"lugares" : "' + this.#lugares + '"' +
            '}';

    }

    //-----------------------------------------------------------------------------------------//

    static parseJSON(str) {
        try {
            obj = JSON.parse(str);
            return new Sala(obj.codigo, obj.numSala, obj.lugares);
        }
        catch (e) {
            throw new ModelError("Não foi possível gerar um objeto Sala a partir do JSON: " + str);
        }
    }
}