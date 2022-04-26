/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0 || !string) {
    return '';
  }

  if (typeof size === 'undefined') {
    return string;
  }

  let currentLetterCount = 0;
  let resultChars = [];

  for (let i = 0; i < string.length; ++i) {
    if (i === 0 || string[i] !== string[i - 1]) {
      currentLetterCount = 1;
      resultChars.push(string[i]);
      continue;
    }

    if (currentLetterCount < size) {
      currentLetterCount++;
      resultChars.push(string[i]);
    }
  }

  return resultChars.join('');
}
