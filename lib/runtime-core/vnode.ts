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
