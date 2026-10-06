import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
export default function Example() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-sm h-screen">
      <h1 className="text-4xl font-bold text-base-content md:text-5xl">
        404 Not Found
      </h1>
      <p className="max-w-lg text-center text-base-content/70 md:text-xl">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <Link
        href="/"
        className="btn btn-primary mt-10 rounded-full flex justify-center items-center"
      >
        Back to Home
        <SquareArrowOutUpRight className="mr-2 h-5 w-5" />
      </Link>
    </div>
  );
}
