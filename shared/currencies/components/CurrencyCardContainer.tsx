import { ReactNode } from "react";

export const CurrencyCardContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <ul className="w-full flex flex-col gap-4 min-h-100">{children}</ul>;
};
