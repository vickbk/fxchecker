import { ClassValue } from "../types/join-classes";

export function joinClasses(...classes: ClassValue[]): string {
  let result = "";
  const len = classes.length;

  for (let i = 0; i < len; i++) {
    const cls = classes[i];

    if (cls) {
      if (result.length > 0) result += " ";
      result += cls;
    }
  }

  return result;
}
