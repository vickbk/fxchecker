import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum();
export function getRandomText() {
  return {
    word: lorem.generateWords(1),
    sentence: lorem.generateSentences(),
    paragraph: lorem.generateParagraphs(1),
  };
}

export function getRandomInt(min: number = 0, max: number = 10) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomElement<T>(data: T[]) {
  return data[getRandomInt(0, data.length)];
}
