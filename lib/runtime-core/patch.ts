import { isBuiltInHtmlTag } from "../shared/utils";

function mountElement(n1, container) {
  const { type, children } = n1;
  const el = (n1.el = document.createElement(type));
  children.forEach((child) => {
    if (typeof child === "string") {
      el.innerHTML = child;
    } else {
      patch(n1, null, el);
    }
  });
  container.appendChild(el);
}

const mount = (n1, container) => {
  const { type } = n1;
  if (isBuiltInHtmlTag(type)) {
    mountElement(n1, container);
  }
};

// const update = (n1, n2, container) => {
//
// };
export const patch = (n1, n2, container) => {
  if (!n2) {
    mount(n1, container);
  }
};
