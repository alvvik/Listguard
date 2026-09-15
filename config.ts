interface ApplicationStatusLabels {
  pending: string;
  accepted: string;
  rejected: string;
}

interface Config {
  serverName: string;
  mainColour: string;
  domain: string;
  allowedRoleIds: string[];
  applicationStatusLabel: ApplicationStatusLabels;
}

export const config: Config = {
  serverName: "Listguard",
  mainColour: "#9900ff",
  domain: "localhost:2877",
  allowedRoleIds: ["1549155771764318208"],
  applicationStatusLabel: {
    pending: "oczekujące",
    accepted: "zaakceptowane",
    rejected: "odrzucone",
  },
};
