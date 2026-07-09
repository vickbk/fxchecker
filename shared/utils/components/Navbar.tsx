import { Suspense } from "react";
import { NavbarProps } from "../types/navbar";
import { LoadingPlacehoder } from "./LoadingPlaceholder";
import { NavLink } from "./Navlink";

const options = ["history", "compare", "favorites", "logs"] as const;

export const Navbar = (props: NavbarProps) => {
  return (
    <nav>
      <ul>
        {options.map(async (text) => (
          <li key={text}>
            <Suspense fallback={<LoadingPlacehoder className="" />}>
              <NavLink badge={await props[text].badge} text={text} />
            </Suspense>
          </li>
        ))}
      </ul>
    </nav>
  );
};
