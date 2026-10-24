import Image from "next/image";
import Link from "next/link";
import background from "../../../public/background.jpg";
import { config } from "../../../config";
import { Parallax } from "./Parallax";
import ConnectBox from "./ConnectBox";

export default function Hero() {
  return (
    <section className="hero min-h-screen overflow-hidden relative">
      <Image
        src={background}
        alt=""
        aria-hidden="true"
        fill
        quality="10"
        placeholder="blur"
        className="object-cover md:hidden"
        sizes="100vw"
        loading="lazy"
      />
      <Parallax className="absolute inset-0 h-full w-full hidden md:block">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={background}
            alt=""
            aria-hidden="true"
            fill
            quality="10"
            placeholder="blur"
            className="object-cover"
            sizes="100vw"
            loading="lazy"
          />
        </div>
      </Parallax>
      <div className="hero-overlay absolute inset-0 bg-black/50" />

      <div className="hero-content relative z-10 text-neutral-content text-center">
        <div className="max-w-md w-full flex flex-col items-center">
          <h1 className="mb-5 text-5xl font-bold">{config.serverName}</h1>
          <p className="mb-6">
            Pełna integracja Discorda ze stroną WWW i landing page. Open Source,
            bez ukrytych opłat i z pełną kontrolą nad kodem.
          </p>
          <div className="flex flex-col gap-4 w-full items-center">
            <Link className="btn btn-primary w-full" href={"/whitelist"}>
              Aplikuj na whitelist!
            </Link>
            <ConnectBox />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
