import { getRandomInt } from "./random-int";

/**
 * Selects `count` random elements from an array without replacement, guaranteeing
 * that the returned sequence order will not match the input's initial order.
 *
 * @template T - The type of elements in the array.
 * @param data - The source array to pick elements from.
 * @param count - The number of random elements to return.
 * @returns An array containing up to `count` randomly selected elements.
 *
 * @note **Identical Elements Guard:**
 * If all selected elements in the picked subset are identical (e.g., `["A", "A", "A"]`),
 * `isSameItem` flags it as un-swappable and skips post-processing in O(1) time.
 */
export function getRandomElements<T>(data: T[], count: number): T[] {
  if (!data || data.length === 0 || count <= 0) return [];

  const safeCount = Math.min(Math.floor(count), data.length);

  const shuffled = data.slice();
  const results = new Array<T>(safeCount);
  const len = shuffled.length;

  let isSameOrder = safeCount > 1;
  let isSameItem = isSameOrder;

  for (let i = 0; i < safeCount; i++) {
    const randomIndex = getRandomInt(0, len - i);
    const picked = shuffled[randomIndex];

    results[i] = picked;

    if (isSameOrder && picked !== data[i]) {
      isSameOrder = false;
    }

    if (isSameItem && picked !== data[0]) {
      isSameItem = false;
    }

    shuffled[randomIndex] = shuffled[len - 1 - i];
  }

  if (isSameOrder && !isSameItem) {
    let swapIndex = 1;

    for (let j = 1; j < safeCount; j++) {
      if (results[j] !== results[0]) {
        swapIndex = j;
        break;
      }
    }

    const temp = results[0];
    results[0] = results[swapIndex];
    results[swapIndex] = temp;
  }

  return results;
}
