import Link from "next/link";

export const Navbar = () => {
  const options = ["history", "compare", "favorites", "logs"];
  return (
    <nav>
      <ul>
        {options.map((text) => (
          <li key={text}>
            <Link href={`/${text === "history" ? "" : text}`}>{text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
