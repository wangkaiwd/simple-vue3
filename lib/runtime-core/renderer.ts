import { apiCreateApp } from "./apiCreateApp";
import { invokeArrayFns, isBuiltInHtmlTag } from "../shared/utils";
import { effect } from "../reactivity";
import { isSameVNode } from "./vnode";
import { getCurrentInstance, setupComponent } from "./components";
import { getSequence } from "./getSequence";

let uid = 0;
export const createRenderer = (nodeOps) => {
  const createComponentInstance = (vnode) => {
    return {
      uid: uid++,
      type: vnode.type,
      vnode,
      setupState: null,
      render: null,
      props: null,
      attrs: {},
      emit: {},
      expose: null,
      slots: null,
      subTree: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
    };
  };
  const setupRenderReactive = (instance, container, anchor) => {
    let isMounted = false;
    const componentUpdateFn = () => {
      const { render, setupState } = instance;
      if (!isMounted) {
        const subTree = (instance.subTree = render.call(setupState));
        patch(null, subTree, container, anchor);
        isMounted = true;
        const { m } = instance;
        if (m) {
          invokeArrayFns(m);
          console.log("current", getCurrentInstance());
        }
      } else {
        const prevSubTree = instance.subTree;
        const subTree = (instance.subTree = render.call(setupState));
        patch(prevSubTree, subTree, container, anchor);
      }
    };
    instance.update = effect(componentUpdateFn);
  };
  const mountComponent = (n2, container, anchor) => {
    // 1. create component instance
    const instance = createComponentInstance(n2);
    // 2. execute setup function
    // 3. get setup return value and then execute render with it
    setupComponent(instance);
    instance.render = instance.type.render;
    setupRenderReactive(instance, container, anchor);
  };

  const processComponent = (n1, n2, container, anchor) => {
    if (!n1) {
      mountComponent(n2, container, anchor);
    }
  };

  const mountElement = (n2, container, anchor) => {
    const { type, children, props } = n2;
    const el = (n2.el = nodeOps.createElement(type));
    patchProperties(el, {}, props);
    children.forEach((child) => patch(null, child, el, anchor));
    nodeOps.insert(el, container, anchor);
  };
  const patchProperties = (el, prev, next) => {
    for (const key in next) {
      nodeOps.patchProp(el, key, prev[key], next[key]);
    }
    for (const key in prev) {
      if (!(key in next)) {
        el.setAttribute(key, "");
      }
    }
  };
  // c1: old children, c2: new children
  const patchKeyedChildren = (c1, c2, container, anchor) => {
    // double pointer
    let i = 0;
    let e1 = c1.length - 1; // old children end index
    let e2 = c2.length - 1; // new children end index

    // 1. sync from start:
    //    (a b) c
    //    (a b) d e
    // i = 2, e1 = 2, e2 = 3
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, container, anchor);
        i++;
      } else {
        break;
      }
    }
    // 2. sync from end:
    //    a (b c)
    //    d e (b c)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, container, anchor);
        e1--;
        e2--;
      } else {
        break;
      }
    }
    // 3. common sequence + mount
    //    (a b)
    //    (a b) c
    //    i = 2, e1 = 1, e2 = 2
    //    (a b)
    //    c (a b)
    //    i = 0, e1 = -1, e2 = 0
    if (i > e1) {
      // old vnode will be full iterate from start or end
      if (i <= e2) {
        // old vnode the same as new vnode , i === e2 is true
        const nextPos = e2 + 1;
        // find e2 next element, it has same vnode in c1
        const reference = nextPos < c2.length ? c2[nextPos].el : null;
        while (i <= e2) {
          // insert new vnode
          const n2 = c2[i];
          patch(null, n2, container, reference);
          i++;
        }
      }
    }
    // 4. common sequence + unmount
    //    (a b) c
    //    (a b)
    //    i = 2, e1 = 2, e2 = 1
    //    a (b c)
    //    (b c)
    //    i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
      // new vnode will be full iterate from start or end
      if (i <= e1) {
        while (i <= e1) {
          nodeOps.remove(c1[i].el);
          i++;
        }
      }
    }
    // 5. unknown sequence
    //    [i ... e1 + 1]: a b [c d e] f g
    //    [i ... e2 + 1]: a b [e d c h] f g
    //    i = 2, e1 = 4, e2 = 5
    else {
      const s1 = i; // prev starting index
      const s2 = i; // next starting index
      // 5.1 build key:index map for newChildren
      const keyToNewIndexMap = new Map();
      for (let i = s2; i <= e2; i++) {
        keyToNewIndexMap.set(c2[i].key, i);
      }
      // s2 -> e2
      const toBePatched = e2 - s2 + 1;
      // [0,...,0]
      // 0 is a special value indicating the new node has no correspond old node.
      // used for determining longest stable subsequence
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0);
      // loop old children
      for (let i = s1; i <= e1; i++) {
        const n1 = c1[i];
        const { key } = n1;
        const newIndex = keyToNewIndexMap.get(key);
        if (newIndex === undefined) {
          // new children have not this vnode which in old children
          nodeOps.remove(n1.el); // delete redundant old real node
        } else {
          // reuse
          // newIndex in map will from zero start
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          patch(n1, c2[newIndex], container, anchor);
        }
      }
      //    [i ... e1 + 1]: a b [d h e c] f g
      //    [i ... e2 + 1]: a b [e d c h x] f g
      // [5,3,6,4,0]
      // move new children and insert new vnode
      const increaseNewIndexSequence = getSequence(newIndexToOldIndexMap);
      // [0,2]
      // increase new index correspond node keep origin position, then move other node to correct position
      // looping backwards so that we can use last patched node as anchor
      for (let i = e2; i >= s2; i--) {
        const oldIndex = newIndexToOldIndexMap[i - s2];
        const nextChild = c2[i + 1];
        const reference = nextChild ? nextChild.el : null;
        if (oldIndex === 0) {
          // insert new node
          patch(null, c2[i], container, reference);
        } else if (!increaseNewIndexSequence.includes(i - s2)) {
          // move to correct position
          nodeOps.insert(c1[oldIndex - 1].el, container, reference);
        } else {
          console.log("remain unchange");
        }
      }
    }
  };
  const patchChildren = (n1, n2, container, anchor) => {
    const el = (n2.el = n1.el);
    const c1 = n1.children;
    const c2 = n2.children;
    if (c1 && c2) {
      patchKeyedChildren(c1, c2, el, anchor);
    } else {
      nodeOps.remove(n1.el);
      c2?.forEach((vnode) => {
        patch(null, vnode, container, anchor);
      });
    }
  };
  const patchElement = (n1, n2, container, anchor) => {
    if (isSameVNode(n1, n2)) {
      patchChildren(n1, n2, container, anchor);
    } else {
      // n2 replace n1
      nodeOps.remove(n1.el);
      patch(null, n2, container, anchor);
    }
  };
  const processElement = (n1, n2, container, anchor) => {
    if (!n1) {
      mountElement(n2, container, anchor);
    } else {
      patchElement(n1, n2, container, anchor);
    }
  };
  const processText = (n2, container) => {
    nodeOps.setTextContent(container, n2.children);
  };
  const patch = (n1, n2, container, anchor = null) => {
    const { type } = n2;
    if (n1) {
      n2.el = n1.el;
    }
    if (type === "text") {
      processText(n2, container);
    } else if (isBuiltInHtmlTag(type)) {
      // built in element
      processElement(n1, n2, container, anchor);
    } else {
      // component
      processComponent(n1, n2, container, anchor);
    }
  };

  const render = (vnode, container) => {
    patch(container._vnode || null, vnode, container);
    // _vnode is old vnode
    container._vnode = vnode;
  };

  return {
    render,
    patch,
    createApp: apiCreateApp(render),
  };
};
