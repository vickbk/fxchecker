import { SROnly } from "@/shared/utils";

export const Menue = () => {
  const timePeriods = [
    ["1D", "One day"],
    ["1W", "One week"],
    ["1M", "One month"],
    ["3M", "Three months"],
    ["1Y", "One Year"],
    ["5Y", "Five years"],
  ];
  return (
    <ul>
      {timePeriods.map(([key, text]) => (
        <li key={key}>
          <SROnly>{text}</SROnly>
          {key}
        </li>
      ))}
    </ul>
  );
};
