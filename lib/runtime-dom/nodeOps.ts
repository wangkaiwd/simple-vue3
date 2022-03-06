export const nodeOps = {
  insert(child, parent, anchor) {
    return parent.insertBefore(child, anchor);
  },
  remove(node) {
    return node.remove();
  },
  createElement(tag) {
    return document.createElement(tag);
  },
  createText(text) {
    return document.createTextNode(text);
  },
  setTextContent(element, text) {
    element.textContent = text;
  },
  parentNode(node) {
    node.parentNode();
  },
  nextSibling(node) {
    node.nextSibling();
  },
};
