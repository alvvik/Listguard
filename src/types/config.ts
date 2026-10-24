export interface ApplicationStatusLabels {
  pending: string;
  approved: string;
  rejected: string;
}

export interface WhitelistQuestion {
  id: string;
  label: string;
  style: "short" | "paragraph";
  required?: boolean;
}

export interface Admin {
  name: string;
  rank: string;
  discordId: string;
}

export interface Config {
  serverName: string;
  mainColour: string;
  domain: string;
  connectLink: string;
  allowedRoleIds: string[];
  discordServerUrl: string;
  applicationStatusLabel: ApplicationStatusLabels;
  whitelistQuestions: WhitelistQuestion[];
  adminsConfig: Admin[];
}
