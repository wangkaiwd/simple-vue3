// import { createApp, defineComponent, h, reactive } from 'vue';
import { createApp, h, reactive } from '../../lib';

describe('RuntimeCore/CreateApp', () => {
  it('should ', () => {
    const app = document.createElement('div');
    const App = {
      name: 'App',
      setup () {
        const state = reactive({ name: 'xx', age: 10 });
        return {
          state
        };
      },
      render () {
        return h('h2', {}, this.state.name);
      }
    };
    createApp(App).mount(app);
    console.log('app', app.outerHTML);
    expect(app.children.length).toBe(1);
    expect(app.children[0].outerHTML).toBe('<div><h2>xx</h2></div>');
  });
});
