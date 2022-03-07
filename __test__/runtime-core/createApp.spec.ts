// import { createApp, defineComponent, h, reactive } from 'vue';
import { createApp, h, reactive } from '../../lib';

describe('RuntimeCore/CreateApp', () => {
  it('should render root component', () => {
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
    expect(app.children.length).toBe(1);
    expect(app.children[0].outerHTML).toBe('<h2>xx</h2>');
  });
  it.skip('should update dom after reactive data update', (done) => {
    const app = document.createElement('div');
    const App = {
      name: 'App',
      setup () {
        const state = reactive({ name: 'xx', age: 10 });
        setTimeout(() => {
          state.name = 'yyy';
          expect(app.children[0].outerHTML).toBe('<h2>yyy</h2>');
          done();
        }, 1000);
        return {
          state
        };
      },
      render () {
        return h('h2', {}, this.state.name);
      }
    };
    createApp(App).mount(app);
  });
});
