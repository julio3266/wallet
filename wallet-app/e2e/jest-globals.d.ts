type DoneCallback = (reason?: string | Error) => void;
type TestFn = (done?: DoneCallback) => void | Promise<void>;
type HookFn = (done?: DoneCallback) => void | Promise<void>;

declare function describe(name: string, fn: () => void): void;
declare function describe(name: TemplateStringsArray, fn: () => void): void;

declare namespace describe {
  function only(name: string, fn: () => void): void;
  function skip(name: string, fn: () => void): void;
  function each(
    table: readonly (readonly unknown[])[] | readonly unknown[]
  ): (name: string, fn: (...args: any[]) => void | Promise<void>) => void;
}

declare function it(name: string, fn?: TestFn, timeout?: number): void;
declare function it(name: TemplateStringsArray, fn?: TestFn, timeout?: number): void;

declare namespace it {
  function only(name: string, fn?: TestFn, timeout?: number): void;
  function skip(name: string, fn?: TestFn, timeout?: number): void;
  function each(
    table: readonly (readonly unknown[])[] | readonly unknown[]
  ): (name: string, fn: (...args: any[]) => void | Promise<void>, timeout?: number) => void;
}

declare const test: typeof it;

declare function beforeAll(fn: HookFn, timeout?: number): void;
declare function afterAll(fn: HookFn, timeout?: number): void;
declare function beforeEach(fn: HookFn, timeout?: number): void;
declare function afterEach(fn: HookFn, timeout?: number): void;
