"use client";
import { SROnly } from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import { useTime } from "../hooks";

export const LogTime = ({ time }: { time: string }) => {
  const timeObj = new Date(time);
  const timeMs = timeObj.getTime();
  const { display } = useTime(timeMs, { short: true, limit: "1M" });
  const long = useTime(timeMs);
  return (
    <time dateTime={timeObj.toUTCString()}>
      <SRHidden className="text-foreground-secondary uppercase">
        {display}
      </SRHidden>{" "}
      <SROnly>{long.display}</SROnly>
    </time>
  );
};
