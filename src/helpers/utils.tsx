import { ENUM } from "./constants";

export const isEmpty = (values: any) => {
  if (values === undefined || values === null) {
    return true;
  }
  if (Array.isArray(values)) {
    return values.length === 0;
  }
  if (typeof values === "object" && !Array.isArray(values)) {
    return Object.keys(values).length === 0;
  }
  return false;
};

export const splitValueBYPattern = /\r|\r\n|\n/;

export const getSplitter = (values: string) => {
  return values.includes(ENUM.EQUALTO)
    ? ENUM.EQUALTO
    : values.includes(ENUM.COMMA_SEPARATED)
    ? ENUM.COMMA_SEPARATED
    : ENUM.BLANK_SPACE;
};

export const splitAddress = (values: string) => {
  const splitter = getSplitter(values);
  return values.split(splitter);
};

export const validationByPattern = (values: string[]) => {
  const errorArr: string[] = [];
  if (isEmpty(values)) {
    errorArr.push(`Ethereum address and amount required.`);
    return errorArr;
  }
  values.forEach((x, index) => {
    const lineNo = index + 1;
    const item = splitAddress(x);
    if (!x.startsWith(ENUM.OX)) {
      errorArr.push(`Line ${lineNo} invalid Ethereum address.`);
    } else if (item[0].length !== 42) {
      errorArr.push(`Line ${lineNo} invalid Ethereum address and wrong amount`);
    } else if (item[1] === "" || isNaN(+item[1])) {
      errorArr.push(`Line ${lineNo} wrong amount`);
    }
  });
  return errorArr;
};

export const findDuplicates = (values: string[]) => {
  const items: (string | number)[][] = values.map((x, index) => {
    const item: (string | number)[] = splitAddress(x);
    item[2] = index;
    return item;
  });

  const duplicates: any = {};
  items.forEach((item, index) => {
    const firstIndex = items?.findIndex((v) => v[0] === item[0]);
    const lastIndex = items?.map((v) => v[0]).lastIndexOf(item[0]);

    if (firstIndex !== lastIndex && !duplicates[item[0]]) {
      duplicates[item[0]] = {
        index,
        list: items?.filter((v) => v[0] === item[0]),
      };
    }
  });

  return duplicates;
};
