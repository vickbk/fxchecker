export function joinClasses(classes: (string | false)[]) {
  return classes.filter((c) => c !== false).join(" ");
}
