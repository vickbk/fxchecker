"use client";

import { HTMLAttributes } from "react";

function openDialog(this: HTMLButtonElement) {
  const popoverid = this.getAttribute("popovertarget");
  if (!popoverid) return;
  const popover = document.getElementById(popoverid);
  (popover as HTMLDialogElement)?.showModal();
}
function handleDialog(node: HTMLButtonElement | null) {
  if (node) {
    node.addEventListener("click", openDialog);

    return () => node.removeEventListener("click", openDialog);
  }
}
export const DialogOpener = ({
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button type="button" {...props} ref={handleDialog}>
      {children}
    </button>
  );
};
