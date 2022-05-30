export default class Header {
  #value;
  #formatter;
  #element;

  constructor(value, formatter = null) {
    this.#formatter = formatter;
    this.#element = this.createElement();

    this.update(value);
  }

  get element() {
    return this.#element;
  }

  update(value) {
    this.#value = value;
    this.#element.innerHTML = this.getValueFormatted();
  }

  createElement() {
    const header = document.createElement('div');
    header.classList.add("column-chart__header");
    header.setAttribute('data-element', 'header');


    return header;
  }

  getValueFormatted() {
    if (!this.#value) {
      return '';
    }

    if (!this.#formatter || typeof this.#formatter !== 'function') {
      return this.#value;
    }

    return this.#formatter(this.#value);
  }
}
