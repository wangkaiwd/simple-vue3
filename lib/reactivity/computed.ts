import { effect, track, trigger } from "./effect";
import { reactive } from "./reactive";
import { hasChanged } from "../shared/helpers";

type Fn = () => any;

interface Options {
  getter?(): any;

  setter?(value: any): void;
}

class CmpRefImpl {
  private readonly getter: Options["getter"];

  private setter: Options["setter"];

  private _value: any;

  private _dirty: boolean = true;

  // private effect: () => void;
  private effect: () => any;

  constructor(options: Options) {
    this.getter = options.getter!;
    this.setter = options.setter;
    this.effect = effect(this.getter, {
      lazy: true,
      scheduler: () => {
        this._dirty = true;
        trigger("set", this, "value");
      },
    });
  }

  get value() {
    track("get", this, "value");
    if (this._dirty) {
      this._value = this.effect();
      this._dirty = false;
    }
    return this._value;
  }

  set value(newVal: any) {
    if (hasChanged(newVal, this._value)) {
      this._value = reactive(newVal);
      // trigger('set', this, 'value');
    }
  }
}

// 1. return readonly Ref
// 2. dependence value not update, get method don't execute
// 3. dependence update will trigger view update
// example:
// const count = ref(1)
// const plusOne = computed(() => count.value + 1)
// console.log(plusOne.value) // 2
// plusOne.value++ // error
export const computed = (fnOrOptions: Fn | Options) => {
  let options: Options = {};
  if (typeof fnOrOptions === "function") {
    options.getter = fnOrOptions;
  } else {
    options = fnOrOptions;
  }
  return new CmpRefImpl(options);
};
