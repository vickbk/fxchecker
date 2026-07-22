import React from "react";

export const CurrencyCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="flex gap-4 p-4 bg-card hover:outline hover:outline-foreground-secondary has-focus-visible:outline has-focus-visible:outline-lime-500 rounded-lg justify-between items-center relative">
      {children}
    </li>
  );
};
