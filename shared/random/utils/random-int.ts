export function getRandomInt(min: number = 0, max: number = 10) {
  const realMin = Math.ceil(min < max ? min : max);
  const realMax = Math.floor(min < max ? max : min);

  return Math.floor(Math.random() * (realMax - realMin) + realMin);
}
