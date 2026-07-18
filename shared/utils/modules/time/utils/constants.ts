export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const TIME_MULTIPLIERS: Record<string, number> = {
  s: SECOND,
  m: MINUTE,
  h: HOUR,
  d: DAY,
  D: DAY,
  w: 7 * DAY,
  W: 7 * DAY,
  M: 30 * DAY,
  y: 365 * DAY,
  Y: 365 * DAY,
};
