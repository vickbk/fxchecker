import { Suspense } from "react";
import { NavbarProps } from "../types";
import { options } from "../utilis";
import { NavLink } from "./Navlink";

export const MobileNavbar = async (props: NavbarProps) => {
  return (
    <div className="p-4 uppercase relative sm:hidden">
      <button
        type="button"
        popoverTarget="mobile-menue"
        className="bg-background-secondary w-full flex justify-between p-4 rounded-lg uppercase [anchor-name:--my-btn]"
      >
        History <i className="bi bi-chevron-down" />
      </button>
      <nav
        popover=""
        id="mobile-menue"
        className="bg-background-secondary text-foreground inset-auto [position-anchor:--my-btn] [position-area:bottom_span-right] [position-try:flip-block] w-[anchor-size(width)] mt-4 rounded-lg"
      >
        <ul className="p-4 grid gap-4">
          {options.map(async (text) => (
            <li className="p-4 rounded-lg bg-card" key={text}>
              <Suspense>
                <NavLink badge={await props[text].badge} text={text} />
              </Suspense>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
