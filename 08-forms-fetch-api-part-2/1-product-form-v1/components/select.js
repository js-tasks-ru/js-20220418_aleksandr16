export default class Select {

  #name;
  #options;
  #value;

  #onSelect;
  #selectHandler;

  #element;

  constructor({
    name,
    options,
    value,
    onSelect = () => void 0
  }) {
    this.validateName(name);
    this.validateValue(value);
    this.#name = name;
    this.#value = value;
    this.#onSelect = onSelect;
    this.#options = options;
    this.#selectHandler = this.handleSelect.bind(this);

    this.#element = this.createElement();
    this.createOptionsElements();
    this.setHandlers();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('select');
    element.classList.add('form-control');
    element.setAttribute('name', this.#name);

    return element;
  }

  updateOptions(options) {
    this.#options = options;
    this.createOptionsElements();
  }

  updateValue(value) {
    this.validateValue(value);
    this.#value = value;
    this.refresh();
  }

  refresh() {
    this.#element.value = this.#value;
  }

  createOptionsElements() {
    if (!this.#element) {
      return;
    }

    const elements = this.#options.map(({ value, label }) => {
      const element = document.createElement('option');
      element.value = value;
      element.innerHTML = label;
      return element;
    });

    this.#element.innerHTML = '';
    this.#element.append(...elements);
  }

  setHandlers() {
    if (!this.#element) {
      return;
    }

    this.#element.addEventListener('change', this.#selectHandler);
  }

  remove() {
    if (!this.#element) {
      return;
    }

    this.#element.removeEventListener('change', this.#selectHandler);
    this.#element.remove();
  }

  destroy() {
    this.remove();
  }

  handleSelect(e) {
    this.#value = e.target.value;
    this.#onSelect(this.#value);
  }

  validateName(name) {
    if (!name) {
      throw new Error('Name was not provided');
    }
  }

  validateValue(value) {
    if (value && !this.#options.find(option => option.value === value)) {
      throw new Error('Value is not in allowed options');
    }
  }
}
