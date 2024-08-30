import type { UnknownFunction } from "@objectively/utils";
import { useCallbackRef } from "../useCallbackRef";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";
import type { UseEventOptions } from "./types";

type ListenableTarget =
  | Window
  | Document
  | Element
  | PermissionStatus
  | MediaQueryList
  | EventTarget;

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

interface ListenableTarget2 {
  addEventListener: <
    TEventMap extends Record<string, UnknownFunction>,
    TEventType extends string & keyof TEventMap,
  >(
    name: TEventType,
    callback: (this: ThisType<ListenableTarget2>, ev: TEventMap[TEventType]) => void,
    opts: boolean | AddEventListenerOptions,
  ) => void;
  removeEventListener: <
    TEventMap extends Record<string, UnknownFunction>,
    TEventType extends string & keyof TEventMap,
  >(
    name: TEventType,
    callback: (this: ThisType<ListenableTarget2>, ev: TEventMap[TEventType]) => void,
    opts: boolean | EventListenerOptions,
  ) => void;
}

/*
type W = typeof window.addEventListener;
document.addEventListener

type R<T extends EventTarget> = T["addEventListener"] extends (
  name: infer X,
  fn: (this: T, ev: infer Y) => any,
  opts: any,
) => any
  ? { X: X; Y: Y }
  : never;


  type G = R<Atom<any, any>>
  type H = R<typeof window>
  type I = R<typeof document> */

export const useEventListener = <
  TEventTarget extends ListenableTarget,
  const TEventType extends string & keyof EventMap<TEventTarget>,
  // const TEventType extends string & Parameters<TEventTarget["addEventListener"]>[0],
  // const TEventMap extends Parameters<Parameters<TEventTarget["addEventListener"]>[1]>[1],
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

  useIsomorphicLayoutEffect(() => {
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
