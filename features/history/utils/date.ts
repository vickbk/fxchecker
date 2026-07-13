export function getLookbackDate(days: number) {
  const daysMilli = days * 24 * 60 * 60 * 1000;
  const date = new Date(new Date().valueOf() - daysMilli);
  return date.toISOString().split("T")[0];
}

const units = { D: 1, W: 7, M: 30, Y: 365 };

export function codeToDays(code: string = "1D") {
  const [, count, unit] = code.match(/^(\d+)(.*)$/) || [];
  return +count * (units[unit.toUpperCase() as "D"] ?? 1);
}
