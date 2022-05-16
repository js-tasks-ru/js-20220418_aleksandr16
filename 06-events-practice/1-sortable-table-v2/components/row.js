import Cell from "./cell.js";

export default class Row {
  #cells;

  #element;
  #link;

  constructor(cells = {}, link = '#') {
    this.#link = link;
    this.#cells = cells;

    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createCellsComponent(cells) {
    return Object.keys(cells).map((id) => new Cell(cells[id]));
  }

  createElement() {
    const element = document.createElement('a');
    element.classList.add('sortable-table__row');
    element.setAttribute('href', this.#link);

    const cells = this.createCellsComponent(this.#cells).map(cell => cell.element);

    element.append(...cells);

    return element;
  }
}
