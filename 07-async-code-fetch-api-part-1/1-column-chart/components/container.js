export default class Container {
  #header;
  #chart;
  #element;

  constructor(header, chart) {
    this.#header = header;
    this.#chart = chart;

    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const container = document.createElement('div');
    container.classList.add('column-chart__container');

    container.append(this.#header.element);
    container.append(this.#chart.element);

    return container;
  }
}
