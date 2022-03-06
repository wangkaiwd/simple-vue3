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
  type: any,
  props: Record<string, any>,
  children: any | any[]
) => {
  if (!isArray(children)) {
    children = [children];
  }
  return createVNode(type, props, children);
};
