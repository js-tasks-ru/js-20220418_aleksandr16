export const NotificationMessageType = {
  SUCCESS: 'success',
  ERROR: 'error'
};

export default class NotificationMessage {
   static #DEFAULT_TIMEOUT = 3000;

   #duration;
   #type;
   #headerText;
   #bodyText;
   #element;

   constructor(headerText = '', {
     type = NotificationMessageType.SUCCESS,
     duration = NotificationMessage.#DEFAULT_TIMEOUT,
     bodyText = '' } = {}
   ) {
     this.validateType(type);
     this.validateDuration(duration);

     this.#type = type;
     this.#duration = duration;
     this.#headerText = headerText;
     this.#bodyText = bodyText;

     this.#element = this.createElement();
   }

   static hidePreviousInstance() {
     const existingNotifications = Array.from(document.getElementsByClassName('notification'));
     existingNotifications.forEach(notification => notification.remove());
   }

   get duration() {
     return this.#duration;
   }

   get element() {
     return this.#element;
   }

   destroy() {
     this.remove();
     this.#element = null;
   }

   remove() {
     if (!this.#element) {
       return;
     }

     this.#element.remove();
   }

   show(node = null) {
     NotificationMessage.hidePreviousInstance();
     const container = node ?? document.body;

     container.append(this.#element);

     this.startDuration();
   }

   createElement() {
     const element = document.createElement('div');
     element.style.setProperty('--value', this.getTimeoutString());
     element.classList.add('notification');
     element.classList.add(this.#type);

     element.innerHTML = `
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.#headerText}</div>
          <div class="notification-body">${this.#bodyText}</div>
       </div>
     `;

     return element;
   }

   getTimeoutString() {
     return `${this.#duration / 1000}s`;
   }

   startDuration() {
     setTimeout(() => this.remove(), this.#duration);
   }

   validateType(type) {
     if (!Object.values(NotificationMessageType).includes(type)) {
       throw new Error('Invalid notification type provided. Only "error" or "success" allowed');
     }
   }

   validateDuration(duration) {
     if (typeof duration !== 'number' || isNaN(duration) || !isFinite(duration)) {
       throw new Error('Invalid duration provided');
     }
   }
}
