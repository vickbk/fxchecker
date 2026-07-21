"use client";
import { use } from "react";

export const Badge = ({ value }: { value: Promise<number | null> }) => {
  const badge = use(value);
  if (badge === null) return null;
  return (
    <span className="text-sm text-lime-500 bg-lime-500/20 rounded-full px-1">
      {badge}
    </span>
  );
};
