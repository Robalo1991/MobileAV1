export default class Viewer {
  
  #ctrl;
  
  //-----------------------------------------------------------------------------------------//
  
  constructor(ctrl) {
    this.#ctrl = ctrl;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  getCtrl() { 
    return this.#ctrl;
  }

  //-----------------------------------------------------------------------------------------//
  
  setCtrl(ctrl) { 
    this.#ctrl = ctrl;
  }

  //-----------------------------------------------------------------------------------------//

}