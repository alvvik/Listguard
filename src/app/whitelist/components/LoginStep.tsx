"use client";

import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import UserLogOut from "./UserLogout";

interface LoginStepProps {
  session: Session | null;
  onContinue: () => void;
}
export function LoginStep({ session, onContinue }: LoginStepProps) {
  const handleSignIn = async () => {
    try {
      await signIn("discord");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;
    onContinue();
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      {!session ? (
        <div className="space-y-3 text-center">
          <p className="text-base-content/70 text-sm">
            Witamy w formularzu whitelisty, aby rozpocząć proces musisz
            zalogować się przez discorda
          </p>
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={handleSignIn}
          >
            Login with Discord
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <UserLogOut />
        </div>
      )}
    </form>
  );
}
