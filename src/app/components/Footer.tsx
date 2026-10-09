import Image from "next/image";
import background from "../../../public/background.jpg";
import { config } from "../../../config";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="w-full flex justify-center">
        <div className="relative flex gap-3 overflow-hidden w-full justify-center items-center h-64">
          <Image
            src={background}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-5 h-40 bg-linear-to-b from-background to-transparent" />
          <div className="relative z-10 flex gap-3 p-4 flex-col justify-center items-center">
            <h2 className="text-2xl font-bold">
              Dołącz do naszej społeczności już dziś!
            </h2>
            <p className="font-semibold text-sm">
              Złóż podanie na whitelist i dołącz do naszej społeczności
            </p>
            <Link href="/whitelist" className="btn">
              Aplikuj na whitelist
            </Link>
            <Link href={config.discordServerUrl} className="btn">
              Wejdź na naszego discorda
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full py-4 text-sm text-center text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} ListGuard. Wszelkie prawa
          zastrzeżone.
        </p>
        <p className="mt-2 flex flex-wrap justify-center gap-2">
          <Link href="/regulamin" className="hover:underline">
            Regulamin
          </Link>
          <span>•</span>
          <Link href="/polityka-prywatnosci" className="hover:underline">
            Polityka prywatności
          </Link>
          <span>•</span>
          <span>
            {config.domain} is not affiliated with or endorsed by Rockstar.
          </span>
        </p>
      </div>
    </footer>
  );
}
