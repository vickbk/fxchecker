export function getLookbackDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthStr = month < 10 ? "0" + month : month;
  const dayStr = day < 10 ? "0" + day : day;

  return `${year}-${monthStr}-${dayStr}`;
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
