interface ApplicationStatusLabels {
  pending: string;
  approved: string;
  rejected: string;
}

interface WhitelistQuestion {
  id: string;
  label: string;
  style: "short" | "paragraph";
  required?: boolean;
}

interface Config {
  serverName: string;
  mainColour: string;
  domain: string;
  allowedRoleIds: string[];
  discordServerUrl: string;
  applicationStatusLabel: ApplicationStatusLabels;
  whitelistQuestions: WhitelistQuestion[];
  adminsConfig: Admin[];
}

export interface Admin {
  name: string;
  rank: string;
  discordId: string;
}

export const config: Config = {
  serverName: "Listguard",
  mainColour: "#9900ff",
  domain: "localhost:2877",
  allowedRoleIds: ["1549155771764318208"],
  discordServerUrl: "",
  applicationStatusLabel: {
    pending: "oczekujące",
    approved: "zaakceptowane",
    rejected: "odrzucone",
  },
  whitelistQuestions: [
    {
      id: "1",
      label: "Testowe pytanie",
      style: "short",
      required: true,
    },
  ],
  adminsConfig: [
    { name: "Alvv", rank: "Właściciel", discordId: "993852447166582847" },
    { name: "Alvv", rank: "Developer", discordId: "993852447166582847" },
  ],
};
