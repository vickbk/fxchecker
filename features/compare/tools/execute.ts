import { z } from "zod";
import { CompareAIToolSchema } from "../types";
import { addCompare } from "./add-compare";
import { getCompareList } from "./list-compare";
import { removeCompare } from "./remove-compare";
import { inputSchema } from "./schema";

export async function execute(props: CompareAIToolSchema) {
  try {
    const data = z.parse(inputSchema, props);

    if (data.action === "list") return await getCompareList(data);
    if (data.action === "add") return await addCompare(data);
    if (data.action === "remove") return await removeCompare(data);

    throw new Error(`Unsupported action specified (${data.action}).`);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to execute compare action.",
    };
  }
}
