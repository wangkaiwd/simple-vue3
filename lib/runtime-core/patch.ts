import { isBuiltInHtmlTag } from "../shared/utils";

function mountElement(n1, container) {
  const { tag, children } = n1;
  const el = (n1.el = document.createElement(tag));
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
  const { tag } = n1;
  if (isBuiltInHtmlTag(tag)) {
    mountElement(n1, container);
    // eslint-disable-next-line no-empty
  } else {
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
