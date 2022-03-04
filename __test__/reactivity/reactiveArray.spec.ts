import { effect, reactive } from '../../lib';
// import { effect, reactive } from 'vue';

describe('Reactivity/Array', () => {
  it('should proxy array', () => {
    const proxy = reactive([1, 2, 3]);
    const fn = jest.fn(() => proxy[0]);
    effect(fn);
    proxy[0] = 100;
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it('should proxy new value by push', () => {
    const proxy = reactive([1, 2, 3]);
    // toJson,length,0,1,2
    const fn = jest.fn(() => JSON.stringify(proxy));
    effect(fn);

    // this won't trigger length property set method
    // set: 3 (don't get)
    proxy[3] = 100;

    // default: push,length prop will trigger get method
    // 4 not track, length will trigger set method
    // get: push,length
    // set: 4,length
    proxy.push(4);
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
