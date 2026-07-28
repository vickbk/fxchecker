import Link from "next/link";
import { Components } from "react-markdown";

const linkClass =
  "text-lime-500 hover:text-lime-500/80 underline underline-offset-2 font-medium transition-colors";

/**
 * Returns ReactMarkdown component overrides that intercept /movies/ID links
 * and use Next.js <Link> for client-side navigation without a full page reload.
 */
export const MarkDown = (): Pick<Components, "a" | "p" | "pre" | "code"> => ({
  a: ({ href, children }) =>
    href?.startsWith("/") ? (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {children}
      </a>
    ),
  p: ({ children }) => <p className="last:mb-0 mb-2 max-w-full">{children}</p>,
  pre: ({ children }) => (
    <pre className="overflow-x-auto p-2 bg-btn rounded-md max-w-full">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="break-all bg-btn px-1 rounded">{children}</code>
  ),
});
