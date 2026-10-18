"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UserDetailsModal from "./UserDetailsModal";
import { updateApplicationStatus } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { CalendarDays } from "lucide-react";

type User = {
  id: number;
  discordId: string;
  username: string;
  createdAt: string;
  status: string;
  answers: string | null;
};

type SortField = "id" | "username" | "createdAt";
type SortDirection = "asc" | "desc";

export default function UserTableMobile({
  data,
  statusLabels,
}: {
  data: User[];
  statusLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const updateStatus = async (
    discordId: string,
    newStatus: string
  ): Promise<boolean> => {
    setLoadingStatus(discordId);
    try {
      const result = await updateApplicationStatus(discordId, newStatus);

      if (result.error) {
        throw new Error(result.error);
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

  const visibleAndSortedData = useMemo(() => {
    const filtered = !selectedStatus
      ? data
      : data.filter((user) => user.status === selectedStatus);

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "id") {
        comparison = a.id - b.id;
      } else {
        comparison = a.username.localeCompare(b.username);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, selectedStatus, sortField, sortDirection]);

  return (
    <div className="w-full">
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          statusLabels={statusLabels}
          onUpdateStatus={updateStatus}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          isLoading={loadingStatus === selectedUser.discordId}
        />
      )}

      <div className="flex flex-col gap-3 mb-4 p-3 bg-base-200 rounded-lg">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-base-content/70">
            Filtruj po statusie:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select select-bordered select-sm w-full"
          >
            <option value="">Wszystkie statusy</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="divider my-0" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-base-content/70">
            Sortuj według:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="select select-bordered select-sm w-full"
            >
              <option value="createdAt">Daty</option>
              <option value="username">Nick</option>
              <option value="id">ID</option>
            </select>

            <select
              value={sortDirection}
              onChange={(e) =>
                setSortDirection(e.target.value as SortDirection)
              }
              className="select select-bordered select-sm w-full"
            >
              <option value="desc">Najnowsze / Z-A</option>
              <option value="asc">Najstarsze / A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {visibleAndSortedData.map((user) => (
          <div key={user.id} className="card bg-base-200 shadow-md">
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base-content">
                    {user.username}
                  </h3>
                  <p className="text-xs text-base-content/60">
                    ID: {user.id} | Discord: {user.discordId}
                  </p>
                </div>
                <span
                  className={`badge ${
                    user.status === "approved"
                      ? "badge-success"
                      : user.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                  } badge-sm`}
                >
                  {statusLabels[user.status] || user.status}
                </span>
              </div>

              <p className="text-xs text-base-content/60 mt-2">
                <CalendarDays className="size-5 inline-block mr-2" />
                {formatDate(user.createdAt)}
              </p>

              <div className="card-actions justify-end mt-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="btn btn-sm btn-primary"
                >
                  Szczegóły
                </button>
              </div>
            </div>
          </div>
        ))}

        {visibleAndSortedData.length === 0 && (
          <div className="text-center py-8 text-base-content/60">
            Brak podań spełniających kryteria.
          </div>
        )}
      </div>
    </div>
  );
}
