export default class Label {
  #label;

  #element;

  constructor(label) {
    this.#label = label;
    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('label');
    element.classList.add('form-label');
    element.innerHTML = this.#label;

    return element;
  }
}
