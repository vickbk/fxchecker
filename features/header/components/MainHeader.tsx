import { Heading } from "@/shared/heading";
import { BiIcon } from "@/shared/utils";
import React from "react";
import { LiveMarket } from "../modules/live-market";
import { Logo } from "./Logo";

export const MainHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="uppercase">
        <div className="flex items-center flex-wrap p-4 gap-2 text-sm text-foreground-secondary">
          <div className="text-foreground">
            <Logo />
          </div>
          <Heading className="sr-only">Foreign Exchange System</Heading>
          <span className="ml-auto">
            55 Currencies
          </span> <BiIcon name="dot" /> <span>EOD</span> <BiIcon name="dot" />
          <span>ECB Data</span>
          <div className="ml-auto flex gap-4 items-center">{children}</div>
        </div>
      </header>
      <LiveMarket />
    </>
  );
};
