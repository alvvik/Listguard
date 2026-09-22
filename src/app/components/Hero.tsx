import Image from "next/image";
import Link from "next/link";
import background from "@/app/public/background.jpg";
import { config } from "../../../config";
export default function Hero() {
  return (
    <section className="hero relative min-h-screen overflow-hidden">
      <Image
        src={background}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="hero-overlay absolute inset-0 bg-black/50" />

      <div className="hero-content relative z-10 text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">{config.serverName}</h1>
          <p className="mb-5">
            Pełna integracja Discorda ze stroną WWW i landing page. Open Source,
            bez ukrytych opłat i z pełną kontrolą nad kodem.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
            <Link
              className="btn btn-primary w-full md:w-auto"
              href={"/whitelist"}
            >
              Aplikuj na whitelist!
            </Link>
            <Link
              className="btn btn-secondary w-full md:w-auto"
              href={config.connectLink}
            >
              Dołącz na serwer!
            </Link>
            <Link
              className="btn w-full md:w-auto"
              href={"https://github.com/alvvik"}
            >
              Github
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
