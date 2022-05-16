import { SortDirection } from "../index.js";

export const stringComparator = direction => {
  const locales = ['ru', 'en'];
  const sortParams = { caseFirst: 'upper'};

  switch (direction) {
  case SortDirection.ASC:
    return (valueA, valueB) => valueA.localeCompare(valueB, locales, sortParams);
  case SortDirection.DESC:
    return (valueA, valueB) => valueB.localeCompare(valueA, locales, sortParams);
  default:
    throw new Error('Invalid sort direction provided');
  }
};
