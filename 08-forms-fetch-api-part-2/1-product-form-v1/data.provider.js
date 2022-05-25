import fetchJson from "./utils/fetch-json.js";
import escapeHtml from "./utils/escape-html.js";

const BACKEND_URL = 'https://course-js.javascript.ru';
const IMGUR_URL = 'https://api.imgur.com/3/image';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';

export default class DataProvider {
  static PRODUCTS_URL = 'api/rest/products';
  static CATEGORIES_URL = 'api/rest/categories';

  async getProduct(id) {
    const url = new URL(`${DataProvider.PRODUCTS_URL}?id=${id}`, BACKEND_URL);
    try {
      const response = await fetchJson(url);
      return response[0];
    } catch (e) {
      console.error(e.message);
      return null;
    }
  }

  async getCategories() {
    const url = new URL(`${DataProvider.CATEGORIES_URL}?_sort=weight&_refs=subcategory`, BACKEND_URL);
    try {
      const response = await fetchJson(url);
      return response.reduce((categories, { id, title, subcategories }) => {
        if (subcategories.length) {
          subcategories.forEach((sub) => {
            categories.push({
              value: sub.id,
              label: `${title} > ${sub.title}`
            });
          });
          return categories;
        }

        categories.push({
          value: id,
          label: title
        });

        return categories;

      }, []);
    } catch (e) {
      console.error(e.message);
      return [];
    }
  }

  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.set('image', file);
      const { status, success, data } = await fetchJson(IMGUR_URL, {
        method: 'POST',
        headers: {
          authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
      });

      if (!success) {
        return null;
      }

      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async saveItem(values) {
    const {
      id = null,
      title,
      description,
      discount,
      status,
      subcategory,
      quantity,
      images,
      price
    } = values;

    const body = {
      title: escapeHtml(title),
      description: escapeHtml(description),
      discount,
      status,
      subcategory,
      quantity,
      images,
      price
    };

    if (id) {
      body.id = id;
    }

    try {
      const url = new URL(DataProvider.PRODUCTS_URL, BACKEND_URL);
      return await fetchJson(url, {
        method: id ? 'PATCH' : 'PUT',
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      });

    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
