import { BiIcon } from "@/shared/utils";

export const ChangeCard = ({
  isGoingUp,
  ratePercentage,
}: {
  isGoingUp: boolean;
  ratePercentage: string | null;
}) => {
  return (
    <span className={`flex ${isGoingUp ? "text-green-500" : "text-red-500"}`}>
      <BiIcon name={`caret-${isGoingUp ? "up" : "down"}-fill`} />
      {isGoingUp ? "+" : ""}
      {ratePercentage}%
    </span>
  );
};
