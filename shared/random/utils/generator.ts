export function getRandomInt(min: number = 0, max: number = 10) {
  const realMin = Math.ceil(min < max ? min : max);
  const realMax = Math.floor(min < max ? max : min);

  return Math.floor(Math.random() * (realMax - realMin) + realMin);
}

export function getRandomElement<T>(data: T[]) {
  return data[getRandomInt(0, data.length)];
}

export function getRandomElements<T>(data: T[], count: number) {
  if (!data || data.length === 0 || count <= 0) return [];

  const safeCount = Math.min(Math.floor(count), data.length);

  const shuffled = [...data];
  const results: T[] = [];

  const { length } = shuffled;

  for (let i = 0; i < safeCount; i++) {
    const randomIndex = getRandomInt(0, length - i);

    results.push(shuffled[randomIndex]);

    // Swap the picked element with the last unpicked element
    // so it can't be picked again
    shuffled[randomIndex] = shuffled[length - 1 - i];
  }

  return results;
}
