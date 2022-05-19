export default class EmptyPlaceholder {
  #element;
  #onReset;

  #handleReset;

  #button;

  constructor(onReset = () => void 0) {
    this.#onReset = onReset;

    this.#element = this.createElement();
    this.#handleReset = this.handleReset.bind(this);
    this.setEventListeners();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('sortable-table__empty-placeholder');
    element.dataset.element = 'emptyPlaceholder';

    const div = document.createElement('div');
    const p = document.createElement('p');
    p.innerHTML = 'No products satisfies your filter criteria';
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('button-primary-outline');
    button.innerHTML = 'Reset all filters';

    this.#button = button;

    div.append(p, button);
    element.append(div);

    return element;
  }

  setEventListeners() {
    this.#button.addEventListener('click', this.#handleReset);
  }

  handleReset() {
    this.#onReset();
  }

  remove() {
    if (!this.#element) {
      return;
    }

    this.#element.remove();
  }
}
