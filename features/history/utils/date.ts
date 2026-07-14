const units = { D: 1, W: 7, M: 30, Y: 365 };
const spellings = { D: "Day", W: "Week", M: "Month", Y: "Year" };

export function codeToDays(code = "1D") {
  const [, count, unit] = code.match(/^(\d+)(.*)$/) || [];
  return +count * (units[unit.toUpperCase() as "D"] ?? 1);
}

export function codeToPeriod(code = "1D") {
  const [, count, unit] = code.match(/^(\d+)(.*)$/) || [];
  return `${count} ${spellings[unit.toUpperCase() as "D"] ?? "day"}${+count > 1 ? "s" : ""}`;
}
