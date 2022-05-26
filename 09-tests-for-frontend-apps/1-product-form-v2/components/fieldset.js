import Label from "./label.js";

export default class Fieldset {
  #label;
  #control;

  #element;

  constructor(label, control) {
    this.#label = label;
    this.#control = control;

    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('fieldset');
    const label = new Label(this.#label);

    element.append(label.element, this.#control.element);

    return element;
  }
}
