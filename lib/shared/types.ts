const toType = (value: any): string =>
  Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase();

export const isPlainObject = (value: any): value is object =>
  toType(value) === "object";
