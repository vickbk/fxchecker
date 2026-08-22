import { TEXT_PATTERN } from "../types";

export function patternToRegex(target: TEXT_PATTERN) {
  return typeof target === "string" ? new RegExp(target, "i") : target;
}
