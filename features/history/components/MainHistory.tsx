import { Article, Heading } from "@/shared/heading";
import { Graph } from "./Graph";
import { Menue } from "./Menue";
import { Summary } from "./Summary";

export const MainHistory = () => {
  return (
    <Article className="p-4 flex flex-col sm:flex-row flex-wrap gap-4 justify-between">
      <Heading className="sr-only">Chart history for USD to EUR</Heading>

      <Summary />
      <Menue />
      <Graph />
    </Article>
  );
};
