import Input, {InputType} from "./input.js";

export default class ImageItem {
  #url;
  #source;

  #onRemove;

  #element;

  #deleteButton;
  #deleteHandler;

  constructor({ url, source, onRemove }) {
    this.#url = url;
    this.#source = source;
    this.#onRemove = onRemove;

    this.#deleteHandler = this.handleDelete.bind(this);

    this.#element = this.createElement();
    this.setListeners();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('li');
    element.classList.add('products-edit__imagelist-item', 'sortable-list__item');

    const urlInput = new Input({ type: InputType.HIDDEN, name: 'url', value: this.#url });
    const srcInput = new Input({ type: InputType.HIDDEN, name: 'source', value: this.#source });

    const span = document.createElement('span');
    const grab = document.createElement('img');
    grab.src = 'icon-grab.svg';
    grab.setAttribute('data-grab-handle', '');
    grab.alt = 'grab';

    const img = document.createElement('img');
    img.src = this.#url;
    img.classList.add('sortable-table__cell-img');
    img.alt = 'Image';

    const name = document.createElement('span');
    name.innerHTML = this.#source;

    span.append(grab, img, name);

    this.#deleteButton = document.createElement('button');
    this.#deleteButton.type = 'button';
    this.#deleteButton.innerHTML = `<img src="icon-trash.svg" data-delete-handle="" alt="delete">`;

    element.append(urlInput.element, srcInput.element, span, this.#deleteButton);
    return element;
  }

  setListeners() {
    if (!this.#deleteButton) {
      return;
    }

    this.#deleteButton.addEventListener('click', this.#deleteHandler);
  }

  handleDelete() {
    this.#onRemove(this.#url);
  }
}
