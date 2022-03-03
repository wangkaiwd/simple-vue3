## reactivity
* [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
* [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)

API:
* reactive,shallowReactive,readonlyReactive
* ref
* toRef,toRefs


thinking:
* vue2
* vue3: Map,Set

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
