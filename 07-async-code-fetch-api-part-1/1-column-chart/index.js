import fetchJson from './utils/fetch-json.js';
import {Chart, Container, Header, Title} from "./components";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  static #HEIGHT = 50;
  #title
  #chart
  #header

  #url;

  #from;
  #to;

  #element;

  constructor({ label, data = {}, value, link, formatHeading, url, range = {} } = {}) {
    this.#title = new Title({ title: label, link });
    this.#header = new Header(value, formatHeading);
    this.#chart = new Chart(null, ColumnChart.#HEIGHT);
    this.#url = url;
    this.#from = range.from ?? void 0;
    this.#to = range.to ?? void 0;

    this.#element = this.createTemplate();
    this.updateChart(data);
  }

  get element() {
    return this.#element;
  }

  get chartHeight() {
    return ColumnChart.#HEIGHT;
  }

  get subElements() {
    return {
      body: this.#chart.element
    };
  }

  async update(from, to) {
    this.#from = from;
    this.#to = to;
    const data = await this.getDataFromServer();
    this.updateChart(data);
    return data;
  }

  updateChart(data) {
    this.#header.update(this.getSumOf(data));
    this.#chart.update(data);
    this.updateLoading(!Object.values(data).length);
  }

  destroy() {
    this.remove();
    this.#chart = null;
    this.#title = null;
    this.#header = null;
    this.#element = null;
  }

  remove() {
    if (!this.#element) {
      return;
    }
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

  async getDataFromServer() {
    if (!this.#url) {
      return {};
    }

    try {
      const params = new URLSearchParams({
        from: this.getFromRequestParam(),
        to: this.getToRequestParam()
      });
      return await fetchJson(`${BACKEND_URL}/${this.#url}?${params}`);
    } catch (e) {
      return {};
    }
  }

  getFromRequestParam() {
    switch (true) {
    case !this.#from:
      return void 0;
    case this.#from instanceof Date:
      return this.#from.toISOString();
    default:
      return encodeURIComponent(this.#from);
    }
  }

  getToRequestParam() {
    switch (true) {
    case !this.#to:
      return void 0;
    case this.#to instanceof Date:
      return this.#to.toISOString();
    default:
      return encodeURIComponent(this.#to);
    }
  }

  getSumOf(data) {
    return Object.values(data).reduce((sum, item) => {
      return sum + item;
    }, 0);
  }
}
