import Image from "next/image";
import { getCurrencyCountry } from "../utils/country";

export const Flag = ({ alt, currency }: { currency: string; alt: string }) => {
  const country = getCurrencyCountry(currency);
  const url =
    country === "un" ? "/globe.svg" : `https://flagcdn.com/${country}.svg`;
  return (
    <Image
      width={20}
      height={20}
      className="aspect-square object-cover rounded-full"
      src={url}
      alt={alt}
      loading="eager"
    />
  );
};
