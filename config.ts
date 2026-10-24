import { env } from "@/lib/env.client";
import { Config } from "@/types/config";

export * from "@/types/config";

export const config: Config = {
  serverName: "Listguard",
  mainColour: "#9900ff",
  domain: env.NEXT_PUBLIC_DOMAIN || "localhost:2877",
  connectLink: "connect 127.0.0.1:30120",
  allowedRoleIds: ["1549155771764318208"],
  discordServerUrl: "discord.gg/yourserver",
  applicationStatusLabel: {
    pending: "Oczekujące",
    approved: "Zaakceptowane",
    rejected: "Odrzucone",
  },
  whitelistQuestions: [
    {
      id: "1",
      label: "Testowe pytanie",
      style: "short",
      required: true,
    },
    {
      id: "2",
      label: "Testowe pytanie 2",
      style: "short",
      required: true,
    },
  ],
  adminsConfig: [
    { name: "Alvv", rank: "Właściciel", discordId: "993852447166582847" },
    { name: "Alvv", rank: "Developer", discordId: "993852447166582847" },
  ],
};
