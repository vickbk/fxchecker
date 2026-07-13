export const LoadingPlaceholder = ({
  className = "py-10",
  text,
}: {
  className?: string;
  text?: string;
}) => {
  return (
    <div className={`${className} animate-pulse`}>
      <span className="sr-only">{text}</span>
    </div>
  );
};
