"use client";
import { useColorsHelper } from "../hooks";

export const ColorsHelper = () => {
  const {
    colors,
    setColors,
    parsedColors,
    sassOutput,
    tailwindOutput,
    copiedFormat,
    handleCopy,
  } = useColorsHelper();

  return (
    <section className="flex flex-col gap-4 p-4">
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Colors list</span>
        <textarea
          className="border grow resize-none p-2 rounded"
          name="colors"
          value={colors}
          onChange={({ target: { value } }) => setColors(value)}
          required
          rows={5}
          placeholder="Paste colors from style guide, e.g.:&#10;Neutral 900: hsl(0, 0%, 7%)&#10;Blue 600: hsl(214, 100%, 55%)"
        />
      </label>

      {parsedColors.length > 0 && (
        <>
          {/* Parsed Colors Preview */}
          <section>
            <h3 className="font-semibold mb-2">Parsed Colors</h3>
            <ul className="flex flex-wrap gap-2">
              {parsedColors.map(({ name, value }) => (
                <li
                  key={name}
                  className="flex items-center gap-2 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800"
                >
                  <span
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: `hsl(${value})` }}
                  />
                  <code className="text-sm">
                    {name}:{value}
                  </code>
                </li>
              ))}
            </ul>
          </section>

          {/* SASS Output */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">SASS Variables</h3>
              <button
                type="button"
                className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => handleCopy(sassOutput, "sass")}
              >
                {copiedFormat === "sass" ? "Copied!" : "Copy SASS"}
              </button>
            </div>
            <pre className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded text-sm overflow-x-auto">
              <code>{sassOutput}</code>
            </pre>
          </section>

          {/* Tailwind CSS v4 Output */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Tailwind CSS v4</h3>
              <button
                type="button"
                className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => handleCopy(tailwindOutput, "tailwind")}
              >
                {copiedFormat === "tailwind" ? "Copied!" : "Copy Tailwind"}
              </button>
            </div>
            <pre className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded text-sm overflow-x-auto">
              <code>{tailwindOutput}</code>
            </pre>
          </section>
        </>
      )}
    </section>
  );
};
