import HeaderCell from "./header-cell.js";
import {SortDirection} from "../../index.js";

export default class Header {
  #cells;
  #element;
  #onClick;
  #handleChangeSort

  constructor(columns = [], {
    onClick
  }) {
    this.#cells = columns.map(Header.mapConfigToCell);
    this.#element = this.createElement();
    this.#onClick = onClick.bind(this);
    this.#handleChangeSort = this.handleChangeSort.bind(this);

    this.setListener();
  }

  get element() {
    return this.#element;
  }

  get children() {
    return this.#cells.map(cell => cell.element);
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

  setListener() {
    if (!this.#element) {
      return;
    }

    this.#element.addEventListener('pointerdown', this.#handleChangeSort);
  }

  handleChangeSort(event) {
    const cell = event.target.closest('[data-id]');
    const { id, order, sortable } = cell.dataset;
    if (!sortable || sortable === 'false') {
      return;
    }

    this.#onClick(id, !order || order === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);
  }

  static mapConfigToCell(config) {
    const { title, id, sortable } = config;
    return new HeaderCell({ title, id, sortable });
  }

  destroy() {
    this.#element.removeEventListener('pointerdown', this.#handleChangeSort);
  }
}
