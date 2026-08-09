import Image from "next/image";
import { getCurrencyCountry } from "../utils/country";

export const Flag = ({
  src,
  alt,
  currency,
  country = currency ? getCurrencyCountry(currency) : undefined,
}: {
  country?: string;
  src?: string;
  currency?: string;
  alt: string;
}) => {
  const url =
    country && country === "un"
      ? "/globe.svg"
      : country
        ? `https://flagcdn.com/${country}.svg`
        : src;
  return (
    <Image
      width={20}
      height={20}
      className="aspect-square object-cover rounded-full"
      src={url ?? "/globe.svg"}
      alt={alt}
      loading="eager"
    />
  );
};
