import { unref } from "../reactivity";

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
  const setupResult = type.setup(props, { slots, attrs, emit, expose });
  handleSetupResult(instance, setupResult);
};
export const setupComponent = (instance) => {
  instance.props = {};
  instance.slots = {};
  setupStatefulComponent(instance);
};
