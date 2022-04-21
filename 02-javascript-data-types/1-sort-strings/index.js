/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const locales = ['ru', 'en'];
  const sortParams = { caseFirst: 'upper'};
  return [...arr].sort((a, b) => {
    switch (param) {
    case 'asc':
      return a.localeCompare(b, locales, sortParams);
    case 'desc':
      return b.localeCompare(a, locales, sortParams);
    default:
      return a.localeCompare(b, locales, sortParams);
    }
  });
}
