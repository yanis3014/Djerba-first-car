"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CarFront,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCar } from "@/app/actions/cars";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import type { Car } from "@/lib/types";

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);
}

function formatAddedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const statusLabel: Record<string, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

type StatusFilterValue = "all" | Car["status"];

function SortHeader({
  column,
  children,
  className,
}: {
  column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc?: boolean) => void };
  children: React.ReactNode;
  className?: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn(
        "inline-flex items-center gap-1 font-medium hover:text-[var(--color-text)]",
        sorted ? "text-[var(--color-text)]" : "text-[var(--color-muted)]",
        className,
      )}
    >
      {children}
      {sorted === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
      ) : sorted === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
      )}
    </button>
  );
}

export function VoituresAdminTable({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteTarget, setDeleteTarget] = useState<Car | null>(null);
  const [pending, startTransition] = useTransition();

  const columns = useMemo<ColumnDef<Car>[]>(
    () => [
      {
        id: "image",
        header: () => <span className="sr-only">Aperçu</span>,
        cell: ({ row }) => {
          const car = row.original;
          const thumb = car.cover_image || car.images?.[0];
          return (
            <div className="relative h-[60px] w-[60px] overflow-hidden rounded-lg bg-[var(--color-bg-alt)]">
              {thumb ? (
                <Image src={thumb} alt="" fill className="object-cover" sizes="60px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[var(--color-muted)]">
                  <CarFront className="h-6 w-6" />
                </div>
              )}
            </div>
          );
        },
        enableSorting: false,
        enableGlobalFilter: false,
      },
      {
        id: "vehicle",
        accessorFn: (row) => `${row.brand} ${row.model}`,
        header: "Véhicule",
        cell: ({ row }) => {
          const car = row.original;
          return (
            <div>
              <div className="font-medium text-[var(--color-text)]">
                {car.brand} {car.model}
              </div>
              <div className="text-xs text-[var(--color-muted)]">{car.year}</div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <SortHeader column={column}>
            <span>Prix</span>
          </SortHeader>
        ),
        cell: ({ row }) => <span className="whitespace-nowrap">{formatPrice(row.original.price)}</span>,
      },
      {
        accessorKey: "status",
        header: "Statut",
        filterFn: (row, _columnId, value: StatusFilterValue | undefined) => {
          if (value == null || value === "all") return true;
          return row.original.status === value;
        },
        cell: ({ row }) => (
          <span className="rounded-full bg-[var(--color-bg-alt)] px-2 py-0.5 text-xs">
            {statusLabel[row.original.status] ?? row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "views",
        header: "Vues",
        cell: ({ row }) => <span className="text-[var(--color-muted)]">{row.original.views}</span>,
        enableSorting: false,
      },
      {
        id: "featured",
        accessorKey: "is_featured",
        header: "Vedette",
        cell: ({ row }) => (
          <Star
            className={`h-5 w-5 ${row.original.is_featured ? "fill-amber-400 text-amber-400" : "text-[var(--color-muted)]"}`}
            aria-label={row.original.is_featured ? "En vedette" : "Pas en vedette"}
          />
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <SortHeader column={column}>
            <span>Ajout</span>
          </SortHeader>
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-[var(--color-muted)]">{formatAddedAt(row.original.created_at)}</span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const car = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)]"
                  aria-label={`Actions pour ${car.brand} ${car.model}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/voitures/${car.id}`} className="flex cursor-pointer items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Éditer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/voitures/${car.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Voir sur le site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/40"
                  onSelect={() => setDeleteTarget(car)}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableGlobalFilter: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: cars,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue ?? "").trim().toLowerCase();
      if (!q) return true;
      const c = row.original;
      return `${c.brand} ${c.model}`.toLowerCase().includes(q);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const statusColumn = table.getColumn("status");
  const statusFilter = (statusColumn?.getFilterValue() as StatusFilterValue | undefined) ?? "all";

  function setStatusFilter(value: StatusFilterValue) {
    if (value === "all") {
      statusColumn?.setFilterValue(undefined);
    } else {
      statusColumn?.setFilterValue(value);
    }
    table.setPageIndex(0);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    startTransition(async () => {
      try {
        await deleteCar(id);
        setDeleteTarget(null);
        toast.success("Véhicule supprimé", { description: "Le véhicule a été retiré du catalogue." });
        router.refresh();
      } catch (e) {
        toast.error("Suppression impossible", {
          description: e instanceof Error ? e.message : "Une erreur est survenue.",
        });
      }
    });
  }

  const rowCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="w-full max-w-md space-y-1.5">
          <label htmlFor="car-search" className="text-xs font-medium text-[var(--color-muted)]">
            Recherche
          </label>
          <Input
            id="car-search"
            type="search"
            value={globalFilter ?? ""}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
            placeholder="Marque ou modèle…"
            autoComplete="off"
          />
        </div>
        <div className="flex w-full min-w-[12rem] max-w-xs flex-col gap-1.5">
          <label htmlFor="car-status-filter" className="text-xs font-medium text-[var(--color-muted)]">
            Statut
          </label>
          <select
            id="car-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilterValue)}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="sold">Vendu</option>
            <option value="reserved">Réservé</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-3 font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--color-border)] last:border-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rowCount === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-[var(--color-muted)]">
            <CarFront className="h-10 w-10 opacity-50" />
            <p className="text-sm">Aucun véhicule ne correspond à vos critères.</p>
          </div>
        ) : null}
      </div>

      {rowCount > 0 ? (
        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--color-muted)]">
            {pagination.pageIndex * pagination.pageSize + 1}–{Math.min((pagination.pageIndex + 1) * pagination.pageSize, rowCount)}{" "}
            sur {rowCount}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <span className="whitespace-nowrap">Lignes</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                  table.setPageIndex(0);
                }}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm text-[var(--color-text)]"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Précédent
              </Button>
              <span className="text-sm text-[var(--color-muted)]">
                Page {pagination.pageIndex + 1} / {Math.max(pageCount, 1)}
              </span>
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce véhicule ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  Cette action supprimera définitivement <strong className="text-[var(--color-text)]">{deleteTarget.brand}</strong>{" "}
                  <strong className="text-[var(--color-text)]">{deleteTarget.model}</strong> ainsi que ses images sur Cloudinary. Elle
                  est irréversible.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Annuler</AlertDialogCancel>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={pending}
              onClick={confirmDelete}
            >
              {pending ? "Suppression…" : "Supprimer"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
