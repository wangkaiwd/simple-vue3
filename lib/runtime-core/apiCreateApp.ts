import { createVNode } from "./vnode";

function createAppContext() {
  return {
    app: null,
    config: {},
    directives: {},
    components: {},
  };
}

let uid = 0;
export const apiCreateApp = (render) => {
  return function createApp(rootComponent, rootProps) {
    const context = createAppContext();

    const app = (context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      use() {},
      mount(container) {
        const vnode = createVNode(rootComponent, rootProps);
        render(vnode, container);
      },
    });
    return app;
  };
};
