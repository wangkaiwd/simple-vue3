import { track, trigger } from "./effect";
import { isPlainObject } from "../shared";
import { ProxyHandler } from "../types";

enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

function createGetter(isShallow: boolean = false, isReadonly: boolean = false) {
  return function <T extends object>(
    target: T,
    prop: string | symbol,
    receiver: any
  ): any {
    if (prop === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // console.log('prop', prop);
    track("get", target, prop);
    const result = Reflect.get(target, prop, receiver);
    if (!isShallow && !isReadonly && isPlainObject(result)) {
      // return proxy value
      return reactive(result);
    }
    // return normal value
    return result;
  };
}

function createSetter() {
  return function <T extends object>(
    target: T,
    prop: string | symbol,
    value: any,
    receiver: any
  ) {
    // first set value
    const result = Reflect.set(target, prop, value, receiver);
    trigger("set", target, prop);
    return result;
  };
}

export const isReactive = (value: any): boolean =>
  value[ReactiveFlags.IS_REACTIVE];
const basicHandler = {
  get: createGetter(),
  set: createSetter(),
};
const createReactiveObject = <T extends object>(
  target: T,
  handler: ProxyHandler<T>
) => {
  if (!isPlainObject(target)) {
    return target;
  }
  if (isReactive(target)) {
    return target;
  }
  return new Proxy<T>(target, handler);
};

export const reactive = <T extends object>(target: T): T =>
  createReactiveObject<T>(target, basicHandler);

const readonlyHandler = {
  get: createGetter(false, true),
};
export const readonly = <T extends object>(target: T) =>
  createReactiveObject<T>(target, readonlyHandler);

// why have this api ?
export const shallowReadonly = () => {};

const shallowHandler = {
  get: createGetter(true),
  set: createSetter(),
};
// non recursion reactive
export const shallowReactive = <T extends object>(target: T) =>
  createReactiveObject<T>(target, shallowHandler);
