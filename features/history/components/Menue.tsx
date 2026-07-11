import { SROnly } from "@/shared/utils";
import Link from "next/link";

const timePeriods = [
  ["1D", "One day"],
  ["1W", "One week"],
  ["1M", "One month"],
  ["3M", "Three months"],
  ["1Y", "One Year"],
  ["5Y", "Five years"],
];

export const Menue = () => {
  return (
    <ul className="flex bg-background-secondary self-start rounded-lg md:self-center">
      {timePeriods.map(([key, text]) => (
        <li key={key}>
          <Link
            href={`?period=${key}`}
            className="p-2 hover:bg-card rounded-lg block"
          >
            <SROnly>{text}</SROnly>
            <span aria-hidden>{key}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
