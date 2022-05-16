export default class SliderProgressBar {
  #from;
  #to;

  #element;

  constructor(from, to) {
    this.#element = this.createElement();
    this.update({ from, to });
  }

  get element() {
    return this.#element;
  }

  update({ from, to }) {
    this.#from = typeof from !== 'undefined' ? from : this.#from;
    this.#to = typeof to !== 'undefined' ? to : this.#to;

    this.setPercentage();
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('range-slider__progress');

    return element;
  }

  setPercentage() {
    if (!this.#element) {
      return;
    }

    this.#element.style.left = this.#from + '%';
    this.#element.style.right = (100 - this.#to) + '%';
  }

  destroy() {
    if (!this.#element) {
      return;
    }

    this.#element.remove();
    this.#element = null;
  }
}
