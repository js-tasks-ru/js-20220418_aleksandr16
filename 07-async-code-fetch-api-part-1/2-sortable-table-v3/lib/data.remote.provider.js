import fetchJson from "../utils/fetch-json.js";
import {TableDataMode} from "../index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class DataRemoteProvider {
  #url;

  constructor(url) {
    this.#url = url;
  }

  get mode() {
    return TableDataMode.REMOTE;
  }

  async getData(filter = {}) {
    const params = {
      _embed: 'subcategory.category',
      _start: String(filter.currentPage * filter.pageSize - filter.pageSize),
      _end: String(filter.currentPage * filter.pageSize),
    };

    if (filter.sort?.id && filter.sort?.direction) {
      params._sort = filter.sort.id;
      params._order = filter.sort.direction;
    }

    const urlParams = new URLSearchParams(params);

    try {
      return await fetchJson(`${BACKEND_URL}/${this.#url}?${urlParams}`);
    } catch (e) {
      return [];
    }
  }
}
