import { Heading, Section } from "@/shared/heading";
import { SROnly } from "@/shared/utils";
import { Actions } from "./Actions";
import { CompareCurreny } from "./CompareCurreny";

export const MainCompare = () => {
  return (
    <Section aria-describedby="compare-description" className="p-4">
      <div className="flex flex-wrap rounded-lg p-4 gap-4 bg-background-secondary items-center justify-between">
        <Heading id="compare-heading" className="uppercase">
          <SROnly>Compare </SROnly>{" "}
          <span className="text-foreground-secondary"> Multi-Currencies</span>{" "}
          1000 FROM USD
        </Heading>
        <Actions />
        <ul className="w-full">
          <CompareCurreny />
        </ul>
      </div>
    </Section>
  );
};
