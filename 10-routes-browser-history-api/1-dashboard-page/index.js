import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

export default class Page {
  #title;

  #element;

  #fromDate;
  #toDate;

  #changeSubscription;

  #subElements = {};

  #components = new Map();

  constructor({
    title = '',
    fromDate = null,
    toDate = null
  }) {
    this.#title = title;
    this.#fromDate = fromDate ?? new Date();
    this.#toDate = toDate ?? new Date();
    this.createComponents();
    this.createElement();
  }

  async render() {
    this.renderRangePicker();
    this.renderCharts();
    this.renderTable();
    this.updatePage();
    return this.#element;
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('dashboard', 'full-height', 'flex-column');

    const topPanel = document.createElement('div');
    topPanel.classList.add('content__top-panel');
    topPanel.innerHTML = `<h2 class="page-title">${this.#title}</h2>`;

    this.#subElements['topPanel'] = topPanel;

    const charts = document.createElement('div');
    charts.classList.add('dashboard__charts');

    this.#subElements['charts'] = charts;

    const blockTitle = document.createElement('h3');
    blockTitle.classList.add('block-title');
    blockTitle.innerHTML = 'Лидеры продаж';

    this.#subElements['tableTitle'] = blockTitle;

    element.append(topPanel, charts, blockTitle);

    this.#element = element;
  }

  async renderRangePicker() {
    if (!this.#subElements.topPanel || !this.#components.get('rangePicker')) {
      return;
    }

    this.#subElements.topPanel.append(this.#components.get('rangePicker').element);
    this.listenChangeDates();
  }

  renderCharts() {
    if (!this.#subElements.charts) {
      return;
    }

    if (this.#components.get('ordersChart')) {
      this.#subElements.charts.append(this.#components.get('ordersChart').element);
    }

    if (this.#components.get('salesChart')) {
      this.#subElements.charts.append(this.#components.get('salesChart').element);
    }

    if (this.#components.get('customersChart')) {
      this.#subElements.charts.append(this.#components.get('customersChart').element);
    }
  }

  async renderTable() {
    if (!this.#subElements.tableTitle) {
      return;
    }

    if (this.#components.get('table')) {
      this.#subElements.tableTitle.after(this.#components.get('table').element)
    }
  }

  createComponents() {
    this.#components.set('rangePicker', new RangePicker({ from: this.#fromDate, to: this.#toDate }));
    this.#components.set('ordersChart', new ColumnChart({
      label: 'Заказы',
      range: {
        from: this.#fromDate, to: this.#toDate
      },
      url: 'api/dashboard/orders',
      link: '/orders',
      className: 'dashboard__chart_orders'
    }));

    this.#components.set('salesChart', new ColumnChart({
      label: 'Продажи',
      range: {
        from: this.#fromDate, to: this.#toDate
      },
      url: 'api/dashboard/sales',
      className: 'dashboard__chart_sales'
    }));

    this.#components.set('customersChart', new ColumnChart({
      label: 'Клиенты',
      range: {
        from: this.#fromDate, to: this.#toDate
      },
      url: 'api/dashboard/customers',
      className: 'dashboard__chart_customers'
    }));

    this.#components.set('table', new SortableTable(header, {
      url: 'api/dashboard/bestsellers',
      sorted: {
        id: 'title',
        order: 'asc'
      }
    }));
  }

  async updatePage() {
    this.#components.get('ordersChart').update(this.#fromDate, this.#toDate);
    this.#components.get('salesChart').update(this.#fromDate, this.#toDate);
    this.#components.get('customersChart').update(this.#fromDate, this.#toDate);
    await this.#components.get('table').updateQueryParams({ from: this.#fromDate.toISOString(), to: this.#toDate.toISOString() });
  }

  listenChangeDates() {
    this.#changeSubscription = this.#components.get('rangePicker').subscribe(async (e) => {
      this.#fromDate = e.detail.from;
      this.#toDate = e.detail.to;
      await this.updatePage();
    });
  }

  destroy() {
    if (this.#changeSubscription) {
      this.#changeSubscription.unsubscribe();
    }

    this.#components.forEach((component) => {
      component.destroy();
    });

    if (!this.#element) {
      return;
    }

    this.#element.remove();
    this.#element = null;
  }
}
