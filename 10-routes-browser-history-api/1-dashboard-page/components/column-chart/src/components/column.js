export default class Column {
  #value;
  #tooltip;
  #element;

  constructor(value, tooltip) {
    this.#value = value;
    this.#tooltip = tooltip;
    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const column = document.createElement('div');
    column.style.setProperty('--value', String(this.#value));
    column.setAttribute('data-tooltip', `${this.#tooltip}`);
    return column;
  }
}
