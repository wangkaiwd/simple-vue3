// import { reactive, ref } from '../../lib';
import { reactive, ref } from 'vue';

describe('Reactivity/Reactive', () => {
  it('should proxied only once', () => {
    const proxy = reactive({ x: 1 });
    const proxy1 = reactive(proxy);
    expect(proxy).toBe(proxy1);
  });
  // it('should proxy non object value will return it self', () => {
  //
  // });
  // https://github.com/vuejs/core/blob/5898629d723e82b68e9b17b91bf8b1a8390a3912/packages/reactivity/src/baseHandlers.ts#L125-L129
  it.skip('should unwrap ref value which except array', () => {
    const proxy = reactive({
      name: ref('xxx')
    });
    expect(proxy.name).toBe('xxx');
    const proxy2 = reactive([ref(1), 2, 3, 4]);
    expect((proxy2[0] as any).value).toBe(1);
  });
});
