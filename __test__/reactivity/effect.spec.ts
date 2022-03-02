import { effect, reactive } from '../../lib';

describe('Effect', () => {
  it('should proxy shallow object and update proxy object will trigger effect parameter fn', () => {
    const person = reactive({ name: 'xx' });
    const fn = jest.fn(() => person.name);
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    person.name = 'yy';
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it('should proxy deep object and update proxy object will trigger effect parameter fn', () => {
    const person = reactive({ x: { name: 'y' } });
    console.log('person', person);
    const fn = jest.fn(() => person.x.name);
    effect(fn);
    person.x.name = 'zzz';
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
