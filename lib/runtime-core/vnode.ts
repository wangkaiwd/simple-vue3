export const createVNode = (
  type: any,
  props: Record<string, any>,
  children: any[] = []
) => {
  const { key, ...rest } = props;
  return {
    type,
    key,
    props: rest,
    children,
  };
};

export const isSameVNode = (n1, n2): boolean => n1 === n2 && n1.key === n2.key;
