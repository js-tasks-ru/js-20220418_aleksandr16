export default class Textarea {
  #name;
  #required;
  #value;
  #placeholder;

  #onInput;
  #onChange;

  #inputHandler;
  #changeHandler;

  #element;

  constructor({
    name,
    required = false,
    onInput = () => void 0,
    onChange = () => void 0,
    value = '',
    placeholder = '',
  }) {
    this.validateName(name);
    this.validateRequired(required);

    this.#name = name;
    this.#required = required;
    this.#value = value;
    this.#placeholder = placeholder;

    this.#onInput = onInput;
    this.#onChange = onChange;

    this.#inputHandler = this.handleInput.bind(this);
    this.#changeHandler = this.handleChange.bind(this);

    this.#element = this.createElement();
    this.setListeners();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('textarea');
    element.setAttribute('placeholder', this.#placeholder);
    element.setAttribute('name', this.#name);
    element.setAttribute('required', this.#required);
    element.classList.add('form-control');

    return element;
  }

  setListeners() {
    if (!this.#element) {
      return;
    }

    this.#element.addEventListener('input', this.#inputHandler);
    this.#element.addEventListener('change', this.#changeHandler);
  }

  removeListeners() {
    if (!this.#element) {
      return;
    }

    this.#element.removeEventListener('input', this.#inputHandler);
    this.#element.removeEventListener('change', this.#changeHandler);
  }

  get value() {
    return this.#value;
  }

  destroy() {
    this.removeListeners();
    this.remove();
  }

  remove() {
    if (!this.#element) {
      return;
    }

    this.#element.remove();
  }

  updateValue(value) {
    this.#value = value;
    this.refresh();
  }

  refresh() {
    this.#element.value = this.#value;
  }

  handleInput(e) {
    this.#value = e.target.value;
    this.#onInput(e);
  }

  handleChange(e) {
    this.#value = e.target.value;
    this.#onChange(e);
  }

  validateName(name) {
    if (!name) {
      throw new Error('Invalid name provided');
    }
  }

  validateRequired(required) {
    if (typeof required !== 'boolean') {
      throw new Error('Invalid required prop provided');
    }
  }
}
