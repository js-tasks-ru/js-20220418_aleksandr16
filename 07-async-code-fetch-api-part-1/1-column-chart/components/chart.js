import Column from "./column.js";

export default class Chart {
  #data;
  #height;
  #element;

  constructor(data, height) {
    this.#height = height;
    this.#data = this.createData(data);

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
    if (!data || !Object.values(data).length) {
      return [];
    }

    const entries = Object.entries(data);

    const max = Math.max(...entries.map(entry => Number(entry[1])));
    const scale = this.#height / max;
    return entries.map((entry) => ({
      value: String(Math.floor(entry[1] * scale)),
      label: entry[0]
    }));
  }

  getColumnNodes() {
    return this.#data.map(({ value, label: tooltip }) => {
      return new Column(value, tooltip).element;
    });
  }
}
