import { unref } from "../reactivity";

let currentInstance = null;
export const getCurrentInstance = () => {
  return currentInstance;
};

export const setCurrentInstance = (instance) => {
  currentInstance = instance;
};

const proxyRefs = (setupResult) => {
  return new Proxy(setupResult, {
    get(target, prop) {
      return unref(target[prop]);
    },
  });
};

export const handleSetupResult = (instance, setupResult) => {
  instance.setupState = proxyRefs(setupResult);
};

export const setupStatefulComponent = (instance) => {
  const { type, props, slots, attrs, emit, expose } = instance;
  setCurrentInstance(instance);
  const setupResult = type.setup(props, { slots, attrs, emit, expose });
  setCurrentInstance(null);
  handleSetupResult(instance, setupResult);
};
export const setupComponent = (instance) => {
  instance.props = {};
  instance.slots = {};
  setupStatefulComponent(instance);
};
