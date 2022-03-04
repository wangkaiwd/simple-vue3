import { computed, effect, ref } from '../../lib';

// requirement:
// 1. execute effect with getter
// 2. lazy: it update until dependence update
//    1. dependence value update will trigger
//    2. dependence value update will make view update
// 3. it also can set setter method
describe('Reactivity/Computed', () => {
  it('should return ref', () => {
    const count = ref(1);
    const computedFn = jest.fn(() => {
      return count.value + 1;
    });
    const plusOne = computed(computedFn);
    // computed getter execute only when it used in somewhere
    expect(computedFn).toHaveBeenCalledTimes(0);

    const effectFn = jest.fn(() => {
      return plusOne.value;
    });

    effect(effectFn);
    expect(computedFn).toHaveBeenCalledTimes(1);
    // view also update
    count.value++;
    expect(plusOne.value).toBe(3);
    expect(computedFn).toHaveBeenCalledTimes(2);
    expect(effectFn).toHaveBeenCalledTimes(2);
  });
});
