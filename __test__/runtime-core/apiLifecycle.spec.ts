import { createApp, h, onMounted } from '../../lib';

describe('RuntimeDOM:lifeCycle', () => {
  let app = null;
  beforeEach(() => {
    app = document.createElement('div');
  });
  it('onMounted', () => {
    const fn = jest.fn(() => {
      expect(app.children[0].outerHTML).toBe(`<h2>hello</h2>`);
    });
    const Comp = {
      setup () {
        onMounted(fn);
        return {};
      },
      render () {
        return h('h2', {}, 'hello');
      }
    };
    createApp(Comp).mount(app);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
