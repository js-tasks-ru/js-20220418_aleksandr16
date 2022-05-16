export default class SliderLabel {
  #value;
  #boundary;
  #formatValue;

  #element;

  constructor(value, formatValue, boundary) {
    this.#boundary = boundary;
    this.#formatValue = formatValue;
    this.#element = this.createElement();
    this.update(value);
  }

  get element() {
    return this.#element;
  }

  get value() {
    return this.#value;
  }

  get formattedValue() {
    return this.#formatValue(this.#value);
  }

  createElement() {
    const element = document.createElement('span');
    element.dataset.element = this.#boundary;

    return element;
  }

  update(value) {
    this.#value = value;

    if (this.#element) {
      this.#element.innerHTML = this.#formatValue(this.#value);
    }
  }

  destroy() {
    if (!this.#element) {
      return;
    }

    this.#element.remove();
    this.#element = null;
  }
}
