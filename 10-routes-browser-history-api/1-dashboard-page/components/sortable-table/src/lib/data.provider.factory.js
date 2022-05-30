import {TableDataMode} from "../index.js";
import DataLocalProvider from "./data.local.provider.js";
import DataRemoteProvider from "./data.remote.provider.js";

export default class DataProviderFactory {
  #url;
  #data;

  constructor(url, data) {
    this.#url = url;
    this.#data = data;
  }

  createProvider(mode) {
    switch (mode) {
    case TableDataMode.LOCAL:
      return new DataLocalProvider(this.#data);
    case TableDataMode.REMOTE:
      return new DataRemoteProvider(this.#url);
    default:
      return new DataLocalProvider(this.#data);
    }
  }
}
