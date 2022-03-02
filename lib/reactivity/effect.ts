import { EffectFn } from "../types";

let activeEffectFn: EffectFn | null = null;
const targetMap = new WeakMap();
export const trigger = (
  type: string,
  target: object,
  prop: string | symbol
) => {
  const effectSet = targetMap.get(target)?.get(prop) ?? [];
  [...effectSet].forEach((fn: any) => fn());
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

export const effect = (fn: EffectFn) => {
  activeEffectFn = fn;
  fn();
};
