import { Heading } from "@/shared/heading";
import { SectionsWrapper } from "@/shared/utils";
import { getLogs } from "../utils";
import { Actions } from "./Actions";
import { EmptyLogs } from "./EmptyLogs";
import { LogCard } from "./LogCard";

export const MainLogs = async () => {
  const logs = await getLogs();
  const count = logs.length;
  if (count === 0) return <EmptyLogs />;

  return (
    <SectionsWrapper sectionId="logs-header">
      <Heading id="logs-header">Conversion Log</Heading>
      <Actions count={count} />
      <ul className="w-full">
        {logs.map(({ id, data, editTime }) => (
          <LogCard key={id} {...{ id, data: data!, editTime }} />
        ))}
      </ul>
    </SectionsWrapper>
  );
};
