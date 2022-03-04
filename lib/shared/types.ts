const toType = (value: any): string =>
  Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase();

export const isPlainObject = (value: any): value is object =>
  toType(value) === "object";

export const isObject = (value: any): value is object =>
  typeof value === "object" && value !== null;
export const isArray = Array.isArray;

// https://stackoverflow.com/a/175787/12819402
export const isStringNumber = (value: string) => {
  const num = Number(value);
  return !Number.isNaN(num);
};
