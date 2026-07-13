export type NavbarProps = Record<
  "history" | "compare" | "favorites" | "logs",
  { badge?: Promise<number> }
>;

export type QueryParams = Record<"from" | "to" | "compare" | "range", string>;
