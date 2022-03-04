import { EffectFn, Fn } from "../types";
import { isArray } from "../shared";

// target -> prop -> [fn,fn]

let id = 0;
let activeEffectFn: EffectFn | null = null;
const stack: EffectFn[] = [];

function getActiveEffectFn() {
  return stack[stack.length - 1] ?? null;
}

const targetMap = new WeakMap();
export const trigger = (
  type: "add" | "set",
  target: object,
  prop: string | symbol
) => {
  const depMap = targetMap.get(target);
  if (!depMap) {
    return;
  }
  const effectFns = [...(depMap.get(prop) ?? [])];
  switch (type) {
    case "add":
      if (isArray(target)) {
        const lengthEffect = depMap.get("length");
        effectFns.push(...lengthEffect);
      }
      break;
    default:
      break;
  }
  // console.log('effect', effectFns);
  effectFns.forEach((fn: EffectFn) => {
    if (fn.scheduler) {
      fn.scheduler();
    } else {
      fn();
    }
  });
};

export const track = (type: string, target: object, prop: string | symbol) => {
  if (!activeEffectFn) {
    return;
  }
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map());
  }
  const depMap = targetMap.get(target);
  if (!depMap.has(prop)) {
    depMap.set(prop, new Set());
  }
  const effectSet = depMap.get(prop);
  if (!effectSet.has(activeEffectFn)) {
    effectSet.add(activeEffectFn);
  }
};

interface EffectOptions {
  lazy?: boolean;
  scheduler?: EffectFn["scheduler"];
}

const createReactiveEffect = (fn: EffectFn) => {
  return () => {
    stack.push(fn);
    activeEffectFn = getActiveEffectFn();
    const result = fn(); // trigger get method to collect dep
    stack.pop();
    activeEffectFn = getActiveEffectFn();
    return result;
  };
};
export const effect = (fn: Fn, options?: EffectOptions) => {
  const effectFn = fn as EffectFn;
  id++;
  effectFn.id = id;
  effectFn.scheduler = options?.scheduler;
  const reactiveEffect = createReactiveEffect(effectFn);
  if (!options?.lazy) {
    reactiveEffect(); // trigger get method to collect dep
  }
  return reactiveEffect;
};
