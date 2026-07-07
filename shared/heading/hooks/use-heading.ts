import { useContext } from "react";
import type { HeadingLevel } from "../types";
import { HeadingCtx } from "./HeadingCtx";

function calculateNextHeadingLevel(
  currentLevel: HeadingLevel,
  hasH1: boolean,
): HeadingLevel {
  const nextLevel: HeadingLevel =
    currentLevel === 5 ? 5 : ((currentLevel + 1) as HeadingLevel);
  return hasH1 ? nextLevel : currentLevel;
}

export function useHeading(hasH1 = true) {
  const level = useContext(HeadingCtx);
  return calculateNextHeadingLevel(level, hasH1);
}
