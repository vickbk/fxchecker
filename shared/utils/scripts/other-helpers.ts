export function joinClasses(classes: (string | false)[]) {
  return classes.filter((c) => c !== false).join(" ");
}

export function keyFromSearchQuery(keys: Record<string, string>) {
  const result = [];
  for (const key in keys) {
    result.push(key, keys[key]);
  }
  return result.join("-");
}
