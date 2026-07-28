import { chat } from "@/features/chatbot";
import { manage_compare } from "@/features/compare";
import { manage_favorites } from "@/features/favorites";
import { manage_conversion_logs } from "@/features/logs";

/**
 * Vercel AI SDK Chat API Route Handler.
 *
 * @remarks
 * Acts as the server-side endpoint for the streaming FinBot assistant.
 * Parses incoming conversation history and context, then forwards it to the
 * feature-isolated chat logic which interacts with the AI Provider.
 *
 * @param req - The incoming HTTP Request containing the message history.
 * @returns A Promise resolving to the streaming HTTP Response.
 *
 * @see {@link "@/features/cinebot/api/chat"}
 */
export async function POST(req: Request) {
  const { messages } = await req.json();
  return chat({
    messages,
    tools: { manage_conversion_logs, manage_favorites, manage_compare },
  });
}
