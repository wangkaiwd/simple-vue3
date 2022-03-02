// target -> prop -> [fn,fn]
// a,b,c
//
import { track, trigger } from "./effect";

export const reactive = (target: object) =>
  new Proxy(target, {
    get(target, prop, receiver) {
      track("get", target, prop);
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      trigger("set", target, prop);
      return Reflect.set(target, prop, value, receiver);
    },
  });

export * from "./effect";
