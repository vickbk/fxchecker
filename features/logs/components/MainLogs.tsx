import { Heading } from "@/shared/heading";
import { SectionsWrapper } from "@/shared/utils";
import { Actions } from "./Actions";
import { LogCard } from "./LogCard";

export const MainLogs = () => {
  return (
    <SectionsWrapper sectionId="logs-header">
      <Heading id="logs-header">Conversion Log</Heading>
      <Actions />
      <ul className="w-full">
        <LogCard />
      </ul>
    </SectionsWrapper>
  );
};
