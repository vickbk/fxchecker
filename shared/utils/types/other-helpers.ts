export type QueryValue = string | number | boolean | null | undefined;

export type ScrollTarget =
  | Element
  | { current: Element | null }
  | string
  | null
  | undefined;

export type ScrollOptions = ScrollIntoViewOptions & {
  /** Delay scroll execution until the next animation frame (useful after DOM/state updates) */
  useAnimationFrame?: boolean;
};
