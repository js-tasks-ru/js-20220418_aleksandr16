export default class SortableList {
  #items;

  #element;

  #pointerDownHandler;
  #pointerMoveHandler;
  #pointerUpHandler;

  #placeholder;

  #currentItem;
  #shiftX;
  #shiftY;

  constructor({ items = [] }) {
    this.validateItems(items);

    this.#items = items;
    this.#pointerDownHandler = this.handlePointerDown.bind(this);
    this.#pointerMoveHandler = this.handleMouseMove.bind(this);
    this.#pointerUpHandler = this.handleMouseUp.bind(this);

    this.createElement();
    this.updateItems();
    this.setListeners();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('ul');
    element.classList.add('sortable-list');

    this.#element = element;
  }

  updateItems() {
    this.#items.forEach((node) => {
      node.ondragstart = () => false;
      node.classList.add('sortable-list__item');
    });
    this.#element.innerHTML = '';
    this.#element.append(...this.#items);
  }

  validateItems(items) {
    if (!items.every((node) => node.tagName === 'LI')) {
      throw new Error('Every item should be "li"');
    }

    if (!items.every((node) => {
      return typeof node.dataset['grab-handle'] !== 'undefined' || node.querySelector('[data-grab-handle]');
    })) {
      throw new Error('Every item should have grab zone');
    }
  }

  setListeners() {
    if (!this.#element) {
      return;
    }

    this.#element.addEventListener('pointerdown', this.#pointerDownHandler);
  }

  handlePointerDown(e) {
    const { target } = e;
    if (!this.isDragging(target) && !this.isRemoving(target)) {
      return;
    }

    this.#currentItem = target.closest('.sortable-list__item');
    const { width, left, top, height } = this.#currentItem.getBoundingClientRect();

    if (this.isRemoving(target)) {
      this.removeItem();
      return;
    }

    this.#currentItem.style.width = `${width}px`;
    this.#shiftX = e.clientX - left;
    this.#shiftY = e.clientY - top;
    this.#currentItem.classList.add('sortable-list__item_dragging');

    if (this.isDragging(target)) {
      this.createPlaceholder(width, height);
    }

    this.#element.append(this.#currentItem);

    this.#currentItem.style.left = e.pageX - this.#shiftX + 'px';
    this.#currentItem.style.top = e.pageY - this.#shiftY + 'px';

    document.addEventListener('pointermove', this.#pointerMoveHandler);
    document.addEventListener('pointerup', this.#pointerUpHandler);
  }

  handleMouseMove(e) {
    this.#currentItem.style.left = e.pageX - this.#shiftX + 'px';
    this.#currentItem.style.top = e.pageY - this.#shiftY + 'px';

    if (this.isRemoving(e.target)) {
      return;
    }

    this.#currentItem.style.visibility = 'hidden';
    const element = document.elementFromPoint(e.clientX, e.clientY);

    this.#currentItem.style.visibility = 'visible';

    const item = element.closest('.sortable-list__item');

    if (!item) {
      return;
    }

    this.swapPlaceholder(item);
  }

  handleMouseUp(e) {
    if (this.isDragging(e.target)) {
      this.placeItem();
      document.removeEventListener('pointermove', this.#pointerMoveHandler);
    }
  }

  createPlaceholder(width, height) {
    this.#placeholder = document.createElement('div');
    this.#placeholder.classList.add('sortable-list__placeholder');
    this.#placeholder.style.width = `${width}px`;
    this.#placeholder.style.height = `${height}px`;

    this.#currentItem.before(this.#placeholder);
  }

  swapPlaceholder(node) {
    const sibling = this.#placeholder.nextSibling === node ? this.#placeholder : this.#placeholder.nextSibling;
    this.#element.insertBefore(this.#placeholder, node);
    this.#element.insertBefore(node, sibling);
  }

  placeItem() {
    const sibling = this.#currentItem.nextSibling === this.#placeholder ? this.#currentItem : this.#currentItem.nextSibling;
    this.#element.insertBefore(this.#currentItem, this.#placeholder);
    this.#element.insertBefore(this.#placeholder, sibling);
    this.#placeholder.remove();
    this.#placeholder = null;
    this.#currentItem.classList.remove('sortable-list__item_dragging');
    this.#currentItem.removeAttribute('style');
  }

  removeItem() {
    if (this.#currentItem) {
      this.#currentItem.remove();
      this.#currentItem = null;
    }

    if (this.#placeholder) {
      this.#placeholder.remove();
      this.#placeholder = null;
    }
  }

  isDragging(node) {
    return node.getAttribute('data-grab-handle') !== null;
  }

  isRemoving(node) {
    return node.getAttribute('data-delete-handle') !== null;
  }

  remove() {
    if (!this.#element) {
      return;
    }

    this.#element.addEventListener('pointerdown', this.#pointerDownHandler);
    this.#element.remove();
    this.#element = null;
  }

  destroy() {
    this.#currentItem = null;
    this.#shiftX = 0;
    this.#shiftY = 0;
    this.remove();
  }
}
