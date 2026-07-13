export const Badge = async ({ value }: { value?: Promise<number> }) => {
  if (!value) return null;

  return <span>{await value}</span>;
};
