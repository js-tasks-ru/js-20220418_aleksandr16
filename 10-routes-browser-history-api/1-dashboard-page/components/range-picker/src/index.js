import Input from "./components/input.js";
import Selector from "./components/selector.js";

export default class RangePicker {
   #from;
   #to;

   #isOpened;

   #leftHandler;
   #rightHandler;

   #input;
   #selector;

   #buttonClickHandler;
   #inputClickHandler;
   #windowClickHandler;

   #element;

   constructor({ from, to } = {}) {
     this.#from = from ?? new Date();
     this.#to = to ?? new Date();

     this.#leftHandler = this.handleLeft.bind(this);
     this.#rightHandler = this.handleRight.bind(this);

     this.#inputClickHandler = this.handleClickInput.bind(this);
     this.#buttonClickHandler = this.handleClickButton.bind(this);
     this.#windowClickHandler = this.handleClick.bind(this);

     this.createElement();
     this.setListeners();
     this.dispatchEvent();
   }

   get element() {
     return this.#element;
   }

   close() {
     this.#isOpened = false;
     this.updateElement();
   }

   toggle() {
     this.#isOpened = !this.#isOpened;
     this.updateElement();
   }

   updateElement() {
     if (this.#isOpened) {
       this.#element.classList.add('rangepicker_open');
     } else {
       this.#element.classList.remove('rangepicker_open');
     }
   }

   createElement() {
     const element = document.createElement('div');
     element.classList.add('rangepicker');

     this.#element = element;
     this.createInput();
     this.createSelector();
   }

   createInput() {
     this.#input = new Input({
       from: this.#from ?? new Date(),
       to: this.#to ?? new Date(),
       onClick: this.#inputClickHandler,
     });
     this.#element.append(this.#input.element);
   }

   createSelector() {
     this.#selector = new Selector({
       from: this.#from,
       to: this.#to,
       onLeft: this.#leftHandler,
       onRight: this.#rightHandler,
       onClickButton: this.#buttonClickHandler
     });
     this.#element.append(this.#selector.element);
   }

   handleClickInput() {
     this.toggle();
   }

   removeListeners() {
     window.removeEventListener('click', this.#windowClickHandler, );
   }

   setListeners() {
     window.addEventListener('click', this.#windowClickHandler, {
       capture: true,
     });
   }

   handleClick(e) {
     if (e.target.closest('.rangepicker')) {
       return;
     }

     if (this.#isOpened) {
       this.close();
     }
   }

   handleLeft() {
     const [first, second] = this.#selector.getCurrentMonthes();
     const newFirst = {
       month: first.month === 0 ? 11 : first.month - 1,
       year: first.month === 0 ? first.year - 1 : first.year
     };

     const newSecond = {
       month: second.month === 0 ? 11 : second.month - 1,
       year: second.month === 0 ? second.year - 1 : second.year
     };

     this.#selector.updateCells(newFirst, newSecond);
   }

   handleRight() {
     const [first, second] = this.#selector.getCurrentMonthes();
     const newFirst = {
       month: first.month === 11 ? 0 : first.month + 1,
       year: first.month === 11 ? first.year + 1 : first.year
     };

     const newSecond = {
       month: second.month === 11 ? 0 : second.month + 1,
       year: second.month === 11 ? second.year + 1 : second.year
     };

     this.#selector.updateCells(newFirst, newSecond);
   }

   handleClickButton(value) {
     if (this.#from && this.#to) {
       this.#from = value;
       this.#to = null;
       this.#selector.updateValues(this.#from, null);
       return;
     }

     if (this.#from && !this.#to) {
       if (this.#from.getTime() > value.getTime()) {
         this.#to = this.#from;
         this.#from = value;
       } else {
         this.#to = value;
       }
     }

     this.#selector.updateValues(this.#from, this.#to);
     this.#input.update(this.#from, this.#to);
     this.dispatchEvent();
     this.close();
   }

   destroy() {
     this.remove();
   }

   remove() {
     if (!this.#element) {
       return;
     }

     this.removeListeners();

     this.#element.remove();
     this.#element = null;
   }

   dispatchEvent() {
     const event = new CustomEvent('date-select', {
       detail: {
         from: this.#from,
         to: this.#to
       }
     });

     this.#element.dispatchEvent(event);
   }

   subscribe(callback) {
     if (!this.#element) {
       return;
     }

     this.#element.addEventListener('date-select', callback);

     return {
       unsubscribe: () => this.#element.removeEventListener('date-select', callback)
     };
   }
}
