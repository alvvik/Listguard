"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserDetailsModal from "./UserDetailsModal";
import { updateApplicationStatus } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";

type User = {
  id: number;
  discordId: string | null;
  username: string | null;
  createdAt: string | Date | null;
  status: string;
  answers: string | null;
};

export default function ApplicationTable({
  data,
  statusLabels,
}: {
  data: User[];
  statusLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const updateStatus = async (
    discordId: string,
    newStatus: string,
  ): Promise<boolean> => {
    setLoadingStatus(discordId);
    try {
      const result = await updateApplicationStatus(discordId, newStatus);

      if (
        result &&
        typeof result === "object" &&
        "error" in result &&
        result.error
      ) {
        throw new Error(String(result.error));
      }

      router.refresh();
      return true;
    } catch (error) {
      toast.error("Wystąpił błąd podczas zmiany statusu.");
      return false;
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <div className="card bg-base-100 shadow w-full overflow-x-auto">
      {selectedUser && (
        <UserDetailsModal
          user={{
            discordId: selectedUser.discordId ?? "",
            username: selectedUser.username ?? "Nieznany",
            status: selectedUser.status,
            answers: selectedUser.answers,
          }}
          statusLabels={statusLabels}
          onUpdateStatus={updateStatus}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          isLoading={loadingStatus === selectedUser.discordId}
        />
      )}
      <div>
        <h2 className="card-title p-4 pb-0">Ostatnie podania</h2>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th className="border-b border-base-300 p-3 text-left">ID</th>
            <th className="border-b border-base-300 p-3 text-left">
              Discord ID
            </th>
            <th className="border-b border-base-300 p-3 text-left">Username</th>
            <th className="border-b border-base-300 p-3 text-left">
              Created At
            </th>
            <th className="border-b border-base-300 p-3 text-left">Status</th>
            <th className="border-b border-base-300 p-3 text-left">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id} className="hover">
              <td className="border-b border-base-200 p-3">{user.id}</td>
              <td className="border-b border-base-200 p-3">
                {user.discordId ?? "-"}
              </td>
              <td className="border-b border-base-200 p-3">
                {user.username ?? "-"}
              </td>
              <td className="border-b border-base-200 p-3">
                {user.createdAt ? formatDate(user.createdAt) : "-"}
              </td>
              <td className="border-b border-base-200 p-3">
                {statusLabels[user.status] ?? user.status}
              </td>
              <td className="border-b border-base-200 p-3">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Szczegóły
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-base-content/60">
                Brak danych do wyświetlenia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
