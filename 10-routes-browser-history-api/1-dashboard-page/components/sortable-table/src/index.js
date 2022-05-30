import Header from "./components/header/header.js";
import Row from "./components/row.js";
import DataProviderFactory from "./lib/data.provider.factory.js";
import Loading from "./components/loading.js";
import EmptyPlaceholder from "./components/empty-placeholder.js";
import ConfigManager from "./lib/config.manager.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc'
};

export const TableDataMode = {
  LOCAL: 'local',
  REMOTE: 'remote'
};

export default class SortableTable {
  static PAGE_SIZE = 30;

  #sort;
  #header;
  #body;
  #data;

  #configManager;
  #url;

  #dataProvider;

  #pageSize;
  #currentPage;

  #isSortLocally;

  #isLoading;

  #intersectionObserver;

  #element;
  #loading;
  #placeholder;

  constructor(headerConfig = [], {
    url,
    pageSize,
    data = [],
    sorted = {}
  } = {}, isSortLocally = false) {
    this.#data = data;

    this.#url = url;

    this.#configManager = new ConfigManager(headerConfig);
    this.#isSortLocally = isSortLocally;

    const factory = new DataProviderFactory(this.#url, this.#data);
    this.#dataProvider = factory.createProvider((data.length || !url) ? TableDataMode.LOCAL : TableDataMode.REMOTE);

    this.#pageSize = pageSize ?? SortableTable.PAGE_SIZE;
    this.#currentPage = 1;

    this.#header = new Header(headerConfig, {
      onClick: this.sort.bind(this)
    });

    this.#loading = new Loading();
    this.#placeholder = new EmptyPlaceholder();
    this.#element = this.createElement();

    if (sorted) {
      this.setSort(sorted.id, sorted.order);
    }

    this.#isLoading = true;
    this.getData().then(data => this.initData(data, sorted));
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

    element.append(this.#body, this.#loading.element, this.#placeholder.element);

    return element;
  }

  sort(id, direction) {
    this.setSort(id, direction);

    if (this.#isSortLocally) {
      this.sortOnClient();
      return;
    }

    this.sortOnServer();
  }

  sortOnClient() {
    this.#header.updateSort(this.#sort);

    if (!this.#sort.id) {
      this.update();
      return;
    }

    const comparator = this.#configManager.getComparator(this.#sort);
    if (!comparator) {
      throw new Error('sort was not provided');
    }

    const data = [...this.#data];
    data.sort((rowA, rowB) => comparator(rowA[this.#sort.id], rowB[this.#sort.id]));

    this.update(data);
  }

  sortOnServer() {
    this.#pageSize = SortableTable.PAGE_SIZE;
    this.getData().then(data => this.initData(data));
  }

  update(data = null) {
    this.changeLoading();
    this.updateEmpty(data);

    this.#body.innerHTML = '';
    this.#body.append(...this.createRows(data ?? this.#data).map(({ element }) => element));
  }

  async updateQueryParams(params = {}) {
    this.getData(params).then((data) => {
      this.update(data);
    });
  }

  destroy() {
    this.remove();
    this.#element = null;
    this.#header.destroy();
  }

  remove() {
    if (!this.#element) {
      return;
    }
    this.#element.remove();
  }

  async render() {
    this.getData().then((data) => {
      this.initData(data);
      this.element.remove();
      return this.#element;
    });
  }

  createRows(data = null) {
    return (data ?? this.#data).map((row) => {
      const cells = this.getRowData(row);
      return new Row(cells);
    });
  }

  getRowData(row) {
    const config = this.#configManager.config;
    return Object.keys(config)
      .filter(id => !!config)
      .reduce((resultRow, id) => {
        resultRow[id] = {
          id,
          value: row[id],
          template: config[id].template
        };

        return resultRow;
      }, {});
  }

  async getData(queryParams = null) {
    return await this.#dataProvider.getData({
      currentPage: this.#currentPage,
      pageSize: this.#pageSize,
      sort: {
        id: this.#sort?.id,
        direction: this.#sort?.direction
      },
      queryParams
    });
  }

  createIntersectionObserver() {
    if (!this.element) {
      return;
    }

    this.#intersectionObserver = new IntersectionObserver(this.observerCallback.bind(this));
    if (this.#body?.lastElementChild) {
      this.#intersectionObserver.observe(this.#body.lastElementChild);
    }
  }

  initData(data, sorted = null) {
    this.#isLoading = false;
    this.update(data);
    this.#header.updateSort(this.#sort);
    if (sorted && this.#isSortLocally) {
      this.sort(sorted.id, sorted.order);
    }

    if (this.#dataProvider.mode === TableDataMode.REMOTE) {
      this.createIntersectionObserver();
    }
  }

  setSort(id, direction) {
    this.#sort = {
      type: this.#configManager.config[id]?.sortType ?? SortType.STRING,
      id,
      direction
    };
  }

  observerCallback(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.#intersectionObserver.disconnect();
        this.#pageSize += SortableTable.PAGE_SIZE;
        this.getData().then(data => this.initData(data));
      }
    });
  }

  changeLoading() {
    if (this.#isLoading) {
      this.element.classList.add('sortable-table_loading');
    } else {
      this.element.classList.remove('sortable-table_loading');
    }
  }

  updateEmpty(data) {
    if (!data?.length && !this.#data?.length && !this.#isLoading) {
      this.element.classList.add('sortable-table_empty');
    } else {
      this.element.classList.remove('sortable-table_empty');
    }
  }
}


