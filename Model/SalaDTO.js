import ModelError from "./ModelError.js";

export default class SalaDTO {

    #codigo;
    #numSala;
    #lugares;

    //-----------------------------------------------------------------------------------------//

    constructor(sala) {
        this.#codigo = sala.getCodigo();
        this.#numSala = sala.getNumSala();
        this.#lugares = sala.getLugares();
    }

    //-----------------------------------------------------------------------------------------//

    getCodigo() {
        return this.#codigo;
    }

    //-----------------------------------------------------------------------------------------//

    getNumSala() {
        return this.#numSala;
    }

    //-----------------------------------------------------------------------------------------//

    getLugares() {
        return this.#lugares;
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
}