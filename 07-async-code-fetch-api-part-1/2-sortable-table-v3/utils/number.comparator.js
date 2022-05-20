import {SortDirection} from "../index.js";

export const numberComparator = direction => {
  switch (direction) {
  case SortDirection.ASC:
    return (valueA, valueB) => valueA - valueB;
  case SortDirection.DESC:
    return (valueA, valueB) => valueB - valueA;
  default:
    throw new Error('Invalid sort direction provided');
  }
};
