export default class Input {
  #from;
  #to;

  #fromNode;
  #toNode;

  #onClick;
  #clickHandler;

  #element;

  constructor({ from, to, onClick }) {
    this.#from = from;
    this.#to = to;
    this.#onClick = onClick;

    this.#clickHandler = this.handleClick.bind(this);

    this.#element = this.createElement();
    this.updateNodes();
    this.setListener();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('rangepicker__input');
    element.dataset.element = 'input';

    this.#fromNode = document.createElement('span');
    this.#fromNode.dataset.element = 'from';

    this.#toNode = document.createElement('span');
    this.#toNode.dataset.element = 'to';

    element.append(this.#fromNode, document.createTextNode(' - '), this.#toNode);

    return element;
  }

  update(from, to) {
    this.#from = from;
    this.#to = to;
    this.updateNodes();
  }

  updateNodes() {
    this.#fromNode.innerHTML = this.#from.toLocaleDateString(['ru-RU']);
    this.#toNode.innerHTML = this.#to.toLocaleDateString(['ru-RU']);
  }

  handleClick() {
    this.#onClick();
  }

  setListener() {
    if (!this.#element) {
      return;
    }

    this.#element.addEventListener('click', this.#clickHandler);
  }

  destroy() {
    if (!this.#element) {
      return;
    }

    this.#element.removeEventListener('click', this.#clickHandler);
    this.#element.remove();
    this.#element = null;
  }
}
