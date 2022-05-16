import EventObserver from "../../lib/event-observer.js";
import Header from "./components/header/header.js";
import {stringComparator} from "./utils/string.comparator.js";
import {numberComparator} from "./utils/number.comparator.js";
import Row from "./components/row.js";

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc'
};

export const SortType = {
  NUMBER: 'number',
  STRING: 'string',
};

export default class SortableTable {
  static #comparators = {
    [SortType.STRING]: stringComparator,
    [SortType.NUMBER]: numberComparator
  };

  #sort;
  #header;
  #body;
  #data;
  #config;

  #isSortLocally;

  #sortObserver = new EventObserver();

  #element;

  constructor(headerConfig = [], {
    data = [],
    sorted = {}
  } = {}, isSortLocally = true) {
    this.#data = data;
    this.#config = this.getConfig(headerConfig);
    this.#isSortLocally = isSortLocally;

    this.#header = new Header(headerConfig, {
      onClick: this.sort.bind(this)
    });

    this.setSortObservers();

    this.#element = this.createElement();

    if (sorted) {
      this.sort(sorted.id, sorted.order);
    }
  }

  get element() {
    return this.#element;
  }

  get subElements() {
    return {
      body: this.#body,
      header: this.#header
    };
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('sortable-table');

    element.append(this.#header.element);

    this.#body = document.createElement('div');
    this.#body.classList.add('sortable-table__body');
    this.#body.setAttribute('data-element', 'body');

    this.#body.append(...this.createRows().map(row => row.element));

    element.append(this.#body);

    return element;
  }

  sort(id, direction) {
    if (this.#isSortLocally) {
      this.localSort(id, direction);
    }
  }

  localSort(id, direction) {
    this.#sort = {
      type: this.#config[id]?.sortType ?? SortType.STRING,
      id,
      direction
    };

    this.#sortObserver.notify(this.#sort);
  }

  destroy() {
    this.remove();
    this.#element = null;
    this.#sortObserver.clear();
    this.#header.destroy();
  }

  remove() {
    if (!this.#element) {
      return;
    }
    this.#element.remove();
  }

  setSortObservers() {
    this.#sortObserver.subscribe((sort = null) => {
      this.#header.updateSort(sort);
      this.#body.innerHTML = '';
      if (!sort) {
        this.#body.append(...this.createRows().map(row => row.element));
        return;
      }

      const comparator = this.getComparator();
      if (!comparator) {
        throw new Error('sort was not provided');
      }

      const data = [...this.#data];
      data.sort((rowA, rowB) => comparator(rowA[sort.id], rowB[sort.id]));

      this.#body.append(...this.createRows(data).map(row => row.element));
    });
  }

  getConfig(headerConfig) {
    this.validateConfig(headerConfig);
    return headerConfig.reduce((config, item) => {
      const { id, ...rest } = item;
      config[id] = rest;
      return config;
    }, {});
  }

  getComparator() {
    if (!this.#sort) {
      return;
    }
    return SortableTable.#comparators[this.#sort.type](this.#sort.direction);
  }

  validateConfig(headerConfig) {
    if (!headerConfig.every((item) => !!item.id)) {
      throw new Error('Each column must have an id field');
    }

    if (!headerConfig.reduce((isValid, item) => {
      if (!('sortType' in item)) {
        return isValid;
      }

      if (!Object.values(SortType).includes(item.sortType)) {
        isValid = false;
      }

      return isValid;
    }, true)) {
      throw new Error('Invalid sortType provided');
    }
  }

  createRows(data = null) {
    return (data ?? this.#data).map((row) => {
      const cells = this.getRowData(row);
      return new Row(cells);
    });
  }

  getRowData(row) {
    return Object.keys(this.#config)
      .filter(id => !!this.#config[id])
      .reduce((resultRow, id) => {
        resultRow[id] = {
          id,
          value: row[id],
          template: this.#config[id].template
        };

        return resultRow;
      }, {});
  }
}

