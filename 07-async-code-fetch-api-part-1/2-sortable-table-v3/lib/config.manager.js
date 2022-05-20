import {stringComparator} from "../utils/string.comparator.js";
import {numberComparator} from "../utils/number.comparator.js";

export const SortType = {
  NUMBER: 'number',
  STRING: 'string',
};

export default class ConfigManager {
  static #comparators = {
    [SortType.STRING]: stringComparator,
    [SortType.NUMBER]: numberComparator
  };

  #config;

  constructor(config) {
    this.validateConfig(config);
    this.#config = this.createConfig(config);
  }

  get config() {
    return this.#config;
  }

  getComparator(sort) {
    if (!sort) {
      return;
    }
    return ConfigManager.#comparators[sort.type](sort.direction);
  }

  validateConfig(config) {
    if (!config.every((item) => !!item.id)) {
      throw new Error('Each column must have an id field');
    }

    if (!config.reduce((isValid, item) => {
      if (!('sortType' in item)) {
        return isValid;
      }

      if (!Object.values(SortType).includes(item.sortType)) {
        isValid = false;
      }

      return isValid;
    }, true)) {
      throw new Error('Invalid sortType provided');
    }
  }

  createConfig(config) {
    this.validateConfig(config);
    return config.reduce((config, item) => {
      const { id, ...rest } = item;
      config[id] = rest;
      return config;
    }, {});
  }
}
