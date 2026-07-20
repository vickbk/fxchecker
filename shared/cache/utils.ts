import { revalidatePath } from "next/cache";

export function revalidatePaths(...paths: string[]) {
  paths.forEach((path) => revalidatePath(path));
}

export function revalidateAllPaths() {
  // These paths are project specific...
  revalidatePaths("/", "/compare", "/favorites", "/logs");
}
