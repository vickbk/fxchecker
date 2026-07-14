export function getLookbackDate(days: number) {
  const daysMilli = days * 24 * 60 * 60 * 1000;
  const date = new Date(new Date().valueOf() - daysMilli);
  return date.toISOString().split("T")[0];
}

export function formatTime(secs: number) {
  return `${Math.floor(secs / 60)}:${Math.floor(secs % 60)
    .toString()
    .padStart(2, "0")}`;
}

export function formatDateTime({
  time,
  options,
}: {
  time: number;
  options?: Intl.DateTimeFormatOptions;
}) {
  const {
    year = "numeric",
    month = "long",
    day = "numeric",
    weekday = "long",
    hour = "numeric",
    minute = "numeric",
  } = options || {};

  return new Intl.DateTimeFormat(undefined, {
    year,
    month,
    day,
    weekday,
    hour,
    minute,
  }).format(time);
}
