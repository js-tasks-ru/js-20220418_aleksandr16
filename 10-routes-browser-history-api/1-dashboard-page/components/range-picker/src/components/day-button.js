export const SelectType = {
  FROM: 'from',
  TO: 'to',
  BETWEEN: 'between',
  BOTH: 'both'
};

export default class DayButton {
  #label;
  #value;
  #selected;
  #isFirst;

  #element;

  constructor({ label, startFrom = null, value, selected = null, isFirst }) {
    this.#label = label;
    this.#isFirst = isFirst;
    this.#value = value;
    this.createElement();
    this.update(selected);
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('button');
    element.type = 'button';
    element.classList.add('rangepicker__cell');
    element.innerHTML = this.#label;
    element.dataset.value = this.#value.toISOString();
    if (this.#isFirst) {
      const dayNumber = this.#value.getDay() === 0 ? 7 : this.#value.getDay();
      element.style.setProperty('--start-from', dayNumber);
    }

    this.#element = element;
  }

  update(selected = null) {
    this.#selected = selected;
    if (!this.#element) {
      return;
    }

    this.#element.classList.remove(
      'rangepicker__selected-between',
      'rangepicker__selected-from',
      'rangepicker__selected-to'
    );

    if (!selected) {
      return;
    }

    switch (selected) {
    case SelectType.BETWEEN:
      this.#element.classList.add('rangepicker__selected-between');
      break;
    case SelectType.TO:
      this.#element.classList.add('rangepicker__selected-to');
      break;
    case SelectType.FROM:
      this.#element.classList.add('rangepicker__selected-from');
      break;
    case SelectType.BOTH:
      this.#element.classList.add('rangepicker__selected-to', 'rangepicker__selected-from');
      break;
    default:
      return;
    }
  }
}
