import {
  DAY,
  DurationString,
  formatAbsoluteDate,
  HOUR,
  MINUTE,
  parseTimeToMs,
  SECOND,
  WEEK,
} from "@/shared/utils";
import { useEffect, useState } from "react";

const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const THRESHOLDS = [
  { max: MINUTE, divisor: SECOND, unit: "second", short: "s" },
  { max: HOUR, divisor: MINUTE, unit: "minute", short: "m" },
  { max: DAY, divisor: HOUR, unit: "hour", short: "h" },
  { max: WEEK, divisor: DAY, unit: "day", short: "D" },
  { max: MONTH, divisor: WEEK, unit: "week", short: "W" },
  { max: YEAR, divisor: MONTH, unit: "month", short: "M" },
  { max: Infinity, divisor: YEAR, unit: "year", short: "Y" },
] as const;

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });

export function useTime(
  time: EpochTimeStamp,
  options: { short?: boolean; limit?: DurationString } = {},
) {
  const isShort = options?.short;
  const limit = options?.limit;
  const [display, setDisplay] = useState(isShort ? "0s" : "A moment ago");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const limitMs = limit ? parseTimeToMs(limit) : Infinity;

    function tick() {
      const now = Date.now();
      const diff = now - time;

      if (diff >= limitMs) {
        setDisplay(formatAbsoluteDate(time));
        return;
      }

      if (diff < SECOND) {
        setDisplay(isShort ? "0s" : "A moment ago");
        timeoutId = setTimeout(tick, SECOND - diff);
        return;
      }

      for (const { max, divisor, unit, short } of THRESHOLDS) {
        if (diff < max) {
          const value = Math.floor(diff / divisor);

          if (isShort) {
            setDisplay(`${value}${short}`);
          } else {
            setDisplay(rtf.format(-value, unit as Intl.RelativeTimeFormatUnit));
          }

          const msPassedInCurrentUnit = diff % divisor;
          let exactDelayToNextTick = divisor - msPassedInCurrentUnit;

          if (diff + exactDelayToNextTick > limitMs) {
            exactDelayToNextTick = limitMs - diff;
          }

          timeoutId = setTimeout(tick, exactDelayToNextTick);
          break;
        }
      }
    }

    tick(); // Initialize

    return () => clearTimeout(timeoutId); // Clean up cleanly
  }, [time, isShort, limit]);

  return { display };
}
