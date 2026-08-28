import { z } from "zod";
import { handleFavoriteToggle } from "./handle-favorite-toggle";
import { listFavorites } from "./list-favorites";
import { inputSchema } from "./schema";

export async function execute(inputs: z.infer<typeof inputSchema>) {
  try {
    const { action, base, quote } =
      z.safeParse(inputSchema, inputs).data ?? inputs;

    if (action === "list") return await listFavorites();
    if (!base || !quote)
      throw new Error(
        "Both base and quote currency codes are required to add or remove a favorite.",
      );
    if (action === "add" || action === "remove")
      return await handleFavoriteToggle({ base, quote });
    throw new Error("Invalid Action");
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to execute favorites action.",
    };
  }
}
