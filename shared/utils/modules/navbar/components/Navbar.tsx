import { Suspense } from "react";
import { NavbarProps } from "../types";
import { options } from "../utils";
import { Badge } from "./Badge";
import { MobileNavbar } from "./MobileNavbar";
import { OptionMenue } from "./OptionMenue";

export const Navbar = async (props: NavbarProps) => {
  return (
    <>
      <nav className="hidden sm:block p-4">
        <ul className="flex uppercase border-b border-background-secondary">
          {options.map(async (text) => (
            <Suspense key={text}>
              <OptionMenue text={text}>
                <Suspense>
                  {props[text].badge && <Badge value={props[text].badge} />}
                </Suspense>
              </OptionMenue>
            </Suspense>
          ))}
        </ul>
      </nav>
      <MobileNavbar {...props} />
    </>
  );
};
