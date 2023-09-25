import { ENUM } from "./constants";

export const isEmpty = (values: string[]) => {
  return values === undefined || values == null || values.length <= 0
    ? true
    : false;
};

export const splitValueBYPattern = /\r|\r\n|\n/;

export const validationByPattern = (values: string[]) => {
  const errorArr: string[] = [];
  if (isEmpty(values)) {
    return [];
  }
  values.forEach((x, i) => {
    const index = i + 1;
    const splitter = x.includes(ENUM.EQUALTO)
      ? ENUM.EQUALTO
      : x.includes(ENUM.COMMA_SEPARATED)
      ? ENUM.COMMA_SEPARATED
      : ENUM.BLANK_SPACE;
    const item = x.split(splitter);

    if (!x.startsWith(ENUM.OX)) {
      errorArr.push(`Line ${index} invalid Ethereum address.`);
    } else if (item[0].length !== 42) {
      errorArr.push(`Line ${index} invalid Ethereum address and wrong amount`);
    } else if (isNaN(+item[1])) {
      errorArr.push(`Line ${index} wrong amount`);
    }
  });

  return errorArr;
};

export const findDuplicates = (values: string[]) => {
  if (isEmpty(values)) {
    return [];
  }
  return values.filter((item, index) => values.indexOf(item) !== index);
};
