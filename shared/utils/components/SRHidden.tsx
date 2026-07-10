import { HTMLAttributes } from "react";

export const SRHidden = ({
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span {...props} aria-hidden>
      {children}
    </span>
  );
};
