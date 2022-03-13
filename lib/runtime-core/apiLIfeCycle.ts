import { getCurrentInstance, setCurrentInstance } from "./components";

enum LifecycleHooks {
  MOUNTED = "m",
}

const injectHook = (type, hook, target) => {
  const hooks = (target[type] = target[type] || []);
  const wrapper = () => {
    // cache instance in advance
    // set cached instance before execute hook
    setCurrentInstance(target);
    hook();
    setCurrentInstance(null);
  };
  hooks.push(wrapper);
};
const createHook =
  (type) =>
  (hook, target = getCurrentInstance()) =>
    injectHook(type, hook, target);

export const onMounted = createHook(LifecycleHooks.MOUNTED);
