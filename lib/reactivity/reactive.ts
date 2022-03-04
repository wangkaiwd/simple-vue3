import { track, trigger } from "./effect";
import { isArray, isObject, isStringNumber } from "../shared";
import { ProxyHandler } from "../types";
import { hasChanged } from "../shared/helpers";

enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

function createGetter(isShallow: boolean = false, isReadonly: boolean = false) {
  return function <T extends object>(
    target: T,
    prop: string | symbol,
    receiver: any
  ): any {
    // console.log('get-prop', prop);
    if (prop === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    const result = Reflect.get(target, prop, receiver);

    // if (isArray(target) && !isStringNumber(prop as string) && prop !== 'length') {
    //   // omit push
    // } else {
    //   track('get', target, prop);
    // }
    track("get", target, prop);
    if (!isShallow && !isReadonly && isObject(result)) {
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
    // console.log('set-prop', prop);
    const hasKey = isArray(target)
      ? !(isStringNumber(prop as string) && Number(prop) >= target.length)
      : prop in target;
    const result = Reflect.set(target, prop, value, receiver);
    if (prop !== "length" && !hasChanged(value, (target as any)[prop])) {
      trigger(hasKey ? "set" : "add", target, prop);
    }
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
  if (!isObject(target)) {
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
