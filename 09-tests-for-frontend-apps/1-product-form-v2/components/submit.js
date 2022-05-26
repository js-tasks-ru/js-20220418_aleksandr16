export default class Submit {
  #label;

  #element;

  constructor({
    label,
  }) {
    this.#label = label;
    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('button');
    element.innerHTML = this.#label;
    element.classList.add('"button-primary-outline"');
    element.name = 'save';
    element.type = 'submit';

    return element;
  }
}
