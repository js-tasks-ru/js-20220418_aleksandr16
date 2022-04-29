import Link from "./link.js";

export default class Title {
  #title;
  #link;
  #element;

  constructor({ title, link }) {
    this.#link = link;
    this.#title = title;

    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const titleBlock = document.createElement('div');
    titleBlock.classList.add('column-chart__title');

    titleBlock.innerHTML = this.#title;
    if (this.#link) {
      const link = new Link(this.#link);
      titleBlock.append(link.element);
    }

    return titleBlock;
  }
}
