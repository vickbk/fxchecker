import { TEXT_PATTERN } from "../types";

function escapeRegExp(str: string): string {
  // if (typeof RegExp.escape === "function") {
  return RegExp.escape(str);
  // }
  // return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function patternToRegex(target: TEXT_PATTERN) {
  return typeof target === "string"
    ? new RegExp(escapeRegExp(target), "i")
    : target;
}
