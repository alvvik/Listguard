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
};
