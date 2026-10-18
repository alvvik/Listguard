import { users, applications } from "@/db/schema";
import { config } from "../../../../config";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import ApplicationTable from "./components/ApplicationTable";
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

  const statusLabels: Record<string, string> = {
    ...config.applicationStatusLabel,
  };

  const applicationsCountByStatus = dbData.reduce(
    (acc, app) => {
      acc[app.status as keyof typeof statusLabels]++;
      return acc;
    },
    {
      pending: 0,
      approved: 0,
      rejected: 0,
    } as Record<keyof typeof statusLabels, number>,
  );

  return (
    <div className="flex flex-col gap-4 p-4 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Wszystkie podania:</div>
          <div className="stat-value text-primary">{dbData.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Podania: oczekujące</div>
          <div className="stat-value text-primary">
            {applicationsCountByStatus.pending}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Podania: zaakceptowane</div>
          <div className="stat-value text-success">
            {applicationsCountByStatus.approved}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Podania: odrzucone</div>
          <div className="stat-value text-error">
            {applicationsCountByStatus.rejected}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 min-w-0">
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0 sm:p-4">
            <h2 className="card-title p-4 pb-0">Użytkownicy</h2>
            <div className="overflow-x-auto w-full">
              <table className="table table-auto w-full min-w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nazwa</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dbData.slice(-5).map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{statusLabels[u.status] ?? u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ApplicationTable data={dbData ?? []} statusLabels={statusLabels} />
      </div>
    </div>
  );
}
