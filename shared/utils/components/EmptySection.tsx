import { ReactNode } from "react";

export const EmptySection = ({
  heading,
  text,
  children,
}: {
  heading: string;
  text: string;
  children?: ReactNode;
}) => {
  const sectionid = crypto.randomUUID();
  return (
    <section
      aria-describedby={sectionid}
      className="text-center max-w-xl mx-auto pt-12 pb-24"
    >
      <h2 className="font-semibold text-3xl" id={sectionid}>
        {heading}
      </h2>
      <p className="text-foreground-secondary mt-8">{text}</p>
      {children}
    </section>
  );
};
