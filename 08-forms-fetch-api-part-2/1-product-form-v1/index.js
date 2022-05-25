import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
import DataProvider from "./data.provider.js";
import Input, {InputType} from "./components/input.js";
import FormGroup from "./components/form-group.js";
import Fieldset from "./components/fieldset.js";
import Textarea from "./components/textarea.js";
import Label from "./components/label.js";
import Select from "./components/select.js";
import Submit from "./components/submit.js";
import ImageList from "./components/image-list.js";

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export const FieldType = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  SELECT: 'select',
};

export const FieldName = {
  TITLE: 'title',
  DESCRIPTION: 'description',
  PRICE: 'price',
  QUANTITY: 'quantity',
  DISCOUNT: 'discount',
  SUBCATEGORY: 'subcategory',
  STATUS: 'status',
  IMAGES: 'images'
};

export default class ProductForm {
   #imageRemoveHandler;
   #imageUploadHandler;

   #controls = {
     [FieldName.TITLE]: new Input({
       type: InputType.TEXT,
       placeholder: 'Название',
       name: FieldName.TITLE,
       required: true,
       onInput: (e) => {
         this.#values[FieldName.TITLE] = e.target.value;
       }
     }),
     [FieldName.DESCRIPTION]: new Textarea({
       placeholder: 'Название',
       name: FieldName.DESCRIPTION,
       required: true,
       onInput: (e) => {
         this.#values[FieldName.DESCRIPTION] = e.target.value;
       }
     }),
     [FieldName.SUBCATEGORY]: new Select({
       options: [],
       name: FieldName.SUBCATEGORY,
       required: true,
       onSelect: (value) => {
         this.#values[FieldName.SUBCATEGORY] = value;
       }
     }),
     [FieldName.PRICE]: new Input({
       type: InputType.NUMBER,
       placeholder: 'Цена',
       name: FieldName.PRICE,
       required: true,
       onInput: (e) => {
         this.#values[FieldName.PRICE] = e.target.value;
       }
     }),
     [FieldName.DISCOUNT]: new Input({
       type: InputType.NUMBER,
       placeholder: 'Скидка',
       name: FieldName.DISCOUNT,
       onInput: (e) => {
         this.#values[FieldName.DISCOUNT] = e.target.value;
       }
     }),
     [FieldName.QUANTITY]: new Input({
       type: InputType.NUMBER,
       placeholder: 'Количество',
       name: FieldName.QUANTITY,
       onInput: (e) => {
         this.#values[FieldName.QUANTITY] = e.target.value;
       }
     }),
     [FieldName.STATUS]: new Select({
       options: [
         { value: 1, label: 'Активен' },
         { value: 0, label: 'Неактивен' }
       ],
       name: FieldName.STATUS,
       onSelect: (value) => {
         this.#values[FieldName.STATUS] = value;
       }
     }),
     [FieldName.IMAGES]: null
   }

  #productId;

  #values = {
    [FieldName.TITLE]: '',
    [FieldName.DESCRIPTION]: '',
    [FieldName.PRICE]: 0,
    [FieldName.DISCOUNT]: 0,
    [FieldName.QUANTITY]: 0,
    [FieldName.SUBCATEGORY]: '',
    [FieldName.STATUS]: 1,
    [FieldName.IMAGES]: []
  }

  #dataProvider;

  #element;

  constructor (productId) {
    this.#productId = productId;
    this.#dataProvider = new DataProvider();

    this.#imageRemoveHandler = this.handleRemoveImage.bind(this);
    this.#imageUploadHandler = this.handleUploadImage.bind(this);

    this.#element = this.createElement();
    this.setListener();
  }

  get productId() {
    return this.#productId;
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('product-form');

    const form = document.createElement('form');
    form.dataset.element = 'product-form';
    form.classList.add('form-grid');

    const titleFormGroup = new FormGroup({
      classNames: ['form-group__half_left'],
      children: [
        new Fieldset('Название', this.#controls[FieldName.TITLE]).element
      ]
    });

    const descriptionFormGroup = new FormGroup({
      classNames: ['form-group__wide'],
      children: [
        this.#controls[FieldName.DESCRIPTION].element
      ]
    });

    const categoryFormGroup = new FormGroup({
      classNames: ['form-group__wide'],
      children: [
        new Label('Описание').element,
        this.#controls[FieldName.SUBCATEGORY].element
      ]
    });

    const priceDiscountFormGroup = new FormGroup({
      classNames: ['form-group__half_left', 'form-group__two-col'],
      children: [
        new Fieldset('Цена ($)', this.#controls[FieldName.PRICE]).element,
        new Fieldset('Скидка ($)', this.#controls[FieldName.DISCOUNT]).element
      ]
    });

    const quantityFormGroup = new FormGroup({
      classNames: ['form-group__part-half'],
      children: [
        new Label('Количество').element,
        this.#controls[FieldName.QUANTITY].element
      ]
    });

    const statusFormGroup = new FormGroup({
      classNames: ['form-group__part-half'],
      children: [
        new Label('Статус').element,
        this.#controls[FieldName.STATUS].element
      ]
    });

    this.#controls[FieldName.IMAGES] = new ImageList({ onChange: this.#imageUploadHandler });
    const imagesFormGroup = new FormGroup({
      classNames: ['form-group__wide'],
      children: [
        new Label('Фото').element,
        this.#controls[FieldName.IMAGES].element
      ]
    });

    const buttons = document.createElement('div');
    buttons.classList.add('form-buttons');
    buttons.append(new Submit({ label: 'Сохранить товар' }).element);

    form.append(
      titleFormGroup.element,
      descriptionFormGroup.element,
      imagesFormGroup.element,
      categoryFormGroup.element,
      priceDiscountFormGroup.element,
      quantityFormGroup.element,
      statusFormGroup.element,
      buttons
    );

    element.append(form);

    return element;
  }

  async render () {
    const categories = await this.#dataProvider.getCategories();
    await this.loadValuesFromProduct();
    this.#controls[FieldName.SUBCATEGORY].updateOptions(categories);
    this.#controls[FieldName.IMAGES].onRemove = this.#imageRemoveHandler;

    this.updateControls();

    return this.#element;
  }

  get element() {
    return this.#element;
  }

  updateControls() {
    Object.keys(this.#controls).forEach((field) => {
      this.#controls[field].updateValue(this.#values[field]);
    });
  }

  async loadValuesFromProduct() {
    if (!this.#productId) {
      return;
    }

    const product = await this.#dataProvider.getProduct(this.#productId);

    if (!product) {
      return;
    }

    this.#values[FieldName.QUANTITY] = product.quantity;
    this.#values[FieldName.TITLE] = product.title;
    this.#values[FieldName.DISCOUNT] = product.discount;
    this.#values[FieldName.DESCRIPTION] = product.description;
    this.#values[FieldName.PRICE] = product.price;
    this.#values[FieldName.STATUS] = product.status;
    this.#values[FieldName.SUBCATEGORY] = product.subcategory;
    this.#values[FieldName.IMAGES] = product.images;
  }

  handleRemoveImage(url) {
    this.#values[FieldName.IMAGES] = this.#values[FieldName.IMAGES].filter((img) => img.url !== url);
    this.#controls[FieldName.IMAGES].updateValue(this.#values[FieldName.IMAGES]);
  }

  async handleUploadImage(file) {
    this.#dataProvider.uploadFile(file).then((data) => {
      if (data) {
        console.log(data);
        this.#values[FieldName.IMAGES] = [...this.#values[FieldName.IMAGES], { url: data.link, source: data.id }];
        this.#controls[FieldName.IMAGES].updateValue(this.#values[FieldName.IMAGES]);
        this.#controls[FieldName.IMAGES].updateLoading(false);
      }
    });
  }

  setListener() {
    if (!this.#element) {
      return;
    }

    this.#element.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.save();
    });
  }

  save() {
    const values = { ...this.#values, id: this.#productId ?? null };
    this.#dataProvider.saveItem(values).then((data) => {
      const event = new CustomEvent(this.#productId ? 'product-updated' : 'product-saved');
      console.log(this.#element)
      this.#element.dispatchEvent(event);
    });
  }

  destroy() {
    this.remove();
  }

  remove() {
    if (!this.#element) {
      return;
    }

    this.#element.remove();
    this.#element = null;
  }

}
