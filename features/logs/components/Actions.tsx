import { BiIcon, SROnly } from "@/shared/utils";

export const Actions = ({ count }: { count: number }) => {
  return (
    <>
      <p className="text-foreground-secondary">
        {count} Logged <SROnly>Currenc{count > 1 ? "ies" : "y"}</SROnly>
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
