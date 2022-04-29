import Column from "./column.js";

export default class Chart {
  #data;
  #height;
  #element;
  #columns;

  constructor(data, height) {
    this.#height = height;
    this.#data = this.createData(data);
    this.#columns = this.getColumnNodes();

    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  update(data) {
    this.#data = this.createData(data);
    this.#element.innerHTML = '';
    this.#element.append(...this.getColumnNodes());
  }

  createElement() {
    const chart = document.createElement('div');
    chart.classList.add('column-chart__chart');
    chart.setAttribute('data-element', 'body');

    chart.append(...this.getColumnNodes());

    return chart;
  }

  createData(data) {
    if (!data?.length) {
      return [];
    }

    const max = Math.max(...data);
    const scale = this.#height / max;
    return data.map((item) => ({
      percent: ((item / max) * 100).toFixed(0),
      value: String(Math.floor(item * scale))
    }));
  }

  getColumnNodes() {
    return this.#data.map(({ value, percent }) => {
      return new Column(value, percent).element;
    });
  }
}
