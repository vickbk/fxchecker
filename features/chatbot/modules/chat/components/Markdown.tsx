import Link from "next/link";
import { Components } from "react-markdown";

const linkClass =
  "text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-medium transition-colors";

/**
 * Returns ReactMarkdown component overrides that intercept /movies/ID links
 * and use Next.js <Link> for client-side navigation without a full page reload.
 */
export const MarkDown = (): Pick<Components, "a" | "p"> => ({
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
  p: ({ children }) => <p className="last:mb-0 mb-2">{children}</p>,
});
