import { effect, reactive } from '../../lib';
// import { effect, reactive } from 'vue';

describe('Reactivity/Effect', () => {
  it('should proxy shallow object and update proxy object will trigger effect parameter fn', () => {
    const person = reactive({ name: 'xx' });
    const fn = jest.fn(() => person.name);
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    person.name = 'yy';
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it('should return cache fn function to ensure collect correct dep', () => {
    const person = reactive({ name: 'xx', age: 12 });
    const effectFn1 = jest.fn(() => {
      return person.age;
    });
    const effectFn2 = jest.fn(() => {
      return person.name;
    });
    const resultFn = effect(effectFn1);
    effect(() => {
      effectFn2();
      // effectFn1 into stack
      // person.age -> effectFn1
      resultFn();
    });
    person.age = 20;
    expect(effectFn1).toHaveBeenCalledTimes(3);
    expect(effectFn2).toHaveBeenCalledTimes(1);
  });
  it('should proxy deep object and update proxy object will trigger effect parameter fn', () => {
    const person = reactive({ x: { name: 'y' } });
    const fn = jest.fn(() => person.x.name);
    effect(fn);
    person.x.name = 'zzz';
    expect(fn).toHaveBeenCalledTimes(2);
  });
  // can't use in this case
  it.skip('should nest call to collect dependence', () => {
    const person = reactive({ x: { name: 'y' } });
    const fn = jest.fn(() => {
      console.log('fn', person.x);
    });
    const fn2 = jest.fn(() => {
      console.log('fn2', person.x.name);
    });
    // person.x -> fn2
    // person.x.name -> fn2
    // person.x -> fn
    effect(() => {
      effect(fn2);
      fn();
    });
    // fn2()
    person.x.name = 'zzz';
    // expect(fn2).toHaveBeenCalledTimes(2);
    // fn2(), fn()
    person.x = { name: 'yyyy' };
    expect(fn2).toHaveBeenCalledTimes(4);
  });

  // this work because of deep proxy
  it('should add new reference value and new value have reactivity', () => {
    const person: any = reactive({ x: { name: 'y' } });
    person.x = { age: 12, school: { score: 1000 } };
    const fn = jest.fn(() => person.x.school.score);
    effect(fn);
    person.x.school.score = 18;
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
