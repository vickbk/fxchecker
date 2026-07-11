import type { ReactNode } from "react";

export const SROnly = ({ children }: { children: ReactNode }) => {
  return <span className="sr-only">{children}</span>;
};
