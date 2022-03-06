## reactivity
* [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
* [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)

API:
* reactive,shallowReactive,readonlyReactive
* ref,shallowRef
* toRef
* toRefs
* computed
* watch

thinking:
* vue2
* vue3: Map,Set

### document
* Note that refs are not unwrapped when accessed as array or collection elements

### Notes
* access deep object need return your proxy object instead of normal project
```ts
function createGetter (isShallow: boolean = false, isReadonly: boolean = false) {
  return function <T extends object> (
    target: T,
    prop: string | symbol,
    receiver: any
  ): any {
    if (prop === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    track('get', target, prop);
    const result = Reflect.get(target, prop, receiver);
    if (!isShallow && !isReadonly && isPlainObject(result)) {
      // return proxy value
      return reactive(result);
    }
    // return normal value
    return result;
  };
}
```
* add new property for proxy object, it will auto trigger get method
  * add value is deep object also proxied because of deep proxy. Access deep object always return proxy object
* change proxy object will correspond change origin object, but direct change origin object not trigger set/get method, so don't update view
* computed
  * core: create effect with `{lazy: true, scheduler: () => { //...}}` in computed
  * effect function will [return reactive effect](https://github.com/wangkaiwd/simple-vue3/blob/e37cdb60e90c7abc4f31884f764666725391dd86/__test__/reactivity/effect.spec.ts#L13-L31) fn which will cache fn that pass to effect and operate it with stack
* add new value by array index isn't trigger get method:
  * `push` will also trigger set method for `length` prop
```ts
const proxy = reactive([1, 2, 3]);
// this won't trigger length property set method
// set: 3 (don't get)
proxy[3] = 100;
```

### Proxy

Array,Object
* add
* delete
* change
* get

Change array
* push,pop; unshift,shift;splice;sort;reverse
* change length
