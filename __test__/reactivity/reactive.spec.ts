import { reactive } from '../../lib';

describe('Reactive', () => {
  it('should proxied only once', () => {
    const proxy = reactive({ x: 1 });
    const proxy1 = reactive(proxy);
    expect(proxy).toBe(proxy1);
  });
});
