import {ThumbType} from "../index.js";

export default class SliderThumb {
  #value;
  #type;

  #min;
  #max;

  #length;

  #isDragging;

  #onChange;
  #onDragStart;
  #onInput;

  #onMouseDown;
  #onMouseMove;
  #onMouseUp;

  #element;

  constructor({ value, min, max, length, type, onChange = () => void 0, onDragStart = () => void 0, onInput = () => void 0 }) {
    this.validateType(type);
    this.#type = type;
    this.#isDragging = false;
    this.#length = length;

    this.#onChange = onChange;
    this.#onDragStart = onDragStart;
    this.#onInput = onInput;

    this.#onMouseDown = this.handleMouseDown.bind(this);
    this.#onMouseMove = this.handleMouseMove.bind(this);
    this.#onMouseUp = this.handleMouseUp.bind(this);

    this.#element = this.createElement();

    this.setListeners();

    this.update({ value, min, max });
  }

  get element() {
    return this.#element;
  }

  set dragging(isDragging) {
    this.#isDragging = isDragging;
  }

  get dragging() {
    return this.#isDragging;
  }

  get type() {
    return this.#type;
  }

  update({ value, max, min }) {
    if (typeof value !== 'undefined') {
      this.#value = value;
    }

    if (typeof min !== 'undefined') {
      this.#min = min;
    }

    if (typeof max !== 'undefined') {
      this.#max = max;
    }

    if (!this.#element) {
      return;
    }

    let percentToSet = (this.#value / this.#length) * 100;

    const maxPercent = (this.#max / this.#length) * 100;
    if (percentToSet > maxPercent) {
      percentToSet = maxPercent;
    }

    const minPercent = (this.#min / this.#length) * 100;
    if (percentToSet < minPercent) {
      percentToSet = minPercent;
    }

    this.#element.style.left = percentToSet + '%';
  }

  createElement() {
    const element = document.createElement('span');
    element.classList.add(`range-slider__thumb-${this.#type === 'from' ? 'left' : 'right'}`);
    element.dataset.thumb = this.#type;

    return element;
  }

  validateType(type) {
    if (type !== 'from' && type !== 'to') {
      throw new Error('Invalid type');
    }
  }

  handleMouseDown() {
    this.#onDragStart();
    this.#isDragging = true;
  }

  handleMouseMove(event) {
    if (!this.dragging) {
      return;
    }

    event.preventDefault();
    const dx = (event.clientX - this.leftOffset - this.width) /
      (this.#element.closest('.range-slider__inner').getBoundingClientRect().width / this.#length);

    let newValue = this.calculateNewValue(dx ?? 0);

    this.update({ value: newValue });
    this.#onInput(newValue, this.type);
  }

  handleMouseUp(event) {
    if (!this.dragging) {
      return;
    }
    event.preventDefault();
    this.#onChange({
      from: this.#type === ThumbType.FROM ? this.#value : this.#min,
      to: this.#type === ThumbType.FROM ? this.#max : this.#value,
    });
  }

  setListeners() {
    if (!this.#element) {
      return;
    }

    this.#element.addEventListener('pointerdown', this.#onMouseDown);
    window.addEventListener('pointermove', this.#onMouseMove);
    window.addEventListener('pointerup', this.#onMouseUp);
  }

  calculateNewValue(delta) {
    const newValue = this.#value + delta;
    if (newValue >= this.#max) {
      return this.#max;
    }

    if (newValue <= this.#min) {
      return this.#min;
    }

    return Math.ceil(newValue);
  }

  get leftOffset() {
    if (!this.#element) {
      return 0;
    }

    return this.#element.getBoundingClientRect().left;
  }

  get width() {
    if (!this.#element) {
      return 0;
    }

    return this.#element.offsetWidth;
  }

  destroy() {
    if (!this.#element) {
      return;
    }

    this.#element.removeEventListener('pointerdown', this.#onMouseDown);
    window.removeEventListener('pointermove', this.#onMouseMove);
    window.removeEventListener('pointerup', this.#onMouseUp);
    this.#element.remove();
    this.#element = null;
  }
}
