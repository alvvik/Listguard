import { House } from "lucide-react";
import Link from "next/link";
const items: {
  id: number;
  icon: React.ReactNode;
  label: string;
  href: string;
}[] = [
  {
    id: 0,
    icon: <House className="my-1.5 inline-block size-4 shrink-0" />,
    label: "Dashboard",
    href: "/whitelist/manage",
  },
];

export default function Sidebar() {
  return (
    <div className="drawer-side z-30 h-full">
      <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

      <div className="flex h-full flex-col items-start bg-base-200 w-64 md:w-64 transition-all duration-300">
        <ul className="menu w-full grow px-2 py-4 gap-1">
          {items.map((item) => (
            <li key={item.id} className="w-full">
              <Link
                href={item.href}
                className="flex items-center gap-4 w-full overflow-hidden whitespace-nowrap"
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
