import Link from "next/link";
import { config } from "../../../config";

interface listElement {
  id: number;
  name: string;
  href: string;
}
const elements: listElement[] = [
  {
    id: 0,
    name: "Aplikuj na whiteliste",
    href: "whitelist",
  },
  {
    id: 0,
    name: "Wejdź na naszego discorda!",
    href: config.discordServerUrl,
  },
];
export default function Navbar() {
  return (
    <>
      <div className="max-lg:collapse bg-base-200 lg:mb-48 shadow-sm w-full rounded-md">
        <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
        <label
          htmlFor="navbar-1-toggle"
          className="fixed inset-0 hidden max-lg:peer-checked:block"
        ></label>
        <div className="collapse-title navbar">
          <div className="navbar-start">
            <label
              htmlFor="navbar-1-toggle"
              className="btn btn-ghost lg:hidden"
            >
              <svg
                aria-label="Menu"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>

            <button className="btn btn-ghost text-xl">Listguard</button>
          </div>
          <div className="navbar-end hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {elements.map((item) => (
                <li key={item.id}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="collapse-content lg:hidden z-1">
          <ul className="menu w-full">
            {elements.map((item) => (
              <li key={item.id} className="border-b bg-base-200/30">
                <Link href={item.href}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
