import MonthPanel from "./month-panel.js";
import {SelectType} from "./day-button.js";

export default class Selector {
  #from;
  #to;

  #arrowLeft;
  #arrowRight;

  #onLeft;
  #onRight;
  #onClickButton;

  #leftClickHandler;
  #rightClickHandler;
  #onClickHandler;

  #monthPanels = [];

  #element;

  constructor({ onLeft, onRight, onClickButton, from, to }) {
    this.#onLeft = onLeft;
    this.#onRight = onRight;
    this.#onClickButton = onClickButton;

    this.#from = from;
    this.#to = to;

    this.#leftClickHandler = this.handleLeft.bind(this);
    this.#rightClickHandler = this.handleRight.bind(this);
    this.#onClickHandler = this.handleClickButton.bind(this);

    this.createElement();
    this.createPanels();
    this.setListeners();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    this.createArrows();
    const element = document.createElement('div');
    element.classList.add('rangepicker__selector');
    element.dataset.element = 'selector';

    const arrow = document.createElement('div');
    arrow.classList.add('rangepicker__selector-arrow');

    element.append(arrow, this.#arrowLeft, this.#arrowRight);

    this.#element = element;
  }

  createArrows() {
    const left = document.createElement('div');
    left.classList.add('rangepicker__selector-control-left');

    this.#arrowLeft = left;

    const right = document.createElement('div');
    right.classList.add('rangepicker__selector-control-right');

    this.#arrowRight = right;
  }

  createPanels() {
    const base = this.#to ?? new Date();
    const fromMonth = base.getMonth() === 0 ? 11 : base.getMonth() - 1;
    this.#monthPanels.push(new MonthPanel({
      month: fromMonth,
      year: base.getMonth() === 0 ? base.getFullYear() - 1 : base.getFullYear() ,
      selectedDays: this.getSelectedDays(fromMonth)
    }));

    this.#monthPanels.push(new MonthPanel({
      month: base.getMonth(),
      year: base.getFullYear(),
      selectedDays: this.getSelectedDays(base.getMonth())
    }));

    this.#element.append(...this.#monthPanels.map(({ element }) => element));
  }

  updateCells(left, right) {
    const [leftPanel, rightPanel] = this.#monthPanels;
    leftPanel.update(left.month, left.year, this.getSelectedDays(left.month));
    rightPanel.update(right.month, right.year, this.getSelectedDays(right.month));
  }

  updateValues(from, to) {
    const [leftPanel, rightPanel] = this.#monthPanels;
    this.#from = from;
    this.#to = to;
    leftPanel.updateSelected(this.getSelectedDays(leftPanel.getMonthYear().month));
    rightPanel.updateSelected(this.getSelectedDays(rightPanel.getMonthYear().month));
  }

  clearValues() {
    const [leftPanel, rightPanel] = this.#monthPanels;
    leftPanel.updateSelected([]);
    rightPanel.updateSelected([]);
  }

  getCurrentMonthes() {
    return this.#monthPanels.map(panel => panel.getMonthYear());
  }

  setListeners() {
    if (!this.#arrowLeft || !this.#arrowRight) {
      return;
    }

    this.#arrowRight.addEventListener('click', this.#rightClickHandler);
    this.#arrowLeft.addEventListener('click', this.#leftClickHandler);
    this.#element.addEventListener('click', this.#onClickHandler);
  }

  handleLeft() {
    this.#onLeft();
  }

  handleRight() {
    this.#onRight();
  }

  getSelectedDays(month) {
    return this.getDatesInRange()
      .filter((date) => date.getMonth() === month)
      .map((date) => ({
        value: date.getDate() - 1,
        selectType: this.getSelectType(date)
      }));
  }

  getDatesInRange() {
    if (!this.#from && !this.#to) {
      return [];
    }

    const date = new Date(this.#from.getTime());

    if (!this.#to) {
      return [date];
    }

    const dates = [];

    while (date <= this.#to) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }

  getSelectType(date) {
    if (!this.#from && !this.#to) {
      return null;
    }

    if (!this.#to) {
      return SelectType.FROM;
    }

    const dateWithoutTime = new Date(date.getTime());
    const dateFromWithoutTime = new Date(this.#from.getTime());
    const dateToWithoutTime = this.#to ? new Date(this.#to.getTime()) : null;

    dateFromWithoutTime.setUTCHours(0, 0, 0, 0);
    dateToWithoutTime.setUTCHours(0, 0, 0, 0);
    dateWithoutTime.setUTCHours(0, 0, 0, 0);

    if (dateToWithoutTime.getTime() === dateFromWithoutTime.getTime()) {
      return SelectType.BOTH;
    }

    if (dateWithoutTime.getTime() === dateFromWithoutTime.getTime()) {
      return SelectType.FROM;
    }

    if (dateWithoutTime.getTime() === dateToWithoutTime.getTime()) {
      return SelectType.TO;
    }

    if (dateWithoutTime.getTime() > dateFromWithoutTime.getTime() && dateWithoutTime.getTime() < dateToWithoutTime.getTime()) {
      return SelectType.BETWEEN;
    }

    return null;
  }

  handleClickButton(e) {
    const { target } = e;

    if (!target.classList.contains('rangepicker__cell')) {
      return;
    }

    this.#onClickButton(new Date(target.dataset.value));
  }
}
