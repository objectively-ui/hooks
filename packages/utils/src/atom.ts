import { deepEqual } from "./deepEqual";
import { isFunction } from "./isFunction";
import { safeStringify } from "./json";

class AtomChangeEvent<TValue> extends CustomEvent<{ value: TValue }> {}
class AtomEvent extends Event {}
class AtomErrorEvent extends ErrorEvent {}

type AtomEventMap<TValue> = {
  change: AtomChangeEvent<TValue>;
  loadstart: AtomEvent;
  load: AtomEvent;
  error: AtomErrorEvent;
};

type ResolvableValue<TValue> =
  | TValue
  | Promise<TValue>
  | ((...args: unknown[]) => TValue)
  | ((...args: unknown[]) => Promise<TValue>);

export interface AtomPersistence<TValue> {
  get: (name: string) => TValue;
  set: (name: string, value: TValue) => void;
}

export interface AtomOptions<TValue> {
  defaultValue?: ResolvableValue<TValue>;
  persist?: AtomPersistence<TValue>;
}

export const localStoragePersistor: AtomPersistence<unknown> = {
  get(name) {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : undefined;
  },
  set(name, value) {
    localStorage.setItem(name, safeStringify(value));
  },
};

export class Atom<TValue, const TName extends string> extends EventTarget {
  name: TName;
  value?: TValue;
  resolved = false;
  private initialValue?: TValue;
  private opts: AtomOptions<TValue>;
  private asPromiseCached?: Promise<this>;

  constructor(name: TName, opts: AtomOptions<TValue>) {
    super();
    this.name = name;
    this.opts = opts;

    if (!this.restore()) {
      if (opts?.defaultValue !== undefined) {
        this.resolveValue(opts.defaultValue);
      } else {
        this.resolved = true;
      }
    }
  }

  setValue(value: TValue | undefined) {
    if (deepEqual(value, this.value)) {
      return;
    }

    this.value = value;
    this.persist();

    return this.dispatchEvent(
      new AtomChangeEvent("change", {
        detail: {
          value,
        },
      }),
    );
  }

  reset() {
    this.setValue(this.initialValue);
  }

  async asPromise() {
    if (this.asPromiseCached) {
      return this.asPromiseCached;
    }

    if (this.resolved) {
      this.asPromiseCached = Promise.resolve(this);
    } else {
      this.asPromiseCached = new Promise((resolve, reject) => {
        const onLoad = () => {
          resolve(this);
          this.removeEventListener("load", onLoad);
          this.removeEventListener("error", onError);
        };
        const onError = (e: AtomErrorEvent) => {
          reject(e);
          this.removeEventListener("load", onLoad);
          this.removeEventListener("error", onError);
        };

        this.addEventListener("load", onLoad);
        this.addEventListener("error", onError);
      });
    }

    return this.asPromiseCached;
  }

  private async resolveValue(value: ResolvableValue<TValue>) {
    let resolved: unknown = value;

    try {
      this.dispatchEvent(new AtomEvent("loadstart"));

      if (isFunction(resolved)) {
        resolved = resolved();
      }

      if (resolved instanceof Promise) {
        resolved = await resolved;
      }

      this.value = resolved as TValue;
      this.initialValue = this.value;
      this.resolved = true;

      this.dispatchEvent(new AtomEvent("load"));
    } catch (e) {
      if (!(e instanceof Error)) {
        throw new Error("Non-error object was thrown", { cause: e });
      }
      this.dispatchEvent(new AtomErrorEvent("error", { error: e, message: e.message }));
    }
  }

  private persist() {
    if (!this.opts?.persist?.set) {
      return true;
    }

    if (this.value !== undefined) {
      this.opts.persist.set(this.name, this.value);

      return true;
    }

    return false;
  }

  private restore() {
    if (!this.opts?.persist?.get) {
      return false;
    }

    const value = this.opts.persist.get(this.name);
    if (value !== undefined) {
      this.value = value;
      this.initialValue = value;
      this.resolved = true;
      return true;
    }

    return false;
  }

  addEventListener<K extends keyof AtomEventMap<TValue>>(
    type: K,
    listener: (ev: AtomEventMap<TValue>[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    super.addEventListener(type, listener as EventListener, options);
  }

  removeEventListener<K extends keyof AtomEventMap<TValue>>(
    type: K,
    listener: (ev: AtomEventMap<TValue>[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    super.removeEventListener(type, listener as EventListener, options);
  }
}

export const atom = <TValue, const TName extends string = string>(
  name: TName,
  opts: AtomOptions<TValue>,
): Atom<TValue, TName> => {
  return new Atom(name, opts);
};
