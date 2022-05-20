import fetchJson from "../utils/fetch-json.js";
import SortableTable, {TableDataMode} from "../index.js";

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
    const { currentPage = 1, pageSize = SortableTable.PAGE_SIZE, sort } = filter;

    const params = {
      _embed: 'subcategory.category',
      _start: String(currentPage * pageSize - pageSize),
      _end: String(currentPage * pageSize),
    };

    if (sort?.id && sort?.direction) {
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
