export interface UseEventOptions<TEventTarget, TImmediate extends boolean>
  extends AddEventListenerOptions {
  eventTarget?: TEventTarget | null;
  immediate?: TImmediate;
}
