import { patch } from "../runtime-core/patch";

export const createApp = (rootComponent: any, rootProps?: any) => {
  const app = {
    mount(selector: string | HTMLElement) {
      const container =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      const { setup, render } = rootComponent;
      const setupState = setup(
        {},
        { emit: {}, attrs: rootProps, expose: () => {}, slots: {} }
      );
      const subTree = render.call(setupState);
      patch(subTree, null, container);
    },
  };
  return app;
};
