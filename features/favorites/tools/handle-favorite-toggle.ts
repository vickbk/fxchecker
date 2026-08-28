import { toggleFavorite } from "../actions";

export async function handleFavoriteToggle({
  base,
  quote,
}: Record<"base" | "quote", string>) {
  const result = await toggleFavorite({ base, quote });
  return {
    revalidate: result.success,
    success: result.success,
    message: result.success
      ? `Toggled ${base}/${quote} to favorites.`
      : undefined,
    error: result.success ? undefined : result.error?.message,
  };
}
