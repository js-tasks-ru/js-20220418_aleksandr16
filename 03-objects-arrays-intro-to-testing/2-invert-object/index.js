/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (typeof obj === 'undefined') {
    return void 0;
  }

  return Object.entries(obj).reduce((result, [key, value]) => {
    result[String(value)] = key;
    return result;
  }, {});
}
