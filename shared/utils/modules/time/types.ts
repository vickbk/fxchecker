export type DurationUnit =
  | "s"
  | "S"
  | "m"
  | "h"
  | "H"
  | "d"
  | "D"
  | "w"
  | "W"
  | "M"
  | "y"
  | "Y";
export type DurationString = `${number}${DurationUnit}`;
