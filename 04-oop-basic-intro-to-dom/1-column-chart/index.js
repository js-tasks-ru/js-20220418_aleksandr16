import { Title, Header, Chart, Container } from './components';
import EventObserver from "./event-observer.js";

export default class ColumnChart {
  static #HEIGHT = 50;
  #title
  #chart
  #header
  #dataObserver = new EventObserver();
  #element;

  constructor({ label, value, data, link, formatHeading } = {}) {
    this.#title = new Title({ title: label, link });
    this.#header = new Header(value, formatHeading);
    this.#chart = new Chart(data ?? [], ColumnChart.#HEIGHT);

    this.subscribeToDataUpdate();

    this.#element = this.createTemplate();
    this.updateLoading(!data?.length);
  }

  get element() {
    return this.#element;
  }

  get chartHeight() {
    return ColumnChart.#HEIGHT;
  }

  update(data) {
    this.#dataObserver.notify(data);
  }

  destroy() {
    this.remove();
    this.#chart = null;
    this.#title = null;
    this.#header = null;
    this.#element = null;
    this.#dataObserver = null;
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

  updateLoading(loading) {
    if (loading) {
      this.#element.classList.add('column-chart_loading');
    } else {
      this.#element.classList.remove('column-chart_loading');
    }
  }

  subscribeToDataUpdate() {
    this.#dataObserver.subscribe((data) => {
      this.#chart.update(data);
      this.updateLoading(!data?.length);
    });
  }
}
