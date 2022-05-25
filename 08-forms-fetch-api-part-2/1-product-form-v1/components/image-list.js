import ImageItem from "./image-item.js";
import UploadButton from "./upload-button.js";

export default class ImageList {
  #images;

  #element;

  #list;

  #onRemove;
  #removeHandler;
  #button;
  #onChange;
  #changeHandler;

  constructor({
    images = [],
    onChange = () => void 0
  }) {
    this.#images = images;
    this.#onChange = onChange;
    this.#changeHandler = this.handleChange.bind(this);

    this.#element = this.createElement();
    this.insertImages();
  }

  get element() {
    return this.#element;
  }

  set onRemove(onRemove) {
    this.#onRemove = onRemove;
    this.#removeHandler = this.handleRemove.bind(this);
  }

  updateLoading(loading) {
    this.#button.update(loading);
  }

  createElement() {
    const element = document.createElement('div');
    element.dataset.element = 'imageListContainer';

    const ul = document.createElement('ul');
    this.#button = new UploadButton({ label: 'Загрузить', onChangeFile: this.#changeHandler });
    ul.classList.add('sortable-list');

    this.#list = ul;

    element.append(this.#list, this.#button.element);

    return element;
  }

  insertImages() {
    if (!this.#element) {
      return;
    }

    const onRemove = this.#removeHandler;

    this.#list.innerHTML = '';

    const images = this.#images.map(({ url, source }) => new ImageItem({ url, source, onRemove }).element);

    this.#list.append(...images);
  }

  updateValue(images) {
    if (!this.#element) {
      return;
    }

    this.#images = images;

    this.insertImages();
  }

  handleRemove(url) {
    this.#onRemove(url);
  }

  handleChange(file) {
    this.#onChange(file);
  }
}
