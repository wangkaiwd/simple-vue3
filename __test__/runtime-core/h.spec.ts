import { h } from '../../lib';

describe('RuntimeCore/h', () => {
  it('should generate virtual node with parameter', () => {
    const vNode = {
      type: 'h2',
      key: '1',
      props: { id: 'x', class: 'y' },
      children: [
        {
          children: 'hello',
          key: null,
          props: null,
          type: 'text'
        }
        ,
        {
          type: 'span', key: '2', props: { id: 'span' },
          children: [
            {
              children: 'world',
              key: null,
              props: null,
              type: 'text'
            }
          ]
        }
      ]
    };
    const vNode1 = h('h2', { key: '1', id: 'x', class: 'y' }, ['hello', h('span', {
      key: '2',
      id: 'span'
    }, ['world'])]);
    expect(vNode).toEqual(vNode1);
  });
});
