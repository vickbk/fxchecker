import { Heading, Section } from "@/shared/heading";
import { Actions } from "./Actions";
import { CompareCurreny } from "./CompareCurreny";

export const MainCompare = () => {
  return (
    <Section aria-describedby="compare-description">
      <Heading id="compare-heading">
        Compare Multi-Currencies 1000 FROM USD
      </Heading>
      <Actions />
      <ul>
        <CompareCurreny />
      </ul>
    </Section>
  );
};
