import Image from "next/image";

export const Flag = ({ src, alt }: Record<"src" | "alt", string>) => {
  return (
    <Image
      width={20}
      height={20}
      className="aspect-square object-cover rounded-full"
      src={src}
      alt={alt}
    />
  );
};
