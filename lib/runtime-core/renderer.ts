import { apiCreateApp } from "./apiCreateApp";
import { isBuiltInHtmlTag } from "../shared/utils";
import { effect, unref } from "../reactivity";
import { isSameVNode } from "./vnode";

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
    };
  };
  const proxyRefs = (setupResult) => {
    return new Proxy(setupResult, {
      get(target, prop) {
        return unref(target[prop]);
      },
    });
  };
  const handleSetupResult = (instance, setupResult) => {
    instance.setupState = proxyRefs(setupResult);
  };
  const setupStatefulComponent = (instance) => {
    const { type, props, slots, attrs, emit, expose } = instance;
    const setupResult = type.setup(props, { slots, attrs, emit, expose });
    handleSetupResult(instance, setupResult);
  };
  const setupComponent = (instance) => {
    instance.props = {};
    instance.slots = {};
    setupStatefulComponent(instance);
  };
  const setupRenderReactive = (instance, container, anchor) => {
    let isMounted = false;
    const componentUpdateFn = () => {
      const { render, setupState } = instance;
      if (!isMounted) {
        const subTree = (instance.subTree = render.call(setupState));
        patch(null, subTree, container, anchor);
        isMounted = true;
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
    const { type, children } = n2;
    const el = (n2.el = nodeOps.createElement(type));
    children.forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        nodeOps.setTextContent(el, child);
      } else {
        patch(null, child, el, anchor);
      }
    });
    nodeOps.insert(el, container, anchor);
  };
  const updateElement = (n1, n2, container, anchor) => {
    if (isSameVNode(n1, n2)) {
      console.log(n1, n2);
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
      updateElement(n1, n2, container, anchor);
    }
  };
  const patch = (n1, n2, container, anchor = null) => {
    const { type } = n2;
    if (isBuiltInHtmlTag(type)) {
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
