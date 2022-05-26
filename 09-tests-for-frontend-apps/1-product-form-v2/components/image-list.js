import ImageItem from "./image-item.js";
import UploadButton from "./upload-button.js";
import SortableList from "../../2-sortable-list/index.js";

export default class ImageList {
  #images;

  #element;

  #list;

  #onRemove;
  #removeHandler;

  #onResort;
  #resortHandler;

  #button;
  #onChange;
  #changeHandler;

  constructor({
    images = [],
    onChange = () => void 0,
    onResort = () => void 0
  }) {
    this.#images = images;
    this.#onChange = onChange;
    this.#changeHandler = this.handleChange.bind(this);

    this.#onResort = onResort;
    this.#resortHandler = this.handleResort.bind(this);

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

    this.#button = new UploadButton({ label: 'Загрузить', onChangeFile: this.#changeHandler });

    element.append(this.#button.element);

    return element;
  }

  insertImages() {
    if (!this.#element) {
      return;
    }

    const onRemove = this.#removeHandler;

    if (this.#list) {
      this.#list.destroy();
    }

    const images = this.#images.map(({ url, source }) => new ImageItem({ url, source, onRemove }).element);

    this.#list = new SortableList({ items: images, onRemove: this.#removeHandler, onResort: this.#resortHandler });

    this.#element.prepend(this.#list.element);
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

  handleResort(images) {
    const files = Array.from(images ?? []).map((node) => {
      return {
        url: node.querySelector('input[name="url"]')?.value ?? null,
        source: node.querySelector('input[name="source"]')?.value ?? null,
      };
    });

    this.#onResort(files);
  }
}
