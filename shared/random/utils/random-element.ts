import { getRandomInt } from "./random-int";

export function getRandomElement<T>(data: T[]) {
  return data[getRandomInt(0, data.length)];
}
