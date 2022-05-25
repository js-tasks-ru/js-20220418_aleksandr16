export default class MonthIndicator {
  #name;

  #element;

  constructor(name) {
    this.createElement();
    this.update(name);
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const monthIndicator = document.createElement('div');
    monthIndicator.classList.add('rangepicker__month-indicator');

    this.#element = monthIndicator;
  }

  update(name) {
    this.#name = name;
    this.#element.innerHTML = `<time datetime="${this.#name}">${this.#name}</time>`;
  }
}
