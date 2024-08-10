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

export interface AtomOptions<TValue> {
  defaultValue?: ResolvableValue<TValue>;
  persist?: boolean;
}

export class Atom<const TName extends string, TValue> extends EventTarget {
  name: TName;
  private opts: AtomOptions<TValue>;
  value?: TValue;
  resolved = false;

  constructor(name: TName, opts: AtomOptions<TValue>) {
    super();
    this.name = name;
    this.opts = opts;

    if (!this.restore()) {
      if (opts?.defaultValue) {
        this.resolveValue(opts.defaultValue);
      }
    }
  }

  setValue(value: TValue) {
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

  async asPromise() {
    if (this.resolved) {
      return Promise.resolve(this);
    }

    return new Promise((resolve, reject) => {
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

  private async resolveValue(value: ResolvableValue<TValue>) {
    let resolved: unknown = value;

    try {
      if (typeof resolved === "function") {
        resolved = (resolved as () => TValue | Promise<TValue>)();
      }

      if (resolved instanceof Promise) {
        this.dispatchEvent(new AtomEvent("loadstart"));
        resolved = await resolved;
        this.dispatchEvent(new AtomEvent("load"));
      }

      this.value = resolved as TValue;
      this.resolved = true;
    } catch (e) {
      if (!(e instanceof Error)) {
        throw new Error("Non-error object was thrown", { cause: e });
      }
      this.dispatchEvent(new AtomErrorEvent("error", { error: e, message: e.message }));
    }
  }

  private persist() {
    if (!this.opts?.persist) {
      return true;
    }

    return false;
  }

  private restore() {
    if (!this.opts?.persist) {
      return false;
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

export const atom = <const TName extends string, TValue>(
  name: TName,
  opts: AtomOptions<TValue>,
): Atom<TName, TValue> => {
  const internalValue = new Atom(name, opts);

  return internalValue;
};
