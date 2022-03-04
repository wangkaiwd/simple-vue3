import { effect, reactive, ref, toRef } from '../../lib';

describe('Reactivity/Ref', () => {
  describe('create reactive object', () => {
    it('should take primitive value as parameter and return reactive object', () => {
      const counter = ref(0);
      const fn = jest.fn(() => counter.value);
      effect(fn);
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should take object value as parameter and return deeply reactive object with `reactive` method', () => {
      const proxy = ref({ name: 'xxx' });
      const fn = jest.fn(() => proxy.value.name);
      effect(fn);
      proxy.value.name = 'yyy';
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
// https://vuejs.org/api/reactivity-utilities.html#toref
describe('Reactivity/ToRef', () => {
  // toRef only a simple get/set class
  // note: fooRef = ref(state.foo) is not synced with state.foo
  it('should create a ref for a property on a source reactive object', () => {
    const state = reactive({ foo: 1, bar: 2 });
    const fooRef = toRef(state, 'foo');

    fooRef.value++;
    expect(state.foo).toBe(2);
    state.foo++;
    expect(fooRef.value).toBe(3);
  });
});
