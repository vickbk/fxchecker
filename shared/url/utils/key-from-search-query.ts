export function keyFromSearchQuery(
  keys: Record<string, string | number> | null | undefined,
  ...include: string[]
): string {
  if (!keys) return "";

  let result = "";

  if (include.length > 0) {
    for (let i = 0; i < include.length; i++) {
      const key = include[i];
      const val = keys[key];

      if (val !== undefined) {
        if (result.length > 0) result += "-";
        result += key + "-" + val;
      }
    }
    return result;
  }

  const keyList = Object.keys(keys);
  for (let i = 0; i < keyList.length; i++) {
    const key = keyList[i];
    const val = keys[key];

    if (val !== undefined) {
      if (result.length > 0) result += "-";
      result += key + "-" + val;
    }
  }

  return result;
}
