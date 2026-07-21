import { Suspense } from "react";
import { NavbarProps } from "../types";
import { options } from "../utils";
import { Badge } from "./Badge";
import { MobileCurrent } from "./MobileCurrent";
import { MobileOption } from "./MobileOption";

export const MobileNavbar = async (props: NavbarProps) => {
  return (
    <div className="p-4 uppercase relative sm:hidden">
      <button
        type="button"
        popoverTarget="mobile-menue"
        className="bg-background-secondary w-full flex justify-between p-4 rounded-lg uppercase [anchor-name:--my-btn]"
      >
        <MobileCurrent /> <i className="bi bi-chevron-down ml-auto" />
      </button>
      <nav
        popover=""
        id="mobile-menue"
        className="bg-background-secondary text-foreground inset-auto [position-anchor:--my-btn] [position-area:bottom_span-right] [position-try:flip-block] w-[anchor-size(width)] mt-4 rounded-lg"
      >
        <ul className="p-4 grid gap-4">
          {options.map(async (option) => (
            <MobileOption key={option} text={option}>
              <Suspense>
                <Badge value={props[option].badge} />
              </Suspense>
            </MobileOption>
          ))}
        </ul>
      </nav>
    </div>
  );
};
