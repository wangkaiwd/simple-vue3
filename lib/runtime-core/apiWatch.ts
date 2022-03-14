import { effect } from "../reactivity";
import { hasChanged } from "../shared/helpers";
import { queueJob } from "./schedular";

const doWatch = (source, cb, options) => {
  let getter;
  if (typeof source !== "function") {
    getter = () => source;
  } else {
    getter = source;
  }
  let oldValue;
  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      queueJob(() => {
        const newValue = getter();
        if (hasChanged(newValue, oldValue)) {
          cb(newValue, oldValue);
        }
      });
    },
  });
  // collect variable dep which inside getter
  oldValue = effectFn();
  if (options.immediate) {
    cb(undefined, oldValue);
  }
};
export const watch = (source, cb, options = {}) => {
  return doWatch(source, cb, options);
};
