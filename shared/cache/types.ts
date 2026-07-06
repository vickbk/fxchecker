export type CacheEntry<T> = {
  data: T;
  createdAt: number;
  isRevalidating: boolean;
};
