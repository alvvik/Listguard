import { Metadata } from "next";
export const metadata: Metadata = {
  title: `Whitelist`,
  description:
    "Strona whitelist ${config.serverName}. Zaloguj się, aby wypełnić formularz whitelist i dołączyć do serwera.",
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
