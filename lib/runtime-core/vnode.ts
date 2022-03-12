export const createVNode = (
  type: any,
  props: Record<string, any>,
  children: any[] = []
) => {
  const { key, ...rest } = props;
  const normalized = children.map((child) => {
    if (typeof child === "string" || typeof child === "number") {
      return {
        type: "text",
        key: null,
        props: null,
        children: child,
      };
    }
    return child;
  });
  return {
    type,
    key,
    props: rest,
    children: normalized,
  };
};

export const isSameVNode = (n1, n2): boolean =>
  n1.type === n2.type && n1.key === n2.key;
