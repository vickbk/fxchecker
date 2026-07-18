import Image from "next/image";

export const Flag = ({
  src,
  alt,
  country,
}: {
  country?: string;
  src?: string;
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
