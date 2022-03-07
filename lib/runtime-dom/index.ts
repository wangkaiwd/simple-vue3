import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { createRenderer } from "../runtime-core/renderer";

export const createApp = (rootComponent: any, rootProps?: any) => {
  const app = createRenderer({ patchProp, ...nodeOps }).createApp(
    rootComponent,
    rootProps
  );
  const mount = app.mount;
  app.mount = (container) => {
    container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    container.innerHTML = "";
    return mount(container);
  };
  return app;
};

export * from "./nodeOps";
