const patchClass = (el, next) => {
  el.className = next;
};

const patchStyle = (el, prev, next) => {
  for (const key in next) {
    if (!(key in prev)) {
      el.style[key] = next[key];
    }
  }
  for (const key in prev) {
    if (!(key in next)) {
      el.style[key] = "";
    }
  }
};

function createInvoker(next) {
  function invoker(e) {
    invoker.value(e);
  }

  invoker.value = next;
  return invoker;
}

const patchEvents = (el, key, next) => {
  const event = key.slice(2).toLowerCase();
  // vei = vue event invokers
  const invokers = (el._vei = el._vei || {});
  const existingInvoker = invokers[key];
  if (existingInvoker) {
    // existingInvoker
    if (next) {
      // change
      existingInvoker.value = next;
    } else {
      el.removeEventListener(event, existingInvoker);
      invokers[key] = undefined;
    }
  } else if (next) {
    const invoker = (invokers[key] = createInvoker(next));
    el.addEventListener(event, invoker);
  }
};

// start with on then is non a-z
const onRE = /^on[^a-z]/;

export const patchProp = (el: HTMLElement, key: string, prev, next) => {
  if (key === "class") {
    patchClass(el, next);
  } else if (key === "style") {
    patchStyle(el, prev, next);
  } else if (onRE.test(key)) {
    // else
    patchEvents(el, key, next); //
  } else {
    el.setAttribute(key, next);
  }
};
