"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Session } from "next-auth";

interface LoginStepProps {
  session: Session | null;
  onContinue: () => void;
}
export function LoginStep({ session, onContinue }: LoginStepProps) {
  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (!session) return;
        onContinue();
      }}
    >
      {!session ? (
        <div className="space-y-3 text-center">
          <p className="text-base-content/70 text-sm">
            Witamy w formularzu whitelisty, aby rozpocząć proces musisz
            zalogować się przez discorda
          </p>
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={async () => {
              try {
                await signIn("discord");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Login with Discord
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-base-200 p-4 rounded-lg w-full">
            <div className="flex items-center gap-3">
              <Image
                src={session.user.image}
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
        </div>
      )}
    </form>
  );
}
