import { toggleFavorite } from "./actions";

export async function mainToggleFavorite(form: FormData) {
  "use server";
  const base = form.get("base") as string;
  const quote = form.get("quote") as string;

  await toggleFavorite({ base, quote });
}
