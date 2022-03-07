import { reactive } from "./reactive";
import { track, trigger } from "./effect";

class RefImpl {
  public readonly __v_isRef = true;

  private _value: any;

  constructor(target: any) {
    this._value = reactive(target);
  }

  get value() {
    track("get", this, "value");
    return this._value;
  }

  set value(newVal) {
    this._value = reactive(newVal);
    trigger("set", this, "value");
  }
}

class ObjectRefImpl {
  public readonly __v_isRef = true;

  constructor(private target: Record<string, any>, private prop: string) {}

  get value() {
    return this.target[this.prop];
  }

  set value(newVal) {
    this.target[this.prop] = newVal;
  }
}

const createRef = <T>(value: T) => {
  return new RefImpl(value);
};

export const ref = <T>(value: T) => createRef(value);

// export const shallowRef = <T> (value: T) => {
//
// };

export const toRef = (target: Record<string, any>, prop: string) => {
  return new ObjectRefImpl(target, prop);
};

export const isRef = (value: any) => value.__v_isRef;

export const unref = (value) => (isRef(value) ? value.value : value);
