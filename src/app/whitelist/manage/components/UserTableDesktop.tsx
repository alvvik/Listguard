"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UserDetailsModal from "./UserDetailsModal";
import { updateApplicationStatus } from "@/lib/actions";
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
  filterFn_includesString,
  sortFn_alphanumeric,
  sortFn_datetime,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { ListSortAscending, ListSortDescending } from "lucide-react";
import { toast } from "react-hot-toast";

type User = {
  id: number;
  discordId: string;
  username: string;
  createdAt: string;
  status: string;
  answers: string | null;
};

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
  },
  filterFns: {
    includesString: filterFn_includesString,

    dateFilter: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const cellValue = row.getValue(columnId) as string;
      if (!cellValue) return false;
      return cellValue.startsWith(filterValue);
    },

    exactFilter: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      return String(row.getValue(columnId)) === String(filterValue);
    },
  },
});

export default function UserTableDesktop({
  data,
  statusLabels,
}: {
  data: User[];
  statusLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.status))).filter(Boolean);
  }, [data]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

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
    } catch {
      toast.error("Wystąpił błąd podczas zmiany statusu.");
      return false;
    } finally {
      setLoadingStatus(null);
    }
  };

  const columns: ColumnDef<typeof features, User>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        sortFn: "alphanumeric",
        filterFn: "includesString",
        size: 30,
      },
      {
        accessorKey: "discordId",
        header: "Discord ID",
        filterFn: "includesString",
      },
      {
        accessorKey: "username",
        header: "Username",
        filterFn: "includesString",
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        sortFn: "datetime",
        filterFn: "dateFilter",
      },
      {
        accessorKey: "status",
        header: "Status",
        sortFn: "alphanumeric",
        filterFn: "exactFilter",
      },
      {
        id: "actions",
        header: "Akcje",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <button
              onClick={() => handleUserSelect(user)}
              className="btn btn-sm btn-outline btn-primary"
            >
              Szczegóły
            </button>
          );
        },
      },
    ],
    []
  );

  const table = useTable({
    key: "user-table",
    features,
    columns,
    data,
  });

  return (
    <div className="w-full overflow-x-auto">
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          statusLabels={statusLabels}
          onUpdateStatus={updateStatus}
          isOpen={!!selectedUser}
          onClose={handleCloseModal}
          isLoading={loadingStatus === selectedUser.discordId}
        />
      )}
      <table className="table w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-base-300 p-3 text-left align-middle"
                >
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      className={`flex items-center justify-between w-full text-left font-semibold text-sm select-none ${
                        header.column.getCanSort()
                          ? "cursor-pointer hover:opacity-80"
                          : "cursor-default"
                      }`}
                    >
                      <span className="truncate">
                        <table.FlexRender header={header} />
                      </span>

                      <span className="shrink-0 ml-1">
                        {{
                          asc: (
                            <ListSortAscending className="size-4 text-primary" />
                          ),
                          desc: (
                            <ListSortDescending className="size-4 text-primary" />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <span className="size-4 opacity-30 inline-block" />
                        )}
                      </span>
                    </button>

                    {header.column.id === "actions" ||
                    header.column.id === "id" ? null : header.column.id ===
                      "status" ? (
                      <select
                        value={(header.column.getFilterValue() ?? "") as string}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        className="select select-bordered select-sm w-full"
                      >
                        <option value="">Wszystkie statusy</option>
                        {uniqueStatuses.map((status) => {
                          return (
                            <option key={status} value={status}>
                              {statusLabels[status] || status}
                            </option>
                          );
                        })}
                      </select>
                    ) : header.column.id === "createdAt" ? (
                      <input
                        type="date"
                        value={(header.column.getFilterValue() ?? "") as string}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        className="input input-bordered input-sm w-full"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Szukaj..."
                        value={(header.column.getFilterValue() ?? "") as string}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        className="input input-bordered input-sm w-full"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => {
                let content;

                if (cell.column.id === "createdAt") {
                  content = formatDate(cell.getValue() as string);
                } else if (cell.column.id === "status") {
                  const rawStatus = cell.getValue() as string;
                  content = statusLabels[rawStatus] ?? rawStatus;
                } else {
                  content = <table.FlexRender cell={cell} />;
                }

                return (
                  <td key={cell.id} className="border-b border-base-200 p-2">
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
