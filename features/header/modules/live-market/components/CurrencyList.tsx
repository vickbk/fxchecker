export const CurrencyList = ({
  duplicate = false,
}: {
  duplicate?: boolean;
}) => {
  return (
    <div className="pr-4" aria-hidden={duplicate}>
      CurrencyList
    </div>
  );
};
