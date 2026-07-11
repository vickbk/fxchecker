export const LoadingPlacehoder = ({
  className = "py-10",
  text,
}: {
  className?: string;
  text?: string;
}) => {
  return <div className={`${className} animate-pulse`}>{text}</div>;
};
