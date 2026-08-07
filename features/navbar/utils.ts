export const options = ["history", "compare", "favorites", "logs"] as const;

export function closeDialog(node: HTMLElement | null) {
  if (node) {
    node.addEventListener("click", handleMenue);
    return () => node.removeEventListener("click", handleMenue);
  }
}

const handleMenue = () => {
  const dialog = document.getElementById("mobile-menue") as HTMLDialogElement;
  dialog?.hidePopover();
};
