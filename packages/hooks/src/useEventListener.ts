import { useEffect } from "react";
import { useCallbackRef } from "./useCallbackRef";
import { window } from "./utils/globals";

type ListenableElement = Window | Document | Element;

interface UseEventOptions<TElement extends ListenableElement, TImmediate extends boolean>
  extends AddEventListenerOptions {
  element?: TElement;
  immediate?: TImmediate;
}

type EventMap<TElement> = TElement extends undefined
  ? WindowEventMap
  : TElement extends Window
    ? WindowEventMap
    : TElement extends Document
      ? DocumentEventMap
      : HTMLElementEventMap;

type EventHandlerEvent<TEventType, TImmediate> = TImmediate extends true
  ? undefined | TEventType
  : TEventType;

export const useEventListener = <
  TElement extends ListenableElement,
  const TEventType extends string & keyof EventMap<TElement>,
  const TImmediate extends boolean = false,
>(
  type: TEventType,
  listener: (
    this: TElement,
    event: EventHandlerEvent<EventMap<TElement>[TEventType], TImmediate>,
  ) => void,
  opts: UseEventOptions<TElement, TImmediate> = {},
) => {
  const handlerRef = useCallbackRef(listener);

  const element = opts.element || window;
  const { capture, once, passive, signal, immediate } = opts;

  useEffect(() => {
    const handleChange = handlerRef.current;

    element.addEventListener(type, handleChange, {
      capture,
      once,
      passive,
      signal,
    });

    if (immediate) {
      handleChange();
    }

    return () => {
      element.removeEventListener(type, handleChange);
    };
  }, [type, element, immediate, capture, once, passive, signal]);
};
