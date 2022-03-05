import { h } from '../../lib';

describe('RuntimeCore/h', () => {
  it('should generate virtual node with parameter', () => {
    const vNode = {
      tag: 'h2',
      key: '1',
      props: { id: 'x', class: 'y' },
      children: ['hello', { tag: 'span', key: '2', props: { id: 'span' }, children: ['world'] }]
    };
    const vNode1 = h('h2', { key: '1', id: 'x', class: 'y' }, ['hello', h('span', {
      key: '2',
      id: 'span'
    }, ['world'])]);
    expect(vNode).toEqual(vNode1);
  });
});
