import { reactive } from '../../lib';
import { watch } from '../../lib/runtime-core/apiWatch';

describe('runtime-core:apiWatch', () => {
  it('should watch reactive data change', (done) => {
    const state = reactive({ count: 0 });
    const fn = jest.fn((newVal, oldVal) => {
      expect(newVal).toBe(1);
      expect(oldVal).toBe(0);
      done();
    });
    watch(() => state.count, fn);
    state.count++;
  });
});
