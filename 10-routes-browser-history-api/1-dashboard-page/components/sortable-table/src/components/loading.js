export default class Loading {
  #element;

  constructor() {
    this.#element = this.createElement();
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('loading-line');
    element.classList.add('sortable-table__loading-line');
    element.dataset.element = 'Loading';

    return element;
  }

  get element() {
    return this.#element;
  }

  destroy() {
    this.remove();
    this.#element = null;
  }

  remove() {
    if (!this.#element) {
      return;
    }

    this.#element.remove();
  }

}
