import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function UserLogOut() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-base-200 p-4 rounded-lg w-full">
      <div className="flex items-center gap-3">
        <Image
          src={session.user.image ?? "/default-avatar.png"}
          alt="Zdjecie użytkownika"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{session.user.name}</p>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => signOut()}
      >
        Wyloguj się
      </button>
    </div>
  );
}
