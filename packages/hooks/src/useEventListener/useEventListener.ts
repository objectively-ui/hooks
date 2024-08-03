import { useEffect } from "react";
import { useCallbackRef } from "../useCallbackRef";
import type { UseEventOptions } from "./types";

type ListenableTarget = Window | Document | Element | PermissionStatus | MediaQueryList;

type EventMap<TEventTarget> = TEventTarget extends Window
  ? WindowEventMap
  : TEventTarget extends Document
    ? DocumentEventMap
    : TEventTarget extends PermissionStatus
      ? PermissionStatusEventMap
      : TEventTarget extends MediaQueryList
        ? MediaQueryListEventMap
        : HTMLElementEventMap;

type EventHandlerEvent<TEventType, TImmediate> = TImmediate extends true
  ? undefined | TEventType
  : TEventType;

export const useEventListener = <
  TEventTarget extends ListenableTarget,
  const TEventType extends string & keyof EventMap<TEventTarget>,
  const TImmediate extends boolean = false,
>(
  type: TEventType,
  listener: (
    this: TEventTarget,
    event: EventHandlerEvent<EventMap<TEventTarget>[TEventType], TImmediate>,
  ) => void,
  opts: UseEventOptions<TEventTarget, TImmediate>,
) => {
  const handlerRef = useCallbackRef(listener);

  const element = opts.eventTarget;
  const { capture, once, passive, signal, immediate } = opts;

  useEffect(() => {
    const handleChange = handlerRef.current;

    // @ts-ignore
    element?.addEventListener(type, handleChange, {
      capture,
      once,
      passive,
      signal,
    });

    if (immediate && element) {
      // @ts-ignore
      handleChange.call(element, undefined);
    }

    return () => {
      // @ts-ignore
      element?.removeEventListener(type, handleChange);
    };
  }, [type, element, immediate, capture, once, passive, signal]);
};
