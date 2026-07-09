import { Article, Heading } from "@/shared/heading";
import { Graph } from "./Graph";
import { Menue } from "./Menue";
import { Summary } from "./Summary";

export const MainHistory = () => {
  return (
    <Article className="p-4">
      <Heading className="sr-only">Chart history for USD to EUR</Heading>
      <div className="flex flex-col gap-4">
        <Summary />
        <Menue />
      </div>
      <Graph />
    </Article>
  );
};
