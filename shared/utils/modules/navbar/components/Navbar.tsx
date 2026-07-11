import { Suspense } from "react";
import { NavbarProps } from "../types";
import { options } from "../utilis";
import { MobileNavbar } from "./MobileNavbar";
import { NavLink } from "./Navlink";

export const Navbar = (props: NavbarProps) => {
  return (
    <>
      <nav className="hidden sm:block p-4">
        <ul className="flex uppercase border-b border-background-secondary">
          {options.map(async (text) => (
            <li
              key={text}
              className="p-4 border-b-2 border-transparent hover:border-lime-500"
            >
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
