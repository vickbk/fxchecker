import { Heading, Section } from "@/shared/heading";
import { Actions } from "./Actions";
import { LogCard } from "./LogCard";

export const MainLogs = () => {
  return (
    <Section aria-describedby="logs-header">
      <Heading id="logs-header">Conversion Log</Heading>
      <Actions />
      <ul>
        <LogCard />
      </ul>
    </Section>
  );
};
