import { BiIcon, SROnly } from "@/shared/utils";

export const Actions = () => {
  return (
    <>
      <p className="text-foreground-secondary">
        8 Logged <SROnly>Currencies</SROnly>
      </p>
      <button
        type="button"
        className="bg-card text-foreground-secondary p-2 rounded-lg"
      >
        Export to CSV <BiIcon name="folder" />
      </button>
      <button
        type="button"
        className="bg-card text-foreground-secondary p-2 rounded-lg"
      >
        <SROnly>Clear All</SROnly> <BiIcon name="trash" />
      </button>
    </>
  );
};
