export default class Header {
  #value;
  #formatter;
  #element;

  constructor(value, formatter = null) {
    this.#value = value;
    this.#formatter = formatter;
    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const header = document.createElement('div');
    header.classList.add("column-chart__header");
    header.setAttribute('data-element', 'header');
    header.innerHTML = this.getValueFormatted();

    return header;
  }

  getValueFormatted() {
    if (!this.#value) {
      return '';
    }

    return this.#formatter ? this.#formatter(this.#value) : this.#value;
  }
}
