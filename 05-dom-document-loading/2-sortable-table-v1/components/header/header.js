import HeaderCell from "./header-cell.js";

export default class Header {
  #cells;
  #element;

  constructor(columns = []) {
    this.#cells = columns.map(Header.mapConfigToCell);
    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('div');
    element.setAttribute('data-element', 'header');
    element.classList.add('sortable-table__header');
    element.classList.add('sortable-table__row');

    element.append(...this.#cells.map(cell => cell.element));

    return element;
  }

  updateSort(sort = null) {
    this.resetSort();
    if (!sort) {
      return;
    }

    const cell = this.#cells.find(cell => cell.id === sort.id);

    if (!cell) {
      return;
    }

    cell.update(true, sort.direction);
  }

  resetSort() {
    const sortedColumn = this.#cells.find(cell => cell.sorted);

    if (!sortedColumn) {
      return;
    }

    sortedColumn.update(false);
  }

  static mapConfigToCell(config) {
    const { title, id, sortable } = config;
    return new HeaderCell({ title, id, sortable });
  }
}
