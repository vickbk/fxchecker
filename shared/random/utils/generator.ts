export function getRandomInt(min: number = 0, max: number = 10) {
  const realMin = Math.ceil(min < max ? min : max);
  const realMax = Math.floor(min < max ? max : min);

  return Math.floor(Math.random() * (realMax - realMin) + realMin);
}

export function getRandomElement<T>(data: T[]) {
  return data[getRandomInt(0, data.length)];
}

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
 * it is mathematically impossible to produce a distinct sequence of values. In this
 * scenario, the function safely returns the sequence without entering an infinite
 * loop or throwing an error.
 */
export function getRandomElements<T>(data: T[], count: number): T[] {
  if (!data || data.length === 0 || count <= 0) return [];

  const safeCount = Math.min(Math.floor(count), data.length);

  const shuffled = data.slice();
  const results = new Array<T>(safeCount);
  const len = shuffled.length;

  // Track order alignment inline (only necessary if safeCount > 1)
  let isSameOrder = safeCount > 1;

  for (let i = 0; i < safeCount; i++) {
    const randomIndex = getRandomInt(0, len - i);
    const picked = shuffled[randomIndex];

    results[i] = picked;

    // Short-circuits instantly on the first mismatch
    if (isSameOrder && picked !== data[i]) {
      isSameOrder = false;
    }

    // Swap picked element with the last unpicked element
    shuffled[randomIndex] = shuffled[len - 1 - i];
  }

  // If the shuffle randomly ended up in 100% identical sequence order
  if (isSameOrder) {
    let swapIndex = 1;

    // Find the first distinct element to handle duplicate values gracefully
    for (let j = 1; j < safeCount; j++) {
      if (results[j] !== results[0]) {
        swapIndex = j;
        break;
      }
    }

    // Perform an O(1) swap to break identical order
    const temp = results[0];
    results[0] = results[swapIndex];
    results[swapIndex] = temp;
  }

  return results;
}
