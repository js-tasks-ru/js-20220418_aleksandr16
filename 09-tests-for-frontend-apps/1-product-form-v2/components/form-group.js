export default class FormGroup {
  #children;

  #classNames;
  #attributes;

  #element;

  constructor({
    classNames = [] ,
    children = [],
    attributes = {}
  }) {
    this.#children = children;
    this.#classNames = classNames;
    this.#attributes = attributes;

    this.#element = this.createElement();
    this.injectChildren();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('form-group');
    if (this.#classNames) {
      element.classList.add(...this.#classNames);
    }

    Object.entries(this.#attributes).forEach(([attr, value]) => {
      element.dataset[attr] = String(value);
    });

    return element;
  }

  injectChildren() {
    if (!this.#element) {
      return;
    }

    this.#element.innerHTML = '';
    this.#element.append(...this.#children);
  }
}
