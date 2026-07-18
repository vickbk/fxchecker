import { DurationString } from "../types";
import { TIME_MULTIPLIERS } from "./constants";

export function parseTimeToMs(timeStr: DurationString): number {
  if (!timeStr) {
    throw new Error("parseTimeToMs: Duration string cannot be empty.");
  }

  const unit = timeStr.slice(-1);
  const valStr = timeStr.slice(0, -1);

  const multiplier = TIME_MULTIPLIERS[unit];
  const value = Number(valStr);

  if (!multiplier || Number.isNaN(value) || valStr === "") {
    throw new Error(
      `parseTimeToMs: Invalid runtime input "${timeStr}". Must match pattern like "30D" or "1.5h".`,
    );
  }

  return value * multiplier;
}
