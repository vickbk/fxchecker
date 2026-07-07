import React from "react";
import { LiveMarket } from "../modules/live-market";

export const MainHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <header>
      <div>logo</div>
      <div>EOD ECD...</div>
      <div>{children}</div>
      <LiveMarket />
    </header>
  );
};
