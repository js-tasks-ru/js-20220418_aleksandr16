export default class EventObserver {
   #subscribers;

   constructor(subscribers = []) {
     this.#subscribers = subscribers;
   }

   subscribe(subscriber) {
     const index = this.#subscribers.push(subscriber);

     return {
       unsubscribe: () => {
         this.#subscribers.splice(index - 1, 1);
       }
     };
   }

   notify(data) {
     this.#subscribers.forEach((subscriber) => {
       subscriber(data);
     });
   }
}
