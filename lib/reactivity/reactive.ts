import { track, trigger } from "./effect";
import { isPlainObject } from "../shared";

enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const isReactive = (value: any): boolean =>
  value[ReactiveFlags.IS_REACTIVE];
export const reactive = <T extends object>(target: T): T => {
  if (isReactive(target)) {
    return target;
  }
  return new Proxy<T>(target, {
    get(target, prop, receiver) {
      if (prop === ReactiveFlags.IS_REACTIVE) {
        return true;
      }
      track("get", target, prop);
      const value = (target as any)[prop];
      if (isPlainObject(value)) {
        // return proxy value
        return reactive(value);
      }
      // return normal value
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      trigger("set", target, prop);
      return Reflect.set(target, prop, value, receiver);
    },
  });
};
