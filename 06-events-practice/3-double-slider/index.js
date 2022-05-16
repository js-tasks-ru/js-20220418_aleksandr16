import SliderLabel from "./components/slider-label.js";
import SliderProgressBar from "./components/slider-progress-bar.js";
import SliderThumb from "./components/slider-thumb.js";

export const ThumbType = {
  FROM: 'from',
  TO: 'to'
};

export default class DoubleSlider {
  #min;
  #max;
  #formatValue;
  #from;
  #to;

  #element;
  #body;

  #subElements;

  #onDragStart;
  #onInput;
  #onChange;

  constructor({
    min = 0,
    max = 100,
    formatValue = value => value,
    selected = null
  } = {}) {
    this.#min = min;
    this.#max = max;
    this.#formatValue = formatValue;
    this.#from = selected?.from ?? min;
    this.#to = selected?.to ?? max;

    this.#onDragStart = this.handleDragStart.bind(this);
    this.#onInput = this.handleInput.bind(this);
    this.#onChange = this.handleChange.bind(this);

    this.init();
  }

  get element() {
    return this.#element;
  }

  get min() {
    return this.#min;
  }

  get max() {
    return this.#max;
  }

  get from() {
    return this.#from;
  }

  get to() {
    return this.#to;
  }

  get subElements() {
    return this.#subElements;
  }

  init() {
    this.#subElements = {
      labels: {
        [ThumbType.FROM]: new SliderLabel(this.#from, this.#formatValue, ThumbType.FROM),
        [ThumbType.TO]: new SliderLabel(this.#to, this.#formatValue, ThumbType.TO),
      },
      progress: new SliderProgressBar((this.#from / this.#max) * 100, (this.#to / this.#max) * 100),
      thumbs: {
        [ThumbType.FROM]: new SliderThumb({
          value: this.#from,
          min: this.#min,
          max: this.#to,
          length: this.#max - this.#min,
          type: ThumbType.FROM,
          onDragStart: this.#onDragStart,
          onInput: this.#onInput,
          onChange: this.#onChange
        }),
        [ThumbType.TO]: new SliderThumb({
          value: this.#to,
          min: this.#from,
          max: this.#max,
          length: this.#max - this.#min,
          type: ThumbType.TO,
          onDragStart: this.#onDragStart,
          onInput: this.#onInput,
          onChange: this.#onChange
        }),
      }
    };

    this.#element = this.createElement();
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add("range-slider");

    const body = document.createElement('div');
    body.classList.add('range-slider__inner');

    const {
      labels: { from: labelFrom, to: labelTo },
      progress,
      thumbs: { from, to }
    } = this.#subElements;

    body.append(progress.element, from.element, to.element);

    this.#body = body;

    element.append(labelFrom.element, body, labelTo.element);

    return element;
  }

  handleDragStart() {
    const { from, to } = this.#subElements.thumbs;
    from.dragging = false;
    to.dragging = false;
    this.#element.classList.add('range-slider_dragging');
  }

  handleInput(value, type) {
    const { progress, thumbs, labels } = this.#subElements;
    if (!progress || !thumbs) {
      return;
    }
    const percent = (value / (this.#max - this.#min)) * 100;

    if (type === ThumbType.FROM) {
      thumbs[ThumbType.TO].update({ min: value });
      labels[ThumbType.FROM].update(value);
    }

    if (type === ThumbType.TO) {
      thumbs[ThumbType.FROM].update({ max: value });
      labels[ThumbType.TO].update(value);
    }

    progress.update({
      from: type === ThumbType.FROM ? percent : undefined,
      to: type === ThumbType.TO ? percent : undefined
    });
  }

  handleChange({ from, to }) {
    const { from: fromThumb, to: toThumb } = this.#subElements.thumbs;
    this.#element.classList.remove('range-slider_dragging');
    fromThumb.dragging = false;
    toThumb.dragging = false;

    this.#from = from;
    this.#to = to;

    const event = new CustomEvent('range-select', {
      detail: { from: this.#from, to: this.#to }
    });

    this.#element.dispatchEvent(event);
  }

  destroy() {
    if (!this.#element) {
      return;
    }

    const { progress, labels, thumbs } = this.#subElements;

    if (labels) {
      labels[ThumbType.FROM].destroy();
      labels[ThumbType.TO].destroy();
    }

    if (thumbs) {
      thumbs[ThumbType.FROM].destroy();
      thumbs[ThumbType.TO].destroy();
    }

    if (progress) {
      progress.destroy();
    }

    this.#element.remove();

    this.#subElements = {};
  }

}
