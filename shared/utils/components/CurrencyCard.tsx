import React from "react";

export const CurrencyCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="flex gap-4 p-4 bg-card rounded-lg justify-between items-center">
      {children}
    </li>
  );
};
