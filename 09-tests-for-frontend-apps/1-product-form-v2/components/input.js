export const InputType = {
  TEXT: 'text',
  NUMBER: 'number',
  HIDDEN: 'hidden'
};

export default class Input {
  #type;
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
    type = InputType.TEXT,
    name,
    required = false,
    onInput = () => void 0,
    onChange = () => void 0,
    value = '',
    placeholder = '',
  }) {
    this.validateType(type);
    this.validateName(name);
    this.validateRequired(required);

    this.#type = type;
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

  get value() {
    return this.#value;
  }

  updateValue(value) {
    this.#value = value;
    this.refresh();
  }

  refresh() {
    this.#element.value = this.#value;
  }

  createElement() {
    const element = document.createElement('input');
    element.setAttribute('type', this.#type);
    element.setAttribute('placeholder', this.#placeholder);
    element.setAttribute('name', this.#name);
    element.setAttribute('value', this.#value);
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

  handleInput(e) {
    this.#value = e.target.value;
    this.#onInput(e);
  }

  handleChange(e) {
    this.#value = e.target.value;
    this.#onChange(e);
  }

  validateType(type) {
    if (!Object.values(InputType).includes(type)) {
      throw new Error('Invalid type provided');
    }
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
