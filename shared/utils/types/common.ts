export type ActionReturn = { success: boolean; error?: Error };
export type ResolveType<T extends (...args: never[]) => unknown> = Awaited<
  ReturnType<T>
>;
