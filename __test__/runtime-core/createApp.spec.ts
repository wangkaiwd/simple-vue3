// import { createApp, defineComponent, h, reactive } from 'vue';
import { createApp, h, nextTick, onMounted, reactive, ref } from '../../lib';

describe('RuntimeCore/CreateApp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });
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
  it('should update with different element', () => {
    const app = document.createElement('div');
    const App = {
      name: 'App',
      setup () {
        const visible = ref(false);
        setTimeout(() => {
          visible.value = true;
        }, 1000);
        return {
          visible
        };
      },
      render () {
        return this.visible ? h('h2', {}, 1) : h('h3', {}, 2);
      }
    };
    createApp(App).mount(app);
    expect(app.children.length).toBe(1);
    expect(app.children[0].outerHTML).toBe('<h3>2</h3>');

    jest.runOnlyPendingTimers();
    expect(app.children[0].outerHTML).toBe('<h2>1</h2>');
  });
  it('should update when children is text', () => {
    const app = document.createElement('div');
    const App = {
      name: 'App',
      setup () {
        const visible = ref(false);
        setTimeout(() => {
          visible.value = true;
        }, 1000);
        return {
          visible
        };
      },
      render () {
        return this.visible ? h('h2', {}, 1) : h('h2', {}, 2);
      }
    };
    createApp(App).mount(app);
    expect(app.children.length).toBe(1);
    expect(app.children[0].outerHTML).toBe('<h2>2</h2>');

    jest.runOnlyPendingTimers();
    expect(app.children[0].outerHTML).toBe('<h2>1</h2>');
  });
  it('should async update', () => {
    const app = document.createElement('div');
    const App = {
      name: 'App',
      setup () {
        const visible = ref(false);
        onMounted(() => {
          visible.value = true;
          expect(app.children[0].outerHTML).toBe('<h2>2</h2>');
          nextTick(() => {
            expect(app.children[0].outerHTML).toBe('<h2>1</h2>');
          });
        });
        return {
          visible
        };
      },
      render () {
        return this.visible ? h('h2', {}, 1) : h('h2', {}, 2);
      }
    };
    createApp(App).mount(app);
  });
});
