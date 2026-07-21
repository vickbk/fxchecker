"use client";
import { useActiveOption } from "../hooks";

export const MobileCurrent = () => {
  const { text } = useActiveOption();
  return <>{text}</>;
};
