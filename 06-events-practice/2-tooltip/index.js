class Tooltip {
  static #instance;
  element;
  #show;
  #hide;
  #move;

  #inDocument = false;

  constructor() {
    if (typeof Tooltip.#instance === 'object') {
      return Tooltip.#instance;
    }

    this.element = this.createElement();

    this.#show = this.show.bind(this);
    this.#hide = this.hide.bind(this);
    this.#move = this.move.bind(this);

    Tooltip.#instance = this;

    return Tooltip.#instance;
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('tooltip');

    return element;
  }

  initialize () {
    this.addEvents();
  }

  addEvents() {
    window.addEventListener('pointerover', this.#show);
  }

  move({ clientX, clientY }) {
    if (!this.element || !this.#inDocument) {
      return;
    }

    this.setPosition(clientX, clientY);
  }

  show({ target, clientX, clientY }) {
    if (!this.element) {
      return;
    }

    const tooltip = target.dataset.tooltip;
    if (!tooltip) {
      return;
    }

    this.element.innerHTML = tooltip;
    this.setPosition(clientX, clientY);

    target.addEventListener('pointermove', this.#move);
    target.addEventListener('pointerout', this.#hide);

    this.render();
  }

  hide({ target }) {
    if (!this.element || !this.#inDocument) {
      return;
    }

    target.removeEventListener('pointermove', this.#move);
    target.removeEventListener('pointerout', this.#hide);
    this.element.innerHTML = '';
    this.element.remove();
    this.#inDocument = false;
  }

  render() {
    if (this.#inDocument) {
      return;
    }

    this.#inDocument = true;
    document.body.append(this.element);
  }

  destroy() {
    window.removeEventListener('pointerover', this.#show);
    Tooltip.instance = null;
    this.element.remove();
    this.#inDocument = false;
  }

  setPosition(x, y) {
    if (!this.element) {
      return;
    }

    this.element.style.left = x + 20 + 'px';
    this.element.style.top = y + 20 + 'px';
  }
}

export default Tooltip;
