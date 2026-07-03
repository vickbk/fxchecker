import { useMemo, useState } from "react";
import {
  generateSassOutput,
  generateTailwindOutput,
  parseColors,
} from "../scripts";

export function useColorsHelper() {
  const [colors, setColors] = useState("");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const parsedColors = useMemo(() => parseColors(colors), [colors]);

  return {
    colors,
    setColors,
    parsedColors,
    copiedFormat,

    async handleCopy(text: string, format: string) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    },

    ...useMemo(
      () => ({
        sassOutput: generateSassOutput(parsedColors),
        tailwindOutput: generateTailwindOutput(parsedColors),
      }),
      [parsedColors],
    ),
  };
}
