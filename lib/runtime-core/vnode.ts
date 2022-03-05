export const createVNode = (
  tag: any,
  key: string | number,
  props: Record<string, any>,
  children: any[]
) => {
  return {
    tag,
    key,
    props,
    children,
  };
};
