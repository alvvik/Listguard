import { db } from "@/db/index";
import { users, applications } from "@/db/schema";

import { eq } from "drizzle-orm";
import UserTableDesktop from "../components/UserTableDesktop";
import UserTableMobile from "../components/UserTableMobile";
import { config } from "../../../../../config";
export default async function Page() {
  const dbData = await db
    .select({
      id: applications.id,
      status: applications.status,
      answers: applications.answers,
      createdAt: applications.createdAt,
      username: users.username,
      discordId: users.discordId,
    })
    .from(applications)
    .innerJoin(users, eq(applications.userId, users.id));
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Zarządzanie podaniami</h1>
      <div className="hidden md:block">
        <UserTableDesktop
          data={dbData}
          statusLabels={{ ...config.applicationStatusLabel }}
        />
      </div>
      <div className="md:hidden">
        <UserTableMobile
          data={dbData}
          statusLabels={{ ...config.applicationStatusLabel }}
        />
      </div>
    </div>
  );
}
