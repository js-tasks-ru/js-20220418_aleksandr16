export default class Column {
  #value;
  #percent;
  #element;

  constructor(value, percent) {
    this.#percent = percent;
    this.#value = value;
    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const column = document.createElement('div');
    column.style.setProperty('--value', String(this.#value));
    column.setAttribute('data-tooltip', `${this.#percent}%`);
    return column;
  }
}
