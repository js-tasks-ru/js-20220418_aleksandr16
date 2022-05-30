export default class Link {
  #link;
  #label;
  #element;

  constructor(link = '#', label = 'Подробнее') {
    this.#link = link;
    this.#label = label;
    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const link = document.createElement('a');
    link.innerText = this.#label;
    link.classList.add('column-chart__link');
    link.setAttribute('href', this.#link);

    return link;
  }
}
