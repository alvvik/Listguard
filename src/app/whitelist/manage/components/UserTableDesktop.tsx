"use client";

import { useMemo } from "react";
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
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.status))).filter(Boolean);
  }, [data]);

  const columns: ColumnDef<typeof features, User>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        sortFn: "alphanumeric",
        filterFn: "includesString",
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
    ],
    [],
  );

  const table = useTable({
    key: "user-table",
    features,
    columns,
    data,
  });

  return (
    <div className="w-full overflow-x-auto">
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

                    {header.column.id === "status" ? (
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
