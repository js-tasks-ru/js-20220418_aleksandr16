import MonthIndicator from "./month-indicator.js";
import DayButton, {SelectType} from "./day-button.js";

export default class MonthPanel {
  static MONTH_MAP = {
    0: 'Январь',
    1: 'Февраль',
    2: 'Март',
    3: 'Апрель',
    4: 'Май',
    5: 'Июнь',
    6: 'Июль',
    7: 'Август',
    8: 'Сентябрь',
    9: 'Октябрь',
    10: 'Ноябрь',
    11: 'Декабрь'
  };

  #month;
  #year;

  #indicator;
  #gridNode;

  #selectedDays;

  #element;

  constructor({ month, year, selectedDays = [] }) {
    this.#month = month;
    this.#year = year;
    this.#selectedDays = selectedDays;

    this.createElement();
    this.populateWithDays();
  }

  get element() {
    return this.#element;
  }

  getMonthYear() {
    return { month: this.#month, year: this.#year };
  }

  update(month, year, selectedDays = []) {
    this.#month = month;
    this.#year = year;
    this.#indicator.update(MonthPanel.MONTH_MAP[this.#month]);
    this.updateSelected(selectedDays);
  }

  updateSelected(selectedDays = []) {
    this.#selectedDays = selectedDays;
    this.populateWithDays();
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('rangepicker__calendar');

    this.#indicator = new MonthIndicator(MonthPanel.MONTH_MAP[this.#month]);

    const daysOfWeek = document.createElement('div');
    daysOfWeek.classList.add('rangepicker__day-of-week');
    daysOfWeek.innerHTML = `
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
    `;

    this.#gridNode = document.createElement('div');
    this.#gridNode.classList.add('rangepicker__date-grid');

    element.append(this.#indicator.element, daysOfWeek, this.#gridNode);

    this.#element = element;
  }

  getDaysCount() {
    return new Date(this.#year, this.#month + 1, 0).getDate();
  }

  populateWithDays() {
    const days = new Array(this.getDaysCount()).fill(null).map((_, index) => {
      return new DayButton({
        isFirst: index === 0,
        label: index + 1,
        value: new Date(this.#year, this.#month, index + 1),
        selected: this.#selectedDays.find((item) => item.value === index)?.selectType ?? null
      });
    });
    this.#gridNode.innerHTML = '';
    this.#gridNode.append(...days.map(({ element }) => element));

  }
}
