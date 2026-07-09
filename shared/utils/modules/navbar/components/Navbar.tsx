import { Suspense } from "react";
import { NavbarProps } from "../types";
import { options } from "../utilis";
import { MobileNavbar } from "./MobileNavbar";
import { NavLink } from "./Navlink";

export const Navbar = (props: NavbarProps) => {
  return (
    <>
      <nav className="hidden">
        <ul>
          {options.map(async (text) => (
            <li key={text}>
              <Suspense>
                <NavLink badge={await props[text].badge} text={text} />
              </Suspense>
            </li>
          ))}
        </ul>
      </nav>
      <MobileNavbar {...props} />
    </>
  );
};
