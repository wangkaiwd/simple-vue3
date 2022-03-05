// create virtual node
import { createVNode } from "./vnode";
import { isArray } from "../shared";

// const vNode = {
//   tag: 'h2',
//   key: '1',
//   props: { id: 'x', class: 'y' },
//   children: ['hello', { tag: 'span', key: '2', props: { id: 'span' }, children: ['world'] }]
// };
export const h = (
  tag: any,
  props: Record<string, any>,
  children: any | any[]
) => {
  const { key, ...rest } = props;
  if (!isArray(children)) {
    children = [children];
  }
  return createVNode(tag, key, rest, children);
};
