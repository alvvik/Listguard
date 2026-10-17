import { users, applications } from "@/db/schema";
import { config } from "../../../../config";
import { formatDate } from "@/lib/utils";
import { db } from "@/db";
import { eq } from "drizzle-orm";
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

  const usersCountByStatus = dbData.reduce(
    (acc, user) => {
      acc[user.status as keyof typeof statusLabels]++;
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
          <div className="stat-title">Użytkownicy:</div>
          <div className="stat-value text-primary">
            {usersCountByStatus.pending}
          </div>
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

      <div className="grid grid-cols-1 gap-4 min-w-0">
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
                  {dbData.map((u) => (
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

        <div className="card bg-base-100 shadow">
          <div className="card-body p-0 sm:p-4">
            <h2 className="card-title p-4 pb-0">Aplikacje</h2>
            <div className="overflow-x-auto w-full">
              <table className="table table-auto w-full min-w-full">
                <thead>
                  <tr>
                    <th>Discord ID</th>
                    <th>Użytkownik</th>
                    <th>Created At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dbData.map((app) => (
                    <tr key={app.id}>
                      <td>{app.discordId}</td>
                      <td>{app.username}</td>
                      <td>{formatDate(app.createdAt)}</td>
                      <td>{statusLabels[app.status] ?? app.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
