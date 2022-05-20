import {TableDataMode} from "../index.js";

export default class DataLocalProvider {
   #data;

   constructor(initialData = []) {
     this.#data = initialData;
   }

   get mode() {
     return TableDataMode.REMOTE;
   }

   async getData(_ = {}) {
     return Promise.resolve(this.#data);
   }
}
