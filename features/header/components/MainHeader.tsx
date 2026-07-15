import { Heading } from "@/shared/heading";
import { BiIcon, LoadingPlaceholder } from "@/shared/utils";
import React, { Suspense } from "react";
import { LiveMarket } from "../modules/live-market";
import { CourencyCount } from "./CourencyCount";
import { Logo } from "./Logo";

export const MainHeader = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <header className="uppercase">
        <div className="flex items-center flex-wrap p-4 gap-2 text-sm text-foreground-secondary">
          <div className="text-foreground">
            <Logo />
          </div>
          <Heading className="sr-only">Foreign Exchange System</Heading>
          <dl className="ml-auto">
            <dt className="sr-only">Total currency number</dt>
            <dd>
              <Suspense
                fallback={
                  <LoadingPlaceholder
                    className="px-8"
                    text="loading total number of currencies"
                  />
                }
              >
                <CourencyCount />
              </Suspense>
            </dd>
          </dl>
          <BiIcon name="dot" />{" "}
          <dl>
            <dt>EOD</dt>
            <dd className="sr-only">End of the day</dd>
          </dl>{" "}
          <BiIcon name="dot" />
          <dl>
            <dt>ECB Data</dt>
            <dd className="sr-only">Europian Central Bank data</dd>
          </dl>
          <div className="ml-auto flex gap-4 items-center">{children}</div>
        </div>
      </header>
      <LiveMarket />
    </>
  );
};
