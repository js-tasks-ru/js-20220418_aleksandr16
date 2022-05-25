export default class UploadButton {
  #label;
  #onChangeFile;

  #fileHandler;
  #clickHandler;

  #loading;

  #element;

  constructor({ label, onChangeFile }) {
    this.#label = label;
    this.#onChangeFile = onChangeFile;
    this.#loading = false;

    this.#clickHandler = this.handleClick.bind(this);
    this.#fileHandler = this.handleChange.bind(this);

    this.#element = this.createElement();
  }

  get element() {
    return this.#element;
  }

  createElement() {
    const element = document.createElement('button');
    element.type = 'button';
    element.name = 'uploadImage';
    element.classList.add('button-primary-outline');
    element.innerHTML = `<span>Загрузить</span>`;

    element.addEventListener('click', this.#clickHandler);

    return element;
  }

  handleClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'images/*';
    input.hidden = true;

    document.body.append(input);

    input.addEventListener('change', this.#fileHandler);

    input.click();
    input.remove();
  }

  handleChange(e) {
    this.update(true);
    const [file] = e.target.files;
    if (!this.#onChangeFile) {
      return;
    }

    console.log(this.#onChangeFile)
    this.#onChangeFile(file, this.update.bind(this, false));
  }

  update(loading) {
    this.#loading = loading;
    this.updateLoading();
  }

  updateLoading() {
    if (!this.#element) {
      return;
    }

    if (this.#loading) {
      this.#element.classList.add('is-loading');
    } else {
      this.#element.classList.remove('is-loading');
    }
  }
}
