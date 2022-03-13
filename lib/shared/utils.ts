export const isBuiltInHtmlTag = (tag: string) =>
  ["div", "h1", "h2", "h3", "span", "p", "ul", "li"].includes(tag);

type Fn = (...args: any[]) => void;

export const invokeArrayFns = (fns: Fn[]) => {
  fns.forEach((fn) => fn());
};
