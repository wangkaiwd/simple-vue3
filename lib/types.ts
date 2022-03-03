export type Fn = () => any;

export interface EffectFn {
  (): Fn;
  id: number;
  scheduler?: () => any;
}

export interface ProxyHandler<T extends object> {
  apply?(target: T, thisArg: any, argArray: any[]): any;

  construct?(target: T, argArray: any[], newTarget: Function): object;

  defineProperty?(
    target: T,
    p: string | symbol,
    attributes: PropertyDescriptor
  ): boolean;

  deleteProperty?(target: T, p: string | symbol): boolean;

  get?(target: T, p: string | symbol, receiver: any): any;

  getOwnPropertyDescriptor?(
    target: T,
    p: string | symbol
  ): PropertyDescriptor | undefined;

  getPrototypeOf?(target: T): object | null;

  has?(target: T, p: string | symbol): boolean;

  isExtensible?(target: T): boolean;

  ownKeys?(target: T): ArrayLike<string | symbol>;

  preventExtensions?(target: T): boolean;

  set?(target: T, p: string | symbol, value: any, receiver: any): boolean;

  setPrototypeOf?(target: T, v: object | null): boolean;
}
