export const Badge = async ({ value }: { value?: Promise<number> }) => {
  if (!value) return null;

  return (
    <span className="text-sm text-lime-500 bg-lime-500/20 rounded-full px-1">
      {await value}
    </span>
  );
};
