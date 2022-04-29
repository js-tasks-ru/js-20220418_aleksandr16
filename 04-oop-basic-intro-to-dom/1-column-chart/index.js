import Title from "./components/title.js";
import Header from "./components/header.js";
import Chart from "./components/chart.js";
import Container from "./components/container.js";

export default class ColumnChart {
  static #HEIGHT = 50;
  #title
  #chart
  #header
  #loading;

  #element;

  constructor({ label, value, data, link, formatHeading } = {}) {
    this.#title = new Title({ title: label, link });
    this.#header = new Header(value, formatHeading);
    this.#chart = new Chart(data ?? [], ColumnChart.#HEIGHT);
    this.#loading = !data?.length;

    this.#element = this.createTemplate();
    this.updateLoading();
  }

  get element() {
    return this.#element;
  }

  get chartHeight() {
    return ColumnChart.#HEIGHT;
  }

  update(data) {
    this.#chart.update(data);
    this.#loading = !data.length;
    this.updateLoading();
  }

  destroy() {
    this.remove();
    this.#chart = null;
    this.#title = null;
    this.#header = null;
    this.#element = null;
  }

  remove() {
    this.element.remove();
  }

  createTemplate() {
    const element = document.createElement('div');
    element.classList.add('column-chart');

    element.style.setProperty('--chart-height', String(ColumnChart.#HEIGHT));

    const container = new Container(this.#header, this.#chart);

    element.append(this.#title.element);
    element.append(container.element);

    return element;
  }

  updateLoading() {
    if (this.#loading) {
      this.#element.classList.add('column-chart_loading');
    } else {
      this.#element.classList.remove('column-chart_loading');
    }
  }
}
